import cloudinary from "../config/cloudinary.js";
import * as recipeModel from "../models/recipeModel.js";
import * as ingredientModel from "../models/ingredientModel.js";
import * as directionModel from "../models/directionModel.js";
import { AppError } from "../utils/AppError.js";

const PAGE_SIZE = 9;

// 비즈니스 로직(존재 확인, 권한 체크, 트랜잭션, 외부 API 호출 등)을 수행하는 서비스 함수

const getPublicId = (url) => {
  const afterUpload = url.split("/upload/")[1];
  return afterUpload.replace(/^v\d+\//, "").replace(/\.[^.]+$/, "");
};

export const listRecipes = async ({ keyword, page }) => {
  const offset = (page - 1) * PAGE_SIZE;

  const total = keyword
    ? await recipeModel.countByKeyword(keyword)
    : await recipeModel.countAll();
  const recipes = keyword
    ? await recipeModel.findByKeyword({ keyword, limit: PAGE_SIZE, offset })
    : await recipeModel.findAll({ limit: PAGE_SIZE, offset });

  return { recipes, total, totalPages: Math.ceil(total / PAGE_SIZE) };
};

export const getRecipeDetail = async (id) => {
  const recipe = await recipeModel.findById(id);
  if (!recipe) throw new AppError(404, "레시피 없음");

  const ingredients = await ingredientModel.findByRecipeId(id);
  const directions = await directionModel.findByRecipeId(id);
  return { recipe, ingredients, directions };
};

export const createRecipe = async ({
  userId,
  name,
  description,
  name_eng,
  abv,
  difficulty,
  image,
  ingredients,
  directions,
}) => {
  const recipeId = await recipeModel.create({
    userId,
    name,
    image,
    description,
    name_eng,
    abv,
    difficulty,
  });

  for (const ingredient of ingredients) {
    await ingredientModel.create(recipeId, ingredient);
  }
  for (const direction of directions) {
    await directionModel.create(recipeId, direction.content);
  }
};

export const updateRecipe = async (
  id,
  userId,
  {
    name,
    description,
    name_eng,
    abv,
    difficulty,
    newImage,
    ingredients,
    directions,
  },
) => {
  const existing = await recipeModel.findOwnerAndImage(id);
  if (!existing) throw new AppError(404, "레시피 없음");
  if (existing.user_id !== userId) throw new AppError(403, "권한 없음");

  const image = newImage || existing.image;
  if (newImage) {
    await cloudinary.uploader.destroy(getPublicId(existing.image));
  }

  await recipeModel.update(id, {
    name,
    image,
    description,
    name_eng,
    abv,
    difficulty,
  });

  await ingredientModel.removeByRecipeId(id);
  await directionModel.removeByRecipeId(id);

  for (const ingredient of ingredients) {
    await ingredientModel.create(id, ingredient);
  }
  for (const direction of directions) {
    await directionModel.create(id, direction.content);
  }
};

export const deleteRecipe = async (id, userId) => {
  const existing = await recipeModel.findOwnerAndImage(id);
  if (!existing) throw new AppError(404, "레시피 없음");
  if (existing.user_id !== userId) throw new AppError(403, "권한 없음");

  await recipeModel.remove(id);
  await cloudinary.uploader.destroy(getPublicId(existing.image));
};
