// src/components/GridCanvas.jsx
import { useState, useRef } from "react";

export default function GridCanvas({
  size,
  zones,
  selectedZoneId,
  cells,
  onCellsChange,
}) {
  const [isDrawing, setIsDrawing] = useState(false);

  // 座標からセルを特定して更新する関数
  const updateCellFromPoint = (x, y, isDragMode) => {
    if (!selectedZoneId) return;

    // 指/マウスの下にある要素を特定
    const target = document.elementFromPoint(x, y);
    if (!target) return;

    // data-index 属性を持つ要素（セル）を探す
    const cellElement = target.closest("[data-index]");
    if (!cellElement) return;

    const index = parseInt(cellElement.dataset.index);
    const nextCells = { ...cells };
    const currentCellOwner = nextCells[index];

    if (isDragMode) {
      // なぞり中は、既に同じ色ならスキップ（負荷軽減）
      if (currentCellOwner === selectedZoneId) return;
      nextCells[index] = selectedZoneId;
    } else {
      // 最初の一押し：同じ色なら消す（トグル）、違う色なら塗る
      if (currentCellOwner === selectedZoneId) {
        delete nextCells[index];
      } else {
        nextCells[index] = selectedZoneId;
      }
    }
    onCellsChange(nextCells);
  };

  const handlePointerDown = (e) => {
    // 描画開始
    setIsDrawing(true);
    // ブラウザのスクロール等を防ぐ
    if (e.cancelable) e.preventDefault();
    // ターゲットのキャプチャ（要素外に出てもイベントを拾うようにする）
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
      // Pointer Events を使用（マウスとタッチ両対応）
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: "2px",
        maxWidth: "100%",
        aspectRatio: "1 / 1",
        margin: "0 auto",
        userSelect: "none",
        // これが重要：ブラウザのスクロール動作を無効化
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
              border: "1px solid #e0e0e0",
              backgroundColor: zone ? zone.color : "#ffffff",
              borderRadius: "4px",
              // pointer-events: none にしない（elementFromPointで拾うため）
            }}
          />
        );
      })}
    </div>
  );
}