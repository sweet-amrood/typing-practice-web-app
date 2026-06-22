import 'dotenv/config';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import coachRoutes from './routes/coachRoutes.js';
import titleRoutes from './routes/titleRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { authenticateSocket } from './socket/auth.js';
import { initializeRaceSocket } from './socket/raceSocket.js';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/titles', titleRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/shop', shopRoutes);

app.use(notFound);
app.use(errorHandler);

const io = new Server(httpServer, {
  cors: corsOptions,
});

io.use(authenticateSocket);
initializeRaceSocket(io);

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
  }

  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    console.error(
      'Check that MongoDB is running and MONGODB_URI in .env matches your MongoDB Compass connection string.'
    );
    process.exit(1);
  }
};

startServer();
