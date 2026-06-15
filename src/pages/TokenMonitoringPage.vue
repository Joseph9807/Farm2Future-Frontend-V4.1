<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import Badge from '../components/Badge.vue'
import { listTokens, ApiClientError } from '@/api'
import type { Token } from '@/types/api'

type Status = 'normal' | 'flagged' | 'at-risk'

const tokens = ref<Token[]>([])
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)
const filter = ref<'all' | 'normal' | 'flagged'>('all')
const search = ref('')

const filteredTokens = computed(() => tokens.value.filter(t => {
  if (filter.value === 'normal' && t.status !== 'normal') return false
  if (filter.value === 'flagged' && t.status !== 'flagged' && t.status !== 'at-risk') return false
  if (search.value) {
    const q = search.value.toLowerCase()
    if (!t.id.toLowerCase().includes(q) && !t.owner.toLowerCase().includes(q)) return false
  }
  return true
}))

const statusLabel = (s: Status) => s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')

async function loadTokens() {
  isLoading.value = true
  errorMsg.value = null
  try {
    // Status filter is applied client-side for snappy UX, but we still call
    // the API with the search term so backend filtering kicks in when wired up.
    tokens.value = await listTokens({ search: search.value || undefined })
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : 'Failed to load tokens.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadTokens)
watch(search, () => { loadTokens() })
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
            <tr v-for="token in filteredTokens" :key="token.id" :class="token.status==='flagged'?'bg-red-50/50':'hover:bg-gray-50'">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-farm-700">{{ token.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ token.asset }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ token.owner }}</td>
              <td class="px-6 py-4 whitespace-nowrap"><Badge :label="statusLabel(token.status)" :variant="token.status" /></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ token.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button class="text-farm-600 hover:text-farm-900">View Details</button></td>
            </tr>
            <tr v-if="filteredTokens.length===0"><td colspan="6" class="px-6 py-12 text-center text-gray-500">No tokens found.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
        <p class="text-sm text-gray-700">Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredTokens.length }}</span> of <span class="font-medium">{{ filteredTokens.length }}</span> results</p>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Previous</button>
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-farm-50 text-sm font-medium text-farm-600">1</button>
          <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Next</button>
        </nav>
      </div>
    </div>
  </div>
</template>
