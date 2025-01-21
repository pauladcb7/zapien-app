/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { isLogged } from '../utils'

export const LoginRoute = ({ children }) => {
  const user = useSelector((store) => store.user)

  // If the user is logged in, redirect them to the home page
  if (user) {
    return <Navigate to="/" />
  }

  // Otherwise, render the requested component (children)
  return children ? children : <Outlet />
}
