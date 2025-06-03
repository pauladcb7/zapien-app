import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toastify' // UPDATED
import { MCS, GET_MCS, SAVE_MCS } from 'src/helpers/urls'
import { api } from 'src/helpers/api'
import { useSelector } from 'react-redux'

const MCSCrud = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const user = useSelector((state) => state.user)

  const fields = [
    { key: 'motor_hp', label: 'Motor HP' },
    { key: 'nema_amp', label: 'NEMA amp' },
    { key: 'starter_size', label: 'Starter Size' },
    { key: 'overload', label: 'Overload' },
    { key: 'mcp_type', label: 'Motor Circuit Protector type HMCP' },
    { key: 'conduit_size', label: 'Conduit Size' },
    { key: 'awg', label: '(AWG)' },
    { key: 'awg_gnd', label: '(AWG GND)' },
  ]

  const parseData = (row) => ({
    motor_hp: row.motor_hp,
    nema_amp: row.nema_amp,
    starter_size: row.starter_size,
    overload: row.overload,
    mcp_type: row.mcp_type,
    conduit_size: row.conduit_size,
    awg: row.awg,
    awg_gnd: row.awg_gnd,
    mcs_id: row.id,
  })

  const fetchTable = () => {
    setLoading(true)
    api
      .get(GET_MCS)
      .then((mcss) => {
        setRows(mcss.map(parseData))
        setLoading(false)
      })
      .catch(() => {
        toast.error('Something went wrong fetching MCS data', { autoClose: 3000 }) // UPDATED
      })
  }

  useEffect(() => {
    fetchTable()
  }, [])

  const handleDelete = (id) => {
    api
      .delete(MCS, { data: { id } })
      .then(() => {
        toast.success('MCS Removed.', { autoClose: 3000 }) // UPDATED
        fetchTable()
      })
      .catch(() => {
        toast.error('Something went wrong. Try again.', { autoClose: 3000 }) // UPDATED
      })
  }

  return (
    <CRow>
      <CCol xs="12" sm="12">
        {collapsed && (
          <CCard>
            <CCardHeader>
              Motor Cheat Sheet 480V
              <div className="card-header-actions">
                <CButton color="link" onClick={() => setCollapsed(!collapsed)}>
                  <CIcon icon={collapsed ? 'cil-arrow-top' : 'cil-arrow-bottom'} />
                </CButton>
              </div>
            </CCardHeader>
            <CCollapse visible={collapsed}>
              <CCardBody>
                <CTable hover striped responsive>
                  <CTableHead>
                    <CTableRow>
                      {fields.map((field) => (
                        <CTableHeaderCell key={field.key}>{field.label}</CTableHeaderCell>
                      ))}
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {rows.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{item.motor_hp}</CTableDataCell>
                        <CTableDataCell>{item.nema_amp}</CTableDataCell>
                        <CTableDataCell>{item.starter_size}</CTableDataCell>
                        <CTableDataCell>{item.overload}</CTableDataCell>
                        <CTableDataCell>{item.mcp_type}</CTableDataCell>
                        <CTableDataCell>{item.conduit_size}</CTableDataCell>
                        <CTableDataCell>{item.awg}</CTableDataCell>
                        <CTableDataCell>{item.awg_gnd}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="danger" onClick={() => handleDelete(item.mcs_id)}>
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCollapse>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default MCSCrud