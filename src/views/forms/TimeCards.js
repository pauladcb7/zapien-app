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
  console.log('TimeCards component: user from useSelector:', JSON.stringify(user)); // ADDED LOG
  const userId = user?.id || user?.user_id // This component-scoped userId is a snapshot.
  console.log('TimeCards component: derived component-scoped userId:', userId); // ADDED LOG

  // Fetch job locations, job names, and today's time_entry
  useEffect(() => {
    api.get(JOB_LOCATIONS)
      .then((data) => setJobLocations(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Error loading Job Locations:', error))

    api.get(GET_JOB)
      .then((jobs) => setJobNames(Array.isArray(jobs) ? jobs : []))
      .catch((error) => console.error('Error loading Job Names:', error))

    const effectUserId = user?.id || user?.user_id; // Derive from user in effect closure
    console.log('TimeCards useEffect: user object from closure:', JSON.stringify(user)); // ADDED LOG
    console.log('TimeCards useEffect: derived effectUserId:', effectUserId); // ADDED LOG

    if (effectUserId) {
      console.log('TimeCards useEffect: effectUserId is defined, calling fetchOrCreateTimeEntry with:', effectUserId); // ADDED LOG
      fetchOrCreateTimeEntry(effectUserId); // Pass effectUserId
    } else {
      console.log('TimeCards useEffect: effectUserId is undefined, NOT calling fetchOrCreateTimeEntry.'); // ADDED LOG
      // Alert if user object seems loaded but lacks an ID.
      if (user && Object.keys(user).length > 0 && !effectUserId) {
        console.error('TimeCards useEffect: User object is present but user ID is missing.', JSON.stringify(user)); // ADDED LOG
        alert('User data is incomplete (missing ID). Please try logging out and back in.'); // ADDED ALERT
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // CHANGED DEPENDENCY to [user]

  // Fetch or create today's time_entry for the user
  const fetchOrCreateTimeEntry = async (currentUserIdParam) => { // CHANGED SIGNATURE to accept userId
    setLoading(true)
    console.log('fetchOrCreateTimeEntry: received currentUserIdParam:', userId); // UPDATED LOG with new param name

    if (!userId) { // Use parameter for guard clause
      alert('User ID is missing. Cannot create time entry.')
      console.error('fetchOrCreateTimeEntry: userId is missing.'); // UPDATED LOG
      setLoading(false)
      return null
    }

    try {
      console.log('fetchOrCreateTimeEntry internal userId check (using param):', userId) // Log the param being used
      const res = await api.get(GET_TIME_ENTRY_BY_DAY, {
        params: {
          user_id: userId, // Use passed parameter
          entry_date: moment().format('YYYY-MM-DD'),
        },
      })
      console.log('GET_TIME_ENTRY_BY_DAY response:', res)
      if (res && res.time_entry_info) {
        console.log('Time Entry found for today:', res.time_entry_info);
        getTimeEntryId(res.time_entry_info.id)
        setInitialValues({
          ...res.time_entry_info,
          timeStarted: res.time_entry_info.timeStarted || '',
          timeFinished: res.time_entry_info.timeFinished || '',
        })
        setTimeCardId(res.time_entry_info.time_card_id || null)
        setClockedIn(!!res.time_entry_info.timeStarted)
        setClockedOut(!!res.time_entry_info.timeFinished)
        return res.time_entry_info.id
      } else {
        // Guard: do not create if userId is missing (already checked, but good for clarity)
        if (!userId) {
          alert('User ID is missing. Cannot create time entry.') // Should have been caught earlier
          setLoading(false)
          return null
        }
        // Create new time_entry for today with all required fields
        const payload = {
          timeEntry: {
            user_id: userId, // Use passed parameter
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
        return createRes.id
      }
    } catch (error) {
      setInitialValues({})
      setTimeEntryId(null)
      setTimeCardId(null)
      setClockedIn(false)
      setClockedOut(false)
      console.error('Error in fetchOrCreateTimeEntry:', error)
      return null
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
    console.log('saveTimeCard user object:', JSON.stringify(user)) // Log user object
    const currentSaveUserId = user?.id || user?.user_id; // Derive userId for this operation
    console.log('saveTimeCard computed currentSaveUserId:', currentSaveUserId) // Log derived userId

    // Ensure user and timeEntryId are set before saving
    if (!currentSaveUserId) {
      console.error('Error saving time card: missing user ID')
      setLoading(false)
      alert('User ID is missing. Please log in again.')
      return
    }

    let currentEntryIdToUse = timeEntryId;
    if (!currentEntryIdToUse) {
      console.warn('Time entry ID missing in saveTimeCard, fetching or creating time entry')
      // Ensure currentSaveUserId is valid before calling fetchOrCreateTimeEntry
      if (!currentSaveUserId) {
          alert('User ID is missing. Cannot fetch/create time entry for saving time card.');
          console.error('saveTimeCard: currentSaveUserId is missing before calling fetchOrCreateTimeEntry.');
          setLoading(false);
          return;
      }
      currentEntryIdToUse = await fetchOrCreateTimeEntry(currentSaveUserId); // Pass currentSaveUserId
      if (currentEntryIdToUse) {
          setTimeEntryId(currentEntryIdToUse); // Update state if new entry was created/fetched
      } else {
        console.error('Failed to get timeEntryId before saving time card')
        setLoading(false)
        // Alert might have been shown by fetchOrCreateTimeEntry if currentSaveUserId was the issue
        alert('Unable to save time card: could not obtain time entry.')
        return
      }
    }

    try {
      let jobLocationsValue = fields.jobLocation;
      if (typeof jobLocationsValue === 'string') {
        jobLocationsValue = jobLocationsValue.split(',').map(s => s.trim()).filter(Boolean);
      } else if (!Array.isArray(jobLocationsValue)) {
        jobLocationsValue = [String(jobLocationsValue)];
      }

      const payload = {
        entry_date: moment().format('YYYY-MM-DD'),
        user_id: currentSaveUserId, // Use derived userId for this operation
        time_entry_id: currentEntryIdToUse, // Use the potentially updated entry ID
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
      };

      console.log('SAVE_TIME_CARD payload:', payload);
      const res = await api.post(SAVE_TIME_CARD, payload);
      setTimeCardId(res.id || timeCardId);
      setClockedIn(!!payload.clock_in_time);
      setClockedOut(!!payload.clock_out_time);
    } catch (error) {
      console.error('Error saving time card:', error);
    } finally {
      setLoading(false);
    }
  }

  // Save time_entry (master) for managers
  const saveTimeEntry = async (fields) => {
    setLoading(true)
    const currentManagerSaveUserId = user?.id || user?.user_id; // Derive ID for this operation
    console.log('saveTimeEntry: user object:', JSON.stringify(user));
    console.log('saveTimeEntry: derived currentManagerSaveUserId:', currentManagerSaveUserId);

    if (!currentManagerSaveUserId) {
        console.error('Error saving time entry: missing user ID');
        setLoading(false);
        alert('User ID is missing for saving time entry. Please log in again.');
        return;
    }
    try {
      const payload = {
        ...fields,
        id: timeEntryId,
        user_id: currentManagerSaveUserId, // Use derived ID
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
    setLoading(true)
    try {
      let entryIdToUse = timeEntryId; // Local var for entryId for this operation

      if (!entryIdToUse) {
        const clockActionUserId = user?.id || user?.user_id; // Get current userId for this action
        console.log('handleClock: timeEntryId missing, attempting to fetch/create with userId:', clockActionUserId); // Log

        if (!clockActionUserId) { // Guard if userId is still not available
          alert('User ID is missing. Cannot perform clock action.');
          console.error('handleClock: clockActionUserId is missing.');
          setLoading(false);
          return;
        }

        entryIdToUse = await fetchOrCreateTimeEntry(clockActionUserId); // Pass userId
        if (!entryIdToUse) {
          // Alert might have been shown by fetchOrCreateTimeEntry if clockActionUserId was the issue,
          // or other error occurred during fetch/create.
          console.error('handleClock: Failed to fetch or create time entry.');
          // Avoid throwing error if alert already handled it, just stop processing.
          setLoading(false);
          return;
        }
        setTimeEntryId(entryIdToUse); // Update state if a new entryId was obtained
      }

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
      // Refresh the entry after saving
      await fetchOrCreateTimeEntry()
    } catch (e) {
      console.error('Error in handleClock:', e)
      alert(e.message || 'Clock action failed')
    } finally {
      setLoading(false)
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