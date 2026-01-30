import express from "express";
import { adminController } from "./admin.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/stats/overview",
  auth(UserRole.ADMIN),
  adminController.getOverviewStats,
);
router.get(
  "/stats/sales/monthly",
  auth(UserRole.ADMIN),
  adminController.getMonthlySalesStats,
);
router.get(
  "/stats/orders/status",
  auth(UserRole.ADMIN),
  adminController.getOrderStatusStats,
);
router.get(
  "/stats/top-sellers",
  auth(UserRole.ADMIN),
  adminController.getTopSellersStats,
);
router.get(
  "/stats/recent-orders",
  auth(UserRole.ADMIN),
  adminController.getRecentOrders,
);

/**
 * USERS MANAGEMENT
 */
router.get("/users",  auth(UserRole.ADMIN),  adminController.getAllUsers);
router.get("/users/:id",  auth(UserRole.ADMIN),  adminController.getUserById);
router.patch("/users/:id/role",  auth(UserRole.ADMIN),  adminController.updateUserRole);
router.patch("/users/:id/block",   auth(UserRole.ADMIN), adminController.blockOrUnblockUser);
router.delete("/users/:id",  auth(UserRole.ADMIN),  adminController.deleteUser);

/**
 * PRODUCTS MANAGEMENT
 */
router.get("/products",auth(UserRole.ADMIN), adminController.getAllProducts);
router.patch("/products/:id/status",auth(UserRole.ADMIN), adminController.updateProductStatus);
router.delete("/products/:id",auth(UserRole.ADMIN), adminController.deleteProduct);

/**
 * ORDERS MANAGEMENT
 */
router.get("/orders",auth(UserRole.ADMIN), adminController.getAllOrders);
router.get("/orders/:id",auth(UserRole.ADMIN), adminController.getOrderById);
router.patch("/orders/:id/status",auth(UserRole.ADMIN), adminController.updateOrderStatus);

export const AdminRoutes = router;
