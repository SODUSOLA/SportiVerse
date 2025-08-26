import express from "express";
import { createPlayer } from "../controllers/playerController.js";

const router = express.Router();

// Create new player and assign to team by name
router.post("/", createPlayer);

export default router;
