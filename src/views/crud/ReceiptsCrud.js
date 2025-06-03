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
import { SAVE_RECEIPT, DELETE_RECEIPT, GET_RECEIPTS } from 'src/helpers/urls'
import { api } from 'src/helpers/api'
import { toast } from 'react-toastify' // UPDATED
import moment from 'moment'

const ReceiptsCrud = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])

  const metadata = [
    {
      key: 'job_name',
      label: 'Job Name',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
    },
    {
      key: 'job_number',
      label: 'Job Number',
      type: 'number',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
    },
    {
      key: 'work_order',
      label: 'Work Order',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
    },
    {
      key: 'receipt_file',
      label: 'See Receipt',
      type: 'image',
      sorter: false,
      filter: false,
      source: '',
      _style: { minWidth: '120px' },
    },
    {
      key: 'comments',
      label: 'Comments',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
    },
    {
      key: 'user_email',
      label: 'Created By',
      type: 'text',
      sorter: true,
      filter: true,
      _style: { minWidth: '120px' },
    },
    {
      key: 'created_at',
      label: 'Created At',
      type: 'date',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
      required: true,
    },
  ]

  const fetchTable = () => {
    setLoading(true)
    return api.get(GET_RECEIPTS).then((receipts) => {
      setRows(
        (receipts || []).map((row) => ({
          ...row,
          created_at: moment(row.created_at).format('YYYY-MM-DD'),
        })),
      )
      setLoading(false)
    })
  }

  const onDelete = (row) => {
    return api
      .delete(DELETE_RECEIPT, {
        data: { receipt_id: row.receipt_id },
      })
      .then(() => {
        toast.success('Receipt Removed.', { autoClose: true }) // UPDATED
        fetchTable()
      })
      .catch(() => {
        toast.error('Something went wrong. Try again.', { autoClose: true }) // UPDATED
      })
  }

  useEffect(() => {
    fetchTable()
  }, [])

  return (
    <CRow>
      <CCol xs="12" sm="12">
        <CCard>
          <CCardHeader>
            Receipts
            <div className="card-header-actions">
              <CButton
                color="link"
                className="card-header-action"
                onClick={() => setCollapsed(!collapsed)}
              >
                <CIcon icon={collapsed ? 'cil-chevron-bottom' : 'cil-chevron-top'} />
              </CButton>
            </div>
          </CCardHeader>
          <CCollapse visible={collapsed}>
            <CCardBody>
              <CrudTable
                title="Receipts"
                rows={rows}
                metadata={metadata}
                onRefreshTable={fetchTable}
                loading={loading}
                onEdit={(row, editedRow) => {
                  return api
                    .post(SAVE_RECEIPT, {
                      data: {
                        user_email: editedRow.user_email,
                        user_id: row.user_id,
                        job_name: editedRow.job_name,
                        job_number: editedRow.job_number,
                        work_order: editedRow.work_order,
                        receipt_file: editedRow.receipt_file,
                        created_at: editedRow.created_at,
                        comments: editedRow.comments,
                      },
                    })
                    .then(() => {
                      toast.success('Receipt Submitted.', { autoClose: true }) // UPDATED
                      fetchTable()
                    })
                    .catch(() => {
                      toast.error('Something went wrong. Try again.', { autoClose: true }) // UPDATED
                    })
                }}
                onCreate={(row) => {
                  return api
                    .post(SAVE_RECEIPT, {
                      data: {
                        receipt_id: '-1',
                        user_email: row.user_email,
                        job_name: row.job_name,
                        job_number: row.job_number,
                        work_order: row.work_order,
                        receipt_file: row.receipt_file,
                        created_at: row.created_at,
                        comments: row.comments,
                      },
                    })
                    .then(() => {
                      toast.success('Receipt Submitted.', { autoClose: true }) // UPDATED
                      fetchTable()
                    })
                    .catch(() => {
                      toast.error('Something went wrong. Try again.', { autoClose: true }) // UPDATED
                    })
                }}
                onDelete={onDelete}
              />
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ReceiptsCrud