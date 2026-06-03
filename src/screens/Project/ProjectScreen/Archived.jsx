import { useEffect, useState } from 'react'
import Style from './ProjectScreen.module.css'
import { Dropdown, message, Space, Table, Tag, Tooltip, } from 'antd'
import * as ProjectAction from '../../../../store/actions/Project/index';
import { connect, useDispatch } from 'react-redux';
import { MdOutlineSettings } from 'react-icons/md';
import ReactTimeAgo from 'react-time-ago';
import { IoEyeOutline } from 'react-icons/io5';
import { useNavigate, useOutletContext } from 'react-router';
import ListInputSearch from '../../../component/ListInputSearch';
import { FiPlus } from 'react-icons/fi';
import ProjectFilter from './ProjectFilter';



function ArchivedProject({ ProjectReducer, GetArchivedProjects }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [page, setPage] = useState(1)
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    // const { query } = useOutletContext();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')

    const [paramsNew, setParamsNew] = useState(null)



    const [isNext, setIsNext] = useState(true)
    useEffect(() => {
        const init = async () => {
            const totalLegngth = await GetArchivedProjects(workSite, page, query,paramsNew && paramsNew,setIsNext)
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
    }, [
        ProjectReducer.networkError,
        ProjectReducer.projectExpiredError,
        messageApi,
    ]);


    const viewWorkOrder = (eId) => {
        localStorage.setItem("Nq5#eKY6uw^2hX$A8_/4jt==", eId)
        window.location.reload()
        window.location.href = '/project/read';
    }
    const editProject = (eId) => {
        localStorage.setItem("La7#tMV1jx!4oC+R8/=3&b==", eId)
        window.location.reload()
        window.location.href = '/POI/edit';
    }


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
                            ],
                        }}>
                            <MdOutlineSettings size={24} />
                        </Dropdown>
                    </>
                )
            },
        },
    ];


    // const sortedData = [...ProjectReducer?.archivedProjectData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
                <div style={{display:"flex",alignItems:'center'}}>
                    <ListInputSearch onChange={setQuery} value={query} placeholder="Search Projects" debounceTime={500}/>
                    <ProjectFilter setPage={setPage} setIsNext={setIsNext} setParamsNew={setParamsNew} loading={ProjectReducer?.archivedProjectLoading} GetPOI={GetArchivedProjects} workSite={workSite} page={page} searchQuery={query} />
                </div>
            </div>
            <div className={Style.TableSection}>
                <Table footer={() => (
                    <>
                        {ProjectReducer?.archivedProjectData?.length > 0 && !ProjectReducer?.archivedProjectLoading &&
                            <>
                                {isNext &&
                                    <div style={{ textAlign: "center", padding: "0 0" }}>
                                        <button
                                            onClick={() => setPage(prev => prev + 1)}
                                            disabled={ProjectReducer?.archivedProjectLoading}
                                            style={{
                                                border: "1px solid #1890ff",
                                                background: "#1890ff",
                                                color: "white",
                                                padding: "6px 16px",
                                                borderRadius: "4px",
                                                cursor: ProjectReducer?.archivedProjectLoading ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {ProjectReducer?.archivedProjectLoading ? "Loading..." : "Load More"}
                                        </button>
                                    </div>
                                }
                            </>
                        }
                    </>
                )} pagination={false} loading={ProjectReducer?.archivedProjectLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={ProjectReducer?.archivedProjectData} />
            </div>
        </>
    )
}

function mapStateToProps({ ProjectReducer }) {
    return { ProjectReducer };
}
export default connect(mapStateToProps, ProjectAction)(ArchivedProject);