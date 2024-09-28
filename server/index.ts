import express, { Express, Request, Response } from "express";
import cors from "cors";
import db from "./lib/db";
import { SessionStatus } from "./types";

const port = 8000;
const app: Express = express();
app.use(cors());;
app.use(express.json());

app.get("/sessions", async (req: Request, res: Response) => {
    try {
        const { rows } = await db.query('SELECT name, id, last_active, status, CARDINALITY(deals) as num_deals FROM sessions ORDER BY last_active DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/sessions/create", async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO sessions (name, id, deals, scores, last_active, status) VALUES ($1, gen_random_uuid(), $2, $3, NOW(), $4) RETURNING *',
            [name, [], [], SessionStatus.InProgress]
        );
        return res.status(201).json({
            name: rows[0].name,
            id: rows[0].id,
            last_active: rows[0].last_active,
            num_deals: rows[0].deals.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/cards", (req: Request, res: Response) => {
    const player = req.query.player as string;
    console.log('player', player);
    let ocrOutput;
    if (player === 'Dealer') {
        ocrOutput = {
            spades: ["K", "5"],
            hearts: ["A", "J", "10", "4"],
            clubs: ["A", "4", "2"],
            diamonds: ["A", "J", "9", "2"],
        };
    } else if (player === 'Dummy') {
        ocrOutput = {
            spades: ["A", "Q", "9", "8", "6", "4", "3"],
            hearts: ["3"],
            clubs: ["J", "6", "3"],
            diamonds: ["7", "6"],
        };
    } else if (player === 'Opponent1') {
        ocrOutput = {
            spades: [],
            hearts: ["K", "Q", "9", "7", "6"],
            clubs: ["K", "10", "8", "7"],
            diamonds: ["10", "8", "4", "3"],
        };
    } else { // player === 'Opponent2'
        ocrOutput = {
            spades: ["J", "10", "7", "2"],
            hearts: ["8", "5", "2"],
            clubs: ["Q", "9", "5"],
            diamonds: ["K", "Q", "5"],
        };
    }

    res.send(ocrOutput);
});

app.get("/dds", (req: Request, res: Response) => {
    res.send("Karaoke is fun!");
});

app.listen(port, () => {
    console.log("Listening...");
});