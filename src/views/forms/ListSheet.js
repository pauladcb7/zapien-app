import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Field, Form } from 'react-final-form'
import { workOrderPrint } from 'src/utils/workOrder'
import { useNavigate } from 'react-router-dom'
import { documents } from 'src/constants/files'
import ESignature from 'src/components/SignaturePad'

const required = (value) => (value ? undefined : 'Required')

const ListSheet = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [signatureCustomer, setSignatureCustomer] = useState(null)
  const [signatureEmployee, setSignatureEmployee] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = (formData) => {
    if (signatureCustomer && signatureEmployee) {
      workOrderPrint({
        date: formData.date,
        workType: formData.workType,
        employeeName: formData.employeeName,
        endTime: formData.endTime,
        startTime: formData.startTime,
        totalCost: formData.totalCost,
        jobLocation: formData.jobLocation,
        jobDetails: formData.jobDetails,
        customerSignature: signatureCustomer.toDataURL(),
        employeeSignature: signatureEmployee.toDataURL(),
        customerInformation: formData.clientName,
      })
    }
  }

  return (
    <>
      <CRow>
        <CCol xs="12">
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <CCard>
                  <CCardHeader>
                    Sheet List
                    <div className="card-header-actions">
                      <CButton color="link" onClick={() => setCollapsed(!collapsed)}>
                        <CIcon icon={collapsed ? 'cil-arrow-top' : 'cil-arrow-bottom'} />
                      </CButton>
                    </div>
                  </CCardHeader>
                  <CCollapse visible={collapsed}>
                    <CCardBody>
                      <CTable striped hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Action</CTableHeaderCell>
                            <CTableHeaderCell>File Name</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {documents.map((doc) => (
                            <CTableRow key={doc.id}>
                              <CTableDataCell>
                                <CButton
                                  color="primary"
                                  variant="outline"
                                  shape="square"
                                  size="sm"
                                  onClick={() => navigate(`/safety-sheets/sign/${doc.id}`)}
                                >
                                  <CIcon icon="cil-pencil" /> Sign
                                </CButton>
                              </CTableDataCell>
                              <CTableDataCell>{doc.fileName}</CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCollapse>
                  <CCardFooter />
                </CCard>
              </form>
            )}
          />
        </CCol>
      </CRow>
      <CModal visible={loading} alignment="center">
        <CModalHeader>
          <CModalTitle>Loading</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Loading, please wait...</p>
        </CModalBody>
      </CModal>
    </>
  )
}

export default ListSheet
