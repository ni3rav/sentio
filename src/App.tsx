import Editor from "./components/Editor";
import { PreferencesProvider } from "~/context/PreferencesContext";
import { Toolbar } from "./components/Toolbar";

export default function App() {
  return (
    <main className="overflow-hidden">
      <PreferencesProvider>
        <Editor />
        <Toolbar />
      </PreferencesProvider>
    </main>
  );
}
