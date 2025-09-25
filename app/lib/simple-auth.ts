// Simple authentication system that just works
export const setAuthenticated = (address: string) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('authenticated', 'true');
  localStorage.setItem('authenticated_address', address);
  localStorage.setItem('authenticated_timestamp', Date.now().toString());
  
  // Dispatch event for components to listen
  window.dispatchEvent(new CustomEvent('auth_state_changed', { 
    detail: { authenticated: true, address } 
  }));
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const auth = localStorage.getItem('authenticated') === 'true';
  const timestamp = localStorage.getItem('authenticated_timestamp');
  
  // Check if authentication is still valid (24 hours)
  if (auth && timestamp) {
    const authTime = parseInt(timestamp);
    const now = Date.now();
    const hoursSinceAuth = (now - authTime) / (1000 * 60 * 60);
    
    if (hoursSinceAuth > 24) {
      // Expired, clear auth
      clearAuthentication();
      return false;
    }
  }
  
  return auth;
};

export const getAuthenticatedAddress = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authenticated_address');
};

export const clearAuthentication = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('authenticated');
  localStorage.removeItem('authenticated_address');
  localStorage.removeItem('authenticated_timestamp');
  
  // Dispatch event for components to listen
  window.dispatchEvent(new CustomEvent('auth_state_changed', { 
    detail: { authenticated: false, address: null } 
  }));
};

export const signOut = () => {
  clearAuthentication();
  // Reload page to reset all state
  window.location.reload();
};
