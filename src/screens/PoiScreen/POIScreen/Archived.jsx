// import { useEffect, useState } from 'react'
// import Style from './workOrderScreen.module.css'
// import { Dropdown, message, Space, Table, Tag, } from 'antd'
// import * as POIAction from '../../../../store/actions/Poi/index';
// import { connect, useDispatch } from 'react-redux';
// import { MdOutlineSettings } from 'react-icons/md';
// import ReactTimeAgo from 'react-time-ago';
// import { IoEyeOutline } from 'react-icons/io5';
// import { useNavigate, useOutletContext } from 'react-router';
// import { TASK_CLEAR_EXPIRED } from '../../../../store/actions/types';



// function MyPOIScreen({ PoiReducer, GetArchivedPOI, GetWorkSite, GetAdminWorkSite }) {
//     const [messageApi, contextHolder] = message.useMessage();
//     const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
//     const { searchQuery } = useOutletContext();


//     const [page, setPage] = useState(1)
//     const viewWorkOrder = (eId) => {
//         localStorage.setItem("Zk2@pHL5uy!6mW+L9/=2&y==", eId)
//         window.location.reload()
//         window.location.href = '/POI/read';
//     }
//     const dispatch = useDispatch()
//     const navigate = useNavigate();

//     const Role_ID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')



//     const [isNext, setIsNext] = useState(true)
//     useEffect(() => {
//         const loadWorkSite = localStorage.getItem('+AOQ^%^f0Gn4frTqztZadLrKg==')
//         const init = async () => {
//             const totalLegngth = await GetArchivedPOI(workSite, page, searchQuery)
//             if (totalLegngth < 30) {
//                 setIsNext(false)
//                 if (Role_ID == '6768f37ff2ef345b103370df') {
//                     GetAdminWorkSite()
//                 }
//                 else {
//                     GetWorkSite()
//                 }
//             }
//             else {
//                 setIsNext(true)
//                 if (Role_ID == '6768f37ff2ef345b103370df') {
//                     GetAdminWorkSite()
//                 }
//                 else {
//                     GetWorkSite()
//                 }
//             }
//         }
//         if (loadWorkSite) {
//             init()
//         }

//     }, [page, searchQuery])

//     useEffect(() => {
//         if (!messageApi) return;
//         if (PoiReducer.networkError) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "error",
//                 content: "Something went wrong, please try again",
//             });
//         }
//         if (PoiReducer.poiExpiredError) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "info",
//                 content: "Payment Expired",
//             });
//             const timeoutNavigate = setTimeout(() => {
//                 navigate('/')
//             }, 1000);
//             return () => {
//                 dispatch({ type: TASK_CLEAR_EXPIRED });
//                 clearTimeout(timeoutNavigate)
//             }
//         }
//     }, [
//         PoiReducer.networkError,
//         PoiReducer.poiExpiredError,
//         messageApi,
//     ]);



//     const columns = [
//         {
//             title: "POI Title",
//             dataIndex: "title",
//             key: "title",
//             ellipsis: true,
//             width: 200,
//             render: (text, record) => {
//                 return (
//                     <div onClick={() => viewWorkOrder(record?._id)} style={{
//                         cursor: 'pointer',
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         width: 200
//                     }}>{text}</div>
//                 )
//             },
//         },
//         {
//             title: "Risk Level",
//             dataIndex: "riskLevel",
//             key: "riskLevel",
//             width: 100,
//             ellipsis: true,
//             render: (text, record) => {
//                 return (
//                     <Tag color={text == "Moderate" ? "orange" : text == "No Threat" ? "green" : text == "High" ? 'red' : text == "Lowest" ? 'yellow' : null}>
//                         {text === "No Threat" ? "No Risk" : text === "Lowest" ? "Lowest Risk" : text === "Moderate" ? "Moderate Risk" : text === "High" ? "High Risk" : text === "Extreme" ? "Extreme Risk" : text}
//                     </Tag>
//                 )
//             },
//         },

