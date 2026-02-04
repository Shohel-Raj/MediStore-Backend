import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { SellerController } from "./seller.controller";

const router = express.Router();

// ======================= post medicines =================

router.post(
  "/medicines",
  auth(UserRole.SELLER, UserRole.ADMIN),
  SellerController.createProduct,
);

// ======================== get all medicines ================
router.get("/medicines",  auth(UserRole.SELLER, UserRole.ADMIN),
 SellerController.getAllProducts);

// ========================== get single medicines =========================
router.get("/medicines/:productId", SellerController.getProductById);

// ======================= update product ======================================
router.put("/medicines/:productId",auth(UserRole.SELLER, UserRole.ADMIN), SellerController.updateProduct)

// ===================== delete single medicines ======================
router.delete("/medicines/:productId",auth(UserRole.SELLER, UserRole.ADMIN), SellerController.deleteProductById)



export const sellerRouter: Router = router;
