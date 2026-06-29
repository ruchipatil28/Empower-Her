require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const investorRoutes = require('./routes/investorRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect DB
connectDB();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('Backend is running 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
