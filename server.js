// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import routes from './routes/index.js';



// Connect to DB

    connectDB();


const app = express();
app.use(express.json());


app.use('/api', routes);


app.get('/', (req, res) => {
    res.send('Welcome to the SportiVerse API 🚀');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


