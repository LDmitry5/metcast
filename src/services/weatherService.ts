import axios, { AxiosError } from "axios";
import type { WeatherData, OpenWeatherResponse } from "../types/weather";

const API_KEY = process.env.OPENWEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

if (!API_KEY || API_KEY === "your_api_key_here") {
  console.warn("OpenWeatherMap API key is not set. Please set OPENWEATHER_API_KEY in .env file");
}

class WeatherService {
  private async fetchWeather(url: string): Promise<WeatherData> {
    if (!API_KEY || API_KEY === "your_api_key_here") {
      throw new Error("API ключ не настроен. Пожалуйста, установите OPENWEATHER_API_KEY в файле .env");
    }

    try {
      const response = await axios.get<OpenWeatherResponse>(url, {
        params: {
          appid: API_KEY,
          units: "metric",
          lang: "ru",
        },
      });

      return this.transformWeatherData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response) {
          if (axiosError.response.status === 404) {
            throw new Error("Город не найден. Проверьте правильность написания.");
          } else if (axiosError.response.status === 401) {
            throw new Error("Неверный API ключ. Проверьте настройки.");
          } else {
            throw new Error(axiosError.response.data?.message || "Ошибка при запросе к API");
          }
        } else if (axiosError.request) {
          throw new Error("Нет соединения с сервером. Проверьте интернет-соединение.");
        }
      }
      throw new Error("Произошла неизвестная ошибка");
    }
  }

  private transformWeatherData(data: OpenWeatherResponse): WeatherData {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      pressure: Math.round(data.main.pressure * 0.75),
    };
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}`;
    return this.fetchWeather(url);
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}`;
    return this.fetchWeather(url);
  }
}

export const weatherService = new WeatherService();
