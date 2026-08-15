import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "splatoon_raiders_materials_v1";

const defaultGoal = () => ({
  id: Date.now(),
  title: "新しい強化目標",
  items: [
    { id: Date.now() + 1, name: "オタカラ/素材名", current: 0, target: 10, completed: false }
  ]
});

export default function RaidersMaterialsTracker() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 1,
        title: "シューター レベル上限突破",
        items: [
          { id: 101, name: "金のシャケウロコ", current: 2, target: 5, completed: false },
          { id: 102, name: "高純度オタカラパーツ", current: 8, target: 12, completed: false }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => setGoals([...goals, defaultGoal()]);

  const removeGoal = (goalId) => {
    if (window.confirm("この目標グループを削除しますか？")) {
      setGoals(goals.filter(g => g.id !== goalId));
    }
  };

  const updateGoalTitle = (goalId, title) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, title } : g));
  };

  const addItem = (goalId) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          items: [...g.items, { id: Date.now(), name: "新規素材", current: 0, target: 10, completed: false }]
        };
      }
      return g;
    }));
  };

  const updateItem = (goalId, itemId, field, value) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          items: g.items.map(item => {
            if (item.id === itemId) {
              const updated = { ...item, [field]: value };
              if (field === "current" || field === "target") {
                updated.completed = updated.current >= updated.target && updated.target > 0;
              }
              return updated;
            }
            return item;
          })
        };
      }
      return g;
    }));
  };

  const changeCount = (goalId, itemId, delta) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          items: g.items.map(item => {
            if (item.id === itemId) {
              const nextCurrent = Math.max(0, item.current + delta);
              return {
                ...item,
                current: nextCurrent,
                completed: nextCurrent >= item.target && item.target > 0
              };
            }
            return item;
          })
        };
      }
      return g;
    }));
  };

  const removeItem = (goalId, itemId) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return { ...g, items: g.items.filter(item => item.id !== itemId) };
      }
      return g;
    }));
  };

  return (
    <div style={{ paddingBottom: "40px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#666", fontSize: "0.9rem" }}>← ホームへ</Link>
        <h2 style={{ margin: "10px 0 5px 0" }}>💎 オタカラ・素材 周回チェックリスト</h2>
        <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>
          装備強化や解放に必要なオタカラ・素材の目標数をセットして周回を効率化します。
        </p>
      </div>

      <button onClick={addGoal} style={addGoalBtnStyle}>＋ 周回目標グループを追加</button>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
        {goals.map((goal) => (
          <div key={goal.id} style={goalCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <input
                type="text"
                value={goal.title}
                onChange={(e) => updateGoalTitle(goal.id, e.target.value)}
                style={goalTitleInputStyle}
              />
              <button onClick={() => removeGoal(goal.id)} style={deleteBtnStyle}>削除</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {goal.items.map((item) => (
                <div key={item.id} style={{ ...itemRowStyle, opacity: item.completed ? 0.6 : 1 }}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => updateItem(goal.id, item.id, "completed", e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(goal.id, item.id, "name", e.target.value)}
                    style={{ ...itemNameInputStyle, textDecoration: item.completed ? "line-through" : "none" }}
                  />

                  {/* 個数編集 ＆ カウンター */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button onClick={() => changeCount(goal.id, item.id, -1)} style={countBtnStyle}>-</button>
                    
                    <div style={{ display: "flex", alignItems: "center", fontSize: "0.85rem", fontWeight: "bold" }}>
                      <span>{item.current}</span>
                      <span style={{ margin: "0 2px", color: "#94a3b8" }}>/</span>
                      {/* 目標個数（最大数）の入力欄 */}
                      <input
                        type="number"
                        min="1"
                        value={item.target}
                        onChange={(e) => updateItem(goal.id, item.id, "target", Math.max(1, parseInt(e.target.value) || 1))}
                        style={targetNumberInputStyle}
                      />
                    </div>

                    <button onClick={() => changeCount(goal.id, item.id, 1)} style={countBtnStyle}>+</button>
                  </div>

                  <button onClick={() => removeItem(goal.id, item.id)} style={smallRemoveBtnStyle}>×</button>
                </div>
              ))}
            </div>

            <button onClick={() => addItem(goal.id)} style={addItemBtnStyle}>＋ 素材項目を追加</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const addGoalBtnStyle = {
  width: "100%", padding: "12px", background: "#00b894", color: "#fff",
  border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer"
};
const goalCardStyle = {
  background: "#fff", border: "2px solid #e2e8f0", borderRadius: "14px", padding: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
};
const goalTitleInputStyle = {
  fontSize: "1.05rem", fontWeight: "bold", border: "none", borderBottom: "2px solid #6c5ce7",
  padding: "4px", width: "75%", outline: "none"
};
const deleteBtnStyle = {
  background: "#fee2e2", color: "#dc2626", border: "none", padding: "4px 8px",
  borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem"
};
const itemRowStyle = {
  display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc",
  padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1"
};
const itemNameInputStyle = {
  flex: 1, border: "none", background: "transparent", fontSize: "0.85rem", outline: "none", fontWeight: "bold"
};
const countBtnStyle = {
  width: "26px", height: "26px", border: "1px solid #cbd5e1", borderRadius: "4px",
  background: "#fff", fontWeight: "bold", cursor: "pointer"
};
const targetNumberInputStyle = {
  width: "36px", border: "none", borderBottom: "1px solid #cbd5e1",
  background: "transparent", textAlign: "center", fontSize: "0.85rem", fontWeight: "bold", color: "#475569"
};
const smallRemoveBtnStyle = {
  border: "none", background: "transparent", color: "#94a3b8", fontSize: "1rem", cursor: "pointer"
};
const addItemBtnStyle = {
  marginTop: "12px", background: "transparent", border: "1px dashed #a0aec0",
  width: "100%", padding: "6px", borderRadius: "6px", color: "#4a5568", fontSize: "0.8rem", cursor: "pointer"
};