// src/components/GridCanvas.jsx
import { useState } from "react";

export default function GridCanvas({
  size,
  zones,
  selectedZoneId,
  cells,
  onCellsChange,
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  const updateCellFromPoint = (x, y, isDragMode) => {
    if (!selectedZoneId) return;

    const target = document.elementFromPoint(x, y);
    if (!target) return;

    const cellElement = target.closest("[data-index]");
    if (!cellElement) return;

    const index = parseInt(cellElement.dataset.index);
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

  const handlePointerDown = (e) => {
    setIsDrawing(true);
    if (e.cancelable) e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    updateCellFromPoint(e.clientX, e.clientY, false);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    updateCellFromPoint(e.clientX, e.clientY, true);
  };

  const handlePointerUp = (e) => {
    setIsDrawing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: "1px",
        maxWidth: "100%",
        aspectRatio: "1 / 1",
        margin: "0 auto",
        userSelect: "none",
        background: "#ddd",
        border: "1px solid #ddd",
        touchAction: "none", 
      }}
    >
      {Array.from({ length: size * size }).map((_, index) => {
        const zoneId = cells[index];
        const zone = zones.find((z) => z.id === zoneId);

        return (
          <div
            key={index}
            data-index={index}
            style={{
              aspectRatio: "1 / 1",
              backgroundColor: zone ? zone.color : "#ffffff",
            }}
          />
        );
      })}
    </div>
  );
}