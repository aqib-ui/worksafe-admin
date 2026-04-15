import {
    TASK_GET_ASSETS_START,
    TASK_GET_ASSETS_COMPLETE,
    TASK_GET_ASSETS_END,
    TASK_GET_ASSETS_ERROR,
    TASK_GET_ARCHIVED_ASSETS_START,
    TASK_GET_ARCHIVED_ASSETS_COMPLETE,
    TASK_GET_ARCHIVED_ASSETS_END,
    TASK_GET_ARCHIVED_ASSETS_ERROR,
    TASK_GET_DEPARTMENT_START,
    TASK_GET_DEPARTMENT_COMPLETE,
    TASK_GET_DEPARTMENT_END,
    TASK_GET_MODEL_START,
    TASK_GET_MODEL_COMPLETE,
    TASK_GET_MODEL_END,
    TASK_GET_ASSET_TYPE_START,
    TASK_GET_ASSET_TYPE_COMPLETE,
    TASK_GET_ASSET_TYPE_END,
    TASK_GET_ASSET_DETAIL_START,
    TASK_GET_ASSET_DETAIL_COMPLETE,
    TASK_GET_ASSET_DETAIL_END,
    TASK_CLEAR_EXPIRED,
    TASK_ARCHIVE_ASSETS_START,
    TASK_ARCHIVE_ASSETS_COMPLETE,
    TASK_ARCHIVE_ASSETS_END
} from '../../actions/types'




const AssetsState = {
    networkError: false,
    AssetsData: [],
    AssetsLoading: false,
    archivedAssetsData: [],
    archivedAssetsLoading: false,
    AssetsDelete: false,
    AssetsDeleteLoading: false,
    departmentData: [],
    departmentLoading: false,
    modelData: [],
    modelLoading: false,
    assetTypeData: [],
    assetTypeLoading: false,
    projectExpiredError: false,
    assetDetail: null,
    assetDetailLoading: false,
}





const AssetsReducer = (state = AssetsState, action) => {
    switch (action.type) {
        case TASK_GET_ASSETS_START:
            return {
                ...state,
                AssetsLoading: action.loading,
                projectExpiredError: false,
                AssetsDelete: false,
                networkError: action.networkError,
            };
        case TASK_GET_ASSETS_ERROR:
            return {
                ...state,
                projectExpiredError: action.expiredError,
                AssetsLoading: action.loading,
            };
        case TASK_GET_ASSETS_COMPLETE:
            return {
                ...state,
                AssetsLoading: action.loading,
                AssetsData: action.payload
            };
        case TASK_GET_ASSETS_END:
            return {
                ...state,
                AssetsLoading: action.loading,
                networkError: action.networkError,
            };






        case TASK_GET_ARCHIVED_ASSETS_START:
            return {
                ...state,
                archivedAssetsLoading: action.loading,
                projectExpiredError: false,
                networkError: action.networkError,
                AssetsDelete: false,
            };
        case TASK_GET_ARCHIVED_ASSETS_ERROR:
            return {
                ...state,
                projectExpiredError: action.expiredError,
                archivedAssetsLoading: action.loading,
            };
        case TASK_GET_ARCHIVED_ASSETS_COMPLETE:
            return {
                ...state,
                archivedAssetsLoading: action.loading,
                archivedAssetsData: action.payload
            };
        case TASK_GET_ARCHIVED_ASSETS_END:
            return {
                ...state,
                archivedAssetsLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_CLEAR_EXPIRED:
            return {
                ...state,
                projectExpiredError: false,
            };



        case TASK_ARCHIVE_ASSETS_START:
            return {
                ...state,
                AssetsDeleteLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_ARCHIVE_ASSETS_COMPLETE:
            return {
                ...state,
                AssetsDeleteLoading: action.loading,
                AssetsDelete: true
            };
        case TASK_ARCHIVE_ASSETS_END:
            return {
                ...state,
                AssetsDeleteLoading: action.loading,
                networkError: action.networkError,
            };


        case TASK_GET_DEPARTMENT_START:
            return {
                ...state,
                departmentLoading: action.loading,
                networkError: action.networkError,
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


        case TASK_GET_MODEL_START:
            return {
                ...state,
                modelLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_MODEL_COMPLETE:
            return {
                ...state,
                modelLoading: action.loading,
                modelData: action.payload
            };
        case TASK_GET_MODEL_END:
            return {
                ...state,
                modelLoading: action.loading,
                networkError: action.networkError,
            };

        case TASK_GET_ASSET_TYPE_START:
            return {
                ...state,
                assetTypeLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_ASSET_TYPE_COMPLETE:
            return {
                ...state,
                assetTypeLoading: action.loading,
                assetTypeData: action.payload
            };
        case TASK_GET_ASSET_TYPE_END:
            return {
                ...state,
                assetTypeLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_GET_ASSET_DETAIL_START:
            return {
                ...state,
                assetDetailLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_GET_ASSET_DETAIL_COMPLETE:
            return {
                ...state,
                assetDetailLoading: action.loading,
                assetDetail: action.payload
            };
        case TASK_GET_ASSET_DETAIL_END:
            return {
                ...state,
                assetDetailLoading: action.loading,
                networkError: action.networkError,
            };

        default:
            return state;
    }
};

export { AssetsReducer }