  import { createContext, useContext, useState, ReactNode } from "react";
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
  // eslint-disable-next-line react-refresh/only-export-components
  export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (!context)
      throw new Error("usePreferences must be used within PreferencesProvider");
    return context;
  };

  export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
    const [font, setFont] = useState<FontType>("sans");
    const [fontSize, setFontSize] = useState<FontSizeType>("base");
    const [themeStyle, setThemeStyle] = useState<ThemeType>("light");

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
