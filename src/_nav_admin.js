import React from 'react'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilClock,
  cilDescription,
  cilLayers,
  cilSpreadsheet,
  cilTask,
  cilNoteAdd,
  cilList,
} from '@coreui/icons'

const _nav_admin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="c-sidebar-nav-icon" />,
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
    icon: <CIcon icon={cilClock} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Work Order',
    to: '/work-order/create',
    icon: <CIcon icon={cilDescription} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Material Requisition',
    to: '/material-requisition/create',
    icon: <CIcon icon={cilLayers} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Circuit Directory',
    to: '/circuit-directory/selector',
    icon: <CIcon icon={cilSpreadsheet} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Safety Sheets',
    to: '/safety-sheets/list',
    icon: <CIcon icon={cilTask} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Receipts',
    to: '/receipts/create',
    icon: <CIcon icon={cilNoteAdd} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Lists',
    icon: <CIcon icon={cilList} customClassName="c-sidebar-nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Jobs',
        to: '/jobs',
        icon: <CIcon icon={cilList} customClassName="c-sidebar-nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Motor Cheat Sheet 480V',
        to: '/mcs',
        icon: <CIcon icon={cilList} customClassName="c-sidebar-nav-icon" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Reports',
  },
  {
    component: CNavItem,
    name: 'Time Card',
    to: '/report/time-card',
    icon: <CIcon icon={cilClock} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Work Order',
    to: '/report/work-order',
    icon: <CIcon icon={cilDescription} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Material Requisition',
    to: '/report/material-requisition',
    icon: <CIcon icon={cilLayers} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Circuit Directory',
    to: '/report/circuit-directory',
    icon: <CIcon icon={cilSpreadsheet} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Safety Sheets',
    to: '/safety-sheets',
    icon: <CIcon icon={cilTask} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Receipts',
    to: '/report/receipts',
    icon: <CIcon icon={cilNoteAdd} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavItem,
    name: 'Jobs Edition',
    to: '/jobs/edition',
    icon: <CIcon icon={cilList} customClassName="c-sidebar-nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Motor Cheat Sheet Edition',
    to: '/mcs/edition',
    icon: <CIcon icon={cilList} customClassName="c-sidebar-nav-icon" />,
  },
]

export default _nav_admin
