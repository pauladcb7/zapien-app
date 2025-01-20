import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CTable,
  CTableRow,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useToasts } from 'react-toast-notifications'
import { api } from '../../helpers/api'
import {
  SAVE_MATERIAL_REQUISITION,
  GET_MATERIAL_REQUISITION_BY_EMPLOYEE,
} from '../../helpers/urls/index'
import { useSelector } from 'react-redux'
import arrayMutators from 'final-form-arrays'
import { Field, Form } from 'react-final-form'
import moment from 'moment'

const required = (value) => (value ? undefined : 'Required')

const MaterialRequisitionForm = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [showElements, setShowElements] = useState(true)
  const [details, setDetails] = useState([])
  const [rows, setRow] = useState([{}, {}, {}, {}])
  const [visible, setVisible] = useState(false)
  const { addToast } = useToasts()
  const [initialValues, setInitialValue] = useState({})
  const [materialReqId, setMaterialReqId] = useState([])
  const user = useSelector((state) => state.user)
  const [materialReqList, setMaterialReqList] = useState([])

  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim()

  useEffect(() => {
    fetchTable()
    setInitialValue({
      requestedBy: fullName,
      entryDate: moment().format('YYYY-MM-DD'),
    })
  }, [])

  const fetchTable = () => {
    api.get(GET_MATERIAL_REQUISITION_BY_EMPLOYEE).then((materialReq) => {
      materialReq.forEach((mr) => {
        mr.entryDate = moment(mr.entryDate).format('YYYY-MM-DD')
        mr.needBy = moment(mr.needBy).format('YYYY-MM-DD')
        mr.requestedBy = `${mr.requestedBy?.firstName} ${mr.requestedBy?.lastName}`
      })
      setMaterialReqList(materialReq)
    })
  }

  const onSubmit = (e, form) => {
    api
      .post(SAVE_MATERIAL_REQUISITION, {
        data: {
          material_requisition_id: e.id || '-1',
          job_name: e.jobName,
          job_location: e.jobLocation,
          requested_by: e.requestedBy,
          entry_date: e.entryDate,
          need_by: e.needBy,
          description: e.description,
          material_requisition_details: e.materialDetails?.map((md) => ({
            ...md,
            quantity: md.quantity || '',
            size: md.size || '',
            partNumber: md.partNumber || '',
            itemDescription: md.itemDescription || '',
          })),
          status: e.status,
          header_date: moment(e.entryDate).format('dddd, MMMM DD, YYYY'),
        },
      })
      .then((result) => {
        setMaterialReqId(result?.id)
        setVisible(false)
        fetchTable()
        form.reset({
          requestedBy: fullName,
          entryDate: moment().format('YYYY-MM-DD'),
        })

        addToast('Material Requisition Submitted.', {
          appearance: 'success',
          autoDismiss: true,
        })
      })
      .catch((error) => {
        console.error(error)
        addToast('Something went wrong creating Material Requisition. Try again.', {
          appearance: 'error',
          autoDismiss: true,
        })
      })
  }

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12">
          <CCard>
            <CCardHeader>
              Material Requisitions
              <div className="card-header-actions">
                <CButton
                  color="success"
                  size="sm"
                  onClick={() => {
                    setInitialValue({
                      requestedBy: fullName,
                      entryDate: moment().format('YYYY-MM-DD'),
                    })
                    setVisible(!visible)
                  }}
                >
                  Create
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable hover striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Edit</CTableHeaderCell>
                    <CTableHeaderCell>Print</CTableHeaderCell>
                    <CTableHeaderCell>Job Name</CTableHeaderCell>
                    <CTableHeaderCell>Job Location</CTableHeaderCell>
                    <CTableHeaderCell>Entry Date</CTableHeaderCell>
                    <CTableHeaderCell>Need By</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {materialReqList.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          size="sm"
                          onClick={() => {
                            setInitialValue({ ...item, test: Symbol() })
                            setVisible(true)
                          }}
                        >
                          <CIcon name="cil-pencil" />
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="dark"
                          size="sm"
                          onClick={() => {
                            materialRequisitionPrint({
                              jobLocation: item.jobLocation,
                              jobName: item.jobName,
                              needBy: item.needBy,
                              requestedBy: item.requestedBy,
                              materialRequisitionDetails: item.materialDetails,
                              todayDate: item.entryDate,
                            })
                          }}
                        >
                          <CIcon name="cil-print" />
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>{item.jobName}</CTableDataCell>
                      <CTableDataCell>{item.jobLocation}</CTableDataCell>
                      <CTableDataCell>{item.entryDate}</CTableDataCell>
                      <CTableDataCell>{item.needBy}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={item.status === 'OPEN' ? 'success' : 'danger'}>
                          {item.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CModal show={visible} onClose={() => setVisible(false)} closeOnBackdrop={false}>
          <CModalHeader closeButton>
            <CModalTitle>Create / Edit Material Requisition</CModalTitle>
          </CModalHeader>
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            mutators={{
              ...arrayMutators,
              setValue: ([field, value], state, { changeValue }) => {
                changeValue(state, field, () => value)
              },
            }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <CModalBody>
                  <CRow>{/* Additional fields here */}</CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                  <CButton color="success" type="submit">
                    Save Changes
                  </CButton>
                </CModalFooter>
              </form>
            )}
          />
        </CModal>
      </CRow>
    </>
  )
}

export default MaterialRequisitionForm
