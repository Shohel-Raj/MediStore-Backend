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

 // Update item quantity
router.patch("/item/:itemId",auth(UserRole.CUSTOMER, UserRole.ADMIN), CartController.updateCartItemQuantity);

// Remove item
router.delete("/item/:itemId",auth(UserRole.CUSTOMER, UserRole.ADMIN), CartController.removeCartItem);

export const CartRoutes = router;
