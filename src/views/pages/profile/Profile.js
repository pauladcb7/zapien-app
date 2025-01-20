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
  CFormInput,
  CFormFeedback,
  CInputGroup,
  CInputGroupText,
  CFormLabel,
  CRow,
  CImage,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useToasts } from 'react-toast-notifications'
import { api } from '../../../helpers/api'
import { USER_UPDATE, TEST } from '../../../helpers/urls/index'
import { useSelector, useDispatch } from 'react-redux'
import { Field, Form } from 'react-final-form'

const required = (value) => (value ? undefined : 'Required')

const Profile = () => {
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(true)
  const { addToast } = useToasts()
  const user = useSelector((state) => state.user)

  const refreshUserData = () => {
    api.get(TEST).then((data) => {
      dispatch({
        type: 'SET_USER',
        user: {
          ...user,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          address: data.address,
          profile_img: data.profile_img,
        },
      })
    })
  }

  useEffect(() => {
    refreshUserData()
  }, [])

  const onSubmit = (e) => {
    api
      .post(USER_UPDATE, {
        data: {
          first_name: e.firstName,
          last_name: e.lastName,
          phone_number: e.phoneNumber,
          address: e.address,
          profile_img: e.profileImg,
        },
      })
      .then(() => {
        refreshUserData()
        addToast('Information Updated.', { appearance: 'success', autoDismiss: true })
      })
      .catch(() => {
        addToast('Something went wrong updating Your Information. Try again.', {
          appearance: 'error',
          autoDismiss: true,
        })
      })
  }

  const PersonalInformation = () => (
    <CRow className="pt-2">
      <CCol xs="12">
        <Form
          onSubmit={onSubmit}
          initialValues={{
            firstName: user.first_name,
            lastName: user.last_name,
            emailAddress: user.email,
            phoneNumber: user.phone_number,
            address: user.address,
            profileImg: user.profile_img,
          }}
          render={({ handleSubmit, valid }) => (
            <form onSubmit={handleSubmit}>
              <CCard>
                <CCollapse visible={collapsed} timeout={1000}>
                  <CCardBody>
                    <CRow>
                      <CCol lg="8">
                        <strong>Personal Information</strong>
                        <hr style={{ borderTop: '2px solid red', marginTop: '8px' }} />
                        <CRow>
                          <CCol sm="6">
                            <Field name="firstName" validate={required}>
                              {({ input, meta }) => (
                                <>
                                  <CFormLabel htmlFor="firstName">First Name</CFormLabel>
                                  <CFormInput
                                    {...input}
                                    id="firstName"
                                    invalid={meta.invalid && meta.touched}
                                    placeholder="First Name"
                                  />
                                  {meta.touched && meta.error && (
                                    <CFormFeedback invalid>
                                      Please provide valid information
                                    </CFormFeedback>
                                  )}
                                </>
                              )}
                            </Field>
                          </CCol>
                          <CCol sm="6">
                            <Field name="lastName" validate={required}>
                              {({ input, meta }) => (
                                <>
                                  <CFormLabel htmlFor="lastName">Last Name</CFormLabel>
                                  <CFormInput
                                    {...input}
                                    id="lastName"
                                    invalid={meta.invalid && meta.touched}
                                    placeholder="Last Name"
                                  />
                                  {meta.touched && meta.error && (
                                    <CFormFeedback invalid>
                                      Please provide valid information
                                    </CFormFeedback>
                                  )}
                                </>
                              )}
                            </Field>
                          </CCol>
                        </CRow>
                        <Field name="emailAddress">
                          {({ input }) => (
                            <>
                              <CFormLabel>Email Address</CFormLabel>
                              <CInputGroup>
                                <CInputGroupText>@</CInputGroupText>
                                <CFormInput
                                  {...input}
                                  readOnly
                                  placeholder="example@domain.com"
                                  type="email"
                                />
                              </CInputGroup>
                            </>
                          )}
                        </Field>
                        <Field name="phoneNumber">
                          {({ input }) => (
                            <>
                              <CFormLabel>Phone Number</CFormLabel>
                              <CInputGroup>
                                <CInputGroupText>
                                  <CIcon name="cil-phone" />
                                </CInputGroupText>
                                <CFormInput {...input} placeholder="(000) 000-0000" type="text" />
                              </CInputGroup>
                            </>
                          )}
                        </Field>
                        <Field name="address">
                          {({ input }) => (
                            <>
                              <CFormLabel>Address</CFormLabel>
                              <CInputGroup>
                                <CInputGroupText>
                                  <CIcon name="cil-location-pin" />
                                </CInputGroupText>
                                <CFormInput {...input} placeholder="Address" type="text" />
                              </CInputGroup>
                            </>
                          )}
                        </Field>
                      </CCol>
                      <CCol lg="4">
                        <strong>Profile Image</strong>
                        <hr style={{ borderTop: '2px solid red', marginTop: '8px' }} />
                        <div className="text-center">
                          <CImage
                            fluid
                            className="rounded-circle"
                            width={200}
                            height={200}
                            src={user.profile_img || 'avatars/profile_photo.png'}
                            alt={user.email}
                          />
                        </div>
                        <div className="text-center mt-2">
                          <CFormLabel>Change Image</CFormLabel>
                          <Field name="profileImg">
                            {({ input }) => (
                              <CFormInput
                                type="file"
                                onChange={(e) => {
                                  const reader = new FileReader()
                                  reader.readAsDataURL(e.target.files[0])
                                  reader.onload = () => input.onChange(reader.result)
                                }}
                              />
                            )}
                          </Field>
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCollapse>
                <CCardFooter>
                  <CButton block color="danger" type="submit" size="lg" disabled={!valid}>
                    <CIcon name="cil-save" /> Save
                  </CButton>
                </CCardFooter>
              </CCard>
            </form>
          )}
        />
      </CCol>
    </CRow>
  )

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardBody>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink active>Personal Information</CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane>
                <PersonalInformation />
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile
