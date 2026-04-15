// import { useEffect, useState } from 'react'
// import Style from './AssetsScreen.module.css'
// import { Dropdown, message, Space, Table, Tag, } from 'antd'
// import * as AssetsAction from '../../../../store/actions/Assets/index';
// import { connect, useDispatch } from 'react-redux';
// import { MdOutlineSettings } from 'react-icons/md';
// import ReactTimeAgo from 'react-time-ago';
// import { IoEyeOutline } from 'react-icons/io5';
// import { useNavigate, useOutletContext } from 'react-router';



// function ArchivedAssets({ AssetsReducer, GetArchivedAssets }) {
//     const [messageApi, contextHolder] = message.useMessage();
//     const [page, setPage] = useState(1)
//     const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
//     const { searchQuery } = useOutletContext();
//     const dispatch = useDispatch()
//     const navigate = useNavigate()


//     const [isNext, setIsNext] = useState(true)
//     useEffect(() => {
//         const init = async () => {
//             const totalLegngth = await GetArchivedAssets(workSite, page, searchQuery)
//             if (totalLegngth < 30) {
//                 setIsNext(false)
//             }
//         }
//         init()
//     }, [page, searchQuery])

//     useEffect(() => {
//         if (!messageApi) return;
//         if (AssetsReducer.networkError) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "error",
//                 content: "Something went wrong, please try again",
//             });
//         }
//         if (AssetsReducer.projectExpiredError) {
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
//         AssetsReducer.networkError,
//         AssetsReducer.projectExpiredError,
//         messageApi,
//     ]);

//     const viewWorkOrder = (eId) => {
//         localStorage.setItem("Wl2^gTP7ys&1aN$E5-/9hu==", eId)
//         window.location.reload()
//         window.location.href = '/assets/read';
//     }

//     const columns = [
//         {
//             title: "Asset Type",
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
//                     }}>{text?.assetType?.name}</div>
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
//                                             <IoEyeOutline size={18} style={{ marginRight: 5 }} /> View Asset
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


//     const sortedData = [...AssetsReducer?.archivedAssetsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));



//     return (
//         <>
//             {contextHolder}
//             <div className={Style.TableSection}>
//                 <Table footer={() => (
//                     <>
//                         {AssetsReducer?.archivedAssetsData.length > 0 && !AssetsReducer?.archivedAssetsLoading &&
//                             <>
//                                 {isNext &&
//                                     <div style={{ textAlign: "center", padding: "0 0" }}>
//                                         <button
//                                             onClick={() => setPage(prev => prev + 1)}
//                                             disabled={AssetsReducer?.archivedAssetsLoading}
//                                             style={{
//                                                 border: "1px solid #1890ff",
//                                                 background: "#1890ff",
//                                                 color: "white",
//                                                 padding: "6px 16px",
//                                                 borderRadius: "4px",
//                                                 cursor: AssetsReducer?.archivedAssetsLoading ? "not-allowed" : "pointer",
//                                             }}
//                                         >
//                                             {AssetsReducer?.archivedAssetsLoading ? "Loading..." : "Load More"}
//                                         </button>
//                                     </div>
//                                 }
//                             </>
//                         }
//                     </>
//                 )} pagination={false} loading={AssetsReducer?.archivedAssetsLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
//             </div>
//         </>
//     )
// }
// function mapStateToProps({ AssetsReducer }) {
//     return { AssetsReducer };
// }
// export default connect(mapStateToProps, AssetsAction)(ArchivedAssets);





import { useEffect, useState } from 'react'
import Style from './AssetsScreen.module.css'
import { Col, Dropdown, Grid, message, Row, Select, Space, Table, Tag } from 'antd'
import * as AssetsAction from '../../../../store/actions/Assets/index';
import { connect, useDispatch } from 'react-redux';
import { MdChevronRight, MdOutlineSettings } from 'react-icons/md';
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago';
import { IoCheckmark, IoClose, IoEyeOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useNavigate, useOutletContext } from 'react-router';
import { TASK_CLEAR_EXPIRED, TASK_GET_ARCHIVED_ASSETS_COMPLETE, TASK_GET_ASSETS_COMPLETE } from '../../../../store/actions/types';
import ListInputSearch from '../../../component/ListInputSearch';
import blueDoc from '../../../assets/boxListing.png'
import blueDocSearch from '../../../assets/search-normal-blue.png'

