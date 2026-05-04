import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";

import User from "./Schema/userSchema.js";
import Movie from "./Schema/movieSchema.js";

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const normalizedEmail = email.toLowerCase();
        const checkExistingUser = await User.findOne({ email: normalizedEmail });
        if (checkExistingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 7);
        await User.create({ name, email: normalizedEmail, password: hashedPassword });

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const normalizedEmail = email.toLowerCase();
        const checkExistingUser = await User.findOne({ email: normalizedEmail });
        if (!checkExistingUser) {
            return res.status(400).json({ message: "Login Details don't match" });
        }

        const comparePassword = await bcrypt.compare(password, checkExistingUser.password);
        if (!comparePassword) {
            return res.status(400).json({ message: "Password don't match" });
        }
        res.status(201).json({ message: "Login Done!!!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;