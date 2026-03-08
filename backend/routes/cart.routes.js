import express from "express";
import { createCart, getCartByUserId, updateCart, clearCart, deleteCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/test/info", (req, res) => res.json({ message: "Cart API is reachable!" }));
router.post("/", createCart);
router.get("/:userId", getCartByUserId);
router.put("/:userId", updateCart);
router.delete("/:userId/clear", clearCart);
router.delete("/:userId", deleteCart);

export default router;
