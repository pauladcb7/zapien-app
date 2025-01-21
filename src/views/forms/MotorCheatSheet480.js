import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useToasts } from 'react-toast-notifications'
import { api } from '../../helpers/api'
import { GET_MCS } from '../../helpers/urls/index'
import { useSelector } from 'react-redux'

const MotorCheatSheet480 = () => {
  const [mcss, setMCSs] = useState([])
  const { addToast } = useToasts()

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await api.get(GET_MCS)
        const formattedData = response.map((mcs) => ({
          motor_hp: mcs.motor_hp || '',
          nema_amp: mcs.nema_amp || '',
          starter_size: mcs.starter_size || '',
          overload: mcs.overload || '',
          mcp_type: mcs.mcp_type || '',
          conduit_size: mcs.conduit_size || '',
          awg: mcs.awg || '',
          awg_gnd: mcs.awg_gnd || '',
        }))
        setMCSs(formattedData)
      } catch (error) {
        console.error('Error fetching MCS data:', error)
        addToast('Something went wrong getting MCS data', {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    }

    fetchTable()
  }, [addToast])

  const fields = [
    { key: 'motor_hp', label: 'Motor HP' },
    { key: 'nema_amp', label: 'NEMA Amp' },
    { key: 'starter_size', label: 'Starter Size' },
    { key: 'overload', label: 'Overload' },
    { key: 'mcp_type', label: 'MCP Type' },
    { key: 'conduit_size', label: 'Conduit Size' },
    { key: 'awg', label: 'AWG' },
    { key: 'awg_gnd', label: 'AWG Ground' },
  ]

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>Motor Cheat Sheet 480V</CCardHeader>
          <CCardBody>
            <CTable hover striped responsive>
              <CTableHead>
                <CTableRow>
                  {fields.map((field) => (
                    <CTableHeaderCell key={field.key}>{field.label}</CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {mcss.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item.motor_hp}</CTableDataCell>
                    <CTableDataCell>{item.nema_amp}</CTableDataCell>
                    <CTableDataCell>{item.starter_size}</CTableDataCell>
                    <CTableDataCell>{item.overload}</CTableDataCell>
                    <CTableDataCell>{item.mcp_type}</CTableDataCell>
                    <CTableDataCell>{item.conduit_size}</CTableDataCell>
                    <CTableDataCell>{item.awg}</CTableDataCell>
                    <CTableDataCell>{item.awg_gnd}</CTableDataCell>
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

export default MotorCheatSheet480
