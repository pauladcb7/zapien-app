import React, { useState, useEffect } from 'react';
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
  CFormTextarea,
  CFormLabel,
  CRow,
  CSpinner,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CFormCheck,
  CFormFeedback,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { toast } from 'react-toastify';
import { api } from '../../helpers/api';
import { SAVE_WORK_ORDER, WORK_TYPES } from '../../helpers/urls/index';
import { useSelector } from 'react-redux';
import { Field, Form } from 'react-final-form';
import ESignature from 'src/components/SignaturePad';
import { workOrderPrint } from 'src/utils/workOrder';
import moment from 'moment';

// Updated validator with logging and robust check
const required = (value) => {
  console.log('Signature value:', value);
  if (typeof value === 'string' && value.trim().length > 0) return undefined;
  return 'Required';
};

const WorkOrder = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [initialValues] = useState({ date: moment().format('YYYY-MM-DD') });
  const [workTypes, setWorkTypes] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    let isMounted = true;
    api
      .get(WORK_TYPES)
      .then((data) => {
        if (isMounted) setWorkTypes(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        toast.error('Error loading Job Locations. Refresh the page.', {
          autoClose: 3000,
        });
        if (isMounted) setWorkTypes([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = (e) => {
    if (!e.signatureCustomer || !e.signatureEmployee) {
      toast.error('Both signatures are required.', { autoClose: 3000 });
      return;
    }
    setShowModal(true);
    api
      .post(SAVE_WORK_ORDER, {
        data: {
          work_order_id: '-1',
          user_id: user.email,
          entry_date: e.date,
          work_type: e.workType === 'other' ? null : e.workType,
          start_time: e.startTime,
          end_time: e.endTime,
          job_location: e.jobLocation,
          job_details: e.jobDetails,
          total_cost: e.totalCost,
          other: e.otherWorkType || '',
          employee_signature: e.signatureEmployee,
          customer_name: e.customerName,
          customer_address: e.customerAddress,
          customer_phone_number: e.customerPhone,
          customer_email: e.customerEmail,
          customer_signature: e.signatureCustomer,
        },
      })
      .then(() => {
        workOrderPrint({
          ...e,
          customerSignature: e.signatureCustomer,
          employeeSignature: e.signatureEmployee,
        });
        toast.success('Work Order Submitted.', { autoClose: 3000 });
      })
      .catch(() => {
        toast.error('Error creating Work Order. Try again.', {
          autoClose: 3000,
        });
      })
      .finally(() => {
        setShowModal(false);
      });
  };

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12">
          <CCard>
            <CCardHeader>
              Work Order
              <div className="card-header-actions">
                <CButton color="link" onClick={() => setCollapsed((prev) => !prev)}>
                  <CIcon icon={collapsed ? 'cil-arrow-top' : 'cil-arrow-bottom'} />
                </CButton>
              </div>
            </CCardHeader>
            <CCollapse visible={collapsed} timeout={1000}>
              <CCardBody>
                <Form
                  onSubmit={onSubmit}
                  initialValues={initialValues}
                  render={({ handleSubmit }) => (
                    <CForm onSubmit={handleSubmit}>
                      <CRow>
                        <CCol sm="12">
                          <Field name="date" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Date</CFormLabel>
                                <CFormInput
                                  {...input}
                                  type="date"
                                  placeholder="Date"
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CBadge color="danger">{meta.error}</CBadge>
                                )}
                              </div>
                            )}
                          </Field>

                          <div className="mb-3">
                            <CFormLabel>Type of Work</CFormLabel>
                            {(Array.isArray(workTypes) ? workTypes : []).map((wt) => (
                              <Field name="workType" type="radio" value={String(wt.id)} key={wt.id}>
                                {({ input }) => (
                                  <CFormCheck
                                    {...input}
                                    label={wt.value}
                                    type="radio"
                                  />
                                )}
                              </Field>
                            ))}
                            <Field name="workType" type="radio" value="other">
                              {({ input }) => (
                                <CFormCheck
                                  {...input}
                                  label="Other"
                                  type="radio"
                                />
                              )}
                            </Field>
                          </div>

                          <Field name="startTime" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Start Time</CFormLabel>
                                <CFormInput
                                  {...input}
                                  type="time"
                                  placeholder="Start Time"
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CBadge color="danger">{meta.error}</CBadge>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="endTime" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>End Time</CFormLabel>
                                <CFormInput
                                  {...input}
                                  type="time"
                                  placeholder="End Time"
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CBadge color="danger">{meta.error}</CBadge>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="jobLocation" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Job Location</CFormLabel>
                                <CFormInput
                                  {...input}
                                  placeholder="Job Location"
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CBadge color="danger">{meta.error}</CBadge>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="jobDetails" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Job Details</CFormLabel>
                                <CFormTextarea
                                  {...input}
                                  rows="3"
                                  placeholder="Type Here..."
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CBadge color="danger">{meta.error}</CBadge>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="totalCost">
                            {({ input }) => (
                              <div className="mb-3">
                                <CFormLabel>Labor & Material Total</CFormLabel>
                                <CInputGroup>
                                  <CInputGroupText>$</CInputGroupText>
                                  <CFormInput
                                    {...input}
                                    placeholder="00.00"
                                    type="number"
                                    min="0.00"
                                    step="0.01"
                                  />
                                </CInputGroup>
                              </div>
                            )}
                          </Field>

                          <strong>Customer Information</strong>
                          <hr
                            style={{
                              borderColor: 'red',
                              borderTop: '2px solid red',
                              marginTop: '8px',
                            }}
                          />

                          <Field name="customerName" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Customer Full Name</CFormLabel>
                                <CFormInput
                                  {...input}
                                  placeholder="Customer Full Name"
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CBadge color="danger">{meta.error}</CBadge>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="customerAddress" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Customer Address</CFormLabel>
                                <CFormInput
                                  {...input}
                                  placeholder="Customer Address"
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CBadge color="danger">{meta.error}</CBadge>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="customerEmail" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Customer Email</CFormLabel>
                                <CFormInput
                                  {...input}
                                  placeholder="Customer Email"
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CBadge color="danger">{meta.error}</CBadge>
                                )}
                              </div>
                            )}
                          </Field>

                          <Field name="customerPhone" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Customer Phone</CFormLabel>
                                <CFormInput
                                  {...input}
                                  placeholder="Customer Phone"
                                  invalid={meta.invalid && meta.touched}
                                />
                                {meta.touched && meta.error && (
                                  <CBadge color="danger">{meta.error}</CBadge>
                                )}
                              </div>
                            )}
                          </Field>

                          {/* Customer Signature */}
                          <Field name="signatureCustomer" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Customer Signature</CFormLabel>
                                <ESignature value={input.value} onChange={input.onChange} />
                                {meta.touched && meta.error && (
                                  <CFormFeedback invalid style={{ display: 'block' }}>
                                    {meta.error}
                                  </CFormFeedback>
                                )}
                              </div>
                            )}
                          </Field>

                          {/* Employee Signature */}
                          <Field name="signatureEmployee" validate={required}>
                            {({ input, meta }) => (
                              <div className="mb-3">
                                <CFormLabel>Employee Signature</CFormLabel>
                                <ESignature value={input.value} onChange={input.onChange} />
                                {meta.touched && meta.error && (
                                  <CFormFeedback invalid style={{ display: 'block' }}>
                                    {meta.error}
                                  </CFormFeedback>
                                )}
                              </div>
                            )}
                          </Field>
                        </CCol>
                      </CRow>
                      <CCardFooter>
                        <CButton color="danger" size="lg" className="d-block w-100" type="submit">
                          <CIcon icon="cil-save" /> Save
                        </CButton>
                      </CCardFooter>
                    </CForm>
                  )}
                />
              </CCardBody>
            </CCollapse>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="sm">
        <CModalHeader>
          <CModalTitle>Saving Work Order</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CSpinner color="primary" />
          <p>Processing...</p>
        </CModalBody>
      </CModal>
    </>
  );
};

export default WorkOrder;