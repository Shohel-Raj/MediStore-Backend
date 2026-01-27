import { NextFunction,Request ,Response} from "express";
import { productService } from "./products.service";


const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
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
    const result = await productService.createProduct(req.body );
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};
const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 📄 Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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
    };

    if (req.query.search) filters.search = String(req.query.search);
    if (req.query.manufacturer) filters.manufacturer = String(req.query.manufacturer);
    if (req.query.dosageForm) filters.dosageForm = String(req.query.dosageForm);

    if (req.query.minPrice) filters.minPrice = Number(req.query.minPrice);
    if (req.query.maxPrice) filters.maxPrice = Number(req.query.maxPrice);

    if (req.query.inStock !== undefined)
      filters.inStock = req.query.inStock === "true";

    if (req.query.hasDiscount !== undefined)
      filters.hasDiscount = req.query.hasDiscount === "true";

    if (req.query.sellerId) filters.sellerId = String(req.query.sellerId);

    // 🔍 Call service
    const result = await productService.getAllProducts(filters);

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};


export const ProductController = {
  createProduct,
  getAllProducts
};
