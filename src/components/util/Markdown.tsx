import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { some } from 'lodash-es'

import ReactMarkdown, { uriTransformer } from 'react-markdown'


type Props = {
  md: string
}

const cleanUri = (uri: string) =>
  [ uri.trim() ]
    .map(u => some(['https://', 'http://'], prefix => u.startsWith(prefix)) ? u : `https://${u}`)
    .map(uriTransformer)
    .pop() ?? ''

function Markdown({ md }: Props) {
  return (
    <ReactMarkdown
      components={{
        // All links assumed to be external (open in new tab and include external link icon)
        a: ({ node, ...props }) => {
          // Insert external link icon after link text
          const { children, ...exceptChildren } = props
          const newProps = {
            children: (<span>{props.children}<FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>),
            ...exceptChildren
          }

          return (<a className="markdown-link" target="_blank" rel="noopener noreferrer" {...newProps} />)
        }
      }}
      transformLinkUri={cleanUri} >
      {md}
    </ReactMarkdown>)
}

export default Markdown