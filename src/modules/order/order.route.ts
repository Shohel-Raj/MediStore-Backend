import express from "express";
import { orderController } from "./order.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/checkout",auth(UserRole.CUSTOMER, UserRole.ADMIN), orderController.checkout);



router.get("/me",auth(UserRole.CUSTOMER, UserRole.ADMIN), orderController.getMyOrders);

router.get("/me/:orderId", orderController.getMyOrderById);

// SELLER
router.get("/seller/my-orders",auth(UserRole.CUSTOMER, UserRole.ADMIN), orderController.getSellerOrders);





export const OrderRoutes = router;
