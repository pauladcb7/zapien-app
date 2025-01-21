import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormFeedback,
  CRow,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { getBasketTotal } from 'src/reducer/reducer'
import { Field, Form } from 'react-final-form'
import { api } from 'src/helpers/api'

import { LOG_IN, TEST } from '../../../helpers/urls'

const required = (value) => (value ? undefined : 'Required')

const Login = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const total = useSelector(getBasketTotal)
  // const toaster = useRef()
  // const aToast = (message, color) => {
  //   return <SimpleToast message={message} color={color}></SimpleToast>
  // }

  useEffect(() => {}, [])

  const onSubmit = (e) => {
    api
      .post(LOG_IN, {
        user_email: e.username.toLowerCase(),
        user_passwd: e.password,
      })
      .then((token) => {
        api.get(TEST, { headers: { 'x-access-token': token.token } }).then((data) => {
          if (data) {
            console.log('Logged In!!')
            dispatch({
              type: 'SET_USER',
              user: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone_number: data.phone_number,
                address: data.address,
                role: data.role || 'employee',
                profile_img: data.profile_img,
                token: token.token,
              },
            })
          }
        })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Credentials not valid. Try again.', {
          autoClose: 3000,
        })
      })
  }

  const validate = () => {}

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Form
                    onSubmit={onSubmit}
                    validate={validate}
                    render={({ handleSubmit }) => (
                      <CForm onSubmit={handleSubmit}>
                        <CCol md="12" sm="12" lg="12" className="text-center mb-5">
                          <img
                            src="avatars/jspower_logo.png"
                            className="c-avatar-img"
                            alt="JS Power"
                          />
                        </CCol>
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <div className="mb-3">
                          <Field name="username" validate={required}>
                            {({ input, meta }) => (
                              <>
                                <CFormInput
                                  type="text"
                                  placeholder="Username"
                                  autoComplete="username"
                                  {...input}
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CFormFeedback invalid>
                                    Please provide valid information
                                  </CFormFeedback>
                                )}
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="mb-4">
                          <Field name="password" validate={required}>
                            {({ input, meta }) => (
                              <>
                                <CFormInput
                                  type="password"
                                  placeholder="Password"
                                  autoComplete="current-password"
                                  {...input}
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CFormFeedback invalid>
                                    Please provide valid information
                                  </CFormFeedback>
                                )}
                              </>
                            )}
                          </Field>
                        </div>
                        <CRow>
                          <CCol xs="6">
                            <CButton type="submit" color="danger" className="px-4">
                              Login
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    )}
                  />
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
