/**
 * DayBanner - Progressive disclosure timer with Amazon-style scroll minimization
 * Critical Requirements:
 * - Timer must remain visible during exercise execution
 * - Optimized scroll handling with requestAnimationFrame
 * - Horizontal timer button layout for mobile
 */

class DayBanner {
  constructor(container, timerService) {
    this.container = container;
    this.timerService = timerService;
    this.isManuallyMinimized = false;
    this.isScrollMinimized = false;
    this.currentWorkoutDay = null;
    this.timerState = {
      running: false,
      elapsed: 0
    };
    
    this.render();
    this.bindEvents();
    this.initializeScrollBehavior();
    this.bindTimerEvents();
  }
  
  render() {
    const workoutTitles = {
      A: "Day A: Vertical Pull Focus",
      B: "Day B: Horizontal Pull & Barbell", 
      C: "Day C: Power & Mixed Patterns"
    };
    
    const workoutDescriptions = {
      A: "Building pull-up strength and lat development for that coveted V-taper",
      B: "Building back thickness and strength with horizontal movements",
      C: "Explosive strength and varied movement patterns"
    };
    
    const title = this.currentWorkoutDay ? workoutTitles[this.currentWorkoutDay] : "Select a Workout";
    const description = this.currentWorkoutDay ? workoutDescriptions[this.currentWorkoutDay] : "Choose your training day to begin";
    
    this.container.innerHTML = `
      <div class="day-banner-content">
        <!-- Full State Header -->
        <div class="day-banner-header">
          <div>
            <div class="day-banner-title">${title}</div>
            <div class="day-banner-description">${description}</div>
          </div>
          <button 
            data-action="minimize-toggle" 
            class="minimize-button touch-target"
            style="display: ${this.currentWorkoutDay ? 'flex' : 'none'}"
          >
            ${this.isManuallyMinimized ? '⌄' : '⌃'}
          </button>
        </div>

        <!-- Timer Display (Full State) -->
        <div class="timer-display" style="display: ${this.shouldShowFullTimer() ? 'block' : 'none'}">
          <div class="timer-time">${this.timerService.formatTimeFromMs(this.timerState.elapsed)}</div>
          <div class="timer-status">
            ${this.timerState.running ? 'WORKOUT IN PROGRESS' : 'READY TO START YOUR WORKOUT'}
          </div>
        </div>

        <!-- Timer Controls (Full State) -->
        <div class="timer-controls" style="display: ${this.shouldShowFullTimer() ? 'flex' : 'none'}">
          <button 
            data-action="timer-start" 
            class="timer-button start-button touch-target"
            ${this.timerState.running ? 'disabled' : ''}
          >
            ▶ Start
          </button>
          
          <button 
            data-action="timer-pause" 
            class="timer-button pause-button touch-target"
            ${!this.timerState.running ? 'disabled' : ''}
          >
            ⏸ Pause
          </button>
          
          <button 
            data-action="timer-complete" 
            class="timer-button complete-button touch-target"
          >
            ⏹ Complete
          </button>
        </div>

        <!-- Minimized State -->
        <div class="minimized-timer" style="display: ${this.shouldShowMinimizedTimer() ? 'flex' : 'none'}">
          <div class="minimized-timer-info">
            <div class="minimized-timer-time">${this.timerService.formatTimeFromMs(this.timerState.elapsed)}</div>
            <div class="timer-indicator ${this.timerState.running ? 'running' : ''}"></div>
          </div>
          
          <div class="minimized-controls">
            ${!this.timerState.running ? `
              <button 
                data-action="timer-start" 
                class="timer-button start-button touch-target"
              >
                ▶
              </button>
            ` : `
              <button 
                data-action="timer-pause" 
                class="timer-button pause-button touch-target"
              >
                ⏸
              </button>
            `}
            
            ${this.isScrollMinimized ? `
              <button 
                data-action="scroll-to-top" 
                class="timer-button touch-target"
                style="background: #6b7280;"
              >
                ⌃
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    
    // Update container classes
    this.updateMinimizedState();
  }
  
  bindEvents() {
    // Event delegation handled by global event system
    // Events: minimize-toggle, timer-start, timer-pause, timer-complete, scroll-to-top
  }
  
