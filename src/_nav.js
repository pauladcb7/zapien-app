import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilClock,
  cilLayers,
  cilSpreadsheet,
  cilTask,
  cilList,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Forms',
  },
  {
    component: CNavItem,
    name: 'Time Cards',
    to: '/timecards/create',
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Work Order',
    to: '/work-order/create',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Material Requisition',
    to: '/material-requisition/create',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Circuit Directory',
    to: '/circuit-directory/selector',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Safety Sheets',
    to: '/safety-sheets/list',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Receipts',
    to: '/receipts/create',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Lists',
  },
  {
    component: CNavItem,
    name: 'Jobs',
    to: '/jobs',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Motor Cheat Sheet 480V',
    to: '/mcs',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
]

export default _nav
