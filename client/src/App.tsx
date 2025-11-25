import { useEffect, useState } from "react";

export default function App() {
  const serverUrl = import.meta.env.SERVER_URL || "http://localhost:3000";

  const [number, setNumber] = useState<number | null>(null);
  useEffect(() => {
    async function getNumber() {
      const response: {
        random_number: number;
      } = await fetch(`${serverUrl}/number`).then((res) => res.json());
      return response.random_number;
    }

    (async () => {
      const num = await getNumber();
      setNumber(num);
    })();
  }, [serverUrl]);
  return (
    <>
      <h1>{number ? `Server gave ${number}` : "Server has not given a number"}</h1>
    </>
  );
}
