import {
    MESSAGE_SHOW,
    MESSAGE_HIDE
} from '../../actions/types'

const messageState = {
    show: false,
    content: "",
    messageType: null
}
const MessageReducer = (state = messageState, action) => {
    switch (action.type) {
        case MESSAGE_SHOW:
            return {
                ...state,
                show: true,
                content: action.content,
                messageType: action.content,
            };
        case MESSAGE_HIDE:
            return {
                ...state,
                show: false,
                content: "",
                messageType: null,
            };
        default:
            return state;
    }
};

export { MessageReducer }