import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const signUpUser = async (userData) => {
    const { username, email, password, role, otp, otpExpires, isApproved } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error("User already exists with this email");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        otp,
        otpExpires,
        isApproved
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    return userWithoutPassword;
};

export default { signUpUser };