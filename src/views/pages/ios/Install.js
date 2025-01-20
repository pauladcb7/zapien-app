import React from 'react'
import { CCol, CRow, CImage } from '@coreui/react'

const Install = () => {
  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" lg="4" className="p-0">
          <div className="text-center">
            <CImage
              align="center"
              fluid
              className="img-fluid"
              src={'tutorial/aths1.png'}
              alt="Tutorial Image 1"
            />
          </div>
        </CCol>
        <CCol xs="12" sm="12" lg="4" className="p-0">
          <div className="text-center">
            <CImage
              align="center"
              fluid
              className="img-fluid"
              src={'tutorial/aths2.png'}
              alt="Tutorial Image 2"
            />
          </div>
        </CCol>
        <CCol xs="12" sm="12" lg="4" className="p-0">
          <div className="text-center">
            <CImage
              align="center"
              fluid
              className="img-fluid"
              src={'tutorial/aths3.png'}
              alt="Tutorial Image 3"
            />
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default Install
