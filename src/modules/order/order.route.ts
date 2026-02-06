import express from "express";
import { orderController } from "./order.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/checkout",
  auth(UserRole.CUSTOMER,UserRole.SELLER, UserRole.ADMIN),
  orderController.checkout,
);

router.get(
  "/me",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  orderController.getMyOrders,
);

router.get("/me/:orderId",auth(UserRole.CUSTOMER, UserRole.ADMIN), orderController.getMyOrderById);

// SELLER
router.get(
  "/seller/my-orders",
  auth(UserRole.SELLER, UserRole.ADMIN),
  orderController.getSellerOrders,
);

router.get(
  "/seller/my-orders/:orderId",
  auth(UserRole.SELLER, UserRole.ADMIN),
  orderController.getSellerOrderItems,
);

router.patch(
  "/seller/order-items/:orderItemId/status",
  auth(UserRole.SELLER, UserRole.ADMIN),
  orderController.updateSellerOrderItemStatus,
);

export const OrderRoutes = router;
