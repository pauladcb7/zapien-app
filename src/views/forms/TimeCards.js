import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CFormTextarea,
  CFormCheck,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CListGroup,
  CListGroupItem,
  CBadge,
  CModal,
  CWidgetStatsF,
  CToast,
  CToaster,
  CToastHeader,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import {
  cilArrowBottom,
  cilArrowTop,
  cilArrowLeft,
  cilClock,
  cilPenNib,
  cilRestaurant,
  cilSettings,
} from '@coreui/icons'
import MultiSelect from './multi-select/MultiSelect'
import SimpleToast from './simple-toast/SimpleToast'
import moment from 'moment'
import { useToasts } from 'react-toast-notifications'
import { useSelector } from 'react-redux'
import { Field, Form as FinalForm } from 'react-final-form'
import { ToastContainer, toast } from 'react-toastify'

import { api } from '../../helpers/api'
import {
  JOB_LOCATIONS,
  SAVE_TIME_CARD,
  GET_TIME_CARD_BY_DAY,
  CLOCK_IN,
  CLOCK_OUT,
  LUNCH_IN,
  LUNCH_OUT,
  CREATE_TIME_CARD,
  GET_JOB,
} from '../../helpers/urls'

const required = (value) => (value ? undefined : 'Value Required.')

const TimeCards = () => {
  const state = useSelector((state) => state.state)
  const gps = useSelector((state) => state.gps)
  const [initialValues, setInitialValue] = useState({})
  const [loading, setLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState(moment().format('dddd, MMMM Do, YYYY'))
  const [jobName, setJobName] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [otherJobLocation, setOtherJobLocation] = useState('')
  const [timeCardId, setTimeCardId] = useState('')
  const [timeEntryId, setTimeEntryId] = useState('')
  const [collapsed, setCollapsed] = useState(true)
  const [collapseOther, setCollapseOther] = useState(false)
  const [showElements, setShowElements] = useState(true)
  const [collapseMulti, setCollapseMulti] = useState([false, false, false, false])
  const [loggingTime, setLoggingTime] = useState([false, false, false, false])
  const [jobLocations, setJobLocations] = useState([
    { id: 1, value: 'No Job Locations Found', code: 'NO_DATA_FOUND' },
  ])
  const [jobs, setJobs] = useState([{ id: 1, value: 'No Jobs Found' }])
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [clockInTime, setClockInTime] = useState('')
  const [clockOutTime, setClockOutTime] = useState('')
  const [lunchInTime, setLunchInTime] = useState('')
  const [lunchOutTime, setLunchOutTime] = useState('')
  const [timeCardsLogged, setTimeCardsLogged] = useState([])
  const [employeeSignature, setEmployeeSignature] = useState(null)
  const [weekClosed, setWeekClosed] = useState(null)
  const [selectedJobs, setSelectedJobs] = useState([])

  useEffect(() => {
    api
      .get(GET_JOB)
      .then((data) =>
        data.map((job) => ({
          label: job.job_name,
          value: job.id,
        })),
      )
      .then((data) => setJobs(data))
      .catch((error) => {
        toast.error('Failed to load jobs. Please refresh.', {
          autoClose: 3000,
          theme: 'colored',
        })
        console.log('Error:', error)
      }),
      fetchTimeCardByDay()
  }, [timeEntryId, timeCardId])

  const fetchTimeCardByDay = () => {
    api
      .get(GET_TIME_CARD_BY_DAY, {
        params: {
          time_entry_id: timeEntryId,
          time_card_id: timeCardId,
          entry_date: moment().format('YYYY-MM-DD'),
        },
      })
      .then((result) => {
        const { time_card_info: timeCardInfo, time_entry_info: timeEntryInfo } = result
        setTimeCardId(timeCardInfo?.time_card_id || '')
        setTimeEntryId(timeEntryInfo?.id || '')
        setTimeCardsLogged(result.time_cards_logged || [])
        setWeekClosed(result.week_closed_ind || null)

        if (timeCardInfo) {
          setInitialValue({
            jobName: timeCardInfo.job_name,
            jobDescription: timeCardInfo.job_description,
          })
        }
      })
      .catch((error) => {
        //addToast('Error fetching time card details. Please refresh.', 'danger')
        toast.error('Error fetching time card details. Please refresh.', {
          autoClose: 3000,
          theme: 'colored',
        })
        console.log(error)
      })
  }

  const onSubmit = (values) => {
    api
      .post(SAVE_TIME_CARD, { data: values })
      .then(() => {
        addToast(aToast('Time Card saved successfully.', 'success'))
        fetchTimeCardByDay()
      })
      .catch(() =>
        toast('Error saving Time Card. Please try again.', 'danger', {
          autoClose: 3000,
          theme: 'colored',
        }),
      )
  }

  const validate = (values) => {
    const errors = {}
    if (!values.jobName || values.jobName.length === 0) errors.jobName = 'This field is required.'
    if (!values.jobDescription) errors.jobDescription = 'Job Description is required.'
    return errors
  }

  const LogCards = () => {
    return (
      <CRow>
        <CCol xs="12" sm="6">
          <CWidgetStatsF
            onClick={onSubmit}
            style={{ cursor: 'pointer' }}
            icon={
              <div style={{ color: 'white', textAlign: 'center' }}>
                <CIcon width={24} icon={cilClock} size="xl" />
                <p>Clock In</p>
              </div>
            }
            padding={false}
            title={
              <div
                style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}
              >
                <CIcon icon={cilArrowLeft} size="xl" className="clickArrow" />
                <p style={{ fontSize: '12px' }}>CLOCK IN TIME</p>
              </div>
            }
            color="danger"
          />
        </CCol>
        <CCol xs="12" sm="6">
          <CWidgetStatsF
            style={{ cursor: 'pointer' }}
            icon={
              <div style={{ color: 'white', textAlign: 'center' }}>
                <CIcon width={24} icon={cilClock} size="xl" />
                <p>Clock Out</p>
              </div>
            }
            padding={false}
            title={
              <div
                style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}
              >
                <CIcon icon={cilArrowLeft} size="xl" className="clickArrow" />
                <p style={{ fontSize: '12px' }}>CLOCK OUT TIME</p>
              </div>
            }
            color="danger"
          />
        </CCol>
      </CRow>
    )
  }

  const RenderTimeCardsLogged = () => {
    return (
      <CListGroup>
        {timeCardsLogged.map((log, index) => (
          <CListGroupItem key={index} className="justify-content-between">
            {log.job_name || 'No Job Name'}
            <CBadge color="success" className="float-end">
              {moment(log.clock_in).format('h:mm A')}
            </CBadge>
          </CListGroupItem>
        ))}
      </CListGroup>
    )
  }
  const handleJobSelectionChange = (updatedValues, input) => {
    console.log('Updated Job Selections:', updatedValues)
    setSelectedJobs(updatedValues)
    input.onChange(updatedValues.map((job) => job.value))

    // Additional onChange logic can go here
  }
  return (
    <>
      <ToastContainer />
      <CRow>
        <CCol xs="12">
          <FinalForm
            onSubmit={onSubmit}
            validate={validate}
            initialValues={initialValues}
            render={({ handleSubmit, valid }) => (
              <form onSubmit={handleSubmit}>
                <CCard>
                  <CCardHeader className="card-header-collapsed">
                    <div> {currentDate.toString()}</div>
                    <div>
                      <CButton color="success" size="sm" type="submit" disabled={!valid}>
                        Save
                      </CButton>
                      <CButton
                        color="link"
                        className="card-header-action"
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ color: 'white' }}
                      >
                        <CIcon icon={collapsed ? cilArrowBottom : cilArrowTop} />
                      </CButton>
                    </div>
                  </CCardHeader>
                  <CCollapse visible={collapsed}>
                    <CCardBody>
                      <LogCards />
                      <Field name="jobName">
                        {({ input, meta }) => (
                          <div className="mb-3">
                            <MultiSelect
                              {...input}
                              invalid={meta.touched && meta.error}
                              options={jobs}
                              label="Select Job(s)"
                              selectedValues={selectedJobs}
                              setSelectedValues={setSelectedJobs}
                              onChange={(updatedValues) =>
                                handleJobSelectionChange(updatedValues, input)
                              }
                            />

                            {meta.touched && meta.error && (
                              <span className="text-danger">{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                      <Field name="jobDescription">
                        {({ input, meta }) => (
                          <div className="mb-3">
                            <CFormLabel>Type of work in progress</CFormLabel>

                            <CFormTextarea
                              {...input}
                              rows="3"
                              placeholder="Enter type of work in progress..."
                              invalid={meta.touched && meta.error}
                            />
                            {meta.touched && meta.error && (
                              <span className="text-danger">{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                    </CCardBody>
                  </CCollapse>
                </CCard>
              </form>
            )}
          />
        </CCol>
      </CRow>
      <RenderTimeCardsLogged />
      <CModal alignment="center" visible={loading}>
        <CSpinner />
      </CModal>
    </>
  )
}

export default TimeCards
