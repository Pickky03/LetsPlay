import { useState } from "react";
import { generatePoints } from "../lib/geometry";
import { POINT_RADIUS, BOARD_SIZE } from "../constants/constants";

export function usePoints(initialCount) {
  const [count, setCount] = useState(initialCount);
  const [points, setPoints] = useState(() =>
    generatePoints(count, POINT_RADIUS, BOARD_SIZE).map((p) => ({
      ...p,
      removed: false,
    }))
  );

  const markRemoved = (id) => {
    setPoints((ps) =>
      ps.map((p) => (p.id === id ? { ...p, removed: true } : p))
    );
  };

  const finallyDelete = (id) => {
    setPoints((ps) => ps.filter((p) => p.id !== id));
  };

  const reset = (newCount = count) => {
    setCount(newCount);
    setPoints(
      generatePoints(newCount, POINT_RADIUS, BOARD_SIZE).map((p) => ({
        ...p,
        removed: false,
      }))
    );
  };

  return { points, markRemoved, finallyDelete, reset, count };
}
