import { Check, Download, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function DownloadButton() {
  const [error, setError] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const handleDownload = () => {
    try {
      const content = localStorage.getItem("sentio-content");
      if (!content) {
        setError(true);
        return;
      }
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sentio-content.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloaded(true);
      setError(false);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setTimeout(() => {
        setError(false);
        setDownloaded(false);
      }, 3000);
    }
  };

  return (
    <Button
      variant="ghost"
      size="default"
      className={cn(
        "h-10 w-10 p-2",
        error && "text-red-500 hover:text-red-600",
        downloaded && "text-green-500 hover:text-green-600"
      )}
      onClick={handleDownload}
      disabled={downloaded}
    >
      {error ? (
        <X className="h-5 w-5" />
      ) : downloaded ? (
        <Check className="h-5 w-5" />
      ) : (
        <Download className="h-5 w-5" />
      )}
    </Button>
  );
}
