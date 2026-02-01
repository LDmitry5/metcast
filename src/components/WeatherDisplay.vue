<template>
  <div class="weather-container">
    <el-card v-if="loading" class="weather-card loading-card">
      <template #header>Идет загрузка...</template>
      <el-skeleton :rows="8" animated />
    </el-card>

    <el-card v-else-if="error" class="weather-card error-card">
      <el-result icon="error" :title="error" sub-title="Попробуйте еще раз или используйте поиск">
        <template #extra>
          <el-button type="primary" @click="$emit('retry')">Попробовать снова</el-button>
        </template>
      </el-result>
    </el-card>

    <el-card v-else-if="weather" class="weather-card">
      <div class="weather-content">
        <div class="weather-header">
          <div class="location">
            <h2>{{ weather.city }}</h2>
            <p class="country">{{ weather.country }}</p>
          </div>
          <div class="icon-container">
            <img
              :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`"
              :alt="weather.description"
              class="weather-icon" />
          </div>
        </div>

        <div class="temperature-section">
          <div class="main-temp">{{ weather.temperature }}°C</div>
          <div class="feels-like">Ощущается как {{ weather.feelsLike }}°C</div>
          <div class="description">{{ capitalizeFirst(weather.description) }}</div>
        </div>

        <el-divider />

        <div class="weather-details">
          <div class="detail-item">
            <el-icon class="detail-icon"><Cloudy /></el-icon>
            <div class="detail-content">
              <div class="detail-label">Влажность</div>
              <div class="detail-value">{{ weather.humidity }}%</div>
            </div>
          </div>

          <div class="detail-item">
            <el-icon class="detail-icon"><WindPower /></el-icon>
            <div class="detail-content">
              <div class="detail-label">Скорость ветра</div>
              <div class="detail-value">{{ weather.windSpeed }} м/с</div>
            </div>
          </div>

          <div class="detail-item">
            <el-icon class="detail-icon"><TrendCharts /></el-icon>
            <div class="detail-content">
              <div class="detail-label">Давление</div>
              <div class="detail-value">{{ weather.pressure }} мм рт.ст.</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-else class="weather-card empty-card">
      <el-empty description="Введите название города для поиска погоды" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Cloudy, WindPower, TrendCharts } from "@element-plus/icons-vue";
import type { WeatherData } from "../types/weather";

defineProps<{
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  retry: [];
}>();

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>

<style lang="scss" scoped>
$radius-base: 16px;
$shadow-base: 0 0 10px rgba(0, 0, 0, 0.1);
$bg-card: rgba(255, 255, 255, 0.95);
$text-primary: #333;
$text-secondary: #606266;
$text-gray: #909399;
$color-primary: #409eff;

$font-h2: 2rem;
$font-country: 1rem;
$font-temp: 4rem;
$font-feels-like: 1.1rem;
$font-description: 1.3rem;
$font-detail-label: 0.9rem;
$font-detail-value: 1.2rem;

$padding-card: 1rem;
$margin-header-bottom: 1.5rem;
$margin-temp-bottom: 0.5rem;
$gap-details: 1.5rem;
$min-height-card: 400px;

$icon-size-large: 100px;
$icon-size-small: 80px;
$icon-font-size: 2rem;

:deep(.el-card__body) {
  width: 100%;
}

.weather-container {
  width: 100%;
}

.weather-card {
  border-radius: $radius-base;
  box-shadow: $shadow-base;
  background: $bg-card;
}

.weather-content {
  padding: $padding-card;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $margin-header-bottom;

  .location {
    h2 {
      margin: 0;
      font-size: $font-h2;
      font-weight: 700;
      color: $text-primary;
    }
    .country {
      margin: 0.25rem 0 0 0;
      font-size: $font-country;
      color: $text-gray;
    }
  }
  .icon-container {
    display: flex;
    align-items: center;
  }
}

.weather-icon {
  width: $icon-size-large;
  height: $icon-size-large;
  object-fit: contain;
}

.temperature-section {
  text-align: center;
  margin: $margin-header-bottom 0;

  .main-temp {
    font-size: $font-temp;
    font-weight: 700;
    color: $color-primary;
    line-height: 1;
    margin-bottom: $margin-temp-bottom;
  }

  .feels-like {
    font-size: $font-feels-like;
    color: $text-secondary;
    margin-bottom: $margin-temp-bottom;
  }

  .description {
    font-size: $font-description;
    color: $text-primary;
  }
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: $gap-details;
  margin-top: 1rem;

  .detail-item {
    display: flex;
    align-items: center;
    gap: 1rem;

    .detail-icon {
      font-size: $icon-font-size;
      color: $color-primary;
    }

    .detail-content {
      flex: 1;

      .detail-label {
        font-size: $font-detail-label;
        color: $text-gray;
        margin-bottom: 0.25rem;
      }

      .detail-value {
        font-size: $font-detail-value;
        font-weight: 600;
        color: $text-primary;
      }
    }
  }
}

.loading-card,
.error-card,
.empty-card {
  min-height: $min-height-card;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .weather-header {
    flex-direction: column;
    align-items: center;
    text-align: center;

    .location {
      h2 {
        font-size: 1.5rem;
      }
    }
  }

  .weather-icon {
    width: $icon-size-small;
    height: $icon-size-small;
  }

  .temperature-section {
    .main-temp {
      font-size: 3rem;
    }
    .description {
      font-size: 1rem;
    }
  }

  .weather-details {
    grid-template-columns: 1fr;
    gap: 1rem;

    .detail-item {
      justify-content: flex-start;
    }
  }
}
</style>
