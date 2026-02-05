import { Request, Response } from "express";
import { orderService } from "./order.service";
import { OrderStatus } from "../../generated/prisma/enums";

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
const getMyOrderById = async (
  req: Request<{ orderId: string }>,
  res: Response,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orderId = req.params.orderId;

 

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

// ---------------- SELLER: GET MY ORDERS ----------------
const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = getSellerId(req);
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = (req.query?.status as OrderStatus | undefined) ?? "PENDING";

    const result = await orderService.getSellerOrders({
      sellerId,
      page,
      limit,
      skip,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Seller orders fetched successfully",
      ...result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
// ---------------- SELLER: GET SINGLE ORDER (ONLY HIS ITEMS) ----------------
const getSellerOrderItems = async (
  req: Request<{ orderId: string }>,
  res: Response,
) => {
  try {
    const sellerId = getSellerId(req);
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { orderId } = req?.params;

    const result = await orderService.getSellerOrderItems({
      sellerId,
      orderId,
    });

    return res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const updateSellerOrderItemStatus = async (req: Request<{orderItemId : string}>, res: Response) => {
  try {
    const sellerId = (req as any).user?.id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { orderItemId } = req.params;
    const { status } = req.body as { status: OrderStatus };

    const result = await orderService.updateSellerOrderItemStatus({
      sellerId,
      orderItemId,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Order item status updated successfully",
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
  getMyOrderById,
  getSellerOrders,
  getSellerOrderItems,
  updateSellerOrderItemStatus
};
