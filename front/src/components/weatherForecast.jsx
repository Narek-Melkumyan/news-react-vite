import { useEffect, useState } from "react";

function getWeatherInfo(code) {
    if (code === 0) {
        return {
            icon: "☀️",
            text: "Clear sky",
        };
    }

    if ([1, 2].includes(code)) {
        return {
            icon: "🌤️",
            text: "Partly cloudy",
        };
    }

    if (code === 3) {
        return {
            icon: "☁️",
            text: "Cloudy",
        };
    }

    if ([45, 48].includes(code)) {
        return {
            icon: "🌫️",
            text: "Foggy",
        };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return {
            icon: "🌦️",
            text: "Drizzle",
        };
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return {
            icon: "🌧️",
            text: "Rain",
        };
    }

    if ([71, 73, 75, 77].includes(code)) {
        return {
            icon: "❄️",
            text: "Snow",
        };
    }

    if ([80, 81, 82].includes(code)) {
        return {
            icon: "🌦️",
            text: "Rain showers",
        };
    }

    if ([85, 86].includes(code)) {
        return {
            icon: "🌨️",
            text: "Snow showers",
        };
    }

    if ([95, 96, 99].includes(code)) {
        return {
            icon: "⛈️",
            text: "Thunderstorm",
        };
    }

    return {
        icon: "🌤️",
        text: "Weather",
    };
}

function WeatherForecast() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function getWeather() {
            try {
                setLoading(true);
                setError("");

                const url =
                    "https://api.open-meteo.com/v1/forecast" +
                    "?latitude=34.0522" +
                    "&longitude=-118.2437" +
                    "&current=temperature_2m,apparent_temperature,weather_code,is_day" +
                    "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
                    "&temperature_unit=fahrenheit" +
                    "&timezone=America%2FLos_Angeles" +
                    "&forecast_days=5";

                const response = await fetch(url, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Weather request failed");
                }

                const data = await response.json();

                const forecast = data.daily.time.map((date, index) => ({
                    date,
                    code: data.daily.weather_code[index],
                    max: data.daily.temperature_2m_max[index],
                    min: data.daily.temperature_2m_min[index],
                }));

                setWeather({
                    current: {
                        temperature: data.current.temperature_2m,
                        feelsLike: data.current.apparent_temperature,
                        code: data.current.weather_code,
                        isDay: data.current.is_day,
                    },
                    forecast,
                });
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Weather unavailable");
                }
            } finally {
                setLoading(false);
            }
        }

        getWeather();

        return () => {
            controller.abort();
        };
    }, []);

    if (loading) {
        return (
            <div className="weather-bar weather-status">
                Loading weather...
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="weather-bar weather-status">
                {error || "Weather unavailable"}
            </div>
        );
    }

    const currentInfo = getWeatherInfo(weather.current.code);

    return (
        <div className="weather-bar">
            <div className="weather-current">
                <div className="current-icon">
                    {currentInfo.icon}
                </div>

                <div className="current-details">
                    <div className="weather-city-name">
                        Los Angeles
                    </div>

                    <div className="current-main">
                        <strong>
                            {Math.round(weather.current.temperature)}°F
                        </strong>

                        <span>{currentInfo.text}</span>
                    </div>

                    <small>
                        Feels like{" "}
                        {Math.round(weather.current.feelsLike)}°F
                    </small>
                </div>
            </div>

            <div className="weather-list">
                {weather.forecast.map((day, index) => {
                    const info = getWeatherInfo(day.code);

                    const dayName = new Date(
                        `${day.date}T12:00:00`
                    ).toLocaleDateString("en-US", {
                        weekday: "short",
                        timeZone: "America/Los_Angeles",
                    });

                    return (
                        <div
                            className={`weather-item ${
                                index === 0 ? "weather-item-today" : ""
                            }`}
                            key={day.date}
                        >
                            <span className="weather-name">
                                {index === 0 ? "Today" : dayName}
                            </span>

                            <span className="weather-emoji">
                                {info.icon}
                            </span>

                            <div className="weather-temperature">
                                <span className="weather-high">
                                    {Math.round(day.max)}°
                                </span>

                                <span className="weather-low">
                                    {Math.round(day.min)}°
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default WeatherForecast;