import React from 'react'
import { useParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import usersData from './UsersData'

const User = () => {
  const { id } = useParams()
  const user = usersData.find((user) => user.id.toString() === id)
  const userDetails = user
    ? Object.entries(user)
    : [
        [
          'id',
          // eslint-disable-next-line react/jsx-key
          <span>
            <CIcon className="text-muted" name="cui-icon-ban" /> Not found
          </span>,
        ],
      ]

  return (
    <CRow>
      <CCol lg={6}>
        <CCard>
          <CCardHeader>User ID: {id}</CCardHeader>
          <CCardBody>
            <table className="table table-striped table-hover">
              <tbody>
                {userDetails.map(([key, value], index) => (
                  <tr key={index.toString()}>
                    <td>{`${key}:`}</td>
                    <td>
                      <strong>{value}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default User
