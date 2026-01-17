export default function Toolbar({ zones, selectedZoneId, onSelectZone }) {
  return (
    <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
      {zones.map((zone) => (
        <button
          key={zone.id}
          onClick={() => onSelectZone(zone.id)}
          style={{
            padding: "8px 12px",
            borderRadius: "12px",
            border:
              selectedZoneId === zone.id
                ? "2px solid #333"
                : "1px solid #ccc",
            backgroundColor: zone.color,
            cursor: "pointer",
          }}
        >
          {zone.name}
        </button>
      ))}
    </div>
  );
}
