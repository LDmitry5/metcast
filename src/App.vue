<template>
  <div class="app">
    <el-container>
      <el-header height="auto">
        <div class="header-title">
          <img :src="`https://openweathermap.org/img/wn/02d@2x.png`" alt="Погода" class="weather-icon" />
          <h1>MetCast</h1>
        </div>
        <p>Прогноз погоды</p>
      </el-header>
      <el-main>
        <WeatherSearch @search="handleSearch" ref="weatherSearchRef" />
        <WeatherDisplay :weather="weather" :loading="loading" :error="error" @retry="handleRetry" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import WeatherSearch from "./components/WeatherSearch.vue";
import WeatherDisplay from "./components/WeatherDisplay.vue";
import { weatherService } from "./services/weatherService";
import type { WeatherData } from "./types/weather";

const weather = ref<WeatherData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const weatherSearchRef = ref<InstanceType<typeof WeatherSearch> | null>(null);

const fetchWeatherByCoords = async (lat: number, lon: number) => {
  try {
    loading.value = true;
    error.value = null;
    weather.value = await weatherService.getWeatherByCoords(lat, lon);
  } catch (err: any) {
    error.value = err.message || "Ошибка при получении данных о погоде";
    console.error("Weather fetch error:", err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = async (city: string) => {
  try {
    loading.value = true;
    error.value = null;
    weather.value = await weatherService.getWeatherByCity(city);
  } catch (err: any) {
    error.value = err.message || "Ошибка при поиске города";
    console.error("City search error:", err);
  } finally {
    loading.value = false;
  }
};

const handleRetry = () => {
  error.value = null;
  weatherSearchRef.value?.focus();
};

onMounted(async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        error.value = "Не удалось определить местоположение. Используйте поиск города.";
        console.error("Geolocation error:", err);
      },
    );
  } else {
    error.value = "Геолокация не поддерживается вашим браузером. Используйте поиск города.";
  }
});
</script>

<style lang="scss" scoped>
$beige: #f5f1e6;
$terracotta: #e07a5f;
$soft-orange: #f2b879;
$dark: #333;
$shadow: rgba(0, 0, 0, 0.1);

.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  img {
    width: 120px;
  }
}

:deep(.el-container) {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  gap: 1.5rem;
}

:deep(.el-header) {
  text-align: center;
  padding: 2.5rem 1rem 2rem;
  color: $dark;
  background: white;
  border-radius: 16px;
  box-shadow: 0 0 10px $shadow;

  h1 {
    margin: 0;
    font-size: 2.8rem;
    font-weight: 600;
    letter-spacing: -0.5px;
    color: $terracotta;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.8;
    font-weight: 400;
  }
}

:deep(.el-main) {
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

// Адаптивность
@media (max-width: 768px) {
  .container {
    padding: 0.75rem;
  }

  .header {
    padding: 2rem 0.75rem 1rem;

    h1 {
      font-size: 2.2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }

  .main {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .header {
    h1 {
      font-size: 1.8rem;
    }
    .subtitle {
      font-size: 0.9rem;
    }
  }
}
</style>
