

'use strict';
require('dotenv').config();
require('express-async-errors');

const express      = require('express');
const http         = require('http');
const { Server }   = require('socket.io');
const cors         = require('cors');
const helmet       = require('helmet');
const compression  = require('compression');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit    = require('express-rate-limit');
const slowDown     = require('express-slow-down');
const hpp          = require('hpp');

const { sequelize } = require('./models');
const logger        = require('./utils/logger');
const errorHandler  = require('./middleware/errorHandler');
const socketHandler = require('./utils/socketHandler');
const passport = require('./config/passport');

// ── Routes ────────────────────────────────────────────────────
// const authRoutes = require('./routes/auth.routes');
// // Stage 2+ routes (uncomment as you build them):
// const userRoutes         = require('./routes/user.routes');
// const companyRoutes      = require('./routes/company.routes');
// // const jobRoutes          = require('./routes/job.routes');
// const cvRoutes           = require('./routes/cv.routes');
// const applicationRoutes  = require('./routes/application.routes');
// const trainingRoutes     = require('./routes/training.routes');
// const courseRoutes       = require('./routes/course.routes');
// const communityRoutes    = require('./routes/community.routes');
// const chatRoutes         = require('./routes/chat.routes');
// const walletRoutes       = require('./routes/wallet.routes');
// const notificationRoutes = require('./routes/notification.routes');
// const adminRoutes        = require('./routes/admin.routes');
// const paymentRoutes      = require('./routes/payment.routes');
// const aiRoutes           = require('./routes/ai.routes');
const waitlistRoutes = require('./routes/waitlist.routes');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

// ── Trust proxy (needed behind Nginx / Hostinger) ─────────────
app.set('trust proxy', 1);

// ── Security Headers ─────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// ── CORS ──────────────────────────────────────────────────────
app.use(cors({
  origin:         process.env.FRONTEND_URL,
  credentials:    true,
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
}));

// ── Global Rate Limiting ──────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs:        parseInt(process.env.RATE_LIMIT_WINDOW_MS) , // 1 min
  max:             parseInt(process.env.RATE_LIMIT_MAX) ,
  message:         { success: false, message: 'طلبات كثيرة جداً، حاول لاحقاً' },
  standardHeaders: true,
  legacyHeaders:   false,
  skip: (req) => req.method === 'OPTIONS',
});

const speedLimiter = slowDown({
  windowMs:   30_000,
  delayAfter: 50,
  delayMs:    () => 500,
});

app.use(globalLimiter);
app.use(speedLimiter);

// ── Body Parsing ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(hpp());
app.use(compression());
app.use(passport.initialize());
// ── HTTP Logging ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// ── Attach Socket.io to every request ────────────────────────
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// ── Health Check ─────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status:    'OK',
      env:       process.env.NODE_ENV,
      timestamp: new Date(),
      db:        'connected',
    });
  } catch {
    res.status(503).json({ status: 'ERROR', db: 'disconnected' });
  }
});

// ── API Routes ────────────────────────────────────────────────
const API = process.env.API_PREFIX ;

// app.use(`${API}/auth`, authRoutes);
// // Uncomment progressively as stages are completed:
// app.use(`${API}/users`,         userRoutes);
// app.use(`${API}/companies`,     companyRoutes);
// // app.use(`${API}/jobs`,          jobRoutes);
// app.use(`${API}/cvs`,           cvRoutes);
// app.use(`${API}/applications`,  applicationRoutes);
// app.use(`${API}/training`,      trainingRoutes);
// app.use(`${API}/courses`,       courseRoutes);
// app.use(`${API}/community`,     communityRoutes);
// app.use(`${API}/chat`,          chatRoutes);
// app.use(`${API}/wallet`,        walletRoutes);
// app.use(`${API}/notifications`, notificationRoutes);
// app.use(`${API}/admin`,         adminRoutes);
// app.use(`${API}/payments`,      paymentRoutes);
// app.use(`${API}/ai`,            aiRoutes);
app.use(`${API}/waitlist`, waitlistRoutes);

// app.use(`${API}/plans`, require('./routes/plans.routes'));
// app.use(`${API}/files`, require('./routes/files.routes'));
// ── 404 Handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'المسار غير موجود' });
});

// ── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ── Socket.io Handler ─────────────────────────────────────────
socketHandler(io);

// ── Start Server ──────────────────────────────────────────────
const PORT = parseInt(process.env.PORT);

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ PostgreSQL connected');

    if (process.env.NODE_ENV === 'development') {
      // await sequelize.sync({ alter: true });
      await sequelize.sync();
      logger.info('✅ Database synced');
    }

    server.listen(PORT, () => {
      logger.info(`🚀 Server running → http://localhost:${PORT} [${process.env.NODE_ENV}]`);
      logger.info(`📡 API prefix: ${API}`);
    });
  } catch (err) {
  logger.error('❌ Startup failed:', err);
  process.exit(1);
}
};

start();

module.exports = { app, server, io };