// src/components/ZoneEditor.jsx
export default function ZoneEditor({
  zones,
  selectedZoneId,
  onSelect,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "12px",
        marginBottom: "16px",
      }}
    >
      <h3>ゾーン編集</h3>

      {/* ゾーン一覧 */}
      {zones.map((zone) => (
        <div
          key={zone.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <button
            onClick={() => onSelect(zone.id)}
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              border:
                selectedZoneId === zone.id
                  ? "2px solid #333"
                  : "1px solid #ccc",
              backgroundColor: zone.color,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {zone.name}
          </button>

          <button
            onClick={() => onDelete(zone.id)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#e03131",
            }}
          >
            ✕
          </button>
        </div>
      ))}

      <hr />

      {/* 編集欄 */}
      {selectedZone && (
        <>
          <div style={{ marginBottom: "8px" }}>
            <label>名前：</label>
            <input
              value={selectedZone.name}
              onChange={(e) =>
                onUpdate(selectedZone.id, { name: e.target.value })
              }
            />
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label>色：</label>
            <input
              type="color"
              value={selectedZone.color}
              onChange={(e) =>
                onUpdate(selectedZone.id, { color: e.target.value })
              }
            />
          </div>

          {/* ★ メモ欄 */}
          <div style={{ marginBottom: "8px" }}>
            <label>メモ：</label>
            <textarea
              value={selectedZone.memo || ""}
              onChange={(e) =>
                onUpdate(selectedZone.id, { memo: e.target.value })
              }
              rows={4}
              style={{
                width: "100%",
                resize: "vertical",
                marginTop: "4px",
              }}
              placeholder="このゾーンの目的・配置理由・将来案など"
            />
          </div>
        </>
      )}

      <button
        onClick={onAdd}
        style={{
          marginTop: "8px",
          padding: "6px 12px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        ＋ ゾーン追加
      </button>
    </div>
  );
}
