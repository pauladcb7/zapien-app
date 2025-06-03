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
import { circuitHPrint, circuitPrint } from 'src/utils/circuitPrint'
import moment from 'moment'
import { GET_CIRCUIT_DIRECTORY, SAVE_CIRCUIT_DIRECTORY, CIRCUIT_DIRECTORY } from 'src/helpers/urls'
import { api } from 'src/helpers/api'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const required = (value) => (value ? undefined : 'Required')

const CircuitDirectoryCrud = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const user = useSelector((state) => state.user)

  useEffect(() => {
    fetchTable()
    // eslint-disable-next-line
  }, [])

  const metadata = [
    {
      key: 'date',
      label: 'Date',
      type: 'date',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
    },
    {
      key: 'type',
      label: 'Type',
      options: [
        { label: 'Business 208V', value: 'BUSINESS_208V' },
        { label: 'Business 480V', value: 'BUSINESS_480V' },
        { label: 'Home', value: 'HOME' },
      ],
      type: 'select',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
    },
    {
      key: 'voltage',
      label: 'Voltage',
      type: 'text',
      sorter: false,
      filter: false,
      _style: { minWidth: '120px' },
    },
    {
      key: 'circuitDirectoryDetails',
      label: 'Details',
      type: 'array',
      hide: true,
      shape: [
        {
          key: 'ckt',
          type: 'idNumeric',
          _style: { width: '20px' },
        },
        {
          key: 'load',
          type: 'text',
          _style: { minWidth: '160px' },
        },
      ],
      sorter: false,
      filter: false,
      _style: { minWidth: '160px' },
    },
  ]

  const fetchTable = () => {
    setLoading(true)
    api.get(GET_CIRCUIT_DIRECTORY).then((circuitDirectory) => {
      setRows(
        (circuitDirectory || []).map((cd) => ({
          ...cd,
          date: moment(cd.entryDate).format('YYYY-MM-DD'),
          voltage: cd.voltage,
          type: cd.circuitType.code,
          circuitDirectoryDetails: cd.circuitDetails,
        })),
      )
      setLoading(false)
    })
  }

  const onDelete = (row) => {
    api
      .delete(CIRCUIT_DIRECTORY, { data: { id: row.id } })
      .then(() => {
        fetchTable()
        toast.success('Circuit Directory Deleted.', { autoClose: 3000 })
      })
      .catch(() => {
        toast.error('Error deleting Circuit Directory.', { autoClose: 3000 })
      })
  }

  return (
    <CRow>
      <CCol xs="12" sm="12">
        <CCard>
          <CCardHeader>
            Circuit Directory
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
                title="Circuit Directory"
                rows={rows}
                metadata={metadata}
                onRefreshTable={fetchTable}
                loading={loading}
                onEdit={async (row, edittedRow) => {
                  try {
                    const e = edittedRow
                    await api.post(SAVE_CIRCUIT_DIRECTORY, {
                      circuit_directory_id: e.id,
                      entry_date: moment(e.entryDate).format('YYYY-MM-DD'),
                      voltage: e.voltage,
                      circuit_type_rc: e.type,
                      circuit_directory_details: e.circuitDirectoryDetails,
                    })
                    toast.success('Circuit Directory Updated.', { autoClose: 3000 })
                    fetchTable()
                  } catch (error) {
                    toast.error('Something went wrong Updating Circuit Directory. Try again.', { autoClose: 3000 })
                    throw Error(error)
                  }
                }}
                onCreate={async (row) => {
                  try {
                    const e = row
                    await api.post(SAVE_CIRCUIT_DIRECTORY, {
                      circuit_directory_id: '-1',
                      entry_date: moment(e.entryDate).format('YYYY-MM-DD'),
                      voltage: e.voltage,
                      circuit_type_rc: e.type,
                      circuit_directory_details: e.circuitDirectoryDetails,
                    })
                    toast.success('Circuit Directory Created.', { autoClose: 3000 })
                    fetchTable()
                  } catch (error) {
                    toast.error('Something went wrong Creating Circuit Directory. Try again.', { autoClose: 3000 })
                    throw Error(error)
                  }
                }}
                onDelete={onDelete}
                addOption={(row) => (
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => {
                      const initialArray = []
                      if (row.type.indexOf('BUSINESS') !== -1) {
                        for (let index = 1; index < 43; index++) {
                          const cd = row.circuitDirectoryDetails.find((d) => d.ckt === index)
                          const cd2 = row.circuitDirectoryDetails.find((d) => d.ckt === index + 1)
                          initialArray.push({
                            ckt: index,
                            load: cd?.load || '',
                            ckt1: index + 1,
                            load1: cd2?.load || '',
                          })
                          index++
                        }
                        circuitPrint({
                          date: row.date,
                          rows: initialArray,
                          voltage: row.voltage,
                        })
                      } else {
                        circuitHPrint({
                          date: row.date,
                          rows: row.circuitDirectoryDetails,
                          voltage: row.voltage,
                        })
                      }
                    }}
                  >
                    <CIcon width={24} name="cil-print" />
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

export default CircuitDirectoryCrud