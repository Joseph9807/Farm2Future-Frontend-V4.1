<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search, Calendar } from 'lucide-vue-next'
import Badge from '../components/Badge.vue'
import { getTransactions, ApiClientError } from '@/api'
import type { Transaction } from '@/types/api'

const transactions = ref<Transaction[]>([])
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)
const search = ref('')
const currentPage = ref(1)
const pageSize = 20
const totalItems = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)))
const showingFrom = computed(() => transactions.value.length ? (currentPage.value - 1) * pageSize + 1 : 0)
const showingTo = computed(() => Math.min(currentPage.value * pageSize, totalItems.value))

async function loadTransactions() {
  isLoading.value = true
  errorMsg.value = null
  try {
    const res = await getTransactions({ page: currentPage.value, size: pageSize, search: search.value || undefined })
    transactions.value = res.items
    totalItems.value = res.total
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : 'Failed to load transactions.'
  } finally {
    isLoading.value = false
  }
}

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value || p === currentPage.value) return
  currentPage.value = p
  loadTransactions()
}

onMounted(loadTransactions)
watch(search, () => { currentPage.value = 1; loadTransactions() })
</script>

<template>
  <div class="space-y-6">
    <div class="card p-4 flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search class="h-5 w-5 text-gray-400" /></div>
        <input type="text" class="input-field pl-10" placeholder="Search by ID, Token, or Actor..." v-model="search" />
      </div>
      <div class="relative w-full sm:w-48">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar class="h-5 w-5 text-gray-400" /></div>
        <input type="date" class="input-field pl-10 text-gray-500" />
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="txn in transactions" :key="txn.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ txn.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-farm-600">{{ txn.token }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ txn.from }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ txn.to }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ txn.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap"><Badge :label="txn.status.charAt(0).toUpperCase()+txn.status.slice(1)" :variant="txn.status" /></td>
            </tr>
            <tr v-if="transactions.length===0"><td colspan="6" class="px-6 py-12 text-center text-gray-500">No transactions found.</td></tr>
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
