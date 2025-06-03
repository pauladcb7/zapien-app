import React from 'react'
import { Field } from 'react-final-form'
import { CFormLabel, CFormInput, CFormFeedback } from '@coreui/react'

const required = (value) => (value ? undefined : 'Required')

const TimeFields = () => (
  <>
    <Field name="timeStarted" validate={required}>
      {({ input, meta }) => (
        <div>
          <CFormLabel htmlFor="timeStarted">Time Started</CFormLabel>
          <CFormInput
            type="time"
            id="timeStarted"
            {...input}
            invalid={meta.touched && meta.error ? true : false}
          />
          {meta.touched && meta.error && (
            <CFormFeedback invalid>{meta.error}</CFormFeedback>
          )}
        </div>
      )}
    </Field>
    <Field name="timeFinished" validate={required}>
      {({ input, meta }) => (
        <div>
          <CFormLabel htmlFor="timeFinished">Time Finished</CFormLabel>
          <CFormInput
            type="time"
            id="timeFinished"
            {...input}
            invalid={meta.touched && meta.error ? true : false}
          />
          {meta.touched && meta.error && (
            <CFormFeedback invalid>{meta.error}</CFormFeedback>
          )}
        </div>
      )}
    </Field>
  </>
)

export default TimeFields