import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CCollapse, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useToasts } from 'react-toast-notifications'
import { useSelector } from 'react-redux'
import CrudTable from 'src/components/CrudTable'
import { JOB, GET_JOB, SAVE_JOB } from 'src/helpers/urls'
import { api } from 'src/helpers/api'

const JobsCrud = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])

  const { addToast } = useToasts()

  const metadata = [
    { key: 'job_number', label: 'Job Number', type: 'text', required: true },
    { key: 'job_name', label: 'Job Name', type: 'text' },
    { key: 'manager', label: 'Manager', type: 'text' },
    { key: 'company_name', label: 'Company Name', type: 'text' },
    { key: 'company_phone', label: 'Company Phone', type: 'text' },
    { key: 'billing_address', label: 'Billing Address', type: 'text' },
    { key: 'working_address', label: 'Working Address', type: 'text' },
    { key: 'main_contact_name', label: 'Main Contact Name', type: 'text' },
    { key: 'main_contact_number', label: 'Main Contact Number', type: 'text' },
    { key: 'job_desc', label: 'Job Description', type: 'text' },
    { key: 'any_material_yn', label: 'Any Material?', type: 'text' },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'quoted_or_time_material', label: 'Quoted or T&M?', type: 'text' },
  ]

  const fetchTable = () => {
    setLoading(true)
    api
      .get(GET_JOB)
      .then((jobs) =>
        setRows(
          jobs.map((job) => ({
            job_number: job.job_number,
            job_name: job.job_name,
            manager: job.manager,
            company_name: job.company_name,
            company_phone: job.company_phone,
            billing_address: job.billing_address,
            working_address: job.working_address,
            main_contact_name: job.main_contact_name,
            main_contact_number: job.main_contact_number,
            job_desc: job.job_desc,
            any_material_yn: job.any_material_yn,
            start_date: job.start_date,
            end_date: job.end_date,
            quoted_or_time_material: job.quoted_or_time_material,
          })),
        ),
      )
      .catch(() => addToast('Error fetching jobs', { appearance: 'error', autoDismiss: true }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTable()
  }, [])

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            Jobs
            <div className="card-header-actions">
              <CButton color="link" onClick={() => setCollapsed(!collapsed)}>
                <CIcon icon={collapsed ? 'cil-chevron-bottom' : 'cil-chevron-top'} />
              </CButton>
            </div>
          </CCardHeader>
          <CCollapse visible={!collapsed}>
            <CCardBody>
              <CrudTable
                title="Jobs"
                rows={rows}
                metadata={metadata}
                onRefreshTable={fetchTable}
                loading={loading}
                onEdit={(row, editedRow) =>
                  api
                    .post(SAVE_JOB, { ...editedRow, job_id: editedRow.id })
                    .then(() =>
                      addToast('Job updated successfully', {
                        appearance: 'success',
                        autoDismiss: true,
                      }),
                    )
                    .catch(() =>
                      addToast('Error updating job', { appearance: 'error', autoDismiss: true }),
                    )
                }
                onCreate={(row) =>
                  api
                    .post(SAVE_JOB, { ...row, job_id: '-1' })
                    .then(() =>
                      addToast('Job created successfully', {
                        appearance: 'success',
                        autoDismiss: true,
                      }),
                    )
                    .catch(() =>
                      addToast('Error creating job', { appearance: 'error', autoDismiss: true }),
                    )
                }
                onDelete={(row) =>
                  api
                    .delete(JOB, { data: { id: row.id } })
                    .then(() =>
                      addToast('Job removed successfully', {
                        appearance: 'success',
                        autoDismiss: true,
                      }),
                    )
                    .catch(() =>
                      addToast('Error removing job', { appearance: 'error', autoDismiss: true }),
                    )
                }
              />
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default JobsCrud
