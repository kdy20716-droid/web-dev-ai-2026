import instance from "./instance";

export const getBars = async (keyword) => {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  const response = await instance.get(`/bars?${params.toString()}`);
  return response.data;
};
