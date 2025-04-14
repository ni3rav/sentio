import Editor from "./components/Editor";
import { PreferencesProvider } from "~/context/PreferencesContext";
import { Toolbar } from "./components/Toolbar";
import { TextProvider } from "./context/TextContext";

export default function App() {
  return (
    <main className="overflow-hidden">
      <PreferencesProvider>
        <TextProvider>
          <Editor />
          <Toolbar />
        </TextProvider>
      </PreferencesProvider>
    </main>
  );
}
