const express = require('express');
const mongoose = require('mongoose');
const showRoutes = require('./routes/showRoutes');
const { fetchAndStoreShows } = require('./services/tvService');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Use Routes
app.use('/api', showRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/tv-scraper');

// Start the Server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await fetchAndStoreShows(); // Fetch and store shows when the server starts
});