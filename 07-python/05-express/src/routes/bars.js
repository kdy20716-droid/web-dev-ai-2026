import express from "express";
import { getBars } from "../controllers/barsController.js";

const router = express.Router();

router.get("/", getBars);

export default router;
