import React from 'react'
import { Field } from 'react-final-form'
import { CFormLabel, CFormInput } from '@coreui/react'

const SafetyFields = () => (
  <>
    <Field name="safetySuggestion">
      {({ input }) => (
        <div>
          <CFormLabel htmlFor="safetySuggestion">Safety Suggestion</CFormLabel>
          <CFormInput type="text" id="safetySuggestion" {...input} />
        </div>
      )}
    </Field>
    <Field name="personalSafetyViolations">
      {({ input }) => (
        <div>
          <CFormLabel htmlFor="personalSafetyViolations">Personnel Safety Violations</CFormLabel>
          <CFormInput type="text" id="personalSafetyViolations" {...input} />
        </div>
      )}
    </Field>
  </>
)

export default SafetyFields