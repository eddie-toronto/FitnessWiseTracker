import { useState, useEffect, useCallback } from "react";
import { TimerState } from "@/lib/types";

export function useTimer(initialState?: TimerState) {
  const [timerState, setTimerState] = useState<TimerState>(
    initialState || {
      running: false,
      elapsed: 0,
    }
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.running) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          elapsed: prev.elapsed + 1,
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState.running]);

  const startTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      running: true,
      startTime: prev.startTime || Date.now(),
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      running: false,
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState({
      running: false,
      elapsed: 0,
    });
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    setTimerState,
  };
}
