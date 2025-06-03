import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCollapse,
  CForm,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CRow,
  CCol,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Field, Form as FinalForm } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import { useSelector } from 'react-redux'
import CrudTable from 'src/components/CrudTable'

// Modular field components
import JobLocationField from 'src/components/timecard/JobLocationField'
import TimeFields from 'src/components/timecard/TimeFields'
import SafteyFields from 'src/components/timecard/SafteyFields'
import SupervisorSignatureField from 'src/components/timecard/SupervisorSignatureField'

const required = (value) => (value ? undefined : 'Required')

function TimeEntry({ locations }) {
  return (
    <div>
      <JobLocationField />
      <TimeFields />
      <SafteyFields />
      <SupervisorSignatureField />
      <FieldArray name="timecards">
        {({ fields }) => (
          <div>
            <CrudTable
              items={fields.value}
              columns={[
                { key: 'jobName', label: 'Job Name', minWidth: 150 },
                { key: 'jobDescription', label: 'Job Description', minWidth: 150 },
                { key: 'clockIn', label: 'Clock In' },
                { key: 'clockInGps', label: 'Clock In GPS', minWidth: 150 },
                { key: 'clockOut', label: 'Clock Out' },
                { key: 'clockOutGps', label: 'Clock Out GPS', minWidth: 150 },
                { key: 'jobLocations', label: 'Job Locations', minWidth: 300 },
              ]}
              striped
              renderRow={({ item, index }) => (
                <tr key={index}>
                  <td>
                    <Field name={`timecards.${index}.jobName`} validate={required}>
                      {({ input, meta }) => (
                        <CForm className="mb-3">
                          <CFormInput
                            {...input}
                            type="text"
                            invalid={meta.invalid && meta.touched}
                          />
                          {meta.touched && meta.error && (
                            <CBadge color="danger" className="text-danger">
                              Please provide valid information
                            </CBadge>
                          )}
                        </CForm>
                      )}
                    </Field>
                  </td>
                  <td>
                    <Field name={`timecards.${index}.jobLocations`} validate={required}>
                      {({ input }) => (
                        <JobLocationField input={input} />
                      )}
                    </Field>
                  </td>
                </tr>
              )}
            />
            <CButton block color="dark" type="button" onClick={() => fields.push({})}>
              <CIcon icon="cil-plus" /> Add Timecard
            </CButton>
          </div>
        )}
      </FieldArray>
    </div>
  )
}

function TimeCardCrud() {
  const [collapsed, setCollapsed] = useState(true)
  const [showElements, setShowElements] = useState(true)
  const isAdmin = useSelector((state) => state.user.role === 'admin')

  useEffect(() => {
    // Example usage:
    // toast.success('Loaded time cards!')
    // toast.error('Something went wrong!')
  }, [])

  return (
    <CRow>
      <CCol xs="12" sm="12">
        {showElements && (
          <CCard>
            <CCardHeader>
              Time Cards
              <div className="card-header-actions">
                <CButton
                  color="link"
                  className="card-header-action btn-minimize"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  <CIcon icon={collapsed ? 'cil-arrow-top' : 'cil-arrow-bottom'} />
                </CButton>
              </div>
            </CCardHeader>
            <CCollapse visible={collapsed}>
              <CCardBody>
                <FinalForm
                  onSubmit={(values) => {
                    toast.success('Time card submitted!')
                    // You can send values to your API here
                  }}
                  mutators={{ ...arrayMutators }}
                  initialValues={{ timecards: [{}] }}
                  render={({ handleSubmit }) => (
                    <CForm onSubmit={handleSubmit}>
                      <TimeEntry locations={[]} />
                      <CButton color="primary" type="submit" className="mt-3">
                        Submit Time Card
                      </CButton>
                    </CForm>
                  )}
                />
                <CRow className="mt-4">
                  <CCol md={5}>
                    <CForm className="mb-3">
                      <CFormLabel>Start Date</CFormLabel>
                      <CFormInput type="date" id="startDateFilter" />
                    </CForm>
                  </CCol>
                  <CCol md={5}>
                    <CForm className="mb-3">
                      <CFormLabel>End Date</CFormLabel>
                      <CFormInput type="date" id="endDateFilter" />
                    </CForm>
                  </CCol>
                  <CCol md={2}>
                    <CFormCheck id="allTimeCheckbox" label="All time" />
                  </CCol>
                </CRow>
                <CrudTable
                  disableDelete={!isAdmin}
                  title="Time Card"
                  rows={[]}
                  onAddRow={() => {
                    // toast.success('Row added!')
                  }}
                  onRefreshTable={() => {
                    // toast.info('Table refreshed!')
                  }}
                  metadata={[]}
                  loading={false}
                  filters={(startDate, endDate) => <div>Filters...</div>}
                />
              </CCardBody>
            </CCollapse>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default TimeCardCrud