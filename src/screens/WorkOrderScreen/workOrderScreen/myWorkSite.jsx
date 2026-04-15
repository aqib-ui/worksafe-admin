// import { useEffect, useState } from 'react'
// import Style from './workOrderScreen.module.css'
// import { Dropdown, message, notification, Progress, Space, Spin, Table, Tag } from 'antd'
// import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
// import { connect, useDispatch } from 'react-redux';
// import { MdOutlineSettings } from 'react-icons/md';
// import { RiDeleteBin7Line } from "react-icons/ri";
// import { MdOutlineModeEditOutline } from "react-icons/md";
// import ReactTimeAgo from 'react-time-ago';
// import { IoCheckmark, IoClose, IoEyeOutline } from "react-icons/io5";
// import { FaCheck } from "react-icons/fa6";
// import { IoMdClose } from "react-icons/io";
// import { useNavigate, useOutletContext } from 'react-router';
// import { TASK_CLEAR_EXPIRED, TASK_LOAD_ARCHIVED_COMPLETE, TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, TASK_LOAD_MY_WORK_ORDER_COMPLETE } from '../../../../store/actions/types';
// import { FaRegFilePdf } from "react-icons/fa6";
// import { FaRegFileExcel } from "react-icons/fa";
// import { baseUrl } from '../../../../store/config.json'
// import { useDownloadNotification } from '../../../provider/downloadProvider';


// function MyWorkSite({ PermissionReducer, WorkOrderReducer, GetMyWorkOrder, ApproveWorkOrder, DeclineWorkOrder, ArchiveWorkOrder }) {
//     const { downloadWorkOrderFile, fileLoader } = useDownloadNotification();
//     const [messageApi, contextHolder] = message.useMessage();
//     const { searchQuery } = useOutletContext();
//     const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
//     const navigate = useNavigate();
//     const dispatch = useDispatch()
//     const AllContentPermission = PermissionReducer?.allPermission?.data?.role_id?.permissions || []
//     const [page, setPage] = useState(1)



//     const viewWorkOrder = (eId) => {
//         localStorage.setItem("Xy9#qLT7pw!5kD+M3/=8&v==", eId)
//         window.location.reload()
//         window.location.href = '/workorder/read';
//     }
//     const editWorkOrder = (eId) => {
//         localStorage.setItem("Xy9#qLT7pw!5kD+M3/=8&v==", eId)
//         window.location.reload()
//         window.location.href = `/workorder/create?editId=${eId}`;

//     }

//     const [isNext, setIsNext] = useState(true)
//     useEffect(() => {
//         const init = async () => {
//             const totalLegngth = await GetMyWorkOrder(workSite, page, searchQuery)
//             if (totalLegngth < 30) {
//                 setIsNext(false)
//             }
//         }
//         init()
//     }, [page, searchQuery])


//     useEffect(() => {
//         if (!messageApi) return;
//         if (WorkOrderReducer.networkError) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "error",
//                 content: "Something went wrong, please try again",
//             });
//         }
//         if (WorkOrderReducer.workOrderOprationLoading) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "loading",
//                 content: "Loading...",
//             });
//         }
//         if (WorkOrderReducer.workOrderArchiveLoading) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "loading",
//                 content: "Loading...",
//             });
//         }
//         if (WorkOrderReducer.workOrderIsArchived) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "success",
//                 content: "Work order archived",
//             });
//             dispatch({ type: TASK_LOAD_MY_WORK_ORDER_COMPLETE, loading: true, payload: [] });
//             dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: true, payload: [] });
//             dispatch({ type: TASK_LOAD_ARCHIVED_COMPLETE, loading: true, payload: [] });
//             GetMyWorkOrder(workSite, page, searchQuery)
//         }
//         if (WorkOrderReducer.workOrderIsApproved) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "success",
//                 content: "Work order approved",
//             });
//             GetMyWorkOrder(workSite, page, searchQuery)
//         }
//         if (WorkOrderReducer.workOrderIsDecline) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "success",
//                 content: "Work order decline",
//             });
//             GetMyWorkOrder(workSite, page, searchQuery)
//         }
//         if (WorkOrderReducer.workOrderExpiredError) {
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
//         WorkOrderReducer.networkError,
//         WorkOrderReducer.workOrderIsApproved,
//         WorkOrderReducer.workOrderIsDecline,
//         WorkOrderReducer.workOrderOprationLoading,
//         WorkOrderReducer.workOrderArchiveLoading,
//         WorkOrderReducer.workOrderIsArchived,
//         WorkOrderReducer.workOrderExpiredError,
//         messageApi,
//     ]);


