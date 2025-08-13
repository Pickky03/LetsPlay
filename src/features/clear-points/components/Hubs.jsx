import React from "react";
import { formatMs } from "../../../lib/format";

export default function Hubs({ remaining, elapsedMs, onRestart }) {
  return (
    <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:gap-3">
      <div className="flex flex-col sm:space-y-1">
        <label className="text-xs sm:text-sm font-semibold">Time:</label>
        <input
          className="w-20 rounded-lg border px-2 py-1 text-sm border-none"
          value={formatMs(elapsedMs)}
          readOnly
        />
      </div>
      
      <button
        className="border px-3 py-1.5 text-xs font-medium  hover:bg-slate-50 active:bg-slate-100"
        onClick={onRestart}
      >
        Restart
      </button>
    </div>
  );
}
