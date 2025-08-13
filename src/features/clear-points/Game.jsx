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
  const remaining = points.filter((p) => !p.removed).length;
  const allGone = points.length === 0;
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    timer.reset();
    // Không tự động bắt đầu khi mới vào trang
  }, []);

  useEffect(() => {
    if ((allGone || gameOver) && timer.running) timer.stop();
  }, [allGone, gameOver, timer]);

  const handleStart = () => {
    // Đảm bảo timer được reset hoàn toàn trước khi bắt đầu lại
    timer.reset();
    // Đảm bảo các điểm được reset
    reset(initialPoints);
    // Bắt đầu timer
    setTimeout(() => {
      timer.start();
    }, 0);
    setGameStarted(true);
    setGameOver(false);
    setAutoplay(false);
  };

  const handleClickPoint = (id) => {
    if (!gameStarted) return;
    if (gameOver) return;
    // Nếu đang ở chế độ autoplay, không cho phép người dùng bấm
    if (autoplay) return;
    
    // Kiểm tra nếu người dùng bấm đúng thứ tự (từ nhỏ đến lớn)
    const currentPoint = points.find(p => p.id === id);
    const smallerPoints = points.filter(p => p.id < id && !p.removed);
    
    if (smallerPoints.length > 0) {
      // Nếu còn số nhỏ hơn chưa bấm, game over
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
  
    let timeoutId;
  
    const autoplayNext = () => {
      const next = pointsRef.current
        .filter(p => !p.removed)
        .sort((a, b) => a.id - b.id)[0];
  
      if (!next) {
        setActivePointId(null);
        return;
      }
      
      // Cập nhật activePointId trước khi đánh dấu removed
      setActivePointId(next.id);
      markRemoved(next.id);
      timeoutId = setTimeout(autoplayNext, 500);
    };
  
    timeoutId = setTimeout(autoplayNext, 500);
    return () => {
      clearTimeout(timeoutId);
      setActivePointId(null);
    };
  }, [autoplay, gameStarted, gameOver]);
  

  const toggleAutoplay = () => {
    const newAutoplayState = !autoplay;
    setAutoplay(newAutoplayState);
    
    // Đảm bảo timer bắt đầu chạy ngay khi bật autoplay
    if (newAutoplayState && gameStarted && !timer.running) {
      timer.start();
    }
    
    // Hiển thị nút với văn bản phù hợp
    const buttonText = newAutoplayState ? "OFF" : "ON";
  };

  return (
    <main className="p-2 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border bg-white p-2 sm:p-4 shadow-sm">
          <h1 className="text-lg sm:text-xl font-bold">LET&apos;S PLAY</h1>

          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <label className="text-sm font-medium">Số điểm:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={initialPoints}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1) {
                  setInitialPoints(value);
                }
              }}
              className="w-16 sm:w-20 border px-2 py-1 text-sm rounded"
              disabled={gameStarted}
            />
            {gameStarted && (
              <span className="text-xs text-gray-500">
                (Khởi động lại để thay đổi số điểm)
              </span>
            )}
          </div>

          <div className="mt-3 sm:mt-4 flex justify-between">
            <Hubs
              remaining={remaining}
              elapsedMs={timer.elapsedMs}
              onStart={handleStart}
              gameStarted={gameStarted}
            />
            
            {gameStarted && (
              <button
                className={`border px-3 py-1.5 text-xs font-medium hover:bg-slate-50 active:bg-slate-100 ${
                  autoplay ? "bg-blue-100 text-blue-700" : ""
                }`}
                onClick={toggleAutoplay}
              >
                Autoplay {autoplay ? "OFF" : "ON"}
              </button>
            )}
          </div>

          <div className="mt-4 sm:mt-6">
            <Board
              points={points}
              onClickPoint={handleClickPoint}
              onPointGone={handlePointGone}
              gameOver={gameOver}
              autoplay={autoplay}
              activePointId={activePointId}
            />
          </div>

          <AllClearedBanner show={allGone} />
          <GameOverBanner show={gameOver} />
        </div>
      </div>
    </main>
  );
}
