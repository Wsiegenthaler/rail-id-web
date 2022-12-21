import { isArray, isString } from 'lodash-es'
import { AppError } from './App'

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

// Returns `true` when a string is blank after trimming whitespace, `false` otherwise
export const emptyString = (v: string) => (v as string).trim().length === 0

// Returns `true` when an array is blank after removing `null` and `undefined` values, `false` otherwise
export const emptyArray = (v: any[]) => v.filter(ve => ve !== undefined && ve != null).length === 0

// Returns `true` when value `v` is any of the following:
// * `undefined`
// * A string and is blank after trimming whitespace
// * An array and is blank after removing `null` and `undefined` values
export const empty = (v?: string | any[]) =>
  !v || (isString(v) && emptyString(v)) || (isArray(v) && emptyArray(v))

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
  'AT-OBB 9181 1116 079-5',
  '73 CH-SBB 857 89 0 987 - 6',
  'H-START 94 55 3815 019-0',
  'CZ-EARTH 99 54 9616 003-8',
  'FR-EEX 99 87 9975 013-3'
]

export const randomDemoCode = () => demoCodes[Math.floor(Math.random()*demoCodes.length)]