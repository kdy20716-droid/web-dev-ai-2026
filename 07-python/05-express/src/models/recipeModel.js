import prisma from "../prisma.js";

export const countAll = async () => {
  return await prisma.recipe.count();
};

export const countByKeyword = async (keyword) => {
  return await prisma.recipe.count({ where: { name: { contains: keyword } } });
};

export const findAll = async ({ limit, offset }) => {
  return await prisma.recipe.findMany({
    orderBy: { id: "desc" },
    take: limit,
    skip: offset,
  });
};

export const findByKeyword = async ({ keyword, limit, offset }) => {
  return await prisma.recipe.findMany({
    where: { name: { contains: keyword } },
    orderBy: { id: "desc" },
    take: limit,
    skip: offset,
  });
};

export const findById = async (id) => {
  return await prisma.recipe.findUnique({ where: { id: Number(id) } });
};

export const findOwnerAndImage = async (id) => {
  return await prisma.recipe.findUnique({
    where: { id: Number(id) },
    select: { user_id: true, image: true },
  });
};

export const create = async ({ userId, name, image, description, name_eng, abv, difficulty }) => {
  const recipe = await prisma.recipe.create({
    data: { user_id: userId, name, image, description, name_eng, abv, difficulty },
  });
  return recipe.id;
};

export const update = async (id, { name, image, description, name_eng, abv, difficulty }) => {
  await prisma.recipe.update({
    where: { id: Number(id) },
    data: { name, image, description, name_eng, abv, difficulty },
  });
};

export const remove = async (id) => {
  await prisma.recipe.delete({ where: { id: Number(id) } });
};
