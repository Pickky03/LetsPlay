import React from "react";
import { REMOVE_ANIM_DURATION } from "../../../constants/constants";

export default function PointBubble({
  id,
  x,
  y,
  r,
  removed,
  onClick,
  onGone,
}) {
  const style = {
    left: x - r,
    top: y - r,
    width: r * 2,
    height: r * 2,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onTransitionEnd={(e) => {
        // đảm bảo transition opacity/transform kết thúc của chính phần tử
        if (e.target === e.currentTarget && removed) {
          // chờ đúng bằng thời lượng để chắc chắn
          setTimeout(onGone, 0);
        }
      }}
      className={[
        "absolute grid place-items-center select-none",
        "rounded-full border text-sm font-semibold",
        "transition",
        `duration-[${REMOVE_ANIM_DURATION}ms]`,
        removed ? "opacity-0 scale-90" : "opacity-100 scale-100",
        "bg-white",
      ].join(" ")}
      style={style}
    >
      {id}
    </button>
  );
}
