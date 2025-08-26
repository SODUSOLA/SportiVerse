import express from "express";
import { approveAdmin, verifyAdminInvite } from "../controllers/adminController.js";

const router = express.Router();

// Superadmin approves/rejects admin request
router.post("/approve", approveAdmin);

// Admin verifies invite code
router.post("/verify-invite", verifyAdminInvite);




export default router;
