"use client"

import React, { useState } from "react";
import axios from "axios";

interface WeatherData {
  name?: string;
  main?: {
    temp: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
  };
  weather?: { main: string }[];
  wind: { speed: number };
}

export default function Home(): JSX.Element {
  const [data, setData] = useState<WeatherData>({
    name: "",
    main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0,
      humidity: 0,
    },
    weather: [],
    wind: {
      speed: 0,
    },
  });
  
  const [location, setLocation] = useState<string>("");
  const [coords, setCoords] = useState<{
    lat: number;
    lon: number;
    country: string;
  }>({ lat: 0, lon: 0, country: "" });

  const longLat = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=5b0ea1f33262ab853ddea80cb83bdaa3`;
  const searchLocation = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const response1 = await axios.get(longLat);
      const coords = response1.data[0];

      const response2 = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=5b0ea1f33262ab853ddea80cb83bdaa3`
      );

      setCoords(coords);
      setData(response2.data);
      setLocation("");
    }
  };

  return (
    <div className="app relative w-100 h-screen text-white">
      <div className="search p-4 text-center">
        <input
          className="text-xl rounded-3xl	"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyUp={searchLocation}
          placeholder="Search a location..."
          type="text"
        />
      </div>
      {data.name !== undefined && (
        <div className="container flex flex-col m-auto justify-between relative max-w-2xl top-10">
          <div className="top w-full">
            <div className="location">
              <p className="text-2xl">
                {data.name}, {coords.country}
              </p>
            </div>
            <div className="temp">
              {data.main ? (
                <h2 className="text-8xl">{data.main.temp.toFixed()}°F</h2>
              ) : null}
            </div>
            <div className="description">
              {data.weather ? (
                <p className="text-2xl">{data.weather[0].main}</p>
              ) : null}
            </div>
          </div>

          <div className="bottom p-4 justify-evenly text-center rounded-xl flex w-full">
            <div className="high">
              {data.main ? (
                <p className="font-bold text-2xl">
                  {data.main.temp_max.toFixed()}°F
                </p>
              ) : null}
              <p className="text-2xl">High</p>
            </div>
            <div className="low">
              {data.main ? (
                <p className="font-bold text-2xl" text-2xl>
                  {data.main.temp_min.toFixed()}°F
                </p>
              ) : null}
              <p className="text-2xl">Low</p>
            </div>
            <div className="humidity">
              {data.main ? (
                <p className="font-bold text-2xl">
                  {data.main.humidity.toFixed()}%
                </p>
              ) : null}
              <p className="text-2xl">Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? (
                <p className="font-bold text-2xl">
                  {data.wind.speed.toFixed()} M/H
                </p>
              ) : null}
              <p className="text-2xl">Wind Speed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
