import React, { useState } from 'react'
import { CButton, CCol, CCollapse, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

const CircuitDirectorySelector = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <CRow>
        <CCol sm="12" xs="6">
          <CButton
            onClick={() => setCollapsed(!collapsed)}
            color="dark"
            type="button"
            size="lg"
            style={{ width: '100%' }}
          >
            <CIcon icon="cil-building" size="lg" /> Business
          </CButton>

          <CCol className="p-2">
            <CCollapse visible={collapsed} timeout={2000}>
              <CButton
                onClick={() => navigate('/circuit-directory-business-208/create')}
                color="dark"
                type="button"
                size="lg"
                style={{ width: '100%' }}
              >
                <strong style={{ color: 'black' }}>l</strong>{' '}
                <strong style={{ color: 'red' }}>l</strong>{' '}
                <strong style={{ color: 'blue' }}>l</strong> 208 Volt
              </CButton>
              <CButton
                onClick={() => navigate('/circuit-directory-business-480/create')}
                color="dark"
                type="button"
                size="lg"
                style={{ width: '100%' }}
              >
                <strong style={{ color: 'brown' }}>l</strong>{' '}
                <strong style={{ color: 'orange' }}>l</strong>{' '}
                <strong style={{ color: 'yellow' }}>l</strong> 480 Volt
              </CButton>
            </CCollapse>
          </CCol>
        </CCol>
        <CCol sm="12" xs="6">
          <CButton
            onClick={() => navigate('/circuit-directory-home/create')}
            color="dark"
            type="button"
            size="lg"
            style={{ width: '100%' }}
          >
            <CIcon icon="cil-home" size="lg" /> Home
          </CButton>
        </CCol>
      </CRow>
    </>
  )
}

export default CircuitDirectorySelector
