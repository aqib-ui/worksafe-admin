import { useEffect, useState } from 'react'
import Style from './ProjectScreen.module.css'
import { Dropdown, message, Space, Table, Tag, } from 'antd'
import * as ProjectAction from '../../../../store/actions/Project/index';
import { connect, useDispatch } from 'react-redux';
import { MdOutlineSettings } from 'react-icons/md';
import ReactTimeAgo from 'react-time-ago';
import { IoEyeOutline } from 'react-icons/io5';
import { useNavigate, useOutletContext } from 'react-router';



function ArchivedProject({ ProjectReducer, GetArchivedProjects }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [page, setPage] = useState(1)
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const { searchQuery } = useOutletContext();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isNext, setIsNext] = useState(true)
    useEffect(() => {
        const init = async () => {
            const totalLegngth = await GetArchivedProjects(workSite, page, searchQuery)
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


    const sortedData = [...ProjectReducer?.archivedProjectData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <>
            {contextHolder}
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
                )} pagination={false} loading={ProjectReducer?.archivedProjectLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
            </div>
        </>
    )
}

function mapStateToProps({ ProjectReducer }) {
    return { ProjectReducer };
}
export default connect(mapStateToProps, ProjectAction)(ArchivedProject);