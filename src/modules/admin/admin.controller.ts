import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { UserRole } from "../../middlewares/auth";
import {
  OrderStatus,
  ProductStatus,
  UserStatus,
} from "../../generated/prisma/enums";

interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  search?: string;
}
export type GetAllProductsQuery = {
  page?: string;
  limit?: string;
  search?: string;
  status?: ProductStatus;
};

export type GetAllProductsParams = {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  status?: ProductStatus;
};

type GetAllOrdersQuery = {
  page?: string;
  limit?: string;
  status?: OrderStatus;
};

type GetorderParams = {
  page: number;
  limit: number;
  skip: number;
  status?: OrderStatus;
};
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

// ---------------- USERS ----------------
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search && String(req.query.search);
    const params = {
      page,
      limit,
      skip,
    } as PaginationParams;

    if (search) {
      params.search = search;
    }
    const result = await adminService.getAllUsers(params);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      ...result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getUserById = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const admin = getUserId(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { userId } = req.params;

    const result = await adminService.getUserById(userId);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "User not found",
    });
  }
};

const updateUserRole = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const admin = getUserId(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { userId } = req.params;
    const { role } = req.body as { role: UserRole };

    const result = await adminService.updateUserRole(userId, role);

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const blockOrUnblockUser = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const admin = getUserId(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { userId } = req.params;
    const { status } = req.body as { status: UserStatus };

    const result = await adminService.blockOrUnblockUser(userId, status);

    return res.status(200).json({
      success: true,
      message: `User ${status ? "blocked" : "unblocked"} successfully`,
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteUser = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const admin = getUserId(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { userId } = req.params;

    const result = await adminService.deleteUser(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// ---------------- PRODUCTS ----------------
export const getAllProducts = async (
  req: Request<{}, {}, {}, GetAllProductsQuery>,
  res: Response,
) => {
  try {
    const admin = getUserId(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();
    const status = req.query.status;

    const params: GetAllProductsParams = {
      page,
      limit,
      skip,
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
    };

    const result = await adminService.getAllProducts(params);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      ...result,
    });
  } catch (error) {
    const err = error as Error;

    return res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const updateProductStatus = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: ProductStatus };

    const result = await adminService.updateProductStatus(id, status);

    return res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteProduct = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const admin = getUserId(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { id } = req.params;

    const result = await adminService.deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// ---------------- ORDERS ----------------
export const getAllOrders = async (
  req: Request<{}, {}, {}, GetAllOrdersQuery>,
  res: Response,
) => {
  try {
    const admin = getUserId(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const status = req.query.status;

    const params: GetorderParams = {
      page,
      limit,
      skip,
      ...(status ? { status } : {}),
    };

    const result = await adminService.getAllOrders(params);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      ...result,
    });
  } catch (error) {
    const err = error as Error;

    return res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const getOrderById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const admin = getUserId(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { id } = req.params;

    const result = await adminService.getOrderById(id);

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Order not found",
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const admin = getUserId(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: OrderStatus };

    const result = await adminService.updateOrderStatus(id, status);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
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

  // user management
  getAllUsers,
  getUserById,
  updateUserRole,
  blockOrUnblockUser,
  deleteUser,
  // product & order
  getAllOrders,
  getAllProducts,
  updateProductStatus,
  deleteProduct,
  getOrderById,
  updateOrderStatus,
};
