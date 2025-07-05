/**
 * WorkoutStateManager - Singleton pattern for reliable workout state management
 * Critical Requirements:
 * - Zero data loss during workout sessions
 * - Reliable 30-second auto-save with retry logic
 * - Works flawlessly during physical exertion
 */

class WorkoutStateManager {
  constructor() {
    if (WorkoutStateManager.instance) {
      return WorkoutStateManager.instance;
    }
    
    this.currentSession = null;
    this.saveStatus = 'Ready';
    this.autoSaveInterval = null;
    this.pendingSaves = new Set();
    this.saveQueue = [];
    this.listeners = new Map();
    this.userId = null;
    
    // Initialize localStorage backup immediately
    this.initializeStorage();
    this.initializeAutoSave();
    
    WorkoutStateManager.instance = this;
  }
  
  initializeStorage() {
    // Load from localStorage immediately for instant reliability
    const savedSession = localStorage.getItem('fitnesswise-workout-session');
    const savedUserId = localStorage.getItem('fitnesswise-user-id');
    
    if (savedSession) {
      try {
        this.currentSession = JSON.parse(savedSession);
        this.notifyListeners('session-loaded', this.currentSession);
      } catch (error) {
        console.error('Failed to load saved session:', error);
        localStorage.removeItem('fitnesswise-workout-session');
      }
    }
    
    if (savedUserId) {
      this.userId = parseInt(savedUserId);
    }
  }
  
