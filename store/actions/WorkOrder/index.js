import {
    TASK_LOAD_WORK_SITE_START,
    TASK_LOAD_WORK_SITE_COMPLETE,
    TASK_LOAD_WORK_SITE_END,
    TASK_LOAD_COMPANY_USER_START,
    TASK_LOAD_COMPANY_USER_COMPLETE,
    TASK_LOAD_COMPANY_USER_END,
    TASK_LOAD_MY_WORK_ORDER_START,
    TASK_LOAD_MY_WORK_ORDER_COMPLETE,
    TASK_LOAD_MY_WORK_ORDER_EXPIRED_ERROR,
    TASK_LOAD_MY_WORK_ORDER_END,
    TASK_DELETE_WORK_ORDER_START,
    TASK_DELETE_WORK_ORDER_COMPLETE,
    TASK_LOAD_ASSIGEND_TO_ME_EXPIRED_ERROR,
    TASK_DELETE_WORK_ORDER_END,
    TASK_LOAD_ASSIGEND_TO_ME_START,
    TASK_LOAD_ASSIGEND_TO_ME_COMPLETE,
    TASK_LOAD_ARCHIVED_EXPIRED_ERROR,
    TASK_LOAD_ASSIGEND_TO_ME_END,
    TASK_LOAD_ARCHIVED_START,
    TASK_LOAD_ARCHIVED_COMPLETE,
    TASK_LOAD_ARCHIVED_END,
    TASK_APPROVE_WORK_ORDER_START,
    TASK_APPROVE_WORK_ORDER_COMPLETE,
    TASK_APPROVE_WORK_ORDER_END,
    TASK_DECLINE_WORK_ORDER_START,
    TASK_DECLINE_WORK_ORDER_COMPLETE,
    TASK_DECLINE_WORK_ORDER_END,
    TASK_ARCHIVE_WORK_ORDER_START,
    TASK_ARCHIVE_WORK_ORDER_COMPLETE,
    TASK_ARCHIVE_WORK_ORDER_END,
    TASK_UNARCHIVE_WORK_ORDER_START,
    TASK_UNARCHIVE_WORK_ORDER_COMPLETE,
    TASK_UNARCHIVE_WORK_ORDER_END,
    TASK_COMPLETE_WORK_ORDER_START,
    TASK_COMPLETE_WORK_ORDER_COMPLETE,
    TASK_COMPLETE_WORK_ORDER_END,
    TASK_GET_WORK_ORDER_BY_ID_START,
    TASK_GET_WORK_ORDER_BY_ID_COMPLETE,
    TASK_GET_WORK_ORDER_BY_ID_END,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_GET_POI_COMPLETE,
    TASK_GET_ALERTS_COMPLETE,
    TASK_GET_ASSETS_COMPLETE,
    TASK_GET_PROJECT_COMPLETE,
    TASK_LOAD_WORK_SITE_DOC_START,
    TASK_LOAD_WORK_SITE_DOC_COMPLETE,
    TASK_LOAD_WORK_SITE_DOC_END,
    TASK_LOAD_WORKSITE_DETAIL_START,
    TASK_LOAD_WORKSITE_DETAIL_END,
} from '../types';
import { handleRequest } from '../../apiTransport'
import { baseUrl } from '../../config.json'


const TIMEOUT = 1000000;
const handleUnauthorized = () => {
    localStorage.clear()
    window.location.reload();
};


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

export const DeleteWorkOrder = (id) => async (dispatch) =>
    handleRequest(dispatch, `/workorder/${id}`, 'DELETE', [
        TASK_DELETE_WORK_ORDER_START,
        TASK_DELETE_WORK_ORDER_COMPLETE,
        TASK_DELETE_WORK_ORDER_END
    ]);

export const GetCompanyUser = () => async (dispatch) =>
    handleRequest(dispatch, '/users/all', 'GET', [
        TASK_LOAD_COMPANY_USER_START,
        TASK_LOAD_COMPANY_USER_COMPLETE,
        TASK_LOAD_COMPANY_USER_END
    ]);


