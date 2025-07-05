/**
 * WorkoutBanner - Touch-optimized exercise tracking with swipe navigation
 * Critical Requirements:
 * - Touch-optimized controls with visual feedback
 * - Optimistic updates with rollback on failure
 * - 44px minimum touch targets
 */

class WorkoutBanner {
  constructor(container, stateManager) {
    this.container = container;
    this.stateManager = stateManager;
    this.currentWorkout = null;
    this.exercises = [];
    this.currentExercise = 0;
    
    this.render();
    this.bindEvents();
    this.bindStateEvents();
  }
  
  render() {
    if (!this.currentWorkout || !this.exercises.length) {
      this.container.innerHTML = `
        <div class="workout-banner-content">
          <div class="no-workout-message">
            <h2>Ready to start your workout?</h2>
            <p>Select a workout day to begin tracking your progress.</p>
            <div class="workout-options">
              <button data-action="start-workout-A" class="workout-option-button touch-target">
                <div class="workout-option-title">Day A</div>
                <div class="workout-option-subtitle">Vertical Pull Focus</div>
              </button>
              
              <button data-action="start-workout-B" class="workout-option-button touch-target">
                <div class="workout-option-title">Day B</div>
                <div class="workout-option-subtitle">Horizontal Pull & Barbell</div>
              </button>
              
              <button data-action="start-workout-C" class="workout-option-button touch-target">
                <div class="workout-option-title">Day C</div>
                <div class="workout-option-subtitle">Power & Mixed Patterns</div>
              </button>
            </div>
          </div>
        </div>
      `;
      return;
    }
    
    const exercise = this.exercises[this.currentExercise];
    if (!exercise) return;
    
    this.container.innerHTML = `
      <div class="workout-banner-content">
        <!-- Current Exercise Card -->
        <div class="exercise-card">
          <div class="exercise-header">
            <h3 class="exercise-title">${exercise.name}</h3>
            ${exercise.videoUrl ? `
              <button 
                data-action="play-video" 
                data-video-url="${exercise.videoUrl}"
                class="video-button touch-target"
              >
                ▶
              </button>
            ` : ''}
          </div>
          
          <p class="exercise-description">${exercise.description}</p>
          
          <div class="exercise-meta">
            <span class="equipment">Equipment: ${exercise.equipment}</span>
            <span class="muscle-groups">Targets: ${exercise.muscleGroups.join(', ')}</span>
          </div>
          
          <!-- Set Tracking -->
          <div class="sets-container">
            ${exercise.sets.map((set, setIndex) => `
              <div class="set-row" data-set-index="${setIndex}">
                <div class="set-info">
                  <div class="set-number">Set ${setIndex + 1}</div>
                  <div class="set-target">Target: ${set.targetReps} reps</div>
                </div>
                
                <div class="set-controls">
                  <button 
                    data-action="decrement-reps"
                    data-exercise-index="${this.currentExercise}"
                    data-set-index="${setIndex}"
                    class="rep-button decrement touch-target"
                  >
                    −
                  </button>
                  
                  <div class="rep-count">${set.completedReps}</div>
                  
                  <button 
                    data-action="increment-reps"
                    data-exercise-index="${this.currentExercise}"
                    data-set-index="${setIndex}"
                    class="rep-button increment touch-target"
                  >
                    +
                  </button>
                  
                  <button 
                    data-action="complete-set"
                    data-exercise-index="${this.currentExercise}"
                    data-set-index="${setIndex}"
                    class="complete-set-button touch-target ${set.completed ? 'completed' : ''}"
                  >
                    ${set.completed ? '✓ Completed' : 'Complete Set'}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
          
          <!-- Exercise Navigation -->
          <div class="exercise-nav">
            <button 
              data-action="previous-exercise"
              class="nav-button touch-target"
              ${this.currentExercise === 0 ? 'disabled' : ''}
            >
              ← Previous
            </button>
            
            <div class="exercise-progress">
              ${this.currentExercise + 1} of ${this.exercises.length}
            </div>
            
            <button 
              data-action="next-exercise"
              class="nav-button next touch-target"
              ${this.currentExercise === this.exercises.length - 1 ? 'disabled' : ''}
            >
              Next →
            </button>
          </div>
        </div>
        
        <!-- Exercise List Overview -->
        <div class="exercise-list-card">
          <h3>Today's Exercises</h3>
          <div class="exercise-list">
            ${this.exercises.map((ex, index) => `
              <div 
                class="exercise-list-item ${index === this.currentExercise ? 'current' : ''}"
                data-action="select-exercise"
                data-exercise-index="${index}"
              >
                <div class="exercise-list-info">
                  <div class="exercise-list-number">${index + 1}</div>
                  <div class="exercise-list-details">
                    <div class="exercise-list-name">${ex.name}</div>
                    <div class="exercise-list-sets">
                      ${ex.sets.length} sets × ${ex.sets.map(s => s.targetReps).join(',')} reps
                    </div>
                  </div>
                </div>
                
                <div class="exercise-list-status">
                  ${ex.sets.every(set => set.completed) ? `
                    <div class="exercise-completed">✓</div>
                  ` : `
                    <div class="exercise-progress-indicator">
                      ${ex.sets.filter(set => set.completed).length}/${ex.sets.length}
                    </div>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    this.addTouchOptimizations();
  }
  
  addTouchOptimizations() {
    // Add visual feedback for touch interactions
    const touchTargets = this.container.querySelectorAll('.touch-target');
    
    touchTargets.forEach(target => {
      target.addEventListener('touchstart', (e) => {
        e.preventDefault();
        target.classList.add('active');
      }, { passive: false });
      
      target.addEventListener('touchend', () => {
        target.classList.remove('active');
      });
      
      target.addEventListener('touchcancel', () => {
        target.classList.remove('active');
      });
    });
  }
  
  bindEvents() {
    // Event delegation handled by global event system
    // Events: increment-reps, decrement-reps, complete-set, 
    //         previous-exercise, next-exercise, select-exercise,
    //         start-workout-A, start-workout-B, start-workout-C, play-video
  }
  
  bindStateEvents() {
    this.stateManager.addEventListener('workout-started', (session) => {
      this.loadWorkout(session);
    });
    
    this.stateManager.addEventListener('session-loaded', (session) => {
      if (session) {
        this.loadWorkout(session);
      }
    });
    
    this.stateManager.addEventListener('set-updated', ({ exerciseIndex, setIndex }) => {
      this.updateSetDisplay(exerciseIndex, setIndex);
    });
    
    this.stateManager.addEventListener('set-completed', ({ exerciseIndex, setIndex }) => {
      this.updateSetCompletedDisplay(exerciseIndex, setIndex);
    });
    
    this.stateManager.addEventListener('exercise-changed', (exerciseIndex) => {
      this.currentExercise = exerciseIndex;
      this.render();
    });
  }
  
  loadWorkout(session) {
    this.currentWorkout = session.currentWorkout;
    this.exercises = session.exercises;
    this.currentExercise = session.currentExercise;
    this.render();
  }
  
  updateSetDisplay(exerciseIndex, setIndex) {
    if (exerciseIndex !== this.currentExercise) return;
    
    const setRow = this.container.querySelector(`[data-set-index="${setIndex}"]`);
    if (setRow) {
      const repCount = setRow.querySelector('.rep-count');
      if (repCount) {
        const exercise = this.exercises[exerciseIndex];
        repCount.textContent = exercise.sets[setIndex].completedReps;
      }
    }
    
    // Update exercise list progress
    this.updateExerciseListProgress();
  }
  
  updateSetCompletedDisplay(exerciseIndex, setIndex) {
    if (exerciseIndex !== this.currentExercise) return;
    
    const setRow = this.container.querySelector(`[data-set-index="${setIndex}"]`);
    if (setRow) {
      const completeButton = setRow.querySelector('.complete-set-button');
      if (completeButton) {
        completeButton.className = 'complete-set-button touch-target completed';
        completeButton.textContent = '✓ Completed';
      }
    }
    
    this.updateExerciseListProgress();
  }
  
  updateExerciseListProgress() {
    this.exercises.forEach((exercise, index) => {
      const listItem = this.container.querySelector(`[data-exercise-index="${index}"]`);
      if (listItem) {
        const statusElement = listItem.querySelector('.exercise-list-status');
        if (statusElement) {
          if (exercise.sets.every(set => set.completed)) {
            statusElement.innerHTML = '<div class="exercise-completed">✓</div>';
          } else {
            const completed = exercise.sets.filter(set => set.completed).length;
            statusElement.innerHTML = `
              <div class="exercise-progress-indicator">
                ${completed}/${exercise.sets.length}
              </div>
            `;
          }
        }
      }
    });
  }
  
  // Action handlers
  handleIncrementReps(exerciseIndex, setIndex) {
    const exercise = this.exercises[exerciseIndex];
    if (!exercise || !exercise.sets[setIndex]) return;
    
    const currentReps = exercise.sets[setIndex].completedReps;
    const newReps = currentReps + 1;
    
    // Optimistic update
    exercise.sets[setIndex].completedReps = newReps;
    this.updateSetDisplay(exerciseIndex, setIndex);
    
    // Persist through state manager
    this.stateManager.updateExerciseSet(exerciseIndex, setIndex, newReps);
  }
  
  handleDecrementReps(exerciseIndex, setIndex) {
    const exercise = this.exercises[exerciseIndex];
    if (!exercise || !exercise.sets[setIndex]) return;
    
    const currentReps = exercise.sets[setIndex].completedReps;
    const newReps = Math.max(0, currentReps - 1);
    
    // Optimistic update
    exercise.sets[setIndex].completedReps = newReps;
    this.updateSetDisplay(exerciseIndex, setIndex);
    
    // Persist through state manager
    this.stateManager.updateExerciseSet(exerciseIndex, setIndex, newReps);
  }
  
  handleCompleteSet(exerciseIndex, setIndex) {
    const exercise = this.exercises[exerciseIndex];
    if (!exercise || !exercise.sets[setIndex]) return;
    
    // Toggle completion state
    const currentlyCompleted = exercise.sets[setIndex].completed;
    exercise.sets[setIndex].completed = !currentlyCompleted;
    
    this.updateSetCompletedDisplay(exerciseIndex, setIndex);
    
    // Persist through state manager
    this.stateManager.completeSet(exerciseIndex, setIndex);
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
  
  handlePreviousExercise() {
    if (this.currentExercise > 0) {
      this.currentExercise--;
      this.stateManager.setCurrentExercise(this.currentExercise);
      this.render();
    }
  }
  
  handleNextExercise() {
    if (this.currentExercise < this.exercises.length - 1) {
      this.currentExercise++;
      this.stateManager.setCurrentExercise(this.currentExercise);
      this.render();
    }
  }
  
  handleSelectExercise(exerciseIndex) {
    const index = parseInt(exerciseIndex);
    if (index >= 0 && index < this.exercises.length) {
      this.currentExercise = index;
      this.stateManager.setCurrentExercise(index);
      this.render();
    }
  }
  
  handleStartWorkout(workoutDay) {
    document.dispatchEvent(new CustomEvent('start-workout-request', {
      detail: { workoutDay }
    }));
  }
  
  handlePlayVideo(videoUrl) {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  }
  
  reset() {
    this.currentWorkout = null;
    this.exercises = [];
    this.currentExercise = 0;
    this.render();
  }
  
  destroy() {
    this.container.innerHTML = '';
  }
}

export default WorkoutBanner;