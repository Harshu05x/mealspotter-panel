import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// get toys
export const getCustomers = (enquiry,page, limit, query) => get(url.CUSTOMERS + "?enquiry=" + enquiry + "&page=" + page + "&limit=" + limit + "&query=" + query);
export const getEnquiries = (page, limit, query) => post(url.ENQUIRIES + `/${page}` + `?limit=${limit}` + `&query=${query}`);

export const getCustomerDetailsById = async customerId => {
    try {
        const response = await get(`customers/${customerId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateCustomer = async customer => {
    try {
        const response = await put(`customers/update/${customer._id}`, customer);
        return response;
    } catch (error) {
        throw error;
    }
};

//update password
export const updatePassword = async data => {
    try {
        const response = await put(`customers/update-password/${data._id}`, data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteCustomer = async customerId => {
    try {
        const response = await del(`customers/delete/${customerId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCustomerOrders = async customerId => {
    try {
        const response = await get(`customers/${customerId}/orders`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllCustomers = (query, searchType) => get(url.All_CUSTOMERS + `?query=${query}` + `&searchType=${searchType}`);
