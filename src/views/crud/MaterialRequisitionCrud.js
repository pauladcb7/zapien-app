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
import { materialRequisitionPrint } from 'src/utils/materialRequisitionPrint'
import { GET_MATERIAL_REQUISITION, MATERIAL_REQUISITION } from 'src/helpers/urls'
import { api } from 'src/helpers/api'
import moment from 'moment'
import { toast } from 'react-toastify' // UPDATED

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

const MaterialRequisitionCrud = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])

  const metadata = [
    {
      key: 'jobName',
      label: 'Job Name',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
      required: true,
    },
    {
      key: 'jobLocation',
      label: 'Job Location',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
      required: true,
    },
    {
      key: 'employeeName',
      label: 'Employee Name',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '190px' },
      required: true,
    },
    {
      key: 'entryDate',
      label: 'Entry Date',
      type: 'date',
      sorter: false,
      filter: false,
      _style: { minWidth: '100px' },
      required: true,
    },
    {
      key: 'needBy',
      label: 'Need By',
      type: 'date',
      sorter: false,
      filter: false,
      _style: { minWidth: '100px' },
      required: true,
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      sorter: false,
      filter: false,
      _style: { minWidth: '160px' },
    },
    {
      key: 'status',
      label: 'Status',
      type: 'text',
      sorter: false,
      filter: false,
      custom: (item) => (
        <td>
          <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
        </td>
      ),
      _style: { minWidth: '160px' },
    },
    {
      key: 'materialDetails',
      label: 'Job Details',
      type: 'array',
      shape: [
        { key: 'id', type: 'idNumeric' },
        { key: 'quantity', type: 'text', _style: { minWidth: '160px' } },
        { key: 'size', type: 'text', _style: { minWidth: '160px' } },
        { key: 'partNumber', type: 'text', _style: { minWidth: '160px' } },
        { key: 'itemDescription', type: 'text', _style: { minWidth: '160px' } },
      ],
      sorter: false,
      filter: false,
      _style: { minWidth: '160px' },
      hide: true,
    },
  ]

  const fetchTable = async () => {
    setLoading(true)
    try {
      const materialRequisition = await api.get(GET_MATERIAL_REQUISITION)
      setRows(
        (materialRequisition || []).map((mr) => ({
          ...mr,
          entryDate: moment(mr.entryDate).format('YYYY-MM-DD'),
          needBy: moment(mr.needBy).format('YYYY-MM-DD'),
          description: mr.description || '',
          employeeName: `${mr.requestedBy?.firstName} ${mr.requestedBy?.lastName}`,
        })),
      )
    } catch {
      toast.error('Error fetching data.', { autoClose: 3000 }) // UPDATED
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (row) => {
    try {
      await api.delete(MATERIAL_REQUISITION, { data: { id: row.id } })
      toast.success('Material Requisition Removed.', { autoClose: 3000 }) // UPDATED
      fetchTable()
    } catch {
      toast.error('Something went wrong. Try again.', { autoClose: 3000 }) // UPDATED
    }
  }

  useEffect(() => {
    fetchTable()
  }, [])

  return (
    <CRow>
      <CCol xs="12" sm="12">
        <CCard>
          <CCardHeader>
            Material Requisition
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
                title="Material Requisition"
                rows={rows}
                metadata={metadata}
                onEdit={() => {}}
                onRefreshTable={fetchTable}
                onCreate={() => {}}
                onDelete={onDelete}
                addOption={(row) => (
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => {
                      materialRequisitionPrint({
                        jobName: row.jobName,
                        description: row.description,
                        jobLocation: row.jobLocation,
                        requestedBy: `${row.requestedBy.firstName || ''} ${
                          row.requestedBy.lastName || ''
                        }`,
                        todayDate: row.entryDate,
                        needBy: row.needBy,
                        materialRequisitionDetails: row.materialDetails,
                      })
                    }}
                  >
                    <CIcon width={24} icon="cil-print" />
                  </CButton>
                )}
              />
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MaterialRequisitionCrud