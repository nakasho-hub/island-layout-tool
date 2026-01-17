// src/utils/storage.js

const STORAGE_KEY = "island-layout-data";

export const DEFAULT_DATA = {
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

export function loadLayout() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveLayout(layout) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch (error) {
    console.error("Failed to save layout:", error);
  }
}