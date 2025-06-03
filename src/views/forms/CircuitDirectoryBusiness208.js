import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilSave, cilPlus } from '@coreui/icons'

import { Form, Field } from 'react-final-form'
import { circuitPrint } from 'src/utils/circuitPrint'
import { toast } from 'react-toastify'
import { api } from '../../helpers/api'
import { SAVE_CIRCUIT_DIRECTORY } from '../../helpers/urls/index'

const required = (value) => (value ? undefined : 'Required')

const initialArray = Array.from({ length: 43 }, (_, index) => ({
  ckt: index + 1,
  load: '',
  ckt1: index + 2,
  load1: '',
}))

const CircuitDirectoryBusiness208 = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [rows, setRows] = useState(initialArray)
  const [circuitDirectoryId, setCircuitDirectoryId] = useState('-1')
  const circuitDirectoryType = 'BUSINESS_208V'

  const handleChange = (event, index, key) => {
    const updatedRows = [...rows]
    updatedRows[index][key] = event.target.value
    setRows(updatedRows)
  }

  const onSubmit = async (values) => {
    try {
      const details = rows.map((row) => ({
        ckt: row.ckt,
        load: row.load,
        ckt1: row.ckt1,
        load1: row.load1,
      }))

      const circuitDirectoryID = await api.post(SAVE_CIRCUIT_DIRECTORY, {
        circuit_directory_id: '-1',
        entry_date: values.date,
        circuit_type_rc: circuitDirectoryType,
        voltage: values.voltage,
        circuit_directory_details: details,
      })

      setCircuitDirectoryId(circuitDirectoryID.id)

      toast.success('Circuit Directory Submitted.', { autoClose: 3000 })

      circuitPrint({
        date: values.date,
        voltage: values.voltage,
        rows,
      })
    } catch (error) {
      console.error('Error creating Circuit Directory:', error)
      toast.error('Something went wrong creating Circuit Directory. Try again.', { autoClose: 3000 })
    }
  }

  return (
    <CRow>
      <CCol xs="12" sm="12">
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <CForm onSubmit={handleSubmit}>
              <CCard>
                <CCardHeader className="card-header-collapsed">
                  Circuit Directory 208 Volt
                  <CButton onClick={() => setCollapsed(!collapsed)} style={{ color: 'white' }}>
                    <CIcon icon={collapsed ? cilArrowTop : cilArrowBottom} />
                  </CButton>
                </CCardHeader>
                <CCollapse visible={collapsed}>
                  <CCardBody>
                    <CRow>
                      <CCol sm="12">
                        <Field name="date" validate={required}>
                          {({ input, meta }) => (
                            <div>
                              <CFormLabel htmlFor="date">Date</CFormLabel>
                              <CFormInput
                                {...input}
                                type="date"
                                id="date"
                                invalid={meta.invalid && meta.touched}
                              />
                              {meta.touched && meta.error && (
                                <div className="text-danger">Please provide valid information</div>
                              )}
                            </div>
                          )}
                        </Field>

                        <Field name="voltage" validate={required}>
                          {({ input, meta }) => (
                            <div>
                              <CFormLabel htmlFor="voltage">Voltage</CFormLabel>
                              <CFormInput
                                {...input}
                                invalid={meta.invalid && meta.touched}
                                id="voltage"
                              />
                              {meta.touched && meta.error && (
                                <div className="text-danger">Please provide valid information</div>
                              )}
                            </div>
                          )}
                        </Field>

                        <CTable className="cd-table black-red-blue-striped" striped responsive>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Ckt</CTableHeaderCell>
                              <CTableHeaderCell>Load</CTableHeaderCell>
                              <CTableHeaderCell>Ckt 1</CTableHeaderCell>
                              <CTableHeaderCell>Load 1</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {rows.map((row, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{row.ckt}</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    type="text"
                                    placeholder="Load"
                                    value={row.load}
                                    onChange={(e) => handleChange(e, index, 'load')}
                                  />
                                </CTableDataCell>
                                <CTableDataCell>{row.ckt1}</CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    type="text"
                                    placeholder="Load 1"
                                    value={row.load1}
                                    onChange={(e) => handleChange(e, index, 'load1')}
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCollapse>
                <CCardFooter className="d-grid gap-2">
                  <CButton style={{ color: 'white' }} block color="success" type="submit" size="lg">
                    <CIcon size="lg" icon={cilSave} /> Save
                  </CButton>
                </CCardFooter>
              </CCard>
            </CForm>
          )}
        />
      </CCol>
    </CRow>
  )
}

export default CircuitDirectoryBusiness208