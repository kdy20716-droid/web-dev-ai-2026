import prisma from "../prisma.js";

export const findByRecipeId = async (recipeId) => {
  return await prisma.ingredient.findMany({ where: { recipe_id: Number(recipeId) } });
};

export const create = async (recipeId, { name, amount, name_eng, abv }) => {
  await prisma.ingredient.create({
    data: { recipe_id: Number(recipeId), name, amount, name_eng, abv },
  });
};

export const removeByRecipeId = async (recipeId) => {
  await prisma.ingredient.deleteMany({ where: { recipe_id: Number(recipeId) } });
};
