// src/pages/MiniGame.jsx
import React, { useState, useEffect } from "react";
import { loadGameData, saveGameData, CROP_TYPES, getNextLevelXp } from "../utils/storage";
import "./MiniGame.css";

export default function MiniGame() {
  const [gameState, setGameState] = useState(loadGameData());
  const [now, setNow] = useState(Date.now()); // 現在時刻（描画更新用）
  const [showShop, setShowShop] = useState(false);

  // オートセーブ
  useEffect(() => { saveGameData(gameState); }, [gameState]);

  // 1秒ごとに画面更新（内部時間はDate.now()で管理）
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- プログレス計算ヘルパー ---
  const getProgress = (plot) => {
    if (plot.type !== "crop") return 0;
    const crop = CROP_TYPES[plot.cropId];
    const elapsed = now - plot.plantedAt;
    const percent = Math.min(100, (elapsed / crop.time) * 100);
    return percent;
  };

  // --- クリックアクション ---
  const handlePlotClick = (index) => {
    const plot = gameState.plots[index];
    
    // 1. 収穫 (成長完了時)
    if (plot.type === "crop" && getProgress(plot) >= 100) {
      const crop = CROP_TYPES[plot.cropId];
      
      // XP獲得とレベルアップ判定
      let newXp = gameState.xp + 10; // 固定で10XP
      let newLevel = gameState.level;
      if (newXp >= getNextLevelXp(newLevel)) {
        newXp -= getNextLevelXp(newLevel);
        newLevel++;
        // レベルアップ演出（簡易）
        alert(`レベルアップ！ Lv.${newLevel} になりました！`);
      }

      setGameState(prev => ({
        ...prev,
        bells: prev.bells + crop.val,
        xp: newXp,
        level: newLevel,
        harvestCounts: { ...prev.harvestCounts, [plot.cropId]: (prev.harvestCounts[plot.cropId] || 0) + 1 },
        // 収穫後は空き地に
        plots: prev.plots.map((p, i) => i === index ? { type: "empty", cropId: null, plantedAt: 0 } : p)
      }));
    }

    // 2. 種まき (空き地)
    else if (plot.type === "empty") {
      const seedId = gameState.selectedSeed;
      const seed = CROP_TYPES[seedId];
      
      // ロックされている作物は植えられない
      if (gameState.level < seed.unlockLevel) {
        alert(`この作物はLv.${seed.unlockLevel}から植えられます。`);
        return;
      }

      if (gameState.bells >= seed.cost) {
        setGameState(prev => ({
          ...prev,
          bells: prev.bells - seed.cost,
          plots: prev.plots.map((p, i) => i === index ? { 
            type: "crop", 
            cropId: seedId, 
            plantedAt: Date.now() 
          } : p)
        }));
      } else {
        // お金が足りない
        alert("ベルが足りません！");
      }
    }
  };

  // --- 残り時間フォーマット ---
  const formatTimeLeft = (plot) => {
    if (plot.type !== "crop") return "";
    const crop = CROP_TYPES[plot.cropId];
    const elapsed = now - plot.plantedAt;
    const remaining = crop.time - elapsed;
    if (remaining <= 0) return "OK!";
    
    const sec = Math.ceil(remaining / 1000);
    if (sec > 60) return Math.ceil(sec / 60) + "分";
    return sec + "秒";
  };

  const nextLevelXp = getNextLevelXp(gameState.level);

  return (
    <div className="farm-container">
      <div className="farm-frame">
        
        {/* ヘッダー情報 */}
        <div className="farm-header">
          <div className="header-row top">
            <div className="level-badge">
              <span className="lv-label">Lv.</span>
              <span className="lv-num">{gameState.level}</span>
            </div>
            <div className="xp-bar-container">
              <div className="xp-bar-fill" style={{ width: `${(gameState.xp / nextLevelXp) * 100}%` }} />
              <span className="xp-text">{gameState.xp} / {nextLevelXp} XP</span>
            </div>
          </div>
          <div className="header-row bottom">
             <div className="bell-display">💰 {gameState.bells.toLocaleString()}</div>
             <button className="pixel-btn sm" onClick={() => setShowShop(true)}>拡張 / 図鑑</button>
          </div>
        </div>

        {/* 農園グリッド */}
        <div className="farm-grid-area">
          {gameState.plots.map((plot, i) => {
            const progress = getProgress(plot);
            const isReady = progress >= 100;
            const isLocked = i >= gameState.unlockedPlots;

            return (
              <div key={i} 
                   className={`farm-plot ${isLocked ? "locked" : ""} ${plot.type === "empty" ? "empty" : ""}`}
                   onClick={() => !isLocked && handlePlotClick(i)}>
                
                {!isLocked ? (
                  <>
                    {/* 作物表示 */}
                    {plot.type === "crop" && (
                      <div className={`crop-display ${isReady ? "ready" : "growing"}`}>
                        <span className="crop-emoji">
                          {isReady ? CROP_TYPES[plot.cropId].emoji : "🌱"}
                        </span>
                        
                        {/* 成長バー */}
                        {!isReady && (
                          <div className="mini-progress-bg">
                            <div className="mini-progress-fill" style={{ width: `${progress}%` }} />
                          </div>
                        )}
                        
                        {/* 収穫OKサイン or 残り時間 */}
                        {isReady ? (
                          <div className="ready-sign">Harvest!</div>
                        ) : (
                           <div className="time-tooltip">{formatTimeLeft(plot)}</div>
                        )}
                      </div>
                    )}
                    
                    {/* 空き地 */}
                    {plot.type === "empty" && <div className="soil-marker"></div>}
                  </>
                ) : (
                  <span className="lock-icon">🔒</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 種選択バー */}
        <div className="seed-bar-container">
          <div className="seed-scroll-area">
            {Object.entries(CROP_TYPES).map(([key, info]) => {
              const isLocked = gameState.level < info.unlockLevel;
              const isSelected = gameState.selectedSeed === key;
              
              return (
                <button key={key} 
                        className={`seed-card ${isSelected ? "selected" : ""} ${isLocked ? "locked-seed" : ""}`}
                        onClick={() => !isLocked && setGameState(p => ({ ...p, selectedSeed: key }))}>
                  <div className="seed-emoji">{isLocked ? "🔒" : info.emoji}</div>
                  {!isLocked && (
                    <div className="seed-info">
                      <div className="seed-cost">-{info.cost}</div>
                      <div className="seed-time">
                         {info.time < 60000 ? `${info.time/1000}秒` : `${info.time/60000}分`}
                      </div>
                    </div>
                  )}
                  {isLocked && <div className="unlock-req">Lv.{info.unlockLevel}</div>}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 拡張・図鑑モーダル */}
      {showShop && (
        <div className="modal-overlay" onClick={() => setShowShop(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-header">農園メニュー</h3>
            
            <div className="shop-section">
              <h4>土地の拡張</h4>
              {gameState.unlockedPlots < 12 ? (
                <button className="pixel-btn wide" onClick={() => {
                  const cost = gameState.unlockedPlots * 500;
                  if (gameState.bells >= cost) {
                    setGameState(p => ({ ...p, bells: p.bells - cost, unlockedPlots: p.unlockedPlots + 1 }));
                  } else {
                    alert("ベルが足りません");
                  }
                }}>
                  畑を1つ広げる ({gameState.unlockedPlots * 500} G)
                </button>
              ) : <div>最大サイズです</div>}
            </div>

            <div className="shop-section">
              <h4>収穫数レコード</h4>
              <div className="record-list">
                {Object.entries(CROP_TYPES).map(([k, v]) => (
                  <div key={k} className="record-row">
                    <span>{v.emoji} {v.name}</span>
                    <strong>{gameState.harvestCounts[k] || 0}</strong>
                  </div>
                ))}
              </div>
            </div>

            <button className="close-btn" onClick={() => setShowShop(false)}>とじる</button>
          </div>
        </div>
      )}
    </div>
  );
}