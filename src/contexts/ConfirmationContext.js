import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react'

const ConfirmationContext = createContext({
  openConfirmation: null,
})

export const useConfirmation = () => useContext(ConfirmationContext)

// eslint-disable-next-line react/prop-types
export function ConfirmationRoot({ children }) {
  const [modal, setModal] = useState(false)
  const [options, setOptions] = useState({})
  const promiseResRef = useRef(null)
  const promiseRejRef = useRef(null)

  const openConfirmation = useCallback((opts) => {
    setOptions(opts)
    setModal(true)
    return new Promise((resolve, reject) => {
      promiseResRef.current = resolve
      promiseRejRef.current = reject
    })
  }, [])

  const close = () => {
    setModal(false)
    promiseRejRef.current?.(false)
  }

  const confirm = () => {
    setModal(false)
    promiseResRef.current?.(true)
  }

  return (
    <ConfirmationContext.Provider value={{ openConfirmation }}>
      {children}
      <CModal visible={modal} onClose={close}>
        <CModalHeader closeButton>{options.title || 'Confirm'}</CModalHeader>
        <CModalBody>{options.message || 'Are you sure?'}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={confirm}>
            Confirm
          </CButton>
          <CButton color="secondary" onClick={close}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </ConfirmationContext.Provider>
  )
}
