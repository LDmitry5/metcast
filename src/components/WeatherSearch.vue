<template>
  <div class="search-container">
    <el-card class="search-card">
      <el-input
        v-model="cityInput"
        ref="searchInput"
        placeholder="Введите название города"
        size="large"
        clearable
        @keyup.enter="handleSearch">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";

const searchInput = ref<HTMLInputElement | null>(null);
defineExpose({ focus: () => searchInput.value?.focus() });

const emit = defineEmits<{
  search: [city: string];
}>();

const cityInput = ref("");
const handleSearch = () => {
  const city = cityInput.value.trim();
  if (city) {
    emit("search", city);
  }
};
</script>

<style scoped>
.search-card {
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}
</style>
