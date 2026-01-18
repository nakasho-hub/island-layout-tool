// src/pages/RoutineChecker.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loadRoutines, saveRoutines, DAYS } from "../utils/storage";

export default function RoutineChecker() {
  const [routines, setRoutines] = useState(() => loadRoutines());
  const [newItemText, setNewItemText] = useState("");
  const [newItemDay, setNewItemDay] = useState("all");

  // 【追加】ゲーム内の日付を管理（初期値はシステムの今日）
  const [gameDate, setGameDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0]; // yyyy-mm-dd形式
  });

  // 選択された日付から曜日を取得
  const selectedDay = new Date(gameDate).getDay();

  useEffect(() => {
    saveRoutines(routines);
  }, [routines]);

  // フィルタリング: 「毎日」または「選択された日付の曜日」と一致するもの
  const visibleRoutines = routines.filter(
    (item) => item.day === "all" || item.day === selectedDay
  );

  const toggleRoutine = (id) => {
    setRoutines(routines.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newItemText,
      completed: false,
      day: newItemDay === "all" ? "all" : parseInt(newItemDay)
    };
    setRoutines([...routines, newItem]);
    setNewItemText("");
  };

  const deleteItem = (id) => {
    setRoutines(routines.filter(item => item.id !== id));
  };

  const resetToday = () => {
    if (!window.confirm("表示されている日課をすべて未完了に戻しますか？")) return;
    setRoutines(routines.map(item => 
      (item.day === "all" || item.day === selectedDay) 
        ? { ...item, completed: false } 
        : item
    ));
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <Link to="/" style={{ fontSize: "0.8rem", color: "#666", textDecoration: "none" }}>← メニュー</Link>
      
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>📅 日課チェッカー</h2>

      {/* 【追加】ゲーム内日付の選択エリア */}
      <div style={{ 
        background: "#e6f3ff", 
        padding: "15px", 
        borderRadius: "12px", 
        marginBottom: "20px",
        textAlign: "center",
        border: "2px solid #bcd4e6"
      }}>
        <label style={{ display: "block", fontSize: "0.85rem", color: "#555", marginBottom: "5px", fontWeight: "bold" }}>
          現在のゲーム内日付を設定：
        </label>
        <input 
          type="date"
          value={gameDate}
          onChange={(e) => setGameDate(e.target.value)}
          style={{ 
            padding: "8px", 
            borderRadius: "8px", 
            border: "1px solid #ccc",
            fontSize: "1rem",
            fontFamily: "inherit"
          }}
        />
        <div style={{ marginTop: "5px", fontWeight: "bold", color: "#333" }}>
          判定：{DAYS.find(d => d.id === selectedDay).label}曜日のルーティン
        </div>
      </div>

      {/* 追加フォーム */}
      <form onSubmit={addItem} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input 
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="新しい日課を入力..."
          style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <select 
          value={newItemDay} 
          onChange={(e) => setNewItemDay(e.target.value)}
          style={{ padding: "8px", borderRadius: "8px" }}
        >
          {DAYS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
        <button type="submit" style={{ padding: "8px 16px", background: "#7bcf9a", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold" }}>追加</button>
      </form>

      {/* チェックリスト */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #ddd", overflow: "hidden" }}>
        {visibleRoutines.length > 0 ? visibleRoutines.map(item => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "12px", borderBottom: "1px solid #eee" }}>
            <div onClick={() => toggleRoutine(item.id)} style={{ flex: 1, display: "flex", alignItems: "center", cursor: "pointer" }}>
              <div style={{
                width: "20px", height: "20px", border: "2px solid #7bcf9a", borderRadius: "4px", marginRight: "12px",
                backgroundColor: item.completed ? "#7bcf9a" : "white", color: "white", textAlign: "center", lineHeight: "18px"
              }}>
                {item.completed && "✓"}
              </div>
              <span style={{ textDecoration: item.completed ? "line-through" : "none", color: item.completed ? "#999" : "#333" }}>
                {item.text} {item.day !== "all" && <small style={{ color: "#aaa" }}>({DAYS.find(d => d.id === item.day).label})</small>}
              </span>
            </div>
            <button onClick={() => deleteItem(item.id)} style={{ background: "none", border: "none", color: "#ff8787", cursor: "pointer" }}>削除</button>
          </div>
        )) : (
          <p style={{ padding: "20px", textAlign: "center", color: "#999" }}>この曜日の日課はありません</p>
        )}
      </div>

      <button onClick={resetToday} style={{ width: "100%", marginTop: "16px", padding: "10px", background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer", color: "#666" }}>
        選択中の曜日のチェックを外す
      </button>
    </div>
  );
}