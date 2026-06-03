import {
    TASK_GET_PROJECT_START,
    TASK_GET_PROJECT_COMPLETE,
    TASK_GET_PROJECT_END,
    TASK_GET_PROJECT_ERROR,
    TASK_GET_ARCHIVED_PROJECT_START,
    TASK_GET_ARCHIVED_PROJECT_COMPLETE,
    TASK_GET_ARCHIVED_PROJECT_END,
    TASK_GET_ARCHIVED_PROJECT_ERROR,
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
    TASK_GET_PROJECT_DETAIL_START,
    TASK_GET_PROJECT_DETAIL_COMPLETE,
    TASK_GET_PROJECT_DETAIL_END,
    TASK_ARCHIVE_PROJECT_START,
    TASK_ARCHIVE_PROJECT_COMPLETE,
    TASK_ARCHIVE_PROJECT_END,
    TASK_GET_DAILY_PROJECT_START,
    TASK_GET_DAILY_PROJECT_COMPLETE,
    TASK_GET_DAILY_PROJECT_END,
    TASK_GET_DAILY_PROJECT_DETAIL_START,
    TASK_GET_DAILY_PROJECT_DETAIL_COMPLETE,
    TASK_GET_DAILY_PROJECT_DETAIL_END,
    TASK_DELETE_DAILY_PROJECT_START,
    TASK_DELETE_DAILY_PROJECT_COMPLETE,
    TASK_DELETE_DAILY_PROJECT_END,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_GET_POI_COMPLETE,
    TASK_GET_ALERTS_COMPLETE,
    TASK_GET_ASSETS_COMPLETE,
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


// export const GetProjects = (worksiteId, page, query,params2) => async (dispatch, getState) => {
//     dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [] });
//     dispatch({ type: TASK_GET_ARCHIVED_PROJECT_COMPLETE, loading: true, payload: [] });
//     dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
//     dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
//     dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
//     dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });

//     if (query !== "") {
//         await dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
//     }
//     const { projectData } = getState()?.ProjectReducer
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), TIMEOUT);
//     const url = `/projects?worksiteId=${worksiteId}&page=${page}&title=${query}&sortBy=newest`;
//     const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

//     try {
//         dispatch({ type: TASK_GET_PROJECT_START, loading: true, networkError: false });
//         const options = {
//             method: 'GET',
//             headers: {
//                 "Content-Type": "application/json",
//                 "authorization": `Bearer ${token}`,
//             },
//             signal: controller.signal,
//         };

//         const response = await fetch(`${baseUrl}${url}`, options);
//         const res = await response.json();
//         if (response.status === 200 || response.status === 201) {
//             const existingIds = new Set(projectData?.map(item => item._id));
//             const filteredRes = res.filter(item => !existingIds.has(item._id));
//             localStorage.removeItem('expireUser')
//             dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [...projectData, ...filteredRes] });
//             return res?.length || 0
//         } else if (response.status === 403) {
//             if ("roleUpdated" in res) {
//                 handleUnauthorized();
//             }
//             else {
//                 localStorage.setItem('expireUser', 'true')
//                 dispatch({ type: TASK_GET_PROJECT_ERROR, loading: false, expiredError: true });
//             }
//         } else if (response.status === 401) {
//             if (typeof handleUnauthorized === "function") handleUnauthorized();
//         } else {
//             dispatch({ type: TASK_GET_PROJECT_END, loading: false, networkError: true });
//         }

//     } catch (error) {
//         console.error("Request error:", error);
//         dispatch({ type: TASK_GET_PROJECT_END, loading: false, networkError: true });
//         if (error.name === "AbortError") console.error("Request timed out");
//     } finally {
//         clearTimeout(timeout);
//     }
// };





