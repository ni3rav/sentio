import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

export function Timer() {
  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!isStarted) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s === 59) {
          setMinutes((m) => m + 1);
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted]);

  return (
    <Button
      variant="ghost"
      size="default"
      className="h-10 w-20 p-2 text-base"
      onClick={() => setIsStarted((prev) => !prev)}
    >
      {!isStarted
        ? "15:00"
        : `${minutes < 10 ? `0${minutes}` : minutes}:${
            seconds < 10 ? `0${seconds}` : seconds
          }`}
    </Button>
  );
}
