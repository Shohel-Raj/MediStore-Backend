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

export const AdminRoutes = router;
