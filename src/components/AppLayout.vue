<script setup lang="ts">
import { ref } from 'vue'
import { Menu, Bell } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'
import type { User, Page } from '../types'

const props = defineProps<{ user: User; currentPage: Page }>()
const emit = defineEmits<{ navigate: [page: Page]; logout: [] }>()

const mobileOpen = ref(false)

const pageTitles: Record<Page, string> = {
  dashboard: 'ESG Dashboard',
  'esg-report': 'AI ESG Report',
  'token-monitoring': 'Token Monitoring',
  'transfer-ownership': 'Smart Contract Transfer',
  'transaction-history': 'Transaction History',
  'collect-farm-data': 'Collect Farm Data',
}
</script>

<template>
  <div class="min-h-screen bg-cream flex">
    <Sidebar
      :user="user" :current-page="currentPage" :is-mobile-open="mobileOpen"
      @navigate="p => { emit('navigate', p); mobileOpen = false }"
      @logout="emit('logout')" @close-mobile="mobileOpen = false"
    />
    <div class="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
        <div class="flex items-center">
          <button @click="mobileOpen = true" class="md:hidden p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-700">
            <Menu class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-semibold text-gray-900">{{ pageTitles[currentPage] }}</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-2 text-gray-400 hover:text-farm-600 transition-colors relative">
            <Bell class="w-5 h-5" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
          </button>
          <div class="hidden sm:block text-sm text-right">
            <p class="font-medium text-gray-900">{{ user.entityName }}</p>
            <p class="text-gray-500 text-xs">Verified Entity</p>
          </div>
        </div>
      </header>
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div class="max-w-7xl mx-auto"><slot /></div>
      </main>
    </div>
  </div>
</template>
