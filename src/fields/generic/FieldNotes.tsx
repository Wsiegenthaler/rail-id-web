import { hashCode } from "../../util"

type Props = {
  footnotes: string[]
}

function FieldNotes({ footnotes }: Props) {
  const notes = footnotes.map(n => n.trim()).filter(n => n.length > 0)
  return (
    (notes.length > 0) ?
      <div className="field-notes">
        <ul>
          { notes.map(f => <li className="field-note" key={hashCode(f)}>{f}</li>) }
        </ul>
      </div> :
      <></>)
}

export default FieldNotes