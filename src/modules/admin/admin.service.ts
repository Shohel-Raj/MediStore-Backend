import { OrderStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

// ---------------- DASHBOARD OVERVIEW ----------------
const getOverviewStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalCustomers = await prisma.user.count({
    where: { role: "CUSTOMER" },
  });
  const totalSellers = await prisma.user.count({ where: { role: "SELLER" } });

  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();

  const revenueAgg = await prisma.order.aggregate({
    _sum: { finalAmount: true },
  });

  return {
    totalUsers,
    totalCustomers,
    totalSellers,
    totalProducts,
    totalOrders,
    totalRevenue: revenueAgg._sum.finalAmount || 0,
  };
};
// ---------------- DASHBOARD: MONTHLY SALES ----------------
const getMonthlySalesStats = async (year: number) => {
  // Pull all delivered orders of that year
  const orders = await prisma.order.findMany({
    where: {
      status: OrderStatus.DELIVERED,
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
    select: {
      createdAt: true,
      finalAmount: true,
    },
  });

  // Initialize 12 months
  const monthly = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalSales: 0,
    totalOrders: 0,
  }));

  // Aggregate
  for (const order of orders) {
    const date = new Date(order.createdAt);
    
    // Skip if somehow invalid date 
    if (isNaN(date.getTime())) continue;

    const monthIndex = date.getMonth(); // 0–11

    // This line is almost never needed because we pre-created all 12 months
    // But it's a good defensive pattern if you ever change the init logic
    monthly[monthIndex] ??= {
      month: monthIndex + 1,
      totalSales: 0,
      totalOrders: 0,
    };

    monthly[monthIndex]!.totalSales += order.finalAmount ?? 0;
    monthly[monthIndex]!.totalOrders += 1;
  }

  return {
    year,
    monthly,
  };
};

// ---------------- DASHBOARD: ORDER STATUS STATS ----------------
const getOrderStatusStats = async () => {
  const statuses = Object.values(OrderStatus);

  const result = await Promise.all(
    statuses.map(async (status) => {
      const count = await prisma.order.count({ where: { status } });
      return { status, count };
    }),
  );

  return result;
};

// ---------------- DASHBOARD: TOP SELLERS ----------------
const getTopSellersStats = async (limit: number) => {
  // Group products by sellerId and count
  const sellers = await prisma.product.groupBy({
    by: ["sellerId"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: limit,
  });

  const sellerIds = sellers.map((s) => s.sellerId).filter(Boolean) as string[];

  const sellerUsers = await prisma.user.findMany({
    where: { id: { in: sellerIds } },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const mapped = sellers.map((s) => {
    const sellerInfo = sellerUsers.find((u) => u.id === s.sellerId);
    return {
      sellerId: s.sellerId,
      seller: sellerInfo || null,
      totalProducts: s._count.id,
    };
  });

  return mapped;
};

// ---------------- DASHBOARD: RECENT ORDERS ----------------
const getRecentOrders = async (limit: number) => {
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const adminService = {
  // stats
  getOverviewStats,
  getMonthlySalesStats,
  getOrderStatusStats,
  getTopSellersStats,
  getRecentOrders,
};
