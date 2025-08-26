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

// Send OTP email to user
export const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"SportiVerse" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your SportiVerse OTP Code",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    };

    return transporter.sendMail(mailOptions);
};

// Notify support team abiut new admin signup request
export const sendAdminInviteRequest = async (user) => {
    try {
        await transporter.sendMail({
            from: `"SportiVerse" <${process.env.EMAIL_USER}>`,
            to: process.env.SUPPORT_EMAIL,
            subject: "New Admin Signup Request",
            text: `A new admin signup request has been received.\n\n
                Name: ${user.username}\n
                Email: ${user.email}\n
                Role: ${user.role}\n
                Registered At: ${new Date().toLocaleString()}`,

            html: `
                <h2>New Admin Signup Request</h2>
                <p><strong>Name:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.role}</p>
                <p><strong>Registered At:</strong> ${new Date().toLocaleString()}</p>
            `,
        });

        console.log(`Admin invite request email sent for ${user.email}`);
    } catch (error) {
        console.error("Error sending admin invite email:", error.message);
    }
};

// Send admin invite code email
export const sendAdminInviteCode = async (to, code) => {
    await transporter.sendMail({
        from: `"SportiVerse" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your SportiVerse Admin Approval Code",
        text: `Congratulations! You’ve been approved as an Admin.\n\nUse this code to activate your account: ${code}`,
    });
};