//     const DeleteMessage = (_id) => {
//         messageApi.open({
//             type: 'warning',
//             content: (
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                     Are you sure you want to archive this work order
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                         <button className={Style.CloseBtn} onClick={() => messageApi.destroy()}><IoClose size={20} color='white' /></button>
//                         <button className={Style.CheckBtn} onClick={() => ArchiveWorkOrder(_id)} ><IoCheckmark size={20} color='white' /></button>
//                     </div>
//                 </div>
//             ),
//         });
//     };

//     const columns = [
//         {
//             title: "Work Order Title",
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
//             title: "Status",
//             dataIndex: "status",
//             key: "status",
//             width: 100,
//             ellipsis: true,
//             render: (text, record) => {
//                 return (
//                     <Tag color={text == "declined" ? "red" : text == "completed" ? "green" : text == "pending" ? 'blue' : text == "approved" ? 'orange' : null}>
//                         {text}
//                     </Tag>
//                 )
//             },

//         },
//         {
//             title: "Priority",
//             dataIndex: "priority",
//             key: "priority",
//             width: 100,
//             ellipsis: true,
//             render: (text, record) => {
//                 return (
//                     <Tag color={text == "Immediate" ? "red" : text == "Standard" ? "green" : text == "High" ? 'blue' : null}>
//                         {text}
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
//                         <Dropdown trigger={['click']} disabled={WorkOrderReducer.workOrderOprationLoading || WorkOrderReducer.workOrderArchiveLoading || fileLoader} menu={{
//                             items: record?.status == "completed" ? [
//                                 {
//                                     key: '1',
//                                     label: (
//                                         <div onClick={() => ApproveWorkOrder(record?._id)} style={{ color: "green", display: 'flex', alignItems: 'center' }}>
//                                             <FaCheck color='green' size={18} style={{ marginRight: 5 }} /> Approve Work Order
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     key: '2',
//                                     label: (
//                                         <div onClick={() => DeclineWorkOrder(record?._id)} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <IoMdClose size={18} style={{ marginRight: 5 }} /> Decline Work Order
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     key: '3',
//                                     label: (
//                                         <div onClick={() => AllContentPermission?.find(data => data?.module == "WORKORDERS")?.permissions?.delete ? DeleteMessage(record?._id) : null} style={{ color: "red", display: 'flex', alignItems: 'center' }}>
//                                             <RiDeleteBin7Line color='red' size={18} style={{ marginRight: 5 }} /> Archive Work Order
//                                         </div>
//                                     ),
//                                     disabled: !AllContentPermission?.find(data => data?.module == "WORKORDERS")?.permissions?.delete
//                                 },
//                                 {
//                                     key: '4',
//                                     label: (
//                                         <div onClick={() => viewWorkOrder(record?._id)} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <IoEyeOutline size={18} style={{ marginRight: 5 }} /> View Work Order
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     key: '8',
//                                     label: (
//                                         <div onClick={() => downloadWorkOrderFile(`/workorder/download-documents/${record?._id}?format=pdf`, 'GET', 'pdf')} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <FaRegFilePdf size={18} style={{ marginRight: 5 }} /> Download Pdf File
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     key: '9',
//                                     label: (
//                                         <div onClick={() => downloadWorkOrderFile(`/workorder/download-documents/${record?._id}?format=excel`, 'GET', 'excel')} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <FaRegFileExcel size={18} style={{ marginRight: 5 }} /> Download Excel File
//                                         </div>
//                                     ),
//                                 },
//                             ] : record?.status == "approved" ? [
//                                 {
//                                     key: '3',
//                                     label: (
//                                         <div onClick={() => AllContentPermission?.find(data => data?.module == "WORKORDERS")?.permissions?.delete ? DeleteMessage(record?._id) : null} style={{ color: "red", display: 'flex', alignItems: 'center' }}>
//                                             <RiDeleteBin7Line color='red' size={18} style={{ marginRight: 5 }} /> Archive Work Order
//                                         </div>
//                                     ),
//                                     disabled: !AllContentPermission?.find(data => data?.module == "WORKORDERS")?.permissions?.delete
//                                 },
//                                 {
//                                     key: '4',
//                                     label: (
//                                         <div onClick={() => viewWorkOrder(record?._id)} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <IoEyeOutline size={18} style={{ marginRight: 5 }} /> View Work Order
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     key: '8',
//                                     label: (
//                                         <div onClick={() => downloadWorkOrderFile(`/workorder/download-documents/${record?._id}?format=pdf`, 'GET', 'pdf')} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <FaRegFilePdf size={18} style={{ marginRight: 5 }} /> Download Pdf File
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     key: '9',
//                                     label: (
//                                         <div onClick={() => downloadWorkOrderFile(`/workorder/download-documents/${record?._id}?format=excel`, 'GET', 'excel')} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <FaRegFileExcel size={18} style={{ marginRight: 5 }} /> Download Excel File
//                                         </div>
//                                     ),
//                                 },
//                             ] : [
//                                 {
//                                     key: '1',
//                                     label: (
//                                         <div onClick={() => AllContentPermission?.find(data => data?.module == "WORKORDERS")?.permissions?.delete ? DeleteMessage(record?._id) : null} style={{ color: "red", display: 'flex', alignItems: 'center' }}>
//                                             <RiDeleteBin7Line color='red' size={18} style={{ marginRight: 5 }} /> Archive Work Order
//                                         </div>
//                                     ),
//                                     disabled: !AllContentPermission?.find(data => data?.module == "WORKORDERS")?.permissions?.delete

