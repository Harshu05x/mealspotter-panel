import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// get toys
export const getToys = (page, limit, query, status, category, type) => get(url.TOYS + `?page=${page}&limit=${limit}&query=${query}&status=${status}&category=${category}&type=${type}`);

// add toy
export const addNewToy = toy => post(url.TOYS, toy);

// update toy
export const updateToy = toy => put(url.TOYS + "/" + toy._id, toy);

// delete toy
export const deleteToy = toy => {
  return del(url.TOYS + "/" + toy);
};

// update toy availability
export const updateToysAvailability = (toyId, isAvailable) => {
  const updatedToy = { isAvailable };
  return put(url.TOYS + "/" + toyId, updatedToy);
};