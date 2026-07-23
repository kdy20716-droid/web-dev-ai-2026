import prisma from "../prisma.js";

// 테이블에 접근만 함 - "왜" 해야 하는지 모름 (이건 service 역할)

// SELECT count(*) FROM recipe 
export const countAll = async () => {
  return await prisma.recipe.count();
};

// SELECT count(*) FROM recipe WHERE name LIKE '%keyword%'
export const countByKeyword = async (keyword) => {
  return await prisma.recipe.count({ where: { name: { contains: keyword } } });
};

// SELECT * FROM recipe ORDER BY id DESC LIMIT limit OFFSET offset
export const findAll = async ({ limit, offset }) => {
  return await prisma.recipe.findMany({
    orderBy: { id: "desc" },
    take: limit,
    skip: offset,
  });
};

// SELECT * FROM recipe WHERE name LIKE '%keyword%' ORDER BY id DESC LIMIT limit OFFSET offset
export const findByKeyword = async ({ keyword, limit, offset }) => {
  return await prisma.recipe.findMany({
    where: { name: { contains: keyword } },
    orderBy: { id: "desc" },
    take: limit,
    skip: offset,
  });
};

// SELECT * FROM recipe WHERE id = ?
export const findById = async (id) => {
  return await prisma.recipe.findUnique({ where: { id: Number(id) } });
};

// SELECT user_id, image FROM recipe WHERE id = ?
export const findOwnerAndImage = async (id) => {
  return await prisma.recipe.findUnique({
    where: { id: Number(id) },
    select: { user_id: true, image: true },
  });
};

// INSERT INTO recipe (user_id, name, image, description, name_eng, abv, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)
export const create = async ({
  userId,
  name,
  image,
  description,
  name_eng,
  abv,
  difficulty,
}) => {
  const recipe = await prisma.recipe.create({
    data: {
      user_id: userId,
      name,
      image,
      description,
      name_eng,
      abv,
      difficulty,
    },
  });
  return recipe.id;
};

// UPDATE recipe SET name = ?, image = ?, description = ?, name_eng = ?, abv = ?, difficulty = ? WHERE id = ?
export const update = async (
  id,
  { name, image, description, name_eng, abv, difficulty },
) => {
  await prisma.recipe.update({
    where: { id: Number(id) },
    data: { name, image, description, name_eng, abv, difficulty },
  });
};

// DELETE FROM recipe WHERE id = ?
export const remove = async (id) => {
  await prisma.recipe.delete({ where: { id: Number(id) } });
};
