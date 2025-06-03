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
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
  CModal,
  CModalBody,
  CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ESignature from 'src/components/SignaturePad'
import { Field, Form as FinalForm } from 'react-final-form'
import { useParams } from 'react-router'
import axios from 'axios'
import { getPDfInstance } from 'src/utils/pdf'
import { getBase64ImageFromURL } from 'src/utils'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api } from '../../helpers/api'
import { SAVE_SAFETY_SHEET } from '../../helpers/urls/index'

const required = (value) => (value ? undefined : 'Required')

const SignSheet = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [loading, setLoading] = useState(false)
  const [documentContent, setDocumentContent] = useState(null)
  const params = useParams()
  const user = useSelector((state) => state.user)

  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      const logo = (await import('../../assets/logopdf.png')).default
      const supervisorSignatureImage = await getBase64ImageFromURL(logo)
      const pdfData = {
        ...formData,
        supervisorSignature: supervisorSignatureImage,
      }

      await api.post(SAVE_SAFETY_SHEET, {
        ...formData,
        supervisor_signature: formData.supervisorSignature,
      })
      toast.success('Safety Sheet Submitted.', { autoClose: 3000 })
      getPDfInstance().then((pdfMake) => {
        pdfMake.createPdf(pdfData).download()
      })
    } catch (error) {
      console.error('Error saving safety sheet:', error)
      toast.error('Something went wrong. Please try again.', { autoClose: 3000 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/pdfs/${params.idFile}`)
        setDocumentContent(response.data)
      } catch (error) {
        console.error('Failed to fetch document content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocument()
  }, [params.idFile])

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12">
          <FinalForm
            onSubmit={onSubmit}
            validate={(values) => {
              const errors = {}
              if (!values.jobLocation) errors.jobLocation = 'Required'
              return errors
            }}
            render={({ handleSubmit, valid }) => (
              <CForm onSubmit={handleSubmit}>
                <CCard>
                  <CCardHeader>
                    <CButton
                      color="link"
                      className="card-header-action btn-minimize"
                      onClick={() => setCollapsed(!collapsed)}
                    >
                      <CIcon icon={collapsed ? 'cil-arrow-top' : 'cil-arrow-bottom'} />
                    </CButton>
                  </CCardHeader>
                  <CCollapse visible={collapsed}>
                    <CCardBody>
                      <CRow>
                        <CCol sm="12">
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
                          <Field name="timeStarted" validate={required}>
                            {({ input, meta }) => (
                              <div>
                                <CFormLabel htmlFor="timeStarted">Time Started</CFormLabel>
                                <CFormInput
                                  type="time"
                                  id="timeStarted"
                                  {...input}
                                  invalid={meta.touched && meta.error ? true : false}
                                />
                                {meta.touched && meta.error && (
                                  <CFormFeedback invalid>{meta.error}</CFormFeedback>
                                )}
                              </div>
                            )}
                          </Field>
                          <Field name="timeFinished" validate={required}>
                            {({ input, meta }) => (
                              <div>
                                <CFormLabel htmlFor="timeFinished">Time Finished</CFormLabel>
                                <CFormInput
                                  type="time"
                                  id="timeFinished"
                                  {...input}
                                  invalid={meta.touched && meta.error ? true : false}
                                />
                                {meta.touched && meta.error && (
                                  <CFormFeedback invalid>{meta.error}</CFormFeedback>
                                )}
                              </div>
                            )}
                          </Field>
                          <Field name="safetySuggestion">
                            {({ input }) => (
                              <div>
                                <CFormLabel htmlFor="safetySuggestion">
                                  Safety Suggestion
                                </CFormLabel>
                                <CFormInput type="text" id="safetySuggestion" {...input} />
                              </div>
                            )}
                          </Field>
                          <Field name="personalSafetyViolations">
                            {({ input }) => (
                              <div>
                                <CFormLabel htmlFor="personalSafetyViolations">
                                  Personnel Safety Violations
                                </CFormLabel>
                                <CFormInput type="text" id="personalSafetyViolations" {...input} />
                              </div>
                            )}
                          </Field>
                          <Field name="supervisorSignature">
                            {({ input }) => (
                              <div>
                                <CFormLabel>Supervisor Signature</CFormLabel>
                                <ESignature svg={input.value} onChange={input.onChange} />
                              </div>
                            )}
                          </Field>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCollapse>
                  <CCardFooter>
                    <CButton color="danger" type="submit" size="lg" disabled={!valid || loading}>
                      <CIcon icon="cil-save" /> {loading ? 'Saving...' : 'Save'}
                    </CButton>
                  </CCardFooter>
                </CCard>
              </CForm>
            )}
          />
        </CCol>
      </CRow>
      <CModal visible={loading} alignment="center">
        <CModalBody>
          <CSpinner color="primary" />
          <p>Loading...</p>
        </CModalBody>
      </CModal>
    </>
  )
}

export default SignSheet