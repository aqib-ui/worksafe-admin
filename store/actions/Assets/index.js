import {
    TASK_GET_ASSETS_START,
    TASK_GET_ASSETS_COMPLETE,
    TASK_GET_ASSETS_END,
    TASK_GET_ASSETS_ERROR,
    TASK_GET_ARCHIVED_ASSETS_START,
    TASK_GET_ARCHIVED_ASSETS_COMPLETE,
    TASK_GET_ARCHIVED_ASSETS_END,
    TASK_GET_ARCHIVED_ASSETS_ERROR,
    TASK_GET_DEPARTMENT_START,
    TASK_GET_DEPARTMENT_COMPLETE,
    TASK_GET_DEPARTMENT_END,
    TASK_GET_MODEL_START,
    TASK_GET_MODEL_COMPLETE,
    TASK_GET_MODEL_END,
    TASK_GET_ASSET_TYPE_START,
    TASK_GET_ASSET_TYPE_COMPLETE,
    TASK_GET_ASSET_TYPE_END,
    TASK_GET_ASSET_DETAIL_START,
    TASK_GET_ASSET_DETAIL_COMPLETE,
    TASK_GET_ASSET_DETAIL_END,


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
    TASK_ARCHIVE_ASSETS_END,
    TASK_ARCHIVE_ASSETS_COMPLETE,
    TASK_ARCHIVE_ASSETS_START,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_GET_POI_COMPLETE,
    TASK_GET_ALERTS_COMPLETE,
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


export const GetAssets = (worksiteId, page, query, params2, setIsNext) => async (dispatch, getState) => {
    console.log("Params2 in action:", params2)
    dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ARCHIVED_ASSETS_COMPLETE, loading: true, payload: [] });

    const hasQuery =
        query?.trim()?.length > 0;

    const hasElevationFilter =
        params2?.elevationLevels?.length > 0;

    const hasPolygonType =
        params2?.polygonType?.length > 0;

    const hasExtraField =
        !!params2?.extraData?.name ||
        !!params2?.extraData?.type;

    const hasDepartment =
        !!params2?.department;

    const hasModel =
        !!params2?.model;

    const hasAssetType =
        !!params2?.assetType;

    const hasLocationFilter =
        params2?.location?.lat !== undefined ||
        params2?.location?.lng !== undefined ||
        params2?.location?.radius !== undefined;

    const hasAnyFilter =
        hasQuery ||
        hasElevationFilter ||
        hasPolygonType ||
        hasExtraField ||
        hasDepartment ||
        hasModel ||
        hasAssetType ||
        hasLocationFilter;


    // if (hasAnyFilter) {
    //     dispatch({
    //         type: TASK_GET_ASSETS_COMPLETE,
    //         loading: false,
    //         payload: [],
    //     });
    // }


    dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });

    const { AssetsData } = getState()?.AssetsReducer
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);

    const params = new URLSearchParams({
        worksiteId,
        page,
        title: query || params2?.assetType ? params2?.assetType : "",
        sortBy: params2?.sortBy || "newest",
    });
    if (params2?.elevationLevels?.length > 0) {
        params2.elevationLevels.forEach((element) => {
            params.append(
                "elevationLevels[]",
                element
            );
        });
    }
    if (params2?.polygonType?.length > 0) {
        params2.polygonType.forEach((element) => {
            params.append(
                "polygon_type[]",
                element
            );
        });
    }
    if (params2?.extraData?.name) {
        params.append(
            "extraFieldName",
            params2.extraData.name
        );
    }
    if (params2?.extraData?.type) {
        params.append(
            "extraFieldType",
            params2.extraData.type
        );
    }
    if (params2?.department) {
        params.append(
            "departmentName",
            params2.department
        );
    }
    if (params2?.model) {
        params.append(
            "modelName",
            params2.model
        );
    }
    if (
        params2?.location?.lat !== undefined
    ) {
        params.append(
            "lat",
            params2.location.lat
        );
    }
    if (
        params2?.location?.lng !== undefined
    ) {
        params.append(
            "long",
            params2.location.lng
        );
    }
    if (
        params2?.location?.radius !== undefined
    ) {
        params.append(
            "radius",
            params2.location.radius
        );
    }


    const url = `/assets?${params.toString()}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
        dispatch({ type: TASK_GET_ASSETS_START, loading: true, networkError: false });
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
            const existingIds = new Set(AssetsData?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [...AssetsData, ...filteredRes] });
            setIsNext(filteredRes?.length <= 1 ? false : true);
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_GET_ASSETS_ERROR, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
        } else {
            dispatch({ type: TASK_GET_ASSETS_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_GET_ASSETS_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};



export const GetArchivedAssets =
    (
        worksiteId,
        page,
        query,
        params2,
        setIsNext
    ) =>
        async (dispatch, getState) => {

            dispatch({
                type: TASK_GET_ASSETS_COMPLETE,
                loading: true,
                payload: []
            });

            const {
                archivedAssetsData
            } = getState()?.AssetsReducer;

            const controller =
                new AbortController();

            const timeout = setTimeout(
                () => controller.abort(),
                TIMEOUT
            );

            // =========================
            // FILTER CHECKS
            // =========================

            const hasQuery =
                query?.trim()?.length > 0;

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
                !!params2?.department;

            const hasModel =
                !!params2?.model;

            const hasAssetType =
                !!params2?.assetType;

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
                hasModel ||
                hasAssetType ||
                hasLocationFilter;


            // if (hasAnyFilter) {
            //     dispatch({
            //         type: TASK_GET_ARCHIVED_ASSETS_COMPLETE,
            //         loading: false,
            //         payload: [],
            //     });
            // }

            const params =
                new URLSearchParams({
                    worksiteId,
                    page,
                    title: query || params2?.assetType ? params2?.assetType : "",
                    sortBy:
                        params2?.sortBy ||
                        "newest",
                });

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

            if (params2?.department) {

                params.append(
                    "departmentName",
                    params2.department
                );
            }
            if (params2?.model) {
                params.append(
                    "modelName",
                    params2.model
                );
            }
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

            const url = `/assets/archived?${params.toString()}`;
            const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

            try {

                dispatch({
                    type:
                        TASK_GET_ARCHIVED_ASSETS_START,
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
                            archivedAssetsData?.map(
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
                        type: TASK_GET_ARCHIVED_ASSETS_COMPLETE,
                        loading: false,
                        payload: [...archivedAssetsData, ...filteredRes],
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
                                TASK_GET_ARCHIVED_ASSETS_ERROR,
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

                    dispatch({
                        type:
                            TASK_GET_ARCHIVED_ASSETS_END,
                        loading: false,
                        networkError: true,
                    });

                } else {

                    dispatch({
                        type:
                            TASK_GET_ARCHIVED_ASSETS_END,
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
                        TASK_GET_ARCHIVED_ASSETS_END,
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








export const ArchiveAssets = (ID) => async (dispatch) => {
    handleRequest(dispatch, `/assets/${ID}`, 'DELETE', [
        TASK_ARCHIVE_ASSETS_START,
        TASK_ARCHIVE_ASSETS_COMPLETE,
        TASK_ARCHIVE_ASSETS_END
    ]);
}


export const getDepartment = (worksiteId) => async (dispatch) => {
    handleRequest(dispatch, `/departments?worksiteId=${worksiteId}`, 'GET', [
        TASK_GET_DEPARTMENT_START,
        TASK_GET_DEPARTMENT_COMPLETE,
        TASK_GET_DEPARTMENT_END
    ]);
}

export const getModel = (worksiteId) => async (dispatch) => {
    handleRequest(dispatch, `/models`, 'GET', [
        TASK_GET_MODEL_START,
        TASK_GET_MODEL_COMPLETE,
        TASK_GET_MODEL_END
    ]);
}

export const getAssetType = () => async (dispatch) => {
    handleRequest(dispatch, `/assets/types`, 'GET', [
        TASK_GET_ASSET_TYPE_START,
        TASK_GET_ASSET_TYPE_COMPLETE,
        TASK_GET_ASSET_TYPE_END
    ]);
}


export const GetAssetsByID = (ID) => async (dispatch) => {
    handleRequest(dispatch, `/assets/${ID}`, 'GET', [
        TASK_GET_ASSET_DETAIL_START,
        TASK_GET_ASSET_DETAIL_COMPLETE,
        TASK_GET_ASSET_DETAIL_END
    ]);
}








export const GetAssetsByIDMap = (ID) => async (dispatch, getState) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/assets/${ID}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    try {
        dispatch({ type: TASK_GET_ASSET_DETAIL_START, loading: true, networkError: false });
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
            dispatch({ type: TASK_GET_ASSET_DETAIL_START, loading: false, networkError: false });
            return res
        }
        else {
            dispatch({ type: TASK_GET_ASSET_DETAIL_END, loading: false, networkError: true });
        }
    } catch (error) {
        dispatch({ type: TASK_GET_ASSET_DETAIL_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};























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


export const GetProjectByID = (ID) => async (dispatch) => {
    handleRequest(dispatch, `/projects/${ID}`, 'GET', [
        TASK_GET_PROJECT_DETAIL_START,
        TASK_GET_PROJECT_DETAIL_COMPLETE,
        TASK_GET_PROJECT_DETAIL_END
    ]);
}



