import { post } from "./api_helper";
import * as url from "./url_helper";

export const getPaymentHistory = (page,limit, startDate, endDate, query) => post(url.GET_PAYMENT_HISTORY + "/" + page + "/" + limit + `?query=${query}`, {startDate, endDate});