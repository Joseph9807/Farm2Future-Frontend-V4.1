<script setup lang="ts">
import { ref, markRaw } from 'vue'
import type { User, Page } from './types'
import LoginPage from './pages/LoginPage.vue'
import DashboardPage from './pages/DashboardPage.vue'
import ESGReportPage from './pages/ESGReportPage.vue'
import TokenMonitoringPage from './pages/TokenMonitoringPage.vue'
import TransferOwnershipPage from './pages/TransferOwnershipPage.vue'
import TransactionHistoryPage from './pages/TransactionHistoryPage.vue'
import CollectFarmDataPage from './pages/CollectFarmDataPage.vue'
import AppLayout from './components/AppLayout.vue'

const pageMap: Record<Page, any> = {
  dashboard: markRaw(DashboardPage),
  'esg-report': markRaw(ESGReportPage),
  'token-monitoring': markRaw(TokenMonitoringPage),
  'transfer-ownership': markRaw(TransferOwnershipPage),
  'transaction-history': markRaw(TransactionHistoryPage),
  'collect-farm-data': markRaw(CollectFarmDataPage),
}

const user = ref<User | null>(null)
const currentPage = ref<Page>('dashboard')

function handleLogin(loggedInUser: User) {
  user.value = loggedInUser
  currentPage.value = 'dashboard'
}

function handleLogout() {
  user.value = null
}
</script>

<template>
  <LoginPage v-if="!user" @login="handleLogin" />
  <AppLayout
    v-else
    :user="user"
    :current-page="currentPage"
    @navigate="(p: Page) => currentPage = p"
    @logout="handleLogout"
  >
    <component :is="pageMap[currentPage]" :user="user" :on-navigate="(p: Page) => currentPage = p" />
  </AppLayout>
</template>
