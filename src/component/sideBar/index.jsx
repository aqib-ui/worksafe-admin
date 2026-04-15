import React, { useContext, useEffect } from "react";
import Style from './sidebar.module.css'
import { ConfigProvider, message, notification, Skeleton, Spin, Tooltip } from "antd";
import { HiOutlineHome } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { LuSettings } from "react-icons/lu";
import { useNavigate } from "react-router";
import { TbUsers } from "react-icons/tb";
import { GoCreditCard } from "react-icons/go";
import { TfiPackage } from "react-icons/tfi";
import { IoHammerOutline } from "react-icons/io5";
import Logo from '../../assets/logo.png'
import * as WorkOrderAction from '../../../store/actions/WorkOrder/index';
import * as EvacuationAction from '../../../store/actions/Evacuate';
import { connect } from 'react-redux';
import { SlMap } from "react-icons/sl";
import { PiProjectorScreen } from "react-icons/pi";
import { GoOrganization } from "react-icons/go";
import { SlOrganization } from "react-icons/sl";
import { LuTriangleAlert } from "react-icons/lu";
import { SlDrawer } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCircleAlert } from "react-icons/lu";

import * as EnterPriseAction from '../../../store/actions/Enterprise/index';
import * as PaymentAction from '../../../store/actions/Payment/index';

// new UI

import sideIcon1 from '../../assets/icons/sidebarIcon/icon-1.png'
import sideIcon2 from '../../assets/icons/sidebarIcon/icon-2.png'
import sideIcon3 from '../../assets/icons/sidebarIcon/icon-3.png'
import sideIcon4 from '../../assets/icons/sidebarIcon/icon-4.png'
import sideIcon5 from '../../assets/icons/sidebarIcon/icon-5.png'
import sideIcon6 from '../../assets/icons/sidebarIcon/icon-6.png'
import sideIcon7 from '../../assets/icons/sidebarIcon/icon-7.png'
import sideIcon8 from '../../assets/icons/sidebarIcon/icon-8.png'
import sideIcon9 from '../../assets/icons/sidebarIcon/icon-9.png'
import sideIcon10 from '../../assets/icons/sidebarIcon/icon-10.png'
import sideIcon11 from '../../assets/icons/sidebarIcon/icon-11.png'
import sideIcon12 from '../../assets/icons/sidebarIcon/icon-12.png'
import sideIcon13 from '../../assets/icons/sidebarIcon/icon-13.png'




