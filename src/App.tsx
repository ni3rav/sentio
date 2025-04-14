import Editor from "./components/Editor";
import { PreferencesProvider } from "~/context/PreferencesContext";

export default function App() {
  return (
    <main className="overflow-hidden">
      <PreferencesProvider>
        <Editor />
      </PreferencesProvider>
    </main>
  );
}
