import { handleRequest } from '../../apiTransport';
import {
    TASK_LOAD_USER_START,
    TASK_LOAD_USER_COMPLETE,
    TASK_LOAD_USER_END,
    TASK_DELETE_USER_START,
    TASK_DELETE_USER_COMPLETE,
    TASK_DELETE_USER_END,
    TASK_RECOVER_USER_START,
    TASK_RECOVER_USER_COMPLETE,
    TASK_RECOVER_USER_END,
    TASK_LOAD_PACKAGE_START,
    TASK_LOAD_PACKAGE_COMPLETE,
    TASK_LOAD_PACKAGE_END,
    TASK_RECOVER_PAYMENT_START,
    TASK_RECOVER_PAYMENT_COMPLETE,
    TASK_RECOVER_PAYMENT_END,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_GET_POI_COMPLETE,
    TASK_GET_ALERTS_COMPLETE,
    TASK_GET_ASSETS_COMPLETE,
    TASK_GET_PROJECT_COMPLETE,
    TASK_LOAD_MY_WORK_ORDER_COMPLETE,
    TASK_LOAD_ASSIGEND_TO_ME_COMPLETE,
} from '../types'


export const GetUsers = () => async (dispatch) => {
    dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [] });
    handleRequest(dispatch, `/users/allAdmin`, 'GET', [
        TASK_LOAD_USER_START,
        TASK_LOAD_USER_COMPLETE,
        TASK_LOAD_USER_END
    ]);
}

export const GetPackages = () => async (dispatch) =>
    handleRequest(dispatch, `/packages`, 'GET', [
        TASK_LOAD_PACKAGE_START,
        TASK_LOAD_PACKAGE_COMPLETE,
        TASK_LOAD_PACKAGE_END
    ]);

export const DeleteUser = (body) => async (dispatch) =>
    handleRequest(dispatch, `/auth/${body}`, 'DELETE', [
        TASK_DELETE_USER_START,
        TASK_DELETE_USER_COMPLETE,
        TASK_DELETE_USER_END
    ]);

export const RecoverUser = (body) => async (dispatch) =>
    handleRequest(dispatch, `/auth/recover/${body}`, 'DELETE', [
        TASK_RECOVER_USER_START,
        TASK_RECOVER_USER_COMPLETE,
        TASK_RECOVER_USER_END
    ]);

export const RecoverPayment = (body) => async (dispatch) =>
    handleRequest(dispatch, `/payments/recoverPayment/${body}`, 'PATCH', [
        TASK_RECOVER_PAYMENT_START,
        TASK_RECOVER_PAYMENT_COMPLETE,
        TASK_RECOVER_PAYMENT_END
    ]);