import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        },
    email: {
        type: String,
        required: true,
        unique: true,
        },
        password: {
            type : String,
            required: true,
        },
    role: {
        type: String,
        enum: ['user', 'admin', 'super_admin'],
        default: 'user',
    },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    },
    { timestamps: true});

const User = mongoose.model('User', userSchema)
export default User;