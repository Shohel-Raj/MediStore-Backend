import { prisma } from "../../lib/prisma";

// ---------------- ADD TO CART (UPSERT) ----------------

// ---------------- GET OR CREATE CART ----------------
const getOrCreateCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (cart) return cart;

  return prisma.cart.create({
    data: { userId },
  });
};

const addToCart = async ({
  userId,
  productId,
  quantity,
}: {
  userId: string;
  productId: string;
  quantity?: number;
}) => {
  const qty = quantity ?? 1;

  if (!productId) throw new Error("productId is required");
  if (qty < 1) throw new Error("quantity must be at least 1");

  // Check product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const cart = await getOrCreateCart(userId);

  // Upsert item by unique constraint cartId + productId
  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: {
        increment: qty,
      },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity: qty,
    },
  });

  return getMyCart(userId);
};

// ---------------- GET MY CART ----------------
const getMyCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // If no cart exists, return empty structure
  if (!cart) {
    return {
      id: null,
      userId,
      items: [],
      totalItems: 0,
    };
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...cart,
    totalItems,
  };
};



export const cartService = {
  getMyCart,
  addToCart,
};