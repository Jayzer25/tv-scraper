# TV Scraper

## Overview

TV Scraper is a Node.js application that scrapes TV show and cast information from the [TVMaze API](https://www.tvmaze.com/api) and stores the data in MongoDB. It provides a RESTful API that allows users to retrieve a paginated list of TV shows along with their cast members, sorted by the cast members' birthdays in descending order.

## Features
- Scrapes TV show and cast information from the TVMaze API.
- Stores the data in MongoDB.
- Provides a RESTful API to retrieve TV shows and their cast members.
- Pagination support for large datasets.
- Rate limiting to handle API rate limits.
- Unit tests to ensure code quality.
- CI pipeline for automated testing and deployment.

## Prerequisites
- Node.js (v16 or later)
- MongoDB (either locally or via a service like MongoDB Atlas)
- Git (for cloning the repository)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/tv-scraper.git
cd tv-scraper
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up MongoDB
Ensure MongoDB is running locally or provide a connection string to a MongoDB instance.

### 4. Run the application
```bash
npm start
```

### 5. Test the application
```bash
GET http://localhost:3000/api/shows?page=1&limit=10
```

### 6. Run unit tests
```bash
npm test
```

## API Endpoints
GET /api/shows
###### Retrieve a paginated list of TV shows and their cast members.

Query Parameters:
- page (optional): Page number (default: 1)
- limit (optional): Number of items per page (default: 10)
  
Example Response:
```bash
[
  {
    "id": 1,
    "name": "Game of Thrones",
    "cast": [
      {
        "id": 7,
        "name": "Mike Vogel",
        "birthday": "1979-07-17"
      },
      {
        "id": 9,
        "name": "Dean Norris",
        "birthday": "1963-04-08"
      }
    ]
  },
  {
    "id": 4,
    "name": "Big Bang Theory",
    "cast": [
      {
        "id": 6,
        "name": "Michael Emerson",
        "birthday": "1950-01-01"
      }
    ]
  }
]
```
