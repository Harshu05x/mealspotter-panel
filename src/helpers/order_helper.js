import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

export const getAllOrdersAPI = (page, limit, startDate, endDate, query) => post(url.ALL_ORDERS + "/" + page + "/" + limit + "?query=" + query, {startDate, endDate});
export const getUpcomingOrders = (page, limit, startDate, endDate, query) => post(url.UPCOMING_ORDERS + "/" + page + "/" + limit +  "?query=" + query, {startDate, endDate});
export const getOngoingOrders = (page, limit, startDate, endDate, query) => post(url.ONGOING_ORDERS + "/" + page + "/" + limit +  "?query=" + query, {startDate, endDate}); 
export const getDueReturns = (page, limit,startDate, endDate, query) => post(url.DUE_RETURNS + "/" + page + "/" + limit +  "?query=" + query,{startDate, endDate});
export const getPreBookings = (page, limit,startDate, endDate, query) => post(url.PRE_BOOKINGS + "/" + page + "/" + limit +  "?query=" + query, {startDate, endDate});
export const changeOrderStatus = (orderIds, status) => put(url.CHANGE_ORDER_STATUS_API, { orderIds, status });
export const cancelOrder = (orderId, reason) => post(url.CANCEL_ORDER_API, { orderId, reason });
export const getCancelledOrdersAPI = (page, limit, startDate, endDate, query) => post(url.CANCELLED_ORDERS + "/" + page + "/" + limit +  "?query=" + query, {startDate, endDate});
export const getCompletedOrdersAPI = (page, limit, date, query) => post(url.COMPLETED_ORDERS + "/" + page + "/" + limit +  "?query=" + query, {date});
export const getRefundedOrdersAPI = (page, limit, startDate, endDate, query) => post(url.REFUNDED_ORDERS + "/" + page + "/" + limit +  "?query=" + query, {startDate, endDate});