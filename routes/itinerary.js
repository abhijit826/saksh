const express = require('express');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const router = express.Router();
require('dotenv').config();

// Google Generative Language API URL
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// OpenWeatherMap API URL for 5-day forecast with 3-hour intervals
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Function to fetch weather forecast with temperature and rain probability
const getWeatherForecast = async (city, startDate, durationDays) => {
  try {
    console.log(`Fetching weather for ${city}, startDate: ${startDate}, duration: ${durationDays} days`);
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'imperial',
        cnt: durationDays * 8,
      },
    });

    const forecast = response.data.list
      .filter((item) => new Date(item.dt * 1000).toISOString().split('T')[0] >= startDate)
      .reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            temperature: item.main.temp,
            condition: item.weather[0].main,
            rainProbability: item.rain ? (item.rain['3h'] ? item.rain['3h'] * 10 : 0) : 0,
          };
        }
        return acc;
      }, {});

    const weatherData = Object.values(forecast).slice(0, durationDays);
    console.log('Weather Data:', weatherData);
    return weatherData;
  } catch (error) {
    console.error('Weather Fetch Error:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Function to estimate crowd level
const estimateCrowdLevel = (date, duration) => {
  const tripDate = new Date(date);
  const dayOfWeek = tripDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const durationDaysMap = {
    'weekend-getaway-(1-3-days)': 3,
    'short-trip-(4-7-days)': 7,
    'medium-trip-(1-2-weeks)': 14,
    'long-trip-(2+-weeks)': 21,
  };
  const durationDays = durationDaysMap[duration] || 3;

  const crowdLevel = isWeekend ? 'high' : 'moderate';
  console.log(`Estimated crowd level: ${crowdLevel}, duration: ${durationDays} days`);
  return { crowdLevel, durationDays };
};

// Function to generate itinerary
const generateItinerary = async (preferences, auth) => {
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    console.log('Access Token:', token.token);

    const { crowdLevel, durationDays } = estimateCrowdLevel(preferences.departureDate, preferences.duration);
    const weatherData = await getWeatherForecast(preferences.destination, preferences.departureDate, durationDays);
    if (!weatherData) throw new Error('Failed to fetch weather data');

    const prompt = `
      Generate a travel itinerary for a trip from ${preferences.origin} to ${preferences.destination} 
      with a budget of ${preferences.maxPrice} dollars, departing on ${preferences.departureDate} 
      for a duration of ${preferences.duration} (${durationDays} days). 
      Consider the following constraints:
      - Weather forecast: ${weatherData
        .map(w => `${w.date}: ${w.temperature}°F, ${w.condition}, ${w.rainProbability}% rain`)
        .join('; ')}.
        - Avoid outdoor activities if rain probability > 50% or temperature < 32°F or > 90°F.
      - Crowd levels: ${crowdLevel}. Prefer less crowded times or locations if high.
      Return a valid JSON object with this structure:
      {
        "destination": "string",
        "startDate": "string (YYYY-MM-DD)",
        "durationDays": number,
        "totalCost": number,
        "crowdLevel": "string",
        "dailyPlans": [
          {
            "day": number,
            "date": "string (YYYY-MM-DD)",
            "weather": {
              "temperature": number,
              "condition": "string",
              "rainProbability": number
            },
            "activities": [
              {
                "time": "string (e.g., 09:00 AM)",
                "description": "string",
                "location": "string",
                "cost": number
              }
            ]
          }
        ]
      }
    `;

    console.log('Prompt:', prompt);

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const rawText = response.data.candidates[0].content.parts[0].text;
    console.log('Raw API Response:', rawText);

    let structuredItinerary;
    try {
      const cleanText = rawText.replace(/```json\n|\n```/g, '').trim();
      structuredItinerary = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse JSON, falling back to raw text:', parseError);
      structuredItinerary = { rawText }; // Fallback
    }

    if (structuredItinerary.dailyPlans) {
      structuredItinerary.dailyPlans.forEach((day, index) => {
        if (!day.weather && weatherData[index]) {
          day.weather = weatherData[index];
        }
      });
      if (!structuredItinerary.crowdLevel) {
        structuredItinerary.crowdLevel = crowdLevel;
      }
    }

    console.log('Structured Itinerary:', structuredItinerary);
    return structuredItinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error.response ? error.response.data : error.message);
    console.error('Full error response:', error.response);
    throw error; // Re-throw to be caught by the route handler
  }
};

// POST route
router.post('/generate-itinerary', async (req, res) => {
  const preferences = req.body;

  if (!preferences.origin || !preferences.destination || !preferences.maxPrice || !preferences.departureDate || !preferences.duration) {
    return res.status(400).json({ message: 'Missing required preferences' });
  }

  try {
    const auth = req.app.get('googleAuth');
    const itinerary = await generateItinerary(preferences, auth);
    res.json({ success: true, itinerary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, details: error.response?.data });
  }
});

module.exports = router;