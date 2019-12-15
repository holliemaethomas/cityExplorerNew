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
client.on('error', e => console.error(e));

// declare globals
const app = express();
app.use(cors());
app.use('*', (request, response) => response.send('error'));

app.get('/location', getLocationData)
app.get('/weather', getWeatherData)
app.get('/events', getEvents)

const errors = (response, e, location) => {
  console.error(e);
  response.status(500).send(`Status 500: path to ${location.formatted_query} not available, try again`);
}
// received help from Nicholas Paro on error function 

function getLocationData(req, res) {
  const userQuery = req.query.data;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${userQuery}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url)
    .then(result => {
      const location = new Location(userQuery, result);
      res.send(location);
    })
    .catch(e => {
      errors(res, e, userQuery)
    });
}


function getWeatherData(req, res) {
  const weatherData = req.query.data
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${weatherData.latitude},${weatherData.longitude}`;
  const returnWeather = [];
  superagent.get(url)
    .then(result => {
      result.body.daily.data.map(dailyWeather => returnWeather.push(new Weather(dailyWeather)))
      res.send(returnWeather);
    })
    .catch(e => {
      errors(res, e, weatherData);
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
      errors(res, e, eventsData);
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

const cityTable = `SELECT * FROM city WHERE search_query=$1`
function locationUserQuery(location, response) {
  client.query(`
    INSERT INTO city (
    search_query,
    formatted_query,
    latitude,
    longitude
  )
  VALUES($1, $2, $3, $4)`,
  [location.search_query, location.formatted_query, location.latitude, location.longitude]
  );
  response.send(location);
}

const weatherTable = `SELECT * FROM weather WHERE location_id=$1`
function insertWeather(value, location_id) {
  client.query(`
    INSERT INTO weather (
      forcast,
      time,
      location_id
   
  )
  VALUES($1, $2, $3)`,
  [value.forcast, value.time, location.latitude, location.longitude]
  );
}



app.listen(PORT, () => console.log(`Port is up on ${PORT}`));









