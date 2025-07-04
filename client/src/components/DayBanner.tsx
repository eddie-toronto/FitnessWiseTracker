import { useState, useEffect } from "react";
import { Play, Pause, Square, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/hooks/useTimer";
import { TimerState } from "@/lib/types";

interface DayBannerProps {
  workoutDay: 'A' | 'B' | 'C';
  title: string;
  description: string;
  timerState: TimerState;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onCompleteWorkout: () => void;
}

export function DayBanner({
  workoutDay,
  title,
  description,
  timerState,
  onStartTimer,
  onPauseTimer,
  onCompleteWorkout,
}: DayBannerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [scrollMinimized, setScrollMinimized] = useState(false);
  const { formatTime } = useTimer();

  // Amazon-style scroll minimization behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldMinimize = scrollY > 100; // Minimize after scrolling 100px
      setScrollMinimized(shouldMinimize);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Combined minimized state (manual or scroll-based)
  const effectiveMinimized = isMinimized || scrollMinimized;

  const dayTitles = {
    A: "Day A: Vertical Pull Focus",
    B: "Day B: Horizontal Pull & Barbell",
    C: "Day C: Power & Mixed Patterns"
  };

  const dayDescriptions = {
    A: "Building pull-up strength and lat development for that coveted V-taper",
    B: "Building back thickness and strength with horizontal movements",
    C: "Explosive strength and varied movement patterns"
  };

  return (
    <div className={`day-banner bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm transition-all duration-300 ${
      effectiveMinimized ? 'p-2' : 'p-4'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Full state header */}
        {!effectiveMinimized && (
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{dayTitles[workoutDay]}</h2>
              <p className="text-gray-600">{dayDescriptions[workoutDay]}</p>
            </div>
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-600 min-h-[44px] min-w-[44px]"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Minimized state header */}
        {effectiveMinimized && !scrollMinimized && (
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-bold text-gray-800">{dayTitles[workoutDay]}</div>
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-600 min-h-[44px] min-w-[44px]"
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Full state - timer controls and display */}
        {!effectiveMinimized && (
          <>
            {/* Timer Controls */}
            <div className="flex flex-row items-center justify-center gap-3 mb-4 flex-wrap">
              <Button
                onClick={onStartTimer}
                disabled={timerState.running}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white min-h-[40px] px-4 shadow-lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              
              <Button
                onClick={onPauseTimer}
                disabled={!timerState.running}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white min-h-[40px] px-4 shadow-lg"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              
              <Button
                onClick={onCompleteWorkout}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white min-h-[40px] px-4 shadow-lg"
              >
                <Square className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </div>

            {/* Timer Display */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-800 mb-2">
                {formatTime(timerState.elapsed)}
              </div>
              <div className="text-gray-500 font-medium">
                {timerState.running ? "WORKOUT IN PROGRESS" : "READY TO START YOUR WORKOUT"}
              </div>
            </div>
          </>
        )}

        {/* Minimized state - timer only (Amazon-style) */}
        {effectiveMinimized && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-xl font-bold text-gray-800">
                {formatTime(timerState.elapsed)}
              </div>
              <div className={`w-3 h-3 rounded-full ${
                timerState.running ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
              }`} />
            </div>
            
            {/* Quick action buttons in minimized state */}
            <div className="flex items-center space-x-2">
              {!timerState.running ? (
                <Button
                  onClick={onStartTimer}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white min-h-[36px]"
                >
                  <Play className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  onClick={onPauseTimer}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white min-h-[36px]"
                >
                  <Pause className="h-3 w-3" />
                </Button>
              )}
              
              {/* Expand button when scroll minimized */}
              {scrollMinimized && (
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 min-h-[36px]"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
