import prisma from "../prisma.js";

export const findAll = async () => {
  return await prisma.bar.findMany({ orderBy: { id: "asc" } });
};

export const findByKeyword = async (keyword) => {
  return await prisma.bar.findMany({
    where: {
      OR: [
        { name: { contains: keyword } },
        { dong: { contains: keyword } },
        { keywords: { contains: keyword } },
      ],
    },
    orderBy: { id: "asc" },
  });
};
