<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Download, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-vue-next'
import { generateESGReport, exportESGReport, getDashboardOverview, ApiClientError } from '@/api'
import type { User, ESGReportResponse, ReportFormat, ESGRiskFlag, ESGReportScore } from '@/types/api'

const props = defineProps<{ user: User }>()
const isFarmer = props.user.role === 'farmer'
const isGenerating = ref(false)
const isExporting = ref<ReportFormat | null>(null)
const showReport = ref(false)
const errorMsg = ref<string | null>(null)
const report = ref<ESGReportResponse | null>(null)
const farmOptions = ref<string[]>([])

// Default date range: current month
const now = new Date()
const y = now.getFullYear()
const m = String(now.getMonth() + 1).padStart(2, '0')
const lastDay = new Date(y, now.getMonth() + 1, 0).getDate()
const defaultFrom = `${y}-${m}-01`
const defaultTo = `${y}-${m}-${String(lastDay).padStart(2, '0')}`

async function loadReport() {
  isGenerating.value = true
  errorMsg.value = null
  const form = document.querySelector<HTMLFormElement>('form.esg-filters')
  const fd = form ? new FormData(form) : new FormData()
  try {
    const res = await generateESGReport({
      from: (fd.get('from') as string) || defaultFrom,
      to: (fd.get('to') as string) || defaultTo,
      entity: isFarmer ? props.user.entityName : ((fd.get('entity') as string) || 'All Entities'),
    })
    report.value = res
    syncDerivedState()
    showReport.value = true
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : 'Failed to generate report.'
  } finally {
    isGenerating.value = false
  }
}

async function handleExport(format: ReportFormat) {
  if (!report.value) return
  isExporting.value = format
  try {
    const res = await exportESGReport(format, {
      from: report.value.period.from,
      to: report.value.period.to,
      entity: report.value.entity,
    })
    // In mock mode this returns a data: URL; in real mode it's a presigned S3 link.
    window.open(res.download_url, '_blank')
  } catch (err) {
    errorMsg.value = err instanceof ApiClientError ? err.message : `Failed to export ${format}.`
  } finally {
    isExporting.value = null
  }
}

onMounted(() => { loadReport(); loadFarmOptions() })

async function loadFarmOptions() {
  try {
    const res = await getDashboardOverview()
    farmOptions.value = res.farms.filter(f => f !== 'All Farms')
  } catch (_) { /* fallback: empty list */ }
}

// Build template-friendly arrays from the API response so the existing
// template (which references scoreItems / riskFlags) keeps working.
const scoreItems = ref<{ label: string; score: number; textClass: string; bgClass: string; note: string }[]>([])
const riskFlags = ref<ESGRiskFlag[]>([])

const scoreClassFor = (label: string) => {
  if (label.startsWith('Environmental')) return { text: 'text-sm font-bold text-emerald-600', bg: 'bg-emerald-500 h-2.5 rounded-full' }
  if (label.startsWith('Social'))        return { text: 'text-sm font-bold text-blue-600',    bg: 'bg-blue-500 h-2.5 rounded-full' }
  return                                       { text: 'text-sm font-bold text-purple-600',  bg: 'bg-purple-500 h-2.5 rounded-full' }
}

function syncDerivedState() {
  if (!report.value) { scoreItems.value = []; riskFlags.value = []; return }
  scoreItems.value = (report.value.scores as ESGReportScore[]).map(s => ({ label: s.label, score: s.score, note: s.note, ...scoreClassFor(s.label) }))
  riskFlags.value = report.value.risk_flags
}
</script>

<template>
  <div class="space-y-6">
    <!-- Filters -->
    <form class="esg-filters card p-6" @submit.prevent="loadReport">
      <div class="flex flex-col md:flex-row md:items-end gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div class="flex items-center space-x-2">
            <input type="date" name="from" class="input-field" :value="defaultFrom" />
            <span class="text-gray-500">to</span>
            <input type="date" name="to" class="input-field" :value="defaultTo" />
          </div>
        </div>
        <div v-if="!isFarmer" class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Farm / Entity</label>
          <select name="entity" class="input-field">
            <option>All Entities</option><option v-for="f in farmOptions" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>
        <div class="w-full md:w-auto">
          <button type="submit" :disabled="isGenerating" class="btn-primary w-full md:w-auto">
            <span v-if="isGenerating">Generating...</span>
            <span v-else class="flex items-center"><Sparkles class="w-4 h-4 mr-2" /> Generate AI Report</span>
          </button>
        </div>
      </div>
    </form>
    <p v-if="errorMsg" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{{ errorMsg }}</p>

    <!-- Report Preview -->
    <div v-if="showReport" class="card overflow-hidden">
      <div class="border-b border-gray-200 bg-gray-50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center">
          <div class="p-3 bg-farm-100 rounded-lg mr-4"><FileText class="w-6 h-6 text-farm-700" /></div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">AI ESG Report</h2>
            <p class="text-sm text-gray-500">{{ report?.period?.from ?? defaultFrom }} - {{ report?.period?.to ?? defaultTo }} • {{ isFarmer ? user.entityName : (report?.entity ?? 'All Entities') }}</p>
          </div>
        </div>
        <div class="flex space-x-3">
          <button @click="handleExport('CSV')" :disabled="isExporting !== null" class="btn-outline py-1.5 px-3 text-sm"><Download class="w-4 h-4 mr-2" /> {{ isExporting === 'CSV' ? 'Exporting...' : 'CSV' }}</button>
          <button @click="handleExport('PDF')" :disabled="isExporting !== null" class="btn-outline py-1.5 px-3 text-sm"><Download class="w-4 h-4 mr-2" /> {{ isExporting === 'PDF' ? 'Exporting...' : 'PDF' }}</button>
        </div>
      </div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-6">Score Breakdown</h3>
          <div class="space-y-6">
            <div v-for="item in scoreItems" :key="item.label">
              <div class="flex justify-between mb-1"><span class="text-sm font-medium text-gray-700">{{ item.label }}</span><span :class="item.textClass">{{ item.score }}/100</span></div>
              <div class="w-full bg-gray-200 rounded-full h-2.5"><div :class="item.bgClass" :style="{ width: item.score + '%' }"></div></div>
              <p class="text-xs text-gray-500 mt-1">{{ item.note }}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-6">Risk Flags & Highlights</h3>
          <ul class="space-y-4">
            <li v-for="(flag, i) in riskFlags" :key="i" :class="[
              'flex items-start p-3 rounded-lg border',
              flag.type === 'success' ? 'bg-emerald-50 border-emerald-100' : flag.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'
            ]">
              <CheckCircle v-if="flag.type === 'success'" class="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
              <AlertCircle v-else :class="['w-5 h-5 mr-3 mt-0.5 flex-shrink-0', flag.type === 'warning' ? 'text-amber-500' : 'text-red-500']" />
              <div>
                <p :class="['text-sm font-medium', flag.type === 'success' ? 'text-emerald-900' : flag.type === 'warning' ? 'text-amber-900' : 'text-red-900']">{{ flag.title }}</p>
                <p :class="['text-xs mt-0.5', flag.type === 'success' ? 'text-emerald-700' : flag.type === 'warning' ? 'text-amber-700' : 'text-red-700']">{{ flag.desc }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
