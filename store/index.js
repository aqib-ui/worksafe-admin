import { combineReducers, compose, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { UserReducer } from "./reducers/Users/index";
import { TeamReducer } from "./reducers/Teams/index";
import { PaymentReducer } from "./reducers/Payment";
import { EnterpriseReducer } from "./reducers/Enterprise";
import { LoginReducer } from "./reducers/Login";
import { WorkOrderReducer } from "./reducers/WorkOrder";
import { PoiReducer } from "./reducers/Poi";
import { PermissionReducer } from "./reducers/Permissions/index";
import { ProjectReducer } from "./reducers/Project";
import { AlertsReducer } from "./reducers/Alerts";
import { AssetsReducer } from "./reducers/Assets";
import { WorksiteReducer } from "./reducers/Worksite";
import { EvacuateReducer } from "./reducers/Evacuate";
import { MessageReducer } from "./reducers/messageReducer";



const reducers = combineReducers({
    UserReducer,
    TeamReducer,
    PaymentReducer,
    EnterpriseReducer,
    LoginReducer,
    WorkOrderReducer,
    PoiReducer,
    PermissionReducer,
    ProjectReducer,
    AlertsReducer,
    AssetsReducer,
    WorksiteReducer,
    EvacuateReducer,
    // New UI
    MessageReducer
});

const composeEnhancers = window.REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;
const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk)));
export default store;

