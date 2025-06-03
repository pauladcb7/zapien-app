import React from 'react'
import { Navigate } from 'react-router-dom'
const TimeCards = React.lazy(() => import('./views/forms/TimeCards'))
const MaterialRequisitionForm = React.lazy(() => import('./views/forms/MaterialRequisitionForm'))
const WorkOrder = React.lazy(() => import('./views/forms/WorkOrder'))
const CircuitDirectoryBusiness = React.lazy(() => import('./views/forms/CircuitDirectoryBusiness'))
const CircuitDirectoryHome = React.lazy(() => import('./views/forms/CircuitDirectoryHome'))
const CircuitDirectorySelector = React.lazy(() => import('./views/forms/CircuitDirectorySelector'))
const WorkOrdersCrud = React.lazy(() => import('./views/crud/WorkOrdersCrud'))
const TimeCardCrud = React.lazy(() => import('./views/crud/TimeCardCrud'))
const MaterialRequisitionCrud = React.lazy(() => import('./views/crud/MaterialRequisitionCrud'))
const SafetySheetsCrud = React.lazy(() => import('./views/crud/SafetySheetsCrud'))
const CircuitDirectoryCrud = React.lazy(() => import('./views/crud/CircuitDirectoryCrud'))
const SignSheet = React.lazy(() => import('./views/forms/SignSheet'))
const ListSheet = React.lazy(() => import('./views/forms/ListSheet'))
const SheetCreate = React.lazy(() => import('./views/forms/SheetCreate'))
const Jobs = React.lazy(() => import('./views/forms/Jobs'))
const JobsCrud = React.lazy(() => import('./views/crud/JobsCrud'))
const MCS = React.lazy(() => import('./views/forms/MotorCheatSheet480'))
const MCSCrud = React.lazy(() => import('./views/crud/MCSCrud'))
const Profile = React.lazy(() => import('./views/pages/profile/Profile'))
const CircuitDirectoryBusiness208 = React.lazy(
  () => import('./views/forms/CircuitDirectoryBusiness208'),
)
const CircuitDirectoryBusiness480 = React.lazy(
  () => import('./views/forms/CircuitDirectoryBusiness480'),
)
const InstallIOs = React.lazy(() => import('./views/pages/ios/Install'))
const ReceiptsCrud = React.lazy(() => import('./views/crud/ReceiptsCrud'))
const Receipts = React.lazy(() => import('./views/forms/Receipts'))

// Lazy loaded components
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))
const Users = React.lazy(() => import('./views/users/Users'))
const User = React.lazy(() => import('./views/users/User'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const DashboardOld = React.lazy(() => import('./views/dashboard/Dashboard_old'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
  { path: '/dashboard-old', name: 'DashboardOld', element: <DashboardOld /> },

  // Forms
  { path: '/timecards/create', name: 'Time Cards', element: <TimeCards /> },
  { path: '/work-order/create', name: 'Work Order', element: <WorkOrder /> },
  { path: '/safety-sheets/list', name: 'List Sheet', element: <ListSheet /> },
  { path: '/safety-sheets/sign/:idFile', name: 'Sign Sheet', element: <SignSheet /> },
  { path: '/safety-sheets', name: 'Safety Sheets', element: <SafetySheetsCrud /> },
  { path: '/report/work-order', name: 'Report Work Order', element: <WorkOrdersCrud /> },
  { path: '/report/time-card', name: 'Time Cards', element: <TimeCardCrud /> },
  {
    path: '/report/material-requisition',
    name: 'Material Requisition',
    element: <MaterialRequisitionCrud />,
  },
  {
    path: '/report/circuit-directory',
    name: 'Circuit Directory',
    element: <CircuitDirectoryCrud />,
  },

  {
    path: '/material-requisition/create',
    name: 'Material Requisition Form',
    element: <MaterialRequisitionForm />,
  },
  {
    path: '/circuit-directory/selector',
    name: 'Circuit Directory Selector',
    element: <CircuitDirectorySelector />,
  },
  {
    path: '/circuit-directory-business/create',
    name: 'Circuit Directory Business',
    element: <CircuitDirectoryBusiness />,
  },
  {
    path: '/circuit-directory-business-208/create',
    name: 'Circuit Directory Business 208V',
    element: <CircuitDirectoryBusiness208 />,
  },
  {
    path: '/circuit-directory-business-480/create',
    name: 'Circuit Directory Business 480V',
    element: <CircuitDirectoryBusiness480 />,
  },
  {
    path: '/circuit-directory-home/create',
    name: 'Circuit Directory Home',
    element: <CircuitDirectoryHome />,
  },
  { path: '/sheet/create', name: 'Create Document', element: <SheetCreate /> },
  { path: '/profile', name: 'Profile', element: <Profile /> },
  { path: '/jobs/edition', name: 'Jobs Edit', element: <JobsCrud /> },
  { path: '/jobs', name: 'Jobs', element: <Jobs /> },
  { path: '/mcs/edition', name: 'Motor Cheat Sheet 480V Edit', element: <MCSCrud /> },
  { path: '/mcs', name: 'Motor Cheat Sheet 480V', element: <MCS /> },
  { path: '/install-ios', name: 'Install App on IOs', element: <InstallIOs /> },
  { path: '/report/receipts', name: 'Receipts', element: <ReceiptsCrud /> },
  { path: '/receipts/create', name: 'Receipts', element: <Receipts /> },

  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
  { path: '/theme', name: 'Theme', element: <Colors /> },
  { path: '/theme/colors', name: 'Colors', element: <Colors /> },
  { path: '/theme/typography', name: 'Typography', element: <Typography /> },
  { path: '/base', name: 'Base', element: <Cards /> },
  // { path: '/base/accordion', name: 'Accordion', element: Accordion },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', element: Cards },
  // { path: '/base/carousels', name: 'Carousel', element: Carousels },
  // { path: '/base/collapses', name: 'Collapse', element: Collapses },
  // { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  // { path: '/base/navs', name: 'Navs', element: Navs },
  // { path: '/base/paginations', name: 'Paginations', element: Paginations },
  // { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  // { path: '/base/popovers', name: 'Popovers', element: Popovers },
  // { path: '/base/progress', name: 'Progress', element: Progress },
  // { path: '/base/spinners', name: 'Spinners', element: Spinners },
  // { path: '/base/tabs', name: 'Tabs', element: Tabs },
  // { path: '/base/tables', name: 'Tables', element: Tables },
  // { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  // { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  // { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  // { path: '/charts', name: 'Charts', element: Charts },
  // { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  // { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  // { path: '/forms/select', name: 'Select', element: Select },
  // { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  // { path: '/forms/range', name: 'Range', element: Range },
  // { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  // { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  // { path: '/forms/layout', name: 'Layout', element: Layout },
  // { path: '/forms/validation', name: 'Validation', element: Validation },
  // { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', element: Flags },
  // { path: '/icons/brands', name: 'Brands', element: Brands },
  // { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  // { path: '/notifications/badges', name: 'Badges', element: Badges },
  // { path: '/notifications/modals', name: 'Modals', element: Modals },
  // { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  // { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
