import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET",
  })
);

app.get("/number", (req: Request, res: Response) => {
  const randomNumber = Math.floor(Math.random() * 90 + 10);
  return res.status(200).json({ random_number: randomNumber });
});

app.listen(process.env.PORT || 3000, () => console.log(`Server is running`));
