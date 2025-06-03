import React from 'react'
import { Field } from 'react-final-form'
import { CFormLabel, CFormInput, CFormFeedback } from '@coreui/react'

const required = (value) => (value ? undefined : 'Required')

const JobLocationField = () => (
  <Field name="jobLocation" validate={required}>
    {({ input, meta }) => (
      <div>
        <CFormLabel htmlFor="jobLocation">Job Location</CFormLabel>
        <CFormInput
          type="text"
          id="jobLocation"
          {...input}
          invalid={meta.touched && meta.error ? true : false}
          placeholder="Job Location"
        />
        {meta.touched && meta.error && (
          <CFormFeedback invalid>{meta.error}</CFormFeedback>
        )}
      </div>
    )}
  </Field>
)

export default JobLocationField