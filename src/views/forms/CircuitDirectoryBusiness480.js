import React, { useState, useEffect } from 'react'
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
  CRow,
  CTable,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilArrowBottom, cilArrowTop } from '@coreui/icons'
import { Form, Field } from 'react-final-form'
import { toast } from 'react-toastify'
import { api } from '../../helpers/api'
import { SAVE_CIRCUIT_DIRECTORY } from '../../helpers/urls/index'
import { circuitPrint } from 'src/utils/circuitPrint'

const required = (value) => (value ? undefined : 'Required')

const fieldsTable = ['ckt', 'load', 'ckt1', 'load1']
const initialArray = []
for (let index = 1; index < 43; index++) {
  const element = { ckt: index, load: '', ckt1: index + 1, load1: '' }
  initialArray.push(element)
  index++
}
initialArray.push()

const CircuitDirectoryBusiness480 = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [rows, setRows] = useState(initialArray)
  const [circuitDirectoryId, setCircuitDirectoryId] = useState('-1')
  const circuitDirectoryType = 'BUSINESS_480V'

  useEffect(() => {}, [])

  const handleChange = (event, index, field) => {
    const updatedRows = [...rows]
    updatedRows[index][field] = event.target.value
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
          validate={(values) => {
            const errors = {}
            if (!values.date) errors.date = 'Required'
            if (!values.voltage) errors.voltage = 'Required'
            return errors
          }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <CCard>
                <CCardHeader className="card-header-collapsed">
                  Circuit Directory 480 Volt
                  <CButton onClick={() => setCollapsed(!collapsed)} style={{ color: 'white' }}>
                    <CIcon icon={collapsed ? cilArrowTop : cilArrowBottom} />
                  </CButton>
                </CCardHeader>
                <CCollapse visible={collapsed} timeout={1000}>
                  <CCardBody>
                    <CRow>
                      <CCol sm="12">
                        <Field name="date" validate={required}>
                          {({ input, meta }) => (
                            <div className="mb-3">
                              <CFormLabel htmlFor="date">Date</CFormLabel>
                              <CFormInput
                                {...input}
                                type="date"
                                id="date"
                                invalid={meta.touched && meta.error}
                              />
                              {meta.touched && meta.error && (
                                <CFormFeedback invalid>{meta.error}</CFormFeedback>
                              )}
                            </div>
                          )}
                        </Field>

                        <Field name="voltage" validate={required}>
                          {({ input, meta }) => (
                            <div className="mb-3">
                              <CFormLabel htmlFor="voltage">Voltage</CFormLabel>
                              <CFormInput
                                {...input}
                                id="voltage"
                                invalid={meta.touched && meta.error}
                              />
                              {meta.touched && meta.error && (
                                <CFormFeedback invalid>{meta.error}</CFormFeedback>
                              )}
                            </div>
                          )}
                        </Field>

                        <CTable responsive striped className="cd-table brown-orange-yellow-striped">
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
            </form>
          )}
        />
      </CCol>
    </CRow>
  )
}

export default CircuitDirectoryBusiness480