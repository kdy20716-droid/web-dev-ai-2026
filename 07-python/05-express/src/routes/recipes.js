import express from "express";
import auth from "../middleware/auth.js";
import upload, { uploadToCloudinary } from "../middleware/upload.js";
import {
  getRecipes,
  getRecipe,
  addRecipe,
  deleteRecipe,
  editRecipe,
} from "../controllers/recipesController.js";

const router = express.Router();

router.post("/", auth, upload.single("image"), uploadToCloudinary, addRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.delete("/:id", auth, deleteRecipe);
router.put("/:id", auth, upload.single("image"), uploadToCloudinary, editRecipe);

export default router;
