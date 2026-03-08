import express from "express";
import { 
    createProduct, getProducts, getProductById, updateProduct, deleteProduct, 
    getCategories 
} from "../controllers/product.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/categories", getCategories);
router.post("/", upload.array("image", 5), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array("image", 5), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