export const GetMyWorkOrder = (worksiteId, page, query, moduleFilter, setIsNext) => async (dispatch, getState) => {
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ARCHIVED_COMPLETE, loading: false, payload: [] });

    const hasQuery = query?.trim()?.length > 0;

    const hasCpc =
        moduleFilter?.cpc?.length > 0;

    const hasPriority =
        moduleFilter?.priorityFilter?.length > 0;

    const hasPolygonType =
        moduleFilter?.polygonType?.length > 0;

    const hasLinkModule =
        moduleFilter?.linkModule?.length > 0;

    const hasLocationFilter =
        moduleFilter?.location?.lat !== undefined ||
        moduleFilter?.location?.lng !== undefined ||
        moduleFilter?.location?.radius !== undefined;

    const hasCreationDateFilter =
        !!moduleFilter?.createDateS ||
        !!moduleFilter?.createDateE;

    const hasCompletionDateFilter =
        !!moduleFilter?.dateCompletedS ||
        !!moduleFilter?.dateCompletedE;

    const hasDAADateFilter =
        !!moduleFilter?.dateAAS ||
        !!moduleFilter?.dateAAE;

    const hasExtraFieldFilter =
        !!moduleFilter?.extraData?.name ||
        !!moduleFilter?.extraData?.type;

    const hasWorkOrderNumber =
        !!moduleFilter?.workOrderNumber;

    const hasAssigneeFilter =
        !!moduleFilter?.assigneEmail ||
        !!moduleFilter?.assigneName;

    const hasCreatorFilter =
        !!moduleFilter?.creatorEmail ||
        !!moduleFilter?.creatorName;

    const hasEntryRequirements =
        !!moduleFilter?.entryRequirements;

    const hasHoursWorked =
        !!moduleFilter?.hoursWorked;

    const hasAnyFilter =
        hasQuery ||
        hasCpc ||
        hasPriority ||
        hasPolygonType ||
        hasLinkModule ||
        hasLocationFilter ||
        hasCreationDateFilter ||
        hasCompletionDateFilter ||
        hasDAADateFilter ||
        hasExtraFieldFilter ||
        hasWorkOrderNumber ||
        hasAssigneeFilter ||
        hasCreatorFilter ||
        hasEntryRequirements ||
        hasHoursWorked;


    // Clear old data when any filter/search is applied
    // if (hasAnyFilter) {
    //     dispatch({
    //         type: TASK_LOAD_MY_WORK_ORDER_COMPLETE,
    //         loading: false,
    //         payload: [],
    //     });
    // }

    const toISO = (date) => {
        if (!date) return null;
        return new Date(date).toISOString();
    };


    const params = new URLSearchParams({
        worksiteId,
        page,
        title: query || "",
        sortBy: moduleFilter?.sortBy || "newest",
    });

    if (moduleFilter?.cpc?.length > 0) {
        moduleFilter.cpc.forEach((element) => {
            params.append("cpc[]", element);
        });
    }
    if (moduleFilter?.priorityFilter?.length > 0) {
        moduleFilter.priorityFilter.forEach((element) => {
            params.append("priority[]", element);
        });
    }
    if (moduleFilter?.polygonType?.length > 0) {
        moduleFilter.polygonType.forEach((element) => {
            params.append("polygon_type[]", element);
        });
    }
    if (moduleFilter?.linkModule?.length > 0) {
        moduleFilter.linkModule.forEach((element) => {
            params.append("wol[]", element);
        });
    }
    if (moduleFilter?.location) {
        if (moduleFilter?.location?.lat !== undefined) {
            params.append("lat", moduleFilter.location.lat);
        }
        if (moduleFilter?.location?.lng !== undefined) {
            params.append("long", moduleFilter.location.lng);
        }
        if (moduleFilter?.location?.radius !== undefined) {
            params.append("radius", moduleFilter.location.radius);
        }
    }
    if (moduleFilter?.createDateS) {
        params.append(
            "creation_start_date",
            toISO(moduleFilter.createDateS)
        );
    }
    if (moduleFilter?.createDateE) {
        params.append(
            "creation_end_date",
            toISO(moduleFilter.createDateE)
        );
    }
    if (moduleFilter?.dateCompletedS) {
        params.append(
            "completion_start_date",
            toISO(moduleFilter.dateCompletedS)
        );
    }
    if (moduleFilter?.dateCompletedE) {
        params.append(
            "completion_end_date",
            toISO(moduleFilter.dateCompletedE)
        );
    }
    if (moduleFilter?.dateAAS) {
        params.append(
            "daa_start_date",
            toISO(moduleFilter.dateAAS)
        );
    }
    if (moduleFilter?.dateAAE) {
        params.append(
            "daa_end_date",
            toISO(moduleFilter.dateAAE)
        );
    }
    if (moduleFilter?.extraData?.name) {
        params.append(
            "extraFieldName",
            moduleFilter.extraData.name
        );
    }
    if (moduleFilter?.extraData?.type) {
        params.append(
            "extraFieldType",
            moduleFilter.extraData.type
        );
    }
    if (moduleFilter?.workOrderNumber) {
        params.append(
            "woNumber",
            moduleFilter.workOrderNumber
        );
    }
    if (moduleFilter?.assigneEmail) {
        params.append(
            "assignToEmail",
            moduleFilter.assigneEmail
        );
    }
    if (moduleFilter?.assigneName) {
        params.append(
            "assignToName",
            moduleFilter.assigneName
        );
    }
    if (moduleFilter?.creatorEmail) {
        params.append(
            "createdByEmail",
            moduleFilter.creatorEmail
        );
    }
    if (moduleFilter?.creatorName) {
        params.append(
            "createdByName",
            moduleFilter.creatorName
        );
    }
    if (moduleFilter?.entryRequirements) {
        params.append(
            "entryRequirements",
            moduleFilter.entryRequirements
        );
    }
    if (moduleFilter?.hoursWorked) {
        params.append(
            "whName",
            moduleFilter.hoursWorked
        );
    }
    if (moduleFilter?.workOrderModuleName) {
        params.append(
            "wol_title",
            moduleFilter.workOrderModuleName
        );
    }



    const { myWorkOrderData } = getState()?.WorkOrderReducer
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/workorder?${params.toString()}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    try {
        dispatch({ type: TASK_LOAD_MY_WORK_ORDER_START, loading: true, networkError: false });
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
            const existingIds = new Set(myWorkOrderData?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            await dispatch({ type: TASK_LOAD_MY_WORK_ORDER_COMPLETE, loading: false, payload: [...myWorkOrderData, ...filteredRes] });
            setIsNext(filteredRes?.length <= 1 ? false : true);
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_LOAD_MY_WORK_ORDER_EXPIRED_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
        } else {
            dispatch({ type: TASK_LOAD_MY_WORK_ORDER_END, loading: false, networkError: true });
        }
    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_LOAD_MY_WORK_ORDER_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};


