import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getAllCustomers,
    getDashboardStats,
    getOrders,
    updateOrderStatus,
    updateProduct
} from "../controllers/admin.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/verifyUser.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.use(verifyAdmin, verifyUser)

router.post("/create", upload.array("images", 3), createProduct);
router.post("/update/:id", upload.array("images", 3), updateProduct);
router.post("/delete/:id", deleteProduct);
router.get("/products", getAllProduct);

router.get("/orders", getOrders)
router.patch("/order/:id/status", updateOrderStatus) 

router.get("/customers", getAllCustomers)
router.get("/stats", getDashboardStats)

export default router; 