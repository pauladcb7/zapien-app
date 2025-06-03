import React from 'react'
import { Field } from 'react-final-form'
import { CFormLabel } from '@coreui/react'
import ESignature from 'src/components/SignaturePad'

const SupervisorSignatureField = () => (
  <Field name="supervisorSignature" validate={value => value ? undefined : 'Signature required'}>
    {({ input, meta }) => (
      <div>
        <CFormLabel>Supervisor Signature</CFormLabel>
        <ESignature svg={input.value} onChange={input.onChange} />
        {meta.touched && meta.error && (
          <div style={{ color: 'red', fontSize: 12 }}>{meta.error}</div>
        )}
      </div>
    )}
  </Field>
)

export default SupervisorSignatureField