  initializeAutoSave() {
    // Single, reliable auto-save timer - 30 seconds as required
    this.autoSaveInterval = setInterval(() => {
      this.performAutoSave();
    }, 30000);
    
    // Also save on page unload
    window.addEventListener('beforeunload', () => {
      this.saveToLocalStorage();
    });
    
    // Save on visibility change (phone calls, app switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveToLocalStorage();
      }
    });
  }
  
  async performAutoSave() {
    if (!this.currentSession || this.pendingSaves.size > 0) return;
    
    const saveId = Date.now();
    this.pendingSaves.add(saveId);
    this.updateSaveStatus('Saving...');
    
    try {
      // Always save to localStorage first (instant reliability)
      this.saveToLocalStorage();
      
      // Then attempt cloud save if we have a user ID
      if (this.userId) {
        await this.saveToCloud();
      }
      
      this.updateSaveStatus('Saved');
      
      // Clear any queued saves since we just saved successfully
      this.saveQueue = [];
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      this.updateSaveStatus('Error');
      
      // Queue for retry with exponential backoff
      this.saveQueue.push({
        data: { ...this.currentSession },
        timestamp: Date.now(),
        retryCount: 0
      });
      
      this.scheduleRetry();
    } finally {
      this.pendingSaves.delete(saveId);
    }
  }
  
  saveToLocalStorage() {
    if (!this.currentSession) return;
    
    try {
      localStorage.setItem('fitnesswise-workout-session', JSON.stringify(this.currentSession));
      localStorage.setItem('fitnesswise-last-save', Date.now().toString());
      
      if (this.userId) {
        localStorage.setItem('fitnesswise-user-id', this.userId.toString());
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
  
  async saveToCloud() {
    if (!this.userId || !this.currentSession) return;
    
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.userId,
        sessionData: this.currentSession,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Save failed: ${response.status}`);
    }
  }
  
  scheduleRetry() {
    // Exponential backoff: 5s, 10s, 20s, then give up
    const retryDelays = [5000, 10000, 20000];
    
    setTimeout(() => {
      this.retryFailedSaves();
    }, retryDelays[0]);
  }
  
  async retryFailedSaves() {
    const failedSaves = this.saveQueue.filter(save => save.retryCount < 3);
    
    for (const save of failedSaves) {
      try {
        await this.saveToCloud();
        this.saveQueue = this.saveQueue.filter(s => s !== save);
        this.updateSaveStatus('Saved');
        break; // Success, exit retry loop
      } catch (error) {
        save.retryCount++;
        
        if (save.retryCount >= 3) {
          this.updateSaveStatus('Failed');
          console.error('Max retries exceeded for save:', save);
        } else {
          // Schedule next retry with exponential backoff
          const delay = Math.pow(2, save.retryCount) * 5000;
          setTimeout(() => this.retryFailedSaves(), delay);
        }
      }
    }
  }
  
  updateSaveStatus(status) {
    this.saveStatus = status;
    this.notifyListeners('save-status-change', status);
  }
  
  // Session Management
  startWorkout(workoutDay, exercises) {
    this.currentSession = {
      currentWorkout: workoutDay,
      currentExercise: 0,
      timerState: {
        running: false,
        elapsed: 0,
        startTime: null
      },
      exercises: exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          completedReps: 0,
          completed: false
        }))
      })),
      startedAt: Date.now(),
      lastUpdated: Date.now()
    };
    
    this.saveToLocalStorage();
    this.notifyListeners('workout-started', this.currentSession);
    
    // Force immediate save attempt
    this.performAutoSave();
  }
  
  updateExerciseSet(exerciseIndex, setIndex, completedReps) {
    if (!this.currentSession) return;
    
    const exercise = this.currentSession.exercises[exerciseIndex];
    if (!exercise || !exercise.sets[setIndex]) return;
    
    exercise.sets[setIndex].completedReps = completedReps;
    this.currentSession.lastUpdated = Date.now();
    
    this.saveToLocalStorage();
    this.notifyListeners('set-updated', { exerciseIndex, setIndex, completedReps });
  }
  
  completeSet(exerciseIndex, setIndex) {
    if (!this.currentSession) return;
    
    const exercise = this.currentSession.exercises[exerciseIndex];
    if (!exercise || !exercise.sets[setIndex]) return;
    
    exercise.sets[setIndex].completed = true;
    this.currentSession.lastUpdated = Date.now();
    
    this.saveToLocalStorage();
    this.notifyListeners('set-completed', { exerciseIndex, setIndex });
  }
  
  updateTimerState(timerState) {
    if (!this.currentSession) return;
    
    this.currentSession.timerState = { ...timerState };
    this.currentSession.lastUpdated = Date.now();
    
    this.saveToLocalStorage();
    this.notifyListeners('timer-updated', timerState);
  }
  
  setCurrentExercise(exerciseIndex) {
    if (!this.currentSession) return;
    
    this.currentSession.currentExercise = exerciseIndex;
    this.currentSession.lastUpdated = Date.now();
    
    this.saveToLocalStorage();
    this.notifyListeners('exercise-changed', exerciseIndex);
  }
  
  completeWorkout() {
    if (!this.currentSession) return;
    
    const completedSession = {
      ...this.currentSession,
      completed: true,
      completedAt: Date.now()
    };
    
    // Save completed workout to history
    const workoutHistory = JSON.parse(localStorage.getItem('fitnesswise-workout-history') || '[]');
    workoutHistory.push(completedSession);
    localStorage.setItem('fitnesswise-workout-history', JSON.stringify(workoutHistory));
    
    // Clear current session
    this.currentSession = null;
    localStorage.removeItem('fitnesswise-workout-session');
    
    this.notifyListeners('workout-completed', completedSession);
    
    // Try to save completion to cloud
    this.saveCompletedWorkout(completedSession);
  }
  
  async saveCompletedWorkout(completedSession) {
    if (!this.userId) return;
    
    try {
      await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          workoutDay: completedSession.currentWorkout,
          startTime: new Date(completedSession.startedAt).toISOString(),
          endTime: new Date(completedSession.completedAt).toISOString(),
          duration: Math.floor((completedSession.completedAt - completedSession.startedAt) / 1000),
          completed: true,
          exercises: completedSession.exercises
        }),
      });
    } catch (error) {
      console.error('Failed to save completed workout:', error);
    }
  }
  
  // User Management
  setUser(userId) {
    this.userId = userId;
    localStorage.setItem('fitnesswise-user-id', userId.toString());
    this.notifyListeners('user-changed', userId);
  }
  
  // Event System
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }
  
  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }
  
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }
  
  // Getters
  getCurrentSession() {
    return this.currentSession;
  }
  
  getSaveStatus() {
    return this.saveStatus;
  }
  
  isWorkoutActive() {
    return this.currentSession !== null;
  }
  
  // Cleanup
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    this.listeners.clear();
    WorkoutStateManager.instance = null;
  }
}

export default WorkoutStateManager;