export const GetProjects =
    (
        worksiteId,
        page,
        query,
        params2,
        setIsNext
    ) =>
        async (dispatch, getState) => {

            dispatch({
                type: TASK_LOAD_TEAM_COMPLETE,
                loading: false,
                payload: []
            });

            dispatch({
                type: TASK_GET_ARCHIVED_PROJECT_COMPLETE,
                loading: true,
                payload: []
            });

            dispatch({
                type: TASK_GET_POI_COMPLETE,
                loading: false,
                payload: []
            });

            dispatch({
                type: TASK_GET_ALERTS_COMPLETE,
                loading: false,
                payload: []
            });

            dispatch({
                type: TASK_GET_ASSETS_COMPLETE,
                loading: false,
                payload: []
            });

            dispatch({
                type:
                    TASK_LOAD_ASSIGEND_TO_ME_COMPLETE,
                loading: false,
                payload: []
            });

            // =========================
            // FILTER CHECKS
            // =========================

            const hasQuery = query?.trim()?.length > 0;

            const hasElevationFilter =
                params2?.elevationLevels
                    ?.length > 0;

            const hasPolygonType =
                params2?.polygonType
                    ?.length > 0;

            const hasExtraField =
                !!params2?.extraData?.name ||
                !!params2?.extraData?.type;

            const hasDepartment =
                !!params2?.departmentName;

            const hasManager =
                !!params2?.managerName ||
                !!params2?.managerEmail;

            const hasContractor =
                !!params2?.contractorName ||
                !!params2?.contractorEmail ||
                !!params2?.contractorZipCode ||
                !!params2?.contractorCountry ||
                !!params2?.contractorPhone ||
                !!params2?.contractorOrderPurchaseNumber;

            const hasLocationFilter =
                params2?.location?.lat !==
                undefined ||
                params2?.location?.lng !==
                undefined ||
                params2?.location?.radius !==
                undefined;

            const hasAnyFilter =
                hasQuery ||
                hasElevationFilter ||
                hasPolygonType ||
                hasExtraField ||
                hasDepartment ||
                hasManager ||
                hasContractor ||
                hasLocationFilter;


            // Clear old projects
            // if (hasAnyFilter) {
            //     dispatch({
            //         type:
            //             TASK_GET_PROJECT_COMPLETE,
            //         loading: false,
            //         payload: [],
            //     });
            // }

            const {
                projectData
            } = getState()?.ProjectReducer;

            const controller =
                new AbortController();

            const timeout = setTimeout(
                () => controller.abort(),
                TIMEOUT
            );

            // =========================
            // QUERY PARAMS
            // =========================

            const params =
                new URLSearchParams({
                    worksiteId,
                    page,
                    title: query || "",
                    sortBy:
                        params2?.sortBy ||
                        "newest",
                });

            // Elevation Levels
            if (
                params2?.elevationLevels
                    ?.length > 0
            ) {

                params2.elevationLevels.forEach(
                    (element) => {

                        params.append(
                            "elevationLevels[]",
                            element
                        );
                    }
                );
            }

            // Polygon Types
            if (
                params2?.polygonType
                    ?.length > 0
            ) {

                params2.polygonType.forEach(
                    (element) => {

                        params.append(
                            "polygon_type[]",
                            element
                        );
                    }
                );
            }

            // Extra Data
            if (
                params2?.extraData?.name
            ) {

                params.append(
                    "extraFieldName",
                    params2.extraData.name
                );
            }

            if (
                params2?.extraData?.type
            ) {

                params.append(
                    "extraFieldType",
                    params2.extraData.type
                );
            }

            // Department
            if (
                params2?.departmentName
            ) {

                params.append(
                    "departmentName",
                    params2.departmentName
                );
            }

            // Project Manager
            if (
                params2?.managerName
            ) {

                params.append(
                    "pmName",
                    params2.managerName
                );
            }

            if (
                params2?.managerEmail
            ) {

                params.append(
                    "pmEmail",
                    params2.managerEmail
                );
            }

            // Contractor
            if (
                params2?.contractorName
            ) {

                params.append(
                    "contractorName",
                    params2.contractorName
                );
            }

            if (
                params2?.contractorEmail
            ) {

                params.append(
                    "contractorEmail",
                    params2.contractorEmail
                );
            }

            if (
                params2?.contractorZipCode
            ) {

                params.append(
                    "contractorZipCode",
                    params2.contractorZipCode
                );
            }

            if (
                params2?.contractorCountry
            ) {

                params.append(
                    "contractorCountry",
                    params2.contractorCountry
                );
            }

            if (
                params2?.contractorPhone
            ) {

                params.append(
                    "contractorPhone",
                    params2.contractorPhone
                );
            }

            if (
                params2?.contractorOrderPurchaseNumber
            ) {

                params.append(
                    "contractorOrderPurchaseNumber",
                    params2.contractorOrderPurchaseNumber
                );
            }

            // Location
            if (
                params2?.location?.lat !==
                undefined
            ) {

                params.append(
                    "lat",
                    params2.location.lat
                );
            }

            if (
                params2?.location?.lng !==
                undefined
            ) {

                params.append(
                    "long",
                    params2.location.lng
                );
            }

            if (
                params2?.location
                    ?.radius !== undefined
            ) {

                params.append(
                    "radius",
                    params2.location.radius
                );
            }

            // =========================
            // API
            // =========================

            const url =
                `/projects?${params.toString()}`;

            const token =
                localStorage.getItem(
                    "aX7@qB*9tw!1zV+T2/&1^x=="
                );

            try {

                dispatch({
                    type:
                        TASK_GET_PROJECT_START,
                    loading: true,
                    networkError: false
                });

                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json",
                        authorization:
                            `Bearer ${token}`,
                    },
                    signal: controller.signal,
                };

                const response =
                    await fetch(
                        `${baseUrl}${url}`,
                        options
                    );

                const res =
                    await response.json();

                if (
                    response.status === 200 ||
                    response.status === 201
                ) {

                    const existingIds =
                        new Set(
                            projectData?.map(
                                (item) =>
                                    item._id
                            )
                        );

                    const filteredRes =
                        res.filter(
                            (item) =>
                                !existingIds.has(
                                    item._id
                                )
                        );

                    localStorage.removeItem(
                        "expireUser"
                    );

                    dispatch({
                        type:
                            TASK_GET_PROJECT_COMPLETE,
                        loading: false,
                        payload: [...projectData, ...filteredRes],
                    });
                    setIsNext(filteredRes?.length <= 1 ? false : true);
                    return (
                        res?.length || 0
                    );

                } else if (
                    response.status === 403
                ) {

                    if (
                        "roleUpdated" in res
                    ) {

                        handleUnauthorized();

                    } else {

                        localStorage.setItem(
                            "expireUser",
                            "true"
                        );

                        dispatch({
                            type:
                                TASK_GET_PROJECT_ERROR,
                            loading: false,
                            expiredError: true,
                        });
                    }

                } else if (
                    response.status === 401
                ) {

                    if (
                        typeof handleUnauthorized ===
                        "function"
                    ) {

                        handleUnauthorized();
                    }

                } else {

                    dispatch({
                        type:
                            TASK_GET_PROJECT_END,
                        loading: false,
                        networkError: true,
                    });
                }

            } catch (error) {

                console.error(
                    "Request error:",
                    error
                );

                dispatch({
                    type:
                        TASK_GET_PROJECT_END,
                    loading: false,
                    networkError: true,
                });

                if (
                    error.name ===
                    "AbortError"
                ) {

                    console.error(
                        "Request timed out"
                    );
                }

            } finally {

                clearTimeout(timeout);
            }
        };