//                                 },
//                                 {
//                                     key: '2',
//                                     label: (
//                                         <div onClick={() => AllContentPermission?.find(data => data?.module == "WORKORDERS")?.permissions?.update ? editWorkOrder(record?._id) : null} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <MdOutlineModeEditOutline size={18} style={{ marginRight: 5 }} /> Edit Work Order
//                                         </div>
//                                     ),
//                                     disabled: !AllContentPermission?.find(data => data?.module == "WORKORDERS")?.permissions?.update
//                                 },
//                                 {
//                                     key: '3',
//                                     label: (
//                                         <div onClick={() => viewWorkOrder(record?._id)} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <IoEyeOutline size={18} style={{ marginRight: 5 }} /> View Work Order
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     key: '8',
//                                     label: (
//                                         <div onClick={() => downloadWorkOrderFile(`/workorder/download-documents/${record?._id}?format=pdf`, 'GET', 'pdf')} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <FaRegFilePdf size={18} style={{ marginRight: 5 }} /> Download Pdf File
//                                         </div>
//                                     ),
//                                 },
//                                 {
//                                     key: '9',
//                                     label: (
//                                         <div onClick={() => downloadWorkOrderFile(`/workorder/download-documents/${record?._id}?format=excel`, 'GET', 'excel')} style={{ display: 'flex', alignItems: 'center' }}>
//                                             <FaRegFileExcel size={18} style={{ marginRight: 5 }} /> Download Excel File
//                                         </div>
//                                     ),
//                                 },
//                             ]
//                         }}>
//                             <MdOutlineSettings style={{ opacity: !WorkOrderReducer.workOrderOprationLoading && !WorkOrderReducer.workOrderArchiveLoading && !fileLoader ? 1 : 0.3, cursor: WorkOrderReducer.workOrderOprationLoading && WorkOrderReducer.workOrderArchiveLoading && fileLoader ? "no-drop" : 'pointer' }} size={24} />
//                         </Dropdown>
//                     </>
//                 )
//             },
//         },
//     ];
//     const sortedData = [...WorkOrderReducer?.myWorkOrderData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


