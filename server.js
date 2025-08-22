import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import User from './models/userModel.js';
import routes from './routes/index.js';
import cron from 'node-cron';


// Connect to DB
connectDB();


const app = express();
app.use(express.json());

app.use('/api', routes);


// Cleanup unverified accounts older than 24 hours
cron.schedule("0 0 * * *", async () => {
    try {
        const result = await User.deleteMany({
            isVerified: false,
            createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 24h+ old
        });

        if (result.deletedCount > 0) {
            console.log(`🧹 Cleaned up ${result.deletedCount} unverified accounts`);
        }
    } catch (err) {
        console.error("Error cleaning unverified accounts:", err.message);
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the SportiVerse API 🚀');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
