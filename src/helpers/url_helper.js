
//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register";

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/post-fake-profile";
export const GET_JWT_USER_PROFILE = "/users/get-user-profile";
export const UPDATE_JWT_USER_PASSWORD = "/users/update-password";

//TOYS
export const TOYS = "/toys";
export const ADD_NEW_TOY = "/toys/create";
export const UPDATE_TOY = "/toys/update";
export const DELETE_TOY = "/toys/delete/:id";

//CATEGORIES
export const CATEGORIES = "/categories";


//AGEGROUPS
export const AGEGROUPS = "/ageGroups";


//Dashboard counts
export const DASHBOARD_API = "/dashboard/counts";
export const DASHBOARD_TOP_RENTED_TOYS = "/dashboard/topRentedToys";

//CITIES
export const CITIES = "/cities";

//ZONES
export const ZONES = "/zones";

// PICKUP POINTS
export const PICKUP_POINTS = "/pickUpPoints";

//AREAS
export const AREAS = "/areas";


//CUSTOMER
export const CUSTOMERS = "/customers";
export const ENQUIRIES = "/customers/enquiries"; 
export const CUSTOMERS_DETAILS = "/customers/:id";
export const CUSTOMER_ORDERS = "/:id/orders";
export const All_CUSTOMERS = "/customers/all/customers";

//CUSTOMER
export const ALL_ORDERS = "/orders/all";
export const UPCOMING_ORDERS = "/orders/upcoming";
export const ONGOING_ORDERS = "/orders/ongoing";
export const DUE_RETURNS = "/orders/returns";
export const PRE_BOOKINGS = "/orders/prebooking";
export const CHANGE_ORDER_STATUS_API = "/orders/change-orderStatus";
export const CANCEL_ORDER_API = "/orders/cancel";
export const CANCELLED_ORDERS = "/orders/cancelled";
export const COMPLETED_ORDERS = "/orders/completed";
export const REFUNDED_ORDERS = "/orders/refunded";

//Mails
export const GET_MAILS_LIST = "/mailslists";
export const SELECT_FOLDER = "/folders";
export const GET_SELECTED_MAILS = "/selectedmails";
export const SET_FOLDER_SELECTED_MAILS = "/setfolderonmail";
export const UPDATE_MAIL = "/update/mail";

//CALENDER
export const GET_EVENTS = "/events";
export const ADD_NEW_EVENT = "/add/event";
export const UPDATE_EVENT = "/update/event";
export const DELETE_EVENT = "/delete/event";

//CHATS
export const GET_CHATS = "/chats";
export const GET_GROUPS = "/groups";
export const GET_CONTACTS = "/contacts";
export const GET_MESSAGES = "/messages";
export const ADD_MESSAGE = "/add/messages";
export const DELETE_MESSAGE = "/delete/message";


//CART DATA
export const GET_CART_DATA = "/cart";

//CUSTOMERS
export const GET_CUSTOMERS = "/customers";
export const ADD_NEW_CUSTOMER = "/add/customer";
export const UPDATE_CUSTOMER = "/update/customer/:id";
export const UPDATE_PASSWORD = "/update-password/customer/:id";
export const DELETE_CUSTOMER = "/delete/customer/:id";

// Payment History
export const GET_PAYMENT_HISTORY = "/payment/payment-history";

//SHOPS
export const GET_SHOPS = "/shops";

//CRYPTO
export const GET_WALLET = "/wallet";
export const GET_CRYPTO_ORDERS = "/crypto/orders";
export const GET_CRYPTO_PRODUCTS = "/crypto-products";

//INVOICES
export const GET_INVOICES = "/invoices";
export const GET_INVOICE_DETAIL = "/invoice";

// JOBS
export const GET_JOB_LIST = "/jobs";
export const ADD_NEW_JOB_LIST = "/add/job";
export const UPDATE_JOB_LIST = "/update/job";
export const DELETE_JOB_LIST = "/delete/job";

//Apply Jobs
export const GET_APPLY_JOB = "/jobApply";
export const DELETE_APPLY_JOB = "add/applyjob";

//PROJECTS
export const GET_PROJECTS = "/projects";
export const GET_PROJECT_DETAIL = "/project";
export const ADD_NEW_PROJECT = "/add/project";
export const UPDATE_PROJECT = "/update/project";
export const DELETE_PROJECT = "/delete/project";

//TASKS
export const GET_TASKS = "/tasks";
export const DELETE_KANBAN = "/delete/tasks"
export const ADD_CARD_DATA = "/add/tasks"
export const UPDATE_CARD_DATA = "/update/tasks"

//CONTACTS
export const GET_USERS = "/users";
export const GET_USER_PROFILE = "/user";
export const ADD_NEW_USER = "/add/user";
export const UPDATE_USER = "/update/user";
export const DELETE_USER = "/delete/user";

//Blog
export const GET_VISITOR_DATA = "/visitor-data";

//dashboard charts data
export const GET_WEEKLY_DATA = "/weekly-data";
export const GET_YEARLY_DATA = "/yearly-data";
export const GET_MONTHLY_DATA = "/monthly-data";

export const TOP_SELLING_DATA = "/top-selling-data";

//dashboard crypto
export const GET_WALLET_DATA = "/wallet-balance-data";

//dashboard jobs
export const GET_STATISTICS_DATA = "/Statistics-data";

//dashboard cards counts...
export const GET_UPCOMING_ORDER_DATA = "/upcoming-orders";
export const GET_RETURN_ORDER_CARD_DATA = "/due-returns";
export const GET_CUSTOMER_ORDER_DATA = "/ongoing-orders";
export const GET_TOTAL_CUSTOMERS_DATA = "/customers";

export const GET_EARNING_DATA = "/earning-charts-data";

export const GET_PRODUCT_COMMENTS = "/comments-product";

export const ON_LIKNE_COMMENT = "/comments-product-action";

export const ON_ADD_REPLY = "/comments-product-add-reply";

export const ON_ADD_COMMENT = "/comments-product-add-comment";

//Master >> coupons
export const COUPONS = "/coupons";

//Master >> Mess Owners
export const GET_MESS_OWNERS = "/mess-owners";
export const ADD_MESS_OWNER = "/mess-owners/create";
export const UPDATE_MESS_OWNER = "/mess-owners/update";
export const DELETE_MESS_OWNER = "/mess-owners/delete";

