import { Request, Response } from "express";
import { orderService } from "./order.service";


const getSellerId = (req: Request) => {
  const user = (req as any).user;
  if (!user?.id) return null;
  return user.id;
};
const getUserId = (req: Request) => {
  const user = (req as any).user;
  if (!user?.id) return null;
  return user.id;
};



// ---------------- CHECKOUT ----------------
const checkout = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { address, discountAmount, shippingFee } = req.body;

    const result = await orderService.checkout({
      userId,
      address,
      discountAmount,
      shippingFee,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// ---------------- USER: GET MY ORDERS ----------------
const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await orderService.getMyOrders(userId);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
// ---------------- USER: GET SINGLE ORDER ----------------
const getMyOrderById = async (req: Request<{ orderId: string }>, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
 
    const orderId = req.params.orderId;

    if (!orderId || isNaN(Number(orderId))) {
    return res.status(400).json({ success: false, message: 'orderId must be a valid number' });
  }

    const result = await orderService.getMyOrderById({
      userId,
      orderId,
    });

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};



export const orderController = {
  checkout,
  getMyOrders,
  getMyOrderById

};