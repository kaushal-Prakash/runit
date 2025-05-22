import express from "express";
import { getSuggestion } from "../controllers/AiController.js";
const router = express.Router();

router.post("/get-hints",getSuggestion);

export default router;