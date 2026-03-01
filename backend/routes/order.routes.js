import express from "express";

import { createOrder, getOrders } from "../controllers/order.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";
const router = express.Router()

router.post("/create", verifyUser, createOrder)
router.get("/get", verifyUser, getOrders)

export default router
