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
  CSpinner,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilSave, cilPlus } from '@coreui/icons'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { circuitPrint } from 'src/utils/circuitPrint'

const required = (value) => (value ? undefined : 'Required')

const initialArray = []
for (let index = 1; index < 43; index++) {
  const element = { ckt: index, load: '', ckt1: index + 1, load1: '' }
  initialArray.push(element)
  index++
}
initialArray.push()

const CircuitDirectoryBusiness = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [rows, setRows] = useState(initialArray)

  const onSubmit = (e) => {
    circuitPrint({
      date: e.date,
      voltage: e.voltage,
      rows,
    })
  }

  return (
    <CRow>
      <CCol xs="12" sm="12">
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <CCard>
                <CCardHeader className="card-header-collapsed">
                  Circuit Directory
                  <CButton onClick={() => setCollapsed(!collapsed)} style={{ color: 'white' }}>
                    <CIcon icon={collapsed ? cilArrowTop : cilArrowBottom} />
                  </CButton>
                </CCardHeader>
                <CCollapse visible={!collapsed}>
                  <CCardBody>
                    <Field name="date" validate={required}>
                      {({ input, meta }) => (
                        <div className="mb-3">
                          <CFormLabel>Date</CFormLabel>
                          <CFormInput {...input} type="date" invalid={meta.error && meta.touched} />
                          {meta.touched && meta.error && (
                            <CFormFeedback invalid>{meta.error}</CFormFeedback>
                          )}
                        </div>
                      )}
                    </Field>
                    <Field name="voltage" validate={required}>
                      {({ input, meta }) => (
                        <div className="mb-3">
                          <CFormLabel>Voltage</CFormLabel>
                          <CFormInput {...input} invalid={meta.error && meta.touched} />
                          {meta.touched && meta.error && (
                            <CFormFeedback invalid>{meta.error}</CFormFeedback>
                          )}
                        </div>
                      )}
                    </Field>
                    <CTable className="cd-table" responsive striped>
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
                                onChange={(e) =>
                                  setRows((prevRows) => {
                                    const updatedRows = [...prevRows]
                                    updatedRows[index].load = e.target.value
                                    return updatedRows
                                  })
                                }
                              />
                            </CTableDataCell>
                            <CTableDataCell>{row.ckt1}</CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="text"
                                placeholder="Load 1"
                                value={row.load1}
                                onChange={(e) =>
                                  setRows((prevRows) => {
                                    const updatedRows = [...prevRows]
                                    updatedRows[index].load1 = e.target.value
                                    return updatedRows
                                  })
                                }
                              />
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                  <CCardFooter>
                    <CButton color="success" type="submit">
                      Submit
                    </CButton>
                  </CCardFooter>
                </CCollapse>
              </CCard>
            </form>
          )}
        />
      </CCol>
    </CRow>
  )
}

export default CircuitDirectoryBusiness
