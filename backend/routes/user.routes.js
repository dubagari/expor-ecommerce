import express from "express";
import {
  signup,
  login,
  logout,
  getAllUser,
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
  addWishlist,
  getWishlist,
  deleteWishlist,
} from "../controllers/user.controller.js"; 
import { verifyUser } from "../middleware/verifyUser.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/users", getAllUser);


router.post("/address",verifyUser, addAddress)
router.get("/address",verifyUser, getAddress)
router.put("/address/:addressId",verifyUser, updateAddress)
router.delete("/address/:addressId", verifyUser, deleteAddress)


router.post("wishlist",verifyUser, addWishlist)
router.get("wishlist/:id",verifyUser, getWishlist)
router.delete("wishlist/:id",verifyUser, deleteWishlist)

export default router;
