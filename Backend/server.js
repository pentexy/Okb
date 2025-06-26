const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan'); // Optional: logs requests
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize app
const app = express();

// ✅ Middlewares
app.use(cors()); // Allow all origins — for production, you may want to restrict it
app.use(express.json()); // Parse JSON body
app.use(morgan('dev')); // Optional: Log incoming requests

// ✅ Mongo URI check
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MONGO_URI not set in environment variables!');
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');

  // ✅ Start server only after DB is ready
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Catch-all route (optional for testing)
app.get('/', (req, res) => {
  res.send('AuraOTT Backend is Running');
});
