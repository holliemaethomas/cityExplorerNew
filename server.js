'use strict';

// pull in requirements
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

// define localhost
const PORT = process.env.PORT || 3000;

// declare client
const client = new pg.Client(process.env.DATABASE_URL)
client.connect();

// declare globals
const app = express();
app.use(cors());

app.get('/location', getLocationData)
app.get('/weather', getWeatherData)
app.get('/events', getEvents)



function getLocationData(req, res) {
  const userQuery = req.query.data;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${userQuery}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url)
    .then(result => {
      const location = new Location(userQuery, result);
      res.send(location);
    })
    .catch(e => {
      e(res, e);
    });
}


function getWeatherData(req, res) {
  const weatherData = req.query.data
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${weatherData.latitude},${weatherData.latitude}`;
  const returnWeather = [];
  superagent.get(url)
    .then(result => {
      result.body.data.map(dailyWeather => returnWeather.push(new Weather(dailyWeather)))
      res.send(returnWeather);
    })
    .catch(e => {
      e(res, e);
    });
}

function getEvents(req, res) {
  const eventsData = req.query.data
  const url = `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${eventsData.latitude}&location.longitude=${eventsData.longitude}&token=${process.env.EVENTBRITE_API_KEY}`;
  const eventData = [];
  superagent.get(url)
    .then(result => {
      result.body.data.map(event => eventData.push(new Event(event)))
      res.send(eventData);
    })
    .catch(e => {
      e(res, e);
    });
}


function Location(query, result) {
  this.search_query = query;
  this.formatted_query = result.body.results[0].formatted_address;
  this.latitude = result.body.results[0].geometry.location.lat;
  this.longitude = result.body.results[0].geometry.location.lng;
}

function Weather(weatherData) {
  const time = new Date(weatherData.time * 1000).toDateString();
  this.forcast = weatherData.summary;
  this.time = time;
}

function Event(event) {
  const date = new Date(event.start.local).toDateString();
  this.link = event.url;
  this.name = event.name.text;
  this.event_date = date;
  this.summary = event.description.text;
}

app.listen(PORT, () => console.log(`Port is up on ${PORT}`));









