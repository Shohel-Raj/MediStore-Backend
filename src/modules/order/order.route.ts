import express from "express";
import { orderController } from "./order.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/checkout",auth(UserRole.CUSTOMER, UserRole.ADMIN), orderController.checkout);









export const OrderRoutes = router;
