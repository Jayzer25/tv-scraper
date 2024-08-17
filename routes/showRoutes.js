const express = require('express');
const rateLimit = require('express-rate-limit');
const Show = require('../models/Show');

const router = express.Router();

// Create a rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter
router.use('/shows', limiter);

// GET /shows?page=1&limit=10
router.get('/shows', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const shows = await Show.find().skip(skip).limit(limit);
    const result = mapShows(shows);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
});

const mapShows = (shows) => {
  return shows.map(show => ({
    id: show.id,
    name: show.name,
    cast: mapCasts(show.cast)
  }));
}

const mapCasts = (casts) => {
  return casts.map(c => ({
    id: c.id,
    name: c.name,
    birthday: formatDate(c.birthday)
  }));
}

const formatDate = (date) => {
  if (date === null || date === 'null')
    return null;
  const originalDate = new Date(date);
  const formattedDate = originalDate.toISOString().split('T')[0];

  return formattedDate;
}

// export router instance
module.exports = router;