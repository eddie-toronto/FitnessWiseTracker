import { useState, useEffect, useCallback } from "react";
import { WorkoutSession, ExerciseData, DEFAULT_WORKOUT_DATA } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export function useWorkout() {
  const { appUser } = useAuth();
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>("Ready");

  // Load saved session on mount
  useEffect(() => {
    const loadSession = async () => {
      if (!appUser) return;

      try {
        const response = await fetch(`/api/sessions/user/${appUser.id}`);
        if (response.ok) {
          const session = await response.json();
          if (session?.sessionData) {
            setCurrentSession(session.sessionData);
          }
        }
      } catch (error) {
        console.error("Error loading session:", error);
      }
    };

    loadSession();
  }, [appUser]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!currentSession || !appUser) return;

    const interval = setInterval(async () => {
      try {
        setSaveStatus("Saving...");
        await apiRequest("POST", "/api/sessions", {
          userId: appUser.id,
          sessionData: currentSession,
        });
        setSaveStatus("Saved");
        setTimeout(() => setSaveStatus("Ready"), 2000);
      } catch (error) {
        console.error("Auto-save error:", error);
        setSaveStatus("Error");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentSession, appUser]);

  const startWorkout = useCallback((workoutDay: 'A' | 'B' | 'C') => {
    const workoutData = DEFAULT_WORKOUT_DATA[`day${workoutDay}`];
    const session: WorkoutSession = {
      currentWorkout: workoutDay,
      currentExercise: 0,
      timerState: {
        running: false,
        elapsed: 0,
      },
      exercises: workoutData.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({ ...set, completedReps: 0, completed: false }))
      })),
      userId: appUser?.id,
    };
    setCurrentSession(session);
  }, [appUser]);

  const updateExercise = useCallback((exerciseIndex: number, updates: Partial<ExerciseData>) => {
    if (!currentSession) return;

    const updatedExercises = [...currentSession.exercises];
    updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], ...updates };
    
    setCurrentSession({
      ...currentSession,
      exercises: updatedExercises,
    });
  }, [currentSession]);

  const updateSet = useCallback((exerciseIndex: number, setIndex: number, completedReps: number) => {
    if (!currentSession) return;

    const updatedExercises = [...currentSession.exercises];
    const updatedSets = [...updatedExercises[exerciseIndex].sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      completedReps,
      completed: completedReps > 0,
    };
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: updatedSets,
    };

    setCurrentSession({
      ...currentSession,
      exercises: updatedExercises,
    });
  }, [currentSession]);

  const updateTimerState = useCallback((timerState: any) => {
    if (!currentSession) return;

    setCurrentSession({
      ...currentSession,
      timerState,
    });
  }, [currentSession]);

  const completeSet = useCallback((exerciseIndex: number, setIndex: number) => {
    if (!currentSession) return;

    const updatedExercises = [...currentSession.exercises];
    const updatedSets = [...updatedExercises[exerciseIndex].sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      completed: true,
    };
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: updatedSets,
    };

    setCurrentSession({
      ...currentSession,
      exercises: updatedExercises,
    });
  }, [currentSession]);

  const nextExercise = useCallback(() => {
    if (!currentSession) return;

    const nextIndex = Math.min(currentSession.currentExercise + 1, currentSession.exercises.length - 1);
    setCurrentSession({
      ...currentSession,
      currentExercise: nextIndex,
    });
  }, [currentSession]);

  const previousExercise = useCallback(() => {
    if (!currentSession) return;

    const prevIndex = Math.max(currentSession.currentExercise - 1, 0);
    setCurrentSession({
      ...currentSession,
      currentExercise: prevIndex,
    });
  }, [currentSession]);

  const completeWorkout = useCallback(async () => {
    if (!currentSession || !appUser) return;

    try {
      // Create workout record
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - currentSession.timerState.elapsed * 1000);
      
      await apiRequest("POST", "/api/workouts", {
        userId: appUser.id,
        workoutDay: currentSession.currentWorkout,
        startTime,
        endTime,
        duration: currentSession.timerState.elapsed,
        completed: true,
      });

      // Update user stats
      await apiRequest("PATCH", `/api/users/${appUser.id}`, {
        totalWorkouts: appUser.totalWorkouts + 1,
        currentStreak: appUser.currentStreak + 1,
      });

      // Clear session
      await apiRequest("DELETE", `/api/sessions/user/${appUser.id}`);
      setCurrentSession(null);
      
      setSaveStatus("Workout completed!");
    } catch (error) {
      console.error("Error completing workout:", error);
      setSaveStatus("Error saving workout");
    }
  }, [currentSession, appUser]);

  return {
    currentSession,
    saveStatus,
    startWorkout,
    updateExercise,
    updateSet,
    completeSet,
    nextExercise,
    previousExercise,
    completeWorkout,
    updateTimerState,
  };
}
