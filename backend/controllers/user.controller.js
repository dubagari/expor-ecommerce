import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/error.js";

// Signup Logic
export const signup = async (req, res, next) => {
    const { firstname, surname, email, password } = req.body;
    

   
    
    if (!email || !password || !firstname || !surname) {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, "Email is already in use"));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({
            firstname,
            surname,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(errorHandler(500, "Internal server error", error.message));
    }
};

// Login Logic
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Invalid credentials"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        
        const { password: pass, ...rest } = validUser._doc;

        res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    } catch (error) {
        next(error);
    }
};

// Admin Signup Logic
export const adminSignup = async (req, res, next) => {
    const { firstname, surname, email, password } = req.body;
    
    if (!email || !password || !firstname || !surname) {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, "Email is already in use"));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({
            firstname,
            surname,
            email,
            password: hashedPassword,
            role: "admin"
        });
        await newUser.save();
        res.status(201).json({ message: "Admin account created successfully!" });
    } catch (error) {
        next(errorHandler(500, "Internal server error", error.message));
    }
};

// Admin Login Logic
export const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "Admin account not found"));

        if (validUser.role !== "admin") {
            return next(errorHandler(403, "Access denied. Not an admin account."));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Invalid credentials"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        
        const { password: pass, ...rest } = validUser._doc;

        res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest);
    } catch (error) {
        next(error);
    }
};

// Get all users (Admin purpose)
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password").populate("wishlist");
        if (!user) return next(errorHandler(404, "User not found"));
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Update user details
export const updateUser = async (req, res, next) => {
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        if (req.file) {
            req.body.imageUrl = req.file.path.replace(/\\/g, "/");
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select("-password");
        
        if (!updatedUser) return next(errorHandler(404, "User not found"));
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// Delete user
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return next(errorHandler(404, "User not found"));
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Add to wishlist
export const addToWishlist = async (req, res, next) => {
    try {
        const { userId, productId } = req.body;
        const user = await User.findById(userId);
        if (!user) return next(errorHandler(404, "User not found"));
        
        if (user.wishlist.includes(productId)) {
            return next(errorHandler(400, "Product already in wishlist"));
        }

        user.wishlist.push(productId);
        await user.save();
        res.status(200).json(user.wishlist);
    } catch (error) {
        next(error);
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res, next) => {
    try {
        const { userId, productId } = req.body;
        const user = await User.findById(userId);
        if (!user) return next(errorHandler(404, "User not found"));
        
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        res.status(200).json(user.wishlist);
    } catch (error) {
        next(error);
    }
};