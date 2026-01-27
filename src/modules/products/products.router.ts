import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { ProductController } from "./products.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  ProductController.createProduct,
);
router.get(
  "/",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  ProductController.getAllProducts,
);



export const productRouter: Router = router;
