import { OrderStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";




// ---------------- DASHBOARD: OVERVIEW STATS ----------------
const getOverviewStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalSellers = await prisma.user.count({ where: { role: "SELLER" } as any });
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();

  // Revenue from completed/delivered orders (you can change)
  const deliveredOrders = await prisma.order.findMany({
    where: { status: OrderStatus.DELIVERED },
    select: { finalAmount: true },
  });

  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.finalAmount, 0);

  return {
    totalUsers,
    totalSellers,
    totalProducts,
    totalOrders,
    totalRevenue,
  };
};



export const adminService = {
  // stats
  getOverviewStats


}