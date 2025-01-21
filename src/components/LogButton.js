/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFade,
  CForm,
  CFormGroup,
  CFormText,
  CValidFeedback,
  CInvalidFeedback,
  CTextarea,
  CInput,
  CInputFile,
  CInputCheckbox,
  CInputRadio,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CDropdown,
  CInputGroupText,
  CLabel,
  CSelect,
  CRow,
  CSwitch,
  CLink,
  CWidgetIcon,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'

const LogButton = () => {
  const [collapsed, setCollapsed] = React.useState(true)
  const [showElements, setShowElements] = React.useState(true)
  const jobLocations = [
    { name: 'ceres', key: 'jLocation1', label: 'Ceres' },
    { name: 'frito-lay', key: 'jLocation2', label: 'Frito Lay' },
    { name: 'lodi-bowling', key: 'jLocation3', label: 'Lodi Bowling' },
    { name: 'modesto', key: 'jLocation4', label: 'Modesto' },
    { name: 'pepsico', key: 'jLocation5', label: 'PepsiCo' },
    {
      name: 'sensient-livingston',
      key: 'jLocation6',
      label: 'Sensient Livingston',
    },
    { name: 'sensient-turlock', key: 'jLocation7', label: 'Sensient Turlock' },
    { name: 'Other', key: 'jLocation8', label: 'Other' },
  ]
  const [checkedJobLocations, setCheckedJobLocations] = React.useState({})

  useEffect(() => {}, [checkedJobLocations])

  const handleChange = (event) => {
    // updating an object instead of a Map
    setCheckedJobLocations({
      ...checkedJobLocations,
      [event.target.name]: event.target.checked,
      [event.target.name]: event.target.checked,
    })
  }
  return (
    <>
      <CRow>
        <CCol xs="12" sm="6" lg="4">
          <CWidgetIcon
            text="Lunch In"
            header="12:30 p.m."
            color="info"
            iconPadding={false}
            // footerSlot={
            //   <CCardFooter className="card-footer px-3 py-2">
            //     {/* <CLink
            //       className="font-weight-bold font-xs btn-block text-muted"
            //       href="https://coreui.io/"
            //       rel="noopener norefferer"
            //       target="_blank"
            //     >
            //       View more
            //       <CIcon
            //         name="cil-arrow-right"
            //         className="float-right"
            //         width="16"
            //       />
            //     </CLink> */}
            //     <div className="card-header-actions">
            //       <CButton
            //         color="link"
            //         className="card-header-action btn-minimize"
            //         onClick={() => setCollapsed(!collapsed)}
            //       >
            //         <CIcon
            //           name={collapsed ? "cil-arrow-top" : "cil-arrow-bottom"}
            //         />
            //       </CButton>
            //     </div>
            //   </CCardFooter>
            // }
          >
            <CIcon width={24} name="cil-clock" className="mx-5" />
            <CCol md="12">Lunch In</CCol>
          </CWidgetIcon>
        </CCol>

        {/* Lunch In */}
        <CCol xs="12" sm="12">
          <CFade timeout={300} in={showElements} unmountOnExit={true}>
            <CCard>
              <CCardHeader>
                Daily Time Card
                <small> - Lunch In</small>
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
              <CCollapse show={collapsed} timeout={1000}>
                <CCardBody>
                  <CRow>
                    <CCol sm="12">
                      <CFormGroup>
                        <CLabel htmlFor="jobName">Job Name</CLabel>
                        <CInput id="jobName" placeholder="Enter the Job Name" required />
                      </CFormGroup>

                      <CFormGroup row>
                        <CCol md="12">
                          <CLabel>Job Location</CLabel>
                        </CCol>

                        {jobLocations.map((jobLocation) => (
                          <CCol md="6" sm="6">
                            <CFormGroup variant="custom-checkbox" inline>
                              <CInputCheckbox
                                custom
                                id={jobLocation.key}
                                name={jobLocation.name}
                                checked={checkedJobLocations[jobLocation.name]}
                                onChange={handleChange}
                              />
                              <CLabel variant="custom-checkbox" htmlFor={jobLocation.key}>
                                {jobLocation.label}
                              </CLabel>
                            </CFormGroup>
                          </CCol>
                        ))}
                      </CFormGroup>

                      <CFormGroup row>
                        <CCol md="12">
                          <CLabel htmlFor="textarea-input">Type of work in progress</CLabel>
                        </CCol>
                        <CCol xs="12" md="12">
                          <CTextarea
                            name="textarea-input"
                            id="jobDescription"
                            rows="3"
                            placeholder="Enter the type of work in progress..."
                          />
                          <CInvalidFeedback className="help-block">
                            Please provide a valid information
                          </CInvalidFeedback>
                          <CValidFeedback className="help-block">Input provided</CValidFeedback>
                        </CCol>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCollapse>
              <CCardFooter>
                <CButton block color="success" type="submit" size="lg">
                  <CIcon size="lg" name="cil-clock" /> Clock In
                </CButton>
              </CCardFooter>
            </CCard>
          </CFade>
        </CCol>
      </CRow>
    </>
  )
}

export default LogButton
