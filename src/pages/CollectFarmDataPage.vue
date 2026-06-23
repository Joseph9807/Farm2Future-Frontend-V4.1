<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Sprout,
  Wifi,
  Droplets,
  Thermometer,
  Wind,
  FlaskConical,
  CheckCircle,
  ShoppingBag,
  Coins,
  User,
  TrendingUp,
  Wallet,
} from 'lucide-vue-next'
import { submitFarmData, ApiClientError } from '@/api'

const isSubmitting = ref(false)
const showSuccess = ref(false)
const errorMsg = ref<string | null>(null)
const lastTxHash = ref<string | null>(null)

// Reactive values for the new required sales/cost fields (v4.1).
// Used both for submit and for the live revenue/profit preview.
const saleQuantityKg = ref<number | null>(null)
const saleUnitPriceRm = ref<number | null>(null)
const buyerName = ref('')
const seedCostRm = ref<number | null>(null)
const fertiliserCostRm = ref<number | null>(null)

// Live financial preview — revenue is only valid when both sale fields
// have a positive value; cost preview is independent.
const expectedRevenue = computed(() => {
  const q = Number(saleQuantityKg.value ?? 0)
  const p = Number(saleUnitPriceRm.value ?? 0)
  return Number.isFinite(q * p) ? q * p : 0
})
const totalCosts = computed(() => {
  const s = Number(seedCostRm.value ?? 0)
  const f = Number(fertiliserCostRm.value ?? 0)
  return Number.isFinite(s + f) ? s + f : 0
})
const expectedProfit = computed(() => expectedRevenue.value - totalCosts.value)
const showFinancialPreview = computed(
  () => saleQuantityKg.value !== null && saleUnitPriceRm.value !== null
)
const profitIsNegative = computed(() => expectedProfit.value < 0)

