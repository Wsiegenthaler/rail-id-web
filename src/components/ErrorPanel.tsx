import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

import { ParseError } from 'rail-id'


type Props = {
  error?: ParseError
}

function ErrorPanel({ error }: Props) {
  if (!error || error.incompleteInput) return (<></>)

  return (
    <div className="error-msg">
      <div className="gutter">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </div>
      <div>
        {error.friendlyMessage}
      </div>
    </div>)
}

export default ErrorPanel