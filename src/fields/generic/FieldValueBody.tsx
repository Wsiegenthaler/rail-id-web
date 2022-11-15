import FieldNotes from './FieldNotes'

type Props = {
  desc: string
  footnotes: string[]
}

function FieldValueBody({ desc, footnotes }: Props) {

  return (
    <div className="field-value-body">
      <div className="field-desc">{desc}</div>
      <FieldNotes footnotes={footnotes} />
    </div>
  )

}

export default FieldValueBody