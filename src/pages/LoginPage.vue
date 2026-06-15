<script setup lang="ts">
import { ref } from 'vue'
import { Leaf, Sprout, ShoppingCart, ShieldCheck } from 'lucide-vue-next'
import { login as apiLogin, ApiClientError } from '@/api'
import type { Role, User } from '../types'

const emit = defineEmits<{ login: [user: User] }>()

const selectedRole = ref<Role>('farmer')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)

const roles: { id: Role; label: string; icon: any; desc: string }[] = [
  { id: 'farmer', label: 'Farmer', icon: Sprout, desc: 'Manage crops & data' },
  { id: 'buyer', label: 'Buyer', icon: ShoppingCart, desc: 'Purchase & monitor' },
  { id: 'regulator', label: 'Regulator', icon: ShieldCheck, desc: 'Audit & compliance' },
]

async function handleLogin(e: Event) {
  e.preventDefault()
  errorMsg.value = null
  isLoading.value = true
  try {
    const res = await apiLogin({ email: email.value, password: password.value, role: selectedRole.value })
    if (res.token) localStorage.setItem('auth_token', res.token)
    emit('login', res.user)
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-farm-50 via-cream to-earth-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-farm-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div class="absolute top-1/2 -right-24 w-96 h-96 bg-earth-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
    </div>
    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-farm-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
          <Leaf class="w-10 h-10 text-white -rotate-3" />
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">Farm2Future</h2>
      <p class="mt-2 text-center text-sm text-gray-600">AI-enabled blockchain tokenisation for ESG supply chains</p>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
        <form class="space-y-6" @submit="handleLogin">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Select your role</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="r in roles" :key="r.id" type="button"
                @click="selectedRole = r.id"
                :class="[
                  'flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all',
                  selectedRole === r.id ? 'border-farm-600 bg-farm-50 text-farm-800' : 'border-gray-200 bg-white text-gray-500 hover:border-farm-300 hover:bg-farm-50/50'
                ]"
              >
                <component :is="r.icon" :class="['w-6 h-6 mb-2', selectedRole === r.id ? 'text-farm-600' : 'text-gray-400']" />
                <span class="text-xs font-medium">{{ r.label }}</span>
              </button>
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input id="email" name="email" type="email" autocomplete="email" required v-model="email"
                class="input-field" :placeholder="`demo@${selectedRole}.com`" />
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password"
                class="input-field" placeholder="••••••••" />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-farm-600 focus:ring-farm-500 border-gray-300 rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div class="text-sm"><a href="#" class="font-medium text-farm-600 hover:text-farm-500">Forgot password?</a></div>
          </div>
          <p v-if="errorMsg" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{{ errorMsg }}</p>
          <div>
            <button type="submit" :disabled="isLoading" class="btn-primary w-full py-3 text-lg shadow-md">
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
              <span v-else>Sign in securely</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
