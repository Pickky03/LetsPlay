import React from "react";
import { formatMs } from "../../../lib/format";

export default function Hubs({ remaining, elapsedMs, onStart, gameStarted, autoplay, onToggleAutoplay }) {
  return (
    <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:gap-3">
      <div className=" sm:space-y-1">
        <label className="text-xs sm:text-sm font-semibold">Time:</label>
        <input
          className="w-20 rounded-lg border px-2 py-1 text-sm border-none"
          value={formatMs(elapsedMs)}
          readOnly
        />
      </div>
      <div className="flex gap-2">
        <button
          className="border px-3 py-1.5 text-xs font-medium hover:bg-slate-50 active:bg-slate-100"
          onClick={onStart}
        >
          {gameStarted ? "Restart" : "Start"}
        </button>
        
        {gameStarted && (
          <button
            className={`border px-3 py-1.5 text-xs font-medium hover:bg-slate-50 active:bg-slate-100 ${
              autoplay ? "bg-blue-100 text-blue-700" : ""
            }`}
            onClick={onToggleAutoplay}
          >
            Autoplay {autoplay ? "OFF" : "ON"}
          </button>
        )}
      </div>
    </div>
  );
}
