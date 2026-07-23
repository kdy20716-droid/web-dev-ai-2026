import { useQuery } from "@tanstack/react-query";
import { getBars } from "../api/bars.js";

export const useBars = (keyword) => {
  return useQuery({
    queryKey: ["bars", keyword],
    queryFn: () => getBars(keyword),
  });
};
