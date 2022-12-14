import { Flag64 as Flag } from '@weston/react-world-flags'
import { kebabCase } from 'lodash-es'

import { Country, ScalarFieldMeta } from 'rail-id'

import { FieldElementProps } from '../../FieldRouter'

import Highlighter from '../../util/highlight/Highlighter'
import FieldValueBody from '../generic/FieldValueBody'


function CountryField({ field }: FieldElementProps) {
  const scalar = field as ScalarFieldMeta<Country>
  const country = scalar.valueMeta.value as Country

  return (
    <div className={`field ${kebabCase(field.path)}`}>
      <div className="field-header">
        <div className="field-name">{field.name}</div>
      </div>
      <Highlighter values={[ scalar.valueMeta ]} >
        <div className="field-content">
          <div className="field-value-header">
            <div className="field-value">
              <Flag code={country.short} />
              <span className="long highlight-hint-underline">{country.long}</span>
              <span className="short">{country.short}</span>
            </div>
          </div>
          <FieldValueBody desc={scalar.valueMeta.desc} footnotes={scalar.valueMeta.footnotes} />
        </div>
      </Highlighter>
    </div>)
}

export default CountryField
