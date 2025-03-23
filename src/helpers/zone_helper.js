import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// get toys
export const getZones = () => get(url.ZONES);

// add toy
export const addNewZone = zone => post(url.ZONES, zone);

// update toy
export const updateZone = zone => put(url.ZONES + "/" + zone._id, zone);

// delete toy
export const deleteZone = zone =>
  del(url.ZONES + "/" + zone);