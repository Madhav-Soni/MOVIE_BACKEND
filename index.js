import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

import dbconnect from "./database/db.js";
dbconnect();

import routes from "./routes.js";
app.use("/api", routes);


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});