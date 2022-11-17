import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

import { ParseError } from 'rail-id'

import { AppError } from '../App'


type Props = {
  error: AppError
}

function ErrorPanel({ error }: Props) {
  if (!error || error.incompleteInput) return (<></>)

  let msg = 'Something went wrong, please try again!'
  let opacity = '1'
  if (error !== 'unknown') {
    const pe = error as ParseError
    msg = pe.friendlyMessage
  }

  return (
    <div className="error-msg" style={{ opacity }}>
      <div className="gutter">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </div>
      <div>{msg}</div>
    </div>)
}

export default ErrorPanel