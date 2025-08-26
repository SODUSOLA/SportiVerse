import express from "express";
import { createTeam, getTeams } from "../controllers/teamController.js";

const router = express.Router();

// Create team
router.post("/", createTeam);

// Get all teams
router.get("/", getTeams);

export default router;
