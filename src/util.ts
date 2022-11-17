
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