import {
    TASK_LOGIN_USER_START,
    TASK_LOGIN_USER_COMPLETE,
    TASK_LOGIN_USER_END,
    TASK_LOGIN_USER_ERROR,
} from '../../actions/types'

const userState = {
    data: [],
    loading: false,
    networkError: false,
    errorState: ''
}

const LoginReducer = (state = userState, action) => {
    switch (action.type) {
        case TASK_LOGIN_USER_START:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
                errorState:''
            };
        case TASK_LOGIN_USER_COMPLETE:
            return {
                ...state,
                loading: action.loading,
                data: action.payload,
                errorState:''
            };
        case TASK_LOGIN_USER_ERROR:
            return {
                ...state,
                loading: action.loading,
                errorState: action.payload,
                networkError: action.networkError,
            };
        case TASK_LOGIN_USER_END:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
                errorState:''
            };

        default:
            return state;
    }
};

export { LoginReducer }