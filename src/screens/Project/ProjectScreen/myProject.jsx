import { useEffect, useState } from 'react'
import Style from './ProjectScreen.module.css'
import { Dropdown, message, Space, Table, Tag, Tooltip } from 'antd'
import * as ProjectAction from '../../../../store/actions/Project/index';
import { connect, useDispatch } from 'react-redux';
import { MdOutlineSettings } from 'react-icons/md';
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago';
import { IoCheckmark, IoClose, IoEyeOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useNavigate, useOutletContext } from 'react-router';
import { TASK_CLEAR_EXPIRED, TASK_GET_ARCHIVED_PROJECT_COMPLETE, TASK_GET_PROJECT_COMPLETE } from '../../../../store/actions/types';
import ListInputSearch from '../../../component/ListInputSearch';
import { FiPlus } from 'react-icons/fi';
import PoiFilter from '../../PoiScreen/POIScreen/poiFilter';
import ProjectFilter from './ProjectFilter';


function MyProject({ ProjectReducer, GetProjects, ArchiveProject }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [page, setPage] = useState(1)
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    // const { searchQuery } = useOutletContext();
    const [query, setQuery] = useState('')

    const [paramsNew, setParamsNew] = useState(null)


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isNext, setIsNext] = useState(true)
    useEffect(() => {
        const init = async () => {
            const totalLegngth = await GetProjects(workSite, page, query, paramsNew && paramsNew, setIsNext)
        }
        init()
    }, [page, query])

    useEffect(() => {
        if (!messageApi) return;
        if (ProjectReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (ProjectReducer.projectExpiredError) {
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
        if (ProjectReducer.projectDeleteLoading) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Loading...",
            });
        }
        if (ProjectReducer.projectDelete) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Project archived successfully",
            });
            dispatch({ type: TASK_GET_ARCHIVED_PROJECT_COMPLETE, loading: true, payload: [] });
            dispatch({ type: TASK_GET_PROJECT_COMPLETE, loading: true, payload: [] });
            runAgain()
        }
    }, [
        ProjectReducer.networkError,
        ProjectReducer.projectExpiredError,
        ProjectReducer.projectDelete,
        ProjectReducer.projectDeleteLoading,
        messageApi,
    ]);


    const runAgain = async () => {
        const totalLegngth = await GetProjects(workSite, page, searchQuery, paramsNew && paramsNew, setIsNext)
    }


    const viewWorkOrder = (eId) => {
        localStorage.setItem("Nq5#eKY6uw^2hX$A8_/4jt==", eId)
        window.location.reload()
        window.location.href = '/project/read';
    }
    const editProject = (eId) => {
        localStorage.setItem("Lp7%wDA2ty#6cU*Z5+_3ho==", eId)
        window.location.reload()
        window.location.href = '/project/edit';
    }


    const DeleteMessage = (_id) => {
        messageApi.open({
            type: 'warning',
            content: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    Are you sure you want to archive this Project
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className={Style.CloseBtn} onClick={() => messageApi.destroy()}><IoClose size={20} color='white' /></button>
                        <button className={Style.CheckBtn} onClick={() => ArchiveProject(_id)} ><IoCheckmark size={20} color='white' /></button>
                    </div>
                </div>
            ),
        });
    };

    const columns = [
        {
            title: "Project Title",
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
                    <ReactTimeAgo date={users?.updatedAt} locale="en-US" />
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
                                            <IoEyeOutline size={18} style={{ marginRight: 5 }} /> View Project
                                        </div>
                                    ),
                                },
                                {
                                    key: '4',
                                    label: (
                                        <div onClick={() => editProject(record?._id)} style={{ display: 'flex', alignItems: 'center' }}>
                                            <MdOutlineModeEditOutline size={18} style={{ marginRight: 5 }} /> Edit Project
                                        </div>
                                    ),
                                },
                                {
                                    key: '19',
                                    label: (
                                        <div onClick={() => DeleteMessage(record?._id)} style={{ display: 'flex', alignItems: 'center', color: 'red' }}>
                                            <RiDeleteBin7Line color='red' size={18} style={{ marginRight: 5 }} />  Archived Project
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

    // const sortedData = [...ProjectReducer?.projectData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const removeTemp = () => {
        localStorage.removeItem('Wm8^pLC7ux$5kJ~E2-/3zq==')
        localStorage.removeItem('Rd9!tMQ4vz#1gN*B6_+7@x==')
    }

    return (
        <>
            {contextHolder}
            <div className={Style.TabHeader}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button style={location.pathname == "/project/my-project" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/project/my-project')}>Projects</button>
                    <button style={location.pathname == "/project/archived" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/project/archived')}>Archived</button>
                    <Tooltip title={"Create Project"}>
                        <button onClick={() => {
                            removeTemp()
                            navigate('/project/create')
                        }} style={location.pathname == "/project/create" ? { border: '1px solid #214CBC', color: "#214CBC" } : null}><FiPlus color='#214CBC' size={22} /></button>
                    </Tooltip>
                </div>
                <div style={{ display: "flex", alignItems: 'center' }}>
                    <ListInputSearch onChange={setQuery} value={query} placeholder="Search Projects" debounceTime={500} />
                    <ProjectFilter setPage={setPage} setIsNext={setIsNext} setParamsNew={setParamsNew} loading={ProjectReducer?.projectLoading} GetPOI={GetProjects} workSite={workSite} page={page} searchQuery={query} />
                </div>
            </div>
            <div className={Style.TableSection}>
                <Table footer={() => (
                    <>
                        {ProjectReducer?.projectData.length > 0 && !ProjectReducer?.projectLoading &&
                            <>
                                {isNext &&
                                    <div style={{ textAlign: "center", padding: "0 0" }}>
                                        <button
                                            onClick={() => setPage(prev => prev + 1)}
                                            disabled={ProjectReducer?.projectLoading}
                                            style={{
                                                border: "1px solid #1890ff",
                                                background: "#1890ff",
                                                color: "white",
                                                padding: "6px 16px",
                                                borderRadius: "4px",
                                                cursor: ProjectReducer?.projectLoading ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {ProjectReducer?.projectLoading ? "Loading..." : "Load More"}
                                        </button>
                                    </div>
                                }
                            </>
                        }
                    </>
                )} pagination={false} loading={ProjectReducer?.projectLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={ProjectReducer?.projectData} />
            </div>
        </>
    )
}

function mapStateToProps({ ProjectReducer }) {
    return { ProjectReducer };
}
export default connect(mapStateToProps, ProjectAction)(MyProject);
