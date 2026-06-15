<script setup lang="ts">
import { ref } from 'vue'
import { Sprout, Wifi, Droplets, Thermometer, Wind, FlaskConical, CheckCircle } from 'lucide-vue-next'
import { submitFarmData, ApiClientError } from '@/api'

const isSubmitting = ref(false)
const showSuccess = ref(false)
const errorMsg = ref<string | null>(null)
const lastTxHash = ref<string | null>(null)

async function handleSubmit(e: Event) {
  e.preventDefault()
  errorMsg.value = null
  isSubmitting.value = true
  const form = e.target as HTMLFormElement
  const fd = new FormData(form)
  try {
    const res = await submitFarmData({
      farm_id: 'farm_001',
      batch: {
        crop_type: (fd.get('cropType') as string) || 'Wheat',
        date: (fd.get('date') as string) || new Date().toISOString().split('T')[0],
        yield_kg: Number(fd.get('yieldKg') ?? 0),
        water_usage_l: Number(fd.get('waterUsageL') ?? 0),
        fertiliser_type: (fd.get('fertiliserType') as string) || 'None',
        fertiliser_usage_kg: Number(fd.get('fertiliserUsageKg') ?? 0),
      },
      iot_snapshot: {
        soil_moisture_pct: 42,
        temperature_c: 24,
        humidity_pct: 68,
        ph_level: 6.5,
      },
    })
    lastTxHash.value = res.tx_hash
    showSuccess.value = true
    setTimeout(() => showSuccess.value = false, 4000)
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : 'Submission failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6 relative">
    <Transition name="slide">
      <div v-if="showSuccess" class="absolute top-0 right-0 z-50 bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg shadow-lg flex items-center">
        <CheckCircle class="w-5 h-5 mr-2" /> Data successfully cleaned and stored on-chain.
      </div>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Manual Data Entry -->
      <div class="card p-6 lg:col-span-2">
        <div class="flex items-center mb-6">
          <div class="p-2 bg-farm-100 rounded-lg mr-3"><Sprout class="w-6 h-6 text-farm-700" /></div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Manual Data Entry</h2>
            <p class="text-sm text-gray-500">Log batch details for ESG compliance</p>
          </div>
        </div>
        <form @submit="handleSubmit" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              <select name="cropType" class="input-field" required>
                <option value="">Select crop...</option>
                <option>Wheat</option><option>Rice</option><option>Corn</option><option>Soybeans</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" class="input-field" required :value="new Date().toISOString().split('T')[0]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Yield (kg)</label>
              <input type="number" name="yieldKg" class="input-field" placeholder="e.g. 2500" required min="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Water Usage (L)</label>
              <input type="number" name="waterUsageL" class="input-field" placeholder="e.g. 15000" required min="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fertiliser Type</label>
              <select name="fertiliserType" class="input-field" required>
                <option value="">Select type...</option>
                <option>Organic Compost</option><option>Synthetic NPK</option><option>Bio-fertiliser</option><option>None</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fertiliser Usage (kg)</label>
              <input type="number" name="fertiliserUsageKg" class="input-field" placeholder="e.g. 120" required min="0" />
            </div>
          </div>
          <p v-if="errorMsg" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{{ errorMsg }}</p>
          <div class="pt-4 border-t border-gray-100">
            <button type="submit" :disabled="isSubmitting" class="btn-primary w-full md:w-auto px-8">
              {{ isSubmitting ? 'Processing...' : 'Submit Data' }}
            </button>
          </div>
        </form>
      </div>

      <!-- IoT Sensors -->
      <div class="card p-0 flex flex-col h-full">
        <div class="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div class="flex items-center"><Wifi class="w-5 h-5 text-blue-500 mr-2" /><h2 class="text-lg font-bold text-gray-900">IoT Sensors</h2></div>
          <div class="flex items-center">
            <span class="relative flex h-3 w-3 mr-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span class="text-xs font-medium text-emerald-600">Live</span>
          </div>
        </div>
        <div class="p-6 flex-1 space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center"><div class="p-2 bg-blue-50 rounded-lg mr-3"><Droplets class="w-5 h-5 text-blue-500" /></div><div><p class="text-sm font-medium text-gray-500">Soil Moisture</p><p class="text-xs text-gray-400">Updated 2m ago</p></div></div>
            <p class="text-xl font-bold text-gray-900">42%</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center"><div class="p-2 bg-amber-50 rounded-lg mr-3"><Thermometer class="w-5 h-5 text-amber-500" /></div><div><p class="text-sm font-medium text-gray-500">Temperature</p><p class="text-xs text-gray-400">Updated 2m ago</p></div></div>
            <p class="text-xl font-bold text-gray-900">24°C</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center"><div class="p-2 bg-cyan-50 rounded-lg mr-3"><Wind class="w-5 h-5 text-cyan-500" /></div><div><p class="text-sm font-medium text-gray-500">Humidity</p><p class="text-xs text-gray-400">Updated 5m ago</p></div></div>
            <p class="text-xl font-bold text-gray-900">68%</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center"><div class="p-2 bg-purple-50 rounded-lg mr-3"><FlaskConical class="w-5 h-5 text-purple-500" /></div><div><p class="text-sm font-medium text-gray-500">pH Level</p><p class="text-xs text-gray-400">Updated 1h ago</p></div></div>
            <p class="text-xl font-bold text-gray-900">6.5</p>
          </div>
        </div>
        <div class="p-4 bg-gray-50 border-t border-gray-100 text-xs text-center text-gray-500">Sensor data is automatically appended to manual submissions.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
