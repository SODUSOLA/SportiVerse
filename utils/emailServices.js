import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"SportiVerse" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your SportiVerse OTP Code",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    };

    return transporter.sendMail(mailOptions);
};

export const sendAdminInviteRequest = async (user) => {
    await transporter.sendMail({
        from: `"SportiVerse" <${process.env.EMAIL_USER}>`,
        to: "support@sportiverse.com",
        subject: "Admin Signup Request",
        text: `New admin signup request:\n\nName: ${user.username}\nEmail: ${user.email}`,
    });
};
