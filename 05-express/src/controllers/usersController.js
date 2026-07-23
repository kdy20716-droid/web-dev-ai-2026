import * as userService from "../services/userService.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  await userService.registerUser({ name, email, password });
  res.status(201).json({ message: "회원가입 완료" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.loginUser({ email, password });
  res.status(200).json({ message: "로그인 성공", ...result });
};
