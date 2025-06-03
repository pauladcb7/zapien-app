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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Field, Form as FinalForm } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import { useSelector } from 'react-redux'
import CrudTable from 'src/components/CrudTable'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

const required = (value) => (value ? undefined : 'Required')

const initialArray = []
for (let index = 1; index < 43; index++) {
  const element = { ckt: index, load: '', ckt1: index + 1, load1: '' }
  initialArray.push(element)
  index++
}

function TimeEntry({ push, locations }) {
  return (
    <div>
      <Field name="lunch_in">
        {({ input, meta }) => (
          <CForm className="mb-3">
            <CFormLabel>Lunch In</CFormLabel>
            <CFormInput {...input} type="time" invalid={meta.invalid && meta.touched} />
            {meta.touched && meta.error && (
              <CBadge color="danger" className="text-danger">
                Please provide valid information
              </CBadge>
            )}
          </CForm>
        )}
      </Field>
      <Field name="lunch_out">
        {({ input, meta }) => (
          <CForm className="mb-3">
            <CFormLabel>Lunch Out</CFormLabel>
            <CFormInput {...input} type="time" invalid={meta.invalid && meta.touched} />
            {meta.touched && meta.error && (
              <CBadge color="danger" className="text-danger">
                Please provide valid information
              </CBadge>
            )}
          </CForm>
        )}
      </Field>
      <FieldArray name="timecards">
        {({ fields: items }) => (
          <div>
            <CrudTable
              items={items.value}
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
                        <CreatableSelect
                          isMulti
                          menuPortalTarget={document.body}
                          onChange={input.onChange}
                          value={input.value}
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          options={locations}
                        />
                      )}
                    </Field>
                  </td>
                </tr>
              )}
            />
            <CButton block color="dark" type="button" onClick={() => push('timecards', {})}>
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

  // Example: use toast in your handlers as needed
  // function handleAddRow() {
  //   toast.success('Row added!')
  // }

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
                <CRow>
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