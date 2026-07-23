import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getRecipes } from "../api/recipes.js";

export const useRecipes = (keyword) => {
  const sentinelRef = useRef(null);

  const query = useInfiniteQuery({
    queryKey: ["recipes", keyword],
    queryFn: ({ pageParam }) => getRecipes(keyword, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const recipes = query.data?.pages.flatMap((page) => page.recipes) ?? [];

  return { ...query, recipes, sentinelRef };
};
