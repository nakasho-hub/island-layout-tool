export default function Cell({ color, onClick }) {
  return (
    <div
      className="grid-cell"
      onClick={onClick}
      style={{ backgroundColor: color }}
    />
  );
}
