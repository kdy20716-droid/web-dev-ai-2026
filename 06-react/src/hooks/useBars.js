import { useQuery } from "@tanstack/react-query";
import { getBars } from "../api/bars.js";

export const useBars = (keyword) => {
  return useQuery({
    queryKey: ["bars", keyword],
    queryFn: () => getBars(keyword),
  });
};

/*
  TanStack Query
  - useQuery : 조회
  - useInfiniteQuery : 무한 스크롤 조회
  - useMutation : 서버 데이터를 바꿀 때 (추가/수정/삭제)

  useQuery, useInfiniteQuery 공통 옵션
  - queryKey : 캐싱을 위한 고유한 키
  - queryFn : 데이터를 가져오는 함수
*/
