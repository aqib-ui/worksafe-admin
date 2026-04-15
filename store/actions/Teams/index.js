import {
    TASK_LOAD_TEAM_START,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_LOAD_TEAM_END,
    TASK_REMOVE_TEAM_USER_START,
    TASK_REMOVE_TEAM_USER_COMPLETE,
    TASK_REMOVE_TEAM_USER_END,
    TASK_INSERT_TEAM_USER_START,
    TASK_INSERT_TEAM_USER_COMPLETE,
    TASK_INSERT_EMAIL_ERROR,
    TASK_INSERT_TEAM_USER_END,
    TASK_LOAD_ROLE_START,
    TASK_LOAD_ROLE_COMPLETE,
    TASK_LOAD_ROLE_END,
    TASK_LOAD_USER_START,
    TASK_LOAD_USER_COMPLETE,
    TASK_LOAD_USER_END,
    TASK_GET_POI_COMPLETE,
    TASK_GET_ALERTS_COMPLETE,
    TASK_GET_ASSETS_COMPLETE,
    TASK_GET_PROJECT_COMPLETE,
    TASK_LOAD_MY_WORK_ORDER_COMPLETE,
    TASK_LOAD_ASSIGEND_TO_ME_COMPLETE
} from '../types'
import { handleRequest } from '../../apiTransport';
import { baseUrl } from '../../config.json';

const TIMEOUT = 1000000;
const handleUnauthorized = () => {
    localStorage.clear()
    window.location.reload();
};



// export const GetTeam = (body) => async (dispatch) =>
//     handleRequest(dispatch, `/teams/getTeamsByWorkSite/${body}`, 'GET', [
//         TASK_LOAD_TEAM_START,
//         TASK_LOAD_TEAM_COMPLETE,
//         TASK_LOAD_TEAM_END
//     ]);




export const GetTeam = (body, page) => async (dispatch, getState) => {
    dispatch({ type: TASK_LOAD_TEAM_START, loading: true, networkError: false });
    dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });

    const { data } = getState()?.TeamReducer
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/teams/getTeamsByWorkSite/${body}?page=${page}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
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
            const existingIds = new Set(data?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [...data, ...filteredRes] });
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_LOAD_TEAM_END, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
        } else {
            dispatch({ type: TASK_LOAD_TEAM_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_LOAD_TEAM_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};




export const GetTeamAdmin = (page) => async (dispatch, getState) => {
    dispatch({ type: TASK_LOAD_TEAM_START, loading: true, networkError: false });
    dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: false, payload: [] });
    dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: false, payload: [] });


    const { data } = getState()?.TeamReducer
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT);
    const url = `/teams?page=${page}`;
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");

    try {
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
            const existingIds = new Set(data?.map(item => item._id));
            const filteredRes = res.filter(item => !existingIds.has(item._id));
            localStorage.removeItem('expireUser')
            dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: false, payload: [...data, ...filteredRes] });
            return res?.length || 0
        } else if (response.status === 403) {
            if ("roleUpdated" in res) {
                handleUnauthorized();
            }
            else {
                localStorage.setItem('expireUser', 'true')
                dispatch({ type: TASK_LOAD_TEAM_END, loading: false, expiredError: true });
            }
        } else if (response.status === 401) {
            if (typeof handleUnauthorized === "function") handleUnauthorized();
        } else {
            dispatch({ type: TASK_LOAD_TEAM_END, loading: false, networkError: true });
        }

    } catch (error) {
        console.error("Request error:", error);
        dispatch({ type: TASK_LOAD_TEAM_END, loading: false, networkError: true });
        if (error.name === "AbortError") console.error("Request timed out");
    } finally {
        clearTimeout(timeout);
    }
};





export const GetRoles = () => async (dispatch) =>
    handleRequest(dispatch, `/users/getAllRolesAdmin`, 'GET', [
        TASK_LOAD_ROLE_START,
        TASK_LOAD_ROLE_COMPLETE,
        TASK_LOAD_ROLE_END
    ]);



export const RemoveTeamUser = (body, Id, teamName, TeamDesciption, worksiteID) => async (dispatch) =>
    handleRequest(dispatch, `/teams/${Id}`, 'PUT', [
        TASK_REMOVE_TEAM_USER_START,
        TASK_REMOVE_TEAM_USER_COMPLETE,
        TASK_REMOVE_TEAM_USER_END
    ], {
        title: teamName,
        description: TeamDesciption,
        worksiteIds: worksiteID,
        members: body,
    });


export const RemoveTeamUserAdmin = (body, Id) => async (dispatch) =>
    handleRequest(dispatch, `/teams/editteamadmin/${Id}`, 'PUT', [
        TASK_REMOVE_TEAM_USER_START,
        TASK_REMOVE_TEAM_USER_COMPLETE,
        TASK_REMOVE_TEAM_USER_END
    ], { members: body });


