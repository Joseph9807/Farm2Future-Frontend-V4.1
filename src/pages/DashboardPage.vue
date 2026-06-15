<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Activity, Leaf, Users, Shield, AlertTriangle, FileText, Coins, ChevronDown } from 'lucide-vue-next'
import StatCard from '../components/StatCard.vue'
import Badge from '../components/Badge.vue'
import { getDashboardOverview, ApiClientError } from '@/api'
import type { Page, User, DashboardOverviewResponse } from '@/types/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{ user: User; onNavigate: (page: Page) => void }>()

const isFarmer = props.user.role === 'farmer'
const isRegulator = props.user.role === 'regulator'

const overview = ref<DashboardOverviewResponse | null>(null)
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)
const selectedFarm = ref<string>(isFarmer ? props.user.entityName : 'All Farms')

async function loadOverview() {
  isLoading.value = true
  errorMsg.value = null
  try {
    overview.value = await getDashboardOverview({ farm: selectedFarm.value })
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : 'Failed to load dashboard.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadOverview)
watch(selectedFarm, loadOverview)

const chartData = computed(() => {
  const o = overview.value
  if (!o) return { labels: [], datasets: [] }
  return {
    labels: o.chart.labels,
    datasets: [{
      label: 'ESG Score',
      data: o.chart.values,
      borderColor: '#059669',
      backgroundColor: '#05966920',
      borderWidth: 3,
      tension: 0.3,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#059669',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
    }],
  }
})

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { color: '#6B7280', font: { size: 12 } } },
    y: { min: 60, max: 100, border: { display: false }, ticks: { color: '#6B7280', font: { size: 12 } } },
  },
}

const farms = computed(() => overview.value?.farms ?? ['All Farms'])
const filteredAlerts = computed(() => overview.value?.alerts ?? [])

const overall = computed(() => overview.value?.stats.overall ?? 0)
const env = computed(() => overview.value?.stats.environmental ?? 0)
const soc = computed(() => overview.value?.stats.social ?? 0)
const gov = computed(() => overview.value?.stats.governance ?? 0)
const changes = computed(() => overview.value?.stats.changes ?? { overall: 0, environmental: 0, social: 0, governance: 0 })
const tier = computed(() => overview.value?.tier ?? 'Good')
</script>

<template>
  <div class="space-y-6">
    <!-- Top row -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Platform Overview</h2>
        <p class="text-gray-500">Real-time ESG metrics and system health</p>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <div v-if="!isFarmer" class="relative">
          <select v-model="selectedFarm" class="input-field pr-10 text-sm min-w-[200px] appearance-none">
            <option v-for="f in farms" :key="f" :value="f">{{ f }}</option>
          </select>
          <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div class="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <span class="text-sm text-gray-500 mr-3">Current ESG Tier:</span>
          <Badge :label="tier" :variant="tier.toLowerCase() === 'excellent' ? 'excellent' : tier.toLowerCase() === 'at risk' ? 'at-risk' : 'good'" />
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Overall ESG Score" :value="`${overall}/100`" :change="changes.overall" color-class="text-farm-600 bg-farm-100">
        <template #icon><Activity class="w-6 h-6" /></template>
      </StatCard>
      <StatCard title="Environmental Score" :value="`${env}/100`" :change="changes.environmental" color-class="text-emerald-600 bg-emerald-100">
        <template #icon><Leaf class="w-6 h-6" /></template>
      </StatCard>
      <StatCard title="Social Score" :value="`${soc}/100`" :change="changes.social" color-class="text-blue-600 bg-blue-100">
        <template #icon><Users class="w-6 h-6" /></template>
      </StatCard>
      <StatCard title="Governance Score" :value="`${gov}/100`" :change="changes.governance" color-class="text-purple-600 bg-purple-100">
        <template #icon><Shield class="w-6 h-6" /></template>
      </StatCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chart -->
      <div class="card p-6 lg:col-span-2">
        <h3 class="text-lg font-bold text-gray-900 mb-6">ESG Score Trends (12 Months)</h3>
        <div class="h-72 w-full">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button @click="onNavigate('esg-report')" class="w-full btn-outline justify-start">
              <FileText class="w-5 h-5 mr-3" /> Generate AI ESG Report
            </button>
            <button v-if="isRegulator" @click="onNavigate('token-monitoring')" class="w-full btn-outline justify-start">
              <Coins class="w-5 h-5 mr-3" /> Monitor Tokens
            </button>
          </div>
        </div>

        <!-- Alerts -->
        <div class="card p-0 overflow-hidden">
          <div class="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-900 flex items-center">
              <AlertTriangle class="w-4 h-4 text-amber-500 mr-2" /> Recent Anomalies
            </h3>
            <span class="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              {{ filteredAlerts.length }} {{ filteredAlerts.length === 1 ? 'Alert' : 'Alerts' }}
            </span>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-if="filteredAlerts.length === 0" class="p-6 text-center text-sm text-gray-400">No anomalies detected.</div>
            <div v-for="alert in filteredAlerts" :key="alert.id" class="p-4">
              <div class="flex justify-between items-start mb-1">
                <p class="text-sm font-medium text-gray-900">{{ alert.title }}</p>
                <Badge :label="alert.severity === 'flagged' ? 'Flagged' : 'At Risk'" :variant="alert.severity" />
              </div>
              <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{{ alert.entity }}</span><span>{{ alert.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
