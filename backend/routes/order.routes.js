import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder, getUserOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/user/:userId", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
