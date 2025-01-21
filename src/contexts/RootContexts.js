import React from 'react'
import { ConfirmationRoot } from './ConfirmationContext'

// eslint-disable-next-line react/prop-types
export function RootContext({ children }) {
  return <ConfirmationRoot>{children}</ConfirmationRoot>
}

export default RootContext
