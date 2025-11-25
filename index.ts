import express from "express";
import path from "path";

const app = express();

app.use(express.static(path.join(import.meta.dir, "client/dist")));

app.listen(3000, () => console.log(`Server is running at PORT:${3000}`));