//     return (
//         <>
//             {contextHolder}
//             <div className={Style.TableSection}>
//                 <Table footer={() => (
//                     <>
//                         {WorkOrderReducer?.myWorkOrderData.length > 0 && !WorkOrderReducer?.workOrderLoading &&
//                             <>
//                                 {isNext &&
//                                     <div style={{ textAlign: "center", padding: "0 0" }}>
//                                         <button
//                                             onClick={() => setPage(prev => prev + 1)}
//                                             disabled={WorkOrderReducer?.workOrderLoading}
//                                             style={{
//                                                 border: "1px solid #1890ff",
//                                                 background: "#1890ff",
//                                                 color: "white",
//                                                 padding: "6px 16px",
//                                                 borderRadius: "4px",
//                                                 cursor: WorkOrderReducer?.workOrderLoading ? "not-allowed" : "pointer",
//                                             }}
//                                         >
//                                             {WorkOrderReducer?.workOrderLoading ? "Loading..." : "Load More"}
//                                         </button>
//                                     </div>
//                                 }
//                             </>
//                         }
//                     </>
//                 )} pagination={false} loading={WorkOrderReducer?.workOrderLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
//             </div>
//         </>
//     )
// }

// function mapStateToProps({ WorkOrderReducer, PermissionReducer }) {
//     return { WorkOrderReducer, PermissionReducer };
// }
// export default connect(mapStateToProps, WorkOrderAction)(MyWorkSite);













import { useCallback, useEffect, useState } from 'react'
import Style from './workOrderScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Input, message, Select, Space, Spin, Switch, Table, Tag, TimePicker, Tooltip, Upload, Col, Row, Grid, Empty } from 'antd'
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdOutlineSettings } from 'react-icons/md';
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago'
import { FaCheck } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useNavigate } from 'react-router';
import { IoEyeOutline } from 'react-icons/io5';
import { TASK_CLEAR_EXPIRED } from '../../../../store/actions/types';
import { MdOutlineFileDownload } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";
import { FaRegFileExcel } from "react-icons/fa";
import { baseUrl } from '../../../../store/config.json'
import { useDownloadNotification } from '../../../provider/downloadProvider';
import { useOutletContext } from 'react-router';
import { UploadOutlined } from '@ant-design/icons';
import ListInputSearch from '../../../component/ListInputSearch';
import blueDoc from '../../../assets/blue-Doc.png'
import { MdChevronRight } from "react-icons/md";
import clockYellow from "../../../assets/clock-yellow.png"
import tickCircle from "../../../assets/tick-circle.png"
import closeCircle from "../../../assets/close-circle.png"

dayjs.extend(utc);



