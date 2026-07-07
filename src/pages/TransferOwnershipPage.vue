<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusCircle, ArrowRight, CheckCircle } from 'lucide-vue-next'
import { issueToken, transferToken, getTransactions, getTokens, getFarmBatches, ApiClientError } from '@/api'
import type { Transaction, Token, FarmBatchSummary } from '@/types/api'

const isIssuing = ref(false)
const isTransferring = ref(false)
const showToast = ref<string | null>(null)
const errorMsg = ref<string | null>(null)

const recentTransfers = ref<Transaction[]>([])
const tokenOptions = ref<Token[]>([])
const batches = ref<FarmBatchSummary[]>([])
const selectedBatchId = ref('')

onMounted(async () => {
  try {
    const txnRes = await getTransactions()
    recentTransfers.value = txnRes.items
  } catch (_) { /* fallback: empty list */ }

  try {
    const tokenRes = await getTokens()
    tokenOptions.value = tokenRes.items
  } catch (_) { /* fallback: empty list */ }

  try {
    batches.value = await getFarmBatches()
  } catch (_) { /* fallback: empty list */ }
})

function showSuccessToast(msg: string) {
  showToast.value = msg
  setTimeout(() => showToast.value = null, 3000)
}

async function handleIssue(e: Event) {
  e.preventDefault()
  errorMsg.value = null
  isIssuing.value = true
  const form = e.target as HTMLFormElement
  const fd = new FormData(form)
  try {
    const res = await issueToken({
      crop_type: (fd.get('cropType') as string) || 'Wheat',
      batch_id: selectedBatchId.value,
      quantity_kg: Number(fd.get('quantityKg') ?? 0),
    })
    showSuccessToast(`Token ${res.token_id} issued successfully on-chain.`)
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : 'Token issuance failed.'
  } finally {
    isIssuing.value = false
  }
}

async function handleTransfer(e: Event) {
  e.preventDefault()
  errorMsg.value = null
  isTransferring.value = true
  const form = e.target as HTMLFormElement
  const fd = new FormData(form)
  try {
    const res = await transferToken({
      token_id: (fd.get('tokenId') as string) || '',
      new_owner_address: (fd.get('newOwnerAddress') as string) || '',
    })
    showSuccessToast(`Ownership transferred. tx: ${res.tx_hash.slice(0, 10)}…`)
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : 'Transfer failed.'
  } finally {
    isTransferring.value = false
  }
}
</script>

<template>
  <div class="space-y-6 relative">
    <Transition name="slide">
      <div v-if="showToast" class="absolute top-0 right-0 z-50 bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg shadow-lg flex items-center">
        <CheckCircle class="w-5 h-5 mr-2" /> {{ showToast }}
      </div>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Issue Token -->
      <div class="card p-6">
        <div class="flex items-center mb-6">
          <div class="p-2 bg-farm-100 rounded-lg mr-3"><PlusCircle class="w-6 h-6 text-farm-700" /></div>
          <h2 class="text-xl font-bold text-gray-900">Issue New Token</h2>
        </div>
        <form @submit="handleIssue" class="space-y-4">
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Crop Type</label><select name="cropType" class="input-field" required><option value="">Select crop...</option><option>Wheat</option><option>Rice</option><option>Corn</option><option>Soybeans</option></select></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Batch ID</label><select v-model="selectedBatchId" class="input-field" required><option value="">Select a batch...</option><option v-for="b in batches" :key="b.batch_id" :value="b.batch_id">{{ b.batch_id }} — {{ b.crop_type }} ({{ b.farm_name }}, {{ b.available_quantity_kg }} kg)</option></select></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label><input type="number" name="quantityKg" class="input-field" placeholder="e.g. 5000" required min="1" /></div>
          <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
          <button type="submit" :disabled="isIssuing" class="btn-primary w-full mt-2">{{ isIssuing ? 'Processing...' : 'Issue Token' }}</button>
        </form>
      </div>

      <!-- Transfer Ownership -->
      <div class="card p-6">
        <div class="flex items-center mb-6">
          <div class="p-2 bg-earth-100 rounded-lg mr-3"><ArrowRight class="w-6 h-6 text-earth-700" /></div>
          <h2 class="text-xl font-bold text-gray-900">Transfer Ownership</h2>
        </div>
        <form @submit="handleTransfer" class="space-y-4">
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Select Token</label><select name="tokenId" class="input-field" required><option value="">Select token...</option><option v-for="t in tokenOptions" :key="t.id" :value="t.id">{{ t.id }} ({{ t.asset }})</option></select></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Current Owner</label><input type="text" class="input-field bg-gray-50" value="Green Valley Farm (You)" disabled /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">New Owner Address / ID</label><input type="text" name="newOwnerAddress" class="input-field" placeholder="Enter blockchain address or Entity ID" required /></div>
          <button type="submit" :disabled="isTransferring" class="btn-primary w-full mt-2 bg-earth-700 hover:bg-earth-800 focus:ring-earth-600">{{ isTransferring ? 'Confirming...' : 'Confirm Transfer' }}</button>
        </form>
      </div>
    </div>

    <!-- Recent Transfers -->
    <div class="card p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Transfers</h3>
      <div class="space-y-3">
        <div v-for="txn in recentTransfers" :key="txn.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div class="flex items-center">
            <div class="bg-white p-2 rounded shadow-sm mr-4 border border-gray-200"><ArrowRight class="w-4 h-4 text-gray-400" /></div>
            <div><p class="text-sm font-medium text-gray-900">Transferred {{ txn.token }}</p><p class="text-xs text-gray-500">To: {{ txn.to }}</p></div>
          </div>
          <div class="text-right"><p class="text-sm font-medium text-gray-900">{{ txn.id }}</p><p class="text-xs text-gray-500">{{ txn.date }}</p></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>
