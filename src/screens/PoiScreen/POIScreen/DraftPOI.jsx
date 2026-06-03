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
import blueDoc from '../../../assets/dashboard-3.png'
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
                    <Tag  className='AlertTag' style={{ color:text == "No Threat" ? "#666d80" : text == "Lowest" ? "#17736E" : text == "Moderate" ? '#926E26' : text == "High" ? '#D32029' : text == "Extreme" ? '#7F1319' : null }} color={text == "No Threat" ? "rgba(102, 109, 128,0.1)" : text == "Lowest" ? "rgba(23, 115, 110,0.1)" : text == "Moderate" ? 'rgba(146, 110, 38,0.1)' : text == "High" ? 'rgba(211, 32, 41,0.1)' : text == "Extreme" ? 'rgba(127, 19, 25,0.1)' : null}>
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
                    <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div className={Style.Splitter}>
                            <div className={Style.layersInput}>
                                <ListInputSearch onChange={(e) => setSearchQuery(e)} placeholder="Search POI" />
                            </div>
                        </div>
                    </Col>
{/* 
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
                    </Col> */}
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





























































































































































































































// import { useCallback, useEffect, useState } from 'react'
// import Style from './workOrderScreen.module.css'
// import { Col, DatePicker, Drawer, Dropdown, Grid, Input, message, Row, Select, Space, Spin, Switch, Table, Tag, TimePicker, Tooltip } from 'antd'
// import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
// import { connect, useDispatch } from 'react-redux';
// import * as yup from 'yup';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { MdChevronRight, MdOutlineSettings } from 'react-icons/md';
// import { MdOutlineModeEditOutline } from "react-icons/md";
// import ReactTimeAgo from 'react-time-ago'
// import { FaCheck } from "react-icons/fa6";
// import { AiOutlineDelete } from "react-icons/ai";
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import { useNavigate } from 'react-router';
// import { IoEyeOutline } from 'react-icons/io5';
// import { RiDeleteBin7Line } from 'react-icons/ri';
// import blueDoc from '../../../assets/dashboard-3.png'
// import ListInputSearch from '../../../component/ListInputSearch';
// import blueDocSearch from '../../../assets/search-normal-blue.png'
// import PoiFilter from './poiFilter';


// dayjs.extend(utc);



// function DraftPOI() {
//     const [messageApi, contextHolder] = message.useMessage();

//     const viewWorkOrder = (idToRemove) => {
//         const localStoreKey = "A7@M!xK9P_2#RZ+vL8dQ*t=="
//         const savedForms = JSON.parse(localStorage.getItem('A7@MD!xKRP_2#RZ+AL8FT*t==2')) || [];
//         const updatedForms = savedForms.find(form => form._id == idToRemove);
//         localStorage.setItem(localStoreKey, JSON.stringify({ ...updatedForms, isDraft: true }))
//         window.location.reload()
//         window.location.href = '/POI/create';
//     }


//     const columns = [
//         {
//             title: "POI Title",
//             dataIndex: "Title",
//             key: "Title",
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
//             dataIndex: "threatLevel",
//             key: "threatLevel",
//             width: 100,
//             ellipsis: true,
//             render: (text) => {
//                 return (
//                     <Tag className='AlertTag' style={{ color: text == "No Threat" ? "#666d80" : text == "Lowest" ? "#17736E" : text == "Moderate" ? '#926E26' : text == "High" ? '#D32029' : text == "Extreme" ? '#7F1319' : null }} color={text == "No Threat" ? "rgba(102, 109, 128,0.1)" : text == "Lowest" ? "rgba(23, 115, 110,0.1)" : text == "Moderate" ? 'rgba(146, 110, 38,0.1)' : text == "High" ? 'rgba(211, 32, 41,0.1)' : text == "Extreme" ? 'rgba(127, 19, 25,0.1)' : null}>
//                         {text === "No Threat" ? "No Risk" : text === "Lowest" ? "Lowest Risk" : text === "Moderate" ? "Moderate Risk" : text === "High" ? "High Risk" : text === "Extreme" ? "Extreme Risk" : text}
//                     </Tag>
//                 )
//             },
//         },

