import {
    TASK_LOAD_USER_START,
    TASK_LOAD_USER_COMPLETE,
    TASK_LOAD_USER_END,
    TASK_DELETE_USER_START,
    TASK_DELETE_USER_COMPLETE,
    TASK_DELETE_USER_END,
    TASK_RECOVER_USER_START,
    TASK_RECOVER_USER_COMPLETE,
    TASK_RECOVER_USER_END,
    TASK_LOAD_PACKAGE_START,
    TASK_LOAD_PACKAGE_COMPLETE,
    TASK_LOAD_PACKAGE_END,
    TASK_RECOVER_PAYMENT_START,
    TASK_RECOVER_PAYMENT_COMPLETE,
    TASK_RECOVER_PAYMENT_END,
    TASK_LOAD_ALL_USER_START,
    TASK_LOAD_ALL_USER_COMPLETE,
    TASK_LOAD_ALL_USER_END
} from '../../actions/types'

const userState = {
    data: [],
    packageData: [],
    loading: false,
    networkError: false,
    deleteSuccess: false,
    recoverSuccess: false,
    loadingPackage: false,
    deleteLoading: false,
    recoverLoading: false,
    paymentRecoverSuccess: false,
    paymentRecoverLoading: false,
    AllData: []
}

const UserReducer = (state = userState, action) => {
    switch (action.type) {
        case TASK_LOAD_USER_START:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
                deleteSuccess: false,
                recoverSuccess: false,
                loadingPackage: false,
                deleteLoading: false,
                recoverLoading: false,
                paymentRecoverSuccess: false,
                paymentRecoverLoading: false,
            };
        case TASK_LOAD_USER_COMPLETE:
            return {
                ...state,
                loading: action.loading,
                data: action.payload
            };
        case TASK_LOAD_USER_END:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
            };



        case TASK_LOAD_ALL_USER_START:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
                deleteSuccess: false,
                recoverSuccess: false,
                loadingPackage: false,
                deleteLoading: false,
                recoverLoading: false,
                paymentRecoverSuccess: false,
                paymentRecoverLoading: false,
            };
        case TASK_LOAD_ALL_USER_COMPLETE:
            return {
                ...state,
                loading: action.loading,
                AllData: action.payload
            };
        case TASK_LOAD_ALL_USER_END:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
            };



        case TASK_DELETE_USER_START:
            return {
                ...state,
                deleteLoading: action.loading,
                networkError: action.networkError,
                deleteSuccess: false
            };
        case TASK_DELETE_USER_COMPLETE:
            return {
                ...state,
                deleteLoading: action.loading,
                deleteSuccess: true
            };
        case TASK_DELETE_USER_END:
            return {
                ...state,
                deleteLoading: action.loading,
                networkError: action.networkError,
                deleteSuccess: false
            };



        case TASK_RECOVER_USER_START:
            return {
                ...state,
                recoverLoading: action.loading,
                networkError: action.networkError,
                recoverSuccess: false
            };
        case TASK_RECOVER_USER_COMPLETE:
            return {
                ...state,
                recoverLoading: action.loading,
                recoverSuccess: true
            };
        case TASK_RECOVER_USER_END:
            return {
                ...state,
                recoverLoading: action.loading,
                networkError: action.networkError,
                recoverSuccess: false
            };



        case TASK_RECOVER_PAYMENT_START:
            return {
                ...state,
                paymentRecoverLoading: action.loading,
                networkError: action.networkError,
                paymentRecoverSuccess: false
            };
        case TASK_RECOVER_PAYMENT_COMPLETE:
            return {
                ...state,
                paymentRecoverLoading: action.loading,
                paymentRecoverSuccess: true
            };
        case TASK_RECOVER_PAYMENT_END:
            return {
                ...state,
                paymentRecoverLoading: action.loading,
                networkError: action.networkError,
                paymentRecoverSuccess: false
            };


        case TASK_LOAD_PACKAGE_START:
            return {
                ...state,
                loadingPackage: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_PACKAGE_COMPLETE:
            return {
                ...state,
                loadingPackage: action.loading,
                packageData: action.payload
            };
        case TASK_LOAD_PACKAGE_END:
            return {
                ...state,
                loadingPackage: action.loading,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};

export { UserReducer }