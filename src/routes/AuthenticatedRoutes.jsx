// src/routes/AuthenticatedRoutes.jsx
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from "../layout.jsx";
import TeamScreen from "../screens/teamScreen";
import UserScreen from "../screens/userScreen/index.jsx";
import PaymentScreen from "../screens/paymentScreen/index.jsx";
import EnterpriseScreen from "../screens/enterpriseScreen/index.jsx";




import WorkorderScreenCreate from "../screens/WorkOrderScreen/workorderCreateScreen/index.jsx";
import WorkorderScreenRead from "../screens/WorkOrderScreen/workorderReadScreen/index.jsx";
import WorkorderScreenReadAssign from "../screens/WorkOrderScreen/workorderReadScreenAssign/index.jsx";


import WorkorderEditScreen from "../screens/WorkOrderScreen/workorderEditScreen/index.jsx";
import WorkOrderLayout from "../screens/WorkOrderScreen/workOrderScreen/Layout.jsx";
import WorkOrderMyWorkOrder from "../screens/WorkOrderScreen/workOrderScreen/myWorkSite.jsx";
import WorkOrderAssignTOMe from "../screens/WorkOrderScreen/workOrderScreen/AssignToMe.jsx";
import WorkOrderArchived from "../screens/WorkOrderScreen/workOrderScreen/Archived.jsx";


import POILayout from "../screens/PoiScreen/POIScreen/Layout.jsx";
import MyPOI from "../screens/PoiScreen/POIScreen/myPOI.jsx";
import DraftPOI from "../screens/PoiScreen/POIScreen/DraftPOI.jsx";
import ArchivedPOI from "../screens/PoiScreen/POIScreen/Archived.jsx";
import POIScreenCreate from "../screens/PoiScreen/POICreateScreen/index.jsx";
import POIScreenRead from "../screens/PoiScreen/POIReadScreen/index.jsx";
import POIScreenReadDraft from "../screens/PoiScreen/POIReadDraftScreen/index.jsx";
import POIEditScreen from "../screens/PoiScreen/POIEditScreen/index.jsx";




import ProjectLayout from "../screens/Project/ProjectScreen/Layout.jsx";
import MyProject from "../screens/Project/ProjectScreen/myProject.jsx";
import MyArchived from "../screens/Project/ProjectScreen/Archived.jsx";
import CreateProject from "../screens/Project/ProjectCreateScreen/index.jsx";
import ReadProject from "../screens/Project/ProjectReadScreen/index.jsx";
import EditProject from "../screens/Project/ProjectEditScreen/index.jsx";
import MyCompany from "../screens/Company/company.jsx";
import LockedContent from "../screens/lockedContent/index.jsx";

import AlertScreenCreate from "../screens/Alerts/AlertsCreateScreen/index.jsx";
import AlertScreenEdit from "../screens/Alerts/AlertsEditScreen/index.jsx";
import AlertScreenRead from "../screens/Alerts/AlertsReadScreen";
import AlertScreenList from "../screens/Alerts/AlertsScreen/myAlerts.jsx";
import AlertScreenArchived from "../screens/Alerts/AlertsScreen/Archived.jsx";
import AlertLayout from "../screens/Alerts/AlertsScreen/Layout.jsx";


import AssetsScreenCreate from "../screens/Assets/AssetCreateScreen/index.jsx";
import AssetsScreenEdit from "../screens/Assets/AssetEditScreen/index.jsx";
import AssetsScreenRead from "../screens/Assets/AssetReadScreen/index.jsx";
import AssetsScreenList from "../screens/Assets/AssetScreen/myAssets.jsx";
import AssetsScreenArchived from "../screens/Assets/AssetScreen/Archived.jsx";
import AssetsLayout from "../screens/Assets/AssetScreen/Layout.jsx";


import DailyProjectLayout from "../screens/Project/DailyProject/DailyProjectScreen/Layout.jsx";
import DailyMyProject from "../screens/Project/DailyProject/DailyProjectScreen/myDailyProject.jsx";
import DailyProjectCreateScreen from '../screens/Project/DailyProject/DailyProjectCreateScreen/index.jsx';

