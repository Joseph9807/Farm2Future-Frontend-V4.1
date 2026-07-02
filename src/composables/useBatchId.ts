import { ref } from 'vue'

/** Shared state: the latest batch_id returned by a successful farm data submission. */
const latestBatchId = ref<string | null>(null)

export function useBatchId() {
  return { latestBatchId }
}
