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


    TASK_CLEAR_EXPIRED,
    TASK_LOAD_ASSIGEND_TO_ME_START,
    TASK_LOAD_ASSIGEND_TO_ME_COMPLETE,
    TASK_LOAD_ASSIGEND_TO_ME_EXPIRED_ERROR,
    TASK_LOAD_ASSIGEND_TO_ME_END,

    TASK_LOAD_ARCHIVED_START,
    TASK_LOAD_ARCHIVED_COMPLETE,
    TASK_LOAD_ARCHIVED_EXPIRED_ERROR,
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
    TASK_GET_ALL_PERMISSION_START,
    TASK_GET_ALL_PERMISSION_COMPLETE,
    TASK_GET_ALL_PERMISSION_END,

    TASK_LOAD_WORK_SITE_DOC_START,
    TASK_LOAD_WORK_SITE_DOC_COMPLETE,
    TASK_LOAD_WORK_SITE_DOC_END,
} from '../../actions/types'

const userState = {
    data: [],
    loading: false,
    networkError: false,
    workSiteData: [],
    workSiteLoading: true,
    companyUserData: [],
    companyUserLoading: false,
    myWorkOrderData: [],
    assignedWorkOrderData: [],
    archivedWorkOrderData: [],
    workOrderLoading: false,
    workOrderExpiredError: false,

    // approve decline worksite
    workOrderIsApproved: false,
    workOrderIsDecline: false,
    workOrderOprationLoading: false,
    // approve decline worksite

    // approve decline worksite
    workOrderIsArchived: false,
    workOrderIsUnArchived: false,
    workOrderArchiveLoading: false,
    // approve decline worksite

    // Complete worksite
    workOrderIsCompleted: false,
    workOrderCompleteLoading: false,
    // Complete worksite


    // Complete worksite
    workOrderGetByIDData: [],
    workOrderGetByIDDatLoading: false,
    // Complete worksite




    poiDoc: [],
    poiDocLoading: false,
}

