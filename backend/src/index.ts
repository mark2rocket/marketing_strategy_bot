import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Marketing Strategy Bot API is running' });
});

// API routes placeholder
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Marketing Strategy Bot API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
