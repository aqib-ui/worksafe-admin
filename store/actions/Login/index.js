import Fetch from '../api';
import {
    TASK_LOGIN_USER_START,
    TASK_LOGIN_USER_COMPLETE,
    TASK_LOGIN_USER_END,
    TASK_LOGIN_USER_ERROR,
    MESSAGE_SHOW,
} from '../types'


export const LoginUser = (body) => async (dispatch) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 1000000);
    try {
        dispatch({
            type: TASK_LOGIN_USER_START,
            networkError: false,
            loading: true,
        });
        const response = await Fetch(`/auth/signin-admin`, "POST", controller, {
            email: body?.email,
            password: body?.Password,
            deviceToken: `${Math.random()}`
        })
        clearTimeout(timeout);
        const res = await response.json();
        if (!response.ok) {
            clearTimeout(timeout);
            dispatch({
                type: TASK_LOGIN_USER_ERROR,
                loading: false,
                payload: res?.message,
                networkError: false,
            });
        }
        if (res.userId) {
            localStorage.setItem("aX7@qB*9tw!1zV+T2/&1^x==", res.tokens.accessToken);
            localStorage.setItem("zP!4vBN#tw69gV+%2/+1/w==", res.userId);
            localStorage.setItem("0U7Qv$N3tw69gV+T2/~1/w==", res.role_id._id);
            localStorage.setItem("Zd9!u*K3tVp2^Ax7BQ+/==", res.role_id.priority);
            localStorage.setItem("Lp3@vBN9tw69gV*R2/+1?w==", `${res.firstName} ${res.lastName}`);
            
            dispatch({
                type: TASK_LOGIN_USER_COMPLETE,
                loading: false,
                payload: res,
            });
            dispatch({
                type:MESSAGE_SHOW,
                messageType:'success',
                content:'Success',
            })
        }
    } catch (error) {
        clearTimeout(timeout);
        dispatch({
            type: TASK_LOGIN_USER_END,
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