const WorkOrderReducer = (state = userState, action) => {
    switch (action.type) {
        case TASK_LOAD_WORK_SITE_START:
            return {
                ...state,
                workSiteLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_WORK_SITE_COMPLETE:
            return {
                ...state,
                workSiteLoading: action.loading,
                workSiteData: action.payload
            };
        case TASK_LOAD_WORK_SITE_END:
            return {
                ...state,
                workSiteLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_LOAD_COMPANY_USER_START:
            return {
                ...state,
                companyUserLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_COMPANY_USER_COMPLETE:
            return {
                ...state,
                companyUserLoading: action.loading,
                companyUserData: action.payload
            };
        case TASK_LOAD_COMPANY_USER_END:
            return {
                ...state,
                companyUserLoading: action.loading,
                networkError: action.networkError,
            };








        case TASK_CLEAR_EXPIRED:
            return {
                ...state,
                workOrderExpiredError: false,
            };

        case TASK_LOAD_MY_WORK_ORDER_START:
            return {
                ...state,
                workOrderLoading: action.loading,
                networkError: action.networkError,
                workOrderIsApproved: false,
                workOrderIsDecline: false,
                workOrderOprationLoading: false,
                workOrderIsArchived: false,
                workOrderIsUnArchived: false,
                workOrderArchiveLoading: false,
                workOrderCompleteLoading: false,
                workOrderIsCompleted: false,
            };
        case TASK_LOAD_MY_WORK_ORDER_COMPLETE:
            return {
                ...state,
                workOrderLoading: action.loading,
                myWorkOrderData: action.payload,
            };

        case TASK_LOAD_MY_WORK_ORDER_EXPIRED_ERROR:
            return {
                ...state,
                workOrderExpiredError: action.expiredError,
                workOrderLoading: action.loading
            };
        case TASK_LOAD_MY_WORK_ORDER_END:
            return {
                ...state,
                workOrderLoading: action.loading,
                networkError: action.networkError,
            };















        case TASK_LOAD_ASSIGEND_TO_ME_START:
            return {
                ...state,
                workOrderLoading: action.loading,
                networkError: action.networkError,
                workOrderIsApproved: false,
                workOrderIsDecline: false,
                workOrderOprationLoading: false,
                workOrderIsArchived: false,
                workOrderIsUnArchived: false,
                workOrderArchiveLoading: false,
                workOrderIsCompleted: false,
                workOrderCompleteLoading: false,
            };
        case TASK_LOAD_ASSIGEND_TO_ME_EXPIRED_ERROR:
            return {
                ...state,
                workOrderExpiredError: action.expiredError,
                workOrderLoading: action.loading
            };
        case TASK_LOAD_ASSIGEND_TO_ME_COMPLETE:
            return {
                ...state,
                workOrderLoading: action.loading,
                assignedWorkOrderData: action.payload,
            };
        case TASK_LOAD_ASSIGEND_TO_ME_END:
            return {
                ...state,
                workOrderLoading: action.loading,
                networkError: action.networkError,
            };






















        case TASK_LOAD_ARCHIVED_START:
            return {
                ...state,
                workOrderLoading: action.loading,
                networkError: action.networkError,
                workOrderIsApproved: false,
                workOrderIsDecline: false,
                workOrderOprationLoading: false,
                workOrderIsArchived: false,
                workOrderIsUnArchived: false,
                workOrderArchiveLoading: false,
                workOrderIsCompleted: false,
                workOrderCompleteLoading: false,
            };
        case TASK_LOAD_ARCHIVED_EXPIRED_ERROR:
            return {
                ...state,
                workOrderExpiredError: action.expiredError,
                workOrderLoading: action.loading,
            };
        case TASK_LOAD_ARCHIVED_COMPLETE:
            return {
                ...state,
                workOrderLoading: action.loading,
                archivedWorkOrderData: action.payload,
            };
        case TASK_LOAD_ARCHIVED_END:
            return {
                ...state,
                workOrderLoading: action.loading,
                networkError: action.networkError,
            };














        case TASK_APPROVE_WORK_ORDER_START:
            return {
                ...state,
                workOrderOprationLoading: action.loading,
                networkError: action.networkError,
                workOrderIsApproved: false
            };
        case TASK_APPROVE_WORK_ORDER_COMPLETE:
            return {
                ...state,
                workOrderOprationLoading: action.loading,
                workOrderIsApproved: true
            };
        case TASK_APPROVE_WORK_ORDER_END:
            return {
                ...state,
                workOrderOprationLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_DECLINE_WORK_ORDER_START:
            return {
                ...state,
                workOrderOprationLoading: action.loading,
                networkError: action.networkError,
                workOrderIsDecline: false
            };
        case TASK_DECLINE_WORK_ORDER_COMPLETE:
            return {
                ...state,
                workOrderOprationLoading: action.loading,
                workOrderIsDecline: true
            };
        case TASK_DECLINE_WORK_ORDER_END:
            return {
                ...state,
                workOrderOprationLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_ARCHIVE_WORK_ORDER_START:
            return {
                ...state,
                workOrderArchiveLoading: action.loading,
                networkError: action.networkError,
                workOrderIsArchived: false
            };
        case TASK_ARCHIVE_WORK_ORDER_COMPLETE:
            return {
                ...state,
                workOrderArchiveLoading: action.loading,
                workOrderIsArchived: true
            };
        case TASK_ARCHIVE_WORK_ORDER_END:
            return {
                ...state,
                workOrderArchiveLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_UNARCHIVE_WORK_ORDER_START:
            return {
                ...state,
                workOrderArchiveLoading: action.loading,
                networkError: action.networkError,
                workOrderIsUnArchived: false
            };
        case TASK_UNARCHIVE_WORK_ORDER_COMPLETE:
            return {
                ...state,
                workOrderArchiveLoading: action.loading,
                workOrderIsUnArchived: true
            };
        case TASK_UNARCHIVE_WORK_ORDER_END:
            return {
                ...state,
                workOrderArchiveLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_COMPLETE_WORK_ORDER_START:
            return {
                ...state,
                workOrderCompleteLoading: action.loading,
                networkError: action.networkError,
                workOrderIsCompleted: false
            };
        case TASK_COMPLETE_WORK_ORDER_COMPLETE:
            return {
                ...state,
                workOrderCompleteLoading: action.loading,
                workOrderIsCompleted: true
            };
        case TASK_COMPLETE_WORK_ORDER_END:
            return {
                ...state,
                workOrderCompleteLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_GET_WORK_ORDER_BY_ID_START:
            return {
                ...state,
                workOrderGetByIDDatLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_WORK_ORDER_BY_ID_COMPLETE:
            return {
                ...state,
                workOrderGetByIDDatLoading: action.loading,
                workOrderGetByIDData: action.payload
            };
        case TASK_GET_WORK_ORDER_BY_ID_END:
            return {
                ...state,
                workOrderGetByIDDatLoading: action.loading,
                networkError: action.networkError,
            };





        case TASK_LOAD_WORK_SITE_DOC_START:
            return {
                ...state,
                poiDocLoading: action.loading,
                networkError: action.networkError
            };
        case TASK_LOAD_WORK_SITE_DOC_COMPLETE:
            return {
                ...state,
                poiDocLoading: action.loading,
                poiDoc: action.payload
            };
        case TASK_LOAD_WORK_SITE_DOC_END:
            return {
                ...state,
                poiDocLoading: action.loading,
                networkError: action.networkError,
            };

        default:
            return state;
    }
};

export { WorkOrderReducer }