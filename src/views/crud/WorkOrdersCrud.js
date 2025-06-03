import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormFeedback,
  CFormText,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CWidgetStatsA,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Transition } from 'react-transition-group'
import ESignature from 'src/components/SignaturePad'
import { Form as FinalForm, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { circuitPrint } from 'src/utils/circuitPrint'
import CrudTable from 'src/components/CrudTable'
import { workOrderPrint } from 'src/utils/workOrder'
import { DELETE_WORK_ORDER, GET_WORK_ORDER, SAVE_WORK_ORDER, WORK_TYPES } from 'src/helpers/urls'
import { api } from 'src/helpers/api'
import { toast } from 'react-toastify' // UPDATED
import { useSelector } from 'react-redux'
import moment from 'moment'

const required = (value) => (value ? undefined : 'Required')

const initialArray = []
for (let index = 1; index < 43; index++) {
  const element = { ckt: index, load: '', ckt1: index + 1, load1: '' }
  initialArray.push(element)
  index++
}

const WorkOrdersCrud = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [showElements, setShowElements] = useState(true)
  const [collapseMulti, setCollapseMulti] = useState([false, false])
  const [checkedJobLocations, setCheckedJobLocations] = useState({})
  const [loading, setLoading] = useState(false)
  const [metadata, setMetaData] = useState([
    // ...existing metadata...
  ])

  useEffect(() => {}, [checkedJobLocations])

  const user = useSelector((state) => state.user)

  const handleChange = (event) => {
    setCheckedJobLocations({
      ...checkedJobLocations,
      [event.target.name]: event.target.checked,
    })
  }

  const toggleMulti = (type) => {
    let newCollapse = [...collapseMulti]
    if (type === 'left') {
      newCollapse[0] = !collapseMulti[0]
    } else if (type === 'right') {
      newCollapse[1] = !collapseMulti[1]
    } else if (type === 'both') {
      newCollapse[0] = !collapseMulti[0]
      newCollapse[1] = !collapseMulti[1]
    }
    setCollapseMulti(newCollapse)
  }

  const onSubmit = function (e) {
    circuitPrint({
      date: e.date,
      voltage: e.voltage,
      rows,
    })
  }

  const [rows, setRows] = useState([])

  function onDelete(row, close) {
    return api
      .delete(DELETE_WORK_ORDER, {
        data: { id: row.id },
      })
      .then(() => {
        toast.success('Work Order Removed.', { autoClose: 3000 }) // UPDATED
        fetchTable()
      })
      .catch((err) => {
        console.log(err)
        toast.error('Something went wrong. Try again.', { autoClose: 3000 }) // UPDATED
      })
  }

  function parseData(row) {
    let [first_name, last_name] = row.user_email.split('@')[0].split('.')
    first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1)
    last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1)

    const fullName = row.user_name ? row.user_name : `${first_name} ${last_name}`
    return {
      entryDate: moment(row.entry_date).format('YYYY-MM-DD'),
      workTypeRc: String(row.work_type_rc || 'other'),
      employeeName: fullName,
      startTime: row.start_time,
      endTime: row.end_time,
      jobLocation: row.job_location,
      jobDetails: row.job_details,
      totalCost: row.total_cost,
      customerName: row.customer_name,
      customerPhone: row.customer_phone_number,
      customerAddress: row.customer_address,
      customer_email: row.customer_email,
      id: row.id,
    }
  }

  function fetchTable() {
    setLoading(true)
    return api.get(GET_WORK_ORDER).then((workOrders) => {
      setRows((workOrders || []).map(parseData))
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchTable()
  }, [])

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12">
          <Transition in={showElements} timeout={300} unmountOnExit>
            {(state) => (
              <CCard style={{ transition: 'opacity 300ms', opacity: state === 'entered' ? 1 : 0 }}>
                <CCardHeader>
                  Work Orders
                  <div className="card-header-actions">
                    <CButton
                      color="link"
                      className="card-header-action btn-minimize"
                      onClick={() => setCollapsed(!collapsed)}
                    >
                      <CIcon name={collapsed ? 'cil-arrow-top' : 'cil-arrow-bottom'} />
                    </CButton>
                  </div>
                </CCardHeader>
                <CCollapse visible={collapsed} timeout={1000}>
                  <CCardBody>
                    <CrudTable
                      title="Work Order"
                      rows={rows}
                      metadata={metadata}
                      onRefreshTable={fetchTable}
                      loading={loading}
                      onEdit={(row, editedRow) => {
                        return api
                          .post(SAVE_WORK_ORDER, {
                            data: {
                              work_order_id: row.id,
                              user_id: user.email,
                              entry_date: row.entryDate,
                              start_time: editedRow.startTime,
                              end_time: editedRow.endTime,
                              job_location: editedRow.jobLocation,
                              job_details: editedRow.jobDetails,
                              total_cost: editedRow.totalCost,
                              customer_name: editedRow.customerName,
                              customer_address: editedRow.customerAddress,
                              customer_phone_number: editedRow.customerPhone,
                              customer_email: editedRow.customer_email,
                            },
                          })
                          .then(() => {
                            toast.success('Work Order Submitted.', { autoClose: 3000 }) // UPDATED
                            fetchTable()
                          })
                          .catch((error) => {
                            toast.error('Something went wrong creating Work Order. Try again.', { autoClose: 3000 }) // UPDATED
                            throw error
                          })
                      }}
                      onCreate={(row) => {
                        return api
                          .post(SAVE_WORK_ORDER, {
                            data: {
                              work_order_id: '-1',
                              user_id: user.email,
                              entry_date: row.entryDate,
                              start_time: row.startTime,
                              end_time: row.endTime,
                              job_location: row.jobLocation,
                              job_details: row.jobDetails,
                              total_cost: row.totalCost,
                              customer_name: row.customerName,
                              customer_address: row.customerAddress,
                              customer_phone_number: row.customerPhone,
                              customer_email: row.customer_email,
                            },
                          })
                          .then(() => {
                            toast.success('Work Order Submitted.', { autoClose: 3000 }) // UPDATED
                            fetchTable()
                          })
                          .catch((error) => {
                            toast.error('Something went wrong creating Work Order. Try again.', { autoClose: 3000 }) // UPDATED
                            throw error
                          })
                      }}
                      onDelete={onDelete}
                    />
                  </CCardBody>
                </CCollapse>
              </CCard>
            )}
          </Transition>
        </CCol>
      </CRow>
    </>
  )
}

export default WorkOrdersCrud