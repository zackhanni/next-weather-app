'use client'

import React, {useState} from "react";
import axios from "axios";


export default function Home() {

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

    const [data, setData] = useState<WeatherData>({})
    const [location, setLocation] = useState<string>('')
    const [coords, setCoords] = useState<{ lat: number; lon: number; country: string }>({})

  const longLat = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=5b0ea1f33262ab853ddea80cb83bdaa3`
  const searchLocation = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {

      const response1 = await axios.get(longLat);
      const coords = response1.data[0]

      const response2 = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=5b0ea1f33262ab853ddea80cb83bdaa3`)

      setCoords(coords)
      setData(response2.data)
      setLocation('')
    }
  }

  return (
    <div className="app">
      <div className="search">
        <input 
          value={location} 
          onChange={event => setLocation(event.target.value)}
          onKeyUp={searchLocation} //check that onKeyUp works
          placeholder="Search a location..."
          type="text" />

      </div>
      {data.name !== undefined &&
        <div className="container">

          <div className="top">
            <div className="location">
              <p>{data.name}, {coords.country}</p>
            </div>
            <div className="temp">
              {data.main ? <h2>{data.main.temp.toFixed()}°F</h2> : null}
            </div>
            <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>

          <div className="bottom">
            <div className="high">
            {data.main ? <p className="bold">{data.main.temp_max.toFixed()}°F</p> : null}
              <p>High</p>
            </div>
            <div className="low">
            {data.main ? <p className="bold">{data.main.temp_min.toFixed()}°F</p> : null}
              <p>Low</p>
            </div>
            <div className="humidity">
            {data.main ? <p className="bold">{data.main.humidity.toFixed()}%</p> : null}
            <p>Humidity</p>
            </div>
            <div className="wind">
            {data.wind ? <p className="bold">{data.wind.speed.toFixed()} M/H</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>

        </div>
      }
    </div>
  );
}
