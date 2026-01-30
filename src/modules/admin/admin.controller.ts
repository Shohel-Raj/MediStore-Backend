import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getUserId = (req: Request) => {

  const user = (req as any).user;
  if (!user?.id) return null;
  return user.id;
};

// ---------------- DASHBOARD ----------------
const getOverviewStats = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await adminService.getOverviewStats();

    return res.status(200).json({
      success: true,
      message: "Overview stats fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getMonthlySalesStats = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const year = Number(req.query.year) || new Date().getFullYear();

    const result = await adminService.getMonthlySalesStats(year);

    return res.status(200).json({
      success: true,
      message: "Monthly sales stats fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getOrderStatusStats = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await adminService.getOrderStatusStats();

    return res.status(200).json({
      success: true,
      message: "Order status stats fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getTopSellersStats = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const limit = Number(req.query.limit) || 5;

    const result = await adminService.getTopSellersStats(limit);

    return res.status(200).json({
      success: true,
      message: "Top sellers fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const limit = Number(req.query.limit) || 10;

    const result = await adminService.getRecentOrders(limit);

    return res.status(200).json({
      success: true,
      message: "Recent orders fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const adminController = {
  // stats
  getOverviewStats,
  getMonthlySalesStats,
  getOrderStatusStats,
  getTopSellersStats,
  getRecentOrders,
};
