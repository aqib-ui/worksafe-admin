import {
    TASK_LOAD_PAYMENT_START,
    TASK_LOAD_PAYMENT_COMPLETE,
    TASK_LOAD_PAYMENT_END,
} from '../../actions/types'

const teamState = {
    data: [],
    loading: false,
    networkError: false
}

const PaymentReducer = (state = teamState, action) => {
    switch (action.type) {
        case TASK_LOAD_PAYMENT_START:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError
            };
        case TASK_LOAD_PAYMENT_COMPLETE:
            return {
                ...state,
                loading: action.loading,
                data: action.payload
            };
        case TASK_LOAD_PAYMENT_END:
            return {
                ...state,
                loading: action.loading,
                networkError: action.networkError,
            };
        default:
            return state;
    }
};

export { PaymentReducer }