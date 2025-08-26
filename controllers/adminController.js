import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { sendAdminInviteCode } from '../utils/emailServices.js';
import crypto from 'crypto';

export const approveAdmin = async (req, res) => {
    try {
        const { userId, action } = req.body; 
        const user = await User.findById(userId);
        if (!user || user.role !== "admin") {
        return res.status(404).json({ error: "Admin request not found" });
        }

        if (action === "reject") {
        await user.deleteOne();
        return res.status(200).json({ message: "Admin request rejected and removed" });
        }

        if (action === "approve") {
        // Generate unique invite code
        const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

        user.inviteCode = inviteCode;
        user.inviteCodeExpires = Date.now() + 10 * 60 * 1000; // valid 10 mins
        await user.save();

        // Send email with code
        await sendAdminInviteCode(user.email, inviteCode);

        return res.status(200).json({
            message: "Admin approved. Invite code sent.",
            userId: user._id,
        });
        }
    } catch (error) {
        console.error("Error approving admin:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};


export const verifyAdminInvite = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email, role: "admin" });
        if (!user) { 
            return res.status(404).json({ error: "Admin not found" });
        }
        if (user.isApproved) {
        return res.status(400).json({ error: "Admin already approved" });
        }

        if (user.inviteCode !== code) {
        return res.status(400).json({ error: "Invalid invite code" });
        }

        if (user.inviteCodeExpires < Date.now()) {
        return res.status(400).json({ error: "Invite code expired" });
        }

        // Approve admin
        user.isApproved = true;
        user.inviteCode = null;
        user.inviteCodeExpires = null;
        await user.save();

        // Issue JWT
        const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );

        res.status(200).json({
        message: "Admin verified and activated successfully!",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        });
    } catch (error) {
        console.error("Error verifying admin invite:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};