const formatRm = (n: number) =>
  new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0)

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
        // --- Required sales/cost fields (v4.1) ---
        // All five are required inputs; browser validation already blocked
        // empty submissions, so we can send them unconditionally here.
        sale_quantity_kg: Number(saleQuantityKg.value ?? 0),
        sale_unit_price_rm: Number(saleUnitPriceRm.value ?? 0),
        buyer_name: buyerName.value.trim(),
        seed_cost_rm: Number(seedCostRm.value ?? 0),
        fertiliser_cost_rm: Number(fertiliserCostRm.value ?? 0),
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
    setTimeout(() => (showSuccess.value = false), 4000)
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
      <div
        v-if="showSuccess"
        class="absolute top-0 right-0 z-50 bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg shadow-lg flex items-center"
      >
        <CheckCircle class="w-5 h-5 mr-2" />
        Data successfully cleaned and stored on-chain.
      </div>
    </Transition>

    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-farm-900">Collect Farm Data</h1>
        <p class="text-sm text-gray-500 mt-1">
          Log today's batch — environmental metrics, yield, sales and input costs.
        </p>
      </div>
      <div class="hidden md:flex items-center text-xs text-gray-400">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
        Auto-saved as you type
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Manual Data Entry (spans 2 columns on lg) -->
      <div class="card p-6 lg:col-span-2">
        <div class="flex items-center mb-6">
          <div class="p-2 bg-farm-100 rounded-lg mr-3">
            <Sprout class="w-6 h-6 text-farm-700" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Batch Data Entry</h2>
            <p class="text-sm text-gray-500">
              Log batch details for ESG compliance, traceability and fair-income tracking
            </p>
          </div>
        </div>

        <form @submit="handleSubmit" class="space-y-8">
          <!-- Section: Production -->
          <section>
            <div class="flex items-center mb-4">
              <span class="text-xs font-semibold tracking-wider text-farm-700 uppercase">
                Production
              </span>
              <span class="flex-1 ml-3 border-t border-gray-200"></span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <select name="cropType" class="input-field" required>
                  <option value="">Select crop...</option>
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Corn</option>
                  <option>Soybeans</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  class="input-field"
                  required
                  :value="new Date().toISOString().split('T')[0]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Yield (kg)</label>
                <input
                  type="number"
                  name="yieldKg"
                  class="input-field"
                  placeholder="e.g. 2500"
                  required
                  min="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Water Usage (L)</label>
                <input
                  type="number"
                  name="waterUsageL"
                  class="input-field"
                  placeholder="e.g. 15000"
                  required
                  min="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fertiliser Type</label>
                <select name="fertiliserType" class="input-field" required>
                  <option value="">Select type...</option>
                  <option>Organic Compost</option>
                  <option>Synthetic NPK</option>
                  <option>Bio-fertiliser</option>
                  <option>None</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Fertiliser Usage (kg)
                </label>
                <input
                  type="number"
                  name="fertiliserUsageKg"
                  class="input-field"
                  placeholder="e.g. 120"
                  required
                  min="0"
                />
              </div>
            </div>
          </section>

          <!-- Section: Sales (NEW in v4.1, all required) -->
          <section>
            <div class="flex items-center mb-4">
              <span class="text-xs font-semibold tracking-wider text-amber-700 uppercase">
                Sales
              </span>
              <span class="flex-1 ml-3 border-t border-gray-200"></span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  <ShoppingBag class="w-4 h-4 inline -mt-0.5 mr-1 text-amber-600" />
                  Sale Quantity (kg)
                </label>
                <input
                  v-model.number="saleQuantityKg"
                  type="number"
                  class="input-field"
                  placeholder="e.g. 2000"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  <Coins class="w-4 h-4 inline -mt-0.5 mr-1 text-amber-600" />
                  Unit Price (RM/kg)
                </label>
                <input
                  v-model.number="saleUnitPriceRm"
                  type="number"
                  class="input-field"
                  placeholder="e.g. 3.50"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  <User class="w-4 h-4 inline -mt-0.5 mr-1 text-amber-600" />
                  Buyer Name
                </label>
                <input
                  v-model="buyerName"
                  type="text"
                  class="input-field"
                  placeholder="e.g. EcoFoods Corp"
                  required
                />
              </div>
            </div>
          </section>

          <!-- Section: Input Costs (NEW in v4.1, all required) -->
          <section>
            <div class="flex items-center mb-4">
              <span class="text-xs font-semibold tracking-wider text-rose-700 uppercase">
                Input Costs
              </span>
              <span class="flex-1 ml-3 border-t border-gray-200"></span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  <Wallet class="w-4 h-4 inline -mt-0.5 mr-1 text-rose-600" />
                  Seed Cost (RM)
                </label>
                <input
                  v-model.number="seedCostRm"
                  type="number"
                  class="input-field"
                  placeholder="e.g. 450.00"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  <Wallet class="w-4 h-4 inline -mt-0.5 mr-1 text-rose-600" />
                  Fertiliser Cost (RM)
                </label>
                <input
                  v-model.number="fertiliserCostRm"
                  type="number"
                  class="input-field"
                  placeholder="e.g. 280.00"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </section>

          <!-- Live preview card (only when both sale fields are present) -->
          <Transition name="fade">
            <div
              v-if="showFinancialPreview"
              class="rounded-xl border border-farm-200 bg-farm-50 p-5"
            >
              <div class="flex items-center mb-3">
                <TrendingUp class="w-5 h-5 text-farm-700 mr-2" />
                <h3 class="text-sm font-semibold text-farm-900">Live financial preview</h3>
                <span class="ml-auto text-xs text-gray-500">updates as you type</span>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Revenue</p>
                  <p class="text-lg font-bold text-gray-900">{{ formatRm(expectedRevenue) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Costs</p>
                  <p class="text-lg font-bold text-gray-900">{{ formatRm(totalCosts) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Est. Profit</p>
                  <p
                    class="text-lg font-bold"
                    :class="profitIsNegative ? 'text-red-600' : 'text-farm-700'"
                  >
                    {{ formatRm(expectedProfit) }}
                  </p>
                </div>
              </div>
              <p
                v-if="profitIsNegative"
                class="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1 inline-block"
              >
                ⚠ Costs exceed revenue for this batch.
              </p>
            </div>
          </Transition>

          <p
            v-if="errorMsg"
            class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            {{ errorMsg }}
          </p>

          <div class="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn-primary w-full md:w-auto px-8"
            >
              {{ isSubmitting ? 'Processing...' : 'Submit Data' }}
            </button>
          </div>
        </form>
      </div>

      <!-- IoT Sensors -->
      <div class="card p-0 flex flex-col h-full">
        <div
          class="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between"
        >
          <div class="flex items-center">
            <Wifi class="w-5 h-5 text-blue-500 mr-2" />
            <h2 class="text-lg font-bold text-gray-900">IoT Sensors</h2>
          </div>
          <div class="flex items-center">
            <span class="relative flex h-3 w-3 mr-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span class="text-xs font-medium text-emerald-600">Live</span>
          </div>
        </div>
        <div class="p-6 flex-1 space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-2 bg-blue-50 rounded-lg mr-3">
                <Droplets class="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Soil Moisture</p>
                <p class="text-xs text-gray-400">Updated 2m ago</p>
              </div>
            </div>
            <p class="text-xl font-bold text-gray-900">42%</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-2 bg-amber-50 rounded-lg mr-3">
                <Thermometer class="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Temperature</p>
                <p class="text-xs text-gray-400">Updated 2m ago</p>
              </div>
            </div>
            <p class="text-xl font-bold text-gray-900">24°C</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-2 bg-cyan-50 rounded-lg mr-3">
                <Wind class="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Humidity</p>
                <p class="text-xs text-gray-400">Updated 5m ago</p>
              </div>
            </div>
            <p class="text-xl font-bold text-gray-900">68%</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-2 bg-purple-50 rounded-lg mr-3">
                <FlaskConical class="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">pH Level</p>
                <p class="text-xs text-gray-400">Updated 1h ago</p>
              </div>
            </div>
            <p class="text-xl font-bold text-gray-900">6.5</p>
          </div>
        </div>
        <div
          class="p-4 bg-gray-50 border-t border-gray-100 text-xs text-center text-gray-500"
        >
          Sensor data is automatically appended to manual submissions.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>