import userService from '../service/userService.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';


// ===== Register =====
export const registerUser = async (req, res) => {
    try {
        let { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Please provide username, email, and password" });
        }

        // Default role to "user" unless authorized admin creates another role
        if (!role || !['admin', 'superadmin'].includes(role)) {
            role = 'user';
        }

        // Create user
        const user = await userService.signUpUser({ username, email, password, role });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(400).json({ error: error.message });
    }
};
// ===== Get Current User =====
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
