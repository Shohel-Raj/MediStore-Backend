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

const updateCartItemQuantity = async (req: Request<{ itemId: string }, any, { quantity: number }>, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { itemId  } = req.params;
    const { quantity } = req.body;

    

    const result = await cartService.updateCartItemQuantity({userId, itemId, quantity});

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const removeCartItem = async (req: Request<{ itemId: string }>, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { itemId } = req.params;

    const result = await cartService.removeCartItem({userId, itemId});

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
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
  addToCart,
  removeCartItem,
  updateCartItemQuantity
};