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

// ---------------- UPDATE CART ITEM QUANTITY ----------------
const updateCartItemQuantity = async ({
  userId,
  itemId,
  quantity,
}: {
  userId: string;
  itemId: string;
  quantity: number;
}) => {
  if (!itemId) throw new Error("itemId is required");
  if (!quantity || quantity < 1) throw new Error("quantity must be at least 1");

  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) throw new Error("Cart not found");

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (!item) throw new Error("Cart item not found");

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return getMyCart(userId);
};

// ---------------- REMOVE CART ITEM ----------------
const removeCartItem = async ({
  userId,
  itemId,
}: {
  userId: string;
  itemId: string;
}) => {
  if (!itemId) throw new Error("itemId is required");

  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) throw new Error("Cart not found");

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (!item) throw new Error("Cart item not found");

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return getMyCart(userId);
};
// ---------------- CLEAR CART ----------------
const clearMyCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    return {
      id: null,
      userId,
      items: [],
      totalItems: 0,
    };
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return getMyCart(userId);
};



export const cartService = {
  getMyCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearMyCart
};
