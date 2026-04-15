import {
    TASK_GET_PROJECT_START,
    TASK_GET_PROJECT_COMPLETE,
    TASK_GET_PROJECT_END,
    TASK_GET_PROJECT_ERROR,
    TASK_CLEAR_EXPIRED,
    TASK_GET_ARCHIVED_PROJECT_START,
    TASK_GET_ARCHIVED_PROJECT_COMPLETE,
    TASK_GET_ARCHIVED_PROJECT_END,
    TASK_GET_ARCHIVED_PROJECT_ERROR,
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
    TASK_GET_PROJECT_DETAIL_START,
    TASK_GET_PROJECT_DETAIL_COMPLETE,
    TASK_GET_PROJECT_DETAIL_END,
    TASK_ARCHIVE_PROJECT_START,
    TASK_ARCHIVE_PROJECT_COMPLETE,
    TASK_ARCHIVE_PROJECT_END,
    TASK_GET_DAILY_PROJECT_START,
    TASK_GET_DAILY_PROJECT_COMPLETE,
    TASK_GET_DAILY_PROJECT_END,
    TASK_GET_DAILY_PROJECT_DETAIL_START,
    TASK_GET_DAILY_PROJECT_DETAIL_COMPLETE,
    TASK_GET_DAILY_PROJECT_DETAIL_END,
    TASK_DELETE_DAILY_PROJECT_START,
    TASK_DELETE_DAILY_PROJECT_COMPLETE,
    TASK_DELETE_DAILY_PROJECT_END
} from '../../actions/types'




const ProjectState = {
    projectData: [],
    projectLoading: false,
    archivedProjectData: [],
    archivedProjectLoading: false,
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
    projectDetail: null,
    projectDetailLoading: false,
    projectDelete: false,
    projectDeleteLoading: false,


    dailyProjectData: [],
    dailyProjectLoading: false,


    dailyProjectDetailData: [],
    dailyProjectDetailLoading: false,


    dailyProjectDelete: false,
    dailyProjectDeleteLoading: false,
    dailyPro:0
}





const ProjectReducer = (state = ProjectState, action) => {
    switch (action.type) {
        case TASK_GET_PROJECT_START:
            return {
                ...state,
                projectLoading: action.loading,
                projectExpiredError: false,
                networkError: action.networkError,
                createDepartmentComplete: false,
                contractorDelete: false,
                contractorAdd: false,
                projectDeleteLoading: false,
                projectDelete: false,
                dailyProjectDelete: false
            };
        case TASK_GET_PROJECT_ERROR:
            return {
                ...state,
                projectExpiredError: action.expiredError,
                projectLoading: action.loading,
            };
        case TASK_GET_PROJECT_COMPLETE:
            return {
                ...state,
                projectLoading: action.loading,
                projectData: action.payload
            };
        case TASK_GET_PROJECT_END:
            return {
                ...state,
                projectLoading: action.loading,
                networkError: action.networkError,
            };






        case TASK_GET_ARCHIVED_PROJECT_START:
            return {
                ...state,
                archivedProjectLoading: action.loading,
                projectExpiredError: false,
                networkError: action.networkError,
                createDepartmentComplete: false,
            };
        case TASK_GET_ARCHIVED_PROJECT_ERROR:
            return {
                ...state,
                projectExpiredError: action.expiredError,
                archivedProjectLoading: action.loading,
            };
        case TASK_GET_ARCHIVED_PROJECT_COMPLETE:
            return {
                ...state,
                archivedProjectLoading: action.loading,
                archivedProjectData: action.payload
            };
        case TASK_GET_ARCHIVED_PROJECT_END:
            return {
                ...state,
                archivedProjectLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_CLEAR_EXPIRED:
            return {
                ...state,
                projectExpiredError: false,
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



        case TASK_GET_PROJECT_DETAIL_START:
            return {
                ...state,
                projectDetailLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_PROJECT_DETAIL_COMPLETE:
            return {
                ...state,
                projectDetailLoading: action.loading,
                projectDetail: action.payload
            };
        case TASK_GET_PROJECT_DETAIL_END:
            return {
                ...state,
                projectDetailLoading: action.loading,
                networkError: action.networkError,
            };






        case TASK_ARCHIVE_PROJECT_START:
            return {
                ...state,
                projectDeleteLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_ARCHIVE_PROJECT_COMPLETE:
            return {
                ...state,
                projectDeleteLoading: action.loading,
                projectDelete: true
            };
        case TASK_ARCHIVE_PROJECT_END:
            return {
                ...state,
                projectDeleteLoading: action.loading,
                networkError: action.networkError,
            };






        case TASK_GET_DAILY_PROJECT_START:
            return {
                ...state,
                dailyProjectLoading: action.loading,
                networkError: action.networkError,
                dailyProjectDelete: false,
                contractorAdd: false,
                dailyPro: 0
            };
        case TASK_GET_DAILY_PROJECT_COMPLETE:
            return {
                ...state,
                dailyProjectLoading: action.loading,
                dailyProjectData: action.payload,
                dailyPro: action.total
            };
        case TASK_GET_DAILY_PROJECT_END:
            return {
                ...state,
                dailyProjectLoading: action.loading,
                networkError: action.networkError,
                dailyPro: 0
            };


        case TASK_GET_DAILY_PROJECT_DETAIL_START:
            return {
                ...state,
                dailyProjectDetailLoading: action.loading,
                networkError: action.networkError,
                dailyProjectDelete: false,
                contractorAdd: false,
                dailyProjectDelete: false,
            };
        case TASK_GET_DAILY_PROJECT_DETAIL_COMPLETE:
            return {
                ...state,
                dailyProjectDetailLoading: action.loading,
                dailyProjectDetailData: action.payload
            };
        case TASK_GET_DAILY_PROJECT_DETAIL_END:
            return {
                ...state,
                dailyProjectDetailLoading: action.loading,
                networkError: action.networkError,
            };









        case TASK_GET_DAILY_PROJECT_DETAIL_START:
            return {
                ...state,
                dailyProjectDetailLoading: action.loading,
                networkError: action.networkError,
                contractorAdd: false,
                dailyProjectDelete: false,
            };
        case TASK_GET_DAILY_PROJECT_DETAIL_COMPLETE:
            return {
                ...state,
                dailyProjectDetailLoading: action.loading,
                dailyProjectDetailData: action.payload
            };
        case TASK_GET_DAILY_PROJECT_DETAIL_END:
            return {
                ...state,
                dailyProjectDetailLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_DELETE_DAILY_PROJECT_START:
            return {
                ...state,
                dailyProjectDeleteLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_DELETE_DAILY_PROJECT_COMPLETE:
            return {
                ...state,
                dailyProjectDeleteLoading: action.loading,
                dailyProjectDelete: true
            };
        case TASK_DELETE_DAILY_PROJECT_END:
            return {
                ...state,
                dailyProjectDeleteLoading: action.loading,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};

export { ProjectReducer }