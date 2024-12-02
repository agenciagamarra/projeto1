import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialTime: number, onTimeUp: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(true);

  const startTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsPaused(false);
  }, [initialTime]);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft, onTimeUp]);

  return {
    timeLeft,
    isPaused,
    startTimer,
    pauseTimer
  };
}