export const GetMyAssignedWorkOrder = (worksiteId, page, query, moduleFilter, setIsNext) => async (dispatch, getState) => {
    dispatch({ type: TASK_LOAD_MY_WORK_ORDER_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ARCHIVED_COMPLETE, loading: false, payload: [] });



    dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });


    // console.log(moduleFilter.linkModule,'askdaskdjka')


    const hasQuery = query?.trim()?.length > 0;

    const hasCpc =
        moduleFilter?.cpc?.length > 0;

    const hasPriority =
        moduleFilter?.priorityFilter?.length > 0;

    const hasPolygonType =
        moduleFilter?.polygonType?.length > 0;

    const hasLinkModule =
        moduleFilter?.linkModule?.length > 0;

    const hasLocationFilter =
        moduleFilter?.location?.lat !== undefined ||
        moduleFilter?.location?.lng !== undefined ||
        moduleFilter?.location?.radius !== undefined;

    const hasCreationDateFilter =
        !!moduleFilter?.createDateS ||
        !!moduleFilter?.createDateE;

    const hasCompletionDateFilter =
        !!moduleFilter?.dateCompletedS ||
        !!moduleFilter?.dateCompletedE;

    const hasDAADateFilter =
        !!moduleFilter?.dateAAS ||
        !!moduleFilter?.dateAAE;

    const hasExtraFieldFilter =
        !!moduleFilter?.extraData?.name ||
        !!moduleFilter?.extraData?.type;

    const hasWorkOrderNumber =
        !!moduleFilter?.workOrderNumber;

    const hasAssigneeFilter =
        !!moduleFilter?.assigneEmail ||
        !!moduleFilter?.assigneName;

    const hasCreatorFilter =
        !!moduleFilter?.creatorEmail ||
        !!moduleFilter?.creatorName;

    const hasEntryRequirements =
        !!moduleFilter?.entryRequirements;

    const hasHoursWorked =
        !!moduleFilter?.hoursWorked;

    const hasAnyFilter =
        hasQuery ||
        hasCpc ||
        hasPriority ||
        hasPolygonType ||
        hasLinkModule ||
        hasLocationFilter ||
        hasCreationDateFilter ||
        hasCompletionDateFilter ||
        hasDAADateFilter ||
        hasExtraFieldFilter ||
        hasWorkOrderNumber ||
        hasAssigneeFilter ||
        hasCreatorFilter ||
        hasEntryRequirements ||
        hasHoursWorked;


    // Clear old data when any filter/search is applied
    // if (hasAnyFilter) {
    //     dispatch({
    //         type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE,
    //         loading: false,
    //         payload: [],
    //     });
    // }


    const toISO = (date) => {
        if (!date) return null;
        return new Date(date).toISOString();
    };


    const params = new URLSearchParams({
        worksiteId,
        page,
        title: query || "",
        sortBy: moduleFilter?.sortBy || "newest",
    });

    if (moduleFilter?.cpc?.length > 0) {
        moduleFilter.cpc.forEach((element) => {
            params.append("cpc[]", element);
        });
    }
    if (moduleFilter?.priorityFilter?.length > 0) {
        moduleFilter.priorityFilter.forEach((element) => {
            params.append("priority[]", element);
        });
    }
    if (moduleFilter?.polygonType?.length > 0) {
        moduleFilter.polygonType.forEach((element) => {
            params.append("polygon_type[]", element);
        });
    }
    if (moduleFilter?.linkModule?.length > 0) {
        moduleFilter.linkModule.forEach((element) => {
            params.append("wol[]", element);
        });
    }
    if (moduleFilter?.location) {
        if (moduleFilter?.location?.lat !== undefined) {
            params.append("lat", moduleFilter.location.lat);
        }
        if (moduleFilter?.location?.lng !== undefined) {
            params.append("long", moduleFilter.location.lng);
        }
        if (moduleFilter?.location?.radius !== undefined) {
            params.append("radius", moduleFilter.location.radius);
        }
    }
    if (moduleFilter?.createDateS) {
        params.append(
            "creation_start_date",
            toISO(moduleFilter.createDateS)
        );
    }
    if (moduleFilter?.createDateE) {
        params.append(
            "creation_end_date",
            toISO(moduleFilter.createDateE)
        );
    }
    if (moduleFilter?.dateCompletedS) {
        params.append(
            "completion_start_date",
            toISO(moduleFilter.dateCompletedS)
        );
    }
    if (moduleFilter?.dateCompletedE) {
        params.append(
            "completion_end_date",
            toISO(moduleFilter.dateCompletedE)
        );
    }
    if (moduleFilter?.dateAAS) {
        params.append(
            "daa_start_date",
            toISO(moduleFilter.dateAAS)
        );
    }

    if (moduleFilter?.dateAAE) {
        params.append(
            "daa_end_date",
            toISO(moduleFilter.dateAAE)
        );
    }
    if (moduleFilter?.extraData?.name) {
        params.append(
            "extraFieldName",
            moduleFilter.extraData.name
        );
    }
    if (moduleFilter?.extraData?.type) {
        params.append(
            "extraFieldType",
            moduleFilter.extraData.type
        );
    }
    if (moduleFilter?.workOrderNumber) {
        params.append(
            "woNumber",
            moduleFilter.workOrderNumber
        );
    }
    if (moduleFilter?.assigneEmail) {
        params.append(
            "assignToEmail",
            moduleFilter.assigneEmail
        );
    }
    if (moduleFilter?.assigneName) {
        params.append(
            "assignToName",
            moduleFilter.assigneName
        );
    }
    if (moduleFilter?.creatorEmail) {
        params.append(
            "createdByEmail",
            moduleFilter.creatorEmail
        );
    }
    if (moduleFilter?.workOrderModuleName) {
        params.append(
            "wol_title",
            moduleFilter.workOrderModuleName
        );
    }
    if (moduleFilter?.creatorName) {
        params.append(
            "createdByName",
            moduleFilter.creatorName
        );
    }
    if (moduleFilter?.entryRequirements) {
        params.append(
            "entryRequirements",
            moduleFilter.entryRequirements
        );
    }
    if (moduleFilter?.hoursWorked) {
        params.append(
            "whName",
            moduleFilter.hoursWorked
        );
    }



    const { assignedWorkOrderData } = getState()?.WorkOrderReducer

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/workorder/not-archived-requested-by?${params.toString()}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
        dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_START, loading: true, networkError: false });
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
            const existingIds = new Set(assignedWorkOrderData?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [...assignedWorkOrderData, ...filteredRes] });
            setIsNext(filteredRes?.length <= 1 ? false : true);
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_EXPIRED_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
            dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_END, loading: false, networkError: true });
        } else {
            dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};


