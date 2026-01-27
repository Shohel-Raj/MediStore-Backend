import express, { Router } from "express";
import { ProductController } from "./products.controller";

const router = express.Router();


// ======================== get all medicines ================
router.get("/", ProductController.getAllProducts);

// ============== get all catagory ==============
router.get("/categories", ProductController.getAllCategories);


// ========================== get single medicines =========================
router.get("/:productId", ProductController.getProductById);



export const productRouter: Router = router;
