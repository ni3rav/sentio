import { useEffect, useState } from "react";

export default function App() {
  const serverUrl = import.meta.env.DEV ? "http://localhost:3000" : "";

  const [number, setNumber] = useState<number | null>(null);
  useEffect(() => {
    async function getNumber() {
      try {
        const response = await fetch(`${serverUrl}/number`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data: { random_number: number } = await response.json();
        return data.random_number;
      } catch (error) {
        console.error("Error fetching number:", error);
        return null;
      }
    }

    (async () => {
      const num = await getNumber();
      setNumber(num);
    })();
  }, [serverUrl]);
  return (
    <>
      <h1>
        {number ? `Server gave ${number}` : "Server has not given a number"}
      </h1>
    </>
  );
}
