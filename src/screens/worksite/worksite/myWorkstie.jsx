import { useEffect, useState } from 'react'
import Style from './worksite.module.css'
import { Dropdown, message, Space, Table, Tag } from 'antd'
import * as WorksiteAction from '../../../../store/actions/Worksite/index';
import { connect, useDispatch } from 'react-redux';
import { MdOutlineSettings } from 'react-icons/md';
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago';
import { IoCheckmark, IoClose, IoEyeOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useNavigate, useOutletContext } from 'react-router';
import { TASK_CLEAR_EXPIRED, TASK_GET_ALERTS_COMPLETE, TASK_GET_ARCHIVED_ALERTS_COMPLETE } from '../../../../store/actions/types';


function MyWorksite({ WorksiteReducer, GetWorkSite }) {
    const [messageApi, contextHolder] = message.useMessage();
    
    useEffect(() => {
        GetWorkSite()
    }, [])

    // useEffect(() => {
    //     if (!messageApi) return;
    //     if (WorksiteReducer.networkError) {
    //         messageApi.destroy();
    //         messageApi.open({
    //             type: "error",
    //             content: "Something went wrong, please try again",
    //         });
    //     }
    // }, [
    //     WorksiteReducer.networkError,
    //     messageApi,
    // ]);


    const viewWorkOrder = (eId) => {
        localStorage.setItem("Bm_8Xr#Q+21fGt!zY@Hj6Lp", eId)
        window.location.reload()
        window.location.href = '/worksite/read';
    }
    const editProject = (eId) => {
        localStorage.setItem("Qe!47Xw+Tz@p9KbL#3yVNr", eId)
        window.location.reload()
        window.location.href = '/worksite/edit';
    }



    const columns = [
        {
            title: "Worksite Title",
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
                        width: 100
                    }}>{text}</div>
                )
            },
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 200,
            ellipsis: false,
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
                                            <IoEyeOutline size={18} style={{ marginRight: 5 }} /> View Worksite
                                        </div>
                                    ),
                                },
                                {
                                    key: '4',
                                    label: (
                                        <div onClick={() => editProject(record?._id)} style={{ display: 'flex', alignItems: 'center' }}>
                                            <MdOutlineModeEditOutline size={18} style={{ marginRight: 5 }} /> Edit Worksite
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

    const sortedData = [...WorksiteReducer?.worksite].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <>
            {contextHolder}
            <div className={Style.TableSection}>
                <Table tableLayout="fixed" pagination={false} loading={WorksiteReducer?.worksiteLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
            </div>
        </>
    )
}

function mapStateToProps({ WorksiteReducer }) {
    return { WorksiteReducer };
}
export default connect(mapStateToProps, WorksiteAction)(MyWorksite);
