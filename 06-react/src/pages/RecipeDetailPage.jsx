import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useRecipe } from "../hooks/useRecipe.js";
import { useDeleteRecipe } from "../hooks/useRecipeMutations.js";
import RecipeModal from "../components/RecipeModal";

const stripLeadingNumber = (text) => text.replace(/^\s*\d+[.)]\s*/, "");

const RecipeDetailPage = () => {
  const { userId } = useAuth();
  const { id } = useParams();
  const { data: recipe, isLoading } = useRecipe(id);
  const deleteRecipe = useDeleteRecipe();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    const check = confirm("레시피를 삭제하시겠습니까?");
    if (!check) return;
    deleteRecipe.mutate(id, {
      onError: (error) => toast.error(error.response?.data?.message ?? "삭제에 실패했습니다"),
    });
  };

  if (isLoading) {
    return <div className="max-w-[700px] mx-auto my-10 px-6 text-gray-500">불러오는 중...</div>;
  }

  return (
    <div className="max-w-[700px] mx-auto my-10 px-6">
      <img className="w-full h-[400px] object-cover rounded-[14px] block" src={recipe?.recipe.image} />
      <h2 className="mt-6 mb-3 text-[26px] font-bold text-gray-800">{recipe?.recipe.name}</h2>
      <p className="text-base text-gray-500 leading-[1.8]">{recipe?.recipe.description}</p>
      {recipe?.recipe.user_id == userId && (
        <div className="flex gap-2 mt-4">
          <button
            className="px-[18px] py-2 border border-[#7b2d43] rounded-lg bg-white text-[#7b2d43] text-sm cursor-pointer hover:bg-[#7b2d43] hover:text-white"
            onClick={() => setIsOpen(true)}
          >
            수정
          </button>
          <button
            className="px-[18px] py-2 border border-red-500 rounded-lg bg-white text-red-500 text-sm cursor-pointer hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={deleteRecipe.isPending}
          >
            {deleteRecipe.isPending ? "삭제 중..." : "삭제"}
          </button>
        </div>
      )}

      <h3 className="mt-8 mb-3 text-lg font-bold text-gray-800 border-b-2 border-[#7b2d43] pb-2">재료</h3>
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {recipe?.ingredients?.map((ingredient) => (
          <li className="flex justify-between px-[14px] py-[10px] bg-[#fafafa] rounded-lg text-[15px] text-gray-700" key={ingredient.id}>
            <span>{ingredient.name}</span>
            <span>{ingredient.amount}</span>
          </li>
        ))}
      </ul>
      <h3 className="mt-8 mb-3 text-lg font-bold text-gray-800 border-b-2 border-[#7b2d43] pb-2">만드는 방법</h3>
      <ol className="list-none p-0 m-0 flex flex-col gap-3">
        {recipe?.directions?.map((direction, index) => (
          <li
            className="flex items-center gap-3.5 px-4 py-3.5 bg-[#fafafa] rounded-lg text-[15px] text-gray-700 leading-relaxed"
            key={direction.id}
          >
            <span className="flex items-center justify-center w-7 h-7 bg-[#7b2d43] text-white rounded-full text-[13px] font-bold flex-shrink-0">
              {index + 1}
            </span>
            {stripLeadingNumber(direction.content)}
          </li>
        ))}
      </ol>

      {isOpen && (
        <RecipeModal onClose={() => setIsOpen(false)} isEdit={true} recipe={recipe} />
      )}
    </div>
  );
};

export default RecipeDetailPage;
