import bcrypt from "bcrypt";
import User from "../Schema/userSchema.js";
import jwt from "jsonwebtoken";

export const loginController = async (req, res) => {
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

        const token = jwt.sign({ _id: checkExistingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: "Login Done!!!", userId: checkExistingUser._id, name: checkExistingUser.name, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

