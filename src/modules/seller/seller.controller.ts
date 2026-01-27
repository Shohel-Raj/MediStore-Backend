import { NextFunction, Request, Response } from "express";
import { SellerService } from "./seller.service";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const sellerId = req.user?.id;

    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is empty. Please provide product data.",
      });
    }
    const product = {
      ...req.body,
      sellerId,
    };
    const result = await SellerService.createProduct(product);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};
const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 📄 Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sellerId = req.user?.id;

    // 🔃 Sorting
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      req.query.sortOrder === "asc" || req.query.sortOrder === "desc"
        ? (req.query.sortOrder as "asc" | "desc")
        : "desc";

    // 🔍 Build filter object dynamically (NO undefined values)
    const filters: any = {
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      sellerId,
    };

    if (req.query.search) filters.search = String(req.query.search);
    if (req.query.manufacturer)
      filters.manufacturer = String(req.query.manufacturer);
    if (req.query.dosageForm) filters.dosageForm = String(req.query.dosageForm);

    if (req.query.minPrice) filters.minPrice = Number(req.query.minPrice);
    if (req.query.maxPrice) filters.maxPrice = Number(req.query.maxPrice);

    if (req.query.inStock !== undefined)
      filters.inStock = req.query.inStock === "true";

    if (req.query.hasDiscount !== undefined)
      filters.hasDiscount = req.query.hasDiscount === "true";

    if (req.query.sellerId) filters.sellerId = String(req.query.sellerId);

    // 🔍 Call service
    const result = await SellerService.getAllProducts(filters);

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw new Error("Post Id is required!");
    }
    const result = await SellerService.getProductById(productId as string);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Post creation failed",
      details: e,
    });
  }
};

const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = req.params?.productId as string;
    // Check that user is logged in
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    // Pass only the required fields to the service
    const user = { id: req.user.id, role: req.user.role };
    const result = await SellerService.deleteProduct(productId, user);

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Delete product error:", err);
    res.status(403).json({ error: err.message });
  }
};


const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const productId = req.params?.productId as string;
    // 1️ Get productId from params
    if (!productId) return res.status(400).json({ error: "Product ID is required" });
    

    // 2️ Get logged-in user
    if (!req.user) return res.status(401).json({ error: "Unauthorized: User not found" });

    const sellerId = req.user.id;
    const isAdmin = req.user.role === "admin";

    // 3️ Call service to update
    const updatedProduct = await SellerService.updateProduct(
      productId,
      req.body,   // Partial product data from request body
      sellerId,
      isAdmin
    );

    // 4️ Return updated product
    res.status(200).json(updatedProduct);
  } catch (err: any) {
    console.error("Update product error:", err);
    res.status(403).json({ error: err.message });
  }
};


export const SellerController = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  updateProduct
};
