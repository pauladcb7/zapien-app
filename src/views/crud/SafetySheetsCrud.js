import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CRow,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import CrudTable from 'src/components/CrudTable'
import { toast } from 'react-toastify' // UPDATED
import { SAVE_SAFETY_SHEET, GET_SAFETY_SHEET, SAFETY_SHEET } from 'src/helpers/urls'
import { api } from 'src/helpers/api'
import moment from 'moment'

const required = (value) => (value ? undefined : 'Required')

const getBadge = (status) => {
  switch (status) {
    case 'OPEN':
      return 'success'
    case 'CLOSED':
      return 'danger'
    default:
      return 'primary'
  }
}

const SafetySheetCrud = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [showElements, setShowElements] = useState(true)

  const metadata = [
    {
      key: 'jobLocation',
      label: 'Job Location',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
    },
    {
      key: 'supervisor',
      label: 'Supervisor',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '190px' },
    },
    {
      key: 'entryDate',
      label: 'Entry Date',
      type: 'date',
      sorter: false,
      filter: false,
      _style: { minWidth: '100px' },
    },
    {
      key: 'startTime',
      label: 'Time Started',
      type: 'date',
      sorter: false,
      filter: false,
      _style: { minWidth: '100px' },
    },
    {
      key: 'endTime',
      label: 'Time Finished',
      type: 'date',
      sorter: false,
      filter: false,
      _style: { minWidth: '100px' },
    },
    {
      key: 'safetySuggestions',
      label: 'Work-Site Hazards and Safety Suggestions',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '100px' },
    },
    {
      key: 'safetyViolations',
      label: 'Personnel Safety Violations',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '100px' },
    },
  ]

  const onDelete = (row) => {
    api
      .delete(SAFETY_SHEET, { data: { id: row.id } })
      .then(() => {
        toast.success('Safety Sheet Removed.', { autoClose: 3000 }) // UPDATED
        fetchTable()
      })
      .catch(() => {
        toast.error('Something went wrong. Try again.', { autoClose: 3000 }) // UPDATED
      })
  }

  const fetchTable = () => {
    setLoading(true)
    api.get(GET_SAFETY_SHEET).then((safetySheets) => {
      setRows(
        (safetySheets || []).map((ss) => ({
          ...ss,
          entryDate: moment(ss.entryDate).format('YYYY-MM-DD'),
          safetySuggestions: ss.safetySuggestions || '',
          safetyViolations: ss.safetyViolations || '',
          supervisor: `${ss.supervisor?.firstName || ''} ${ss.supervisor?.lastName || ''}`,
        })),
      )
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchTable()
  }, [])

  return (
    <CRow>
      <CCol xs="12" sm="12">
        {showElements && (
          <CCard>
            <CCardHeader>
              Safety Sheets
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
                <CrudTable
                  loading={loading}
                  title="Safety Sheet"
                  rows={rows}
                  metadata={metadata}
                  onEdit={(row, editedRow) => console.log(editedRow)}
                  disableEdit
                  onRefreshTable={fetchTable}
                  onCreate={() => {}}
                  onDelete={onDelete}
                />
              </CCardBody>
            </CCollapse>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default SafetySheetCrud