function ArchivedAssets({ AssetsReducer, GetAssets, ArchiveAssets, GetArchivedAssets }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [page, setPage] = useState(1)
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")



    const [isNext, setIsNext] = useState(true)
    useEffect(() => {
        const init = async () => {
            const totalLegngth = await GetArchivedAssets(workSite, page, searchQuery)
            if (totalLegngth < 30) {
                setIsNext(false)
            }
        }
        init()
    }, [page, searchQuery])

    useEffect(() => {
        if (!messageApi) return;
        if (AssetsReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (AssetsReducer.projectExpiredError) {
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
        if (AssetsReducer.AssetsDeleteLoading) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Loading...",
            });
        }
        if (AssetsReducer.AssetsDelete) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Asset archived successfully",
            });
            dispatch({ type: TASK_GET_ARCHIVED_ASSETS_COMPLETE, loading: true, payload: [] });
            dispatch({ type: TASK_GET_ASSETS_COMPLETE, loading: true, payload: [] });
            GetAssets(workSite, page, searchQuery)
        }
    }, [
        AssetsReducer.networkError,
        AssetsReducer.projectExpiredError,
        AssetsReducer.AssetsDelete,
        AssetsReducer.AssetsDeleteLoading,
        messageApi,
    ]);


    const viewWorkOrder = (eId) => {
        localStorage.setItem("Wl2^gTP7ys&1aN$E5-/9hu==", eId)
        window.location.reload()
        window.location.href = '/assets/read';
    }
    const editProject = (eId) => {
        localStorage.setItem("Zr8!pMD3vx#9cL@B7*+6nf==", eId)
        window.location.reload()
        window.location.href = '/assets/edit';
    }


    const DeleteMessage = (_id) => {
        messageApi.open({
            type: 'warning',
            content: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    Are you sure you want to archive this Asset
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className={Style.CloseBtn} onClick={() => messageApi.destroy()}><IoClose size={20} color='white' /></button>
                        <button className={Style.CheckBtn} onClick={() => ArchiveAssets(_id)} ><IoCheckmark size={20} color='white' /></button>
                    </div>
                </div>
            ),
        });
    };

    const columns = [
        {
            title: "Asset Type",
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
                    }}>{text?.assetType?.name}</div>
                )
            },
        },
        {
            title: "Department",
            key: "Department",
            width: 200,
            ellipsis: true,
            render: (text, record) => {
                return (
                    <div onClick={() => viewWorkOrder(record?._id)} style={{
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: 200
                    }}>{text?.department?.name}</div>
                )
            },
        },
        {
            title: "Model",
            key: "model",
            width: 200,
            ellipsis: true,
            render: (text, record) => {
                return (
                    <div onClick={() => viewWorkOrder(record?._id)} style={{
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: 200
                    }}>{text?.model?.name}</div>
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
            title: "Created At",
            key: "createAt",
            width: 200,
            ellipsis: true,
            render: (users) => (
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

    const sortedData = [...AssetsReducer?.archivedAssetsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));




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



      const threatLevelOption = [
        { label: "Below Ground", value: "Below Ground" },
        { label: "Ground Level", value: "Ground Level" },
        { label: "Overhead", value: "Overhead" },
    ]
    return (
        <>
            {contextHolder}
            {/* <div className={Style.TableSection}>
                <Table footer={() => (
                    <>
                        {AssetsReducer?.AssetsData.length > 0 && !AssetsReducer?.archivedAssetsLoading &&
                            <>
                                {isNext &&
                                    <div style={{ textAlign: "center", padding: "0 0" }}>
                                        <button
                                            onClick={() => setPage(prev => prev + 1)}
                                            disabled={AssetsReducer?.archivedAssetsLoading}
                                            style={{
                                                border: "1px solid #1890ff",
                                                background: "#1890ff",
                                                color: "white",
                                                padding: "6px 16px",
                                                borderRadius: "4px",
                                                cursor: AssetsReducer?.archivedAssetsLoading ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {AssetsReducer?.archivedAssetsLoading ? "Loading..." : "Load More"}
                                        </button>
                                    </div>
                                }
                            </>
                        }
                    </>
                )} pagination={false} loading={AssetsReducer?.archivedAssetsLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
            </div> */}

            <div className={Style.filterSection}>
                <Row gutter={gutter} align="middle" justify="space-between">
                    <Col xxl={20} xl={20} lg={20} md={24} sm={24} xs={24}>
                        <div className={Style.Splitter}>
                            <div className={Style.layersInput}>
                                <ListInputSearch onChange={(e) => setSearchQuery(e)} placeholder="Search Assets" />
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
                            {AssetsReducer?.archivedAssetsData.length > 0 && !AssetsReducer?.archivedAssetsLoading &&
                                <>
                                    {isNext &&
                                        <div style={{ textAlign: "center", padding: "0 0" }}>
                                            <button
                                                onClick={() => setPage(prev => prev + 1)}
                                                disabled={AssetsReducer?.archivedAssetsLoading}
                                                style={{
                                                    border: "1px solid #1890ff",
                                                    background: "#1890ff",
                                                    color: "white",
                                                    padding: "6px 16px",
                                                    borderRadius: "4px",
                                                    cursor: AssetsReducer?.archivedAssetsLoading ? "not-allowed" : "pointer",
                                                }}
                                            >
                                                {AssetsReducer?.archivedAssetsLoading ? "Loading..." : "Load More"}
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
                                <h4>{searchQuery !== "" ? "No Search Result Found" : "No Assets Archived Yet"}</h4>
                                {searchQuery !== "" ?
                                    <p>Try adjusting your search or use different keywords to find Assets<br /> within your worksite.</p>
                                    :
                                    <p>Start by Archiving your Assets to mark critical zones, assign safety<br /> tasks, and track risk areas within your worksite.</p>
                                }
                            </div>
                        )
                    }}
                    pagination={false} loading={AssetsReducer?.archivedAssetsLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
            </div>
        </>
    )
}

function mapStateToProps({ AssetsReducer }) {
    return { AssetsReducer };
}
export default connect(mapStateToProps, AssetsAction)(ArchivedAssets);
