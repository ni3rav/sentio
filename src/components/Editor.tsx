import { useEffect, useState } from "react";
import { usePreferences } from "~/context/PreferencesContext";

function Editor() {
  const { font, fontSize, themeStyle } = usePreferences();
  const [text, setText] = useState("");

  useEffect(() => {
    const persistedText = localStorage.getItem("sentio-content");
    if (persistedText) {
      setText(persistedText);
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    localStorage.setItem("sentio-content", newText);
  };

  const textareaClasses = [
    "h-screen",
    "w-screen",
    "rounded-none",
    "overflow-hidden",
    font === "mono"
      ? "font-mono"
      : font === "serif"
      ? "font-serif"
      : "font-sans",
    fontSize === "xs"
      ? "text-sm"
      : fontSize === "sm"
      ? "text-base"
      : fontSize === "lg"
      ? "text-2xl"
      : fontSize === "xl"
      ? "text-4xl"
      : "text-xl",
    themeStyle === "sepia"
      ? "bg-amber-100 text-gray-800"
      : themeStyle === "dark"
      ? "bg-neutral-900 text-cyan-50"
      : "bg-cyan-50 text-gray-950",
  ].join(" ");
  return (
    <textarea
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      value={text}
      onChange={handleTextChange}
      className={textareaClasses}
      style={{
        resize: "none",
        border: "none",
        overflow: "auto",
        outline: "none",
        boxShadow: "none",
        boxSizing: "border-box",
        padding: "18px",
      }}
      placeholder="write away..."
    />
  );
}
export default Editor;
