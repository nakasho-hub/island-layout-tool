// src/App.jsx
import { useEffect, useState } from "react";
import GridCanvas from "./components/GridCanvas";
import ZoneEditor from "./components/ZoneEditor";

const STORAGE_KEY = "island-layout-data";

const DEFAULT_DATA = {
  zones: [
    {
      id: "zone-1",
      name: "住宅",
      color: "#cfe8ff",
      memo: "住民同士の距離を近めに配置",
    },
    {
      id: "zone-2",
      name: "商業",
      color: "#ffd43b",
      memo: "案内所からの導線を最優先",
    },
    {
      id: "zone-3",
      name: "自然",
      color: "#b2f2bb",
      memo: "季節イベント用に余白を確保",
    },
    {
      id: "zone-4",
      name: "川",
      color: "#74c0fc",
      memo: "橋・視線の抜け・分断ポイントを意識",
    },
  ],
  cells: {},
  selectedZoneId: "zone-1",
  gridSize: 12,
};

function loadLayout() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveLayout(layout) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {}
}

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

  // ★ グリッドサイズ変更処理
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
  };

  const resetAll = () => {
    if (!window.confirm("すべて初期状態に戻しますか？")) return;
    localStorage.removeItem(STORAGE_KEY);
    setZones(DEFAULT_DATA.zones);
    setCells(DEFAULT_DATA.cells);
    setSelectedZoneId(DEFAULT_DATA.selectedZoneId);
    setGridSize(DEFAULT_DATA.gridSize);
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
        initialCells={cells}
        onCellsChange={setCells}
      />
    </div>
  );
}
