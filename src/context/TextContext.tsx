import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface TextContextType {
  text: string;
  handleTextChange: (newText: string) => void;
  handleDeleteText: () => void;
}

const TextContext = createContext<TextContextType | undefined>(undefined);

export const TextProvider = ({ children }: { children: ReactNode }) => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const persistedText = localStorage.getItem("sentio-content");
    if (persistedText) {
      setText(persistedText);
    }
  }, []);

  const handleTextChange = (newText: string) => {
    setText(newText);
    localStorage.setItem("sentio-content", newText);
  };

  const handleDeleteText = () => {
    setText("");
    localStorage.removeItem("sentio-content");
  };

  return (
    <TextContext.Provider value={{ text, handleTextChange, handleDeleteText }}>
      {children}
    </TextContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useText = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error("useText must be used within TextProvider");
  }
  return context;
};