import * as PermissionAction from '../../store/actions/Permissions/index.js';
import { connect } from 'react-redux';
import DailyProjectReadScreen from '../screens/Project/DailyProject/DailyProjectReadScreen/index.jsx';
import DailyProjectEditScreen from '../screens/Project/DailyProject/DailyProjectEditScreen/index.jsx';
import DashboardScreen from '../screens/DashboardScreen/index.jsx';
import ChatLayout from '../screens/ChatScreen/ChatScreenLayout/Layout.jsx';
import MyChat from '../screens/ChatScreen/ChatScreenLayout/myChat.jsx';
import NotFoundScreen from '../screens/NoScreen/index.jsx'

// worksite
import WorksiteLayout from "../screens/worksite/worksite/Layout.jsx";
import MyWorksite from "../screens/worksite/worksite/myWorkstie.jsx";
import CreateWorksite from "../screens/worksite/WorksiteCreateScreen/index.jsx";
import WorksiteScreenRead from "../screens/worksite/WorksiteReadScreen/index.jsx"
import WorksiteScreenEdit from "../screens/worksite/WorksiteEditScreen/index.jsx"
import MusterStationEditScreen from '../screens/worksite/MusterStationEditScreen/index.jsx';
import MusterStationViewScreen from '../screens/worksite/MusterStationViewScreen/index.jsx';
import MusterStationCreateScreen from '../screens/worksite/MusterStationCreateScreen/index.jsx';
import Evacuate from '../screens/Evacuate/index.jsx';


// Evacuate
import EvacuateLayout from "../screens/Evacuate/EvacuateList/Layout.jsx";
import EvacuateListing from "../screens/Evacuate/EvacuateList/index.jsx";


