import consola from 'consola'

export const safetyRun = async (fn: (...args: any[]) => Promise<unknown>) => {
  try {
    await fn()
  }
  catch (error) {
    consola.error('[Effso] Error:', error)
  }
}
