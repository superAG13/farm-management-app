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
    <div className="bg-white text-gray-800">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold text-center">Weather Forecast for {location}</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forecastData.map((forecast, index) => (
            <div key={index} className="max-w-md mx-auto bg-gray-100 rounded-xl shadow-md overflow-hidden p-4">
              <div className="flex flex-row items-center justify-between">
                <div className="text-center">
                  <p className="text-lg font-semibold">Day {index + 1}</p>
                  <p className="text-sm">{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                </div>
                <div className="my-2">
                  {forecast.weather && forecast.weather.length > 0 && (
                    <img className="h-16 w-16" src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt={forecast.weather[0].description} />
                  )}
                </div>
                <div className="text-sm">
                  <p>Temp: {forecast.main.temp}°C</p>
                  <p>Min: {forecast.main.temp_min}°C</p>
                  <p>Max: {forecast.main.temp_max}°C</p>
                  <p>Humidity: {forecast.main.humidity}%</p>
                  <p>
                    Wind: {forecast.wind.speed} m/s {windDirectionIcon(forecast.wind.deg)}
                  </p>
                  <p>Pressure: {forecast.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
