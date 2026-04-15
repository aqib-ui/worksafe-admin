import { useEffect, useState } from 'react'
import Style from './PaymentScreen.module.css'
import { message, Space, Table, Tag } from 'antd'
import * as PaymentAction from '../../../store/actions/Payment/index';
import { connect } from 'react-redux';
import ReactTimeAgo from 'react-time-ago';

function PaymentScreen({ PaymentReducer, GetPayment }) {
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (!messageApi) return;
        if (PaymentReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
    }, [
        PaymentReducer.networkError,
        messageApi,
    ]);
    useEffect(() => {
        GetPayment()
    }, [])


    const columns = [
        {
            title: "Package Name",
            key: "PackageName",
            render: (users) => (
                <Space direction="vertical">
                    <p>{users?.packageId?.name}</p>
                </Space>
            ),
            ellipsis: true,
            width: 200,
        },

        {
            title: "Company Name",
            key: "CompanyName",
            render: (users) => (
                <Space direction="vertical">
                    <p>{users?.company?.name}</p>
                </Space>
            ),
            ellipsis: true,
            width: 200,
        },
        {
            title: "Total Amount",
            key: "TotalAmount",
            render: (packageId) => (
                <Space direction="vertical">
                    <p>${packageId?.amount}</p>
                </Space>
            ),
            ellipsis: true,
            width: 200,
        },
        {
            title: "License",
            key: "License",
            render: (packageId) => (
                <Space direction="vertical">
                    <p>{packageId?.license}</p>
                </Space>
            ),
            ellipsis: true,
            width: 200,
        },
        {
            title: "Created at",
            key: "License",
            render: (packageId) => (
                <Space direction="vertical">
                    <ReactTimeAgo date={packageId?.createdAt} locale="en-US" />
                </Space>
            ),
            ellipsis: true,
            width: 200,
        },
    ];


    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>Payment Management</h1>
                    </div>
                    <div className={Style.ActionHeader}>
                    </div>
                </div>
                <div className={Style.TableSection}>
                    <Table pagination={false} scroll={{ x: 'max-content' }} loading={PaymentReducer.loading} sticky={{ offsetHeader: 0 }} dataSource={PaymentReducer?.data} columns={columns} />
                </div>
            </div >
        </>
    )
}

function mapStateToProps({ PaymentReducer }) {
    return { PaymentReducer };
}
export default connect(mapStateToProps, PaymentAction)(PaymentScreen);
