import React, { useState } from 'react'
import {
  CButton,
  CButtonGroup,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormFeedback,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Field, Form } from 'react-final-form'
import ESignature from 'src/components/SignaturePad'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import moment from 'moment'

const required = (value) => (value ? undefined : 'Required')

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const CrudTable = ({
  rows = [
    {
      id: 1,
      name: 'John',
      lastName: 'Doe',
    },
  ],
  metadata = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      sorter: false,
      filter: true,
      hide: false,
    },
  ],
  title = '',
  onEdit = () => {},
  onDelete = () => {},
  onCreate = () => {},
  onRead = () => {},
  onRefreshTable = () => {},
  addOption = () => null,
  loading,
  disableDelete,
  disableEdit,
  customAddForm: AddForm,
  onAddRow,
}) => {
  const [modal, setModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)

  async function onSubmit(newData) {
    if (selectedData) {
      await onEdit(selectedData, newData)
    } else {
      await onCreate(newData)
    }
    await onRefreshTable()
    setModal(false)
  }

  function validate() {}

  return (
    <>
      <CButton
        color="dark"
        onClick={() => {
          setSelectedData(null)
          setModal(true)
          onAddRow && onAddRow()
        }}
      >
        <CIcon icon="cil-plus" size="lg" /> Add Row
      </CButton>{' '}
      <CButton
        color="dark"
        onClick={async () => {
          await onRefreshTable()
        }}
      >
        <CIcon icon="cil-sync" size="lg" />
      </CButton>
      <CTable hover responsive striped>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Actions</CTableHeaderCell>
            {metadata
              .filter((field) => !field.hide)
              .map((field) => (
                <CTableHeaderCell key={field.key}>{field.label}</CTableHeaderCell>
              ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {rows.map((item, index) => (
            <CTableRow key={index}>
              <CTableDataCell>
                <CButtonGroup>
                  {!disableEdit && (
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => {
                        setSelectedData(item)
                        setModal(true)
                        onRead(item)
                      }}
                    >
                      <CIcon icon="cil-pencil" width={24} />
                    </CButton>
                  )}
                  {!disableDelete && (
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={async () => {
                        await onDelete(item)
                        onRefreshTable()
                      }}
                    >
                      <CIcon icon="cil-trash" width={24} />
                    </CButton>
                  )}
                  {addOption(item, index)}
                </CButtonGroup>
              </CTableDataCell>
              {metadata.map((field) =>
                !field.hide ? (
                  <CTableDataCell key={field.key}>{item[field.key]}</CTableDataCell>
                ) : null,
              )}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CModal
        visible={modal}
        onClose={() => {
          setModal(false)
          setSelectedData(null)
        }}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
        {AddForm ? (
          <AddForm closeModal={() => setModal(false)} />
        ) : (
          <Form
            onSubmit={onSubmit}
            initialValues={selectedData || {}}
            mutators={{ ...arrayMutators }}
            validate={validate}
            render={({ handleSubmit }) => (
              <>
                <form onSubmit={handleSubmit}>
                  <CModalBody>
                    {metadata.map((field) => (
                      <Field
                        key={field.key}
                        name={field.key}
                        validate={field.required ? required : undefined}
                      >
                        {({ input, meta }) => (
                          <div className="mb-3">
                            <CFormLabel>{field.label}</CFormLabel>
                            <CFormInput {...input} invalid={meta.touched && meta.error} />
                            {meta.touched && meta.error && (
                              <CFormFeedback>{meta.error}</CFormFeedback>
                            )}
                          </div>
                        )}
                      </Field>
                    ))}
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="primary" type="submit">
                      {selectedData ? 'Update' : 'Create'}
                    </CButton>
                    <CButton color="secondary" onClick={() => setModal(false)}>
                      Cancel
                    </CButton>
                  </CModalFooter>
                </form>
              </>
            )}
          />
        )}
      </CModal>
    </>
  )
}

export default React.memo(CrudTable)
