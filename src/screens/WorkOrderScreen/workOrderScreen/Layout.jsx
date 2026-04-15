import { message, Spin, Tooltip } from 'antd';
import Style from './workOrderScreen.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';
import ListInputSearch from '../../../component/ListInputSearch';
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect } from 'react-redux';

const WorkOrderLayout = ({ PermissionReducer }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const AllContentPermission = PermissionReducer.allPermission?.data?.role_id?.permissions || []
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState('')
    const navigateToCreate = () => {
        if (localStorage.getItem("expireUser") == "true") {
            messageApi.open({
                type: "info",
                content: "Payment Expired",
            });
        }
        else {
            navigate('/workorder/create')
        }
    }

    useEffect(() => {
        localStorage.removeItem("Q8@L!zM7B_1xP#t+6R9Dg*v==");
        localStorage.removeItem("cLocation");
        localStorage.removeItem("sLocation");
        const loadWorkSite = localStorage.getItem('+AOQ^%^f0Gn4frTqztZadLrKg==')
        if (!loadWorkSite) {
            navigate('/')
        }
    }, [])


    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>Work Orders</h1>
                    </div>
                </div>
                <div className={Style.TabHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className={Style.TabBtn} style={location.pathname == "/workorder/assign-to-me" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/workorder/assign-to-me')}>Assign To Me</button>
                        <button className={Style.TabBtn} style={location.pathname == "/workorder/my-work-site" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/workorder/my-work-site')}>Created By Me</button>
                        <button className={Style.TabBtn} style={location.pathname == "/workorder/archived" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/workorder/archived')}>Archived</button>
                    </div>
                    <div>
                        <button className={Style.NewBtn} onClick={() => navigate('/workorder/create')}>Create Work Order</button>
                    </div>
                </div>
                <div className={Style.TableSectionLayout}>
                    <Outlet context={{ searchQuery: query }} />
                </div>
            </div>
        </>
    )
}


function mapStateToProps({ PermissionReducer }) {
    return { PermissionReducer };
}
export default connect(mapStateToProps, WorkOrderAction)(WorkOrderLayout);
