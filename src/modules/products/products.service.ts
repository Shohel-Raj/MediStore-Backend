import { Product } from "../../generated/prisma/client";
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

// const getAllproduct= async()





export const productService = {
  createProduct,
};
