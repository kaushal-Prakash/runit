import express from 'express';
import cors from 'cors';
import connectDB from './services/connectDB.js';
import dotenv from 'dotenv';
import codeRouter from './routes/codeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


// Middlewares
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/code", codeRouter);
app.use("/ai", aiRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});