import { Prisma } from "../../generated/prisma/client";
import { OrderStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
type MyAddressInput = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;       // ← change to null
  city: string;
  district: string | null;           // ← change to null
  postalCode: string | null;         // ← change to null
  label: string | null;              // ← change to null
};



// ---------------- CREATE ORDER (CHECKOUT) ----------------
const checkout = async ({
  userId,
  address,
  discountAmount,
  shippingFee,
}: {
  userId: string;
  address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district?: string;
    postalCode?: string;
    label?: string;
  };
  discountAmount?: number;
  shippingFee?: number;
}) => {
  // 1) Get cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 2) Calculate totals
  const totalAmount = cart.items.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const discount = discountAmount ?? 0;
  const shipping = shippingFee ?? 0;

  const finalAmount = totalAmount - discount + shipping;

  if (finalAmount < 0) {
    throw new Error("Invalid final amount");
  }
  const data: MyAddressInput= {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || null,
        city: address.city,
        district: address.district || null,
        postalCode: address.postalCode || null,
        label: address.label || null,
      }

  // 3) Transaction: create address + order + items + clear cart
  const order = await prisma.$transaction(async (tx) => {
    // create order address snapshot
    const createdAddress = await tx.orderAddress.create({
      data:  data
    });

    // create order
    const createdOrder = await tx.order.create({
      data: {
        userId,
        shippingAddressId: createdAddress.id,
        totalAmount,
        discountAmount: discount,
        shippingFee: shipping,
        finalAmount,
        status: OrderStatus.PENDING,
      },
    });

    // create order items
    const orderItemsData = cart.items.map((item) => {
      const unitPrice = item.product.discountPrice ?? item.product.price;
      return {
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
      };
    });

    await tx.orderItem.createMany({
      data: orderItemsData,
    });

    // clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return createdOrder;
  });

  // return full order
  return prisma.order.findUnique({
    where: { id: order.id },
    include: {
      shippingAddress: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

// ---------------- GET MY ORDERS (USER) ----------------
const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      shippingAddress: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};
// ---------------- GET SINGLE ORDER (USER) ----------------
const getMyOrderById = async ({
  userId,
  orderId,
}: {
  userId: string;
  orderId: string;
}) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      shippingAddress: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) throw new Error("Order not found");
  return order;
};

// ---------------- SELLER: GET MY ORDERS (ONLY HIS PRODUCTS) ----------------
const getSellerOrders = async ({
  sellerId,
  page,
  limit,
  skip,
  status,
}: {
  sellerId: string;
  page: number;
  limit: number;
  skip: number;
  status?: OrderStatus;
}) => {
  const whereCondition: Prisma.OrderWhereInput = {
    ...(status && { status }),
    items: {
      some: {
        product: {
          sellerId: sellerId,
        },
      },
    },
  };
  const orders = await prisma.order.findMany({
    where: whereCondition,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
    include: {
      user: true,
      shippingAddress: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.order.count({
    where: whereCondition,
  });

  return {
    data: orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const orderService = {
  checkout,
  getMyOrders,
  getMyOrderById,
  getSellerOrders
};
