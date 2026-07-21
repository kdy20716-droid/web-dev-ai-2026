import * as recipeService from "../services/recipeService.js";

export const getRecipes = async (req, res) => {
  const keyword = req.query.keyword;
  const page = parseInt(req.query.page) || 1;
  const result = await recipeService.listRecipes({ keyword, page });
  res.status(200).json(result);
};

export const getRecipe = async (req, res) => {
  const { id } = req.params;
  const result = await recipeService.getRecipeDetail(id);
  res.status(200).json(result);
};

export const addRecipe = async (req, res) => {
  const { name, description } = req.body;
  const name_eng = req.body.name_eng ?? null;
  const abv = req.body.abv ?? null;
  const difficulty = req.body.difficulty ?? null;
  const ingredients = JSON.parse(req.body.ingredients);
  const directions = JSON.parse(req.body.directions);
  const image = req.file.cloudinaryUrl;
  const userId = req.userId;

  await recipeService.createRecipe({
    userId, name, description, name_eng, abv, difficulty, image, ingredients, directions,
  });

  res.status(201).json({ message: "레시피 추가 완료" });
};

export const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  await recipeService.deleteRecipe(id, userId);
  res.status(200).json({ message: "레시피 삭제 완료" });
};

export const editRecipe = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const name_eng = req.body.name_eng ?? null;
  const abv = req.body.abv ?? null;
  const difficulty = req.body.difficulty ?? null;
  const ingredients = JSON.parse(req.body.ingredients);
  const directions = JSON.parse(req.body.directions);
  const userId = req.userId;
  const newImage = req.file ? req.file.cloudinaryUrl : null;

  await recipeService.updateRecipe(id, userId, {
    name, description, name_eng, abv, difficulty, newImage, ingredients, directions,
  });

  res.status(200).json({ message: "레시피 수정 완료" });
};
