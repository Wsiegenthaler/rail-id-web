import { some } from 'lodash-es'
import { ReactNode } from 'react'

type LinkProps = {
  href: string
  className?: string
  children: ReactNode
}

function Link({ href, className, children }: LinkProps) {

  const clean = [ href.trim() ].map(h => some(['https://', 'http://'], prefix => h.startsWith(prefix)) ? h : `https://${h}`).pop() ?? ''

  return (<a href={clean} className={className} target="_blank" rel="noopener noreferrer">{children}</a>)
}

export default Link