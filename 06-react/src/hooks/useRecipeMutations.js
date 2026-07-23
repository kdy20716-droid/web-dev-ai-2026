import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addRecipe, editRecipe, deleteRecipe } from "../api/recipes.js";

/*
  - mutationFn : 서버 데이터를 바꾸는 함수
  - onSuccess : mutationFn이 성공했을 때 실행되는 함수
  - invalidateQueries : 캐시를 무효화하는 함수 - querykey 캐시에 "오래된 것일수 있음"을 표시
  - useQueryClient : 캐시를 관리하는 객체를 반환하는 훅
  - useNavigate : 페이지 이동을 위한 훅
*/
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
