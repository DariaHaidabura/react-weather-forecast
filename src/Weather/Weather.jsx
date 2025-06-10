import React, { useState, useEffect } from "react";
import "./Weather.css";

const weatherImages = [
  { type: "sunny", image: "https://www.svgrepo.com/show/29731/sunny.svg" },
  { type: "clear", image: "https://www.svgrepo.com/show/29731/sunny.svg" },
  {
    type: "rain",
    image: "https://www.svgrepo.com/show/49902/morning-rain.svg",
  },
  { type: "clouds", image: "https://www.svgrepo.com/show/2858/clouds.svg" },
  { type: "mist", image: "https://www.svgrepo.com/show/154294/mist.svg" },
];

export default function Weather() {
  const [searchCity, setSearchCity] = useState("Warsaw");
  const [image, setImage] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = (cityName) => {
    const apiKey = "6db58330718ab661be136c6efc252e14";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) {
          setWeatherData(data);
        } else {
          setWeatherData(null);
        }
      })
      .catch((error) => {
        console.log("Error fetching weather data:", error);
        setWeatherData(null);
      });
  };

  useEffect(() => {
    fetchWeather("Warsaw");
  }, []);

  useEffect(() => {
    if (weatherData) {
      const weatherType = weatherData.weather[0].main.toLowerCase();
      const imageObj = weatherImages.find((obj) => obj.type === weatherType);
      if (imageObj) {
        setImage(imageObj.image);
      } else {
        setImage("");
      }
    }
  }, [weatherData]);

  const handleSearch = () => {
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
      setSearchCity("");
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    const filteredInput = input.replace(/[^a-zA-Z\s]/g, "");
    setSearchCity(filteredInput);
  };

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h1>Weather</h1>
      </div>
      <div className="search-section">
        <input
          value={searchCity}
          onChange={handleInputChange}
          className="city-input"
          placeholder="Enter city"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="weather-info">
        {weatherData ? (
          <>
            <h2>
              {weatherData.name}, {weatherData.sys?.country}
            </h2>
            <img className="weather-icon" alt="weather-icon" src={image} />
            <p className="temp">{weatherData.main.temp.toFixed(0)}°C</p>
            <p className="weather-description">{weatherData.weather[0].main}</p>
          </>
        ) : (
          <p>City not found or error fetching data.</p>
        )}
      </div>
    </div>
  );
}
