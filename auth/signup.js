import bcrypt from "bcrypt";
import User from "../Schema/userSchema.js";
import jwt from "jsonwebtoken";

export const signupController = async (req, res) => {
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
        const newUser = await User.create({ name, email: normalizedEmail, password: hashedPassword });

        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: "User created successfully",
            userId: newUser._id,
            name: newUser.name,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}