const AuthenticatedRoutes = ({ PermissionReducer, GetAllPermissions }) => {
    const UserID = localStorage.getItem('zP!4vBN#tw69gV+%2/+1/w==')
    useEffect(() => {
        GetAllPermissions(UserID)
    }, [])
    const AllContentPermission = PermissionReducer.allPermission?.data?.role_id?.permissions || []
    const hasPermission = (module, type = 'read') => {
        const modulePerm = AllContentPermission?.find(data => data?.module === module)?.permissions;
        if (modulePerm === undefined) return true;
        return modulePerm?.[type] === true;
    };
    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="*" element={<NotFoundScreen />} />
                    <Route path="/" element={<DashboardScreen />} />
                    <Route path="/teams" element={<TeamScreen />} />
                    <Route path="/users" element={hasPermission("USERS") ? <UserScreen /> : <LockedContent />} />
                    <Route path="/payment" element={<PaymentScreen />} />
                    <Route path="/enterprise" element={<EnterpriseScreen />} />
                    <Route path="/company" element={<MyCompany />} />




                    {/* workorder */}
                    <Route element={hasPermission("WORKORDERS") ? <WorkOrderLayout /> : <LockedContent />}>
                        <Route path="/workorder/my-work-site" element={<WorkOrderMyWorkOrder />} />
                        <Route path="/workorder/assign-to-me" element={<WorkOrderAssignTOMe />} />
                        <Route path="/workorder/archived" element={<WorkOrderArchived />} />
                    </Route>
                    <Route path="/workorder/create" element={hasPermission("WORKORDERS") && hasPermission("WORKORDERS", "create") ? <WorkorderScreenCreate /> : <LockedContent />} />
                    <Route forceRefresh={true} path="/workorder/read" element={hasPermission("WORKORDERS") ? <WorkorderScreenRead /> : <LockedContent />} />
                    <Route forceRefresh={true} path="/workorder/readAssign" element={hasPermission("WORKORDERS") ? <WorkorderScreenReadAssign /> : <LockedContent />} />

                    <Route forceRefresh={true} path="/workorder/edit" element={hasPermission("WORKORDERS") && hasPermission("WORKORDERS", "update") ? <WorkorderEditScreen /> : <LockedContent />} />
                    {/* workorder */}


                    {/* POI */}
                    <Route element={hasPermission("POIS") ? <POILayout /> : <LockedContent />}>
                        <Route path="/POI/Poi" element={<MyPOI />} />
                        <Route path="/POI/draft" element={<DraftPOI />} />
                        <Route path="/POI/archived" element={<ArchivedPOI />} />
                    </Route>

                    <Route path="/POI/create" element={hasPermission("POIS") && hasPermission("POIS", "create") ? <POIScreenCreate /> : <LockedContent />} />
                    <Route forceRefresh={true} path="/POI/read" element={hasPermission("POIS") ? <POIScreenRead /> : <LockedContent />} />
                    <Route forceRefresh={true} path="/POI/read/draft" element={hasPermission("POIS") ? <POIScreenReadDraft /> : <LockedContent />} />
                    <Route forceRefresh={true} path="/POI/edit" element={hasPermission("POIS") && hasPermission("POIS", "update") ? <POIEditScreen /> : <LockedContent />} />
                    {/* POI */}



                    {/* ALERTS */}
                    <Route element={hasPermission("ALERTS") ? <AlertLayout /> : <LockedContent />}>
                        <Route path="/alerts/my-alerts" element={<AlertScreenList />} />
                        <Route path="/alerts/archived" element={<AlertScreenArchived />} />
                    </Route>

                    <Route path="/alerts/create" element={hasPermission("ALERTS") && hasPermission("ALERTS", "create") ? <AlertScreenCreate /> : <LockedContent />} />
                    <Route forceRefresh={true} path="/alerts/read" element={hasPermission("ALERTS") ? <AlertScreenRead /> : <LockedContent />} />
                    <Route forceRefresh={true} path="/alerts/edit" element={hasPermission("ALERTS") && hasPermission("ALERTS", "update") ? <AlertScreenEdit /> : <LockedContent />} />
                    {/* ALERTS */}



                    {/* ASSETS */}
                    <Route element={hasPermission("ASSETS") ? <AssetsLayout /> : <LockedContent />}>
                        <Route path="/assets/my-assets" element={<AssetsScreenList />} />
                        <Route path="/assets/archived" element={<AssetsScreenArchived />} />
                    </Route>

                    <Route path="/assets/create" element={hasPermission("ASSETS") && hasPermission("ASSETS", "create") ? <AssetsScreenCreate /> : <LockedContent />} />
                    <Route forceRefresh={true} path="/assets/read" element={hasPermission("ASSETS") ? <AssetsScreenRead /> : <LockedContent />} />
                    <Route forceRefresh={true} path="/assets/edit" element={hasPermission("ASSETS") && hasPermission("ASSETS", "update") ? <AssetsScreenEdit /> : <LockedContent />} />
                    {/* ASSETS */}


                    {/* Project */}
                    <Route element={<ProjectLayout />}>
                        <Route path="/project/my-project" element={<MyProject />} />
                        <Route path="/project/archived" element={<MyArchived />} />
                    </Route>
                    <Route path="/project/create" element={<CreateProject />} />
                    <Route path="/project/read" element={<ReadProject />} />
                    <Route path="/project/edit" element={<EditProject />} />


                    <Route element={<DailyProjectLayout />}>
                        <Route path="/project/daily-project" element={<DailyMyProject />} />
                    </Route>
                    <Route path="/project/daily/create" element={<DailyProjectCreateScreen />} />
                    <Route path="/project/daily/read" element={<DailyProjectReadScreen />} />
                    <Route path="/project/daily/edit" element={<DailyProjectEditScreen />} />
                    {/* Project */}



                    {/* worksite */}
                    <Route element={<WorksiteLayout />}>
                        <Route path="/worksite/my-worksite" element={<MyWorksite />} />
                    </Route>
                    <Route path="/worksite/create" element={<CreateWorksite />} />
                    <Route path="/worksite/read" element={<WorksiteScreenRead />} />
                    <Route path="/worksite/edit" element={<WorksiteScreenEdit />} />
                    <Route path="/worksite/muster-station" element={<MusterStationCreateScreen />} />
                    <Route path="/worksite/muster-station/edit" element={<MusterStationEditScreen />} />
                    <Route path="/worksite/muster-station/view" element={<MusterStationViewScreen />} />

                    {/* Evacuate */}
                    <Route element={<EvacuateLayout />}>
                        <Route path="/evacuate/list" element={<EvacuateListing />} />
                    </Route>

                    <Route path="/evacuate" element={<Evacuate />} />

                    {/* Chat Screen */}
                    <Route element={<ChatLayout />}>
                        <Route path="/chat" element={<MyChat />} />
                    </Route>
                    {/* Chat Screen */}
                </Route>
            </Routes>
        </>
    )
};

function mapStateToProps({ PermissionReducer }) {
    return { PermissionReducer };
}
export default connect(mapStateToProps, PermissionAction)(AuthenticatedRoutes);
