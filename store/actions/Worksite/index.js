import {
    TASK_LOAD_WORKSITE_START,
    TASK_LOAD_WORKSITE_COMPLETE,
    TASK_LOAD_WORKSITE_END,

    TASK_LOAD_MANAGER_START,
    TASK_LOAD_MANAGER_COMPLETE,
    TASK_LOAD_MANAGER_END,

    TASK_LOAD_WORKSITE_TEAM_START,
    TASK_LOAD_WORKSITE_TEAM_COMPLETE,
    TASK_LOAD_WORKSITE_TEAM_END,

    TASK_LOAD_WORKSITE_DETAIL_START,
    TASK_LOAD_WORKSITE_DETAIL_COMPLETE,
    TASK_LOAD_WORKSITE_DETAIL_END,


    TASK_LOAD_MUSTER_STATION_START,
    TASK_LOAD_MUSTER_STATION_COMPLETE,
    TASK_LOAD_MUSTER_STATION_END
} from '../types';
import { handleRequest } from '../../apiTransport'




export const GetWorkSite = () => async (dispatch) =>
    handleRequest(dispatch, '/worksites', 'GET', [
        TASK_LOAD_WORKSITE_START,
        TASK_LOAD_WORKSITE_COMPLETE,
        TASK_LOAD_WORKSITE_END
    ]);

export const GetWorkSiteByID = (id) => async (dispatch) =>
    handleRequest(dispatch, `/worksites/get-by-id/${id}`, 'GET', [
        TASK_LOAD_WORKSITE_DETAIL_START,
        TASK_LOAD_WORKSITE_DETAIL_COMPLETE,
        TASK_LOAD_WORKSITE_DETAIL_END
    ]);



export const GetTeamInWorksite = (body, page) => async (dispatch) =>
    handleRequest(dispatch, `/teams/forAdmin`, 'GET', [
        TASK_LOAD_WORKSITE_TEAM_START,
        TASK_LOAD_WORKSITE_TEAM_COMPLETE,
        TASK_LOAD_WORKSITE_TEAM_END
    ]);


export const GetManagerInWorksite = () => async (dispatch) =>
    handleRequest(dispatch, '/users/all', 'GET', [
        TASK_LOAD_MANAGER_START,
        TASK_LOAD_MANAGER_COMPLETE,
        TASK_LOAD_MANAGER_END
    ]);


export const GetMusterStation = (id) => async (dispatch) =>
    handleRequest(dispatch, `/muster?worksiteId=${id}`, 'GET', [
        TASK_LOAD_MUSTER_STATION_START,
        TASK_LOAD_MUSTER_STATION_COMPLETE,
        TASK_LOAD_MUSTER_STATION_END
    ]);