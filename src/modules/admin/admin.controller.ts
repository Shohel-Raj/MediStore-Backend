import { Request,Response } from "express";
import { adminService } from "./admin.service";

// ---------------- DASHBOARD ----------------
const getOverviewStats = async (req: Request, res: Response) => {
  try {
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



export const adminController = {
  // stats
  getOverviewStats



}