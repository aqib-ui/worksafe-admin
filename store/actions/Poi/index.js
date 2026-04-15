import {
    TASK_GET_POI_START,
    TASK_GET_POI_ERROR,
    TASK_GET_POI_COMPLETE,
    TASK_GET_POI_END,
    TASK_GET_POI_ARCHIVED_START,
    TASK_GET_POI_ARCHIVED_COMPLETE,
    TASK_GET_POI_ARCHIVED_END,
    TASK_GET_POI_DRAFT_START,
    TASK_GET_POI_DRAFT_COMPLETE,
    TASK_GET_POI_DRAFT_END,
    TASK_WORKORDER_FOR_POI_START,
    TASK_WORKORDER_FOR_POI_COMPLETE,
    TASK_WORKORDER_FOR_POI_END,
    TASK_GET_POI_BY_ID_START,
    TASK_GET_POI_BY_ID_COMPLETE,
    TASK_GET_POI_BY_ID_END,
    TASK_GET_POI_BY_ID_START_DOC,
    TASK_GET_POI_BY_ID_COMPLETE_DOC,
    TASK_GET_POI_BY_ID_END_DOC,
    TASK_WORKORDER_UN_FOR_POI_START,
    TASK_WORKORDER_UN_FOR_POI_COMPLETE,
    TASK_WORKORDER_UN_FOR_POI_END,
    TASK_WORKORDER_LINK_FOR_POI_START,
    TASK_WORKORDER_LINK_FOR_POI_COMPLETE,
    TASK_WORKORDER_LINK_FOR_POI_END,
    TASK_POI_ARCHIVED_START,
    TASK_POI_ARCHIVED_COMPLETE,
    TASK_POI_ARCHIVED_END,
    TASK_LOAD_WORK_SITE_START,
    TASK_LOAD_WORK_SITE_COMPLETE,
    TASK_LOAD_WORK_SITE_END,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_GET_ALERTS_COMPLETE,
    TASK_GET_ASSETS_COMPLETE,
    TASK_GET_PROJECT_COMPLETE,
    TASK_LOAD_MY_WORK_ORDER_COMPLETE,
    TASK_LOAD_ASSIGEND_TO_ME_COMPLETE
} from '../types'
import { handleRequest } from '../../apiTransport';
import { baseUrl } from '../../config.json'


const TIMEOUT = 1000000;
const handleUnauthorized = () => {
    localStorage.clear()
    window.location.reload();
};

