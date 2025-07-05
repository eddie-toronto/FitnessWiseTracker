/**
 * FitnessWise Vanilla JavaScript Application
 * Entry point for the fitness tracking app
 * 
 * Critical Requirements:
 * - Zero data loss during workout sessions
 * - Sub-100ms response to touch interactions  
 * - Reliable 30-second auto-save with retry logic
 * - Works flawlessly during physical exertion
 */

import WorkoutStateManager from './src/services/WorkoutStateManager.js';
import TimerService from './src/services/TimerService.js';
import AppBanner from './src/components/AppBanner.js';
import DayBanner from './src/components/DayBanner.js';
import WorkoutBanner from './src/components/WorkoutBanner.js';
import { WORKOUT_DATA } from './src/data/workouts.js';

class FitnessApp {
  constructor() {
    this.services = {
      stateManager: new WorkoutStateManager(),
      timer: new TimerService()
    };
    
    this.components = {};
    this.actionHandlers = {};
    
    this.initialize();
  }
  
  async initialize() {
    console.log('🏋️ FitnessWise: Initializing vanilla JavaScript app...');
    
    try {
      // Initialize components
      this.initializeComponents();
      
      // Set up event delegation
      this.initializeEventSystem();
      
      // Bind application events
      this.bindApplicationEvents();
      
      // Initialize authentication state
      this.initializeAuthState();
      
      // Check for existing workout session
      this.checkExistingSession();
      
      console.log('✅ FitnessWise: App initialized successfully');
      
    } catch (error) {
      console.error('❌ FitnessWise: Initialization failed', error);
      this.showError('Failed to initialize app. Please refresh the page.');
    }
  }
  
  initializeComponents() {
    const appBannerContainer = document.getElementById('app-banner');
    const dayBannerContainer = document.getElementById('day-banner');
    const workoutBannerContainer = document.getElementById('workout-banner');
    
    if (!appBannerContainer || !dayBannerContainer || !workoutBannerContainer) {
      throw new Error('Required DOM containers not found');
    }
    
    this.components.appBanner = new AppBanner(appBannerContainer);
    this.components.dayBanner = new DayBanner(dayBannerContainer, this.services.timer);
    this.components.workoutBanner = new WorkoutBanner(workoutBannerContainer, this.services.stateManager);
    
    // Initialize save indicator
    this.initializeSaveIndicator();
  }
  
  initializeSaveIndicator() {
    const saveIndicator = document.getElementById('save-indicator');
    if (saveIndicator) {
      // Listen for save status changes
      this.services.stateManager.addEventListener('save-status-change', (status) => {
        this.updateSaveIndicator(status);
      });
    }
  }
  
  updateSaveIndicator(status) {
    const saveIndicator = document.getElementById('save-indicator');
    if (!saveIndicator) return;
    
    // Clear existing classes
    saveIndicator.className = '';
    saveIndicator.textContent = status;
    
    // Add status-specific class and show
    saveIndicator.classList.add('show');
    
    switch (status) {
      case 'Saving...':
        saveIndicator.classList.add('saving');
        break;
      case 'Saved':
        saveIndicator.classList.add('saved');
        // Hide after 2 seconds
        setTimeout(() => {
          saveIndicator.classList.remove('show');
        }, 2000);
        break;
      case 'Error':
      case 'Failed':
        saveIndicator.classList.add('error');
        // Hide after 5 seconds
        setTimeout(() => {
          saveIndicator.classList.remove('show');
        }, 5000);
        break;
      default:
        saveIndicator.classList.remove('show');
    }
  }
  
  initializeEventSystem() {
    // Global event delegation for all user interactions
    document.addEventListener('click', (event) => {
      const action = event.target.dataset.action;
      const component = event.target.closest('[data-component]');
      
      if (action && component) {
        event.preventDefault();
        
        const componentName = component.dataset.component;
        const handler = this.getActionHandler(componentName, action);
        
        if (handler) {
          // Add visual feedback for touch
          this.addTouchFeedback(event.target);
          
          try {
            handler(event);
          } catch (error) {
            console.error(`Error handling action ${action}:`, error);
            this.showError('Something went wrong. Please try again.');
          }
        }
      }
    });
    
    // Prevent default touch behaviors that interfere with workout
    document.addEventListener('touchstart', (event) => {
      if (event.target.classList.contains('touch-target')) {
        event.preventDefault();
      }
    }, { passive: false });
  }
  
