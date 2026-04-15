import {
    TASK_GET_ALL_PERMISSION_START,
    TASK_GET_ALL_PERMISSION_COMPLETE,
    TASK_GET_ALL_PERMISSION_END,
} from '../../actions/types'

const userPermission = {
    // User Permission
    permissionLoading: false,
    allPermission: []
    // User Permission
}

const PermissionReducer = (state = userPermission, action) => {
    switch (action.type) {
        case TASK_GET_ALL_PERMISSION_START:
            return {
                ...state,
                permissionLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_ALL_PERMISSION_COMPLETE:
            return {
                ...state,
                permissionLoading: action.loading,
                allPermission: action.payload
            };
        case TASK_GET_ALL_PERMISSION_END:
            return {
                ...state,
                permissionLoading: action.loading,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};

export { PermissionReducer }