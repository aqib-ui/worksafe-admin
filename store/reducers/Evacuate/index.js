import {
    TASK_LOAD_EVACUATE_START,
    TASK_LOAD_EVACUATE_COMPLETE,
    TASK_LOAD_EVACUATE_END
} from '../../actions/types'

const EvacuateState = {
    EvacauteData: [],
    EvacauteLoading: false,
    networkError: false
}

const EvacuateReducer = (state = EvacuateState, action) => {
    switch (action.type) {
        case TASK_LOAD_EVACUATE_START:
            return {
                ...state,
                EvacauteLoading: action.loading,
                networkError: action.networkError,
            };
        case TASK_LOAD_EVACUATE_COMPLETE:
            const updatedData = [...state.EvacauteData];

            action.payload.forEach((item) => {
                const index = updatedData.findIndex((i) => i._id === item._id);
                if (index > -1) {
                    updatedData[index] = item;
                } else {
                    updatedData.unshift(item);
                }
            });

            return {
                ...state,
                EvacauteLoading: action.loading,
                EvacauteData: updatedData,
            };


        case TASK_LOAD_EVACUATE_END:
            return {
                ...state,
                EvacauteLoading: action.loading,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};

export { EvacuateReducer }