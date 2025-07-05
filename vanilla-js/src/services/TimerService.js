/**
 * TimerService - Web Worker-based timer for accuracy during workouts
 * Critical Requirements:
 * - Persistent state across phone calls and app switching
 * - Sub-100ms response to timer interactions
 * - Accuracy during intensive JavaScript operations
 */

class TimerService {
  constructor() {
    this.state = {
      running: false,
      elapsed: 0,
      startTime: null
    };
    
    this.listeners = new Set();
    this.updateInterval = null;
    this.worker = null;
    
    this.initializeWorker();
    this.bindVisibilityEvents();
  }
  
  initializeWorker() {
    // Create inline worker for timer accuracy
    const workerCode = `
      let startTime = null;
      let running = false;
      let elapsed = 0;
      
      self.onmessage = function(e) {
        const { action, data } = e.data;
        
        switch (action) {
          case 'start':
            if (!running) {
              startTime = Date.now() - elapsed;
              running = true;
              startTimer();
            }
            break;
            
          case 'pause':
            running = false;
            break;
            
          case 'reset':
            running = false;
            elapsed = 0;
            startTime = null;
            postMessage({ type: 'update', elapsed: 0, running: false });
            break;
            
          case 'sync':
            elapsed = data.elapsed;
            running = data.running;
            if (running) {
              startTime = Date.now() - elapsed;
              startTimer();
            }
            break;
        }
      };
      
      function startTimer() {
        if (!running) return;
        
        elapsed = Date.now() - startTime;
        postMessage({ type: 'update', elapsed, running });
        
        setTimeout(startTimer, 100); // Update every 100ms
      }
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));
    
    this.worker.onmessage = (e) => {
      const { type, elapsed, running } = e.data;
      
      if (type === 'update') {
        this.state.elapsed = elapsed;
        this.state.running = running;
        this.notifyListeners();
        this.saveState();
      }
    };
  }
  
  bindVisibilityEvents() {
    // Handle visibility changes (phone calls, app switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveState();
      } else {
        this.restoreState();
      }
    });
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
    
    // Restore state on initialization
    this.restoreState();
  }
  
  saveState() {
    const stateData = {
      running: this.state.running,
      elapsed: this.state.elapsed,
      startTime: this.state.startTime,
      lastSave: Date.now()
    };
    
    localStorage.setItem('fitnesswise-timer-state', JSON.stringify(stateData));
  }
  
  restoreState() {
    const savedState = localStorage.getItem('fitnesswise-timer-state');
    
    if (savedState) {
      try {
        const stateData = JSON.parse(savedState);
        const timeSinceLastSave = Date.now() - stateData.lastSave;
        
        // If we were running and it's been less than 5 minutes, continue
        if (stateData.running && timeSinceLastSave < 300000) {
          this.state.elapsed = stateData.elapsed + timeSinceLastSave;
          this.state.running = true;
          this.state.startTime = stateData.startTime;
          
          // Sync with worker
          this.worker.postMessage({
            action: 'sync',
            data: {
              elapsed: this.state.elapsed,
              running: true
            }
          });
        } else {
          // Otherwise, restore paused state
          this.state.elapsed = stateData.elapsed;
          this.state.running = false;
          this.state.startTime = null;
        }
        
        this.notifyListeners();
      } catch (error) {
        console.error('Failed to restore timer state:', error);
      }
    }
  }
  
  start() {
    if (this.state.running) return;
    
    this.state.running = true;
    this.state.startTime = Date.now() - this.state.elapsed;
    
    this.worker.postMessage({ action: 'start' });
    this.notifyListeners();
    this.saveState();
  }
  
  pause() {
    if (!this.state.running) return;
    
    this.state.running = false;
    
    this.worker.postMessage({ action: 'pause' });
    this.notifyListeners();
    this.saveState();
  }
  
  reset() {
    this.state.running = false;
    this.state.elapsed = 0;
    this.state.startTime = null;
    
    this.worker.postMessage({ action: 'reset' });
    this.notifyListeners();
    this.saveState();
    
    // Clear saved state
    localStorage.removeItem('fitnesswise-timer-state');
  }
  
  getState() {
    return { ...this.state };
  }
  
  formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  formatTimeFromMs(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    return this.formatTime(totalSeconds);
  }
  
  addEventListener(callback) {
    this.listeners.add(callback);
  }
  
  removeEventListener(callback) {
    this.listeners.delete(callback);
  }
  
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        console.error('Error in timer listener:', error);
      }
    });
  }
  
  destroy() {
    if (this.worker) {
      this.worker.terminate();
    }
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.listeners.clear();
  }
}

export default TimerService;