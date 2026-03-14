import es from './es.json'
import en from './en.json'
import { Lang } from '@/lib/types'

const dictionaries = { es, en }

export function getDictionary(lang: Lang) {
  return dictionaries[lang] ?? dictionaries.es
}

export function t(dict: ReturnType<typeof getDictionary>, path: string, vars?: Record<string, string | number>): string {
  const keys = path.split('.')
  let result: unknown = dict
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  if (typeof result !== 'string') return path
  if (vars) {
    return Object.entries(vars).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, String(v)),
      result
    )
  }
  return result
}
