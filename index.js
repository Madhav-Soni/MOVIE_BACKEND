import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors({
    origin:process.env.FRONTEND_URL ||"http://localhost:5173",
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

import dbconnect from "./database/db.js";
dbconnect();

import routes from "./routes.js";
import tmdbRoutes from "./tmdbRoutes.js";

app.use("/api", routes);
app.use("/api/tmdb", tmdbRoutes);


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});