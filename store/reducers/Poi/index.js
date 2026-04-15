import {
    TASK_GET_POI_START,
    TASK_GET_POI_COMPLETE,
    TASK_GET_POI_END,
    TASK_GET_POI_ARCHIVED_START,
    TASK_GET_POI_ARCHIVED_COMPLETE,
    TASK_GET_POI_ARCHIVED_END,
    TASK_GET_POI_DRAFT_START,
    TASK_GET_POI_DRAFT_COMPLETE,
    TASK_GET_POI_DRAFT_END,
    TASK_GET_POI_BY_ID_START,
    TASK_GET_POI_BY_ID_COMPLETE,
    TASK_GET_POI_BY_ID_END,

    TASK_GET_POI_BY_ID_START_DOC,
    TASK_GET_POI_BY_ID_COMPLETE_DOC,
    TASK_GET_POI_BY_ID_END_DOC,


    TASK_WORKORDER_FOR_POI_START,
    TASK_WORKORDER_FOR_POI_COMPLETE,
    TASK_WORKORDER_FOR_POI_END,
    TASK_WORKORDER_UN_FOR_POI_START,
    TASK_WORKORDER_UN_FOR_POI_COMPLETE,
    TASK_WORKORDER_UN_FOR_POI_END,
    TASK_WORKORDER_LINK_FOR_POI_START,
    TASK_WORKORDER_LINK_FOR_POI_COMPLETE,
    TASK_WORKORDER_LINK_FOR_POI_END,
    TASK_POI_ARCHIVED_START,
    TASK_POI_ARCHIVED_COMPLETE,
    TASK_POI_ARCHIVED_END,
    TASK_LOAD_WORK_SITE_START,
    TASK_LOAD_WORK_SITE_COMPLETE,
    TASK_LOAD_WORK_SITE_END,
    TASK_GET_POI_ERROR,
    TASK_CLEAR_EXPIRED
} from '../../actions/types'




const POIState = {
    poiData: [],
    poiArchivedData: [],
    poiDraftData: [],
    workOrderData: [],
    workOrderUnData: [],
    workOrderLinkData: [],
    POIGetByIDData: [],
    POIGetByIDDataLoading: false,
    workOrderLoading: false,
    workOrderUnLoading: false,
    workOrderLinkLoading: false,
    poiLoading: false,
    poiArchivedLoading: false,
    poiDraftLoading: false,
    networkError: false,
    poiArchived: false,
    poiArchivedDeleteLoading: false,
    workSiteData: [],
    workSiteLoading: false,
    poiExpiredError: false,

    poiDoc:[],
    poiDocLoading: false,
}





const PoiReducer = (state = POIState, action) => {
    switch (action.type) {
        case TASK_GET_POI_START:
            return {
                ...state,
                poiLoading: action.loading,
                networkError: action.networkError,
                poiArchivedDeleteLoading: false,
                poiArchived: false
            };
        case TASK_GET_POI_ERROR:
            return {
                ...state,
                poiExpiredError: action.expiredError,
                poiLoading: action.loading,
            };
        case TASK_GET_POI_COMPLETE:
            return {
                ...state,
                poiLoading: action.loading,
                poiData: action.payload
            };
        case TASK_GET_POI_END:
            return {
                ...state,
                poiLoading: action.loading,
                networkError: action.networkError,
            };

        case TASK_CLEAR_EXPIRED:
            return {
                ...state,
                poiExpiredError: false,
            };


        case TASK_GET_POI_ARCHIVED_START:
            return {
                ...state,
                poiArchivedLoading: action.loading,
                networkError: action.networkError,
                poiArchivedDeleteLoading: false,
                poiArchived: false
            };
        case TASK_GET_POI_ARCHIVED_COMPLETE:
            return {
                ...state,
                poiArchivedLoading: action.loading,
                poiArchivedData: action.payload
            };
        case TASK_GET_POI_ARCHIVED_END:
            return {
                ...state,
                poiArchivedLoading: action.loading,
                networkError: action.networkError,
            };


        case TASK_GET_POI_DRAFT_START:
            return {
                ...state,
                poiDraftLoading: action.loading,
                networkError: action.networkError
            };
        case TASK_GET_POI_DRAFT_COMPLETE:
            return {
                ...state,
                poiDraftLoading: action.loading,
                poiDraftData: action.payload
            };
        case TASK_GET_POI_DRAFT_END:
            return {
                ...state,
                poiDraftLoading: action.loading,
                networkError: action.networkError,
            };


        case TASK_WORKORDER_FOR_POI_START:
            return {
                ...state,
                workOrderLoading: action.loading,
                networkError: action.networkError
            };
        case TASK_WORKORDER_FOR_POI_COMPLETE:
            return {
                ...state,
                workOrderLoading: action.loading,
                workOrderData: action.payload
            };
        case TASK_WORKORDER_FOR_POI_END:
            return {
                ...state,
                workOrderLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_GET_POI_BY_ID_START:
            return {
                ...state,
                POIGetByIDDataLoading: action.loading,
                networkError: action.networkError
            };
        case TASK_GET_POI_BY_ID_COMPLETE:
            return {
                ...state,
                POIGetByIDDataLoading: action.loading,
                POIGetByIDData: action.payload
            };
        case TASK_GET_POI_BY_ID_END:
            return {
                ...state,
                POIGetByIDDataLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_GET_POI_BY_ID_START_DOC:
            return {
                ...state,
                poiDocLoading: action.loading,
                networkError: action.networkError
            };
        case TASK_GET_POI_BY_ID_COMPLETE_DOC:
            return {
                ...state,
                poiDocLoading: action.loading,
                poiDoc: action.payload
            };
        case TASK_GET_POI_BY_ID_END_DOC:
            return {
                ...state,
                poiDocLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_WORKORDER_UN_FOR_POI_START:
            return {
                ...state,
                workOrderUnLoading: action.loading,
                networkError: action.networkError
            };
        case TASK_WORKORDER_UN_FOR_POI_COMPLETE:
            return {
                ...state,
                workOrderUnLoading: action.loading,
                workOrderUnData: action.payload
            };
        case TASK_WORKORDER_UN_FOR_POI_END:
            return {
                ...state,
                workOrderUnLoading: action.loading,
                networkError: action.networkError,
            };



        case TASK_WORKORDER_LINK_FOR_POI_START:
            return {
                ...state,
                workOrderLinkLoading: action.loading,
                networkError: action.networkError
            };
        case TASK_WORKORDER_LINK_FOR_POI_COMPLETE:
            return {
                ...state,
                workOrderLinkLoading: action.loading,
                workOrderLinkData: action.payload
            };
        case TASK_WORKORDER_LINK_FOR_POI_END:
            return {
                ...state,
                workOrderLinkLoading: action.loading,
                networkError: action.networkError,
            };


        case TASK_POI_ARCHIVED_START:
            return {
                ...state,
                poiArchivedDeleteLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_POI_ARCHIVED_COMPLETE:
            return {
                ...state,
                poiArchivedDeleteLoading: action.loading,
                poiArchived: true
            };
        case TASK_POI_ARCHIVED_END:
            return {
                ...state,
                poiArchivedDeleteLoading: action.loading,
                networkError: action.networkError,
            };





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

        default:
            return state;
    }
};

export { PoiReducer }