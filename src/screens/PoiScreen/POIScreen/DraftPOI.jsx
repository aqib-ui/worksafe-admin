import { useCallback, useEffect, useState } from 'react'
import Style from './workOrderScreen.module.css'
import { Col, DatePicker, Drawer, Dropdown, Grid, Input, message, Row, Select, Space, Spin, Switch, Table, Tag, TimePicker, Tooltip } from 'antd'
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdChevronRight, MdOutlineSettings } from 'react-icons/md';
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago'
import { FaCheck } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useNavigate } from 'react-router';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBin7Line } from 'react-icons/ri';
import blueDoc from '../../../assets/blue-Doc.png'
import ListInputSearch from '../../../component/ListInputSearch';
import blueDocSearch from '../../../assets/search-normal-blue.png'


dayjs.extend(utc);



function DraftPOI() {
    const [messageApi, contextHolder] = message.useMessage();

    const viewWorkOrder = (idToRemove) => {
        const localStoreKey = "A7@M!xK9P_2#RZ+vL8dQ*t=="
        const savedForms = JSON.parse(localStorage.getItem('A7@MD!xKRP_2#RZ+AL8FT*t==2')) || [];
        const updatedForms = savedForms.find(form => form._id == idToRemove);
        localStorage.setItem(localStoreKey, JSON.stringify({ ...updatedForms, isDraft: true }))
        window.location.reload()
        window.location.href = '/POI/create';
    }


    const columns = [
        {
            title: "POI Title",
            dataIndex: "Title",
            key: "Title",
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
            dataIndex: "threatLevel",
            key: "threatLevel",
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
            dataIndex: "elevation",
            key: "elevation",
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
            title: "Drafted On",
            key: "createAt",
            width: 200,
            ellipsis: true,
            render: (users) => (
                <Space direction="vertical">
                    <p>{users?.draftedAt?.split("T")[0] ?? "0"}</p>
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
    const [priority, setPriority] = useState([])
    const [cpc, setCpc] = useState([])

    const [searchQuery, setSearchQuery] = useState('');
    const [savedForms, setSavedForms] = useState([]);


    useEffect(() => {
        const rawSavedForms = localStorage.getItem('A7@MD!xKRP_2#RZ+AL8FT*t==2');

        try {
            const parsed = JSON.parse(rawSavedForms);
            const data = Array.isArray(parsed) ? parsed : [];

            const hasSearch = !!searchQuery;
            const hasPriority = priority.length > 0;
            const hasCpc = cpc.length > 0;

            const filteredData = data.filter(item => {
                const matchSearch =
                    !hasSearch ||
                    item?.Title?.toLowerCase().includes(searchQuery.toLowerCase());

                const matchPriority =
                    !hasPriority || priority.includes(item?.threatLevel);

                const matchCpc =
                    !hasCpc ||
                    item?.elevation?.some(c => cpc.includes(c));

                return matchSearch && matchPriority && matchCpc;
            });

            setSavedForms(filteredData);
        } catch {
            setSavedForms([]);
        }
    }, [searchQuery, priority, cpc]);



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
                    locale={{
                        emptyText: (
                            <div className={Style.EmptyTextTable}>
                                <img src={searchQuery !== "" ? blueDocSearch : blueDoc} alt="blue-doc" />
                                <h4>{searchQuery !== "" ? "No Search Result Found" : "No Drafts Saved Yet"}</h4>
                                {searchQuery !== "" ?
                                    <p>Try adjusting your search or use different keywords to find Points of<br /> Interest within your worksite.</p>
                                    :
                                    <p>Start creating a POI and save it as a draft to finish later. Drafts let you prepare<br /> critical zone data even when you're not ready to publish.</p>
                                }
                            </div>
                        )
                    }}
                    pagination={false} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={savedForms || []} />
            </div>
        </>
    )
}

function mapStateToProps({ WorkOrderReducer }) {
    return { WorkOrderReducer };
}
export default connect(mapStateToProps, WorkOrderAction)(DraftPOI);
