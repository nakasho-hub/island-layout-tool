// src/App.jsx
import { useEffect } from "react";
// インポートを1つにまとめ、useLocationを追加しました
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

import IslandLayout from "./pages/IslandLayout";
import DotArtEditor from "./pages/DotArtEditor";
import RoutineChecker from "./pages/RoutineChecker";

// --- GA初期化 ---
const TRACKING_ID = "G-0VVD44Z6LT";
ReactGA.initialize(TRACKING_ID);

// ページ遷移を監視して計測するコンポーネント
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // ページビューを送信
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.hash 
    });
  }, [location]);

  return null;
}

// メインコンポーネント
export default function App() {
  return (
    <HashRouter>
      {/* ページ遷移トラッキング用のコンポーネントを配置 */}
      <AnalyticsTracker />
      <div style={{ padding: "16px", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
        <Routes>
          <Route path="/" element={<HomeMenu />} />
          <Route path="/layout" element={<IslandLayout />} />
          <Route path="/dot-art" element={<DotArtEditor />} />
          <Route path="/routine" element={<RoutineChecker />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

function HomeMenu() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🏝 あつ森 思考整理ツール</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
        <Link to="/layout" style={menuButtonStyle}>島レイアウト整理</Link>
        <Link to="/dot-art" style={menuButtonStyle}>ドット絵・練習パレット</Link>
        <Link to="/routine" style={menuButtonStyle}>日課（ルーティン）チェッカー</Link>
      </div>
    </div>
  );
}

const menuButtonStyle = {
  padding: "20px",
  fontSize: "1.1rem",
  textDecoration: "none",
  color: "#333",
  background: "#f0fdf4",
  border: "2px solid #7bcf9a",
  borderRadius: "16px",
  fontWeight: "bold"
};