import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addRecipe, editRecipe, deleteRecipe } from "../api/recipes.js";

export const useAddRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, image, description, ingredients, directions }) =>
      addRecipe(name, image, description, ingredients, directions),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });
};

export const useEditRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, image, description, ingredients, directions }) =>
      editRecipe(id, name, image, description, ingredients, directions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe"] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id) => deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      navigate("/");
    },
  });
};
