import React, { useEffect, useState } from "react";
import { BOARD_SIZE, BOARD_SIZE_SM, BOARD_SIZE_XS } from "../../../constants/constants";
import PointBubble from "./PointBubble";

export default function Board({ points, onClickPoint, onPointGone, gameOver, autoplay, activePointId }) {
  const [boardSize, setBoardSize] = useState(BOARD_SIZE);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 375) {
        setBoardSize(BOARD_SIZE_XS);
      } else if (width < 640) {
        setBoardSize(BOARD_SIZE_SM);
      } else {
        setBoardSize(BOARD_SIZE);
      }
    };

    // Đặt kích thước ban đầu
    handleResize();

    // Thêm event listener
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mx-auto w-full" style={{ maxWidth: boardSize }}>
      <div
        className="relative aspect-square rounded-xl border bg-white"
        style={{ width: "100%" }}
      >
        {points.map((p) => {
          // Tính toán tỷ lệ vị trí dựa trên kích thước hiện tại
          const scaleFactor = boardSize / BOARD_SIZE;
          const scaledX = p.x * scaleFactor;
          const scaledY = p.y * scaleFactor;
          const scaledR = p.r * scaleFactor;

          return (
            <PointBubble
              key={p.id}
              id={p.id}
              x={scaledX}
              y={scaledY}
              r={scaledR}
              removed={p.removed}
              onClick={() => onClickPoint(p.id)}
              disabled={gameOver}
              onGone={() => onPointGone(p.id)}
              gameOver={gameOver}
              autoplay={autoplay}
              isActive={autoplay && activePointId === p.id}
            />
          );
        })}
      </div>
    </div>
  );
}
