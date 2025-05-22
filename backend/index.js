import express from 'express';
import cors from 'cors';
import connectDB from './services/connectDB.js';
import dotenv from 'dotenv';
import codeRouter from './routes/codeRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();
app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});

app.use("/code",codeRouter);