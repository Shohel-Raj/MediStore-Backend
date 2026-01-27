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

export const ProductController = {
  createProduct,
};
