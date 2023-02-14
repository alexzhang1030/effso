// @ts-expect-error home-or-tmp is not typed
import hot from 'home-or-tmp'
import { resolve } from 'pathe'

export const homeOrTemp: string = hot
export const DEFAULT_TEMPLATE_PATH = resolve(homeOrTemp, './.effso')
