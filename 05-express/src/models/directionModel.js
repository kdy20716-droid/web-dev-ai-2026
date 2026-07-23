import prisma from "../prisma.js";

export const findByRecipeId = async (recipeId) => {
  return await prisma.direction.findMany({
    where: { recipe_id: Number(recipeId) },
  });
};

export const create = async (recipeId, content) => {
  await prisma.direction.create({
    data: { recipe_id: Number(recipeId), content },
  });
};

export const removeByRecipeId = async (recipeId) => {
  await prisma.direction.deleteMany({ where: { recipe_id: Number(recipeId) } });
};
