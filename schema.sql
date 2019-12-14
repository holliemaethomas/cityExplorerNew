DROP TABLE IF EXISTS city; 
DROP TABLE IF EXISTS weather; 
DROP TABLE IF EXISTS events; 
DROP TABLE IF EXISTS hikes; 


CREATE TABLE IF NOT EXISTS city(
id SERIAL PRIMARY KEY,
search_query VARCHAR(255),
formatted_query VARCHAR (255),
latitude FLOAT,
longitude FLOAT
);


CREATE TABLE IF NOT EXISTS weather(
id SERIAL PRIMARY KEY,
forcast VARCHAR(255),
time VARCHAR (255),
location_id NUMERIC NOT NULL (8, 6)
);

CREATE TABLE IF NOT EXISTS events(
id SERIAL PRIMARY KEY,
link VARCHAR(255),
name VARCHAR (255),
event_date TEXT,
summary TEXT
);

CREATE TABLE IF NOT EXISTS hikes(
id SERIAL PRIMARY KEY,
name VARCHAR(255),
location VARCHAR (255),
trail_length NUMERIC (8, 6),
stars FLOAT,
star_votes NUMERIC(8,6),
summary TEXT,
trail_url TEXT,
conditions VARCHAR (255),
condition_date VARCHAR (255),
condition_time VARCHAR (255)
);


