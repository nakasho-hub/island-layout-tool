import { useEffect } from "react";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

import IslandLayout from "./pages/IslandLayout";
import DotArtEditor from "./pages/DotArtEditor";
import RoutineChecker from "./pages/RoutineChecker";
import MiniGame from "./pages/MiniGame";
import RaidersBuildBoard from "./pages/RaidersBuildBoard";
import RaidersMaterialsTracker from "./pages/RaidersMaterialsTracker";

// --- GA初期化 ---
const TRACKING_ID = "G-0VVD44Z6LT";
ReactGA.initialize(TRACKING_ID);

function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.hash 
    });
  }, [location]);
  return null;
}


export default function App() {
  return (
    <HashRouter>
      <AnalyticsTracker />
      <div style={{ padding: "16px", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
        <Routes>
          <Route path="/" element={<HomeMenu />} />
          <Route path="/layout" element={<IslandLayout />} />
          <Route path="/dot-art" element={<DotArtEditor />} />
          <Route path="/routine" element={<RoutineChecker />} />
          <Route path="/mini-game" element={<MiniGame />} />
          <Route path="/raiders-build" element={<RaidersBuildBoard />} />
          <Route path="/raiders-materials" element={<RaidersMaterialsTracker />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

function HomeMenu() {
  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1 style={{ fontSize: "1.5rem" }}>🎮 思考整理＆メモツール</h1>
      
      {/* あつ森・共通ツール */}
      <h3 style={sectionHeaderStyle}>あつまれ どうぶつの森</h3>
      <div style={menuGridStyle}>
        <Link to="/layout" style={menuButtonStyle}>🏝 島レイアウト整理</Link>
        <Link to="/dot-art" style={menuButtonStyle}>🎨 ドット絵パレット</Link>
        <Link to="/routine" style={menuButtonStyle}>📅 日課チェッカー</Link>
        <Link to="/mini-game" style={menuButtonStyle}>🌱 ながら育成 (Mini Game)</Link>
      </div>

      {/* スプラトゥーン レイダース */}
      <h3 style={{ ...sectionHeaderStyle, color: "#ff6b00" }}>スプラトゥーン レイダース</h3>
      <div style={menuGridStyle}>
        <Link to="/raiders-build" style={raidersButtonStyle}>
          🦑 武器＆ガジェット シナジーボード
        </Link>
        <Link to="/raiders-materials" style={raidersButtonStyle}>
          💎 オタカラ・素材 周回チェッカー
        </Link>
      </div>
    </div>
  );
}

const sectionHeaderStyle = {
  textAlign: "left",
  fontSize: "1rem",
  color: "#2e7d32",
  marginTop: "24px",
  marginBottom: "10px",
  borderBottom: "2px solid #e0e0e0",
  paddingBottom: "4px"
};

const menuGridStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const menuButtonStyle = {
  padding: "14px",
  fontSize: "1rem",
  textDecoration: "none",
  color: "#333",
  background: "#f0fdf4",
  border: "2px solid #7bcf9a",
  borderRadius: "12px",
  fontWeight: "bold",
  textAlign: "center"
};

const raidersButtonStyle = {
  ...menuButtonStyle,
  background: "#fff7ed",
  border: "2px solid #ffaa66",
  color: "#c2410c"
};