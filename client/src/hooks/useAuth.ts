import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, handleAuthRedirect, signInWithGoogle, signOutUser } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import { User as AppUser } from "@shared/schema";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    // Check for test mode
    const isTestMode = localStorage.getItem('testMode') === 'true';
    setTestMode(isTestMode);
    
    if (isTestMode) {
      // Mock user for test mode
      const mockUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
      } as User;
      
      const mockAppUser = {
        id: 1,
        email: 'test@example.com',
        firebaseUid: 'test-user-123',
        username: 'Test User',
        currentStreak: 5,
        totalWorkouts: 12,
        createdAt: new Date(),
      } as AppUser;
      
      setUser(mockUser);
      setAppUser(mockAppUser);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Try to get existing user
          const response = await fetch(`/api/users/firebase/${firebaseUser.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setAppUser(userData);
          } else if (response.status === 404) {
            // Create new user
            const newUser = await apiRequest("POST", "/api/users", {
              email: firebaseUser.email,
              firebaseUid: firebaseUser.uid,
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              currentStreak: 0,
              totalWorkouts: 0,
            });
            const userData = await newUser.json();
            setAppUser(userData);
          }
        } catch (error) {
          console.error("Error managing user:", error);
        }
      } else {
        setAppUser(null);
      }
      
      setLoading(false);
    });

    // Handle redirect on app initialization
    handleAuthRedirect().then((user) => {
      if (user) {
        console.log("Redirect auth successful, user:", user);
      }
    }).catch((error) => {
      console.error("Redirect handling failed:", error);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (testMode) {
        localStorage.removeItem('testMode');
        window.location.reload();
        return;
      }
      await signOutUser();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return {
    user,
    appUser,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    testMode,
  };
}
