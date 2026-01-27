import { Prisma, Product } from "../../generated/prisma/client";
import { generateSlug } from "../../helpers/generateSlug";
import { prisma } from "../../lib/prisma";


const createProduct = async (
  data: Omit<Product, "id" | "createdAt" | "updatedAt" | "authorId">,

) => {
  const slug = generateSlug(data.name)
  const result = await prisma.product.create({
    data: {
      ...data,
      slug
    },
  });
  return result;
};

// ---------------- GET ALL PRODUCTS ----------------
const getAllProducts = async ({
  search,
  manufacturer,
  dosageForm,
  minPrice,
  maxPrice,
  inStock,
  hasDiscount,
  sellerId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search?: string;
  manufacturer?: string;
  dosageForm?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  hasDiscount?: boolean;
  sellerId?: string;
  page: number;
  limit: number;
  skip: number;
  sortBy: keyof Prisma.ProductOrderByWithRelationInput;
  sortOrder: "asc" | "desc";
}) => {
  const andConditions: Prisma.ProductWhereInput[] = [];

  // Search (name, description, manufacturer, strength)
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { manufacturer: { contains: search, mode: "insensitive" } },
        { strength: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  //  Manufacturer filter
  if (manufacturer) {
    andConditions.push({
      manufacturer: {
        contains: manufacturer,
        mode: "insensitive",
      },
    });
  }

  // Dosage form filter
  if (dosageForm) {
    andConditions.push({
      dosageForm: {
        equals: dosageForm,
        mode: "insensitive",
      },
    });
  }

  //  Price range filter
  if (typeof minPrice === "number" || typeof maxPrice === "number") {
    andConditions.push({
      price: {
        ...(typeof minPrice === "number" && { gte: minPrice }),
        ...(typeof maxPrice === "number" && { lte: maxPrice }),
      },
    });
  }

  // In-stock filter
  if (typeof inStock === "boolean") {
    if (inStock) {
      andConditions.push({
        stock: { gt: 0 },
      });
    }
  }

  // Discount filter
  if (typeof hasDiscount === "boolean") {
    if (hasDiscount) {
      andConditions.push({
        discountPrice: { not: null },
      });
    } else {
      andConditions.push({
        discountPrice: null,
      });
    }
  }

  //  Seller filter
  if (sellerId) {
    andConditions.push({
      sellerId,
    });
  }

  //  Fetch products
  const products = await prisma.product.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  //  Count total
  const total = await prisma.product.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};






export const productService = {
  createProduct,
  getAllProducts
};
