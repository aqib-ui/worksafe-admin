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
import blueDoc from '../../../assets/dashboard-4.png'
import blueDocSearch from '../../../assets/search-normal-blue.png'
import { MdChevronRight } from "react-icons/md";
import clockYellow from "../../../assets/clock-yellow.png"
import tickCircle from "../../../assets/tick-circle.png"
import closeCircle from "../../../assets/close-circle.png"
import AlertFilter from './alertFilter';



function MyProject({ AlertsReducer, GetAlerts, ArchiveAlerts }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [page, setPage] = useState(1)
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    // const { searchQuery } = useOutletContext();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState("")
    const [paramsNew, setParamsNew] = useState(null)



    const [isNext, setIsNext] = useState(true)
    useEffect(() => {
        const init = async () => {
            console.log(paramsNew, 'paramsNew')
            const totalLegngth = await GetAlerts(workSite, page, searchQuery, paramsNew && paramsNew, setIsNext)
        }
        init()
    }, [page, searchQuery])

    console.log(isNext, 'a;sdklskadklsakdlksa')

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
            runAgain()
        }
    }, [
        AlertsReducer.networkError,
        AlertsReducer.projectExpiredError,
        AlertsReducer.alertDelete,
        AlertsReducer.alertDeleteLoading,
        messageApi,
    ]);

    const runAgain = async () => {
        const totalLegngth = await GetAlerts(workSite, page, searchQuery, paramsNew && paramsNew, setIsNext)
    }

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
                    <Tag className='AlertTag' style={{ color: text == "No Threat" ? "#666d80" : text == "Lowest" ? "#17736E" : text == "Moderate" ? '#926E26' : text == "High" ? '#D32029' : text == "Extreme" ? '#7F1319' : null }} color={text == "No Threat" ? "rgba(102, 109, 128,0.1)" : text == "Lowest" ? "rgba(23, 115, 110,0.1)" : text == "Moderate" ? 'rgba(146, 110, 38,0.1)' : text == "High" ? 'rgba(211, 32, 41,0.1)' : text == "Extreme" ? 'rgba(127, 19, 25,0.1)' : null}>
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
                <Space direction="vertical">
                    <ReactTimeAgo date={users?.createdAt} locale="en-US" />
                </Space>
            ),
        },
        {
            title: "Updated At",
            key: "updatedAt",
            width: 200,
            ellipsis: true,
            render: (users) => (
                <Space direction="vertical">
                    <ReactTimeAgo locale="en-US" timeStyle="round-minute" date={users?.updatedAt} locale="en-US" />
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
                {/* <Row gutter={gutter} align="middle" justify="space-between">
                    <Col xxl={16} xl={16} lg={16} md={24} sm={24} xs={24}>
                        <div className={Style.Splitter}>
                            <div className={Style.layersInput}>
                                <ListInputSearch onChange={(e) => setSearchQuery(e)} placeholder="Search Alert" />
                            </div>
                        </div>
                    </Col>

                    <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
                        <Select
                            getPopupContainer={(node) => node.parentElement}
                            placeholder="All Risk Level"
                            style={{ width: '100%' }}
                            options={threatLevelOption}
                            mode='multiple'
                            onChange={(e) => setPriority(e)}
                        />
                    </Col>
                </Row> */}
                <Row gutter={gutter} align="middle" justify="space-between">
                    <Col xxl={22} xl={22} lg={22} md={22} sm={22} xs={22}>
                        <div className={Style.Splitter}>
                            <div className={Style.layersInput}>
                                <ListInputSearch onChange={(e) => setSearchQuery(e)} placeholder="Search Alert" />
                            </div>
                        </div>
                    </Col>

                    <Col xxl={2} xl={2} lg={2} md={2} sm={2} xs={2}>
                        <AlertFilter setPage={setPage} setIsNext={setIsNext} setParamsNew={setParamsNew} loading={AlertsReducer?.alertLoading} GetPOI={GetAlerts} workSite={workSite} page={page} searchQuery={searchQuery} />
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
                                <img src={searchQuery !== "" || paramsNew !== null ? blueDocSearch : blueDoc} alt="blue-doc" />
                                <h4>{searchQuery !== "" || paramsNew !== null ? "No Search Result Found" : "No Alert Created Yet"}</h4>
                                {searchQuery !== "" || paramsNew !== null ?
                                    <p>Try adjusting your search or use different keywords to find Alert<br /> within your worksite.</p>
                                    :
                                    <p>Start by adding your Alert to mark critical zones, assign safety<br /> tasks, and track risk areas within your worksite.</p>
                                }
                            </div>
                        )
                    }}
                    pagination={false} loading={AlertsReducer?.alertLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={AlertsReducer?.alertData} />
            </div>
        </>
    )
}

function mapStateToProps({ AlertsReducer }) {
    return { AlertsReducer };
}
export default connect(mapStateToProps, AlertAction)(MyProject);
