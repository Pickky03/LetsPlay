// Tạo vị trí ngẫu nhiên, tránh chồng lấp đơn giản
export function generatePoints(n, r, size) {
    const pts = [];
    const margin = 8; // khoảng cách tối thiểu giữa các vòng
  
    for (let i = 0; i < n; i++) {
      let ok = false;
      let x, y;
      let tries = 0;
  
      while (!ok && tries < 6000) {
        x = r + Math.random() * (size - 2 * r);
        y = r + Math.random() * (size - 2 * r);
  
        ok = pts.every((p) => {
          const dx = p.x - x;
          const dy = p.y - y;
          const minDist = p.r + r + margin;
          return dx * dx + dy * dy > minDist * minDist;
        });
        tries++;
      }
  
      pts.push({ id: i + 1, x, y, r });
    }
    return pts;
  }
  