import instance from "./instance";

export const getRecipes = async (keyword, page = 1) => {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  params.append("page", page);
  const response = await instance.get(`/recipes?${params.toString()}`);
  return response.data;
};

export const addRecipe = async (
  name,
  image,
  description,
  ingredients,
  directions,
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", image);
  formData.append("description", description);
  formData.append("ingredients", JSON.stringify(ingredients));
  formData.append("directions", JSON.stringify(directions));

  await instance.post("/recipes", formData);
};

export const getRecipe = async (id) => {
  const response = await instance.get(`/recipes/${id}`);
  return response.data;
};

export const deleteRecipe = async (id) => {
  await instance.delete(`/recipes/${id}`);
};

export const editRecipe = async (id, name, image, description, ingredients, directions) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("ingredients", JSON.stringify(ingredients));
  formData.append("directions", JSON.stringify(directions));
  if (image) {
    formData.append("image", image);
  }

  await instance.put(`/recipes/${id}`, formData);
};