//         {
//             title: "Elevation Level",
//             dataIndex: "elevation",
//             key: "elevation",
//             width: 100,
//             ellipsis: true,
//             render: (text) => {
//                 return (
//                     <>
//                         {Array.isArray(text) ? text.map(data =>
//                             <Tag style={{ padding: '4px 8px', color: "#214CBC", borderRadius: 4 }} color={"#DBE5FF"}>
//                                 {data}
//                             </Tag>
//                         ) : ""}
//                     </>
//                 )
//             },
//         },
//         {
//             title: "Drafted On",
//             key: "createAt",
//             width: 200,
//             ellipsis: true,
//             render: (users) => (
//                 <Space direction="vertical">
//                     <p>{users?.draftedAt?.split("T")[0] ?? "0"}</p>
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
//                         <div style={{ padding: '10px', height: '40px', width: '40px', cursor: 'pointer' }} onClick={() => viewWorkOrder(record?._id)} >
//                             <MdChevronRight size={24} />
//                         </div>
//                     </>
//                 )
//             },
//         },
//     ];
//     const [searchQuery, setSearchQuery] = useState('');
//     const [sideFilter, setSideFilter] = useState();
//     const [savedForms, setSavedForms] = useState([]);

//     const threatLevelMap = {
//         "No Threat": "No Risk",
//         "Lowest": "Lowest Risk",
//         "Moderate": "Moderate Risk",
//         "High": "High Risk",
//         "Extreme": "Extreme Risk",
//     };

//     const threatOrder = { "No Threat": 0, "Lowest": 1, "Moderate": 2, "High": 3, "Extreme": 4 };
//     const elevationOrder = { "below ground": 0, "ground level": 1, "overhead": 2 };

//     const haversineDistance = (lat1, lng1, lat2, lng2) => {
//         const R = 6371000;
//         const φ1 = (lat1 * Math.PI) / 180;
//         const φ2 = (lat2 * Math.PI) / 180;
//         const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//         const Δλ = ((lng2 - lng1) * Math.PI) / 180;
//         const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
//         return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     };

//     useEffect(() => {
//         const rawSavedForms = localStorage.getItem('A7@MD!xKRP_2#RZ+AL8FT*t==2');

//         try {
//             const parsed = JSON.parse(rawSavedForms);
//             const data = Array.isArray(parsed) ? parsed : [];

//             const hasThreatFilter = sideFilter?.threatFilter?.length > 0;
//             const hasElevationFilter = sideFilter?.elevationFilter?.length > 0;
//             const hasPolygonType = sideFilter?.polygonType?.length > 0;
//             const hasLocation = !!(sideFilter?.location?.lat && sideFilter?.location?.lng);
//             const hasExtraData = !!sideFilter?.extraData?.name;

//             let filteredData = data.filter(item => {
//                 const matchSearch =
//                     !searchQuery ||
//                     item?.Title?.toLowerCase().includes(searchQuery.toLowerCase());

//                 const itemThreatDisplay = threatLevelMap[item?.threatLevel] ?? item?.threatLevel;
//                 const matchThreat =
//                     !hasThreatFilter ||
//                     sideFilter.threatFilter.includes(itemThreatDisplay);

//                 const matchElevation =
//                     !hasElevationFilter ||
//                     item?.elevation?.some(e =>
//                         sideFilter.elevationFilter.some(f => f.toLowerCase() === e.toLowerCase())
//                     );

//                 const matchPolygonType =
//                     !hasPolygonType ||
//                     sideFilter.polygonType.includes(item?.polygonType);

//                 let matchLocation = true;
//                 if (hasLocation && item?.location?.lat && item?.location?.lng) {
//                     const dist = haversineDistance(
//                         sideFilter.location.lat,
//                         sideFilter.location.lng,
//                         item.location.lat,
//                         item.location.lng
//                     );
//                     matchLocation = dist <= sideFilter.location.radius;
//                 }

//                 const matchExtraData =
//                     !hasExtraData ||
//                     item?.extraFields?.some(
//                         f =>
//                             f?.name?.toLowerCase() === sideFilter.extraData.name.toLowerCase() &&
//                             f?.type?.toLowerCase() === sideFilter.extraData.type.toLowerCase()
//                     );

//                 return matchSearch && matchThreat && matchElevation && matchPolygonType && matchLocation && matchExtraData;
//             });

//             if (sideFilter?.sortBy) {
//                 filteredData = [...filteredData].sort((a, b) => {
//                     switch (sideFilter.sortBy) {
//                         case 1:
//                             return new Date(b.draftedAt || 0) - new Date(a.draftedAt || 0);
//                         case 2:
//                             return new Date(b.updatedAt || b.draftedAt || 0) - new Date(a.updatedAt || a.draftedAt || 0);
//                         case 3:
//                             return (a.Title || '').localeCompare(b.Title || '');
//                         case 4:
//                             return (b.Title || '').localeCompare(a.Title || '');
//                         case 5:
//                             return (threatOrder[a.threatLevel] ?? 0) - (threatOrder[b.threatLevel] ?? 0);
//                         case 6:
//                             return (threatOrder[b.threatLevel] ?? 0) - (threatOrder[a.threatLevel] ?? 0);
//                         case 7: {
//                             const aMin = Math.min(...(a.elevation || []).map(e => elevationOrder[e?.toLowerCase()] ?? 99));
//                             const bMin = Math.min(...(b.elevation || []).map(e => elevationOrder[e?.toLowerCase()] ?? 99));
//                             return aMin - bMin;
//                         }
//                         case 8: {
//                             const aMax = Math.max(...(a.elevation || []).map(e => elevationOrder[e?.toLowerCase()] ?? -1));
//                             const bMax = Math.max(...(b.elevation || []).map(e => elevationOrder[e?.toLowerCase()] ?? -1));
//                             return bMax - aMax;
//                         }
//                         default:
//                             return 0;
//                     }
//                 });
//             }

