import { useState } from "react";
import { Menu, Flame, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface AppBannerProps {
  onMenuToggle: () => void;
}

export function AppBanner({ onMenuToggle }: AppBannerProps) {
  const { appUser, isAuthenticated, login, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">💪</div>
          <h1 className="text-xl font-bold">FitnessWise</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
              <Flame className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">{appUser?.currentStreak || 0}</span>
            </div>
          )}
          
          {isAuthenticated ? (
            <Button 
              onClick={logout}
              variant="ghost" 
              className="bg-white/20 hover:bg-white/30 text-white border-0 min-h-[44px]"
            >
              Logout
            </Button>
          ) : (
            <Button 
              onClick={login}
              variant="ghost" 
              className="bg-white/20 hover:bg-white/30 text-white border-0 min-h-[44px]"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
          
          <Button
            onClick={onMenuToggle}
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/20 min-h-[44px] min-w-[44px]"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
