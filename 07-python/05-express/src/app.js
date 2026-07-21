import express from "express";
import recipesRouter from "./routes/recipes.js";
import usersRouter from "./routes/users.js";
import barsRouter from "./routes/bars.js";
import errorHandler from "./middleware/error.js";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

app.use("/recipes", recipesRouter);
app.use("/users", usersRouter);
app.use("/bars", barsRouter);

app.use(errorHandler);

app.listen(4000, () => {
  console.log("서버 실행 중 : http://localhost:4000");
});
