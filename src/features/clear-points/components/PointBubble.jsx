import React, { useState, useEffect } from "react";
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
  const [intervalId, setIntervalId] = useState(null);
  
  // Reset countdown khi component được tạo mới (restart) hoặc khi prop removed thay đổi từ true về false
  useEffect(() => {
    setCountdown(null);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [id]);
  
  // Đảm bảo reset countdown khi removed chuyển từ true về false (khi restart)
  useEffect(() => {
    if (!removed && countdown !== null) {
      setCountdown(null);
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [removed]);
  
  // Dừng countdown khi game over
  useEffect(() => {
    if (gameOver && intervalId) {
      clearInterval(intervalId);
    }
  }, [gameOver, intervalId]);
  
  useEffect(() => {
    if (removed) {
      // Bắt đầu đếm ngược 3s khi điểm được nhấn
      setCountdown(3.0);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 0.1) {
            clearInterval(interval);
            return 0;
          }
          return +(prev - 0.1).toFixed(1);
        });
      }, 100);
      
      setIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, [removed]);

  const style = {
    left: x - r,
    top: y - r,
    width: r * 2,
    height: r * 2,
    // Khi là điểm đang active trong chế độ autoplay, hiển thị phía trên các điểm khác
    zIndex: isActive ? 100 : 1,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onTransitionEnd={(e) => {
        // đảm bảo transition opacity/transform kết thúc của chính phần tử
        if (e.target === e.currentTarget && removed && countdown <= 0) {
          // chờ đúng bằng thời lượng để chắc chắn
          setTimeout(onGone, 0);
        }
      }}
      className={[
        "absolute grid place-items-center select-none",
        "rounded-full border text-sm font-semibold",
        "transition",
        `duration-[${REMOVE_ANIM_DURATION}ms]`,
        removed ? "opacity-50 bg-red-100 text-red-600" : "opacity-100 scale-100 bg-white",
        countdown === 0 ? "opacity-0 scale-90" : "",
      ].join(" ")}
      style={style}
    >
      <div className="flex flex-col items-center">
        <span>{id}</span>
        {countdown !== null && countdown > 0 && (
          <span className={`text-xs ${removed ? "text-red-600" : "text-blue-600"}`}>{countdown.toFixed(1)}s</span>
        )}
      </div>
    </button>
  );
}
