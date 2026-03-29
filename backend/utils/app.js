const express = require('express');
const cors = require('cors');
const { errorHandler } = require('../middleware/errorMiddleware');
const authRoutes = require('../routes/authRoutes');
const problemRoutes = require('../routes/problemRoutes');
const noteRoutes = require('../routes/noteRoutes');
const testRoutes = require('../routes/testRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tests', testRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
