
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Fix: Use any cast for cors and express.json to avoid version-specific RequestHandler mismatches
app.use(cors() as any);
app.use(express.json() as any);

// Database Connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn("No MONGO_URI found in .env");
}

// Routes
// Fix: Use any cast for apiRoutes to avoid Router vs RequestHandler type conflicts
app.use('/api', apiRoutes as any);

// Static Asset Serving for Frontend Module Resolution
// Frontend is served from 'views' at root, so imports like '../components' resolve to '/components'
// Fix: Use any cast for static middleware to avoid PathParams overload issues
app.use('/components', express.static(path.join(__dirname, 'components')) as any);
app.use('/services', express.static(path.join(__dirname, 'services')) as any);

// Serve types.ts specifically at /types to match import path '../types'
app.get('/types', (req, res) => {
  res.sendFile(path.join(__dirname, 'types.ts'));
});

// Serve Frontend Entry (Views)
// Fix: Use any cast for static middleware
app.use(express.static(path.join(__dirname, 'views')) as any);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
