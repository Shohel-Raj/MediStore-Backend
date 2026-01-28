import express from "express";
import { CartController } from "./cart.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

// Get my cart
router.get(
  "/me",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  CartController.getMyCart,
);

// Add item to cart
router.post("/add",  auth(UserRole.CUSTOMER, UserRole.ADMIN),
 CartController.addToCart);

export const CartRoutes = router;
