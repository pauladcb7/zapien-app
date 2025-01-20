/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react'
import {
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CListGroup,
  CListGroupItem,
  CBadge,
  CToast,
  CToaster,
  CToastHeader,
  CToastBody,
  CToastClose,
} from '@coreui/react'

const SimpleToast = ({ message, color, autohide = true }) => {
  return (
    <CToast
      autohide={autohide}
      visible={true}
      color={color}
      className="text-white align-items-center"
    >
      <div className="d-flex">
        <CToastBody>{message}</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )
}

export default SimpleToast