export const GetArchivedProjects =
    (worksiteId, page, query, params2, setIsNext) =>
        async (dispatch, getState) => {

            dispatch({
                type: TASK_GET_PROJECT_COMPLETE,
                loading: true,
                payload: []
            });

            const hasQuery = query?.trim()?.length > 0;

            const hasElevationFilter =
                params2?.elevationLevels
                    ?.length > 0;

            const hasPolygonType =
                params2?.polygonType
                    ?.length > 0;

            const hasExtraField =
                !!params2?.extraData?.name ||
                !!params2?.extraData?.type;

            const hasDepartment =
                !!params2?.departmentName;

            const hasManager =
                !!params2?.managerName ||
                !!params2?.managerEmail;

            const hasContractor =
                !!params2?.contractorName ||
                !!params2?.contractorEmail ||
                !!params2?.contractorZipCode ||
                !!params2?.contractorCountry ||
                !!params2?.contractorPhone ||
                !!params2?.contractorOrderPurchaseNumber;

            const hasLocationFilter =
                params2?.location?.lat !==
                undefined ||
                params2?.location?.lng !==
                undefined ||
                params2?.location?.radius !==
                undefined;

            const hasAnyFilter =
                hasQuery ||
                hasElevationFilter ||
                hasPolygonType ||
                hasExtraField ||
                hasDepartment ||
                hasManager ||
                hasContractor ||
                hasLocationFilter;


            // Clear old projects
            // if (hasAnyFilter) {
            //     dispatch({
            //         type: TASK_GET_ARCHIVED_PROJECT_COMPLETE,
            //         loading: false,
            //         payload: [],
            //     });
            // }


            const { archivedProjectData } =
                getState()?.ProjectReducer;

            const controller =
                new AbortController();

            const timeout = setTimeout(
                () => controller.abort(),
                TIMEOUT
            );

            // =========================
            // QUERY PARAMS
            // =========================

            const params =
                new URLSearchParams({
                    worksiteId,
                    page,
                    title: query || "",
                    sortBy:
                        params2?.sortBy ||
                        "newest",
                });

            // Elevation Levels
            if (
                params2?.elevationLevels
                    ?.length > 0
            ) {
                params2.elevationLevels.forEach(
                    (element) => {
                        params.append(
                            "elevationLevels[]",
                            element
                        );
                    }
                );
            }

            // Polygon Type
            if (
                params2?.polygonType?.length >
                0
            ) {
                params2.polygonType.forEach(
                    (element) => {
                        params.append(
                            "polygon_type[]",
                            element
                        );
                    }
                );
            }

            // Extra Data
            if (
                params2?.extraData?.name
            ) {
                params.append(
                    "extraFieldName",
                    params2.extraData.name
                );
            }

            if (
                params2?.extraData?.type
            ) {
                params.append(
                    "extraFieldType",
                    params2.extraData.type
                );
            }

            // Department
            if (params2?.department) {
                params.append(
                    "departmentName",
                    params2.department
                );
            }

            // Model
            if (params2?.model) {
                params.append(
                    "modelName",
                    params2.model
                );
            }

            // Asset Type / Title
            if (params2?.assetType) {
                params.set(
                    "title",
                    params2.assetType
                );
            }

            // Location
            if (params2?.location) {

                if (
                    params2.location.lat !==
                    undefined
                ) {
                    params.append(
                        "lat",
                        params2.location.lat
                    );
                }

                if (
                    params2.location.lng !==
                    undefined
                ) {
                    params.append(
                        "long",
                        params2.location.lng
                    );
                }

                if (
                    params2.location
                        .radius !== undefined
                ) {
                    params.append(
                        "radius",
                        params2.location
                            .radius
                    );
                }
            }

            // =========================
            // API
            // =========================

            const url = `/projects/archived?${params.toString()}`;

            console.log(
                url,
                "ARCHIVED_PROJECT_URL"
            );

            const token =
                localStorage.getItem(
                    "aX7@qB*9tw!1zV+T2/&1^x=="
                );

            try {

                dispatch({
                    type:
                        TASK_GET_ARCHIVED_PROJECT_START,
                    loading: true,
                    networkError: false
                });

                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    signal:
                        controller.signal,
                };

                const response =
                    await fetch(
                        `${baseUrl}${url}`,
                        options
                    );

                const res =
                    await response.json();

                if (
                    response.status ===
                    200 ||
                    response.status ===
                    201
                ) {

                    const existingIds =
                        new Set(
                            archivedProjectData?.map(
                                (item) =>
                                    item._id
                            )
                        );

                    const filteredRes =
                        res.filter(
                            (item) =>
                                !existingIds.has(
                                    item._id
                                )
                        );

                    localStorage.removeItem(
                        "expireUser"
                    );

                    dispatch({
                        type:
                            TASK_GET_ARCHIVED_PROJECT_COMPLETE,
                        loading: false,
                        payload: [...archivedProjectData, ...filteredRes],
                    });
                    setIsNext(filteredRes?.length <= 1 ? false : true);
                    return (
                        res?.length || 0
                    );

                } else if (
                    response.status ===
                    403
                ) {

                    if (
                        "roleUpdated" in
                        res
                    ) {

                        handleUnauthorized();

                    } else {

                        localStorage.setItem(
                            "expireUser",
                            "true"
                        );

                        dispatch({
                            type:
                                TASK_GET_ARCHIVED_PROJECT_ERROR,
                            loading: false,
                            expiredError: true,
                        });
                    }

                } else if (
                    response.status ===
                    401
                ) {

                    if (
                        typeof handleUnauthorized ===
                        "function"
                    ) {
                        handleUnauthorized();
                    }

                    dispatch({
                        type:
                            TASK_GET_ARCHIVED_PROJECT_END,
                        loading: false,
                        networkError: true,
                    });

                } else {

                    dispatch({
                        type:
                            TASK_GET_ARCHIVED_PROJECT_END,
                        loading: false,
                        networkError: true,
                    });
                }

            } catch (error) {

                console.error(
                    "Request error:",
                    error
                );

                dispatch({
                    type:
                        TASK_GET_ARCHIVED_PROJECT_END,
                    loading: false,
                    networkError: true,
                });

                if (
                    error.name ===
                    "AbortError"
                ) {
                    console.error(
                        "Request timed out"
                    );
                }

            } finally {
                clearTimeout(timeout);
            }
        };











