<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

defineProps<{
  title: string
  value: string | number
  change?: number
  colorClass?: string
}>()
</script>

<template>
  <div class="card p-6 flex flex-col animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <div :class="['p-3 rounded-full', colorClass || 'text-farm-600 bg-farm-100']">
        <slot name="icon" />
      </div>
      <div v-if="change !== undefined" :class="['flex items-center text-sm font-medium', change >= 0 ? 'text-farm-600' : 'text-red-600']">
        <TrendingUp v-if="change >= 0" class="w-4 h-4 mr-1" />
        <TrendingDown v-else class="w-4 h-4 mr-1" />
        {{ Math.abs(change) }}%
      </div>
    </div>
    <h3 class="text-gray-500 text-sm font-medium">{{ title }}</h3>
    <p class="text-3xl font-bold text-gray-900 mt-1">{{ value }}</p>
  </div>
</template>

<style scoped>
@keyframes fadeInUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
.animate-fade-in { animation: fadeInUp 0.4s ease-out both; }
</style>
