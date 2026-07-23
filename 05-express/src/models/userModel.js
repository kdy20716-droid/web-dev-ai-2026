import prisma from "../prisma.js";

export const findByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const create = async ({ name, email, hashedPassword }) => {
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  return user.id;
};
