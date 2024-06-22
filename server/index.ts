import express, { Express, Request, Response } from "express";
import cors from "cors";

const port = 8000;
const app: Express = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello!");
});

app.get("/karaoke", (req: Request, res: Response) => {
    res.send("Karaoke is fun!");
});

app.listen(port, () => {
    console.log("Listening...");
});