import {
    TASK_LOAD_TEAM_START,
    TASK_LOAD_TEAM_COMPLETE,
    TASK_LOAD_TEAM_END,
    TASK_REMOVE_TEAM_USER_START,
    TASK_REMOVE_TEAM_USER_COMPLETE,
    TASK_REMOVE_TEAM_USER_END,
    TASK_LOAD_ROLE_START,
    TASK_LOAD_ROLE_COMPLETE,
    TASK_LOAD_ROLE_END,
    TASK_INSERT_EMAIL_ERROR,
    TASK_INSERT_TEAM_USER_START,
    TASK_INSERT_TEAM_USER_COMPLETE,
    TASK_INSERT_TEAM_USER_END,
} from '../../actions/types'

const teamState = {
    data: [],
    loading: false,
    networkError: false,
    emailError: false,
    insetUserComplete: false,
    DeleteUserComplete: false,
    Deleteloading: false,
    roleLoading: false,
    userInsertLoading: false,
    roleData: [],
}

const TeamReducer = (state = teamState, action) => {
    switch (action.type) {
        case TASK_LOAD_TEAM_START:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
                emailError: false,
                insetUserComplete: false,
                Deleteloading: false,
                roleLoading: false,
                userInsertLoading: false,
                DeleteUserComplete: false
            };
        case TASK_LOAD_TEAM_COMPLETE:
            return {
                ...state,
                loading: action.loading,
                data: action.payload
            };
        case TASK_LOAD_TEAM_END:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
            };


        case TASK_REMOVE_TEAM_USER_START:
            return {
                ...state,
                Deleteloading: action.loading,
                networkError: action.networkError,
                DeleteUserComplete: false
            };
        case TASK_REMOVE_TEAM_USER_COMPLETE:
            return {
                ...state,
                Deleteloading: action.loading,
                DeleteUserComplete: true
            };
        case TASK_REMOVE_TEAM_USER_END:
            return {
                ...state,
                Deleteloading: action.loading,
                networkError: action.networkError,
            };


        case TASK_LOAD_ROLE_START:
            return {
                ...state,
                roleLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_ROLE_COMPLETE:
            return {
                ...state,
                roleLoading: action.loading,
                roleData: action.payload
            };
        case TASK_LOAD_ROLE_END:
            return {
                ...state,
                roleLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_INSERT_TEAM_USER_START:
            return {
                ...state,
                userInsertLoading: action.loading,
                networkError: action.networkError,
                emailError: false,
                insetUserComplete: false
            };
        case TASK_INSERT_TEAM_USER_COMPLETE:
            return {
                ...state,
                userInsertLoading: action.loading,
                insetUserComplete: true
            };
        case TASK_INSERT_EMAIL_ERROR:
            return {
                ...state,
                emailError: true,
            };
        case TASK_INSERT_TEAM_USER_END:
            return {
                ...state,
                userInsertLoading: action.loading,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};

export { TeamReducer }