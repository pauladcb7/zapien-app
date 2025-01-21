/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { isLogged } from '../utils'

export const PrivateRoute = ({ children }) => {
  const user = useSelector((store) => store.user)

  // If the user is not logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" />
  }

  // If the user is logged in, render the requested component (children)
  return children ? children : <Outlet />
}
