import GridCanvas from "./components/GridCanvas";

export default function App() {
  return (
    <div style={{ padding: "24px" }}>
      <h1>島レイアウト計画ツール</h1>
      <GridCanvas size={12} />
    </div>
  );
}
