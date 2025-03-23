import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

export const getMessOwners = () => get(url.GET_MESS_OWNERS);

export const addNewMessOwner = (data) => post(url.ADD_MESS_OWNER, data);

export const updateMessOwner = (data) => put(url.UPDATE_MESS_OWNER, data);

export const deleteMessOwner = (data) => del(url.DELETE_MESS_OWNER, data);
