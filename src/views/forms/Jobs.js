import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react' // Updated imports for CoreUI v5
import { useToasts } from 'react-toast-notifications'
import { api } from '../../helpers/api'
import { GET_JOB } from '../../helpers/urls/index'
import { useSelector } from 'react-redux'

const Jobs = () => {
  const [jobs, setJobs] = useState([])
  const { addToast } = useToasts()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const fetchTable = () => {
      api
        .get(GET_JOB)
        .then((jobs) => {
          const formattedJobs = jobs?.map((job) => ({
            number: job.job_number || '',
            name: job.job_name || '',
            manager: job.manager || '',
            company_name: job.company_name || '',
            company_phone: job.company_phone || '',
            billing_address: job.billing_address || '',
            working_address: job.working_address || '',
            main_contact_name: job.main_contact_name || '',
            main_contact_number: job.main_contact_number || '',
            job_desc: job.job_desc || '',
            any_material: job.any_material || '',
            start_date: job.start_date || '',
            end_date: job.end_date || '',
            quoted_or_time_material: job.quoted_or_time_material || '',
          }))
          setJobs(formattedJobs)
        })
        .catch((error) => {
          console.error('Error fetching jobs:', error)
          addToast('Something went wrong getting Jobs', {
            appearance: 'error',
            autoDismiss: true,
          })
        })
    }

    fetchTable()
  }, [addToast])

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>Jobs</CCardHeader>
          <CCardBody>
            <CTable hover striped responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Job Number</CTableHeaderCell>
                  <CTableHeaderCell>Job Name</CTableHeaderCell>
                  <CTableHeaderCell>Manager</CTableHeaderCell>
                  <CTableHeaderCell>Company Name</CTableHeaderCell>
                  <CTableHeaderCell>Company Phone</CTableHeaderCell>
                  <CTableHeaderCell>Billing Address</CTableHeaderCell>
                  <CTableHeaderCell>Working Address</CTableHeaderCell>
                  <CTableHeaderCell>Main Contact Name</CTableHeaderCell>
                  <CTableHeaderCell>Main Contact Number</CTableHeaderCell>
                  <CTableHeaderCell>Job Description</CTableHeaderCell>
                  <CTableHeaderCell>Any Material?</CTableHeaderCell>
                  <CTableHeaderCell>Start Date</CTableHeaderCell>
                  <CTableHeaderCell>End Date</CTableHeaderCell>
                  <CTableHeaderCell>Quoted or T&M?</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {jobs.map((job, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{job.number}</CTableDataCell>
                    <CTableDataCell>{job.name}</CTableDataCell>
                    <CTableDataCell>{job.manager}</CTableDataCell>
                    <CTableDataCell>{job.company_name}</CTableDataCell>
                    <CTableDataCell>{job.company_phone}</CTableDataCell>
                    <CTableDataCell>{job.billing_address}</CTableDataCell>
                    <CTableDataCell>{job.working_address}</CTableDataCell>
                    <CTableDataCell>{job.main_contact_name}</CTableDataCell>
                    <CTableDataCell>{job.main_contact_number}</CTableDataCell>
                    <CTableDataCell>{job.job_desc}</CTableDataCell>
                    <CTableDataCell>{job.any_material}</CTableDataCell>
                    <CTableDataCell>{job.start_date}</CTableDataCell>
                    <CTableDataCell>{job.end_date}</CTableDataCell>
                    <CTableDataCell>{job.quoted_or_time_material}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Jobs
