import { useState, useEffect } from "react";
import GridCanvas from "./components/GridCanvas";
import ExportView from "./components/ExportView";
import * as htmlToImage from "html-to-image";

/* =========================
   デフォルトデータ
========================= */
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

const STORAGE_KEY = "island-layout-data";

/* =========================
   App
========================= */
export default function App() {
  const [zones, setZones] = useState(DEFAULT_DATA.zones);
  const [cells, setCells] = useState(DEFAULT_DATA.cells);
  const [selectedZoneId, setSelectedZoneId] = useState(
    DEFAULT_DATA.selectedZoneId
  );
  const [gridSize, setGridSize] = useState(DEFAULT_DATA.gridSize);

  /* ---------- LocalStorage ---------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setZones(parsed.zones);
      setCells(parsed.cells);
      setSelectedZoneId(parsed.selectedZoneId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ zones, cells, selectedZoneId })
    );
  }, [zones, cells, selectedZoneId]);

  /* ---------- 初期化 ---------- */
  const resetToDefault = () => {
    if (!confirm("初期状態に戻しますか？")) return;
    setZones(DEFAULT_DATA.zones);
    setCells(DEFAULT_DATA.cells);
    setSelectedZoneId(DEFAULT_DATA.selectedZoneId);
    localStorage.removeItem(STORAGE_KEY);
  };

  /* ---------- 画像エクスポート ---------- */
  const exportImage = async () => {
    const node = document.getElementById("export-target");
    if (!node) return;

    const dataUrl = await htmlToImage.toPng(node);
    const link = document.createElement("a");
    link.download = "island-layout.png";
    link.href = dataUrl;
    link.click();
  };

  /* =========================
     Render
  ========================= */
  return (
    <div style={{ padding: 16 }}>
      <h1>🏝 あつ森 島レイアウトツール</h1>
<div style={{ marginBottom: 12 }}>
  <label>
    グリッドサイズ：
    <select
      value={gridSize}
      onChange={e => {
        const size = Number(e.target.value);
        setGridSize(size);
        setCells({});
      }}
      style={{ marginLeft: 8 }}
    >
      <option value={8}>8 × 8</option>
      <option value={12}>12 × 12</option>
      <option value={16}>16 × 16</option>
    </select>
  </label>
</div>
      {/* ===== ゾーン選択 ===== */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {zones.map(zone => (
          <button
            key={zone.id}
            onClick={() => setSelectedZoneId(zone.id)}
            style={{
              padding: "6px 12px",
              background:
                selectedZoneId === zone.id ? zone.color : "#f1f3f5",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            {zone.name}
          </button>
        ))}
      </div>
      {/* ===== ゾーン編集・追加・削除 ===== */}
<h3>🎨 ゾーン管理</h3>
<div style={{ marginBottom: 16, border: "1px solid #ccc", padding: 8 }}>
  {zones
    .filter(z => z.id === selectedZoneId)
    .map(zone => (
      <div key={zone.id}>
        {/* 名前 */}
        <div style={{ marginBottom: 4 }}>
          <label>
            名前：
            <input
              type="text"
              value={zone.name}
              onChange={e =>
                setZones(zones.map(z =>
                  z.id === zone.id ? { ...z, name: e.target.value } : z
                ))
              }
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        {/* 色 */}
        <div style={{ marginBottom: 4 }}>
          <label>
            色：
            <input
              type="color"
              value={zone.color}
              onChange={e =>
                setZones(zones.map(z =>
                  z.id === zone.id ? { ...z, color: e.target.value } : z
                ))
              }
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        {/* メモ */}
        <div style={{ marginBottom: 8 }}>
          <label>
            メモ：
            <textarea
              value={zone.memo}
              onChange={e =>
                setZones(zones.map(z =>
                  z.id === zone.id ? { ...z, memo: e.target.value } : z
                ))
              }
              rows={2}
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
        </div>

        {/* 削除ボタン */}
        <button
          onClick={() => {
            if (zones.length <= 1) {
              alert("最低1ゾーンは残す必要があります");
              return;
            }
            if (!confirm(`「${zone.name}」を削除しますか？`)) return;

            // 削除
            setZones(zones.filter(z => z.id !== zone.id));

            // そのゾーンのマスは空に
            const newCells = { ...cells };
            Object.keys(newCells).forEach(key => {
              if (newCells[key] === zone.id) delete newCells[key];
            });
            setCells(newCells);

            // 選択ゾーンを変更（先頭に戻す）
            setSelectedZoneId(zones[0].id);
          }}
          style={{ background: "#ff6b6b", color: "#fff", marginRight: 8 }}
        >
          削除
        </button>

        {/* 追加ボタン */}
        <button
          onClick={() => {
            const newZone = {
              id: `zone-${Date.now()}`,
              name: "新規ゾーン",
              color: "#d3d3d3",
              memo: "",
            };
            setZones([...zones, newZone]);
            setSelectedZoneId(newZone.id);
          }}
          style={{ background: "#51cf66", color: "#fff" }}
        >
          追加
        </button>
      </div>
    ))}
</div>

{/* ===== ゾーン編集 ===== */}
<h3>🎨 ゾーン編集</h3>
<div style={{ marginBottom: 16, border: "1px solid #ccc", padding: 8 }}>
  {zones
    .filter(z => z.id === selectedZoneId)
    .map(zone => (
      <div key={zone.id}>
        {/* 名前 */}
        <div style={{ marginBottom: 4 }}>
          <label>
            名前：
            <input
              type="text"
              value={zone.name}
              onChange={e =>
                setZones(zones.map(z =>
                  z.id === zone.id ? { ...z, name: e.target.value } : z
                ))
              }
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        {/* 色 */}
        <div style={{ marginBottom: 4 }}>
          <label>
            色：
            <input
              type="color"
              value={zone.color}
              onChange={e =>
                setZones(zones.map(z =>
                  z.id === zone.id ? { ...z, color: e.target.value } : z
                ))
              }
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        {/* メモ */}
        <div>
          <label>
            メモ：
            <textarea
              value={zone.memo}
              onChange={e =>
                setZones(zones.map(z =>
                  z.id === zone.id ? { ...z, memo: e.target.value } : z
                ))
              }
              rows={2}
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
        </div>
      </div>
    ))}
</div>

      {/* ===== グリッド ===== */}
      <GridCanvas
        zones={zones}
        cells={cells}
        setCells={setCells}
        selectedZoneId={selectedZoneId}
        gridSize={gridSize}
      />

      {/* ===== ゾーンメモ ===== */}
      <h3>📝 ゾーン別メモ</h3>
      {zones.map(zone => (
        <div key={zone.id} style={{ marginBottom: 8 }}>
          <strong>{zone.name}</strong>
          <textarea
            value={zone.memo}
            onChange={e =>
              setZones(zones.map(z =>
                z.id === zone.id ? { ...z, memo: e.target.value } : z
              ))
            }
            rows={2}
            style={{ width: "100%" }}
          />
        </div>
      ))}

      {/* ===== 操作ボタン ===== */}
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button onClick={exportImage}>📸 画像として保存</button>
        <button onClick={resetToDefault}>🔄 初期状態に戻す</button>
      </div>

      {/* ===== Export用DOM（非表示） ===== */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <ExportView
          zones={zones}
          cells={cells}
          gridSize={gridSize}
        />
      </div>
    </div>
  );
}