export const LoadDailyProject = (ID, page, query) => async (dispatch, getState) => {
    const { dailyProjectData } = getState()?.ProjectReducer
    if (query !== "") {
        await dispatch({ type: TASK_GET_DAILY_PROJECT_COMPLETE, loading: false, payload: [] });
    }


    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/dailyprojects?projectId=${ID}&createdAtOrder=desc&page=${page}&title=${query}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
        dispatch({ type: TASK_GET_DAILY_PROJECT_START, loading: true, networkError: false });
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
            const existingIds = new Set(dailyProjectData?.map(item => item._id));
            const filteredRes = res?.data?.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_GET_DAILY_PROJECT_COMPLETE, loading: false, payload: [...dailyProjectData, ...filteredRes], total: res.count });
            return res?.data?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_GET_ARCHIVED_PROJECT_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
            dispatch({ type: TASK_GET_DAILY_PROJECT_END, loading: false, networkError: true });
        } else {
            dispatch({ type: TASK_GET_DAILY_PROJECT_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_GET_DAILY_PROJECT_END, loading: false, networkError: true });
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



export const ArchiveProject = (ID) => async (dispatch) => {
    handleRequest(dispatch, `/projects/${ID}`, 'DELETE', [
        TASK_ARCHIVE_PROJECT_START,
        TASK_ARCHIVE_PROJECT_COMPLETE,
        TASK_ARCHIVE_PROJECT_END
    ]);
}


// Daily Project

// export const LoadDailyProject = (ID) => async (dispatch) => {
//     handleRequest(dispatch, `/dailyprojects?projectId=${ID}&createdAtOrder=desc`, 'GET', [
//         TASK_GET_DAILY_PROJECT_START,
//         TASK_GET_DAILY_PROJECT_COMPLETE,
//         TASK_GET_DAILY_PROJECT_END
//     ]);
// }


export const LoadDailyProjectDetail = (ID) => async (dispatch) => {
    handleRequest(dispatch, `/dailyprojects/${ID}`, 'GET', [
        TASK_GET_DAILY_PROJECT_DETAIL_START,
        TASK_GET_DAILY_PROJECT_DETAIL_COMPLETE,
        TASK_GET_DAILY_PROJECT_DETAIL_END
    ]);
}

export const DeleteDailyProject = (ID) => async (dispatch) => {
    handleRequest(dispatch, `/dailyprojects/${ID}`, 'DELETE', [
        TASK_DELETE_DAILY_PROJECT_START,
        TASK_DELETE_DAILY_PROJECT_COMPLETE,
        TASK_DELETE_DAILY_PROJECT_END
    ]);
}









export const GetProjectByID = (ID) => async (dispatch) => {
    dispatch({ type: TASK_GET_DAILY_PROJECT_COMPLETE, loading: false, payload: [] });
    handleRequest(dispatch, `/projects/${ID}`, 'GET', [
        TASK_GET_PROJECT_DETAIL_START,
        TASK_GET_PROJECT_DETAIL_COMPLETE,
        TASK_GET_PROJECT_DETAIL_END
    ]);
}




export const GetProjectByIDMap = (ID) => async (dispatch, getState) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/projects/${ID}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    try {
        dispatch({ type: TASK_GET_PROJECT_DETAIL_START, loading: true, networkError: false });
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
            dispatch({ type: TASK_GET_PROJECT_DETAIL_START, loading: false, networkError: false });
            return res || 0
        }
        else {
            dispatch({ type: TASK_GET_PROJECT_DETAIL_END, loading: false, networkError: true });
        }
    } catch (error) {
        dispatch({ type: TASK_GET_PROJECT_DETAIL_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};
