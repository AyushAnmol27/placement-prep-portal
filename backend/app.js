const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter, authLimiter, codeLimiter } = require('./middleware/rateLimiter');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use('/api', apiLimiter);

app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/problems/run', codeLimiter);
app.use('/api/aptitude', require('./routes/aptitudeRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

module.exports = app;
