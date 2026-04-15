import {
    TASK_GET_ALERTS_START,
    TASK_GET_ALERTS_COMPLETE,
    TASK_GET_ALERTS_END,
    TASK_GET_ALERTS_ERROR,
    TASK_GET_ARCHIVED_ALERTS_START,
    TASK_GET_ARCHIVED_ALERTS_COMPLETE,
    TASK_GET_ARCHIVED_ALERTS_END,
    TASK_GET_ARCHIVED_ALERTS_ERROR,




    TASK_GET_DEPARTMENT_START,
    TASK_GET_DEPARTMENT_COMPLETE,
    TASK_GET_DEPARTMENT_END,
    TASK_ADD_DEPARTMENT_START,
    TASK_ADD_DEPARTMENT_COMPLETE,
    TASK_ADD_DEPARTMENT_END,
    TASK_GET_CONTRACTOR_START,
    TASK_GET_CONTRACTOR_COMPLETE,
    TASK_GET_CONTRACTOR_END,
    TASK_DELETE_CONTRACTOR_START,
    TASK_DELETE_CONTRACTOR_COMPLETE,
    TASK_DELETE_CONTRACTOR_END,
    TASK_ADD_CONTRACTOR_START,
    TASK_ADD_CONTRACTOR_COMPLETE,
    TASK_ADD_CONTRACTOR_END,
    TASK_ARCHIVE_ALERTS_START,
    TASK_ARCHIVE_ALERTS_COMPLETE,
    TASK_ARCHIVE_ALERTS_END,
    TASK_GET_ALERTS_DETAIL_START,
    TASK_GET_ALERTS_DETAIL_COMPLETE,
    TASK_GET_ALERTS_DETAIL_END,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_GET_POI_COMPLETE,
    TASK_GET_ASSETS_COMPLETE,
    TASK_GET_PROJECT_COMPLETE,
    TASK_LOAD_MY_WORK_ORDER_COMPLETE,
    TASK_LOAD_ASSIGEND_TO_ME_COMPLETE
} from '../types'
import { baseUrl } from '../../config.json'
import { handleRequest } from '../../apiTransport';


const TIMEOUT = 1000000;
const handleUnauthorized = () => {
    localStorage.clear()
    window.location.reload();
};


