import { faCircle, faHandPointer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function HighlightHintDot() {

  return (
    <span className="highlight-hint-dot">
      <FontAwesomeIcon icon={faHandPointer} />
      <FontAwesomeIcon icon={faCircle} />
    </span>
  )
}

export default HighlightHintDot