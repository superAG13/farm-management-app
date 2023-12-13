// 7ded80d91f2b280ec979100cc8bbba94
import {useState, useEffect} from "react";

const WeatherForecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const windDirectionIcon = (degrees) => {
    // Logic to determine wind direction icon based on degrees
    // This is just an example, you can use appropriate icons based on your design
    if (degrees >= 337.5 || degrees < 22.5) {
      return "N";
    } else if (degrees >= 22.5 && degrees < 67.5) {
      return "NE";
    } else if (degrees >= 67.5 && degrees < 112.5) {
      return "E";
    } else if (degrees >= 112.5 && degrees < 157.5) {
      return "SE";
    } else if (degrees >= 157.5 && degrees < 202.5) {
      return "S";
    } else if (degrees >= 202.5 && degrees < 247.5) {
      return "SW";
    } else if (degrees >= 247.5 && degrees < 292.5) {
      return "W";
    } else {
      return "NW";
    }
  };

  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=7ded80d91f2b280ec979100cc8bbba94&units=metric`
        );
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns forecast data for the next 7 days
          if (data && data.list && data.list.length >= 7) {
            setForecastData(data.list.slice(0, 7));
            setLocation(data.city.name);
            setLoading(false);
          }
        } else {
          setError("Failed to fetch weather data");
          setLoading(false);
        }
      } catch (error) {
        setError("Error fetching weather data");
        setLoading(false);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const {latitude, longitude} = position.coords;
            fetchWeatherData(latitude, longitude);
          },
          (error) => {
            setError("Error getting location");
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Weather Forecast for {location}</h2>
      <ul>
        {forecastData.map((forecast, index) => (
          <li key={index}>
            <strong>Day {index + 1}:</strong> Date: {new Date(forecast.dt * 1000).toLocaleDateString()}, Temperature: {forecast.main.temp}°C, Min Temp:{" "}
            {forecast.main.temp_min}°C, Max Temp: {forecast.main.temp_max}°C, Humidity: {forecast.main.humidity}%, Wind Speed: {forecast.wind.speed} m/s, Wind Direction:{" "}
            {windDirectionIcon(forecast.wind.deg)}, Pressure: {forecast.main.pressure} hPa
            {forecast.weather && forecast.weather.length > 0 && (
              <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt={forecast.weather[0].description} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherForecast;
