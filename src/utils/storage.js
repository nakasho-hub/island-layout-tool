// src/utils/storage.js

const STORAGE_KEY = "island-layout-data";
const DOT_ART_KEY = "island-dot-art-data"; // ドット絵専用のキー
const ROUTINE_KEY = "island-routine-data"; // ルーティン専用のキー

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

// ドット絵用の読み込み関数
export function loadDotArt() {
  try {
    const data = localStorage.getItem(DOT_ART_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// ドット絵用の保存関数
export function saveDotArt(cells) {
  try {
    localStorage.setItem(DOT_ART_KEY, JSON.stringify(cells));
  } catch (error) {
    console.error("Failed to save dot art:", error);
  }
}

// 曜日定義
export const DAYS = [
  { id: "all", label: "毎日" },
  { id: 0, label: "日" },
  { id: 1, label: "月" },
  { id: 2, label: "火" },
  { id: 3, label: "水" },
  { id: 4, label: "木" },
  { id: 5, label: "金" },
  { id: 6, label: "土" },
];

export const DEFAULT_ROUTINES = [
  { id: 1, text: "岩を叩く (6個)", completed: false, day: "all" },
  { id: 2, text: "化石を掘り出す (4個)", completed: false, day: "all" },
  { id: 3, text: "ウリからカブを買う", completed: false, day: 0 }, // 日曜のみ
  { id: 4, text: "とたけけライブ", completed: false, day: 6 },     // 土曜のみ
];

export function loadRoutines() {
  try {
    const data = localStorage.getItem(ROUTINE_KEY);
    return data ? JSON.parse(data) : DEFAULT_ROUTINES;
  } catch {
    return DEFAULT_ROUTINES;
  }
}

export function saveRoutines(routines) {
  try {
    localStorage.setItem(ROUTINE_KEY, JSON.stringify(routines));
  } catch (error) {
    console.error("Failed to save routines:", error);
  }
}