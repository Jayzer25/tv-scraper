const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const showRoutes = require('../routes/showRoutes');
const Show = require('../models/Show');

const app = express();
app.use('/api', showRoutes);

const API_BASE_URL = '/api/shows';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/tv-scraper-test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('GET /api/shows', () => {
  it('should return a list of shows with their cast', async () => {

    // Arrange
    // Insert test data
    await Show.create([
      {
        id: 1,
        name: "Game of Thrones",
        cast: [
          { id: 7, name: "Mike Vogel", birthday: "1979-07-17" },
          { id: 9, name: "Dean Norris", birthday: "1963-04-08" }
        ]
      },
      {
        id: 4,
        name: "Big Bang Theory",
        cast: [{ id: 6, name: "Michael Emerson", birthday: "1950-01-01" }]
      }
    ]);

    // Act
    const response = await request(app).get(API_BASE_URL);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    // Check structure of the response
    response.body.forEach(show => {
      expect(show).toHaveProperty('id');
      expect(show).toHaveProperty('name');
      expect(show).toHaveProperty('cast');
      expect(show.cast).toBeInstanceOf(Array);

      show.cast.forEach(castMember => {
        expect(castMember).toHaveProperty('id');
        expect(castMember).toHaveProperty('name');
        expect(castMember).toHaveProperty('birthday');
      });
    });
  });

  it('should handle pagination', async () => {

    // Arrange
    // Insert test data
    await Show.create([
      {
        id: 10,
        name: "Game of Thrones",
        cast: [
          { id: 7, name: "Mike Vogel", birthday: "1979-07-17" },
          { id: 9, name: "Dean Norris", birthday: "1963-04-08" }
        ]
      },
      {
        id: 11,
        name: "Big Bang Theory",
        cast: [
          { id: 6, name: "Michael Emerson", birthday: "1950-01-01" }
        ]
      }
    ]);
  
    // Act
    const response = await request(app).get(`${API_BASE_URL}?page=1&limit=1`);
  
    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
  });
  
  it('should return an empty array if no shows are available', async () => {
    
    // Arrange
    await Show.deleteMany({}); // Ensure no data is present
  
    // Act
    const response = await request(app).get(API_BASE_URL);
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array); // check if result is array
    expect(response.body.length).toBe(0);
  });
  
  it('should return 200 for requests not exceeding rate limit', async () => {
    
    // Arrange
    const numRequests = 80; // Number not exceeding the rate limit
    const requests = [];
  
    for (let i = 0; i < numRequests; i++) {
      requests.push(request(app).get(API_BASE_URL));
    }
  
    // Act
    const responses = await Promise.all(requests);
  
    // Assert
    expect(responses[numRequests - 1].status).toBe(200);
  });
  
  it('should return 429 for requests exceeding rate limit', async () => {
    
    // Arrange
    const numRequests = 101; // Number exceeding the rate limit
    const requests = [];
  
    for (let i = 0; i < numRequests; i++) {
      requests.push(request(app).get(API_BASE_URL));
    }
  
    // Act
    const responses = await Promise.all(requests);
  
    // Assert
    // The 101st request should exceed the rate limit
    expect(responses[numRequests - 1].status).toBe(429);
    expect(responses[numRequests - 1].error.text).toBe('Too many requests from this IP, please try again later.');
  });

});