export const GetAlerts = (worksiteId, page, query, priority) => async (dispatch, getState) => {
    dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ARCHIVED_ALERTS_COMPLETE, loading: true, payload: [] });


    dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });

    const hasQuery = query?.trim().length > 0;
    const hasPriority = priority?.length > 0;

    if (hasQuery || hasPriority) {
        dispatch({
            type: TASK_GET_ALERTS_COMPLETE,
            loading: false,
            payload: [],
        });
    }



    const params = new URLSearchParams({
        worksiteId,
        page,
        title: query,
        sortBy: 'newest',
    });

    if (priority?.length > 0) {
        priority.forEach(element => {
            params.append('threatLevels[]', element);
        });
    }

    const url = `/alerts?${params.toString()}`;

    const { alertData } = getState()?.AlertsReducer
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
        dispatch({ type: TASK_GET_ALERTS_START, loading: true, networkError: false });
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
            signal: controller.signal,
        };

        const response = await fetch(`${baseUrl}${url}`, options);
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            const existingIds = new Set(alertData?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [...alertData, ...filteredRes] });
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_GET_ALERTS_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
        } else {
            dispatch({ type: TASK_GET_ALERTS_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_GET_ALERTS_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};


export const GetArchivedGetAlerts = (worksiteId, page, query,priority) => async (dispatch, getState) => {
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: true, payload: [] });

    const hasQuery = query?.trim().length > 0;
    const hasPriority = priority?.length > 0;

    if (hasQuery || hasPriority) {
        dispatch({
            type: TASK_GET_ARCHIVED_ALERTS_COMPLETE,
            loading: false,
            payload: [],
        });
    }



    const params = new URLSearchParams({
        worksiteId,
        page,
        title: query,
        sortBy: 'newest',
    });

    if (priority?.length > 0) {
        priority.forEach(element => {
            params.append('threatLevels[]', element);
        });
    }

    const url = `/alerts/archived?${params.toString()}`;


    const { archivedalertData } = getState()?.AlertsReducer
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");






    try {
        dispatch({ type: TASK_GET_ARCHIVED_ALERTS_START, loading: true, networkError: false });
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
            signal: controller.signal,
        };

        const response = await fetch(`${baseUrl}${url}`, options);
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            const existingIds = new Set(archivedalertData?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_GET_ARCHIVED_ALERTS_COMPLETE, loading: false, payload: [...archivedalertData, ...filteredRes] });
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_GET_ARCHIVED_ALERTS_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
            dispatch({ type: TASK_GET_ARCHIVED_ALERTS_END, loading: false, networkError: true });
        } else {
            dispatch({ type: TASK_GET_ARCHIVED_ALERTS_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_GET_ARCHIVED_ALERTS_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};


export const getDepartment = (worksiteId) => async (dispatch) => {
    handleRequest(dispatch, `/departments?worksiteId=${worksiteId}`, 'GET', [
        TASK_GET_DEPARTMENT_START,
        TASK_GET_DEPARTMENT_COMPLETE,
        TASK_GET_DEPARTMENT_END
    ]);
}

export const CreateDepartment = (body) => async (dispatch) => {
    handleRequest(dispatch, `/departments`, 'POST', [
        TASK_ADD_DEPARTMENT_START,
        TASK_ADD_DEPARTMENT_COMPLETE,
        TASK_ADD_DEPARTMENT_END
    ], body);
}


export const getContractor = () => async (dispatch) => {
    handleRequest(dispatch, `/contractor`, 'GET', [
        TASK_GET_CONTRACTOR_START,
        TASK_GET_CONTRACTOR_COMPLETE,
        TASK_GET_CONTRACTOR_END
    ]);
}
export const getContractorId = (worksiteId) => async (dispatch) => {
    handleRequest(dispatch, `/contractor?projectId=${worksiteId}`, 'GET', [
        TASK_GET_CONTRACTOR_START,
        TASK_GET_CONTRACTOR_COMPLETE,
        TASK_GET_CONTRACTOR_END
    ]);
}

export const deleteContractor = (contractorId) => async (dispatch) => {
    handleRequest(dispatch, `/contractor/${contractorId}`, 'DELETE', [
        TASK_DELETE_CONTRACTOR_START,
        TASK_DELETE_CONTRACTOR_COMPLETE,
        TASK_DELETE_CONTRACTOR_END
    ]);
}

export const addContractorAC = (contractorBody) => async (dispatch) => {
    handleRequest(dispatch, `/contractor`, 'POST', [
        TASK_ADD_CONTRACTOR_START,
        TASK_ADD_CONTRACTOR_COMPLETE,
        TASK_ADD_CONTRACTOR_END
    ], contractorBody);
}


export const UpdateContractorAC = (contractorBody) => async (dispatch) => {
    handleRequest(dispatch, `/contractor`, 'PATCH', [
        TASK_ADD_CONTRACTOR_START,
        TASK_ADD_CONTRACTOR_COMPLETE,
        TASK_ADD_CONTRACTOR_END
    ], contractorBody);
}




export const ArchiveAlerts = (ID) => async (dispatch) => {
    handleRequest(dispatch, `/alerts/${ID}`, 'DELETE', [
        TASK_ARCHIVE_ALERTS_START,
        TASK_ARCHIVE_ALERTS_COMPLETE,
        TASK_ARCHIVE_ALERTS_END
    ]);
}






export const GetAlertsByID = (ID) => async (dispatch) => {
    handleRequest(dispatch, `/alerts/${ID}`, 'GET', [
        TASK_GET_ALERTS_DETAIL_START,
        TASK_GET_ALERTS_DETAIL_COMPLETE,
        TASK_GET_ALERTS_DETAIL_END
    ]);
}



export const GetAlertsByIDMap = (ID) => async (dispatch, getState) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/alerts/${ID}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    try {
        dispatch({ type: TASK_GET_ALERTS_DETAIL_START, loading: true, networkError: false });
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
            signal: controller.signal,
        };

        const response = await fetch(`${baseUrl}${url}`, options);
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            dispatch({ type: TASK_GET_ALERTS_DETAIL_START, loading: false, networkError: false });
            return res
        }
        else {
            dispatch({ type: TASK_GET_ALERTS_DETAIL_END, loading: false, networkError: true });
        }
    } catch (error) {
        dispatch({ type: TASK_GET_ALERTS_DETAIL_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};