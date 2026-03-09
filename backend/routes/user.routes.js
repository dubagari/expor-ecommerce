import express from "express";
import { signup, login, adminSignup, adminLogin, getUsers, getUserById, updateUser, deleteUser, addToWishlist, removeFromWishlist } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// User Auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-signup", adminSignup);
router.post("/admin-login", adminLogin);

// User Management
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// User Wishlist Management
router.post("/wishlist", addToWishlist);
router.delete("/wishlist", removeFromWishlist);

export default router;