import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CRow,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Select from 'react-select'
import moment from 'moment'
import { useToasts } from 'react-toast-notifications'
import { api } from '../../helpers/api'
import { SAVE_RECEIPT, GET_JOB, GET_WORK_ORDER } from '../../helpers/urls/index'
import { useSelector } from 'react-redux'
import { Field, Form } from 'react-final-form'

const required = (value) => (value ? undefined : 'Required')

const Receipt = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [initialValues, setInitialValue] = useState({})
  const [jobs, setJobs] = useState([])
  const [workOrders, setWorkOrders] = useState([])

  const { addToast } = useToasts()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    api
      .get(GET_WORK_ORDER)
      .then((data) => {
        const formattedWorkOrders = data.map((workOrder) => ({
          label: workOrder.job_details,
          value: workOrder.id,
        }))
        setWorkOrders(formattedWorkOrders)
      })
      .catch(() => {
        addToast('Error loading WorkOrders list. Refresh the page.', {
          appearance: 'error',
          autoDismiss: true,
        })
      })

    api
      .get(GET_JOB)
      .then((data) => {
        const formattedJobs = data.map((job) => ({
          label: job.job_name,
          value: job.id,
        }))
        setJobs(formattedJobs)
      })
      .catch(() => {
        addToast('Error loading Jobs list. Refresh the page.', {
          appearance: 'error',
          autoDismiss: true,
        })
      })

    setInitialValue({
      date: moment().format('YYYY-MM-DD'),
      comments: '',
    })
  }, [addToast])

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const onSubmit = async (values) => {
    const file = document.getElementById('receiptFile').files[0]
    const fileBase64 = await getBase64(file)

    api
      .post(SAVE_RECEIPT, {
        data: {
          receipt_id: '-1',
          user_id: user.email,
          job_id: values.job.value,
          work_order_id: values.workOrder.value,
          receipt_file: fileBase64,
          comments: values.comments,
        },
      })
      .then(() => {
        addToast('Receipt Uploaded Successfully.', {
          appearance: 'success',
          autoDismiss: true,
        })
      })
      .catch(() => {
        addToast('Error uploading Receipt. Try again.', {
          appearance: 'error',
          autoDismiss: true,
        })
      })
  }

  return (
    <CRow>
      <CCol xs="12">
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <CCard>
                <CCardHeader>
                  Receipt
                  <div className="card-header-actions">
                    <CButton color="link" onClick={() => setCollapsed(!collapsed)}>
                      <CIcon icon={collapsed ? 'cil-chevron-top' : 'cil-chevron-bottom'} />
                    </CButton>
                  </div>
                </CCardHeader>
                <CCollapse visible={collapsed}>
                  <CCardBody>
                    <CRow>
                      <CCol sm="12">
                        <Field name="job" validate={required}>
                          {({ input, meta }) => (
                            <div className="mb-3">
                              <CFormLabel htmlFor="job">
                                Job <span style={{ color: 'red' }}>*</span>
                              </CFormLabel>
                              <Select
                                options={jobs}
                                placeholder="Select a Job"
                                onChange={input.onChange}
                                value={input.value}
                              />
                              {meta.error && meta.touched && (
                                <CFormFeedback invalid>
                                  Please provide valid information.
                                </CFormFeedback>
                              )}
                            </div>
                          )}
                        </Field>
                        <Field name="workOrder" validate={required}>
                          {({ input, meta }) => (
                            <div className="mb-3">
                              <CFormLabel htmlFor="workOrder">
                                Work Order <span style={{ color: 'red' }}>*</span>
                              </CFormLabel>
                              <Select
                                options={workOrders}
                                placeholder="Select a Work Order"
                                onChange={input.onChange}
                                value={input.value}
                              />
                              {meta.error && meta.touched && (
                                <CFormFeedback invalid>
                                  Please provide valid information.
                                </CFormFeedback>
                              )}
                            </div>
                          )}
                        </Field>
                        <Field name="comments">
                          {({ input }) => (
                            <div className="mb-3">
                              <CFormLabel htmlFor="comments">Comments</CFormLabel>
                              <CFormTextarea {...input} rows="3" placeholder="Type Here..." />
                            </div>
                          )}
                        </Field>
                        <Field name="receiptFile" validate={required}>
                          {({ input, meta }) => (
                            <div className="mb-3">
                              <CFormLabel htmlFor="receiptFile">
                                Receipt <span style={{ color: 'red' }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                {...input}
                                type="file"
                                id="receiptFile"
                                invalid={meta.invalid && meta.touched}
                              />
                              {meta.touched && meta.error && (
                                <CFormFeedback invalid>
                                  Please provide valid information
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
                  <CButton block color="danger" type="submit" size="lg">
                    <CIcon size="lg" icon="cil-save" /> Save
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

export default Receipt