function MyWorkSite({ GetMyWorkOrder, PermissionReducer, WorkOrderReducer, GetMyAssignedWorkOrder, CompleteWorkOrder }) {
    const { downloadWorkOrderFile, fileLoader } = useDownloadNotification();
    // const { searchQuery } = useOutletContext();
    const dateFormat = 'YYYY-MM-DD hh:mm A';
    const [messageApi, contextHolder] = message.useMessage();
    const [completeWODrawer, setCompleteWODrawer] = useState(false);
    const [currentWorkOrder, setCurrentWorkOrder] = useState();
    const worksite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const [emailCol, setEmailCol] = useState([]);
    const getCurrentDate = () => {
        return dayjs(Date.now()).format('YYYY-MM-DD hh:mm A');
    };
    const AllContentPermission = PermissionReducer?.allPermission?.data?.role_id?.permissions || []
    const [currentDate, setCurrentDate] = useState(dayjs(getCurrentDate(), dateFormat));
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [sendTo, setSendTo] = useState("Yes");
    const [page, setPage] = useState(1)
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")

    const [isNext, setIsNext] = useState(true)

    const [searchQuery, setSearchQuery] = useState("")
    const [priority, setPriority] = useState([])
    const [cpc, setCpc] = useState([])



    useEffect(() => {
        const init = async () => {
            const totalLegngth = await GetMyWorkOrder(workSite, page, searchQuery, priority, cpc)
            if (totalLegngth < 30) {
                setIsNext(false)
            }
        }
        init()
    }, [priority, cpc, page, searchQuery])

    // useEffect(() => {
    //     const init = async () => {
    //         const totalLegngth = await GetMyWorkOrder(workSite, page, searchQuery)
    //         if (totalLegngth < 30) {
    //             setIsNext(false)
    //         }
    //     }
    //     init()
    // }, [page, searchQuery])







    const AddEmailField = () => {
        const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        setEmailCol(prev => {
            const allValid = prev.every(item => regEmail.test(item.value));
            if (!allValid) {
                messageApi.destroy()
                messageApi.open({
                    type: "error",
                    content: "Please fix invalid emails before adding a new field.",
                });
                return prev;
            }
            return [...prev, { id: Math.random(), value: '' }];
        });
    };
    const handleEmailChange = useCallback((id, value) => {
        setEmailCol(prev =>
            prev.map(pr => (pr.id === id ? { ...pr, value } : pr))
        );
    }, []);
    const handleEmailDelete = useCallback((id) => {
        setEmailCol(prev => prev.filter(pr => pr.id !== id));
    }, []);
    const getCombinedDateTime = () => {
        if (currentDate) {
            const combined = dayjs(currentDate).format(dateFormat);
            return combined
        }
        return null;
    };


    const [jsaRequired, setJsaRequired] = useState(false)
    const [currectWorkOrder, setCurrectWorkOrder] = useState()
    const [deleteSafetyH, setDeleteSafetyH] = useState([])


    const showWorkOrderDrawer = (e) => {
        setJsaRequired(e?.isJSA == "true" ? true : false)
        setDeleteSafetyH(e?.jsaDocumentation)
        setCurrectWorkOrder(e)
        setCurrentWorkOrder(e._id)
        setCompleteWODrawer(true);
        setEmailCol(JSON.parse(e?.email_copy_to_completed))
        setIsExcel(e?.isExcelCompleted == "false" ? false : true)
        const parsedEmails = JSON.parse(e?.email_copy_to_completed || '[]');
        const emailData = parsedEmails.map((email, index) => ({
            id: index + 1,
            value: email
        }));
        setEmailCol(emailData);
    };
    const workOrderCompleteClose = () => {
        setCompleteWODrawer(false);
    };

    const BooleanOpiton = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ]



    useEffect(() => {
        if (!messageApi) return;
        if (WorkOrderReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (WorkOrderReducer.workOrderExpiredError) {
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
        if (WorkOrderReducer.workOrderIsCompleted) {
            workOrderCompleteClose()
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Work order complete",
            });
            GetMyAssignedWorkOrder(workSite, page, searchQuery)
            setCurrectWorkOrder()
            setDeleteSafetyH()
            setJsaRequired(false)
        }
    }, [
        WorkOrderReducer.networkError,
        WorkOrderReducer.workOrderIsCompleted,
        WorkOrderReducer.workOrderExpiredError,
        messageApi,
    ]);

    const viewWorkOrder = (eId) => {
        localStorage.setItem("Xy9#qLT7pw!5kD+M3/=8&v==", eId)
        window.location.reload()
        window.location.href = '/workorder/read';
    }
    const editWorkOrder = (eId) => {
        localStorage.setItem("Xy9#qLT7pw!5kD+M3/=8&v==", eId)
        window.location.reload()
        window.location.href = `/workorder/create?editId=${eId}`;
    }


    const columns = [
        {
            title: "Work Order Title",
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
            title: "Priority Level",
            key: "pl",
            width: 100,
            ellipsis: true,
            render: (text, record) => {
                return (
                    <Tag style={{ color: text?.priority == "Immediate" ? "#C94040" : text?.priority == "High" ? "#C9A240" : text?.priority == "Standard" ? '#1C8F5D' : null }} color={text?.priority == "Immediate" ? "#F14D4D14" : text?.priority == "High" ? "#F1C34D14" : text?.priority == "Standard" ? '#4DF15E14' : null}>
                        {text?.priority}
                    </Tag>
                )
            },
        },
        {
            title: "Chargeable Profit Center",
            dataIndex: "cpc",
            key: "cpc",
            width: 100,
            ellipsis: true,
            render: (text, record) => {
                return (
                    <Tag style={{ padding: '4px 8px', color: "#214CBC", borderRadius: 4 }} color={"#DBE5FF"}>
                        {text}
                    </Tag>
                )
            },
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            width: 100,
            ellipsis: true,
            render: (text, record) => {
                return (
                    // <Tag color={text == "Immediate" ? "red" : text == "Standard" ? "green" : text == "High" ? 'blue' : null}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img style={{ height: 20 }} src={text == "pending" ? clockYellow : text == "completed" ? tickCircle : text == "declined" ? closeCircle : text == "approved" ? tickCircle : null} />
                        <p style={{ margin: 0, marginLeft: 2, marginBottom: 2, textTransform: 'capitalize' }}>{text}</p>
                    </div>
                    // </Tag>
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
                        <div style={{padding:'10px',height:'40px',width:'40px',cursor:'pointer'}} onClick={() => viewWorkOrder(record?._id)} >
                            <MdChevronRight size={24} />
                        </div>
                    </>
                )
            },
        },
    ];

    const [isExcel, setIsExcel] = useState(false)
    const isSendExcel = checked => {
        setIsExcel(checked)
    };


    const completeWO = () => {
        const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const allValidEmails = emailCol.every(item => item?.value && regEmail.test(item.value));

        if (!allValidEmails) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "One or more emails are invalid",
            });
            return;
        }

        const emailList = emailCol.map(item => item.value);
        const formData = new FormData();
        formData.append("workOrderId", currentWorkOrder);
        formData.append("email_copy_to_completed", JSON.stringify(emailList));
        formData.append("send_to", sendTo === "Yes" ? "true" : "false");
        formData.append("completed_date", getCombinedDateTime());
        formData.append("isExcelCompleted", isExcel ? "true" : "false");
        JSA2.forEach(file => {
            formData.append("jsaDocumentation", file);
        });
        if (deleteSafetyH?.length > 0) {
            formData.append(
                "jsaDocumentationIds",
                JSON.stringify(deleteSafetyH?.map(item => item._id))
            );
        }
        CompleteWorkOrder(formData);
    };

    const sortedData = [...WorkOrderReducer?.myWorkOrderData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));



    const [JSA1, setJSA1] = useState([]);
    const [JSA2, setJSA2] = useState([]);

    const fileSetters = {
        JSA1: setJSA1,
        JSA2: setJSA2,
    };

    const createBeforeUploadHandler = (key) => (file) => {
        const setter = fileSetters[key];
        if (setter) {
            setter((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
        } else {
            console.warn(`Unknown file key: ${key}`);
        }
        return false;
    };


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




    const PriorityData = [
        { value: "Immediate", label: "Immediate" },
        { value: "High", label: "High" },
        { value: "Standard", label: "Standard" }
    ]
    const CpcOption = [
        { value: "Environment", label: "Environment" },
        { value: "Maintenance", label: "Maintenance" },
        { value: "Operation", label: "Operation" },
        { value: "Capital", label: "Capital" },
    ]

    return (
        <>
            {contextHolder}
            <div className={Style.filterSection}>
                <Row gutter={gutter} align="middle" justify="space-between">
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.Splitter}>
                            <div className={Style.layersInput}>
                                <ListInputSearch onChange={(e) => setSearchQuery(e)} placeholder="Search Work order" />
                            </div>
                        </div>
                    </Col>

                    <Col xxl={6} xl={6} lg={6} md={24} sm={24} xs={24}>
                        <Select
                            getPopupContainer={(node) => node.parentElement}
                            placeholder="All Priority Level"
                            style={{ width: '100%' }}
                            options={PriorityData}
                            mode='multiple'
                            onChange={(e) => setPriority(e)}
                        />
                    </Col>

                    <Col xxl={6} xl={6} lg={6} md={24} sm={24} xs={24}>
                        <Select
                            getPopupContainer={(node) => node.parentElement}
                            placeholder="All Chargeable Profit Center"
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
                            {WorkOrderReducer?.myWorkOrderData.length > 0 && !WorkOrderReducer?.workOrderLoading &&
                                <>
                                    {isNext &&
                                        <div style={{ textAlign: "center", padding: "0 0" }}>
                                            <button
                                                onClick={() => setPage(prev => prev + 1)}
                                                disabled={WorkOrderReducer?.workOrderLoading}
                                                style={{
                                                    border: "1px solid #1890ff",
                                                    background: "#1890ff",
                                                    color: "white",
                                                    padding: "6px 16px",
                                                    borderRadius: "4px",
                                                    cursor: WorkOrderReducer?.workOrderLoading ? "not-allowed" : "pointer",
                                                }}
                                            >
                                                {WorkOrderReducer?.workOrderLoading ? "Loading..." : "Load More"}
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
                                <img src={blueDoc} alt="blue-doc" />
                                <h4>no work orders yet</h4>
                                <p>Once a team member assigns you a work order, it will appear here for action<br /> and tracking.</p>
                            </div>
                        )
                    }}
                    pagination={false} loading={WorkOrderReducer?.workOrderLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
            </div>
            <Drawer
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
                footer={
                    <div className={Style.FooterContainer}>
                        <button onClick={workOrderCompleteClose}>Close</button>
                        {jsaRequired ?
                            <button
                                style={{
                                    cursor:
                                        WorkOrderReducer.workOrderCompleteLoading ||
                                            (!(JSA2?.length || deleteSafetyH?.length))
                                            ? "no-drop"
                                            : "pointer",
                                }}
                                disabled={
                                    WorkOrderReducer.workOrderCompleteLoading ||
                                    (!(JSA2?.length || deleteSafetyH?.length))
                                }
                                onClick={completeWO}
                            >
                                {WorkOrderReducer.workOrderCompleteLoading ? "Saving..." : "Save changes"}
                            </button> :
                            <button style={{ cursor: WorkOrderReducer.workOrderCompleteLoading }} disabled={WorkOrderReducer.workOrderCompleteLoading} onClick={completeWO}>{WorkOrderReducer.workOrderCompleteLoading ? "Saving..." : "Save changes"}</button>
                        }
                    </div>
                }
                title="Work Order Completed" onClose={workOrderCompleteClose} open={completeWODrawer}>
                <div>
                    <label>Date Completed</label>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                        <div style={{ flex: 1, marginRight: 2 }}>
                            <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} onChange={(e) => setCurrentDate(e)} defaultValue={dayjs(getCurrentDate(), dateFormat)} format={dateFormat} style={{ width: '100%', height: 45 }} />
                        </div>
                    </div>
                </div>
                <div style={{ paddingTop: 15 }}>
                    <label>Send to Requestor</label>
                    <Select
                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                        placeholder="Select Here"
                        style={{ marginTop: 3, width: "100%", height: 45 }}
                        options={BooleanOpiton}
                        defaultValue={"Yes"}
                        onChange={(e) => setSendTo(e)}
                    />
                </div>
                <div style={{ paddingTop: 15, }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label>{`Email copy to (${emailCol.length || 0})`}</label>
                        <button onClick={() => AddEmailField()} style={{ background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#214CBC' }}>Add</button>
                    </div>
                    {emailCol.length > 0 &&
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Switch defaultChecked={isExcel} onChange={isSendExcel} />
                                <label style={{ marginLeft: 4 }}>Send excel file with pdf</label>
                            </div>
                        </div>
                    }
                    {emailCol.map(data => (
                        <Input
                            key={data.id}
                            value={data.value}
                            onChange={(e) => handleEmailChange(data.id, e.target.value)}
                            placeholder='Enter email'
                            style={{ height: 45, marginTop: 10 }}
                            suffix={
                                <div style={{ cursor: "pointer" }} onClick={() => handleEmailDelete(data.id)}>
                                    <Tooltip title="Delete Email">
                                        <AiOutlineDelete style={{ color: 'rgba(0,0,0,.45)' }} size={22} />
                                    </Tooltip>
                                </div>
                            }
                        />
                    ))}
                </div>
                <div style={{ paddingTop: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontWeight: 'bold', fontSize: 17 }}>Work order assigned by</label>
                    <p>{localStorage.getItem('Lp3@vBN9tw69gV*R2/+1?w==')}</p>
                </div>

                {/* <div style={{ display: 'flex', flexDirection: 'column' , marginTop: 10 }}>
                    <label style={{ marginBottom: 10 }}>Confined Space Paperwork <span style={{ fontSize: 12, color: jsaRequired ? 'red' : '#a1a1a1' }}>{jsaRequired ? `(Required)` : `(optional)`}</span></label>
                    <Upload onRemove={(e) => setJSA1(prev =>
                        prev.filter(file => file.uid !== e.uid)
                    )} accept={".pdf,.docx,.doc"} multiple={true} disabled={WorkOrderReducer.workOrderCompleteLoading} beforeUpload={createBeforeUploadHandler('JSA1')}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </div> */}

                {jsaRequired ?
                    <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                            <label style={{ marginBottom: 10 }}>JSA (Job Safety Analysis) <span style={{ fontSize: 12, color: jsaRequired ? 'red' : '#a1a1a1' }}>{jsaRequired ? `(Required)` : `(optional)`}</span></label>
                            <Upload onRemove={(e) => setJSA2(prev =>
                                prev.filter(file => file.uid !== e.uid)
                            )} accept={".pdf,.docx,.doc"} multiple={true} disabled={WorkOrderReducer.workOrderCompleteLoading} beforeUpload={createBeforeUploadHandler('JSA2')}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </div>

                        <div style={{ marginTop: 10 }}>
                            {deleteSafetyH?.length > 0 ? deleteSafetyH?.filter(data => !deleteSafetyH.includes(data?._id)).map(data => {
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>

                                        <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            {data?.fileName}
                                        </a>
                                        <div onClick={() => setDeleteSafetyH(prev => {
                                            const id = data?._id;
                                            const exists = prev.some(item => item._id === id);

                                            return exists
                                                ? prev.filter(item => item._id !== id)
                                                : [...prev, data];
                                        })} style={{ cursor: 'pointer' }}>
                                            <AiOutlineDelete size={22} color='red' />
                                        </div>
                                    </div>
                                )
                            }) : ""}
                        </div>
                    </div>
                    :
                    <>
                        {deleteSafetyH?.length > 0 &&
                            <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                                    <label style={{ marginBottom: 10 }}>JSA (Job Safety Analysis)</label>
                                </div>

                                <div style={{ marginTop: 0 }}>
                                    {deleteSafetyH?.length > 0 ? deleteSafetyH?.map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                                                <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                    {data?.fileName}
                                                </a>
                                                {/* <div onClick={() => setDeleteSafetyH(prev => {
                                                    const id = data?._id;
                                                    const exists = prev.some(item => item._id === id);

                                                    return exists
                                                        ? prev.filter(item => item._id !== id)
                                                        : [...prev, data];
                                                })} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div> */}
                                            </div>
                                        )
                                    }) : ""}
                                </div>
                            </div>
                        }
                    </>
                }
            </Drawer>
        </>
    )
}

function mapStateToProps({ WorkOrderReducer, PermissionReducer }) {
    return { WorkOrderReducer, PermissionReducer };
}
export default connect(mapStateToProps, WorkOrderAction)(MyWorkSite);