  initializeScrollBehavior() {
    let ticking = false;
    let lastScrollY = 0;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const scrollThreshold = 80;
          const shouldMinimize = scrollY > scrollThreshold;
          
          if (shouldMinimize !== this.isScrollMinimized) {
            this.isScrollMinimized = shouldMinimize;
            this.updateMinimizedState();
          }
          
          lastScrollY = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    
    document.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  bindTimerEvents() {
    this.timerService.addEventListener((timerState) => {
      this.timerState = timerState;
      this.updateTimerDisplay();
    });
  }
  
  updateTimerDisplay() {
    // Update timer time displays
    const timeDisplays = this.container.querySelectorAll('.timer-time, .minimized-timer-time');
    timeDisplays.forEach(display => {
      display.textContent = this.timerService.formatTimeFromMs(this.timerState.elapsed);
    });
    
    // Update timer status
    const statusDisplay = this.container.querySelector('.timer-status');
    if (statusDisplay) {
      statusDisplay.textContent = this.timerState.running ? 
        'WORKOUT IN PROGRESS' : 'READY TO START YOUR WORKOUT';
    }
    
    // Update timer indicator
    const indicator = this.container.querySelector('.timer-indicator');
    if (indicator) {
      indicator.className = `timer-indicator ${this.timerState.running ? 'running' : ''}`;
    }
    
    // Update button states
    this.updateButtonStates();
  }
  
  updateButtonStates() {
    const startButtons = this.container.querySelectorAll('[data-action="timer-start"]');
    const pauseButtons = this.container.querySelectorAll('[data-action="timer-pause"]');
    
    startButtons.forEach(btn => {
      btn.disabled = this.timerState.running;
    });
    
    pauseButtons.forEach(btn => {
      btn.disabled = !this.timerState.running;
    });
    
    // Update minimized controls
    const minimizedControls = this.container.querySelector('.minimized-controls');
    if (minimizedControls) {
      const buttonHtml = !this.timerState.running ? `
        <button 
          data-action="timer-start" 
          class="timer-button start-button touch-target"
        >
          ▶
        </button>
      ` : `
        <button 
          data-action="timer-pause" 
          class="timer-button pause-button touch-target"
        >
          ⏸
        </button>
      `;
      
      minimizedControls.innerHTML = buttonHtml + (this.isScrollMinimized ? `
        <button 
          data-action="scroll-to-top" 
          class="timer-button touch-target"
          style="background: #6b7280;"
        >
          ⌃
        </button>
      ` : '');
    }
  }
  
  shouldShowFullTimer() {
    return this.currentWorkoutDay && !this.isManuallyMinimized && !this.isScrollMinimized;
  }
  
  shouldShowMinimizedTimer() {
    return this.currentWorkoutDay && (this.isManuallyMinimized || this.isScrollMinimized);
  }
  
  updateMinimizedState() {
    const isMinimized = this.isManuallyMinimized || this.isScrollMinimized;
    
    if (isMinimized) {
      this.container.classList.add('minimized');
    } else {
      this.container.classList.remove('minimized');
    }
    
    // Update visibility of timer sections
    const timerDisplay = this.container.querySelector('.timer-display');
    const timerControls = this.container.querySelector('.timer-controls');
    const minimizedTimer = this.container.querySelector('.minimized-timer');
    
    if (timerDisplay) {
      timerDisplay.style.display = this.shouldShowFullTimer() ? 'block' : 'none';
    }
    
    if (timerControls) {
      timerControls.style.display = this.shouldShowFullTimer() ? 'flex' : 'none';
    }
    
    if (minimizedTimer) {
      minimizedTimer.style.display = this.shouldShowMinimizedTimer() ? 'flex' : 'none';
    }
    
    // Update minimize button
    const minimizeButton = this.container.querySelector('[data-action="minimize-toggle"]');
    if (minimizeButton) {
      minimizeButton.textContent = this.isManuallyMinimized ? '⌄' : '⌃';
    }
  }
  
  setWorkoutDay(workoutDay) {
    this.currentWorkoutDay = workoutDay;
    this.render();
  }
  
  // Action handlers
  handleMinimizeToggle() {
    this.isManuallyMinimized = !this.isManuallyMinimized;
    this.updateMinimizedState();
  }
  
  handleTimerStart() {
    this.timerService.start();
    
    // Notify workout state manager
    document.dispatchEvent(new CustomEvent('timer-started', {
      detail: this.timerService.getState()
    }));
  }
  
  handleTimerPause() {
    this.timerService.pause();
    
    // Notify workout state manager
    document.dispatchEvent(new CustomEvent('timer-paused', {
      detail: this.timerService.getState()
    }));
  }
  
  handleTimerComplete() {
    const confirmComplete = confirm('Are you sure you want to complete this workout?');
    
    if (confirmComplete) {
      this.timerService.pause();
      
      // Notify app to complete workout
      document.dispatchEvent(new CustomEvent('workout-complete-request', {
        detail: {
          finalTime: this.timerState.elapsed,
          workoutDay: this.currentWorkoutDay
        }
      }));
    }
  }
  
  handleScrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  reset() {
    this.currentWorkoutDay = null;
    this.isManuallyMinimized = false;
    this.timerService.reset();
    this.render();
  }
  
  destroy() {
    this.container.innerHTML = '';
  }
}

export default DayBanner;