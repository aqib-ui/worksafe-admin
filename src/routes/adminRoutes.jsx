import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from "../layout.jsx";
import TeamScreen from "../screens/teamScreen";
import UserScreen from "../screens/userScreen/index.jsx";
import PaymentScreen from "../screens/paymentScreen/index.jsx";
import EnterpriseScreen from "../screens/enterpriseScreen/index.jsx";
import AllCompaniesScreen from "../screens/allCompanies/index.jsx";
import DashboardScreen from '../screens/DashboardScreen/index.jsx';
import * as PermissionAction from '../../store/actions/Permissions/index.js';
import NotFoundScreen from '../screens/NoScreen/index.jsx'
import { connect } from 'react-redux';
import AppSetting from '../screens/appSetting/index.jsx';

const AdminRoutes = ({ PermissionReducer, GetAllPermissions }) => {
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
            {/* <Routes>
                <Route element={<Layout />}>
                    <Route path="*" element={<NotFoundScreen />} />
                    <Route path="/" element={<AllCompaniesScreen />} />
                    <Route path="/teams" element={<TeamScreen />} />
                    <Route path="/users" element={<UserScreen />} />
                    <Route path="/payment" element={<PaymentScreen />} />
                    <Route path="/enterprise" element={<EnterpriseScreen />} />
                    <Route path="/company/all" element={<AllCompaniesScreen />} />
                    <Route path="/setting" element={<AppSetting />} />
                </Route>
            </Routes> */}
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/company/all" replace />} />
                    <Route path="/company/all" element={<AllCompaniesScreen />} />
                    <Route path="/teams" element={<TeamScreen />} />
                    <Route path="/users" element={<UserScreen />} />
                    <Route path="/payment" element={<PaymentScreen />} />
                    <Route path="/enterprise" element={<EnterpriseScreen />} />
                    <Route path="/setting" element={<AppSetting />} />
                    <Route path="*" element={<NotFoundScreen />} />
                </Route>
            </Routes>
        </>
    )
};

function mapStateToProps({ PermissionReducer }) {
    return { PermissionReducer };
}
export default connect(mapStateToProps, PermissionAction)(AdminRoutes);
