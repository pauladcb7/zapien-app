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
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ESignature from 'src/components/SignaturePad'
import { Field, Form as FinalForm } from 'react-final-form'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { api } from '../../helpers/api'
import {
  SAVE_TIME_CARD,
  JOB_LOCATIONS,
  GET_JOB,
  GET_TIME_ENTRY_BY_DAY,
  CREATE_TIME_ENTRY,
  SAVE_TIME_ENTRY,
} from '../../helpers/urls/index'

const required = (value) => (value ? undefined : 'Required')

const TimeCards = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [loading, setLoading] = useState(false)
  const [jobLocations, setJobLocations] = useState([])
  const [jobNames, setJobNames] = useState([])
  const [initialValues, setInitialValues] = useState({})
  const [timeEntryId, setTimeEntryId] = useState(null)
  const [timeCardId, setTimeCardId] = useState(null)
  const [clockedIn, setClockedIn] = useState(false)
  const [clockedOut, setClockedOut] = useState(false)
  const user = useSelector((state) => state.user)

  // Fetch job locations, job names, and today's time_entry
  useEffect(() => {
    api.get(JOB_LOCATIONS)
      .then((data) => setJobLocations(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Error loading Job Locations:', error))

    api.get(GET_JOB)
      .then((jobs) => setJobNames(Array.isArray(jobs) ? jobs : []))
      .catch((error) => console.error('Error loading Job Names:', error))

    if (user && user.id) {
      fetchOrCreateTimeEntry()
    }
    // eslint-disable-next-line
  }, [user && user.id])

  // Fetch or create today's time_entry for the user
  const fetchOrCreateTimeEntry = async () => {
    setLoading(true)
    try {
      const res = await api.get(GET_TIME_ENTRY_BY_DAY, {
        params: {
          user_id: user?.id,
          entry_date: moment().format('YYYY-MM-DD'),
        },
      })
      if (res && res.time_entry) {
        setTimeEntryId(res.time_entry.id)
        setInitialValues({
          ...res.time_entry,
          timeStarted: res.time_entry.timeStarted || '',
          timeFinished: res.time_entry.timeFinished || '',
        })
        setTimeCardId(res.time_entry.time_card_id || null)
        setClockedIn(!!res.time_entry.timeStarted)
        setClockedOut(!!res.time_entry.timeFinished)
      } else {
        // Guard: do not create if user.id is missing
        if (!user || !user.id) {
          alert('User ID is missing. Cannot create time entry.')
          setLoading(false)
          return
        }
        // Create new time_entry for today with all required fields
        const payload = {
          timeEntry: {
            user_id: user.id, // Always send a valid user_id
            entry_date: moment().format('YYYY-MM-DD'),
            lunch_in: null,
            lunch_out: null,
            timecards: [
              {
                job_name: '',
                job_description: '',
                job_locations: [],
                clock_in: '',
                clock_out: '',
              }
            ]
          }
        };
        console.log('CREATE_TIME_ENTRY payload:', payload);
        const createRes = await api.post(CREATE_TIME_ENTRY, payload)
        setTimeEntryId(createRes.id)
        setInitialValues({})
        setTimeCardId(null)
        setClockedIn(false)
        setClockedOut(false)
      }
    } catch (error) {
      setInitialValues({})
      setTimeEntryId(null)
      setTimeCardId(null)
      setClockedIn(false)
      setClockedOut(false)
    } finally {
      setLoading(false)
    }
  }

  // Helper to get GPS position
  const getGPS = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject('Geolocation not supported')
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
        (err) => reject(err)
      )
    })

  // Save time_card (detail) for clock in/out
  const saveTimeCard = async (fields) => {
    setLoading(true)
    try {
      // Always use the latest form values, fallback only if truly missing
      let jobLocationsValue = fields.jobLocation;
      if (typeof jobLocationsValue === 'string') {
        jobLocationsValue = jobLocationsValue.split(',').map(s => s.trim()).filter(Boolean);
      } else if (!Array.isArray(jobLocationsValue)) {
        jobLocationsValue = [String(jobLocationsValue)]
      }
      const payload = {
        entry_date: moment().format('YYYY-MM-DD'),
        user_id: user?.id,
        time_entry_id: timeEntryId,
        id: timeCardId,
        job_name: fields.jobName,
        job_locations: jobLocationsValue,
        job_description: fields.jobDescription || '',
        notes: fields.notes || '',
        esignature: fields.supervisorSignature || '',
        clock_in_time: fields.timeStarted || '',
        clock_in_lat: fields.clockInLat || '',
        clock_in_lng: fields.clockInLng || '',
        clock_out_time: fields.timeFinished || '',
        clock_out_lat: fields.clockOutLat || '',
        clock_out_lng: fields.clockOutLng || '',
        // Add any other required fields here
      }
      const res = await api.post(SAVE_TIME_CARD, payload)
      setTimeCardId(res.id || timeCardId)
      setClockedIn(!!payload.clock_in_time)
      setClockedOut(!!payload.clock_out_time)
    } catch (error) {
      console.error('Error saving time card:', error)
    } finally {
      setLoading(false)
    }
  }

  // Save time_entry (master) for managers
  const saveTimeEntry = async (fields) => {
    setLoading(true)
    try {
      const payload = {
        ...fields,
        id: timeEntryId,
        user_id: user?.id,
        entry_date: moment().format('YYYY-MM-DD'),
      }
      await api.post(SAVE_TIME_ENTRY, payload)
    } catch (error) {
      console.error('Error saving time entry:', error)
    } finally {
      setLoading(false)
    }
  }

  // Clock In/Out handlers
  const handleClock = async (form, type) => {
    try {
      const gps = await getGPS()
      const now = moment().format('HH:mm')
      const values = form.getState().values
      // Ensure jobName and jobLocation are present before proceeding
      if (!values.jobName || !values.jobLocation) {
        alert('Please select a job and enter a job location before clocking in or out.')
        return
      }
      if (type === 'in') {
        form.change('timeStarted', now)
        form.change('clockInLat', gps.lat)
        form.change('clockInLng', gps.lng)
        await saveTimeCard({
          ...values,
          timeStarted: now,
          clockInLat: gps.lat,
          clockInLng: gps.lng,
        })
      } else {
        form.change('timeFinished', now)
        form.change('clockOutLat', gps.lat)
        form.change('clockOutLng', gps.lng)
        await saveTimeCard({
          ...values,
          timeFinished: now,
          clockOutLat: gps.lat,
          clockOutLng: gps.lng,
        })
      }
      fetchOrCreateTimeEntry()
    } catch (e) {
      alert('Unable to get GPS location.')
    }
  }

  // Save the rest of the form (notes, signature, etc) to time_entry (master)
  const onSubmit = async (formData) => {
    await saveTimeEntry(formData)
  }

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12">
          <FinalForm
            onSubmit={onSubmit}
            initialValues={initialValues}
            enableReinitialize
            validate={(values) => {
              const errors = {}
              if (!values.jobName) errors.jobName = 'Required'
              if (!values.jobLocation) errors.jobLocation = 'Required'
              if (!values.timeStarted) errors.timeStarted = 'Required'
              if (!values.timeFinished) errors.timeFinished = 'Required'
              return errors
            }}
            render={({ handleSubmit, valid, form, values }) => (
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
                      <CRow className="mb-4">
                        <CCol md="6">
                          <CButton
                            color="danger"
                            variant="outline"
                            onClick={() => handleClock(form, 'in')}
                            style={{ width: '100%', height: '100px', fontSize: '1.5rem' }}
                            disabled={clockedIn}
                          >
                            <CIcon icon="cil-clock" className="me-2" />
                            {clockedIn ? 'Clocked In' : 'Clock In'}
                          </CButton>
                        </CCol>
                        <CCol md="6">
                          <CButton
                            color="danger"
                            variant="outline"
                            onClick={() => handleClock(form, 'out')}
                            style={{ width: '100%', height: '100px', fontSize: '1.5rem' }}
                            disabled={!clockedIn || clockedOut}
                          >
                            <CIcon icon="cil-clock" className="me-2" />
                            {clockedOut ? 'Clocked Out' : 'Clock Out'}
                          </CButton>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol sm="12">
                          <Field name="jobName" validate={required}>
                            {({ input, meta }) => (
                              <div>
                                <CFormLabel htmlFor="jobName">Job Name</CFormLabel>
                                <CFormSelect
                                  id="jobName"
                                  {...input}
                                  invalid={meta.touched && meta.error ? true : false}
                                  disabled={clockedIn}
                                >
                                  <option value="">Select a job</option>
                                  {jobNames.map((job, idx) => (
                                    <option key={idx} value={job.job_name}>
                                      {job.job_name}
                                    </option>
                                  ))}
                                </CFormSelect>
                                {meta.touched && meta.error && (
                                  <CFormFeedback invalid>{meta.error}</CFormFeedback>
                                )}
                              </div>
                            )}
                          </Field>
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
                                  disabled={clockedIn}
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
                                  placeholder="--:-- --"
                                  readOnly
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
                                  placeholder="--:-- --"
                                  readOnly
                                />
                                {meta.touched && meta.error && (
                                  <CFormFeedback invalid>{meta.error}</CFormFeedback>
                                )}
                              </div>
                            )}
                          </Field>
                          {/* Hidden fields for GPS */}
                          <Field name="clockInLat">{({ input }) => <input type="hidden" {...input} />}</Field>
                          <Field name="clockInLng">{({ input }) => <input type="hidden" {...input} />}</Field>
                          <Field name="clockOutLat">{({ input }) => <input type="hidden" {...input} />}</Field>
                          <Field name="clockOutLng">{({ input }) => <input type="hidden" {...input} />}</Field>
                          <Field name="notes">
                            {({ input }) => (
                              <div>
                                <CFormLabel htmlFor="notes">Notes</CFormLabel>
                                <CFormInput type="text" id="notes" {...input} />
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

export default TimeCards