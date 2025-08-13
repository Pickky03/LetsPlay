import { useEffect, useRef, useState } from "react";

export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  const tick = (t) => {
    if (!startRef.current) startRef.current = t;
    setElapsedMs(t - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    setRunning(true);
    startRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const reset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setElapsedMs(0);
    setRunning(false);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { elapsedMs, running, start, stop, reset };
}
