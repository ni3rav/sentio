import express, { type Request, type Response } from "express";
import cors from "cors";
import path from "path";

const app = express();

// Only use CORS in development
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: "GET",
    })
  );
}

app.get("/number", (req: Request, res: Response) => {
  const randomNumber = Math.floor(Math.random() * 90 + 10);
  return res.status(200).json({ random_number: randomNumber });
});

app.use(express.static(path.join(import.meta.dir, "client/dist")));

app.listen(3000, () => console.log(`Server is running at PORT:${3000}`));
