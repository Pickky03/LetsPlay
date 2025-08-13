import React, { useEffect, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { usePoints } from "../../hooks/usePoints";
import Hubs from "./components/Hubs";
import Board from "./components/Board";
import AllClearedBanner from "./components/AllClearedBanner";

export default function Game() {
  const [initialPoints, setInitialPoints] = useState(10);
  const timer = useTimer();
  const { points, markRemoved, finallyDelete, reset } = usePoints(initialPoints);

  const remaining = points.filter((p) => !p.removed).length;
  const allGone = points.length === 0;

  useEffect(() => {
    timer.reset();
    timer.start();
  }, []);

  useEffect(() => {
    if (allGone && timer.running) timer.stop();
  }, [allGone, timer]);

  const handleRestart = () => {
    timer.reset();
    reset(initialPoints);
    timer.start();
  };

  const handleClickPoint = (id) => {
    if (!timer.running) timer.start();
    markRemoved(id);
  };

  const handlePointGone = (id) => {
    finallyDelete(id);
  };

  return (
    <main className="p-2 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border bg-white p-2 sm:p-4 shadow-sm">
          <h1 className="text-lg sm:text-xl font-bold">LET&apos;S PLAY</h1>

          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <label className="text-sm font-medium">Points:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={initialPoints}
              onChange={(e) => setInitialPoints(Number(e.target.value))}
              className="w-16 sm:w-20 border px-2 py-1 text-sm rounded"
            />
          </div>

          <div className="mt-3 sm:mt-4">
            <Hubs
              remaining={remaining}
              elapsedMs={timer.elapsedMs}
              onRestart={handleRestart}
            />
          </div>

          <div className="mt-4 sm:mt-6">
            <Board
              points={points}
              onClickPoint={handleClickPoint}
              onPointGone={handlePointGone}
            />
          </div>

          <AllClearedBanner show={allGone} />
        </div>
      </div>
    </main>
  );
}
