import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// get toys
export const getAreas = () => get(url.AREAS);

// add toy
export const addNewArea = area => post(url.AREAS, area);

// update toy
export const updateArea = area => put(url.AREAS + "/" + area._id, area);

// delete toy
export const deleteArea = area =>
  del(url.AREAS + "/" + area);