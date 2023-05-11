import consola from 'consola'

export async function safetyRun(fn: (...args: any[]) => Promise<unknown>) {
  try {
    await fn()
  }
  catch (error) {
    consola.error('[Effso] Error:', error)
  }
}
