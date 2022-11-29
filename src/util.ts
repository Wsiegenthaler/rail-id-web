import { isArray, isString, some } from "lodash-es"
import { AppError } from "./App"

export const hashCode = (str: string) =>
  str.split('').reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)


export type ScrollTarget =
  'none' |
  'top' |
  { type: 'element', element?: HTMLElement | null }

export const scrollTo = (target: ScrollTarget) => {
  if (target === 'none') return
  if (target === 'top') window.scrollTo({ top: 0 })
  else if (target.type === 'element' && target.element) {
    const rect = target.element.getBoundingClientRect()
    if (rect) {
      const bodyRect = document.body.getBoundingClientRect()
      const top = rect.top - bodyRect.top;
      window.scrollTo({ top })
    }
  }
}

// Whether a string is undefined or empty after trimming, or whether an array
// is undefined or empty after removing null and undefined values
export const empty = (v?: string | any[]) =>
  !v || (
    (isString(v) && (v as string).trim().length === 0) ||
    (isArray(v) && v.filter(ve => ve !== undefined && ve != null).length === 0))

// Url encoding which first cleans code and replaces spaces with '_' to improve url readability
export const urlEncodeCode = (code: string) =>
  encodeURIComponent(code.replaceAll(/\s+/g, ' ').trim().replaceAll(/\s/g, '_'))

// Url decoding which reverses `urlEncodeCode`
export const urlDecodeCode = (escaped: string) =>
  decodeURIComponent(escaped).replaceAll(/_/g, ' ')

// Determines whether an error should be displayed to user (included 'none')
export const isBenign = (error: AppError) => (error.type === 'none' || error.type === 'parse-error' && error.ref.incompleteInput)

export const demoCodes = [
  '91 85 4605 205-4 CH-BLS',
  'CH-BOB 73 85 5432 123-7',
  'CH-BLS 99859432.123-9',
  'AT-OBB 9181 1116 079-5'
]

export const randomDemoCode = () => demoCodes[Math.round(Math.random()*demoCodes.length)]