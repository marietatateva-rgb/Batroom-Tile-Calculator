import generateSampleData from 'invoice-repo/dist/invoice-repo-sample-data'
import type InvoiceRepo from 'invoice-repo/dist/invoice-repo'

let globalRepo: InstanceType<typeof InvoiceRepo> | null = null

export function initializeGlobalRepo(): InstanceType<typeof InvoiceRepo> {
  if (!globalRepo) {
    globalRepo = generateSampleData()
  }
  return globalRepo
}

export function getGlobalRepo(): InstanceType<typeof InvoiceRepo> {
  if (!globalRepo) {
    return initializeGlobalRepo()
  }
  return globalRepo
}

export function resetGlobalRepo(): void {
  globalRepo = null
}
