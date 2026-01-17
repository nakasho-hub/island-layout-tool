// src/App.jsx
import { useEffect, useState } from "react";
// 1. ライブラリをインポート
import ReactGA from "react-ga4";
import GridCanvas from "./components/GridCanvas";
import ZoneEditor from "./components/ZoneEditor";
import { loadLayout, saveLayout, DEFAULT_DATA } from "./utils/storage";

// 2. 測定IDを設定（ご自身のIDに書き換えてください）
const TRACKING_ID = "G-0VVD44Z6LT"; 
ReactGA.initialize(TRACKING_ID);

export default function App() {
  const saved = loadLayout();

  const [zones, setZones] = useState(saved?.zones || DEFAULT_DATA.zones);
  const [cells, setCells] = useState(saved?.cells || DEFAULT_DATA.cells);
  const [selectedZoneId, setSelectedZoneId] = useState(
    saved?.selectedZoneId || DEFAULT_DATA.selectedZoneId
  );
  const [gridSize, setGridSize] = useState(
    saved?.gridSize || DEFAULT_DATA.gridSize
  );

  // 3. 初回読み込み時にページビューを送信
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  useEffect(() => {
    saveLayout({ zones, cells, selectedZoneId, gridSize });
  }, [zones, cells, selectedZoneId, gridSize]);

  const addZone = () => {
    const id = `zone-${Date.now()}`;
    setZones([
      ...zones,
      { id, name: "新ゾーン", color: "#dee2e6", memo: "" },
    ]);
    setSelectedZoneId(id);

    // 4. イベント計測（ゾーン追加ボタンが押されたとき）
    ReactGA.event({
      category: "User Action",
      action: "add_zone",
      label: "New Zone Created",
    });
  };

  const updateZone = (id, patch) => {
    setZones(zones.map((z) => (z.id === id ? { ...z, ...patch } : z)));
  };

  const deleteZone = (id) => {
    setZones(zones.filter((z) => z.id !== id));
    setCells((prev) => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (v !== id) next[k] = v;
      });
      return next;
    });
    setSelectedZoneId(DEFAULT_DATA.selectedZoneId);
  };

  // グリッドサイズ変更処理
  const changeGridSize = (size) => {
    const maxIndex = size * size;
    const nextCells = {};

    Object.entries(cells).forEach(([index, zoneId]) => {
      if (Number(index) < maxIndex) {
        nextCells[index] = zoneId;
      }
    });

    setGridSize(size);
    setCells(nextCells);

    // 5. イベント計測（グリッドサイズ変更）
    ReactGA.event({
      category: "User Action",
      action: "change_grid_size",
      value: size,
    });
  };

  const resetAll = () => {
    if (!window.confirm("すべて初期状態に戻しますか？")) return;
    localStorage.removeItem("island-layout-data");
    setZones(DEFAULT_DATA.zones);
    setCells(DEFAULT_DATA.cells);
    setSelectedZoneId(DEFAULT_DATA.selectedZoneId);
    setGridSize(DEFAULT_DATA.gridSize);

    // 6. イベント計測（リセット）
    ReactGA.event({
      category: "User Action",
      action: "reset_all",
    });
  };

  return (
    <div style={{ padding: "16px", maxWidth: "720px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>🏝 あつ森 島レイアウト整理ツール</h1>

      {/* グリッドサイズ切替 */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <span>グリッドサイズ：</span>
        {[8, 10, 12, 16].map((size) => (
          <button
            key={size}
            onClick={() => changeGridSize(size)}
            style={{
              margin: "0 4px",
              padding: "4px 10px",
              borderRadius: "12px",
              border:
                gridSize === size ? "2px solid #333" : "1px solid #ccc",
              cursor: "pointer",
              background: gridSize === size ? "#fff" : "#f8f9fa",
            }}
          >
            {size}×{size}
          </button>
        ))}
      </div>

      <button
        onClick={resetAll}
        style={{
          display: "block",
          margin: "0 auto 16px",
          padding: "6px 14px",
          borderRadius: "16px",
          border: "1px solid #ccc",
          background: "#f1f3f5",
          cursor: "pointer",
        }}
      >
        🔄 初期状態に戻す
      </button>

      <ZoneEditor
        zones={zones}
        selectedZoneId={selectedZoneId}
        onSelect={setSelectedZoneId}
        onAdd={addZone}
        onUpdate={updateZone}
        onDelete={deleteZone}
      />

      <GridCanvas
        size={gridSize}
        zones={zones}
        selectedZoneId={selectedZoneId}
        cells={cells}
        onCellsChange={setCells}
      />
    </div>
  );
}