const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes=require('./routes/profileRoutes')
const exploreRoutes=require('./routes/exploreRoutes')
const personaRoutes = require('./routes/persona');
const CreatePostRoute = require('./routes/CreatePostRoute');
const ContentSelectRoutes = require('./routes/ContentSelect');
const { connect } = require('http2');
require('dotenv').config();

const app = express();
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // Optional, based on use case
  next();
});
app.use(express.json());



app.use(cors(
  {
    credentials:true,
    origin:process.env.CLIENT_URL
  }
));
app.use('/api/auth', authRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/explore',exploreRoutes);
app.use('/api', personaRoutes);
app.use('/api', ContentSelectRoutes);
app.use('/api', CreatePostRoute);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB',process.env.MONGO_URI);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});