//             setSavedForms(filteredData);
//         } catch {
//             setSavedForms([]);
//         }
//     }, [searchQuery, sideFilter]);



//     const { useBreakpoint } = Grid;
//     const screens = useBreakpoint();

//     const gutter = screens.xxl
//         ? [12, 12]
//         : screens.xl
//             ? [12, 12]
//             : screens.lg
//                 ? [8, 8]
//                 : screens.md
//                     ? [4, 4]
//                     : [4, 4];





//     const CpcOption = [
//         { value: "Ground Level", label: "Ground Level" },
//         { value: "Below Ground", label: "Below Ground" },
//         { value: "Overhead", label: "Overhead" },
//     ]

//     const threatLevelOption = [
//         { label: "No Risk", value: "No Threat" },
//         { label: "Lowest Risk", value: "Lowest" },
//         { label: "Moderate Risk", value: "Moderate" },
//         { label: "High Risk", value: "High" },
//         { label: "Extreme Risk", value: "Extreme" }
//     ]


//     return (
//         <>
//             {contextHolder}
//             <div className={Style.filterSection}>
//                 {/* <Row gutter={gutter} align="middle" justify="space-between">
//                     <Col xxl={16} xl={16} lg={16} md={24} sm={24} xs={24}>
//                         <div className={Style.Splitter}>
//                             <div className={Style.layersInput}>
//                                 <ListInputSearch onChange={(e) => setSearchQuery(e)} placeholder="Search POI" />
//                             </div>
//                         </div>
//                     </Col>

//                     <Col xxl={4} xl={4} lg={4} md={24} sm={24} xs={24}>
//                         <Select
//                             getPopupContainer={(node) => node.parentElement}
//                             placeholder="All Risk Level"
//                             style={{ width: '100%' }}
//                             options={threatLevelOption}
//                             mode='multiple'
//                             onChange={(e) => setPriority(e)}
//                         />
//                     </Col>

//                     <Col xxl={4} xl={4} lg={4} md={24} sm={24} xs={24}>
//                         <Select
//                             getPopupContainer={(node) => node.parentElement}
//                             placeholder="All Elevation Level"
//                             style={{ width: '100%' }}
//                             options={CpcOption}
//                             mode='multiple'
//                             onChange={(e) => setCpc(e)}
//                         />
//                     </Col>
//                 </Row> */}

//                 <Row gutter={gutter} align="middle" justify="space-between">
//                     <Col xxl={22} xl={22} lg={22} md={22} sm={22} xs={22}>
//                         <div className={Style.Splitter}>
//                             <div className={Style.layersInput}>
//                                 <ListInputSearch onChange={(e) => setSearchQuery(e)} placeholder="Search POI" />
//                             </div>
//                         </div>
//                     </Col>

//                     <Col xxl={2} xl={2} lg={2} md={2} sm={2} xs={2}>
//                         <PoiFilter setSideFilter={setSideFilter}/>
//                     </Col>
//                 </Row>
//             </div>

//             <div className={Style.TableSection}>
//                 <Table
//                     rowClassName={(record, index) =>
//                         index % 2 === 0 ? "table-row-light" : "table-row-dark"
//                     }
//                     locale={{
//                         emptyText: (
//                             <div className={Style.EmptyTextTable}>
//                                 <img src={searchQuery !== "" ? blueDocSearch : blueDoc} alt="blue-doc" />
//                                 <h4>{searchQuery !== "" ? "No Search Result Found" : "No Drafts Saved Yet"}</h4>
//                                 {searchQuery !== "" ?
//                                     <p>Try adjusting your search or use different keywords to find Points of<br /> Interest within your worksite.</p>
//                                     :
//                                     <p>Start creating a POI and save it as a draft to finish later. Drafts let you prepare<br /> critical zone data even when you're not ready to publish.</p>
//                                 }
//                             </div>
//                         )
//                     }}
//                     pagination={false} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={savedForms || []} />
//             </div>
//         </>
//     )
// }

// function mapStateToProps({ WorkOrderReducer }) {
//     return { WorkOrderReducer };
// }
// export default connect(mapStateToProps, WorkOrderAction)(DraftPOI);
