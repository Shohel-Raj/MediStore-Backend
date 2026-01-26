import express from "express"

import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.use(cors({
    origin: process.env.APP_URL ,
    credentials: true
}))

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("MediStore is cooking..........!");
});


export default app;