const SideBar = ({ PermissionReducer, GetWorkSite, GetAdminWorkSite, EnterpriseReducer, GetCompanyInfo }) => {
    const WorkSite = localStorage.getItem('+AOQ^%^f0Gn4frTqztZadLrKg==')
    const Role_ID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')
    const userRole = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')?.trim()
    const AllContentPermission = PermissionReducer.allPermission?.data?.role_id?.permissions || []
    const [messageApi, messageContextHolder] = message.useMessage();
    const { companyInfoDate } = EnterpriseReducer


    useEffect(() => {
        if (Role_ID == '6768f37ff2ef345b103370df') {
            GetAdminWorkSite()
        }
        else {
            GetWorkSite()
            GetCompanyInfo()
        }
    }, [])
    const navigate = useNavigate()

    console.log(companyInfoDate, 'asd99')

    const sideBar = [
        {
            id: 24,
            name: "Dashboard",
            link: "/",
            icon: sideIcon1,
            access: userRole !== "6768f37ff2ef345b103370df" ? true : false,
            workSiteRequire: false,
        },
        {
            id: 1,
            name: "Teams",
            link: "/teams",
            icon: sideIcon2,
            access: AllContentPermission?.find(data => data?.module == "TEAMS")?.permissions?.read,
            workSiteRequire: Role_ID == '6768f37ff2ef345b103370df' ? false : true,
        },
        {
            id: 6,
            name: "Work Orders",
            link: "/workorder/assign-to-me",
            icon: sideIcon3,
            access: AllContentPermission?.find(data => data?.module == "WORKORDERS")?.permissions?.read,
            workSiteRequire: true,
        },
        {
            id: 7,
            name: "POIs",
            link: "/POI/Poi",
            icon: sideIcon4,
            access: AllContentPermission?.find(data => data?.module == "POIS")?.permissions?.read,
            workSiteRequire: true,
        },
        {
            id: 10,
            name: "Alerts",
            link: "/alerts/my-alerts",
            icon: sideIcon5,
            access: AllContentPermission?.find(data => data?.module == "DAILYPROJECTS")?.permissions?.read,
            workSiteRequire: true,
        },
        {
            id: 11,
            name: "Assets",
            link: "/assets/my-assets",
            icon: sideIcon6,
            access: AllContentPermission?.find(data => data?.module == "DAILYPROJECTS")?.permissions?.read,
            workSiteRequire: true,
        },
        {
            id: 9,
            name: "Projects",
            link: "/project/my-project",
            icon: sideIcon7,
            access: AllContentPermission?.find(data => data?.module == "DAILYPROJECTS")?.permissions?.read,
            workSiteRequire: true,
        },
        {

            id: 23,
            name: "Evacuation",
            link: "/evacuate/list",
            icon: sideIcon9,
            access: AllContentPermission?.find(data => data?.module == "POIS")?.permissions?.read,
            workSiteRequire: true,
        },
        {
            id: 2,
            name: "Users",
            link: "/users",
            icon: sideIcon11,
            access: AllContentPermission?.find(data => data?.module == "USERS")?.permissions?.read,
            workSiteRequire: false,

        },

        {
            id: 8,
            name: "All Companies",
            link: "/company/all",
            icon: sideIcon10,
            access: userRole !== "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: false,
        },

        {
            id: 4,
            name: "Payments",
            link: "/payment",
            icon: sideIcon12,
            access: AllContentPermission?.find(data => data?.module == "PAYMENTS")?.permissions?.read,
            workSiteRequire: false,

        },
        {
            id: 5,
            name: "Enterprise Billing",
            link: "/enterprise",
            icon: sideIcon6,
            access: true,
            workSiteRequire: false,
        },
        {
            id: 21,
            name: "Setting",
            link: "/setting",
            icon: sideIcon13,
            access: userRole !== "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: false,
        },
    ]
    const showWorkSiteMessage = () => {
        messageApi.destroy()
        messageApi.open({
            type: "info",
            content: "Please select worksite from header to proceed.",
        });
    }


    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const converted = bytes / Math.pow(k, i);
        return `${parseFloat(converted.toFixed(2))} ${sizes[i]}`;
    }



    // function getStoragePercentage(usedStorage, totalStorage) {
    //     if (!totalStorage) return "0%";

    //     const percentage = (usedStorage / totalStorage) * 100;

    //     if (percentage < 0.01) return percentage.toFixed(4) + "%";
    //     if (percentage < 0.1) return percentage.toFixed(3) + "%";
    //     if (percentage < 1) return percentage.toFixed(2) + "%";
    //     return percentage.toFixed(1) + "%";
    // }


    // percentage calculation
    function getStoragePercentage(usedStorage, totalStorage) {
        if (!totalStorage) return 0;
        return (usedStorage / totalStorage) * 100;
    }

    // percentage formatter
    function formatPercentage(value) {
        if (value < 0.01) return value.toFixed(4) + "%";
        if (value < 0.1) return value.toFixed(3) + "%";
        if (value < 1) return value.toFixed(2) + "%";
        return value.toFixed(1) + "%";
    }

    // usage
    const percentage = getStoragePercentage(
        companyInfoDate?.usedStorage,
        companyInfoDate?.totalStorage
    );

    // color logic
    let storageColor = "#214cbc";
    if (percentage >= 60 && percentage < 85) {
        storageColor = "#facc15";
    } else if (percentage >= 85) {
        storageColor = "#ef4444";
    }
    return (
        <>
            {messageContextHolder}
            <div className={Style.MainSidecontainer}>
                <span className={Style.HeaderHeading}>worksite</span>
                <>
                    {sideBar.filter(data => {
                        if (userRole === "6768f37ff2ef345b103370df") {
                            return data.id !== 6 && data.id !== 7 && data.id !== 9 && data.id !== 3 && data.id !== 10 && data.id !== 11 && data?.id !== 23;
                        }
                        if (userRole !== "6768f37ff2ef345b103370df") {
                            return data.id !== 5 && data.id !== 2 && data.id !== 4;
                        }
                        return true;
                    })
                        .map(data => {
                            if (!data.access) return null;
                            else {
                                return (
                                    <div onClick={() =>
                                        data.workSiteRequire
                                            ? (WorkSite !== null
                                                ? navigate(data.link)
                                                : showWorkSiteMessage())
                                            : navigate(data.link)
                                    } className={Style.SideIconLine}>
                                        <img src={data?.icon} />
                                        <p>{data.name}</p>
                                    </div>
                                )
                            }
                        })
                    }
                </>
                {/* } */}

                {Role_ID !== "6768f37ff2ef345b103370df" &&
                    <>
                        <hr />
                        <span className={Style.HeaderHeading}>company</span>
                        <div onClick={() => navigate('/worksite/my-worksite')} className={Style.SideIconLine}>
                            <img src={sideIcon10} />
                            <p>Worksites</p>
                        </div>

                        <div onClick={() => navigate('users')} className={Style.SideIconLine}>
                            <img src={sideIcon11} />
                            <p>Users</p>
                        </div>

                        <div onClick={() => navigate('/company')} className={Style.SideIconLine}>
                            <img src={sideIcon12} />
                            <p>Plan & Billing</p>
                        </div>

                        <div className={Style.SideIconStorageLine}>
                            <div style={{ width: `${percentage}%`, backgroundColor: storageColor, }} className={Style.filledStorage}></div>
                            <div className={Style.leftStorage}></div>
                        </div>

                        <div className={Style.SideIconStorageLine}>
                            <p>{`${formatBytes(companyInfoDate?.usedStorage ? companyInfoDate?.usedStorage : 0)} of ${formatBytes(companyInfoDate?.totalStorage ? companyInfoDate?.totalStorage : 0)} Used`}</p>
                        </div>

                        <div className={Style.getMoreStorage}>
                            Get More Storage
                        </div>
                    </>
                }
            </div>
        </>

    )
}

function mapStateToProps({ WorkOrderReducer, PermissionReducer, EvacuateReducer, EnterpriseReducer, UserReducer, PaymentReducer }) {
    return { WorkOrderReducer, PermissionReducer, EvacuateReducer, EnterpriseReducer, UserReducer, PaymentReducer };
}
export default connect(
    mapStateToProps,
    { ...WorkOrderAction, ...EvacuationAction, ...PaymentAction, ...EnterPriseAction }
)(SideBar);

