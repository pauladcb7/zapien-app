import React from 'react'
import { CRow, CCol, CWidgetStatsF } from '@coreui/react'
import {
  cilClock,
  cilDescription,
  cilLayers,
  cilSpreadsheet,
  cilTask,
  cilList,
  cilNoteAdd,
} from '@coreui/icons'
import { CIcon } from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  const widgets = [
    {
      title: 'Time Cards',
      icon: cilClock,
      color: 'success',
      path: '/timecards/create',
    },
    {
      title: 'Work Orders',
      icon: cilDescription,
      color: 'dark',
      path: '/work-order/create',
    },
    {
      title: 'Material Requisition',
      icon: cilLayers,
      color: 'warning',
      path: '/material-requisition/create',
    },
    {
      title: 'Circuit Directory',
      icon: cilSpreadsheet,
      color: 'primary',
      path: '/circuit-directory/selector',
    },
    {
      title: 'Safety Sheets',
      icon: cilTask,
      color: 'info',
      path: '/safety-sheets/list',
    },
    {
      title: 'Jobs',
      icon: cilList,
      color: 'danger',
      path: '/jobs',
    },
    {
      title: 'Motor Cheat Sheet 480V',
      icon: cilList,
      color: 'secondary',
      path: '/mcs',
    },
    {
      title: 'Upload Receipt',
      icon: cilNoteAdd,
      color: 'warning',
      path: '/receipts/create',
    },
  ]

  return (
    <CRow>
      {widgets.map((widget, index) => (
        <CCol key={index} sm="6" md="4" xl="3" xxl={3} style={{ cursor: 'pointer' }}>
          <CWidgetStatsF
            className={`dashboard-card mb-3 bg-${widget.color}`}
            title={widget.title}
            icon={<CIcon icon={widget.icon} height={36} />}
            onClick={() => navigate(widget.path)}
          />
        </CCol>
      ))}
    </CRow>
  )
}

export default Dashboard
