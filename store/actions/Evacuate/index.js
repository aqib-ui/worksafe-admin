import {
    TASK_LOAD_EVACUATE_START,
    TASK_LOAD_EVACUATE_COMPLETE,
    TASK_LOAD_EVACUATE_END
} from '../types';
import { handleRequest } from '../../apiTransport'
import io from 'socket.io-client'
import { baseUrl } from '../../config.json'


export const GetEvacuate = (ChatID) => async (dispatch) =>
    handleRequest(dispatch, `/chatapi/allEvacuations/${ChatID}`, 'GET', [
        TASK_LOAD_EVACUATE_START,
        TASK_LOAD_EVACUATE_COMPLETE,
        TASK_LOAD_EVACUATE_END
    ]);




export const loadEvacuationData = (openNotification) => async (dispatch, getState) => {
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const socket = io(`${baseUrl}/chat`, {
        transports: ["websocket"],
        query: { authorization: `Bearer ${token}` },
    });
    socket.on("connect", () => {
        socket.on("evacuationCreated", (data) => {
            const prevEvacuationData = getState().EvacuateReducer.EvacauteData || [];
            if (data?.evacuation?.evacuation) {
                openNotification()
                dispatch({
                    type: TASK_LOAD_EVACUATE_COMPLETE,
                    loading: false,
                    payload: [data?.evacuation?.evacuation, ...prevEvacuationData],
                });
            }

        });
    });
    return socket;
};