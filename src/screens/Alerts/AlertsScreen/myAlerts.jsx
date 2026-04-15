import { useEffect, useState } from 'react'
import Style from './AlertsScreen.module.css'
import { Col, Dropdown, Grid, message, Row, Select, Space, Table, Tag } from 'antd'
import * as AlertAction from '../../../../store/actions/Alerts/index';
import { connect, useDispatch } from 'react-redux';
import { MdOutlineSettings } from 'react-icons/md';
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago';
import { IoCheckmark, IoClose, IoEyeOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useNavigate, useOutletContext } from 'react-router';
import { TASK_CLEAR_EXPIRED, TASK_GET_ALERTS_COMPLETE, TASK_GET_ARCHIVED_ALERTS_COMPLETE } from '../../../../store/actions/types';
import ListInputSearch from '../../../component/ListInputSearch';
import blueDoc from '../../../assets/map-POI.png'
import blueDocSearch from '../../../assets/search-normal-blue.png'
import { MdChevronRight } from "react-icons/md";
import clockYellow from "../../../assets/clock-yellow.png"
import tickCircle from "../../../assets/tick-circle.png"
import closeCircle from "../../../assets/close-circle.png"



function MyProject({ AlertsReducer, GetAlerts, ArchiveAlerts }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [page, setPage] = useState(1)
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    // const { searchQuery } = useOutletContext();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState("")

    const [priority, setPriority] = useState([])
    const [cpc, setCpc] = useState([])


    const [isNext, setIsNext] = useState(true)
    useEffect(() => {
        const init = async () => {
            const totalLegngth = await GetAlerts(workSite, page, searchQuery, priority)
            if (totalLegngth < 30) {
                setIsNext(false)
            }
        }
        init()
    }, [page, searchQuery, priority])

    useEffect(() => {
        if (!messageApi) return;
        if (AlertsReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (AlertsReducer.projectExpiredError) {
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
        if (AlertsReducer.alertDeleteLoading) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Loading...",
            });
        }
        if (AlertsReducer.alertDelete) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Alert archived successfully",
            });
            dispatch({ type: TASK_GET_ARCHIVED_ALERTS_COMPLETE, loading: true, payload: [] });
            dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: true, payload: [] });
            GetAlerts(workSite, page, searchQuery)

        }
    }, [
        AlertsReducer.networkError,
        AlertsReducer.projectExpiredError,
        AlertsReducer.alertDelete,
        AlertsReducer.alertDeleteLoading,
        messageApi,
    ]);


    const viewWorkOrder = (eId) => {
        localStorage.setItem("Pf_!9DqZ@+76MaL#CYxv3tr", eId)
        window.location.reload()
        window.location.href = '/alerts/read';
    }

    const columns = [
        {
            title: "Alerts Title",
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
            render: (text, record) => {
                return (
                    <Tag style={{ color: text == "No Threat" ? "#1C8F5D" : text == "Lowest" ? "#333839" : text == "Moderate" ? '#C9A240' : text == "High" ? '#C94040' : text == "Extreme" ? '#792727' : null }} color={text == "No Threat" ? "#4DF15E14" : text == "Lowest" ? "#D8DFE0" : text == "Moderate" ? '#F1C34D14' : text == "High" ? '#F14D4D14' : text == "Extreme" ? '#501A1A14' : null}>
                        {text === "No Threat" ? "No Risk" : text === "Lowest" ? "Lowest Risk" : text === "Moderate" ? "Moderate Risk" : text === "High" ? "High Risk" : text === "Extreme" ? "Extreme Risk" : text}
                    </Tag>
                )
            },
        },
        {
            title: "Created At",
            key: "createAt",
            width: 200,
            ellipsis: true,
            render: (users) => (
                // <Space direction="vertical">
                //     <ReactTimeAgo date={users?.createdAt} locale="en-US" />
                // </Space>
                <Space direction="vertical">
                    <p>{users?.createdAt?.split("T")[0] ?? "0"}</p>
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

    const sortedData = [...AlertsReducer?.alertData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


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
                    <Col xxl={20} xl={20} lg={20} md={24} sm={24} xs={24}>
                        <div className={Style.Splitter}>
                            <div className={Style.layersInput}>
                                <ListInputSearch onChange={(e) => setSearchQuery(e)} placeholder="Search Alert" />
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

                </Row>
            </div>
            <div className={Style.TableSection}>
                <Table
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    }
                    footer={() => (
                        <>
                            {AlertsReducer?.alertData.length > 0 && !AlertsReducer?.alertLoading &&
                                <>
                                    {isNext &&
                                        <div style={{ textAlign: "center", padding: "0 0" }}>
                                            <button
                                                onClick={() => setPage(prev => prev + 1)}
                                                disabled={AlertsReducer?.alertLoading}
                                                style={{
                                                    border: "1px solid #1890ff",
                                                    background: "#1890ff",
                                                    color: "white",
                                                    padding: "6px 16px",
                                                    borderRadius: "4px",
                                                    cursor: AlertsReducer?.alertLoading ? "not-allowed" : "pointer",
                                                }}
                                            >
                                                {AlertsReducer?.alertLoading ? "Loading..." : "Load More"}
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
                                <h4>{searchQuery !== "" ? "No Search Result Found" : "No Alert Created Yet"}</h4>
                                {searchQuery !== "" ?
                                    <p>Try adjusting your search or use different keywords to find Alert<br /> within your worksite.</p>
                                    :
                                    <p>Start by adding your Alert to mark critical zones, assign safety<br /> tasks, and track risk areas within your worksite.</p>
                                }
                            </div>
                        )
                    }}
                    pagination={false} loading={AlertsReducer?.alertLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
            </div>
        </>
    )
}

function mapStateToProps({ AlertsReducer }) {
    return { AlertsReducer };
}
export default connect(mapStateToProps, AlertAction)(MyProject);
