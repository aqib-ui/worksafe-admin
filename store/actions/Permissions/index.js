import {
    TASK_GET_ALL_PERMISSION_START,
    TASK_GET_ALL_PERMISSION_COMPLETE,
    TASK_GET_ALL_PERMISSION_END
} from '../types'
import { handleRequest } from '../../apiTransport';





export const GetAllPermissions = (body) => async (dispatch) =>
    handleRequest(dispatch, `/auth/${body}/getbyid`, 'GET', [
        TASK_GET_ALL_PERMISSION_START,
        TASK_GET_ALL_PERMISSION_COMPLETE,
        TASK_GET_ALL_PERMISSION_END
    ]);