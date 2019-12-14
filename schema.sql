DROP TABLE city; 

CREATE TABLE IF NOT EXISTS city(
id SERIAL PRIMARY KEY,
search_query VARCHAR(255),
formatted_query VARCHAR (255),
latitude FLOAT,
longitude FLOAT
);


