import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RecipeModal from "../components/RecipeModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useRecipes } from "../hooks/useRecipes.js";

const MainPage = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useSearchParams();
  const appliedKeyword = search.get("keyword") || "";
  const [keyword, setKeyword] = useState(appliedKeyword);

  const { recipes, sentinelRef, isLoading } = useRecipes(appliedKeyword);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearch({ keyword });
  };

  return (
    <div className="grid grid-cols-3 gap-7 max-w-[1100px] mx-auto my-10 px-6">
      <div className="col-span-full flex gap-2.5">
        <form className="flex-1 flex gap-2.5" onSubmit={handleSubmit}>
          <input
            className="flex-1 px-[18px] py-3 border-[1.5px] border-gray-300 rounded-[10px] text-[15px] outline-none bg-[#fafafa] transition-colors focus:border-[#7b2d43] focus:bg-white"
            type="text"
            name="keyword"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button className="px-6 py-3 bg-[#7b2d43] text-white rounded-[10px] text-[15px] font-semibold cursor-pointer transition-colors hover:bg-[#5f2233]">
            검색
          </button>
        </form>
        {token && (
          <button
            className="px-5 py-3 bg-white text-[#7b2d43] border-[1.5px] border-[#7b2d43] rounded-[10px] text-sm font-semibold whitespace-nowrap transition-colors hover:bg-[#f7e8ec]"
            onClick={() => setIsOpen(true)}
          >
            레시피 추가
          </button>
        )}
      </div>
      {isLoading && <p className="col-span-full text-gray-500">불러오는 중...</p>}
      {!isLoading && recipes.length === 0 && (
        <p className="col-span-full text-gray-500">검색 결과가 없습니다</p>
      )}
      {recipes.map((recipe) => (
        <Link
          key={recipe.id}
          to={`/recipe/${recipe.id}`}
          className="rounded-[14px] overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.07)] transition hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.13)]"
        >
          <img className="w-full h-[220px] object-cover block" src={recipe.image} alt="" />
          <h3 className="mx-4 mt-3.5 mb-1.5 text-[17px] font-bold text-gray-800">{recipe.name}</h3>
          <p className="mx-4 mb-4 text-[13px] text-gray-500 leading-relaxed">{recipe.description}</p>
        </Link>
      ))}

      <div ref={sentinelRef} className="col-span-full h-px" />

      {isOpen && <RecipeModal onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default MainPage;
