import {
    TASK_GET_ALERTS_START,
    TASK_GET_ALERTS_COMPLETE,
    TASK_GET_ALERTS_END,
    TASK_GET_ALERTS_ERROR,
    TASK_GET_ARCHIVED_ALERTS_START,
    TASK_GET_ARCHIVED_ALERTS_COMPLETE,
    TASK_GET_ARCHIVED_ALERTS_END,
    TASK_GET_ARCHIVED_ALERTS_ERROR,


    TASK_GET_DEPARTMENT_START,
    TASK_GET_DEPARTMENT_COMPLETE,
    TASK_GET_DEPARTMENT_END,
    TASK_ADD_DEPARTMENT_START,
    TASK_ADD_DEPARTMENT_COMPLETE,
    TASK_ADD_DEPARTMENT_END,
    TASK_GET_CONTRACTOR_COMPLETE,
    TASK_GET_CONTRACTOR_END,
    TASK_GET_CONTRACTOR_START,
    TASK_DELETE_CONTRACTOR_START,
    TASK_DELETE_CONTRACTOR_COMPLETE,
    TASK_DELETE_CONTRACTOR_END,
    TASK_ADD_CONTRACTOR_START,
    TASK_ADD_CONTRACTOR_COMPLETE,
    TASK_ADD_CONTRACTOR_END,
    TASK_CLEAR_EXPIRED,
    TASK_GET_ALERTS_DETAIL_START,
    TASK_GET_ALERTS_DETAIL_COMPLETE,
    TASK_GET_ALERTS_DETAIL_END,
    TASK_ARCHIVE_ALERTS_START,
    TASK_ARCHIVE_ALERTS_COMPLETE,
    TASK_ARCHIVE_ALERTS_END
} from '../../actions/types'




const AlertState = {
    alertData: [],
    alertLoading: false,
    archivedalertData: [],
    archivedalertLoading: false,
    alertDetail: null,
    alertDetailLoading: false,
    alertDelete: false,
    alertDeleteLoading: false,


    projectExpiredError: false,
    networkError: false,
    departmentData: [],
    departmentLoading: false,
    createDepartmentComplete: false,
    createDepartmentLoading: false,
    contractorData: [],
    contractorDataLoading: false,
    contractorDelete: false,
    contractorDeleteLoading: false,
    contractorAdd: false,
    contractorAddLoading: false,





}





const AlertsReducer = (state = AlertState, action) => {
    switch (action.type) {
        case TASK_GET_ALERTS_START:
            return {
                ...state,
                alertLoading: action.loading,
                projectExpiredError: false,
                networkError: action.networkError,
                alertDeleteLoading: false,
                alertDelete:false
            };
        case TASK_GET_ALERTS_ERROR:
            return {
                ...state,
                projectExpiredError: action.expiredError,
                alertLoading: action.loading,
            };
        case TASK_GET_ALERTS_COMPLETE:
            return {
                ...state,
                alertLoading: action.loading,
                alertData: action.payload
            };
        case TASK_GET_ALERTS_END:
            return {
                ...state,
                alertLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_GET_ARCHIVED_ALERTS_START:
            return {
                ...state,
                archivedalertLoading: action.loading,
                projectExpiredError: false,
                networkError: action.networkError,
                alertDeleteLoading: false,
                alertDelete:false
            };
        case TASK_GET_ARCHIVED_ALERTS_ERROR:
            return {
                ...state,
                projectExpiredError: action.expiredError,
                archivedalertLoading: action.loading,
            };
        case TASK_GET_ARCHIVED_ALERTS_COMPLETE:
            return {
                ...state,
                archivedalertLoading: action.loading,
                archivedalertData: action.payload
            };
        case TASK_GET_ARCHIVED_ALERTS_END:
            return {
                ...state,
                archivedalertLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_CLEAR_EXPIRED:
            return {
                ...state,
                projectExpiredError: false,
            };





        case TASK_GET_ALERTS_DETAIL_START:
            return {
                ...state,
                alertDetailLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_ALERTS_DETAIL_COMPLETE:
            return {
                ...state,
                alertDetailLoading: action.loading,
                alertDetail: action.payload
            };
        case TASK_GET_ALERTS_DETAIL_END:
            return {
                ...state,
                alertDetailLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_ARCHIVE_ALERTS_START:
            return {
                ...state,
                alertDeleteLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_ARCHIVE_ALERTS_COMPLETE:
            return {
                ...state,
                alertDeleteLoading: action.loading,
                alertDelete: true
            };
        case TASK_ARCHIVE_ALERTS_END:
            return {
                ...state,
                alertDeleteLoading: action.loading,
                networkError: action.networkError,
            };











































        case TASK_GET_DEPARTMENT_START:
            return {
                ...state,
                departmentLoading: action.loading,
                networkError: action.networkError,
                contractorDataLoading: false,
                contractorDeleteLoading: false,
                contractorAddLoading: false,
            };
        case TASK_GET_DEPARTMENT_COMPLETE:
            return {
                ...state,
                departmentLoading: action.loading,
                departmentData: action.payload
            };
        case TASK_GET_DEPARTMENT_END:
            return {
                ...state,
                departmentLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_ADD_DEPARTMENT_START:
            return {
                ...state,
                createDepartmentLoading: action.loading,
                networkError: action.networkError,
                createDepartmentComplete: false,
                contractorDataLoading: false,
                contractorDeleteLoading: false,
                contractorAddLoading: false,
            };
        case TASK_ADD_DEPARTMENT_COMPLETE:
            return {
                ...state,
                createDepartmentLoading: action.loading,
                createDepartmentComplete: true
            };
        case TASK_ADD_DEPARTMENT_END:
            return {
                ...state,
                createDepartmentLoading: action.loading,
                networkError: action.networkError,
                createDepartmentComplete: false
            };




        case TASK_GET_CONTRACTOR_START:
            return {
                ...state,
                contractorDataLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_CONTRACTOR_COMPLETE:
            return {
                ...state,
                contractorDataLoading: action.loading,
                contractorData: action.payload
            };
        case TASK_GET_CONTRACTOR_END:
            return {
                ...state,
                contractorDataLoading: action.loading,
                networkError: action.networkError,
            };






        case TASK_DELETE_CONTRACTOR_START:
            return {
                ...state,
                contractorDeleteLoading: action.loading,
                networkError: action.networkError,
                contractorAdd: false,
                contractorDelete: false,

            };
        case TASK_DELETE_CONTRACTOR_COMPLETE:
            return {
                ...state,
                contractorDeleteLoading: action.loading,
                contractorDelete: true,
            };
        case TASK_DELETE_CONTRACTOR_END:
            return {
                ...state,
                contractorDeleteLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_ADD_CONTRACTOR_START:
            return {
                ...state,
                contractorAddLoading: action.loading,
                networkError: action.networkError,
                contractorAdd: false,
                contractorDelete: false,
            };
        case TASK_ADD_CONTRACTOR_COMPLETE:
            return {
                ...state,
                contractorAddLoading: action.loading,
                contractorAdd: action.payload
            };
        case TASK_ADD_CONTRACTOR_END:
            return {
                ...state,
                contractorAddLoading: action.loading,
                networkError: action.networkError,
            };










        default:
            return state;
    }
};

export { AlertsReducer }