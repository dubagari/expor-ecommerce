import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../middleware/error.js";

export const signup = async (req, res, next) => {
  try {
    const { firstname, surname, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      surname,
      email,
      password: hash,
   
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });

    if (!validUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isPasswordValid = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ success: false, message: "Wrong credentials" });

    const token = jwt.sign(
      { id: validUser._id, },
      process.env.JWT_SECRET
    );

    const { password: pass, ...userData } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, ...userData });
  } catch (error) {
    next(errorHandler(401, error.message));
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// GET all users (admin only)
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // never send passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
