import express from "express";
import { getDashboardStats, getAllCustomers } from "../controllers/admin.controller.js";

const router = express.Router();

// Admin Dashboard Endpoints
router.get("/stats", getDashboardStats);
router.get("/customers", getAllCustomers);

export default router;
