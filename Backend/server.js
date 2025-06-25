const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');

// ✅ Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Validate MONGO_URI
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('❌ MONGO_URI not set in environment variables!');
    process.exit(1); // Stop the server from running
}

// 🔗 Connect to MongoDB
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // ✅ Start server only after DB connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// 🔁 Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
