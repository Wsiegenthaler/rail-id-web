import { FieldElementProps } from '../components/FieldRouter'


function PlaceholderField({ field, setHighlights }: FieldElementProps) {

  return (
    <div className="placeholder-field" style={ { 'color': 'red'} }>
      <h4>NOT YET IMPLEMENTED: {field.name}</h4>
      <h6>{field.desc}</h6>
    </div>
  )
}

export default PlaceholderField