//         {
//             title: "Created At",
//             key: "createAt",
//             width: 200,
//             ellipsis: true,
//             render: (users) => (
//                 <Space direction="vertical">
//                     <ReactTimeAgo date={users?.createdAt} locale="en-US" />
//                 </Space>
//             ),
//         },
//         {
//             title: "Action",
//             key: "action",
//             className: " space-x-2",
//             ellipsis: true,
//             width: 100,
//             render: (record) => {
//                 return (
//                     <>
//                         <Dropdown trigger={['click']} menu={{
//                             items: [
//                                 {
//                                     key: '3',
//                                     label: (
//                                         <div onClick={() => viewWorkOrder(record?._id)} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <IoEyeOutline size={18} style={{ marginRight: 5 }} /> View POI
//                                         </div>
//                                     ),
//                                 },
//                             ],
//                         }}>
//                             <MdOutlineSettings size={24} />
//                         </Dropdown>
//                     </>
//                 )
//             },
//         },
//     ];


//     const sortedData = [...PoiReducer?.poiArchivedData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


//     return (
//         <>
//             {contextHolder}
//             <div className={Style.TableSection}>
//                 <Table footer={() => (
//                     <>
//                         {PoiReducer?.poiArchivedData.length > 0 && !PoiReducer?.poiArchivedLoading &&
//                             <>
//                                 {isNext &&
//                                     <div style={{ textAlign: "center", padding: "0 0" }}>
//                                         <button
//                                             onClick={() => setPage(prev => prev + 1)}
//                                             disabled={PoiReducer?.poiArchivedLoading}
//                                             style={{
//                                                 border: "1px solid #1890ff",
//                                                 background: "#1890ff",
//                                                 color: "white",
//                                                 padding: "6px 16px",
//                                                 borderRadius: "4px",
//                                                 cursor: PoiReducer?.poiArchivedLoading ? "not-allowed" : "pointer",
//                                             }}
//                                         >
//                                             {PoiReducer?.poiArchivedLoading ? "Loading..." : "Load More"}
//                                         </button>
//                                     </div>
//                                 }
//                             </>
//                         }
//                     </>
//                 )} pagination={false} loading={PoiReducer?.poiArchivedLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
//             </div>
//         </>
//     )
// }

// function mapStateToProps({ PoiReducer }) {
//     return { PoiReducer };
// }
// export default connect(mapStateToProps, POIAction)(MyPOIScreen);










import { useEffect, useState } from 'react'
import Style from './workOrderScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Input, message, Select, Space, Spin, Switch, Table, Tag, TimePicker, Tooltip, Upload, Col, Row, Grid, Empty } from 'antd'
import * as POIAction from '../../../../store/actions/Poi/index';
import { connect, useDispatch } from 'react-redux';
import { MdOutlineSettings } from 'react-icons/md';
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago';
import { IoCheckmark, IoClose, IoEyeOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useNavigate, useOutletContext } from 'react-router';
import { TASK_CLEAR_EXPIRED, TASK_GET_POI_ARCHIVED_COMPLETE, TASK_GET_POI_COMPLETE } from '../../../../store/actions/types';
import ListInputSearch from '../../../component/ListInputSearch';
import blueDoc from '../../../assets/blue-Doc.png'
import { MdChevronRight } from "react-icons/md";
import clockYellow from "../../../assets/clock-yellow.png"
import tickCircle from "../../../assets/tick-circle.png"
import closeCircle from "../../../assets/close-circle.png"
import blueDocSearch from '../../../assets/search-normal-blue.png'

