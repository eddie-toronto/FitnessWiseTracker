import { useEffect, useCallback } from "react";
import { DayBanner } from "@/components/DayBanner";
import { WorkoutBanner } from "@/components/WorkoutBanner";
import { useWorkout } from "@/hooks/useWorkout";
import { useTimer } from "@/hooks/useTimer";
import { DEFAULT_WORKOUT_DATA } from "@/lib/types";

interface WorkoutProps {
  workoutDay: 'A' | 'B' | 'C';
}

export function Workout({ workoutDay }: WorkoutProps) {
  const { currentSession, updateSet, completeSet, nextExercise, previousExercise, completeWorkout } = useWorkout();
  const { timerState, startTimer, pauseTimer, setTimerState } = useTimer();

  // Sync timer state with workout session
  useEffect(() => {
    if (currentSession?.timerState) {
      setTimerState(currentSession.timerState);
    }
  }, [currentSession?.timerState, setTimerState]);

  // Enhanced timer handlers that update the session
  const handleStartTimer = useCallback(() => {
    startTimer();
    // The timer state will be auto-saved via the workout hook
  }, [startTimer]);

  const handlePauseTimer = useCallback(() => {
    pauseTimer();
    // The timer state will be auto-saved via the workout hook
  }, [pauseTimer]);

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Active Workout</h2>
          <p className="text-gray-600">Start a workout from the dashboard to begin tracking.</p>
        </div>
      </div>
    );
  }

  const workoutData = DEFAULT_WORKOUT_DATA[`day${workoutDay}`];

  return (
    <div className="workout-view">
      <DayBanner
        workoutDay={workoutDay}
        title={workoutData.title}
        description={workoutData.focus}
        timerState={timerState}
        onStartTimer={handleStartTimer}
        onPauseTimer={handlePauseTimer}
        onCompleteWorkout={completeWorkout}
      />
      
      <WorkoutBanner
        exercises={currentSession.exercises}
        currentExercise={currentSession.currentExercise}
        onUpdateSet={updateSet}
        onCompleteSet={completeSet}
        onNextExercise={nextExercise}
        onPreviousExercise={previousExercise}
      />
    </div>
  );
}
