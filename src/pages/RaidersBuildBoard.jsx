import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const STORAGE_KEY = "splatoon_raiders_builds_v3";

const defaultBuild = () => ({
  id: Date.now(),
  title: "新規ビルド案",
  weapon: "",
  tankType: "パワー",
  gadget1: "",
  parts1: "",
  gadget2: "",
  parts2: "",
  gadget3: "",
  parts3: "",
  relics: ["", "", "", "", ""],
  synergy: ""
});

// タンク別のテーマカラー定義
const tankThemes = {
  パワー: {
    border: "#ef4444",
    bg: "#fef2f2",
    text: "#dc2626",
    label: "🔴 パワータンク"
  },
  スピード: {
    border: "#3b82f6",
    bg: "#eff6ff",
    text: "#2563eb",
    label: "🔵 スピードタンク"
  },
  テクニカル: {
    border: "#a855f7",
    bg: "#faf5ff",
    text: "#9333ea",
    label: "🟣 テクニカルタンク"
  }
};

export default function RaidersBuildBoard() {
  const [searchParams] = useSearchParams();
  const [builds, setBuilds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 1,
        title: "初期解放バランス構成",
        weapon: "PETシューター",
        tankType: "パワー",
        gadget1: "ズバットスラッシャー",
        parts1: "斬りつけダメージアップ\n待ち時間短縮",
        gadget2: "カチコミシューズ",
        parts2: "爆発サイズアップ\n移動距離アップ",
        gadget3: "スケットポット",
        parts3: "連射速度アップ\n持続時間アップ",
        relics: ["攻撃力アップ", "インク効率アップ", "移動速度アップ", "", ""],
        synergy: "パワータンクをベースにズバットスラッシャーで火力を出しつつ、スケットポットの自動攻撃とカチコミシューズの移動でカバーする構成。"
      }
    ];
  });

  useEffect(() => {
    const sharedData = searchParams.get("build");
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        if (decoded && decoded.title) {
          const newBuild = { ...decoded, id: Date.now() };
          setBuilds(prev => [newBuild, ...prev]);
          alert(`共有ビルド「${decoded.title}」を取り込みました！`);
        }
      } catch (e) {
        console.error("共有データの読み込みに失敗しました", e);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
  }, [builds]);

  const addBuild = () => setBuilds([...builds, defaultBuild()]);

  const updateBuild = (id, field, value) => {
    setBuilds(builds.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const updateRelic = (id, index, value) => {
    setBuilds(builds.map(b => {
      if (b.id !== id) return b;
      const newRelics = [...(b.relics || ["", "", "", "", ""])];
      newRelics[index] = value;
      return { ...b, relics: newRelics };
    }));
  };

  const removeBuild = (id) => {
    if (window.confirm("このビルド案を削除しますか？")) {
      setBuilds(builds.filter(b => b.id !== id));
    }
  };

  const shareBuildUrl = (b) => {
    try {
      const jsonStr = JSON.stringify(b);
      const encoded = btoa(encodeURIComponent(jsonStr));
      const shareUrl = `${window.location.origin}${window.location.pathname}#/raiders-build?build=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      alert("共有用URLをクリップボードにコピーしました！");
    } catch (e) {
      alert("URLの生成に失敗しました。");
    }
  };

  const shareText = (b) => {
    const relicList = (b.relics || []).filter(r => r.trim() !== "").join(", ") || "なし";
    const text = `【スプラトゥーンレイダース ビルド構成】\n■ ${b.title}\n・武器: ${b.weapon || "未設定"}\n・タンク: ${b.tankType}\n・ガジェット1: ${b.gadget1 || "未設定"}\n  [パーツ]: ${b.parts1 ? b.parts1.replace(/\n/g, ", ") : "なし"}\n・ガジェット2: ${b.gadget2 || "未設定"}\n  [パーツ]: ${b.parts2 ? b.parts2.replace(/\n/g, ", ") : "なし"}\n・ガジェット3: ${b.gadget3 || "未設定"}\n  [パーツ]: ${b.parts3 ? b.parts3.replace(/\n/g, ", ") : "なし"}\n・秘宝パーツ: ${relicList}\n・シナジー: ${b.synergy}`;
    navigator.clipboard.writeText(text);
    alert("SNS投稿用のテキストをコピーしました！");
  };

  return (
    <div style={{ paddingBottom: "40px" }}>
      <div style={headerStyle}>
        <Link to="/" style={backLinkStyle}>← ホームへ</Link>
        <h2 style={{ margin: "10px 0 5px 0" }}>🦑 武器＆ガジェット シナジーボード</h2>
        <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>
          武器・装備タンク・3つのガジェット＆パーツ・5つの秘宝パーツの組み合わせを管理・共有します。
        </p>
      </div>

      <button onClick={addBuild} style={addButtonStyle}>＋ 新しいビルド案を追加</button>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "20px" }}>
        {builds.map((b) => {
          const theme = tankThemes[b.tankType || "パワー"];
          return (
            <div key={b.id} style={cardStyle}>
              {/* タイトル＆削除ボタン */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input
                  type="text"
                  value={b.title}
                  onChange={(e) => updateBuild(b.id, "title", e.target.value)}
                  style={titleInputStyle}
                  placeholder="ビルド名（例：ボス特化構成）"
                />
                <button onClick={() => removeBuild(b.id)} style={deleteButtonStyle}>削除</button>
              </div>

              {/* 武器 & タンク選択 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
                <div style={slotStyle}>
                  <span style={slotLabelStyle}>武器</span>
                  <input
                    type="text"
                    value={b.weapon}
                    onChange={(e) => updateBuild(b.id, "weapon", e.target.value)}
                    placeholder="例：PETシューター"
                    style={slotInputStyle}
                  />
                </div>

                <div style={{ ...slotStyle, borderColor: theme.border, background: theme.bg }}>
                  <span style={{ ...slotLabelStyle, color: theme.text }}>装備タンク</span>
                  <select
                    value={b.tankType || "パワー"}
                    onChange={(e) => updateBuild(b.id, "tankType", e.target.value)}
                    style={{ ...tankSelectStyle, color: theme.text, borderColor: theme.border }}
                  >
                    <option value="パワー">🔴 パワータンク</option>
                    <option value="スピード">🔵 スピードタンク</option>
                    <option value="テクニカル">🟣 テクニカルタンク</option>
                  </select>
                </div>
              </div>

              {/* ガジェット 1〜3 (拡張パーツ入力欄付き) */}
              <div style={{ marginTop: "14px" }}>
                <span style={sectionLabelStyle}>🛠️ ガジェット (最大3つ) & 装着パーツ</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "6px" }}>
                  {[1, 2, 3].map((num) => (
                    <div key={num} style={gadgetBoxStyle}>
                      <span style={slotLabelStyle}>ガジェット {num}</span>
                      <input
                        type="text"
                        value={b[`gadget${num}`] || ""}
                        onChange={(e) => updateBuild(b.id, `gadget${num}`, e.target.value)}
                        placeholder={`ガジェット名`}
                        style={gadgetInputStyle}
                      />
                      <div style={partsContainerStyle}>
                        <span style={partsLabelStyle}>⚙️ パーツ（改行可）</span>
                        <textarea
                          value={b[`parts${num}`] || ""}
                          onChange={(e) => updateBuild(b.id, `parts${num}`, e.target.value)}
                          placeholder={"ダメージアップ\n待ち時間短縮\n範囲拡大"}
                          rows={3}
                          style={partsTextareaStyle}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 秘宝パーツ (5つ) */}
              <div style={{ marginTop: "14px" }}>
                <span style={sectionLabelStyle}>💎 秘宝パーツ (最大5つ)</span>
                <div style={relicGridStyle}>
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <div key={idx} style={relicBoxStyle}>
                      <span style={relicNumStyle}>#{idx + 1}</span>
                      <input
                        type="text"
                        value={(b.relics || ["", "", "", "", ""])[idx] || ""}
                        onChange={(e) => updateRelic(b.id, idx, e.target.value)}
                        placeholder={`秘宝パーツ${idx + 1}`}
                        style={relicInputStyle}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* シナジーメモ */}
              <div style={{ marginTop: "14px" }}>
                <label style={labelStyle}>🔗 シナジー / コンボメモ</label>
                <textarea
                  value={b.synergy}
                  onChange={(e) => updateBuild(b.id, "synergy", e.target.value)}
                  placeholder="例: タンク特性と秘宝パーツの組み合わせによる立ち回りや強み"
                  rows={2}
                  style={textareaStyle}
                />
              </div>

              {/* 共有アクション */}
              <div style={{ display: "flex", gap: "8px", marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                <button onClick={() => shareBuildUrl(b)} style={shareBtnStyle}>
                  🔗 共有URLをコピー
                </button>
                <button onClick={() => shareText(b)} style={shareTextBtnStyle}>
                  📋 テキストでコピー
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const headerStyle = { marginBottom: "16px" };
const backLinkStyle = { textDecoration: "none", color: "#666", fontSize: "0.9rem" };
const addButtonStyle = {
  width: "100%", padding: "12px", background: "#ff6b00", color: "#fff",
  border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer"
};
const cardStyle = {
  background: "#fff", border: "2px solid #e2e8f0", borderRadius: "14px", padding: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
};
const titleInputStyle = {
  fontSize: "1.1rem", fontWeight: "bold", border: "none", borderBottom: "2px solid #cbd5e1",
  padding: "4px", width: "70%", outline: "none"
};
const deleteButtonStyle = {
  background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px",
  borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold"
};
const sectionLabelStyle = { display: "block", fontSize: "0.8rem", color: "#334155", fontWeight: "bold" };

const slotStyle = { background: "#f8fafc", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const slotLabelStyle = { display: "block", fontSize: "0.75rem", color: "#64748b", fontWeight: "bold" };
const slotInputStyle = { width: "100%", border: "none", background: "transparent", fontWeight: "bold", outline: "none", fontSize: "0.85rem", marginTop: "2px" };

const tankSelectStyle = {
  width: "100%", marginTop: "4px", padding: "4px", fontWeight: "bold", fontSize: "0.85rem",
  borderRadius: "6px", background: "#fff", cursor: "pointer"
};

const gadgetBoxStyle = { background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" };
const gadgetInputStyle = { width: "100%", border: "none", borderBottom: "1px solid #cbd5e1", background: "transparent", fontWeight: "bold", outline: "none", fontSize: "0.85rem", padding: "2px 0", marginTop: "2px" };

const partsContainerStyle = { marginTop: "8px", paddingTop: "6px", borderTop: "1px dashed #cbd5e1" };
const partsLabelStyle = { display: "block", fontSize: "0.7rem", color: "#ea580c", fontWeight: "bold", marginBottom: "4px" };
const partsTextareaStyle = {
  width: "100%", border: "1px solid #cbd5e1", borderRadius: "4px", background: "#fff",
  outline: "none", fontSize: "0.8rem", color: "#334155", padding: "6px", resize: "vertical", boxSizing: "border-box"
};

const relicGridStyle = { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginTop: "6px" };
const relicBoxStyle = { background: "#faf5ff", border: "1px solid #e9d5ff", padding: "6px", borderRadius: "6px", textAlign: "center" };
const relicNumStyle = { display: "block", fontSize: "0.65rem", color: "#9333ea", fontWeight: "bold" };
const relicInputStyle = { width: "100%", border: "none", background: "transparent", outline: "none", fontSize: "0.75rem", textAlign: "center" };

const labelStyle = { display: "block", fontSize: "0.8rem", color: "#475569", fontWeight: "bold", marginBottom: "4px" };
const textareaStyle = { width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" };

const shareBtnStyle = {
  flex: 1, padding: "8px", background: "#f1f5f9", border: "1px solid #cbd5e1",
  borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold", color: "#334155"
};
const shareTextBtnStyle = {
  flex: 1, padding: "8px", background: "#f1f5f9", border: "1px solid #cbd5e1",
  borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold", color: "#334155"
};