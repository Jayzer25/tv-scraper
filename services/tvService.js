const axios = require('axios');
const Show = require('../models/Show');

const TV_MAZE_API_BASE_URL = 'https://api.tvmaze.com';

const fetchAndStoreShows = async () => {
  try {
    const shows = await getShows();

    for (const show of shows) {
      const casts = await getCastsByShowId(show.id);
      const cast = getCastObject(casts);
      const showData = getShowObject(show.id, show.name, cast);

      await Show.findOneAndUpdate({ id: show.id }, showData, { upsert: true });
    }

    console.log('Data successfully scraped and stored!');
  } catch (error) {
    console.error('Error scraping data:', error.message);
  }
};

const getShows = async () => {
  try {
    const showsResponse = await axios.get(`${TV_MAZE_API_BASE_URL}/shows`);
    return showsResponse.data;
  } catch (error) {
    console.error('Error getting shows:', error.message);
  }
}

const getCastsByShowId = async (showId) => {
  try {
    const castsResponse = await axios.get(`${TV_MAZE_API_BASE_URL}/shows/${showId}/cast`);
    return castsResponse.data;
  } catch (error) {
    console.error('Error getting casts:', error.message);
  }
}

const getCastObject = (data) => {
  return data.map(cast => ({
    id: cast.person.id,
    name: cast.person.name,
    birthday: cast.person.birthday
  }));
}

const getShowObject = (showId, showName, cast) => {
  return {
    id: showId,
    name: showName,
    cast: getSortedCast(cast)
  };
}

const getSortedCast = (cast) => {
  return cast.sort((a, b) => {
    if (!a.birthday) return 1;
    if (!b.birthday) return -1;
    
    return new Date(b.birthday) - new Date(a.birthday);
  });
}

module.exports = { fetchAndStoreShows };