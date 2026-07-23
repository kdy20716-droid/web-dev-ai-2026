import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";

export const registerUser = async ({ name, email, password }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new AppError(409, "이미 사용중인 이메일");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.create({ name, email, hashedPassword });
};

export const loginUser = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new AppError(401, "이메일 또는 비밀번호가 잘못되었습니다.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(401, "이메일 또는 비밀번호가 잘못되었습니다.");
  }

  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "7d" });
  return { token, name: user.name, id: user.id };
};
