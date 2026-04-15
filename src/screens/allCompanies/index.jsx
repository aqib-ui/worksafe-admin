import { useEffect, useState } from 'react'
import Style from './allCompanies.module.css'
import { Button, Drawer, Dropdown, Empty, Input, InputNumber, message, Modal, notification, Select, Skeleton, Space, Table, Tag, Tooltip } from 'antd'
import * as EnterPriseAction from '../../../store/actions/Enterprise/index';
import { connect } from 'react-redux';
import { MdOutlineSettings } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { IoClose, IoEyeOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import { baseUrl } from '../../../store/config.json'
import ReactTimeAgo from 'react-time-ago';
import ListInputSearch from '../../component/ListInputSearch';


function AllCompanies({ EnterpriseReducer, GetAllCompanies, EditCompany }) {
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const [messageApi, contextHolder] = message.useMessage();
    const [page, setPage] = useState(0);





    useEffect(() => {
        if (!messageApi) return;
        if (EnterpriseReducer.networkError == true) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
    }, [
        EnterpriseReducer.networkError,
        messageApi,
    ]);



    useEffect(() => {
        GetAllCompanies()
    }, [])


    const EditSetting = async (body) => {
        if (body?.type == "isVerified") {
            await EditCompany(
                {
                    isTester: body?.isTester,
                    isVerified: body?.value,
                    companyId: body?._id
                }
            )
        }
        if (body?.type == "isTester") {
            await EditCompany(
                {
                    isTester: body?.value,
                    isVerified: body?.isVerified,
                    companyId: body?._id
                }
            )
        }
        GetAllCompanies()
    }


    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: 200,
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
            title: "Is Verified",
            key: "createAt",
            width: 200,
            ellipsis: true,
            render: (users) => (
                <Space direction="vertical">
                    <Select
                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                        placeholder="Is Verified"
                        max={10} maxLength={2} min={1}
                        defaultValue={users?.isVerified}
                        style={{ width: 140, height: 30, display: 'flex', alignItems: 'center' }}
                        options={[
                            { value: true, label: 'Yes' },
                            { value: false, label: 'No' },
                        ]}
                        onChange={(e) => EditSetting({ ...users, value: e, type: "isVerified" })}
                    />
                </Space>
            ),
        },
        {
            title: "Company Type",
            key: "createAt",
            width: 200,
            ellipsis: true,
            render: (users) => (
                <Space direction="vertical">
                    <Select
                        placeholder="Company Type"
                        max={10} maxLength={2} min={1}
                        defaultValue={users?.isTester}
                        style={{ width: 140, height: 30, display: 'flex', alignItems: 'center' }}
                        options={[
                            { value: true, label: 'Tester' },
                            { value: false, label: 'Customer' },
                        ]}
                        onChange={(e) => EditSetting({ ...users, value: e, type: "isTester" })}
                    />
                </Space>
            ),
        },

    ];


    const [query, setQuery] = useState('')



    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>All Companies</h1>
                    </div>
                    <div className={Style.ActionHeader}>
                        <div>
                        </div>
                        <div>
                            <ListInputSearch onChange={setQuery} value={query} placeholder="Search Company" debounceTime={500} />
                        </div>
                    </div>
                </div>
                <div className={Style.TableSection}>
                    <Table pagination={false} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} loading={EnterpriseReducer.alladminCompaniesLoading} sticky={{ offsetHeader: 0 }} dataSource={EnterpriseReducer?.alladminCompanies.filter(x => x.name.toLowerCase().includes(query.toLowerCase()))} columns={columns} />
                </div>
            </div >
        </>
    )
}

function mapStateToProps({ EnterpriseReducer, UserReducer }) {
    return { EnterpriseReducer, UserReducer };
}
export default connect(mapStateToProps, EnterPriseAction)(AllCompanies);
