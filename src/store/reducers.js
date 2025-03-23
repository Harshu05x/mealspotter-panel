import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

//E-commerce
import ecommerce from "./e-commerce/reducer";

//Calendar
import calendar from "./calendar/reducer";

//chat
import chat from "./chat/reducer";

//crypto
import crypto from "./crypto/reducer";

//invoices
import invoices from "./invoices/reducer";

//jobs
import JobReducer from "./jobs/reducer";

//projects
import projects from "./projects/reducer";

//tasks
import tasks from "./tasks/reducer";

//contacts
import contacts from "./contacts/reducer";

//mails
import mails from "./mails/reducer";

//Dashboard 
import Dashboard from "./dashboard/reducer";

//Dasboard saas
import DashboardSaas from "./dashboard-saas/reducer";

//Dasboard crypto
import DashboardCrypto from "./dashboard-crypto/reducer";

//Dasboard blog
import DashboardBlog from "./dashboard-blog/reducer";

//Dasboard job
import DashboardJob from "./dashboard-jobs/reducer";

//Category
import Category from "./categories/reducer";

//AgeGrpup
import AgeGroup from "./age-groups/reducer";

//City
import City from "./cities/reducer";

//Zone
import Zone from "./zones/reducer";

// pickup points
import PickupPoint from "./pickUpPoints/reducer";

//Zone
import Area from "./areas/reducer";

//Toys
import Toy from "./toys/reducer";

//order -by Shubham Pawar
import Order from "./orders/reducer";

// payment
import Payment from "./Payment/reducer";


//Customer -by Shubham Pawar
import Customer from "./customers/reducer";
import Coupon from "./coupons/reducer";

// Dates
import OrderDates from "./dates/reducer";

// system state
import systemState from "./system-state/reducer";

//mess owners
import MessOwner from "./mess-owners/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  ecommerce,
  calendar,
  chat,
  mails,
  crypto,
  invoices,
  JobReducer,
  projects,
  tasks,
  contacts,
  Dashboard,
  DashboardSaas,
  DashboardCrypto,
  DashboardBlog,
  DashboardJob,
  Category,
  AgeGroup,
  City,
  Zone,
  PickupPoint,
  Area,
  Toy,
  Order,
  Payment,
  Customer,
  Coupon,
  OrderDates,
  systemState,
  MessOwner
});

export default rootReducer;
