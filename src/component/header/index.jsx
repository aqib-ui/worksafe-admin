import React, { useEffect, useState, useContext } from "react";
import Style from './header.module.css'
import { Badge, Drawer, Dropdown, message, Select, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router";
import * as WorkOrderAction from '../../../store/actions/WorkOrder/index';
import { connect } from 'react-redux';
import { GiHamburgerMenu } from "react-icons/gi";
import { baseUrl } from '../../../store/config.json'
import { IoSearchOutline } from "react-icons/io5";
import AdvanceSearch from "./advanceSearch";
import StackedImage from '../../assets/Stacked.png'
import HeaderLogo from '../../assets/images/mainHeaderLogo.png'


const Header = ({ WorkOrderReducer, GetMyAssignedWorkOrder, GetMyWorkOrder }) => {
    const navigate = useNavigate();
    const WorkSite = localStorage.getItem('+AOQ^%^f0Gn4frTqztZadLrKg==')
    const userRole = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')?.trim()
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const NotiFiCationIdea = async () => {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
            };
            const response = await fetch(`${baseUrl}/worksites/currentWorksite/${WorkSite}`, options);
            const res = await response.json();
        }
        if (WorkSite !== null) {
            NotiFiCationIdea()
        }
    }, [])



    const NotiFiCationIdea2 = async (id) => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
        };
        const response = await fetch(`${baseUrl}/worksites/currentWorksite/${id}`, options);
        const res = await response.json();
        navigate("/");
        window.location.reload()
    }
    const logOut = () => {
        setOpen(false);
        localStorage.clear();
        window.location.reload();
        navigate("/");
    }
    const UserName = localStorage.getItem('Lp3@vBN9tw69gV*R2/+1?w==')
    const items = [
        {
            label: (
                <div onClick={logOut} style={{ color: 'red', margin: 0 }}>
                    Logout
                </div>
            ),
            key: '0',
        },
    ];
    const WorkSiteData = WorkOrderReducer?.workSiteData?.map(data => {
        return { value: data._id, label: data?.title }
    })
    const selectWorkSite = async (Wprop) => {
        localStorage.setItem('+AOQ^%^f0Gn4frTqztZadLrKg==', Wprop)
        await NotiFiCationIdea2(Wprop)
    }


    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const SideBar = [
        {
            id: 22,
            name: "Worksite",
            link: "/worksite/my-worksite",
            access: userRole == "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: false,
        },
        {
            id: 23,
            name: "Evacuating Members",
            link: "/evacuate/list",
            access: userRole == "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: true,
        },
        {
            id: 1,
            name: "Teams",
            link: "/teams",
            access: true,
            workSiteRequire: userRole == '6768f37ff2ef345b103370df' ? false : true,
        },
        {
            id: 2,
            name: "Users",
            link: "/users",
            access: true,
            workSiteRequire: false,

        },
        {
            id: 3,
            name: "Plan & Billing",
            link: "/company",
            access: userRole == "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: false,

        },
        {
            id: 8,
            name: "All Companies",
            link: "/company/all",
            access: userRole !== "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: false,
        },

        // {
        //     id: 4,
        //     name: "Payments",
        //     link: "/payment",
        //     access: true,
        //     workSiteRequire: false,

        // },
        {
            id: 7,
            name: "POIs",
            link: "/POI/Poi",
            access: userRole == "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: true,
        },
        {
            id: 10,
            name: "Alerts",
            link: "/alerts/my-alerts",
            access: userRole == "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: true,
        },
        {
            id: 11,
            name: "Assets",
            link: "/assets/my-assets",
            access: userRole == "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: true,
        },
        {
            id: 9,
            name: "Projects",
            link: "/project/my-project",
            access: userRole == "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: true,
        },

        {
            id: 6,
            name: "Work Orders",
            link: "/workorder/assign-to-me",
            access: userRole == "6768f37ff2ef345b103370df" ? false : true,
            workSiteRequire: true,
        },
        {
            id: 21,
            name: "Setting",
            link: "/setting",
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

    const [advanceModalSearchModal, setAdvanceModalSearchModal] = useState(false);
    const showModal = () => {
        setAdvanceModalSearchModal(true);
    };
    const handleCancel = () => {
        setAdvanceModalSearchModal(false);
    };

    const [width, setWidth] = useState(window.innerWidth);
    const IsPromExp = localStorage.getItem('expireUser')



    return (
        <>

            {contextHolder}
            <div>
                <div className={Style.MainHeader}>
                    <div className={Style.HeaderWrapper}>
                        <img src={HeaderLogo} alt="logo" />
                        <div className={Style.WorkSiteDrop}>
                            <div className={Style.HamBB}>
                                <button onClick={showDrawer}>
                                    <GiHamburgerMenu size={22} />
                                </button>
                            </div>

                            <Drawer
                                placement={'left'}
                                closable={false}
                                onClose={onClose}
                                open={open}
                                width={250}
                                height={'100%'}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                                className="side-bar-class"
                            >
                                <div style={{ height: 130, background: '#214CBC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={StackedImage} height={85} />
                                </div>
                                {userRole !== null && userRole !== undefined &&
                                    <Tooltip placement="right" title={"Dashboard"}>
                                        <div
                                            onClick={() => (window.location.href = "/")} className={Style.NavigationIcon}
                                        >
                                            Dashboard
                                        </div>
                                    </Tooltip>}
                                {SideBar.filter(data => {
                                    if (userRole === "6768f37ff2ef345b103370df") {
                                        return data.id !== 6 && data.id !== 7 && data.id !== 3;
                                    }
                                    else if (userRole == null) {
                                        return false
                                    }
                                    return true;
                                })
                                    .map(data => {
                                        if (!data.access) return null;
                                        else {
                                            return (
                                                <div
                                                    onClick={() => {
                                                        if (data.workSiteRequire) {
                                                            if (WorkSite !== null) {
                                                                navigate(data.link);
                                                                setOpen(false)
                                                            } else {
                                                                showWorkSiteMessage();
                                                                setOpen(false)
                                                            }
                                                        } else {
                                                            setOpen(false)
                                                            navigate(data.link);
                                                        }
                                                    }}
                                                    className={Style.NavigationIcon}
                                                >
                                                    {data.name}
                                                </div>
                                            );

                                        }
                                    })
                                }
                                {userRole !== null && userRole !== undefined &&
                                    <Tooltip placement="right" title={"Logout"}>
                                        <div
                                            onClick={logOut}
                                            className={Style.NavigationIcon}
                                        >
                                            Logout
                                        </div>
                                    </Tooltip>
                                }
                            </Drawer>



                            {userRole !== "6768f37ff2ef345b103370df" &&
                                <Select
                                    className="headerSelect"
                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                    style={{ height: 40, width: 200 }}
                                    placeholder="Select Worksite"
                                    options={!WorkOrderReducer?.workSiteLoading && WorkSiteData}
                                    value={!WorkOrderReducer?.workSiteLoading && WorkSite}
                                    onChange={(e) => selectWorkSite(e)}
                                    loading={WorkOrderReducer?.workSiteLoading}
                                    disabled={WorkOrderReducer?.workSiteLoading}
                                />
                            }
                            {WorkSite !== null &&
                                <div onClick={() => showModal()} className={Style.SearchIcon}>
                                    <IoSearchOutline size={18} color="#747474" />
                                </div>
                            }
                            <AdvanceSearch advanceModalSearchModal={advanceModalSearchModal} handleCancel={handleCancel} />
                            <div className={Style.DropDown}>
                                {/* {WorkSite !== null &&
                                    <div className={Style.SearchIcon}>
                                        <IoSearchOutline size={24} color="#000000ff" />
                                    </div>
                                } */}

                                <Dropdown trigger={['click']} menu={{ items }}>
                                    <div className={Style.ProfileIcon}>
                                        <h6>
                                            {UserName?.split(" ")[0]?.charAt(0, 0)}
                                            {UserName?.split(" ")[1]?.charAt(0, 0) !== undefined ? UserName?.split(" ")[1]?.charAt(0, 0) : null}
                                        </h6>
                                    </div>
                                </Dropdown>
                                {/* <Dropdown trigger={['click']} menu={{ items }} placement="bottomLeft">
                                    <div className={Style.UserProfileSide}>
                                        <div className={Style.UserPfp}>
                                            {UserName?.split(" ")[0]?.charAt(0, 0)}
                                            {UserName?.split(" ")[1]?.charAt(0, 0) !== undefined ? UserName?.split(" ")[1]?.charAt(0, 0) : null}
                                        </div>
                                        <p>{UserName !== null ? UserName : ""}</p>
                                    </div>
                                </Dropdown> */}
                            </div>
                        </div>
                    </div>
                </div >
                {IsPromExp &&
                    <div className={Style.WarningHeader}>
                        <div>
                            <h6>Your License Has Expired</h6>
                            <p>Access to your data is temporarily restricted. To continue viewing and managing your worksite records, please renew your plan.</p>
                        </div>
                        <button onClick={() => navigate('/company')}>Renew License</button>
                    </div>
                }
            </div>
        </>

    )
}

function mapStateToProps({ WorkOrderReducer }) {
    return { WorkOrderReducer };
}
export default connect(mapStateToProps, WorkOrderAction)(Header);
