import {
    TASK_LOAD_WORKSITE_START,
    TASK_LOAD_WORKSITE_COMPLETE,
    TASK_LOAD_WORKSITE_END,

    TASK_LOAD_WORKSITE_DETAIL_START,
    TASK_LOAD_WORKSITE_DETAIL_COMPLETE,
    TASK_LOAD_WORKSITE_DETAIL_END,

    TASK_LOAD_MANAGER_START,
    TASK_LOAD_MANAGER_COMPLETE,
    TASK_LOAD_MANAGER_END,

    TASK_LOAD_WORKSITE_TEAM_START,
    TASK_LOAD_WORKSITE_TEAM_COMPLETE,
    TASK_LOAD_WORKSITE_TEAM_END,



    TASK_LOAD_MUSTER_STATION_START,
    TASK_LOAD_MUSTER_STATION_COMPLETE,
    TASK_LOAD_MUSTER_STATION_END
} from '../../actions/types'

const worksiteState = {
    worksite: [],
    worksiteLoading: false,
    teamData: [],
    teamLoading: false,

    musterStation: [],
    musterStationLoading: false,
    managerData: [],
    managerLoading: false,
    networkError: false,
    worksiteDetail: null,
    worksiteDetailLoading: false,
}

const WorksiteReducer = (state = worksiteState, action) => {
    switch (action.type) {
        case TASK_LOAD_WORKSITE_START:
            return {
                ...state,
                worksiteLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_WORKSITE_COMPLETE:
            return {
                ...state,
                worksiteLoading: action.loading,
                worksite: action.payload
            };
        case TASK_LOAD_WORKSITE_END:
            return {
                ...state,
                worksiteLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_LOAD_WORKSITE_TEAM_START:
            return {
                ...state,
                teamLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_WORKSITE_TEAM_COMPLETE:
            return {
                ...state,
                teamLoading: action.loading,
                teamData: action.payload
            };
        case TASK_LOAD_WORKSITE_TEAM_END:
            return {
                ...state,
                teamLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_LOAD_MANAGER_START:
            return {
                ...state,
                managerLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_MANAGER_COMPLETE:
            return {
                ...state,
                managerLoading: action.loading,
                managerData: action.payload
            };
        case TASK_LOAD_MANAGER_END:
            return {
                ...state,
                managerLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_LOAD_WORKSITE_DETAIL_START:
            return {
                ...state,
                worksiteDetailLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_WORKSITE_DETAIL_COMPLETE:
            return {
                ...state,
                worksiteDetailLoading: action.loading,
                worksiteDetail: action.payload
            };
        case TASK_LOAD_WORKSITE_DETAIL_END:
            return {
                ...state,
                worksiteDetailLoading: action.loading,
                networkError: action.networkError,
            };




        case TASK_LOAD_MUSTER_STATION_START:
            return {
                ...state,
                musterStationLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_MUSTER_STATION_COMPLETE:
            return {
                ...state,
                musterStationLoading: action.loading,
                musterStation: action.payload
            };
        case TASK_LOAD_MUSTER_STATION_END:
            return {
                ...state,
                musterStationLoading: action.loading,
                networkError: action.networkError,
            };

        default:
            return state;
    }
};

export { WorksiteReducer }