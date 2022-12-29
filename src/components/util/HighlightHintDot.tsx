import { faCircle, faHandPointer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HighlightZone from './HighlightZone'


function HighlightHintDot() {
  return (
    <HighlightZone>
      <span className="highlight-hint-dot">
        <FontAwesomeIcon icon={faHandPointer} />
        <FontAwesomeIcon icon={faCircle} />
      </span>
    </HighlightZone>
  )
}

export default HighlightHintDot