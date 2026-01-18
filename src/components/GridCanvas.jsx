import { useState, useRef } from "react";

export default function GridCanvas({
  size,
  zones,
  selectedZoneId,
  cells,
  onCellsChange,
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef(null);

  // 指定した座標（x, y）にあるセルを取得して更新する関数
  const updateCellAtPosition = (x, y, isDragMode) => {
    if (!selectedZoneId) return;

    // 指/マウスの下にある要素を特定
    const target = document.elementFromPoint(x, y);
    if (!target || !target.dataset.index) return;

    const index = parseInt(target.dataset.index);
    const nextCells = { ...cells };
    const currentCellOwner = nextCells[index];

    if (isDragMode) {
      if (currentCellOwner === selectedZoneId) return;
      nextCells[index] = selectedZoneId;
    } else {
      if (currentCellOwner === selectedZoneId) {
        delete nextCells[index];
      } else {
        nextCells[index] = selectedZoneId;
      }
    }
    onCellsChange(nextCells);
  };

  // --- タッチイベント（スマホ用） ---
  const handleTouchStart = (e) => {
    setIsDrawing(true);
    const touch = e.touches[0];
    updateCellAtPosition(touch.clientX, touch.clientY, false);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    updateCellAtPosition(touch.clientX, touch.clientY, true);
  };

  // --- マウスイベント（PC用） ---
  const handleMouseDown = (e, index) => {
    setIsDrawing(true);
    updateCellAtPosition(e.clientX, e.clientY, false);
  };

  const handleMouseMove = (e) => {
    if (isDrawing) {
      updateCellAtPosition(e.clientX, e.clientY, true);
    }
  };

  const stopDrawing = () => setIsDrawing(false);

  return (
    <div
      ref={containerRef}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchEnd={stopDrawing}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: "2px",
        maxWidth: "100%", // スマホ幅に合わせる
        aspectRatio: "1 / 1",
        margin: "0 auto",
        userSelect: "none",
        touchAction: "none", // スクロールを無効化して描画を優先
      }}
    >
      {Array.from({ length: size * size }).map((_, index) => {
        const zoneId = cells[index];
        const zone = zones.find((z) => z.id === zoneId);

        return (
          <div
            key={index}
            data-index={index} // 座標からセルを特定するために付与
            onMouseDown={(e) => handleMouseDown(e, index)}
            style={{
              aspectRatio: "1 / 1",
              border: "1px solid #e0e0e0",
              backgroundColor: zone ? zone.color : "#ffffff",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          />
        );
      })}
    </div>
  );
}