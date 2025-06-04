import React, { useState, useEffect } from 'react'
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
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toastify'
import { api } from '../../helpers/api'
import {
  SAVE_MATERIAL_REQUISITION,
  GET_MATERIAL_REQUISITION_BY_EMPLOYEE,
} from '../../helpers/urls/index'
import { useSelector } from 'react-redux'
import arrayMutators from 'final-form-arrays'
import { Field, Form } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import moment from 'moment'

const required = (value) => (value ? undefined : 'Required')

const MaterialRequisitionForm = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [showElements, setShowElements] = useState(true)
  const [visible, setVisible] = useState(false)
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
      materialDetails: [{}], // Start with one empty row
    })
  }, [])

  const fetchTable = () => {
    api.get(GET_MATERIAL_REQUISITION_BY_EMPLOYEE).then((materialReq) => {
      if (Array.isArray(materialReq)) {
        materialReq.forEach((mr) => {
          mr.entryDate = moment(mr.entryDate).format('YYYY-MM-DD')
          mr.needBy = moment(mr.needBy).format('YYYY-MM-DD')
          mr.requestedBy = `${mr.requestedBy?.firstName} ${mr.requestedBy?.lastName}`
        })
        setMaterialReqList(materialReq)
      } else {
        setMaterialReqList([]) // or handle error
      }
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
          materialDetails: [{}],
        })

        toast.success('Material Requisition Submitted.', {
          autoClose: 3000,
        })
      })
      .catch((error) => {
        console.error(error)
        toast.error('Something went wrong creating Material Requisition. Try again.', {
          autoClose: 3000,
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
                      materialDetails: [{}],
                      jobName: '',
                      jobLocation: '',
                      needBy: '',
                      description: '',
                      status: 'OPEN',
                    });
                    setVisible(true); // Always open modal
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
                            // You can add your print/download PDF logic here
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
        <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static">
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
                  <CRow>
                    <FieldArray name="materialDetails">
                      {({ fields }) => (
                        <CTable hover striped responsive>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Item Description</CTableHeaderCell>
                              <CTableHeaderCell>Part Number</CTableHeaderCell>
                              <CTableHeaderCell>Size</CTableHeaderCell>
                              <CTableHeaderCell>Quantity</CTableHeaderCell>
                              <CTableHeaderCell>Remove</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {fields.map((name, idx) => (
                              <CTableRow key={name}>
                                <CTableDataCell>
                                  <Field
                                    name={`${name}.itemDescription`}
                                    component="input"
                                    placeholder="Description"
                                    className="form-control"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <Field
                                    name={`${name}.partNumber`}
                                    component="input"
                                    placeholder="Part #"
                                    className="form-control"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <Field
                                    name={`${name}.size`}
                                    component="input"
                                    placeholder="Size"
                                    className="form-control"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <Field
                                    name={`${name}.quantity`}
                                    component="input"
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    className="form-control"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CButton
                                    color="danger"
                                    size="sm"
                                    type="button"
                                    onClick={() => fields.remove(idx)}
                                  >
                                    Remove
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                            <CTableRow>
                              <CTableDataCell colSpan={5}>
                                <CButton
                                  color="primary"
                                  size="sm"
                                  type="button"
                                  onClick={() => fields.push({})}
                                >
                                  Add Material
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      )}
                    </FieldArray>
                  </CRow>
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