function ArchivedPOI({ PermissionReducer, PoiReducer, GetArchivedPOI, PoiArchived, GetWorkSite, GetAdminWorkSite }) {
    const dateFormat = 'YYYY-MM-DD hh:mm A';
    const [messageApi, contextHolder] = message.useMessage();
    const worksite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")

    const AllContentPermission = PermissionReducer?.allPermission?.data?.role_id?.permissions || []
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [page, setPage] = useState(1)
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const [isNext, setIsNext] = useState(true)

    const [searchQuery, setSearchQuery] = useState("")
    const [priority, setPriority] = useState([])
    const [cpc, setCpc] = useState([])

    const Role_ID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')



    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            const loadWorkSite = localStorage.getItem('+AOQ^%^f0Gn4frTqztZadLrKg==');
            if (!loadWorkSite) return;
            const totalLength = await GetArchivedPOI(workSite, page, searchQuery, priority, cpc);
            if (!isMounted) return;
            setIsNext(totalLength >= 30);
            if (Role_ID === '6768f37ff2ef345b103370df') {
                GetAdminWorkSite();
            } else {
                GetWorkSite();
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [page, searchQuery, workSite, Role_ID, priority, cpc]);

    useEffect(() => {
        if (!messageApi) return;
        if (PoiReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (PoiReducer.poiArchivedDeleteLoading) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Loading...",
            });
        }
        if (PoiReducer.poiArchived) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "POI archived successfully",
            });
            dispatch({ type: TASK_GET_POI_ARCHIVED_COMPLETE, loading: true, payload: [] });
            dispatch({ type: TASK_GET_POI_COMPLETE, loading: true, payload: [] });
            GetArchivedPOI(workSite, page, searchQuery)
        }
        if (PoiReducer.poiExpiredError) {
            messageApi.destroy();
            messageApi.open({
                type: "info",
                content: "Payment Expired",
            });
            const timeoutNavigate = setTimeout(() => {
                navigate('/')
            }, 1000);
            return () => {
                dispatch({ type: TASK_CLEAR_EXPIRED });
                clearTimeout(timeoutNavigate)
            }
        }
    }, [
        PoiReducer.networkError,
        PoiReducer.poiExpiredError,
        PoiReducer.poiArchivedDeleteLoading,
        PoiReducer.poiArchived,
        messageApi,
    ]);



    const viewWorkOrder = (eId) => {
        localStorage.setItem("Zk2@pHL5uy!6mW+L9/=2&y==", eId)
        window.location.reload()
        window.location.href = '/POI/read';
    }


    const columns = [
        {
            title: "POI Title",
            dataIndex: "title",
            key: "title",
            ellipsis: true,
            width: 200,
            render: (text, record) => {
                return (
                    <div onClick={() => viewWorkOrder(record?._id)} style={{
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: 200
                    }}>{text}</div>
                )
            },
        },
        {
            title: "Risk Level",
            dataIndex: "riskLevel",
            key: "riskLevel",
            width: 100,
            ellipsis: true,
            render: (text) => {
                return (
                    <Tag style={{ color: text == "No Threat" ? "#1C8F5D" : text == "Lowest" ? "#333839" : text == "Moderate" ? '#C9A240' : text == "High" ? '#C94040' : text == "Extreme" ? '#792727' : null }} color={text == "No Threat" ? "#4DF15E14" : text == "Lowest" ? "#D8DFE0" : text == "Moderate" ? '#F1C34D14' : text == "High" ? '#F14D4D14' : text == "Extreme" ? '#501A1A14' : null}>
                        {text === "No Threat" ? "No Risk" : text === "Lowest" ? "Lowest Risk" : text === "Moderate" ? "Moderate Risk" : text === "High" ? "High Risk" : text === "Extreme" ? "Extreme Risk" : text}
                    </Tag>
                )
            },
        },

        {
            title: "Elevation Level",
            dataIndex: "elevationLevels",
            key: "elevationLevels",
            width: 100,
            ellipsis: true,
            render: (text) => {
                return (
                    <>
                        {Array.isArray(text) ? text.map(data =>
                            <Tag style={{ padding: '4px 8px', color: "#214CBC", borderRadius: 4 }} color={"#DBE5FF"}>
                                {data}
                            </Tag>
                        ) : ""}
                    </>
                )
            },
        },
        {
            title: "Created On",
            key: "createAt",
            width: 200,
            ellipsis: true,
            render: (users) => (
                <Space direction="vertical">
                    <p>{users?.createdAt.split("T")[0] ?? "0"}</p>
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            className: " space-x-2",
            ellipsis: true,
            width: 100,
            render: (record) => {
                return (
                    <>
                        <div style={{ padding: '10px', height: '40px', width: '40px', cursor: 'pointer' }} onClick={() => viewWorkOrder(record?._id)} >
                            <MdChevronRight size={24} />
                        </div>
                    </>
                )
            },
        },
    ];

    const sortedData = [...PoiReducer?.poiArchivedData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const gutter = screens.xxl
        ? [12, 12]
        : screens.xl
            ? [12, 12]
            : screens.lg
                ? [8, 8]
                : screens.md
                    ? [4, 4]
                    : [4, 4];





    const CpcOption = [
        { value: "Ground Level", label: "Ground Level" },
        { value: "Below Ground", label: "Below Ground" },
        { value: "Overhead", label: "Overhead" },
    ]

    const threatLevelOption = [
        { label: "No Risk", value: "No Threat" },
        { label: "Lowest Risk", value: "Lowest" },
        { label: "Moderate Risk", value: "Moderate" },
        { label: "High Risk", value: "High" },
        { label: "Extreme Risk", value: "Extreme" }
    ]

    return (
        <>
            {contextHolder}
            <div className={Style.filterSection}>
                <Row gutter={gutter} align="middle" justify="space-between">
                    <Col xxl={16} xl={16} lg={16} md={24} sm={24} xs={24}>
                        <div className={Style.Splitter}>
                            <div className={Style.layersInput}>
                                <ListInputSearch onChange={(e) => setSearchQuery(e)} placeholder="Search POI" />
                            </div>
                        </div>
                    </Col>

                    <Col xxl={4} xl={4} lg={4} md={24} sm={24} xs={24}>
                        <Select
                            getPopupContainer={(node) => node.parentElement}
                            placeholder="All Risk Level"
                            style={{ width: '100%' }}
                            options={threatLevelOption}
                            mode='multiple'
                            onChange={(e) => setPriority(e)}
                        />
                    </Col>

                    <Col xxl={4} xl={4} lg={4} md={24} sm={24} xs={24}>
                        <Select
                            getPopupContainer={(node) => node.parentElement}
                            placeholder="All Elevation Level"
                            style={{ width: '100%' }}
                            options={CpcOption}
                            mode='multiple'
                            onChange={(e) => setCpc(e)}
                        />
                    </Col>
                </Row>
            </div>

            <div className={Style.TableSection}>
                <Table
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    }
                    footer={() => (
                        <>
                            {PoiReducer?.poiArchivedData.length > 0 && !PoiReducer?.poiArchivedLoading &&
                                <>
                                    {isNext &&
                                        <div style={{ textAlign: "center", padding: "0 0" }}>
                                            <button
                                                onClick={() => setPage(prev => prev + 1)}
                                                disabled={PoiReducer?.poiArchivedLoading}
                                                style={{
                                                    border: "1px solid #1890ff",
                                                    background: "#1890ff",
                                                    color: "white",
                                                    padding: "6px 16px",
                                                    borderRadius: "4px",
                                                    cursor: PoiReducer?.poiArchivedLoading ? "not-allowed" : "pointer",
                                                }}
                                            >
                                                {PoiReducer?.poiArchivedLoading ? "Loading..." : "Load More"}
                                            </button>
                                        </div>
                                    }
                                </>
                            }
                        </>
                    )}
                    locale={{
                        emptyText: (
                            <div className={Style.EmptyTextTable}>
                                <img src={searchQuery !== "" ? blueDocSearch : blueDoc} alt="blue-doc" />
                                <h4>{searchQuery !== "" ? "No Search Result Found" : "No POIs Archived Yet"}</h4>
                                {searchQuery !== "" ?
                                    <p>Try adjusting your search or use different keywords to find Points of<br /> Interest within your worksite.</p>
                                    :
                                    <p>Start by Archiving your Point of Interest to mark critical zones, assign safety<br /> tasks, and track risk areas within your worksite.</p>
                                }
                            </div>
                        )
                    }}
                    pagination={false} loading={PoiReducer?.poiArchivedLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
            </div>
        </>
    )
}

function mapStateToProps({ PoiReducer }) {
    return { PoiReducer };
}
export default connect(mapStateToProps, POIAction)(ArchivedPOI);
