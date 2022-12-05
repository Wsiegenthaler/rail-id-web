import FieldNotes from './FieldNotes'

type Props = {
  desc: string
  footnotes: string[]
}

function FieldValueBody({ desc, footnotes }: Props) {
  const hasDesc = desc.trim()
  const notes = footnotes.map(n => n.trim()).filter(n => n.length > 0)
  return (
    (hasDesc || notes.length > 0) ?
      <div className="field-value-body">
        { hasDesc ? <div className="field-value-desc">{desc}</div> : <></> }
        <FieldNotes footnotes={notes} />
      </div> :
      <></>
  )

}

export default FieldValueBody