<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import Badge from '../components/Badge.vue'
import { getTokens, ApiClientError } from '@/api'
import type { Token } from '@/types/api'

type Status = 'normal' | 'flagged' | 'at-risk'

const tokens = ref<Token[]>([])
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)
const filter = ref<'all' | 'normal' | 'flagged'>('all')
const search = ref('')
const currentPage = ref(1)
const pageSize = 20
const totalItems = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)))
const showingFrom = computed(() => tokens.value.length ? (currentPage.value - 1) * pageSize + 1 : 0)
const showingTo = computed(() => Math.min(currentPage.value * pageSize, totalItems.value))

const statusLabel = (s: Status) => s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')

async function loadTokens() {
  isLoading.value = true
  errorMsg.value = null
  try {
    const res = await getTokens({
      page: currentPage.value,
      size: pageSize,
      status: filter.value,
      search: search.value || undefined,
    })
    tokens.value = res.items
    totalItems.value = res.total
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : 'Failed to load tokens.'
  } finally {
    isLoading.value = false
  }
}

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value || p === currentPage.value) return
  currentPage.value = p
  loadTokens()
}

onMounted(loadTokens)
watch([search, filter], () => { currentPage.value = 1; loadTokens() })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="relative w-full sm:w-64">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search class="h-5 w-5 text-gray-400" /></div>
        <input type="text" class="input-field pl-10" placeholder="Search tokens or owners..." v-model="search" />
      </div>
      <div class="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <button @click="filter='all'" :class="['px-4 py-1.5 text-sm font-medium rounded-md transition-colors', filter==='all'?'bg-farm-100 text-farm-800':'text-gray-500 hover:text-gray-700']">All Tokens</button>
        <button @click="filter='normal'" :class="['px-4 py-1.5 text-sm font-medium rounded-md transition-colors', filter==='normal'?'bg-gray-100 text-gray-800':'text-gray-500 hover:text-gray-700']">Normal</button>
        <button @click="filter='flagged'" :class="['px-4 py-1.5 text-sm font-medium rounded-md transition-colors', filter==='flagged'?'bg-red-100 text-red-800':'text-gray-500 hover:text-gray-700']">Flagged</button>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Owner</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESG Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="token in tokens" :key="token.id" :class="token.status==='flagged'?'bg-red-50/50':'hover:bg-gray-50'">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-farm-700">{{ token.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ token.asset }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ token.owner }}</td>
              <td class="px-6 py-4 whitespace-nowrap"><Badge :label="statusLabel(token.status)" :variant="token.status" /></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ token.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button class="text-farm-600 hover:text-farm-900">View Details</button></td>
            </tr>
            <tr v-if="tokens.length===0"><td colspan="6" class="px-6 py-12 text-center text-gray-500">No tokens found.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
        <p class="text-sm text-gray-700">Showing <span class="font-medium">{{ showingFrom }}</span> to <span class="font-medium">{{ showingTo }}</span> of <span class="font-medium">{{ totalItems }}</span> results</p>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-farm-50 text-sm font-medium text-farm-600">{{ currentPage }}</button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </nav>
      </div>
    </div>
  </div>
</template>
