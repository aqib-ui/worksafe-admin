import { useEffect, useState } from 'react'
import Style from './EvacuateList.module.css'
import { Dropdown, message, Select, Space, Switch, Table, Tag } from 'antd'
import * as EvacuationAction from '../../../../store/actions/Project/index';
import { connect, useDispatch, useSelector } from 'react-redux';
import { MdOutlineSettings } from 'react-icons/md';
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago';
import { IoCheckmark, IoClose, IoEyeOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useNavigate, useOutletContext } from 'react-router';
import { TASK_CLEAR_EXPIRED, TASK_GET_ARCHIVED_PROJECT_COMPLETE, TASK_GET_PROJECT_COMPLETE, TASK_LOAD_EVACUATE_COMPLETE } from '../../../../store/actions/types';
import { baseUrl } from '../../../../store/config.json'
import io from 'socket.io-client'


function MyProject({ EvacuateReducer }) {
    const [messageApi, contextHolder] = message.useMessage();
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==");
    const dispatch = useDispatch()
    const prevEvacuationData = useSelector(
        (state) => state.EvacuateReducer.EvacauteData || []
    );

    useEffect(() => {
        if (!messageApi) return;
        if (EvacuateReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
    }, [
        EvacuateReducer.networkError,
        messageApi,
    ]);



    const statusChanged = (ListId, status) => {
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const socket = io(`${baseUrl}/chat`, {
            transports: ["websocket"],
            query: { authorization: `Bearer ${token}` },
        });
        socket.on("connect", () => {
            socket.emit("updateEvacuationResolvedStatus", {
                evacuationId: ListId,
                isResolved: status,
                worksiteId: currentWorkSite,
            });
        });
        dispatch({
            type: TASK_LOAD_EVACUATE_COMPLETE,
            loading: false,
            payload: [
                ...prevEvacuationData.map((data) =>
                    data._id === ListId ? { ...data, isResolved: true } : data
                ),
            ],
        });
    };


    const viewWorkOrder = (eId, resolved) => {
        localStorage.setItem("$%^YHAS5(UA*&TSDY&&X$A8_/aA^IUY8==", resolved)
        localStorage.setItem("SSEq5#KJ&QYG^2hY&*&X$A8_/aA^y8==", eId)
        window.location.reload()
        window.location.href = '/evacuate';
    }
    const columns = [
        {
            title: "Title",
            width: 200,
            ellipsis: true,
            render: (users, user, index) => (
                <Space direction="vertical">
                    <p style={{ cursor: 'pointer' }} onClick={() => viewWorkOrder(users?._id, users?.isResolved)}>{`Evacuation-${index + 1}`}</p>
                </Space>
            )
        },

        {
            title: "Creator Name",
            width: 200,
            ellipsis: true,
            render: (users) => (
                <Space direction="vertical">
                    <p style={{ cursor: 'pointer' }}>{`${users?.created_by?.firstName} ${users?.created_by?.lastName}`}</p>
                </Space>
            ),
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
            title: "Status",
            key: "createAt",
            width: 200,
            ellipsis: true,
            render: (users) => (
                <Space direction="vertical">
                    <Select
                        placeholder="Resolve Status"
                        max={10}
                        maxLength={2}
                        defaultValue={users?.isResolved}
                        disabled={users?.isResolved}
                        min={1}
                        style={{ width: 140, height: 30, display: 'flex', alignItems: 'center' }}
                        options={[
                            { value: false, label: 'Active' },
                            { value: true, label: 'Resolved' },
                        ]}
                        onChange={(e) => statusChanged(users?._id, e)}
                    />
                </Space>
            ),
        },
    ];

    const sortedData = [...EvacuateReducer?.EvacauteData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return (
        <>
            {contextHolder}
            <div className={Style.TableSection}>
                <Table pagination={false} loading={EvacuateReducer?.EvacauteLoading} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} sticky={{ offsetHeader: 0 }} columns={columns} dataSource={sortedData} />
            </div>
        </>
    )
}

function mapStateToProps({ EvacuateReducer }) {
    return { EvacuateReducer };
}
export default connect(mapStateToProps, EvacuationAction)(MyProject);
