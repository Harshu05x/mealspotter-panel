import React from "react";
import { Navigate } from "react-router-dom";


// //Toys 
import Toys from "../pages/Toys/index";


//Masters 
import Category from "../pages/Masters/Category";


// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

//  // Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Login2 from "../pages/AuthenticationInner/Login2";
import Register1 from "../pages/AuthenticationInner/Register";
import Register2 from "../pages/AuthenticationInner/Register2";
import Recoverpw from "../pages/AuthenticationInner/Recoverpw";
import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
import ForgetPwd2 from "../pages/AuthenticationInner/ForgetPassword2";
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";
import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2";
import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";
import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2";
import EmailVerification from "../pages/AuthenticationInner/auth-email-verification";
import EmailVerification2 from "../pages/AuthenticationInner/auth-email-verification-2";
import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification";
import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import DashboardSaas from "../pages/Dashboard-saas/index";
import AgeGroup from "pages/Masters/AgeGroup";
import MessOwner from "pages/Masters/MessOwner";
import Zone from "pages/Masters/Zone";
import Area from "pages/Masters/Area";

//Customers
import Customers from "pages/Customers/index";
import CustomerDetails from "pages/Customers/CustomerDetails";
import Upcoming from "pages/Orders/Upcoming";
import DueReturns from "pages/Orders/DueReturns";
import OngoingOrders from "pages/Orders/OngoingOrders";
import Coupons from "pages/Masters/Coupons";
import PreBookings from "pages/Orders/PreBooking";
import PickUpPoints from "pages/Masters/PickUpPoints";
import AllOrders from "pages/Orders/AllOrders";
import NewRegistrations from "pages/Customers/NewRegistrations";

// Payments
import PaymentHistory from "pages/Payment/PaymentHistroy";
import Enquiry from "pages/Customers/Enquiry";
import OrderHistory from "pages/Toys/toyHistory";
import CancelledOrders from "pages/Orders/CancelledOrders";
import UserProfile from "pages/Authentication/user-profile";
import EmailVerificationPage from "pages/Customers/EmailVerification";
import FailedCarts from "pages/Orders/FailedCarts";
import CompletedOrders from "pages/Orders/CompletedOrders";
import AbandonedCarts from "pages/Orders/AbandonedCarts";
import RefundedOrders from "pages/Orders/RefundedOrders";

//import PreBookings from "pages/Orders/PreBookings";



const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/dashboard-saas", component: <DashboardSaas /> },
  { path: "/profile", component: <UserProfile />},

  //Toys
  { path: "/toys", component: <Toys /> },
  { path: "/order-history", component: <OrderHistory />},

  //Masters
  { path: "/categories", component: <Category /> },
  { path: "/agegroups", component: <AgeGroup /> },
  { path: "/mess-owners", component: <MessOwner /> },
  { path: "/zones", component: <Zone /> },
  { path: "/areas", component: <Area /> },
  { path: "/coupons", component: <Coupons /> },
  { path: "/pickup-points", component: <PickUpPoints />},

  //Customer
  { path: "/customers", component: <Customers /> },
  { path: "/customer-details", component: <CustomerDetails /> },
  { path: "/enquiries", component: <Enquiry /> },
  { path: "/new-registration", component: <NewRegistrations />},
  { path: "/email-verification", component: <EmailVerificationPage /> },
  
  //Orders
  { path: "/completed-orders", component: <CompletedOrders /> },
  { path: "all-orders", component: <AllOrders />},
  { path: "/pre-bookings", component: <PreBookings />}, 
  { path: "/upcoming-orders", component: <Upcoming /> },
  { path: "/due-returns", component: <DueReturns /> },
  { path: "/ongoing-orders", component: <OngoingOrders /> },
  { path: "/cancelled-orders", component: <CancelledOrders />},
  { path: "/refunded-orders", component: <RefundedOrders /> },
  { path: "/failed-carts", component: <FailedCarts /> },
  { path: "/abandoned-carts", component: <AbandonedCarts /> },

  //Payments
  { path: "/payment-history", component: <PaymentHistory /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPwd /> },


  // Authentication Inner
  { path: "/pages-login", component: <Login1 /> },
  { path: "/pages-login-2", component: <Login2 /> },
  { path: "/pages-register", component: <Register1 /> },
  { path: "/pages-register-2", component: <Register2 /> },
  { path: "/page-recoverpw", component: <Recoverpw /> },
  { path: "/page-recoverpw-2", component: <Recoverpw2 /> },
  { path: "/pages-forgot-pwd", component: <ForgetPwd1 /> },
  { path: "/auth-recoverpw-2", component: <ForgetPwd2 /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/auth-lock-screen-2", component: <LockScreen2 /> },
  { path: "/page-confirm-mail", component: <ConfirmMail /> },
  { path: "/page-confirm-mail-2", component: <ConfirmMail2 /> },
  { path: "/auth-email-verification", component: <EmailVerification /> },
  { path: "/auth-email-verification-2", component: <EmailVerification2 /> },
  { path: "/auth-two-step-verification", component: <TwostepVerification /> },
  { path: "/auth-two-step-verification-2", component: <TwostepVerification2 /> },
];

export { authProtectedRoutes, publicRoutes };
