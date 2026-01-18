// src/pages/IslandLayout.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactGA from "react-ga4";
import GridCanvas from "../components/GridCanvas";
import ZoneEditor from "../components/ZoneEditor";
import { loadLayout, saveLayout, DEFAULT_DATA } from "../utils/storage";

export default function IslandLayout() {
  const saved = loadLayout();

  // 初期ステートの設定
  const [zones, setZones] = useState(saved?.zones || DEFAULT_DATA.zones);
  const [cells, setCells] = useState(saved?.cells || DEFAULT_DATA.cells);
  const [selectedZoneId, setSelectedZoneId] = useState(
    saved?.selectedZoneId || DEFAULT_DATA.selectedZoneId
  );
  const [gridSize, setGridSize] = useState(
    saved?.gridSize || DEFAULT_DATA.gridSize
  );

  // ページビューの送信
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/layout" });
  }, []);

  // ローカルストレージへの自動保存
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

    ReactGA.event({
      category: "User Action",
      action: "reset_all",
    });
  };

  return (
    <div>
      <Link to="/" style={{ fontSize: "0.8rem", color: "#666", textDecoration: "none" }}>
        ← メニューへ戻る
      </Link>
      
      <h1 style={{ textAlign: "center", fontSize: "1.5rem", marginTop: "10px" }}>
        🏝 島レイアウト整理
      </h1>

      {/* グリッドサイズ切替 */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ marginBottom: "8px", fontSize: "0.9rem", color: "#666" }}>
          グリッドサイズ：
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "4px", flexWrap: "wrap" }}>
          {[8, 10, 12, 16].map((size) => (
            <button
              key={size}
              onClick={() => changeGridSize(size)}
              style={{
                padding: "6px 12px",
                borderRadius: "16px",
                border: gridSize === size ? "2px solid #333" : "1px solid #ccc",
                cursor: "pointer",
                background: gridSize === size ? "#fff" : "#f8f9fa",
                fontSize: "0.85rem"
              }}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={resetAll}
        style={{
          display: "block",
          margin: "0 auto 16px",
          padding: "6px 14px",
          borderRadius: "16px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          fontSize: "0.8rem",
          color: "#e03131"
        }}
      >
        🔄 全てリセット
      </button>

      {/* ゾーン編集エリア */}
      <ZoneEditor
        zones={zones}
        selectedZoneId={selectedZoneId}
        onSelect={setSelectedZoneId}
        onAdd={addZone}
        onUpdate={updateZone}
        onDelete={deleteZone}
      />

      {/* メインキャンバス */}
      <div style={{ marginTop: "20px" }}>
        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#888", marginBottom: "8px" }}>
          指でなぞって塗りつぶせます
        </p>
        <GridCanvas
          size={gridSize}
          zones={zones}
          selectedZoneId={selectedZoneId}
          cells={cells}
          onCellsChange={setCells}
        />
      </div>

      <footer style={{ marginTop: "40px", textAlign: "center", fontSize: "0.7rem", color: "#aaa" }}>
        © 2024 Island Layout Tool
      </footer>
    </div>
  );
}