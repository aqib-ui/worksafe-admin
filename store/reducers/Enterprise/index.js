import {
    TASK_LOAD_ALL_PACKAGE_START,
    TASK_LOAD_ALL_PACKAGE_COMPLETE,
    TASK_LOAD_ALL_PACKAGE_END,
    TASK_GET_COMPANY_INFO_START,
    TASK_GET_COMPANY_INFO_COMPLETE,
    TASK_GET_COMPANY_INFO_END,
    TASK_GET_ADMIN_ALL_COMPANY_INFO_START,
    TASK_GET_ADMIN_ALL_COMPANY_INFO_COMPLETE,
    TASK_GET_ADMIN_ALL_COMPANY_INFO_END,
    TASK_EDIT_COMPANY_INFO_START,
    TASK_EDIT_COMPANY_INFO_COMPLETE,
    TASK_EDIT_COMPANY_INFO_END
} from '../../actions/types'

const userState = {
    data: [],
    loading: false,
    networkError: false,
    companyInfoLoading: false,
    companyInfoDate: null,
    alladminCompanies: [],
    alladminCompaniesLoading: false,
}

const EnterpriseReducer = (state = userState, action) => {
    switch (action.type) {
        case TASK_LOAD_ALL_PACKAGE_START:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_ALL_PACKAGE_COMPLETE:
            return {
                ...state,
                loading: action.loading,
                data: action.payload
            };
        case TASK_LOAD_ALL_PACKAGE_END:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
            };

        case TASK_GET_COMPANY_INFO_START:
            return {
                ...state,
                companyInfoLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_COMPANY_INFO_COMPLETE:
            return {
                ...state,
                companyInfoLoading: action.loading,
                companyInfoDate: action.payload?.data
            };
        case TASK_GET_COMPANY_INFO_END:
            return {
                ...state,
                companyInfoLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_GET_ADMIN_ALL_COMPANY_INFO_START:
            return {
                ...state,
                alladminCompaniesLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_ADMIN_ALL_COMPANY_INFO_COMPLETE:
            return {
                ...state,
                alladminCompaniesLoading: action.loading,
                alladminCompanies: action.payload
            };
        case TASK_GET_ADMIN_ALL_COMPANY_INFO_END:
            return {
                ...state,
                alladminCompaniesLoading: action.loading,
                networkError: action.networkError,
            };





        case TASK_EDIT_COMPANY_INFO_START:
            return {
                ...state,
                alladminCompaniesLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_EDIT_COMPANY_INFO_COMPLETE:
            return {
                ...state,
                // alladminCompaniesLoading: action.loading,
            };
        case TASK_EDIT_COMPANY_INFO_END:
            return {
                ...state,
                alladminCompaniesLoading: action.loading,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};

export { EnterpriseReducer }