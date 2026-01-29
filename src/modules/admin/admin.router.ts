import express from "express";
import { adminController } from "./admin.controller";


const router = express.Router();

router.get("/stats/overview", adminController.getOverviewStats);




export const AdminRoutes = router;