  addTouchFeedback(element) {
    if (element.classList.contains('touch-target')) {
      element.classList.add('active');
      
      setTimeout(() => {
        element.classList.remove('active');
      }, 150);
      
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(25);
      }
    }
  }
  
  getActionHandler(componentName, action) {
    // Map actions to component methods
    const handlers = {
      'app-banner': {
        'auth-toggle': () => this.components.appBanner.handleAuthToggle(),
        'menu-toggle': () => this.components.appBanner.handleMenuToggle()
      },
      'day-banner': {
        'minimize-toggle': () => this.components.dayBanner.handleMinimizeToggle(),
        'timer-start': () => this.components.dayBanner.handleTimerStart(),
        'timer-pause': () => this.components.dayBanner.handleTimerPause(),
        'timer-complete': () => this.components.dayBanner.handleTimerComplete(),
        'scroll-to-top': () => this.components.dayBanner.handleScrollToTop()
      },
      'workout-banner': {
        'increment-reps': (event) => {
          const exerciseIndex = parseInt(event.target.dataset.exerciseIndex);
          const setIndex = parseInt(event.target.dataset.setIndex);
          this.components.workoutBanner.handleIncrementReps(exerciseIndex, setIndex);
        },
        'decrement-reps': (event) => {
          const exerciseIndex = parseInt(event.target.dataset.exerciseIndex);
          const setIndex = parseInt(event.target.dataset.setIndex);
          this.components.workoutBanner.handleDecrementReps(exerciseIndex, setIndex);
        },
        'complete-set': (event) => {
          const exerciseIndex = parseInt(event.target.dataset.exerciseIndex);
          const setIndex = parseInt(event.target.dataset.setIndex);
          this.components.workoutBanner.handleCompleteSet(exerciseIndex, setIndex);
        },
        'previous-exercise': () => this.components.workoutBanner.handlePreviousExercise(),
        'next-exercise': () => this.components.workoutBanner.handleNextExercise(),
        'select-exercise': (event) => {
          const exerciseIndex = event.target.dataset.exerciseIndex;
          this.components.workoutBanner.handleSelectExercise(exerciseIndex);
        },
        'start-workout-A': () => this.components.workoutBanner.handleStartWorkout('A'),
        'start-workout-B': () => this.components.workoutBanner.handleStartWorkout('B'),
        'start-workout-C': () => this.components.workoutBanner.handleStartWorkout('C'),
        'play-video': (event) => {
          const videoUrl = event.target.dataset.videoUrl;
          this.components.workoutBanner.handlePlayVideo(videoUrl);
        }
      }
    };
    
    return handlers[componentName]?.[action];
  }
  
  bindApplicationEvents() {
    // Listen for custom application events
    
    // Authentication events
    document.addEventListener('login-success', (event) => {
      const userData = event.detail;
      this.services.stateManager.setUser(userData.id);
      console.log('✅ User authenticated:', userData.username);
    });
    
    document.addEventListener('logout-complete', () => {
      this.services.stateManager.setUser(null);
      this.resetApp();
      console.log('✅ User logged out');
    });
    
    // Workout events
    document.addEventListener('start-workout-request', (event) => {
      const { workoutDay } = event.detail;
      this.startWorkout(workoutDay);
    });
    
    document.addEventListener('workout-complete-request', (event) => {
      this.completeWorkout(event.detail);
    });
    
    // Timer events
    document.addEventListener('timer-started', (event) => {
      this.services.stateManager.updateTimerState(event.detail);
    });
    
    document.addEventListener('timer-paused', (event) => {
      this.services.stateManager.updateTimerState(event.detail);
    });
    
    // Menu toggle
    document.addEventListener('menu-toggle-request', () => {
      this.toggleMenu();
    });
  }
  
  initializeAuthState() {
    // Initialize authentication state from localStorage
    this.components.appBanner.initializeAuthState();
  }
  
  checkExistingSession() {
    const existingSession = this.services.stateManager.getCurrentSession();
    
    if (existingSession) {
      console.log('🔄 Restoring existing workout session:', existingSession.currentWorkout);
      
      // Update day banner
      this.components.dayBanner.setWorkoutDay(existingSession.currentWorkout);
      
      // Sync timer state
      if (existingSession.timerState) {
        // The timer service will handle restoration automatically
        console.log('⏰ Timer state restored');
      }
      
      this.showMessage('Workout session restored!', 'success');
    }
  }
  
  startWorkout(workoutDay) {
    console.log(`🏋️ Starting workout: Day ${workoutDay}`);
    
    try {
      const workoutData = WORKOUT_DATA[`day${workoutDay}`];
      
      if (!workoutData) {
        throw new Error(`Workout data not found for day ${workoutDay}`);
      }
      
      // Start workout session
      this.services.stateManager.startWorkout(workoutDay, workoutData.exercises);
      
      // Update day banner
      this.components.dayBanner.setWorkoutDay(workoutDay);
      
      // Reset and prepare timer
      this.services.timer.reset();
      
      this.showMessage(`Started ${workoutData.title}!`, 'success');
      
    } catch (error) {
      console.error('Failed to start workout:', error);
      this.showError('Failed to start workout. Please try again.');
    }
  }
  
  completeWorkout(details) {
    console.log('🎉 Completing workout:', details);
    
    try {
      // Complete workout in state manager
      this.services.stateManager.completeWorkout();
      
      // Reset timer
      this.services.timer.reset();
      
      // Reset components
      this.components.dayBanner.reset();
      this.components.workoutBanner.reset();
      
      // Update user streak (if authenticated)
      this.updateUserStreak();
      
      this.showMessage('Workout completed! Great job! 🎉', 'success');
      
    } catch (error) {
      console.error('Failed to complete workout:', error);
      this.showError('Failed to complete workout. Your progress has been saved.');
    }
  }
  
  updateUserStreak() {
    // Simple streak increment for test mode
    const authData = localStorage.getItem('fitnesswise-auth');
    
    if (authData) {
      try {
        const auth = JSON.parse(authData);
        if (auth.isAuthenticated) {
          auth.userData.currentStreak++;
          auth.userData.totalWorkouts++;
          
          localStorage.setItem('fitnesswise-auth', JSON.stringify(auth));
          this.components.appBanner.updateStreak(auth.userData.currentStreak);
        }
      } catch (error) {
        console.error('Failed to update streak:', error);
      }
    }
  }
  
  toggleMenu() {
    // Simple menu implementation for Phase 1
    console.log('📱 Menu toggle requested');
    // In Phase 2, this would show a proper navigation menu
  }
  
  resetApp() {
    console.log('🔄 Resetting app state');
    
    // Reset all components
    this.components.dayBanner.reset();
    this.components.workoutBanner.reset();
    
    // Reset timer
    this.services.timer.reset();
    
    // Clear workout session
    localStorage.removeItem('fitnesswise-workout-session');
  }
  
  showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `app-message ${type}`;
    messageDiv.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 90%;
      text-align: center;
      font-weight: 500;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(-50%) translateY(-20px)';
        messageDiv.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
          if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
          }
        }, 300);
      }
    }, type === 'success' ? 3000 : 5000);
  }
  
  showError(message) {
    this.showMessage(message, 'error');
  }
  
  destroy() {
    // Cleanup when app is destroyed
    console.log('🧹 Cleaning up FitnessWise app');
    
    Object.values(this.components).forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    
    Object.values(this.services).forEach(service => {
      if (service.destroy) {
        service.destroy();
      }
    });
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.fitnessApp = new FitnessApp();
  });
} else {
  window.fitnessApp = new FitnessApp();
}

// Handle app lifecycle
window.addEventListener('beforeunload', () => {
  if (window.fitnessApp) {
    window.fitnessApp.destroy();
  }
});

export default FitnessApp;