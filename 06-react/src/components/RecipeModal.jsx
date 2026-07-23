import { useState } from "react";
import { toast } from "sonner";
import { useAddRecipe, useEditRecipe } from "../hooks/useRecipeMutations.js";

const inputClass =
  "px-[14px] py-[10px] border border-gray-300 rounded-lg text-sm w-full outline-none mb-2.5 focus:border-[#7b2d43]";

const RecipeModal = ({ onClose, isEdit = false, recipe = null }) => {
  const addRecipe = useAddRecipe();
  const editRecipe = useEditRecipe();
  const [name, setName] = useState(isEdit ? recipe.recipe.name : "");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState(isEdit ? recipe.recipe.description : "");

  const [ingredients, setIngredients] = useState(isEdit ? recipe.ingredients : [{ name: "", amount: "" }]);

  const [directions, setDirections] = useState(isEdit ? recipe.directions : [{ content: "" }]);

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleDirectionChange = (index, value) => {
    const updated = [...directions];
    updated[index].content = value;
    setDirections(updated);
  };

  const addDirection = () => {
    setDirections([...directions, { content: "" }]);
  };

  const removeDirection = (index) => {
    setDirections(directions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("레시피 이름을 입력해주세요");
      return;
    }
    if (!isEdit && !image) {
      toast.error("이미지를 선택해주세요");
      return;
    }
    if (!description.trim()) {
      toast.error("레시피 설명을 입력해주세요");
      return;
    }
    if (ingredients.some((ingredient) => !ingredient.name.trim() || !ingredient.amount.trim())) {
      toast.error("재료의 이름과 양을 모두 입력해주세요");
      return;
    }
    if (directions.some((direction) => !direction.content.trim())) {
      toast.error("만드는 방법을 모두 입력해주세요");
      return;
    }

    try {
      if (isEdit) {
        await editRecipe.mutateAsync({ id: recipe.recipe.id, name, image, description, ingredients, directions });
      } else {
        await addRecipe.mutateAsync({ name, image, description, ingredients, directions });
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message ?? "저장에 실패했습니다");
    }
  };

  const isSaving = addRecipe.isPending || editRecipe.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center" onClick={onClose}>
      <div
        className="bg-white p-8 rounded-xl flex flex-col gap-3 w-[500px] max-h-[80vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg text-[#1a1a1a]">{isEdit ? "레시피 수정" : "레시피 추가"}</h2>
          <button
            className="bg-transparent border-none text-xl text-gray-500 cursor-pointer leading-none px-2 py-1 rounded hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className={inputClass}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="레시피 이름 입력"
          />
          <input
            className={inputClass}
            type="file"
            onChange={(event) => setImage(event.target.files[0])}
          />
          <input
            className={inputClass}
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="레시피 설명 입력"
          />

          <div className="text-sm font-semibold text-[#7b2d43] mt-4 mb-2">재료</div>
          {ingredients.map((ingredient, index) => (
            <div className="flex items-center gap-2 mb-2" key={index}>
              <input
                className={`${inputClass} mb-0 flex-1`}
                type="text"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                placeholder="재료명 (예: 화이트럼)"
              />
              <input
                className={`${inputClass} mb-0 max-w-[100px]`}
                type="text"
                value={ingredient.amount}
                onChange={(e) =>
                  handleIngredientChange(index, "amount", e.target.value)
                }
                placeholder="양 (예: 40ml)"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="bg-transparent border-none text-sm text-gray-400 cursor-pointer p-1 rounded flex-shrink-0 hover:text-red-500 hover:bg-red-50"
                  onClick={() => removeIngredient(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="bg-transparent border border-dashed border-gray-300 rounded-lg p-2 text-[13px] text-gray-500 w-full hover:border-[#7b2d43] hover:text-[#7b2d43]"
            onClick={addIngredient}
          >
            + 재료 추가
          </button>

          <div className="text-sm font-semibold text-[#7b2d43] mt-4 mb-2">만드는 방법</div>
          {directions.map((direction, index) => (
            <div className="flex items-center gap-2 mb-2" key={index}>
              <span className="text-sm font-semibold text-[#7b2d43] min-w-[20px]">{index + 1}</span>
              <input
                className={`${inputClass} mb-0 flex-1`}
                type="text"
                value={direction.content}
                onChange={(e) => handleDirectionChange(index, e.target.value)}
                placeholder={`${index + 1}단계 입력`}
              />
              {directions.length > 1 && (
                <button
                  type="button"
                  className="bg-transparent border-none text-sm text-gray-400 cursor-pointer p-1 rounded flex-shrink-0 hover:text-red-500 hover:bg-red-50"
                  onClick={() => removeDirection(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="bg-transparent border border-dashed border-gray-300 rounded-lg p-2 text-[13px] text-gray-500 w-full hover:border-[#7b2d43] hover:text-[#7b2d43]"
            onClick={addDirection}
          >
            + 단계 추가
          </button>

          <button
            className="p-3 bg-[#7b2d43] text-white border-none rounded-lg cursor-pointer text-[15px] mt-1 w-full hover:bg-[#5f2233] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : isEdit ? "수정하기" : "추가하기"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default RecipeModal;
