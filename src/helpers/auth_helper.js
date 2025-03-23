import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

const postJwtForgetPwd = data => post(url.POST_FAKE_JWT_PASSWORD_FORGET, data);
const postJwtLogin = data => post("users/login", data);
const getJWTUser = () => get(url.GET_JWT_USER_PROFILE);
const updateUserPwd = data => post(url.UPDATE_JWT_USER_PASSWORD, data);

export {
    postJwtForgetPwd,
    postJwtLogin,
    getJWTUser,
    updateUserPwd
}