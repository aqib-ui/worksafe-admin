import {
    TASK_LOAD_PAYMENT_START,
    TASK_LOAD_PAYMENT_COMPLETE,
    TASK_LOAD_PAYMENT_END,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_GET_POI_COMPLETE,
    TASK_GET_ALERTS_COMPLETE,
    TASK_GET_ASSETS_COMPLETE,
    TASK_GET_PROJECT_COMPLETE,
    TASK_LOAD_MY_WORK_ORDER_COMPLETE,
    TASK_LOAD_ASSIGEND_TO_ME_COMPLETE,
} from '../types'
import { handleRequest } from '../../apiTransport';




export const GetPayment = () => async (dispatch) => {
    dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [] });
    handleRequest(dispatch, `/payments`, 'GET', [
        TASK_LOAD_PAYMENT_START,
        TASK_LOAD_PAYMENT_COMPLETE,
        TASK_LOAD_PAYMENT_END
    ]);
}


