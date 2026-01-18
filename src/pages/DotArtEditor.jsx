// src/pages/DotArtEditor.jsx
import { useState, useEffect } from "react"; // useEffectを追加
import { Link } from "react-router-dom";
import GridCanvas from "../components/GridCanvas";
import { loadDotArt, saveDotArt } from "../utils/storage"; // storage関数をインポート

export default function DotArtEditor() {
  // 初期値としてlocalStorageから読み込む
  const [cells, setCells] = useState(() => {
    return loadDotArt() || {};
  });
  const [selectedColor, setSelectedColor] = useState("#FF0000");

  // cellsが更新されるたびに自動保存
  useEffect(() => {
    saveDotArt(cells);
  }, [cells]);

  const currentZoneId = selectedColor;

  const usedColors = Array.from(new Set(Object.values(cells)));
  if (!usedColors.includes(selectedColor)) {
    usedColors.push(selectedColor);
  }

  const zones = usedColors.map((color) => ({
    id: color,
    color: color,
    name: color,
  }));

  const clearCanvas = () => {
    if (window.confirm("キャンバスを真っ白に戻しますか？")) {
      setCells({});
    }
  };

  return (
    <div style={{ touchAction: "none" }}>
      <Link to="/" style={{ fontSize: "0.8rem", color: "#666", textDecoration: "none" }}>
        ← メニューへ戻る
      </Link>
      
      <h2 style={{ textAlign: "center", fontSize: "1.2rem", margin: "10px 0" }}>
        🎨 マイデザ練習（32×32）
      </h2>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "15px" }}>
        <input 
          type="color" 
          value={selectedColor} 
          onChange={(e) => setSelectedColor(e.target.value)}
          style={{ width: "50px", height: "50px", border: "2px solid #ddd", borderRadius: "8px" }}
        />
        <button onClick={clearCanvas} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc" }}>
          リセット
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
        <GridCanvas
          size={32}
          zones={zones}
          selectedZoneId={currentZoneId}
          cells={cells}
          onCellsChange={setCells}
        />
      </div>
    </div>
  );
}