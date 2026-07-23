import * as recipeService from "../services/recipeService.js";

// 요청(request)에서 값 꺼내기 -> 서비스 함수 호출 -> 결과 반환(response)

// GET http://localhost:4000/recipes
export const getRecipes = async (req, res) => {
  const keyword = req.query.keyword;
  const page = parseInt(req.query.page) || 1;
  const result = await recipeService.listRecipes({ keyword, page });
  res.status(200).json(result);
};

// GET http://localhost:4000/recipes/:id
export const getRecipe = async (req, res) => {
  const { id } = req.params;
  const result = await recipeService.getRecipeDetail(id);
  res.status(200).json(result);
};

// POST http://localhost:4000/recipes
export const addRecipe = async (req, res) => {
  const { name, description } = req.body;
  const name_eng = req.body.name_eng ?? null;
  const abv = req.body.abv ?? null;
  const difficulty = req.body.difficulty ?? null;
  const ingredients = JSON.parse(req.body.ingredients);
  const directions = JSON.parse(req.body.directions);
  const image = req.file.cloudinaryUrl;
  const userId = req.userId;

  // 서비스 함수 호출
  await recipeService.createRecipe({
    userId,
    name,
    description,
    name_eng,
    abv,
    difficulty,
    image,
    ingredients,
    directions,
  });

  res.status(201).json({ message: "레시피 추가 완료" });
};

// DELETE http://localhost:4000/recipes/:id
export const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  await recipeService.deleteRecipe(id, userId);
  res.status(200).json({ message: "레시피 삭제 완료" });
};

// PUT http://localhost:4000/recipes/:id
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

  // 서비스 함수 호출
  await recipeService.updateRecipe(id, userId, {
    name,
    description,
    name_eng,
    abv,
    difficulty,
    newImage,
    ingredients,
    directions,
  });

  res.status(200).json({ message: "레시피 수정 완료" });
};
