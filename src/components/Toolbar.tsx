import React, { useState } from "react";
import {
  Check,
  Moon,
  Sun,
  Type,
  Sunset,
  Clipboard,
  ClipboardCheck,
  ClipboardX,
  Trash,
} from "lucide-react";
import { usePreferences } from "~/context/PreferencesContext";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import type { FontSizeType, FontType, ThemeType } from "~/lib/types";

export function Toolbar() {
  const { font, setFont, fontSize, setFontSize, themeStyle, setThemeStyle } =
    usePreferences();
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const fonts: { value: FontType; label: string }[] = [
    { value: "sans", label: "sans" },
    { value: "serif", label: "serif" },
    { value: "mono", label: "mono" },
  ];

  const fontSizes: { value: FontSizeType; label: string }[] = [
    { value: "xs", label: "extra small" },
    { value: "sm", label: "small" },
    { value: "base", label: "base" },
    { value: "lg", label: "large" },
    { value: "xl", label: "extra large" },
  ];

  const themes: { value: ThemeType; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "light", icon: <Sun className="h-5 w-5" /> },
    { value: "dark", label: "dark", icon: <Moon className="h-5 w-5" /> },
    { value: "sepia", label: "sepia", icon: <Sunset className="h-5 w-5" /> },
  ];

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(
        localStorage.getItem("sentio-content")?.trim() || ""
      );
      setCopyStatus("success");
    } catch (error) {
      setCopyStatus("error");
      console.error("failed to copy content:", error);
    } finally {
      setTimeout(() => {
        setCopyStatus("idle");
      }, 1500);
    }
  };

  const handleDelete = () => {
    alert("remove the content");
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 p-3 bg-background/95 rounded-lg">
      {/* Font Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="default" className="h-10 w-10 p-2">
            <Type className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[160px] p-2">
          {fonts.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => setFont(item.value)}
              className={cn(
                "lowercase px-3 py-2 text-sm gap-2",
                font === item.value && "font-bold"
              )}
            >
              <span>{item.label}</span>
              {font === item.value && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Size Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="default" className="h-10 w-10 p-2">
            <span className="text-base">A</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[160px] p-2">
          {fontSizes.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => setFontSize(item.value)}
              className={cn(
                "lowercase px-3 py-2 text-sm gap-2",
                fontSize === item.value && "font-bold"
              )}
            >
              <span>{item.label}</span>
              {fontSize === item.value && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="default" className="h-10 w-10 p-2">
            {themes.find((t) => t.value === themeStyle)?.icon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[160px] p-2">
          {themes.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => setThemeStyle(item.value)}
              className={cn(
                "lowercase px-3 py-2 text-sm gap-2",
                themeStyle === item.value && "font-bold"
              )}
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
              {themeStyle === item.value && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="default"
        className="h-10 w-10 p-2 hover:cursor-pointer transition-transform duration-200 ease-in-out"
        onClick={handleCopy}
      >
        {copyStatus === "idle" && <Clipboard className="h-4 w-4" />}
        {copyStatus === "success" && (
          <ClipboardCheck className="h-4 w-4 text-green-500 animate-ping-once" />
        )}
        {copyStatus === "error" && (
          <ClipboardX className="h-4 w-4 text-red-500 animate-ping-once" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="default"
        className="h-10 w-10 p-2 hover:cursor-pointer transition-transform duration-200 ease-in-out"
        onClick={handleDelete}
      >
        {deleteStatus === "idle" && <Trash className="h-4 w-4" />}
        {deleteStatus === "success" && (
          <Trash className="h-4 w-4 text-green-500 animate-ping-once" />
        )}
        {deleteStatus === "error" && (
          <Trash className="h-4 w-4 text-gray-500 animate-ping-once" />
        )}
      </Button>
    </div>
  );
}
