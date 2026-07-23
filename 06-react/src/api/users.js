import instance from "./instance";

export const register = async (form) => {
  await instance.post("/users/register", form);
};

export const login = async (form) => {
  const response = await instance.post("/users/login", form);
  return response.data;
};
