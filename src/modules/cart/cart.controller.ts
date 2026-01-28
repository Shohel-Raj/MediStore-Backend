import { Request, Response } from "express";
import { cartService } from "./cart.service";

const getUserId = (req: Request) => {

  const user = (req as any).user;
  if (!user?.id) return null;
  return user.id;
};

const getMyCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await cartService.getMyCart(userId);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { productId, quantity } = req.body;

    const result = await cartService.addToCart({userId,
      productId,
      quantity,
    });

    return res.status(200).json({
      success: true,
      message: "Added to cart successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};



export const CartController = {
  getMyCart,
  addToCart
};