export const GetMyArchivedWorkOrder = (worksiteId, page, query, moduleFilter, setIsNext) => async (dispatch, getState) => {
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_MY_WORK_ORDER_COMPLETE, loading: false, payload: [] });

    const hasQuery = query?.trim().length > 0;

    const hasCpc =
        moduleFilter?.cpc?.length > 0;

    const hasPriority =
        moduleFilter?.priorityFilter?.length > 0;

    const hasPolygonType =
        moduleFilter?.polygonType?.length > 0;

    const hasLinkModule =
        moduleFilter?.linkModule?.length > 0;

    const hasLocationFilter =
        moduleFilter?.location?.lat !== undefined ||
        moduleFilter?.location?.lng !== undefined ||
        moduleFilter?.location?.radius !== undefined;

    const hasCreationDateFilter =
        !!moduleFilter?.createDateS ||
        !!moduleFilter?.createDateE;

    const hasCompletionDateFilter =
        !!moduleFilter?.dateCompletedS ||
        !!moduleFilter?.dateCompletedE;

    const hasDAADateFilter =
        !!moduleFilter?.dateAAS ||
        !!moduleFilter?.dateAAE;

    const hasExtraFieldFilter =
        !!moduleFilter?.extraData?.name ||
        !!moduleFilter?.extraData?.type;

    const hasWorkOrderNumber =
        !!moduleFilter?.workOrderNumber;

    const hasAssigneeFilter =
        !!moduleFilter?.assigneEmail ||
        !!moduleFilter?.assigneName;

    const hasCreatorFilter =
        !!moduleFilter?.creatorEmail ||
        !!moduleFilter?.creatorName;

    const hasEntryRequirements =
        !!moduleFilter?.entryRequirements;

    const hasHoursWorked =
        !!moduleFilter?.hoursWorked;

    const hasAnyFilter =
        hasQuery ||
        hasCpc ||
        hasPriority ||
        hasPolygonType ||
        hasLinkModule ||
        hasLocationFilter ||
        hasCreationDateFilter ||
        hasCompletionDateFilter ||
        hasDAADateFilter ||
        hasExtraFieldFilter ||
        hasWorkOrderNumber ||
        hasAssigneeFilter ||
        hasCreatorFilter ||
        hasEntryRequirements ||
        hasHoursWorked;


    // Clear old data when any filter/search is applied
    // if (hasAnyFilter) {
    //     dispatch({
    //         type: TASK_LOAD_ARCHIVED_COMPLETE,
    //         loading: false,
    //         payload: [],
    //     });
    // }

    const toISO = (date) => {
        if (!date) return null;
        return new Date(date).toISOString();
    };


    const params = new URLSearchParams({
        worksiteId,
        page,
        title: query || "",
        sortBy: moduleFilter?.sortBy || "newest",
    });

    if (moduleFilter?.cpc?.length > 0) {
        moduleFilter.cpc.forEach((element) => {
            params.append("cpc[]", element);
        });
    }
    if (moduleFilter?.priorityFilter?.length > 0) {
        moduleFilter.priorityFilter.forEach((element) => {
            params.append("priority[]", element);
        });
    }
    if (moduleFilter?.polygonType?.length > 0) {
        moduleFilter.polygonType.forEach((element) => {
            params.append("polygon_type[]", element);
        });
    }
    if (moduleFilter?.linkModule?.length > 0) {
        moduleFilter.linkModule.forEach((element) => {
            params.append("wol[]", element);
        });
    }
    if (moduleFilter?.location) {
        if (moduleFilter?.location?.lat !== undefined) {
            params.append("lat", moduleFilter.location.lat);
        }
        if (moduleFilter?.location?.lng !== undefined) {
            params.append("long", moduleFilter.location.lng);
        }
        if (moduleFilter?.location?.radius !== undefined) {
            params.append("radius", moduleFilter.location.radius);
        }
    }
    if (moduleFilter?.createDateS) {
        params.append(
            "creation_start_date",
            toISO(moduleFilter.createDateS)
        );
    }
    if (moduleFilter?.createDateE) {
        params.append(
            "creation_end_date",
            toISO(moduleFilter.createDateE)
        );
    }
    if (moduleFilter?.dateCompletedS) {
        params.append(
            "completion_start_date",
            toISO(moduleFilter.dateCompletedS)
        );
    }
    if (moduleFilter?.dateCompletedE) {
        params.append(
            "completion_end_date",
            toISO(moduleFilter.dateCompletedE)
        );
    }
    if (moduleFilter?.dateAAS) {
        params.append(
            "daa_start_date",
            toISO(moduleFilter.dateAAS)
        );
    }
    if (moduleFilter?.dateAAE) {
        params.append(
            "daa_end_date",
            toISO(moduleFilter.dateAAE)
        );
    }
    if (moduleFilter?.extraData?.name) {
        params.append(
            "extraFieldName",
            moduleFilter.extraData.name
        );
    }
    if (moduleFilter?.extraData?.type) {
        params.append(
            "extraFieldType",
            moduleFilter.extraData.type
        );
    }
    if (moduleFilter?.workOrderNumber) {
        params.append(
            "woNumber",
            moduleFilter.workOrderNumber
        );
    }
    if (moduleFilter?.assigneEmail) {
        params.append(
            "assignToEmail",
            moduleFilter.assigneEmail
        );
    }
    if (moduleFilter?.assigneName) {
        params.append(
            "assignToName",
            moduleFilter.assigneName
        );
    }
    if (moduleFilter?.creatorEmail) {
        params.append(
            "createdByEmail",
            moduleFilter.creatorEmail
        );
    }
    if (moduleFilter?.creatorName) {
        params.append(
            "createdByName",
            moduleFilter.creatorName
        );
    }
    if (moduleFilter?.entryRequirements) {
        params.append(
            "entryRequirements",
            moduleFilter.entryRequirements
        );
    }
    if (moduleFilter?.workOrderModuleName) {
        params.append(
            "wol_title",
            moduleFilter.workOrderModuleName
        );
    }
    if (moduleFilter?.hoursWorked) {
        params.append(
            "whName",
            moduleFilter.hoursWorked
        );
    }


    const { archivedWorkOrderData } = getState()?.WorkOrderReducer

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/workorder/archived?${params.toString()}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
        dispatch({ type: TASK_LOAD_ARCHIVED_START, loading: true, networkError: false });

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
            const existingIds = new Set(archivedWorkOrderData?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            dispatch({ type: TASK_LOAD_ARCHIVED_COMPLETE, loading: false, payload: [...archivedWorkOrderData, ...filteredRes] });
            setIsNext(filteredRes?.length <= 1 ? false : true);
            return res.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_LOAD_ARCHIVED_EXPIRED_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
            dispatch({ type: TASK_LOAD_ARCHIVED_END, loading: false, networkError: true });
        } else {
            dispatch({ type: TASK_LOAD_ARCHIVED_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_LOAD_ARCHIVED_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};







export const ApproveWorkOrder = (id) => async (dispatch) =>
    handleRequest(dispatch, `/workorder/approved/${id}`, 'PATCH', [
        TASK_APPROVE_WORK_ORDER_START,
        TASK_APPROVE_WORK_ORDER_COMPLETE,
        TASK_APPROVE_WORK_ORDER_END
    ]);

export const DeclineWorkOrder = (id) => async (dispatch) =>
    handleRequest(dispatch, `/workorder/declined/${id}`, 'PATCH', [
        TASK_DECLINE_WORK_ORDER_START,
        TASK_DECLINE_WORK_ORDER_COMPLETE,
        TASK_DECLINE_WORK_ORDER_END
    ]);

export const ArchiveWorkOrder = (id) => async (dispatch) => {
    handleRequest(dispatch, `/workorder/${id}`, 'DELETE', [
        TASK_ARCHIVE_WORK_ORDER_START,
        TASK_ARCHIVE_WORK_ORDER_COMPLETE,
        TASK_ARCHIVE_WORK_ORDER_END
    ]);

}

export const UnArchiveWorkOrder = (id) => async (dispatch) =>
    handleRequest(dispatch, `/workorder/recover/${id}`, 'PATCH', [
        TASK_UNARCHIVE_WORK_ORDER_START,
        TASK_UNARCHIVE_WORK_ORDER_COMPLETE,
        TASK_UNARCHIVE_WORK_ORDER_END
    ]);

export const CompleteWorkOrder = (body) => async (dispatch) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/workorder/completed`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
        dispatch({ type: TASK_COMPLETE_WORK_ORDER_START, loading: true, networkError: false });
        const options = {
            method: 'PATCH',
            headers: {
                "authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify(body),
        };

        const response = await fetch(`${baseUrl}${url}`, options);
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_COMPLETE_WORK_ORDER_COMPLETE, loading: false, payload: res });
        }
        else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
            dispatch({ type: TASK_COMPLETE_WORK_ORDER_END, loading: false, networkError: true });
        } else {
            dispatch({ type: TASK_COMPLETE_WORK_ORDER_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_COMPLETE_WORK_ORDER_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }

}


export const WorkOrderGetById = (body) => async (dispatch) =>
    handleRequest(dispatch, `/workorder/ids/${body}`, 'GET', [
        TASK_GET_WORK_ORDER_BY_ID_START,
        TASK_GET_WORK_ORDER_BY_ID_COMPLETE,
        TASK_GET_WORK_ORDER_BY_ID_END
    ]);




export const workOrderGetDoc = (body) => async (dispatch, getState) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `files/signed-urls`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    try {
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        };

        const response = await fetch(`${baseUrl}${url}`, options);
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            return res || 0
        }
    } catch (error) {
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};



export const WorkOrderGetByIdMap = (body) => async (dispatch, getState) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/workorder/ids/${body}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    try {
        dispatch({ type: TASK_GET_WORK_ORDER_BY_ID_START, loading: true, networkError: false });
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
            dispatch({ type: TASK_GET_WORK_ORDER_BY_ID_START, loading: false, networkError: false });
            return res || 0
        }
        else {
            dispatch({ type: TASK_GET_WORK_ORDER_BY_ID_END, loading: false, networkError: true });
        }
    } catch (error) {
        dispatch({ type: TASK_GET_WORK_ORDER_BY_ID_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};


export const WorkSiteGetByIdMap = (body) => async (dispatch, getState) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/worksites/get-by-id/${body}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    try {
        dispatch({ type: TASK_LOAD_WORKSITE_DETAIL_START, loading: true, networkError: false });
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
            dispatch({ type: TASK_LOAD_WORKSITE_DETAIL_START, loading: false, networkError: false });
            return res || 0
        }
        else {
            dispatch({ type: TASK_LOAD_WORKSITE_DETAIL_END, loading: false, networkError: true });
        }
    } catch (error) {
        dispatch({ type: TASK_LOAD_WORKSITE_DETAIL_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};


export const MusterByIdMap = (body) => async (dispatch, getState) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/muster/${body}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    try {
        dispatch({ type: TASK_LOAD_WORKSITE_DETAIL_START, loading: true, networkError: false });
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
            dispatch({ type: TASK_LOAD_WORKSITE_DETAIL_START, loading: false, networkError: false });
            return res || 0
        }
        else {
            dispatch({ type: TASK_LOAD_WORKSITE_DETAIL_END, loading: false, networkError: true });
        }
    } catch (error) {
        dispatch({ type: TASK_LOAD_WORKSITE_DETAIL_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};
