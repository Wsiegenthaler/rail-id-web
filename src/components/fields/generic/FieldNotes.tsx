import { hashCode } from "../../../util"

import Markdown from "../../util/Markdown"

type Props = {
  footnotes: string[]
}

function FieldNotes({ footnotes }: Props) {
  const notes = footnotes.map(n => n.trim()).filter(n => n.length > 0)

  const listContent = notes.map(f => (
    <li className="field-note" key={hashCode(f)}>
      <Markdown md={f} />
    </li>
  ))

  return (
    (notes.length > 0) ?
      <div className="field-notes">
        <ul>{ listContent }</ul>
      </div> :
      <></>)
}

export default FieldNotes