export const BASE =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api/";

export const LOG_IN = "login/";
export const TEST = "test/";

/* Time Cards */
export const CREATE_TIME_CARD = "time-card/create/";
export const SAVE_TIME_CARD = "time-card/save/";
export const JOB_LOCATIONS = "time-card-location/get/";
export const GET_TIME_CARD_BY_DAY = "time-card/getTimeCardByDay/";
export const CLOCK_IN = "time-card/clockIn/";
export const CLOCK_OUT = "time-card/clockOut/";
export const LUNCH_IN = "time-card/lunchIn/";
export const LUNCH_OUT = "time-card/lunchOut/";
export const GET_TIME_CARD = "time-card/get";
export const GET_TIME_SHEETS_BY_DAY = "time-card/getTimeSheetsbyUser";
export const DELETE_TIME_CARD = "time-card";
export const DELETE_TIME_ENTRY = "time-entry";

/* Time Entry (Master for Managers) */
export const CREATE_TIME_ENTRY = "time-entry/create/";
export const SAVE_TIME_ENTRY = "time-entry/save/";
export const GET_TIME_ENTRY_BY_DAY = "time-entry/getTimeEntryByDay/";

/*  Work Orders */
export const SAVE_WORK_ORDER = "work-order/save/";
export const DELETE_WORK_ORDER = "work-order";
export const GET_WORK_ORDER = "work-order/getWorkOrders";
export const SEND_WORK_ORDER = "work-order/sendWorkOrder";

export const WORK_TYPES = "work-order/getWorkOrderTypes/";

/* Material Requisition */
export const MATERIAL_REQUISITION = "material-requisition";
export const SAVE_MATERIAL_REQUISITION = "material-requisition/save";
export const GET_MATERIAL_REQUISITION = "material-requisition/get";
export const GET_MATERIAL_REQUISITION_BY_EMPLOYEE =
  "material-requisition/getByEmployee";

/* Circuit Directory */
export const CIRCUIT_DIRECTORY = "circuit-directory";
export const SAVE_CIRCUIT_DIRECTORY = "circuit-directory/save";
export const GET_CIRCUIT_DIRECTORY = "circuit-directory/get";

/* Safety Sheets */
export const SAVE_SAFETY_SHEET = "safety-sheet/save";
export const SAFETY_SHEET = "safety-sheet";
export const GET_SAFETY_SHEET = "safety-sheet/get";

/* Jobs */
export const SAVE_JOB = "job/save";
export const JOB = "job";
export const GET_JOB = "job/get";

/* Motor Cheat Sheet 480V */
export const SAVE_MCS = "mcs/save";
export const MCS = "mcs";
export const GET_MCS = "mcs/get";

/* Users */
export const USERS_GET = "users/get";
export const USER_UPDATE = "users/update";

/* Receipts */
export const SAVE_RECEIPT = "receipts/save";
export const GET_RECEIPTS = "receipts/get";
export const DELETE_RECEIPT = "receipts";