// src/components/GridCanvas.jsx
import { useState } from "react";

export default function GridCanvas({
  size,
  zones,
  selectedZoneId,
  cells, // 親から現在の状態を直接受け取る
  onCellsChange,
}) {
  // マウスが押されているかどうかの状態
  const [isDrawing, setIsDrawing] = useState(false);

  // セルを更新する共通処理
  // isDragMode: ドラッグ中の呼び出しかどうか
  const updateCell = (index, isDragMode) => {
    if (!selectedZoneId) return;

    // 現在のcellsをコピー
    const nextCells = { ...cells };
    const currentCellOwner = nextCells[index];

    if (isDragMode) {
      // ドラッグ中（なぞっている時）は、
      // 既に同じ色で塗られている場合は何もしない（ちらつき防止）
      if (currentCellOwner === selectedZoneId) return;
      
      // 違う色なら上書きする
      nextCells[index] = selectedZoneId;
    } else {
      // クリック（描き始め）の時
      // 同じ色なら削除（トグル）、違う色なら上書き
      if (currentCellOwner === selectedZoneId) {
        delete nextCells[index];
      } else {
        nextCells[index] = selectedZoneId;
      }
    }

    onCellsChange(nextCells);
  };

  const handleMouseDown = (index) => {
    setIsDrawing(true);
    // クリックした瞬間の処理（トグル動作含む）
    updateCell(index, false);
  };

  const handleMouseEnter = (index) => {
    if (isDrawing) {
      // マウスを押したまま移動してきた時の処理（強制上書き）
      updateCell(index, true);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    // グリッドの外に出たら描画モード終了
    setIsDrawing(false);
  };

  return (
    <div
      // グリッド全体からマウスが離れた時も描画終了
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: "2px", // 隙間を少し狭くしてドット絵っぽく
        maxWidth: "480px",
        margin: "0 auto",
        userSelect: "none", // ドラッグ時に文字選択されないようにする
        touchAction: "none", // スマホでのスクロール干渉を防ぐ（簡易的な対応）
      }}
    >
      {Array.from({ length: size * size }).map((_, index) => {
        const zoneId = cells[index];
        const zone = zones.find((z) => z.id === zoneId);

        return (
          <div
            key={index}
            // マウスイベントを設定
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            // スマホなどのタッチデバイスでも少し描きやすくするための簡易対応
            // (本格的なタッチ対応はもう少し複雑になりますが、まずはこれでタップ反応します)
            
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