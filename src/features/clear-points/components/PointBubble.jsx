import React, { useState, useEffect, useRef } from "react";
import { REMOVE_ANIM_DURATION, POINT_COUNTDOWN_DURATION } from "../../../constants/constants";

export default function PointBubble({
  id,
  x,
  y,
  r,
  removed,
  onClick,
  onGone,
  gameOver,
  disabled,
  autoplay,
  isActive,
}) {
  const [countdown, setCountdown] = useState(null);
  const rafId = useRef(null);
  const startTime = useRef(null);
  const calledGone = useRef(false);

  // Reset lại khi id hoặc removed false (hồi sinh điểm)
  useEffect(() => {
    setCountdown(null);
    startTime.current = null;
    cancelAnimationFrame(rafId.current);
    calledGone.current = false;
  }, [id, removed]);

  // Bắt đầu countdown khi removed === true
  useEffect(() => {
    if (!removed || gameOver) return;

    startTime.current = performance.now();

    const update = (now) => {
      const elapsed = now - startTime.current;
      const remain = Math.max(0, POINT_COUNTDOWN_DURATION - elapsed);
      const remainSec = remain / 1000;

      setCountdown(remainSec);

      if (remain <= 0 && !calledGone.current) {
        calledGone.current = true;
        if (typeof onGone === "function") onGone();
        return; // stop loop
      }

      rafId.current = requestAnimationFrame(update);
    };

    rafId.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, [removed, gameOver]);

  const opacity =
    removed && countdown !== null
      ? Math.max(0, Math.min(1, (countdown * 1000) / POINT_COUNTDOWN_DURATION))
      : 1;

  const shouldShrink = removed && countdown !== null && countdown <= 0;

  const style = {
    left: x - r,
    top: y - r,
    width: r * 2,
    height: r * 2,
    zIndex: removed ? 100 : 1,
    opacity,
    transition: `transform ${REMOVE_ANIM_DURATION}ms linear`,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "absolute grid place-items-center select-none",
        "rounded-full border text-sm font-semibold",
        removed ? "bg-red-100 text-red-600" : "bg-white",
        shouldShrink ? "scale-90" : "scale-100",
        "will-change-[opacity,transform]",
      ].join(" ")}
      style={style}
    >
      <div className="flex flex-col items-center">
        <span>{id}</span>
        {countdown !== null && countdown > 0 && (
          <span className={`text-xs ${removed ? "text-red-600" : "text-blue-600"}`}>
            {(Math.ceil(countdown * 10) / 10).toFixed(1)}s
          </span>
        )}
      </div>
    </button>
  );
}
