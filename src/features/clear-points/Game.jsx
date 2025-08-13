import React, { useEffect, useState, useRef } from "react";
import { useTimer } from "../../hooks/useTimer";
import { usePoints } from "../../hooks/usePoints";
import Hubs from "./components/Hubs";
import Board from "./components/Board";
import AllClearedBanner from "./components/AllClearedBanner";
import GameOverBanner from "./components/GameOverBanner";
import { DEFAULT_POINTS } from "../../constants/constants";

export default function Game() {
  const [initialPoints, setInitialPoints] = useState(DEFAULT_POINTS);
  const [gameStarted, setGameStarted] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [activePointId, setActivePointId] = useState(null);
  const timer = useTimer();
  const { points, markRemoved, finallyDelete, reset } = usePoints(initialPoints);
  const pointsRef = useRef(points);
  const nextPoint = points
  .filter((p) => !p.removed)
  .sort((a, b) => a.id - b.id)[0];


  const remaining = points.filter((p) => !p.removed).length;
  const allGone = points.length === 0;

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    timer.reset();
  }, []);

  useEffect(() => {
    if ((allGone || gameOver) && timer.running) timer.stop();
  }, [allGone, gameOver, timer]);

  const handleStart = () => {
    timer.reset();
    reset(initialPoints);
    setTimeout(() => {
      timer.start();
    }, 0);
    setGameStarted(true);
    setGameOver(false);
    setAutoplay(false);
  };

  const handleClickPoint = (id) => {
    if (!gameStarted || gameOver || autoplay) return;

    const smallerPoints = points.filter((p) => p.id < id && !p.removed);
    if (smallerPoints.length > 0) {
      setGameOver(true);
      timer.stop();
      return;
    }

    if (!timer.running) timer.start();
    markRemoved(id);
  };

  const handlePointGone = (id) => {
    finallyDelete(id);
  };

  useEffect(() => {
    if (!autoplay || !gameStarted || gameOver) {
      setActivePointId(null);
      return;
    }

    const interval = setInterval(() => {
      const next = pointsRef.current
        .filter((p) => !p.removed)
        .sort((a, b) => a.id - b.id)[0];

      if (!next) {
        clearInterval(interval);
        setActivePointId(null);
        return;
      }

      setActivePointId(next.id);
      markRemoved(next.id);
    }, 500);

    return () => clearInterval(interval);
  }, [autoplay, gameStarted, gameOver]);

  const toggleAutoplay = () => {
    const newState = !autoplay;
    setAutoplay(newState);
    if (newState && gameStarted && !timer.running) {
      timer.start();
    }
  };

  return (
    <main className="p-2 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border bg-white p-2 sm:p-4 shadow-sm">
          <h1 className={`text-lg sm:text-xl font-bold ${gameOver ? "text-red-600" : allGone ? "text-green-600" : ""}`}>
            {gameOver ? "GAME OVER" : allGone ? "ALL CLEARED" : "LET'S PLAY"}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium">Số điểm:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={initialPoints}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1) setInitialPoints(value);
              }}
              className="w-16 border px-2 py-1 text-sm rounded"
              disabled={gameStarted}
            />
            {gameStarted && (
              <span className="text-xs text-gray-500">
                (Khởi động lại để thay đổi số điểm)
              </span>
            )}
          </div>

          <div className="mt-3">
            <Hubs
              remaining={remaining}
              elapsedMs={timer.elapsedMs}
              onStart={handleStart}
              gameStarted={gameStarted}
              autoplay={autoplay}
              onToggleAutoplay={toggleAutoplay}
            />
          </div>

          <div className="mt-4">
            <Board
              points={points}
              onClickPoint={handleClickPoint}
              onPointGone={handlePointGone}
              gameOver={gameOver}
              autoplay={autoplay}
              activePointId={activePointId}
            />
          </div>
          {gameStarted && (
            <div className="mt-4"> next: {nextPoint?.id}</div>
          )}
        </div>
      </div>
    </main>
  );
}
