import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

import { AppError } from '../App'


type Props = {
  error: AppError
}

function ErrorPanel({ error }: Props) {
  if (error.type === 'none')
    return (<></>)
  if (error.type === 'parse-error' && error.ref.incompleteInput)
    return (<></>)

  let msg = 'Something went wrong, please try again!'
  if (error.type === 'parse-error')
    msg = error.ref.friendlyMessage

  return (
    <div className="error-msg fade-in">
      <div className="error-icon">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </div>
      <div>{msg}</div>
    </div>)
}

export default ErrorPanel