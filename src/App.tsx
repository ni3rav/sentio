import { Textarea } from "~/components/ui/textarea";

function App() {
  return (
    <main className="font-[var(--font-interface)]">
      <Textarea
        className="h-screen w-screen rounded-none p-4"
        style={{
          resize: "none",
          border: "none",
          overflow: "auto",
          outline: "none",
          WebkitBoxShadow: "none",
          MozBoxShadow: "none",
          boxShadow: "none",
          boxSizing: "border-box",
          fontSize: "18px",
          padding: "12px",
        }}
        placeholder="Start typing..."
      />
    </main>
  );
}
export default App;
