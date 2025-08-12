import { Search, Thermometer, Droplet, Sun, Moon } from "lucide-react"
import { useState } from "react"
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";






export default function App() {

  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState("metric")
  const [forecast, setForecast] = useState(null)


  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const fetchForecast = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}`
      );
      if (!response.ok) throw new Error("Forecast Unavailable")
      const data = await response.json();
      const daily = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
      setForecast(daily);
    }
    catch (error) {
      setForecast(null);
      console.error(error);
    }
  }

  const handleSearch = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;
    setLoading(true);
    setWeather(null)
    setForecast(null)
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${API_KEY}&units=${unit}`
      );
      if (!response.ok) {
        throw new Error("City not found!");
      }
      const data = await response.json();
      setWeather(data)
      await fetchForecast(trimmedCity)
    } catch (error) {
      setError(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  const tempSymbol = unit === "metric" ? "°C" : "°F";


  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
    setWeather(null)
    setForecast(null)
    setError(null)
  }
  return (
    <div className={"min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-700 to-slate-900 text-white p-4"}>
      <div className="relative bg-white/20 backdrop-blur-lg rounded-2xl w-full max-w-3xl p-6 shadow-xl border border-white/30 overflow-hidden" data-aos="fade-up">

        <h1
          className="text-4xl sm:text-6xl font-extrabold tracking-wide drop-shadow-lg text-center mb-6 bg-gradient-to-br from-white/100 via-white/60 to-slate-500 text-transparent bg-clip-text"
          data-aos="fade-down"
        >
        MoonChase
        </h1>

        <div className="mb-4 flex justify-center">
          <button
            onClick={toggleUnit}
            className="flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out cursor-pointer select-none"
          >
            {unit === "metric" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-200" />}
            {unit === "metric" ? "Switch to °F" : "Switch to °C"}
          </button>

        </div>
        {/*Search*/}
        <div data-aos="zoom-in" className="flex text-center overflow-hidden mb-8 bg-white/30 rounded-lg shadow-md focus-within:ring-2 focus-within:ring-pink-400 transition-all">
          <input
            type="text"
            placeholder="Please Enter your city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 bg-transparent outline-none px-4 py-3 text-white placeholder-gray-200"
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 hover:scale-103 px-4 sm:px-5 py-2 sm:py-3 cursor-pointer flex items-center gap-3 transition-all"

          >
            <Search size={19} />
            Search
          </button>
        </div>
        {loading && <p data-aos="fade-in" className="text-center text-gray-300">Ready to get your weather...</p>}
        {error && <p data-aos="fade-in" className="text-center text-gray-300">{error}</p>}

        {weather && (
          <div data-aos="fade-up" className="bg-white/10 rounded-xl p-6 text-center shadow-lg">
            <h2 className="text-3xl font-bold mb-2">{weather.name}</h2>
            <p className="text-6xl mb-2">{Math.round(weather.main.temp)}{tempSymbol}</p>
            <p className="text-2xl text-gray-200">{weather.weather[0].description}</p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm sm:text-base">
              <div className="bg-white/20 rounded-lg p-3">
                <Thermometer className="mb-1 text-red-300 animate-pulse" />
                <p className="font-semibold">Feels Like</p>
                <p>{Math.round(weather.main.feels_like)}°C</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Droplet className="mb-1 animate-bounce text-blue-900" />
                <p className="font-semibold">Humidity</p>
                <p>{weather.main.humidity}%</p>
              </div>

              <div className="bg-white/20 p-3 rounded-lg">
                <Sun className="mb-1 text-orange-300 animate-glow" />
                <p className="font-semibold">Sunrise</p>
                <p>
                  {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Moon className="mb-1 text-indigo-300 animate-pulse" />
                <p className="font-semibold">Sunset</p>
                <p>
                  {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

            </div>
            {forecast && (
              <div className="mt-8 text-left">
                <h3 className="text-2xl font-bold mb-4"> Forecast</h3>
                <div className="grid grid-cols-5 gap-4 text-center">
                  {forecast.map((day) => (
                    <div key={day.dt} className="bg-white/20 rounded-lg p-3">
                      <p className="font-semibold mb-1">{new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      <img
                        alt={day.weather[0].description}
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        className="mx-auto mb-2"
                      />
                      <p>{Math.round(day.main.temp)}{tempSymbol}</p>
                      <p className="capitalize text-gray-300 text-xs">{day.weather[0].description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>


  );
}
