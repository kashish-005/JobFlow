import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import resumeRoute from './routes/resumeAnalysis.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ status: 'backend working' });
});

app.use('/api', resumeRoute);

app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`JobFlow backend running on http://localhost:${PORT}`));
