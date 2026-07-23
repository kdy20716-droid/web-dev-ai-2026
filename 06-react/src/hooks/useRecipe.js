import { useQuery } from "@tanstack/react-query";
import { getRecipe } from "../api/recipes.js";

export const useRecipe = (id) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipe(id),
  });
};
