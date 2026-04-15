import {
    TASK_LOAD_ALL_PACKAGE_START,
    TASK_LOAD_ALL_PACKAGE_COMPLETE,
    TASK_LOAD_ALL_PACKAGE_END,
    TASK_LOAD_USER_START,
    TASK_LOAD_USER_COMPLETE,
    TASK_LOAD_USER_END,
    TASK_GET_COMPANY_INFO_START,
    TASK_GET_COMPANY_INFO_COMPLETE,
    TASK_GET_COMPANY_INFO_END,
    TASK_GET_ADMIN_ALL_COMPANY_INFO_START,
    TASK_GET_ADMIN_ALL_COMPANY_INFO_COMPLETE,
    TASK_GET_ADMIN_ALL_COMPANY_INFO_END,
    TASK_EDIT_COMPANY_INFO_START,
    TASK_EDIT_COMPANY_INFO_COMPLETE,
    TASK_EDIT_COMPANY_INFO_END,
    TASK_LOAD_ALL_USER_START,
    TASK_LOAD_ALL_USER_COMPLETE,
    TASK_LOAD_ALL_USER_END,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_GET_POI_COMPLETE,
    TASK_GET_ALERTS_COMPLETE,
    TASK_GET_ASSETS_COMPLETE,
    TASK_GET_PROJECT_COMPLETE,
    TASK_LOAD_MY_WORK_ORDER_COMPLETE,
    TASK_LOAD_ASSIGEND_TO_ME_COMPLETE,
} from '../types'
import { baseUrl } from '../../config.json'
import { handleRequest } from '../../apiTransport';

const TIMEOUT = 1000000;

const handleUnauthorized = () => {
    localStorage.clear()
    window.location.reload();
};

const handleRequest1 = async (dispatch, url, method, types, body = null) => {
    const [START, SUCCESS, FAILURE] = types;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    try {
        dispatch({ type: START, loading: true, networkError: false });
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
            signal: controller.signal,
        };
        if (body !== null) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(`${baseUrl}${url}`, options);
        const res = await response.json();
        if (res.message == 'User information or expiry date not found.') {
        }
        if (!response.ok) {
            if (res.statusCode === 401) handleUnauthorized();
            return;
        }
        if (res.statusCode === 404) {
            dispatch({ type: FAILURE, loading: false, networkError: true });
        } else {
            dispatch({ type: SUCCESS, loading: false, payload: res });
        }
    } catch (error) {
        if (error.name === "AbortError") console.error("Request timed out");
        dispatch({ type: FAILURE, loading: false, networkError: true });
    } finally {
        clearTimeout(timeout);
    }
};


export const GetPackages = () => async (dispatch) =>
    handleRequest1(dispatch, '/enterprisePackages', 'GET', [
        TASK_LOAD_ALL_PACKAGE_START,
        TASK_LOAD_ALL_PACKAGE_COMPLETE,
        TASK_LOAD_ALL_PACKAGE_END
    ]);

export const GetCompanyInfo = () => async (dispatch) => {
    dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [] });
    handleRequest(dispatch, '/auth/companyInfo', 'GET', [
        TASK_GET_COMPANY_INFO_START,
        TASK_GET_COMPANY_INFO_COMPLETE,
        TASK_GET_COMPANY_INFO_END
    ]);
}

export const GetUsers = () => async (dispatch) =>
    handleRequest1(dispatch, '/users/allAdmin', 'GET', [
        TASK_LOAD_USER_START,
        TASK_LOAD_USER_COMPLETE,
        TASK_LOAD_USER_END
    ]);

export const GetAllUsers = () => async (dispatch) =>
    handleRequest(dispatch, `/users/allV2`, 'GET', [
        TASK_LOAD_ALL_USER_START,
        TASK_LOAD_ALL_USER_COMPLETE,
        TASK_LOAD_ALL_USER_END
    ]);


export const GetAllCompanies = (page) => async (dispatch) =>
    handleRequest(dispatch, `/auth/get-all-companies`, 'GET', [
        TASK_GET_ADMIN_ALL_COMPANY_INFO_START,
        TASK_GET_ADMIN_ALL_COMPANY_INFO_COMPLETE,
        TASK_GET_ADMIN_ALL_COMPANY_INFO_END
    ]);


export const EditCompany = (body) => async (dispatch) =>
    handleRequest(dispatch, `/auth/edit-company`, 'POST', [
        TASK_EDIT_COMPANY_INFO_START,
        TASK_EDIT_COMPANY_INFO_COMPLETE,
        TASK_EDIT_COMPANY_INFO_END
    ], body);
