import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CFormInput,
  CFormLabel,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CModal,
  CSpinner,
  CRow,
} from '@coreui/react'
import { cilArrowBottom, cilArrowTop, cilSave, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useToasts } from 'react-toast-notifications'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { circuitHPrint } from 'src/utils/circuitPrint'
import { api } from '../../helpers/api'
import { SAVE_CIRCUIT_DIRECTORY } from '../../helpers/urls/index'

const required = (value) => (value ? undefined : 'Required')

const initialArray = Array.from({ length: 20 }, (_, index) => ({
  ckt: index + 1,
  load: '',
}))

const CircuitDirectoryHome = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const { addToast } = useToasts()

  const onSubmit = async (values) => {
    try {
      await api.post(SAVE_CIRCUIT_DIRECTORY, {
        circuit_directory_id: '-1',
        entry_date: values.date,
        circuit_type_rc: 'HOME',
        voltage: values.voltage,
        circuit_directory_details: values.circuitDirectoryDetails,
      })
      addToast('Circuit Directory Submitted.', { appearance: 'success', autoDismiss: true })
      circuitHPrint({
        date: values.date,
        voltage: values.voltage,
        rows: values.circuitDirectoryDetails,
      })
    } catch (error) {
      console.error(error)
      addToast('Error creating Circuit Directory. Try again.', {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }

  return (
    <>
      <CRow>
        <CCol xs="12">
          <Form
            onSubmit={onSubmit}
            initialValues={{
              circuitDirectoryDetails: initialArray,
            }}
            mutators={{ ...arrayMutators }}
            render={({
              handleSubmit,
              form: {
                mutators: { push },
              },
            }) => (
              <form onSubmit={handleSubmit}>
                <CCard>
                  <CCardHeader className="card-header-collapsed">
                    Circuit Directory - 240 Volt
                    <CButton onClick={() => setCollapsed(!collapsed)} style={{ color: 'white' }}>
                      <CIcon icon={collapsed ? cilArrowTop : cilArrowBottom} />
                    </CButton>
                  </CCardHeader>
                  <CCollapse visible={collapsed}>
                    <CCardBody>
                      <Field name="date" validate={required}>
                        {({ input, meta }) => (
                          <div className="mb-3">
                            <CFormLabel>Date</CFormLabel>
                            <CFormInput
                              {...input}
                              type="date"
                              invalid={meta.error && meta.touched}
                            />
                            {meta.touched && meta.error && (
                              <span className="text-danger">{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                      <Field name="voltage" validate={required}>
                        {({ input, meta }) => (
                          <div className="mb-3">
                            <CFormLabel>Voltage</CFormLabel>
                            <CFormInput
                              {...input}
                              type="text"
                              invalid={meta.error && meta.touched}
                            />
                            {meta.touched && meta.error && (
                              <span className="text-danger">{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                      <FieldArray name="circuitDirectoryDetails">
                        {({ fields }) => (
                          <>
                            <CTable className="cd-table black-red-striped" striped responsive>
                              <CTableHead>
                                <CTableRow>
                                  <CTableHeaderCell>Ckt</CTableHeaderCell>
                                  <CTableHeaderCell>Load</CTableHeaderCell>
                                </CTableRow>
                              </CTableHead>
                              <CTableBody>
                                {fields.map((name, index) => (
                                  <CTableRow key={index}>
                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                    <CTableDataCell>
                                      <Field name={`${name}.load`} validate={required}>
                                        {({ input, meta }) => (
                                          <>
                                            <CFormInput
                                              {...input}
                                              type="text"
                                              placeholder="Load"
                                              invalid={meta.error && meta.touched}
                                            />
                                            {meta.touched && meta.error && (
                                              <span className="text-danger">{meta.error}</span>
                                            )}
                                          </>
                                        )}
                                      </Field>
                                    </CTableDataCell>
                                  </CTableRow>
                                ))}
                              </CTableBody>
                            </CTable>
                            <div className="d-grid gap-2">
                              <CButton
                                color="secondary"
                                onClick={() =>
                                  push('circuitDirectoryDetails', {
                                    ckt: fields.length + 1,
                                    load: '',
                                  })
                                }
                              >
                                <CIcon icon={cilPlus} size="sm" /> Add Row
                              </CButton>
                            </div>
                          </>
                        )}
                      </FieldArray>
                    </CCardBody>
                  </CCollapse>
                  <CCardFooter className="d-grid gap-2">
                    <CButton style={{ color: 'white' }} color="success" type="submit">
                      <CIcon icon={cilSave} /> Save
                    </CButton>
                  </CCardFooter>
                </CCard>
              </form>
            )}
          />
        </CCol>
      </CRow>
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="sm">
        <CSpinner color="primary" />
      </CModal>
    </>
  )
}

export default CircuitDirectoryHome
