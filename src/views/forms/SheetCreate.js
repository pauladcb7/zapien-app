import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CRow,
  CFormFeedback,
  CFormLabel,
} from '@coreui/react' // Updated imports for CoreUI 5
import CIcon from '@coreui/icons-react'
import { Form, Field } from 'react-final-form'
import { circuitHPrint } from 'src/utils/circuitPrint'
import { Editor } from 'src/components/Editor'

const required = (value) => (value ? undefined : 'Required')

const initialArray = Array.from({ length: 20 }, (_, index) => ({
  ckt: index + 1,
  load: '',
}))

const SheetCreate = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [rows, setRows] = useState(initialArray)

  const onSubmit = (formData) => {
    circuitHPrint({
      date: formData.date,
      voltage: formData.voltage,
      rows,
    })
  }

  return (
    <CRow>
      <CCol xs="12">
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <CCard>
                <CCardHeader>
                  Circuit Directory
                  <div className="card-header-actions">
                    <CButton color="link" onClick={() => setCollapsed(!collapsed)}>
                      <CIcon icon="cil-arrow-top" />
                    </CButton>
                  </div>
                </CCardHeader>
                <CCollapse visible={collapsed}>
                  <CCardBody>
                    <CRow>
                      <CCol sm="12">
                        <Field name="date" validate={required}>
                          {({ input, meta }) => (
                            <div>
                              <CFormLabel htmlFor="date">Date</CFormLabel>
                              <input type="date" id="date" {...input} className="form-control" />
                              {meta.touched && meta.error && (
                                <CFormFeedback className="d-block">
                                  Please provide a valid date
                                </CFormFeedback>
                              )}
                            </div>
                          )}
                        </Field>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCollapse>
                <CCardFooter>
                  <CButton color="danger" type="submit" size="lg" block>
                    <CIcon icon="cil-save" /> Save
                  </CButton>
                </CCardFooter>
              </CCard>
            </form>
          )}
        />
      </CCol>
    </CRow>
  )
}

export default SheetCreate