export const GetPOIWorksite = (worksiteId, page, query) => async (dispatch, getState) => {
    dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });

    dispatch({ type: TASK_GET_POI_ARCHIVED_COMPLETE, loading: false, payload: [] });
    const { poiData } = getState()?.PoiReducer

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/suggestions?worksiteId=${worksiteId}&page=${page}&status=${query}&sortBy=newest`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
        dispatch({ type: TASK_GET_POI_START, loading: true, networkError: false });
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
            const existingIds = new Set(poiData?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [...poiData, ...filteredRes] });
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_GET_POI_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
        } else {
            dispatch({ type: TASK_GET_POI_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_GET_POI_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};


export const GetPOI = (worksiteId, page, query, priority, cpcs) => async (dispatch, getState) => {
    dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });

    const hasQuery = query?.trim().length > 0;
    const hasCpc = cpcs?.length > 0;
    const hasPriority = priority?.length > 0;

    if (hasQuery || hasCpc || hasPriority) {
        dispatch({
            type: TASK_GET_POI_COMPLETE,
            loading: false,
            payload: [],
        });
    }

    dispatch({ type: TASK_GET_POI_ARCHIVED_COMPLETE, loading: false, payload: [] });
    const { poiData } = getState()?.PoiReducer

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");



    const params = new URLSearchParams({
        worksiteId,
        page,
        title: query,
        sortBy: 'newest',
    });

    if (cpcs?.length > 0) {
        cpcs.forEach(element => {
            params.append('elevationLevels[]', element);
        });
    }

    if (priority?.length > 0) {
        priority.forEach(element => {
            params.append('threatLevels[]', element);
        });
    }

    const url = `/suggestions?${params.toString()}`;
    try {
        dispatch({ type: TASK_GET_POI_START, loading: true, networkError: false });
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
            const existingIds = new Set(poiData?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [...poiData, ...filteredRes] });
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_GET_POI_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
        } else {
            dispatch({ type: TASK_GET_POI_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_GET_POI_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};

export const GetArchivedPOI = (worksiteId, page, query, priority, cpcs) => async (dispatch, getState) => {

    const hasQuery = query?.trim().length > 0;
    const hasCpc = cpcs?.length > 0;
    const hasPriority = priority?.length > 0;

    if (hasQuery || hasCpc || hasPriority) {
        dispatch({
            type: TASK_GET_POI_ARCHIVED_COMPLETE,
            loading: false,
            payload: [],
        });
    }

    dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
    const { poiArchivedData } = getState()?.PoiReducer
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);



    const params = new URLSearchParams({
        worksiteId,
        page,
        title: query,
        sortBy: 'newest',
    });

    if (cpcs?.length > 0) {
        cpcs.forEach(element => {
            params.append('elevationLevels[]', element);
        });
    }

    if (priority?.length > 0) {
        priority.forEach(element => {
            params.append('threatLevels[]', element);
        });
    }

    const url = `/suggestions/archived?${params.toString()}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
        dispatch({ type: TASK_GET_POI_ARCHIVED_START, loading: true, networkError: false });
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
            const existingIds = new Set(poiArchivedData?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_GET_POI_ARCHIVED_COMPLETE, loading: false, payload: [...poiArchivedData, ...filteredRes] });
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_GET_POI_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
            dispatch({ type: TASK_GET_POI_ARCHIVED_END, loading: false, networkError: true });
        } else {
            dispatch({ type: TASK_GET_POI_ARCHIVED_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_GET_POI_ARCHIVED_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};



export const GetAllWorkOrder = (worksiteId) => async (dispatch) =>
    handleRequest(dispatch, `/workorder?worksiteId=${worksiteId}&sortBy=newest`, 'GET', [
        TASK_WORKORDER_FOR_POI_START,
        TASK_WORKORDER_FOR_POI_COMPLETE,
        TASK_WORKORDER_FOR_POI_END
    ]);



export const GetAllWorkOrderUnLink = (worksiteId) => async (dispatch) =>
    handleRequest(dispatch, `/workorder/getAllUnLinkWorkOrders?worksiteId=${worksiteId}&sortBy=newest`, 'GET', [
        TASK_WORKORDER_UN_FOR_POI_START,
        TASK_WORKORDER_UN_FOR_POI_COMPLETE,
        TASK_WORKORDER_UN_FOR_POI_END
    ]);



export const GetAllWorkOrderFilterLink = (worksiteId, module, currentWorkSite) => async (dispatch) =>
    handleRequest(dispatch, `/workorder/getAllByModeuleTypeAndId?moduleType=${module}&moduleId=${worksiteId}&worksiteId=${currentWorkSite}`, 'GET', [
        TASK_WORKORDER_LINK_FOR_POI_START,
        TASK_WORKORDER_LINK_FOR_POI_COMPLETE,
        TASK_WORKORDER_LINK_FOR_POI_END
    ]);



export const PoiArchived = (body) => async (dispatch) => {
    handleRequest(dispatch, `/suggestions/${body}`, 'DELETE', [
        TASK_POI_ARCHIVED_START,
        TASK_POI_ARCHIVED_COMPLETE,
        TASK_POI_ARCHIVED_END
    ]);

}



export const GetWorkSite = () => async (dispatch) =>
    handleRequest(dispatch, '/worksites', 'GET', [
        TASK_LOAD_WORK_SITE_START,
        TASK_LOAD_WORK_SITE_COMPLETE,
        TASK_LOAD_WORK_SITE_END
    ]);


export const GetAdminWorkSite = () => async (dispatch) =>
    handleRequest(dispatch, '/worksites', 'GET', [
        TASK_LOAD_WORK_SITE_START,
        TASK_LOAD_WORK_SITE_COMPLETE,
        TASK_LOAD_WORK_SITE_END
    ]);



export const WorkPOIGetById = (body) => async (dispatch) =>
    handleRequest(dispatch, `/suggestions/${body}`, 'GET', [
        TASK_GET_POI_BY_ID_START,
        TASK_GET_POI_BY_ID_COMPLETE,
        TASK_GET_POI_BY_ID_END
    ]);



export const WorkPOIGetByIdDoc = (body) => async (dispatch) =>
    handleRequest(dispatch, `/assets/files/signed-urls`, 'POST', [
        TASK_GET_POI_BY_ID_START_DOC,
        TASK_GET_POI_BY_ID_COMPLETE_DOC,
        TASK_GET_POI_BY_ID_START_DOC
    ], { keys: body });





export const WorkPOIGetByIdMap = (body) => async (dispatch, getState) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/suggestions/${body}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    try {
        dispatch({ type: TASK_GET_POI_BY_ID_START, loading: true, networkError: false });
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
            dispatch({ type: TASK_GET_POI_BY_ID_START, loading: false, networkError: false });
            return res
        }
        else {
            dispatch({ type: TASK_GET_POI_BY_ID_END, loading: false, networkError: true });
        }
    } catch (error) {
        dispatch({ type: TASK_GET_POI_BY_ID_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};