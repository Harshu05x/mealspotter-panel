import axios from "axios";
import store from "store";
import { setSystemError } from "store/actions";
//import accessToken from "./jwt-token-access/accessToken";

//pass new generated access token here
const tokenJson = localStorage.getItem('authUser');

let accessToken='';
if(tokenJson){
  try{
    let tokenData = JSON.parse(tokenJson);
    accessToken = tokenData.token;
  }
  catch(ex){
    accessToken = "";
  }
}

//apply base url for axios
const API_URL = process.env.REACT_APP_BASEURL;

const axiosApi = axios.create({
  baseURL: API_URL,
});

export async function setAxiosDefaults(accessToken) {
  axiosApi.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
};
axiosApi.defaults.headers.common["Authorization"] = "Bearer " + accessToken;

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error?.response?.status == 401){
      window.location.href="/logout"
    }
      
    return Promise.reject(error);
    
  }
);

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, data, { ...config })
    .then((response) => response.data)
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}
