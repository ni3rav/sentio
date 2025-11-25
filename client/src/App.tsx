import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
  DownloadIcon,
  UploadIcon,
} from "lucide-react";

type JournalEntry = {
  id: string;
  title: string;
  body: string;
  date: string;
};

const STORAGE_KEY = "microjournal-entries";
const THEME_STORAGE_KEY = "microjournal-theme";
const TITLE_MAX_LENGTH = 100;
const BODY_MAX_LENGTH = 500;
const DAYS_IN_WEEK = 7;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const QUOTES = [
  "The happiness of your life depends upon the quality of your thoughts. - Marcus Aurelius",
  "You have power over your mind - not outside events. Realize this, and you will find strength. - Marcus Aurelius",
  "Waste no more time arguing what a good man should be. Be one. - Marcus Aurelius",
  "He who fears death will never do anything worth of a man who is alive. - Seneca",
  "We suffer more often in imagination than in reality. - Seneca",
  "Luck is what happens when preparation meets opportunity. - Seneca",
  "It is not the man who has too little, but the man who craves more, that is poor. - Seneca",
  "No man is free who is not master of himself. - Epictetus",
  "First say to yourself what you would be; and then do what you have to do. - Epictetus",
  "It's not what happens to you, but how you react to it that matters. - Epictetus",
];

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [randomQuote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)]
  );
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? stored === "dark" : false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const openCreateSheet = () => {
    setCurrentEntry(null);
    setTitle("");
    setBody("");
    setIsSheetOpen(true);
  };

  const openEditSheet = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setBody(entry.body);
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !body.trim()) return;

    if (currentEntry) {
      const updated = entries.map((e) =>
        e.id === currentEntry.id
          ? { ...e, title: title.trim(), body: body.trim() }
          : e
      );
      saveEntries(updated);
    } else {
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        date: new Date().toISOString(),
      };
      saveEntries([newEntry, ...entries]);
    }

    setIsSheetOpen(false);
    setTitle("");
    setBody("");
  };

  const handleDelete = () => {
    if (deleteId) {
      saveEntries(entries.filter((e) => e.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(entries, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sentio-journal-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setShowImportExport(false);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (!Array.isArray(data)) {
            setImportError("Invalid format: Expected an array of entries");
            return;
          }

          const isValid = data.every(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (entry: any) =>
              entry.id &&
              entry.title &&
              entry.body &&
              entry.date &&
              typeof entry.id === "string" &&
              typeof entry.title === "string" &&
              typeof entry.body === "string" &&
              typeof entry.date === "string"
          );

          if (!isValid) {
            setImportError("Invalid format: Entries missing required fields");
            return;
          }

          saveEntries(data);
          setShowImportExport(false);
        } catch (error) {
          console.error(error);
          setImportError("Invalid format: Could not parse JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / MS_PER_DAY);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < DAYS_IN_WEEK) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-lg">
        <header className="mb-6 pt-4 flex items-center justify-between">
          <div style={{ fontFamily: "'Lexend', sans-serif" }}>
            <h1 className="text-3xl font-bold text-foreground">sentio</h1>
            <p className="text-sm text-muted-foreground mt-1">let it out</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 -mt-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowImportExport(true)}
              className="h-8 w-8"
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
            <SunIcon className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={isDark}
              onCheckedChange={setIsDark}
              aria-label="Toggle theme"
            />
            <MoonIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </header>

        {entries.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            style={{ fontFamily: "'Lexend', sans-serif" }}
          >
            <p
              className="text-muted-foreground italic max-w-sm"
              style={{ fontSize: "1.2rem" }}
            >
              {randomQuote}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-0">
              {entries.map((entry, index) => (
                <div key={entry.id}>
                  <div className="py-4 px-2">
                    <h2
                      className="text-lg font-semibold text-foreground"
                      style={{ fontFamily: "'Lexend', sans-serif" }}
                    >
                      {entry.title}
                    </h2>
                    <div className="flex items-center justify-between gap-4 mt-1">
                      <p
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "'Lexend', sans-serif" }}
                      >
                        {formatDate(entry.date)}
                      </p>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditSheet(entry)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(entry.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < entries.length - 1 && (
                    <div className="border-b border-border" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-lg shadow-lg"
        onClick={openCreateSheet}
      >
        <PlusIcon className="h-6 w-6" />
      </Button>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] px-6">
          <SheetHeader className="px-0">
            <SheetTitle
              style={{ fontFamily: "'Lexend', sans-serif", fontSize: "1.3rem" }}
            >
              {currentEntry ? "Edit Entry" : "New Entry"}
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-6 px-0">
            <div>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value.slice(0, TITLE_MAX_LENGTH))
                }
                maxLength={TITLE_MAX_LENGTH}
                style={{
                  fontFamily: "'Lexend', sans-serif",
                  fontSize: "1.1rem",
                }}
              />
              <p
                className="text-xs text-muted-foreground mt-1 text-right"
                style={{ fontFamily: "'Lexend', sans-serif" }}
              >
                {title.length}/{TITLE_MAX_LENGTH}
              </p>
            </div>
            <div>
              <Textarea
                placeholder="What's on your mind?"
                value={body}
                onChange={(e) =>
                  setBody(e.target.value.slice(0, BODY_MAX_LENGTH))
                }
                maxLength={BODY_MAX_LENGTH}
                className="min-h-[420px] resize-none"
                style={{
                  fontFamily: "'Lexend', sans-serif",
                  fontSize: "1.1rem",
                }}
              />
              <p
                className="text-xs text-muted-foreground mt-1 text-right"
                style={{ fontFamily: "'Lexend', sans-serif" }}
              >
                {body.length}/{BODY_MAX_LENGTH}
              </p>
            </div>
          </div>
          <SheetFooter className="px-0">
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !body.trim()}
              className="w-full"
              style={{ fontFamily: "'Lexend', sans-serif", fontSize: "1.1rem" }}
            >
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent style={{ fontFamily: "'Lexend', sans-serif" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontSize: "1.3rem" }}>
              Delete entry?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ fontSize: "1.1rem" }}>
              This action cannot be undone. This entry will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ fontSize: "1.1rem" }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              style={{ fontSize: "1.1rem" }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showImportExport} onOpenChange={setShowImportExport}>
        <AlertDialogContent style={{ fontFamily: "'Lexend', sans-serif" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontSize: "1.3rem" }}>
              Import / Export
            </AlertDialogTitle>
            <AlertDialogDescription style={{ fontSize: "1.1rem" }}>
              Export your journal entries to a file or import from a backup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={handleExport}
              className="w-full"
              style={{ fontSize: "1.1rem" }}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export Journal
            </Button>
            <Button
              onClick={handleImport}
              variant="outline"
              className="w-full"
              style={{ fontSize: "1.1rem" }}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Import Journal
            </Button>
            <AlertDialogCancel
              className="w-full"
              style={{ fontSize: "1.1rem" }}
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={importError !== null}
        onOpenChange={() => setImportError(null)}
      >
        <AlertDialogContent style={{ fontFamily: "'Lexend', sans-serif" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontSize: "1.3rem" }}>
              Import Failed
            </AlertDialogTitle>
            <AlertDialogDescription style={{ fontSize: "1.1rem" }}>
              {importError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setImportError(null)}
              style={{ fontSize: "1.1rem" }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={exportSuccess} onOpenChange={setExportSuccess}>
        <AlertDialogContent style={{ fontFamily: "'Lexend', sans-serif" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontSize: "1.3rem" }}>
              Export Successful
            </AlertDialogTitle>
            <AlertDialogDescription style={{ fontSize: "1.1rem" }}>
              Your journal has been exported successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setExportSuccess(false)}
              style={{ fontSize: "1.1rem" }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
