<script setup lang="ts">
import { LayoutDashboard, FileText, Coins, ArrowRightLeft, Clock, Sprout, LogOut, Leaf } from 'lucide-vue-next'
import type { Role, Page, User } from '../types'

const props = defineProps<{
  user: User
  currentPage: Page
  isMobileOpen: boolean
}>()
const emit = defineEmits<{
  navigate: [page: Page]
  logout: []
  closeMobile: []
}>()

const navItems: { id: Page; label: string; icon: any; roles: Role[] }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['farmer','buyer','regulator'] },
  { id: 'esg-report', label: 'AI ESG Report', icon: FileText, roles: ['farmer','buyer','regulator'] },
  { id: 'token-monitoring', label: 'Token Monitoring', icon: Coins, roles: ['regulator'] },
  { id: 'transfer-ownership', label: 'Transfer Ownership', icon: ArrowRightLeft, roles: ['farmer','buyer'] },
  { id: 'transaction-history', label: 'Transaction History', icon: Clock, roles: ['buyer','regulator'] },
  { id: 'collect-farm-data', label: 'Collect Farm Data', icon: Sprout, roles: ['farmer'] },
]

const filteredNav = navItems.filter(item => item.roles.includes(props.user.role))
</script>

<template>
  <!-- Mobile overlay -->
  <div v-if="isMobileOpen" class="fixed inset-0 bg-gray-900/50 z-40 md:hidden" @click="emit('closeMobile')" />

  <!-- Sidebar -->
  <div :class="[
    'fixed inset-y-0 left-0 z-50 w-64 bg-farm-900 text-white flex flex-col transition-transform duration-300 ease-in-out',
    isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  ]">
    <div class="flex items-center h-16 px-6 bg-farm-900 border-b border-farm-800">
      <Leaf class="w-6 h-6 text-farm-300 mr-2" />
      <span class="text-xl font-bold tracking-wide text-white">Farm2Future</span>
    </div>
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <button
        v-for="item in filteredNav"
        :key="item.id"
        @click="emit('navigate', item.id)"
        :class="[
          'w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
          currentPage === item.id ? 'bg-farm-800 text-white' : 'text-farm-100 hover:bg-farm-800/50 hover:text-white'
        ]"
      >
        <component :is="item.icon" :class="['w-5 h-5 mr-3', currentPage === item.id ? 'text-farm-300' : 'text-farm-200']" />
        {{ item.label }}
      </button>
    </nav>
    <div class="p-4 border-t border-farm-800 bg-farm-900">
      <div class="flex items-center mb-4 px-2">
        <div class="w-8 h-8 rounded-full bg-farm-700 flex items-center justify-center text-farm-100 font-bold">
          {{ user.name.charAt(0) }}
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-white">{{ user.name }}</p>
          <p class="text-xs text-farm-300 capitalize">{{ user.role }}</p>
        </div>
      </div>
      <button @click="emit('logout')" class="w-full flex items-center px-3 py-2 text-sm font-medium text-farm-200 rounded-lg hover:bg-farm-800 hover:text-white transition-colors">
        <LogOut class="w-5 h-5 mr-3" /> Sign out
      </button>
    </div>
  </div>
</template>
