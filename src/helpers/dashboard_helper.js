import axios from "axios";
import { get } from "./api_helper";
import * as url from "./url_helper";

// get actual card counts data from the API.
export const fetchDashboardApi = () => get(url.DASHBOARD_API);
export const fetchDashboardTopRentedToysApi = () => get(url.DASHBOARD_TOP_RENTED_TOYS);