import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppBanner } from "@/components/AppBanner";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { SaveStatusIndicator } from "@/components/SaveStatusIndicator";
import { InstallPWAPrompt } from "@/components/InstallPWAPrompt";
import { Dashboard } from "@/pages/Dashboard";
import { Workout } from "@/pages/Workout";
import { Login } from "@/pages/Login";
import { useAuth } from "@/hooks/useAuth";
import { useWorkout } from "@/hooks/useWorkout";
import NotFound from "@/pages/not-found";

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentWorkoutDay, setCurrentWorkoutDay] = useState<'A' | 'B' | 'C' | null>(null);
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const { startWorkout, saveStatus, currentSession } = useWorkout();

  // Auto-detect current workout from session
  useEffect(() => {
    if (currentSession?.currentWorkout) {
      setCurrentWorkoutDay(currentSession.currentWorkout);
      // Auto-navigate to workout page if we have an active session
      if (location === '/' && currentSession.currentWorkout) {
        setLocation('/workout');
      }
    }
  }, [currentSession, location, setLocation]);

  const handleStartWorkout = (day: 'A' | 'B' | 'C') => {
    startWorkout(day);
    setCurrentWorkoutDay(day);
    setLocation('/workout');
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">💪</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Loading FitnessWise...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBanner onMenuToggle={handleMenuToggle} />
      <NavigationSidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose}
        onStartWorkout={handleStartWorkout}
      />
      
      <main className="pt-20">
        <Switch>
          <Route path="/">
            <Dashboard onStartWorkout={handleStartWorkout} />
          </Route>
          <Route path="/workout">
            {currentWorkoutDay ? (
              <Workout workoutDay={currentWorkoutDay} />
            ) : (
              <Dashboard onStartWorkout={handleStartWorkout} />
            )}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>

      <SaveStatusIndicator status={saveStatus} />
      <InstallPWAPrompt />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
