import { hashCode } from "../../util"

type Props = {
  footnotes: string[]
}

function FieldNotes({ footnotes }: Props) {
  if (footnotes.length > 0) {
    return (
      <div className="field-notes">
        <div>Notes:</div>
        <ul>
          { footnotes.map(f => <li className="field-note" key={hashCode(f)}>{f}</li>) }
        </ul>
      </div>)
  } else return <div />
}

export default FieldNotes