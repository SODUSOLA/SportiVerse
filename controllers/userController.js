import userService from '../service/userService.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { sendOtpEmail, sendAdminInviteRequest } from '../utils/emailServices.js';

// Register 
export const registerUser = async (req, res) => {
    try {
        let { username, email, password, role, adminSecret } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Please provide username, email, and password" });
        }

        // Default role = user
        if (!role) {
            role = "user";
        }

        // SUPERADMIN signup 
        if (role === "superadmin") {
            if (adminSecret !== process.env.ADMIN_SECRET) {
                return res.status(403).json({ error: "Invalid superadmin secret" });
            }

            const user = await userService.signUpUser({ username, email, password, role });
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(201).json({
                message: "Superadmin registered successfully",
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        }

        // USER signup
        if (role === "user") {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const otpExpires = Date.now() + 5 * 60 * 1000;

            const user = await userService.signUpUser({
                username,
                email,
                password,
                role,
                otp,
                otpExpires
            });

            await sendOtpEmail(email, otp);

            return res.status(201).json({
                message: "User registered successfully. Please verify your email with the OTP sent.",
                userId: user._id
            });
        }


        // ADMIN signup
        if (role === "admin") {
            const user = await userService.signUpUser({
                username,
                email,
                password,
                role,
                isApproved: false
            });

            await sendAdminInviteRequest(user);

            return res.status(201).json({
                message: "Admin signup request received. You’ll get an invite code via email once approved.",
                userId: user._id
            });
        }

    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(400).json({ error: error.message });
    }
};
// Resend OTP
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ error: "User already verified" });
        }
        if (user.otpExpires && user.otpExpires > Date.now()) {
            return res.status(429).json({
                error: "Please wait until the current OTP expires before requesting a new one.",
            });
        }
        // generate new OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
        await user.save();

        // send via email
        await sendOtpEmail(email, otp);

        res.status(200).json({ message: "New OTP sent to your email" });
    } catch (error) {
        console.error("Error resending OTP:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
// Verify OTP 
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User already verified" });
        }

        if (String(user.otp) !== String(otp)) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "OTP has expired. Please request a new one." });
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ 
            message: "Email verified successfully!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error verifying OTP:", error.message);
        res.status(400).json({ error: error.message });
    }
};
// Get Current User 
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error fetching current user:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};