import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { FontSizeType, FontType, ThemeType } from "~/lib/types";

type PreferencesContextType = {
  font: FontType;
  setFont: (font: FontType) => void;
  fontSize: FontSizeType;
  setFontSize: (size: FontSizeType) => void;
  themeStyle: ThemeType;
  setThemeStyle: (theme: ThemeType) => void;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

const isFontType = (value: string): value is FontType =>
  ["sans", "serif", "mono"].includes(value);

const isFontSizeType = (value: string): value is FontSizeType =>
  ["xs", "sm", "base", "lg", "xl"].includes(value);

const isThemeType = (value: string): value is ThemeType =>
  ["light", "dark", "sepia"].includes(value);

// eslint-disable-next-line react-refresh/only-export-components
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
};

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const getInitialPreference = <T,>(
    key: string,
    defaultValue: T,
    validator: (value: string) => boolean
  ): T => {
    if (typeof window === "undefined") return defaultValue;
    const saved = sessionStorage.getItem(key);
    return saved && validator(saved) ? (saved as T) : defaultValue;
  };

  const [font, setFont] = useState<FontType>(() =>
    getInitialPreference("font", "sans", isFontType)
  );

  const [fontSize, setFontSize] = useState<FontSizeType>(() =>
    getInitialPreference("fontSize", "base", isFontSizeType)
  );

  const [themeStyle, setThemeStyle] = useState<ThemeType>(() =>
    getInitialPreference("themeStyle", "light", isThemeType)
  );

  // Persist preferences to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("font", font);
  }, [font]);

  useEffect(() => {
    sessionStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    sessionStorage.setItem("themeStyle", themeStyle);
  }, [themeStyle]);

  return (
    <PreferencesContext.Provider
      value={{
        font,
        setFont,
        fontSize,
        setFontSize,
        themeStyle,
        setThemeStyle,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
