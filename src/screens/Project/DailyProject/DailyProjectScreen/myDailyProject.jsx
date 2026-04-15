import { useEffect, useState } from 'react'
import Style from './ProjectScreen.module.css'
import { Dropdown, message, Space, Table, Tag } from 'antd'
import * as ProjectAction from '../../../../../store/actions/Project/index';
import { connect, useDispatch } from 'react-redux';
import { MdOutlineSettings } from 'react-icons/md';
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago';
import { IoCheckmark, IoClose, IoEyeOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useNavigate, useOutletContext } from 'react-router';
import { TASK_CLEAR_EXPIRED, TASK_GET_DAILY_PROJECT_COMPLETE } from '../../../../../store/actions/types';


function MyDailyProject({ ProjectReducer, LoadDailyProject, DeleteDailyProject }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [page, setPage] = useState(1)
    const currectProject = localStorage.getItem('Sp6#nQD7vo$1gX@C8-/4lt==')
    const currectProjectObj = JSON.parse(currectProject);
    const { searchQuery } = useOutletContext();
    const dispatch = useDispatch()
    const navigate = useNavigate()



    const [isNext, setIsNext] = useState(true)
    useEffect(() => {
        const init = async () => {
            const totalLegngth = await LoadDailyProject(currectProjectObj?._id, page, searchQuery)
            if (totalLegngth < 30) {
                setIsNext(false)
            }
        }
        init()
    }, [page, searchQuery])




    useEffect(() => {
        if (!messageApi) return;
        if (ProjectReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (ProjectReducer.dailyProjectDeleteLoading) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Loading...",
            });
        }
        if (ProjectReducer.dailyProjectDelete) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Daily project delete successfully",
            });
            dispatch({ type: TASK_GET_DAILY_PROJECT_COMPLETE, loading: true, payload: [] });
            LoadDailyProject(currectProjectObj?._id, page, searchQuery)
        }
    }, [
        ProjectReducer.networkError,
        ProjectReducer.dailyProjectDelete,
        ProjectReducer.dailyProjectDeleteLoading,
        messageApi,
    ]);


    const viewWorkOrder = (eId) => {
        localStorage.setItem("Cr2%gNW9ya@7mV$E4-+xTl==", eId)
        window.location.reload()
        window.location.href = '/project/daily/read';
    }
    const editProject = (eId) => {
        localStorage.setItem("Jt4^rLB6wi!1fK#M8*/vOz==", eId)
        window.location.reload()
        window.location.href = '/project/daily/edit';
    }


    const DeleteMessage = (_id) => {
        messageApi.open({
            type: 'warning',
            content: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    Are you sure you want to delete this Daily Project
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className={Style.CloseBtn} onClick={() => messageApi.destroy()}><IoClose size={20} color='white' /></button>
                        <button className={Style.CheckBtn} onClick={() => DeleteDailyProject(_id)} ><IoCheckmark size={20} color='white' /></button>
                    </div>
                </div>
            ),
        });
    };

    const columns = [
        {
            title: "Daily Project Title",
            dataIndex: "project_name",
            key: "project_name",
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
            title: "Action",
            key: "action",
            className: " space-x-2",
            ellipsis: true,
            width: 100,
            render: (record) => {
                return (
                    <>
                        <Dropdown trigger={['click']} menu={{
                            items: [
                                {
                                    key: '3',
                                    label: (
                                        <div onClick={() => viewWorkOrder(record?._id)} style={{ display: 'flex', alignItems: 'center' }}>
                                            <IoEyeOutline size={18} style={{ marginRight: 5 }} /> View Daily Project
                                        </div>
                                    ),
                                },
                                {
                                    key: '4',
                                    disabled: currectProjectObj.isArchived,
                                    label: (
                                        <div onClick={() => currectProjectObj.isArchived ? null : editProject(record?._id)} style={{ display: 'flex', alignItems: 'center' }}>
                                            <MdOutlineModeEditOutline size={18} style={{ marginRight: 5 }} /> Edit Daily Project
                                        </div>
                                    ),
                                },
                                {
                                    key: '19',
                                    disabled: currectProjectObj.isArchived,
                                    label: (
                                        <div onClick={() => currectProjectObj.isArchived ? null : DeleteMessage(record?._id)} style={{ display: 'flex', alignItems: 'center', color: !currectProjectObj.isArchived && 'red' }}>
                                            <RiDeleteBin7Line color={!currectProjectObj.isArchived && 'red'} size={18} style={{ marginRight: 5 }} />  Delete Daily Project
                                        </div>
                                    ),
                                },
                            ],
                        }}>
                            <MdOutlineSettings size={24} />
                        </Dropdown>
                    </>
                )
            },
        },
    ];


    const dailyData = ProjectReducer?.dailyProjectData;
    const sortedData = Array.isArray(dailyData)
        ? [...dailyData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];



    return (
        <>
            {contextHolder}
            <div className={Style.TableSection}>
                <Table footer={() => (
                    <>
                        {dailyData?.length > 0 && !ProjectReducer?.dailyProjectLoading &&
                            <>
                                {isNext &&
                                    <div style={{ textAlign: "center", padding: "0 0" }}>
                                        <button
                                            onClick={() => setPage(prev => prev + 1)}
                                            disabled={ProjectReducer?.dailyProjectLoading}
                                            style={{
                                                border: "1px solid #1890ff",
                                                background: "#1890ff",
                                                color: "white",
                                                padding: "6px 16px",
                                                borderRadius: "4px",
                                                cursor: ProjectReducer?.dailyProjectLoading ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {ProjectReducer?.dailyProjectLoading ? "Loading..." : "Load More"}
                                        </button>
                                    </div>
                                }
                            </>
                        }
                    </>
                )} pagination={false} loading={ProjectReducer?.dailyProjectLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
            </div>
        </>
    )
}

function mapStateToProps({ ProjectReducer }) {
    return { ProjectReducer };
}
export default connect(mapStateToProps, ProjectAction)(MyDailyProject);