export const InserTeamUser = (body, Id, companyId) => async (dispatch) => {
    const controller = new AbortController();
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const timeout = setTimeout(() => {
        controller.abort();
    }, 1000000);
    try {
        dispatch({
            type: TASK_INSERT_TEAM_USER_START,
            networkError: false,
            loading: true,
        });
        // const responseUser = await fetch(`/auth/user-already-exist?email=${body.email}`, "GET", controller)
        const responseUser = await fetch(`${baseUrl}/auth/user-already-exist?email=${body.email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${token}`,

            },
            signal: controller.signal
        });
        if (!responseUser.ok) {
            const payload = {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                role_id: body.role,
                companyId: companyId,
                teamId: Id,
                isManager: body.manager == "No" ? false : true,
                cell: body.phone,
                ofcNo: body.officePhone,
                title: body.position,
            };
            // const response = await fetch(`/auth/create-invited-user-admin`, "POST", controller, payload)
            const response = await fetch(`${baseUrl}/auth/create-invited-user-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`,

                },
                signal: controller.signal,
                body: JSON.stringify(payload)
            });
            clearTimeout(timeout);
            if (response.status == 200 || response.status == 201) {
                localStorage.removeItem("expireUser");
                dispatch({
                    type: TASK_INSERT_TEAM_USER_COMPLETE,
                    loading: false,
                });
            }
            else if (response.status == 401) {
                dispatch({
                    type: TASK_INSERT_TEAM_USER_END,
                    loading: false,
                    networkError: true,
                });
                localStorage.clear()
                window.location.reload();
            }
            else if (response.status == 403) {
                localStorage.setItem("expireUser", "true");
                dispatch({
                    type: TASK_INSERT_TEAM_USER_END,
                    loading: false,
                    networkError: true,
                });
            }
            else if (response.status == 404) {
                dispatch({
                    type: TASK_INSERT_TEAM_USER_END,
                    loading: false,
                    networkError: true,
                });
            }
        }
        else {
            const resToken = await responseUser.json();
            if (resToken.statusCode == 401) {
                localStorage.clear()
                window.location.reload();
            }
            clearTimeout(timeout);
            dispatch({
                type: TASK_INSERT_EMAIL_ERROR,
                loading: false,
                networkError: true,
            });
            dispatch({
                type: TASK_INSERT_TEAM_USER_END,
                loading: false,
                networkError: false,
            });
        }

    } catch (error) {
        clearTimeout(timeout);
        dispatch({
            type: TASK_INSERT_TEAM_USER_END,
            loading: false,
            networkError: true,
        });
        if (error.name === "AbortError") {
            console.error("Request timed out");
        } else if (error.message === "Failed to fetch") {
            console.error("Network error");
        } else {
            console.error("Error fetching users:", error.message);
        }
    }
};




export const InserTeamUserV2 = (body, Id, companyId) => async (dispatch) => {
    const controller = new AbortController();
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const timeout = setTimeout(() => {
        controller.abort();
    }, 1000000);
    try {
        dispatch({
            type: TASK_INSERT_TEAM_USER_START,
            networkError: false,
            loading: true,
        });
        // const responseUser = await fetch(`/auth/user-already-exist?email=${body.email}`, "GET", controller)
        const responseUser = await fetch(`${baseUrl}/auth/user-already-exist?email=${body.email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${token}`,

            },
            signal: controller.signal
        });
        if (!responseUser.ok) {
            const payload = {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                role_id: body.role,
                cell: body.phone,
                ofcNo: body.officePhone,
                title: body.position,
            };
            const response = await fetch(`${baseUrl}/auth/create-invited-user-v2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`,

                },
                signal: controller.signal,
                body: JSON.stringify(payload)
            });
            clearTimeout(timeout);
            const resNew = await response.json()
            if (response.status == 200 || response.status == 201) {
                localStorage.removeItem("expireUser");
                dispatch({
                    type: TASK_INSERT_TEAM_USER_COMPLETE,
                    loading: false,
                });
                return resNew?.data
            }
            else if (response.status == 401) {
                dispatch({
                    type: TASK_INSERT_TEAM_USER_END,
                    loading: false,
                    networkError: true,
                });
                localStorage.clear()
                window.location.reload();
            }
            else if (response.status == 403) {
                localStorage.setItem("expireUser", "true");
                dispatch({
                    type: TASK_INSERT_TEAM_USER_END,
                    loading: false,
                    networkError: true,
                });
            }
            else if (response.status == 404) {
                dispatch({
                    type: TASK_INSERT_TEAM_USER_END,
                    loading: false,
                    networkError: true,
                });
            }
        }
        else {
            const resToken = await responseUser.json();
            if (resToken.statusCode == 401) {
                localStorage.clear()
                window.location.reload();
            }
            clearTimeout(timeout);
            dispatch({
                type: TASK_INSERT_EMAIL_ERROR,
                loading: false,
                networkError: true,
            });
            dispatch({
                type: TASK_INSERT_TEAM_USER_END,
                loading: false,
                networkError: false,
            });
        }

    } catch (error) {
        clearTimeout(timeout);
        dispatch({
            type: TASK_INSERT_TEAM_USER_END,
            loading: false,
            networkError: true,
        });
        if (error.name === "AbortError") {
            console.error("Request timed out");
        } else if (error.message === "Failed to fetch") {
            console.error("Network error");
        } else {
            console.error("Error fetching users:", error.message);
        }
    }
};