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
        const { rows: dealRows } = await db.query(
            'INSERT INTO deals (id) values (gen_random_uuid()) RETURNING *',
        );
        const { rows } = await db.query(
            'INSERT INTO sessions (name, id, deals, scores, last_active, status) VALUES ($1, gen_random_uuid(), $2, $3, NOW(), $4) RETURNING *',
            [name, [dealRows[0].id], [], SessionStatus.InProgress],
        );
        return res.status(201).json({
            name: rows[0].name,
            id: rows[0].id,
            last_active: rows[0].last_active,
            status: rows[0].status,
            num_deals: rows[0].deals.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/session/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(
            'SELECT name, array_length(deals, 1) as deal_number FROM sessions WHERE id = $1',
            [id],
        );
        return res.status(201).json({
            name: rows[0].name,
            deal_number: rows[0].deal_number,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/cards", async (req: Request, res: Response) => {
    return res.status(201).json({
        hand: ["2C", "3C", "4C", "5C", "2D", "3D", "4D", "5D", "2H", "3H", "4H", "KS", "AS"],
    });
});

app.post("/deal/:id", async (req: Request, res: Response) => {
    // Save the deal in DB
    // Call DDS
    // Save the score
    // Update the status of the deal (need to add this back in)
});

app.listen(port, () => {
    console.log("Listening...");
});