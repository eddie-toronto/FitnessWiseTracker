/**
 * AppBanner - Fixed header with authentication status and streak counter
 * Implements event delegation and 44px touch targets
 */

class AppBanner {
  constructor(container) {
    this.container = container;
    this.isAuthenticated = false;
    this.currentStreak = 0;
    this.username = '';
    
    this.render();
    this.bindEvents();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="app-banner-content">
        <div class="app-title">
          <div class="app-icon">💪</div>
          <h1>FitnessWise</h1>
        </div>
        
        <div class="user-actions">
          <div class="streak-counter" style="display: ${this.isAuthenticated ? 'flex' : 'none'}">
            <span class="flame-icon">🔥</span>
            <span class="streak-value">${this.currentStreak}</span>
          </div>
          
          <button 
            data-action="auth-toggle" 
            class="auth-button touch-target"
          >
            ${this.isAuthenticated ? 'Logout' : 'Login'}
          </button>
          
          <button 
            data-action="menu-toggle" 
            class="menu-button touch-target"
            style="display: ${this.isAuthenticated ? 'flex' : 'none'}"
          >
            ☰
          </button>
        </div>
      </div>
    `;
  }
  
  bindEvents() {
    // Event delegation handled by global event system
    // Events: auth-toggle, menu-toggle
  }
  
  updateAuthState(isAuthenticated, userData = {}) {
    this.isAuthenticated = isAuthenticated;
    
    if (isAuthenticated) {
      this.currentStreak = userData.currentStreak || 0;
      this.username = userData.username || 'User';
    } else {
      this.currentStreak = 0;
      this.username = '';
    }
    
    this.render();
    
    // Notify global state of auth change
    document.dispatchEvent(new CustomEvent('auth-state-change', {
      detail: { isAuthenticated, userData }
    }));
  }
  
  updateStreak(streak) {
    this.currentStreak = streak;
    
    const streakElement = this.container.querySelector('.streak-value');
    if (streakElement) {
      streakElement.textContent = streak;
    }
  }
  
  showMenu() {
    document.dispatchEvent(new CustomEvent('menu-toggle', {
      detail: { action: 'show' }
    }));
  }
  
  hideMenu() {
    document.dispatchEvent(new CustomEvent('menu-toggle', {
      detail: { action: 'hide' }
    }));
  }
  
  // Handle auth toggle action
  handleAuthToggle() {
    if (this.isAuthenticated) {
      this.logout();
    } else {
      this.login();
    }
  }
  
  async login() {
    try {
      // For Phase 1, implement simple test mode
      // In Phase 2, this would integrate with Firebase
      const userData = {
        id: 1,
        username: 'Test User',
        currentStreak: 5,
        totalWorkouts: 12
      };
      
      this.updateAuthState(true, userData);
      
      // Save to localStorage for persistence
      localStorage.setItem('fitnesswise-auth', JSON.stringify({
        isAuthenticated: true,
        userData
      }));
      
      // Notify app of successful login
      document.dispatchEvent(new CustomEvent('login-success', {
        detail: userData
      }));
      
    } catch (error) {
      console.error('Login failed:', error);
      this.showError('Login failed. Please try again.');
    }
  }
  
  async logout() {
    try {
      this.updateAuthState(false);
      
      // Clear stored auth data
      localStorage.removeItem('fitnesswise-auth');
      localStorage.removeItem('fitnesswise-user-id');
      
      // Notify app of logout
      document.dispatchEvent(new CustomEvent('logout-complete'));
      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  
  // Handle menu toggle action
  handleMenuToggle() {
    document.dispatchEvent(new CustomEvent('menu-toggle-request'));
  }
  
  showError(message) {
    // Create temporary error display
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #dc2626;
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 3000);
  }
  
  // Initialize auth state from localStorage
  initializeAuthState() {
    const savedAuth = localStorage.getItem('fitnesswise-auth');
    
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.isAuthenticated) {
          this.updateAuthState(true, authData.userData);
          
          // Notify app that user is already logged in
          document.dispatchEvent(new CustomEvent('login-success', {
            detail: authData.userData
          }));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('fitnesswise-auth');
      }
    }
  }
  
  destroy() {
    // Cleanup if needed
    this.container.innerHTML = '';
  }
}

export default AppBanner;