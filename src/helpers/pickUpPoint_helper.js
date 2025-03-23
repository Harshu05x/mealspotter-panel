import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// get pickUpPoints
export const getPickUpPoints = () => get(url.PICKUP_POINTS);

// add pickUpPoint
export const addNewPickUpPoint = pickUpPoint => post(url.PICKUP_POINTS, pickUpPoint);

// update pickUpPoint
export const updatePickUpPoint = pickUpPoint => put(url.PICKUP_POINTS + "/" + pickUpPoint._id, pickUpPoint);

// delete pickUpPoint
export const deletePickUpPoint = pickUpPoint =>
  del(url.PICKUP_POINTS + "/" + pickUpPoint);

