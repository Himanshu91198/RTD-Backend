import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      email,
      username: username.toLowerCase(),
      password,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  } catch (err) {
    console.log("Internal server error", err);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatched = await user.comparePassword(password);
    if (!isMatched)
      return res.status(400).json({ message: "Invalid user credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({
      message: "User loggedin successfully",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Internal server error", err);
  }
};
