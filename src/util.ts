import { isArray, isString } from 'lodash-es'
import { AppError } from './App'

import { RefObject, useEffect, useState } from 'react'


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
  'AT-OBB 9181 1116 079-5',
  '95 71 3 524 077-9',
  'CH-BOB 73 85 5432 123-7',
  '93 83 3400 128-7 I-TI',
  'CZ-EARTH 99 54 9616 003-8',
  'CH-BLS 99859432.123-9',
  '91 79 1 541 001-8',
  '73 CH-SBB 857 89 0 987-6',
  '94 51 2 140 849-2 PL-KD',
  'NL-NS 61 84 29-70 494-2',
  'H-START 94 55 3815 019-0',
  'SE-SJ 50 74 22-73 355-4',
  '93 75 3601 184-7 TR-TCDD',
  'FR-EEX 99 87 9975 013-3',
  '94 84 4915141-4',
  'PL-PKPIC 50 51 84-78 081-3',
  'D-TAL 51 80 84-95 024-6' // 'Bmmdz' (TODO letters)
]

// Selects random demo code
var randomDemoCodeIdx = Math.floor(Math.random()*demoCodes.length)
export const randomDemoCode = () => demoCodes[++randomDemoCodeIdx%demoCodes.length]

// Detects whether element is within visible portion of browser window
export const useOnScreen =  <E extends Element>(ref: RefObject<E>, rootMargin = "0px") => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([ entry ]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    )

    if (ref.current) observer.observe(ref.current)
    return () => { ref.current && observer.unobserve(ref.current) }
  }, [ /* onMount */ ])

  return isIntersecting
}