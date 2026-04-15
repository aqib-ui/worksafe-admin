import { useEffect, useState } from 'react'
import Style from './EnterpriseScreen.module.css'
import { Button, Drawer, Dropdown, Empty, Input, InputNumber, message, Modal, notification, Select, Skeleton, Table, Tag, Tooltip } from 'antd'
import * as EnterPriseAction from '../../../store/actions/Enterprise/index';
import { connect } from 'react-redux';
import { MdOutlineSettings } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { IoClose, IoEyeOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import { baseUrl } from '../../../store/config.json'


function EnterpriseScreen({ UserReducer, EnterpriseReducer, GetUsers, GetPackages }) {
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const user_id = localStorage.getItem("0U7Qv$N3tw69gV+T2/~1/w==");
    const [messageApi, contextHolder] = message.useMessage();
    const [createPackage, setCreatePackage] = useState(false)


    const [userPackage, setUserPackage] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState('')
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const openPackageDrawer = () => {
        setCreatePackage(true)
    }
    const closePackageDrawer = () => {
        setCreatePackage(false)
    }

    const logOut = () => {
        localStorage.clear();
        window.location.reload();
        navigate("/");
    }

    const [closeOk, setCloseOK] = useState(false)



    const openUserDrawer = (e) => {
        if (e == "6807b33e0130a126e001f295") {
            setCloseOK(true)
        }
        else {
            setCloseOK(false)
        }
        setSelectedPackage(e)
        setUserPackage(true)
    }
    const closeUserDrawer = () => {
        setCloseOK(false)
        setUserPackage(false)
        setSelectedRowKeys([])
    }

    useEffect(() => {
        GetUsers()
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
        if (EnterpriseReducer?.data?.length <= 0) {
            GetPackages()
        }
    }, [])



    const [numberTb, setNumberTb] = useState(1)
    const [packageLoading, setPackageLoading] = useState(false)


    const { data } = UserReducer




    const handleStrpiePayment = async () => {
        try {
            setPackageLoading(true)
            const response = await fetch(`${baseUrl}/payments/createcheckoutsessionForStorage/${data?.find(data => data?._id == localStorage.getItem('zP!4vBN#tw69gV+%2/+1/w=='))?.email}/${numberTb}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}`, },
            });
            if (response.ok) {
                const { data } = await response.json();
                setPackageLoading(false)
                window.location.href = data;
            } else {
                logOut()
                messageApi.destroy();
                messageApi.open({
                    type: "error",
                    content: "Failed to create payment session",
                });
                setPackageLoading(false)
            }
        } catch (error) {
            logOut()
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Failed to create payment session",
            });
            setPackageLoading(false)
        }
    };





    const [packageLoading2, setPackageLoading2] = useState(false)
    const [packageLoading3, setPackageLoading3] = useState(false)

    const handlePackage = async (e) => {
        if (selectedRowKeys.length >= 1) {
            setCloseOK(true)
            if (!closeOk) {
                if (selectedPackage == "6807b4030130a126e001f297" && selectedRowKeys.length <= 19) {
                    api.info({
                        message: `Notification`,
                        description:
                            'Based on your current number of users, Package One would be a more suitable option for you. Would you like me to help you with the upgrade?',
                        placement: 'bottomLeft',
                        onClose: () => setCloseOK(true)
                    });

                }
                else if (selectedPackage == "6807b48c0130a126e001f299" || "6807b4030130a126e001f297" && selectedRowKeys.length <= 49) {
                    api.info({
                        message: `Notification`,
                        description:
                            'Based on your current number of users, Package Two would be a more suitable option for you. Would you like me to help you with the upgrade?',
                        placement: 'bottomLeft',
                        onClose: () => setCloseOK(true)
                    });
                }
            }
            else {
                try {
                    setPackageLoading3(true)
                    const response = await fetch(`${baseUrl}/payments/createcheckoutsession/${data?.find(data => data?._id == localStorage.getItem('zP!4vBN#tw69gV+%2/+1/w=='))?.email}/${selectedPackage}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}`, },
                        body: JSON.stringify({ users: selectedRowKeys, isYearly: 'true' })
                    });
                    if (response.ok) {
                        const { data } = await response.json();
                        setPackageLoading3(false)
                        window.location.href = data;
                    }
                    else {
                        setPackageLoading3(false)
                        if (response.status == 400) {
                            if (selectedPackage == "6807b48c0130a126e001f299") {
                                messageApi.destroy();
                                messageApi.open({
                                    type: "error",
                                    content: "Minimum 50 users are required to purchase this package",
                                });
                            }
                            else {
                                messageApi.destroy();
                                messageApi.open({
                                    type: "error",
                                    content: "Minimum 20 users are required to purchase this package",
                                });
                            }

                        }
                        else {
                            messageApi.destroy();
                            messageApi.open({
                                type: "error",
                                content: "Something went wrong",
                            });
                        }
                    }
                } catch (error) {
                    logOut()
                    messageApi.destroy();
                    messageApi.open({
                        type: "error",
                        content: "Failed to create payment session",
                    });
                    setPackageLoading3(false)
                }
            }
        }
        else {
            messageApi.open({
                type: "error",
                content: "Please select user",
            });
        }
    };


    const handlePackage2 = async (e) => {
        if (selectedRowKeys.length >= 1) {
            setCloseOK(true)
            if (!closeOk) {
                if (selectedRowKeys.length <= 19 && selectedPackage !== "6807b33e0130a126e001f295") {
                    api.info({
                        message: `Notification`,
                        description:
                            'Based on your current number of users, Package One would be a more suitable option for you. Would you like me to help you with the upgrade?',
                        placement: 'bottomLeft',
                        onClose: () => setCloseOK(true)
                    });

                }
                else if (selectedRowKeys.length <= 49 && selectedPackage !== "6807b33e0130a126e001f295") {
                    api.info({
                        message: `Notification`,
                        description:
                            'Based on your current number of users, Package Two would be a more suitable option for you. Would you like me to help you with the upgrade?',
                        placement: 'bottomLeft',
                        onClose: () => setCloseOK(true)
                    });
                }
            }
            else {
                try {
                    setPackageLoading3(true)
                    const response = await fetch(`${baseUrl}/payments/createcheckoutsession/${data?.find(data => data?._id == localStorage.getItem('zP!4vBN#tw69gV+%2/+1/w=='))?.email}/${selectedPackage}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}`, },
                        body: JSON.stringify({ users: selectedRowKeys, isYearly: 'false' })
                    });
                    if (response.ok) {
                        const { data } = await response.json();
                        setPackageLoading3(false)
                        window.location.href = data;
                    }
                    else {
                        setPackageLoading3(false)
                        if (response.status == 400) {
                            if (selectedPackage == "6807b48c0130a126e001f299") {
                                messageApi.destroy();
                                messageApi.open({
                                    type: "error",
                                    content: "Minimum 50 users are required to purchase this package",
                                });
                            }
                            else {
                                messageApi.destroy();
                                messageApi.open({
                                    type: "error",
                                    content: "Minimum 20 users are required to purchase this package",
                                });
                            }

                        }
                        else {
                            messageApi.destroy();
                            messageApi.open({
                                type: "error",
                                content: "Something went wrong",
                            });
                        }
                    }
                } catch (error) {
                    logOut()
                    messageApi.destroy();
                    messageApi.open({
                        type: "error",
                        content: "Failed to create payment session",
                    });
                    setPackageLoading3(false)
                }
            }
        }
        else {
            messageApi.open({
                type: "error",
                content: "Please select user",
            });
        }
    }
    const [api, contextHolder2] = notification.useNotification();


    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: 200,
        },

        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 200,
            ellipsis: true,
        },
        {
            title: "Users",
            dataIndex: "users",
            key: "users",
            width: 200,
            ellipsis: true,
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: 200,
            ellipsis: true,
        },
        {
            title: "Storage",
            dataIndex: "real_storage",
            key: "real_storage",
            width: 200,
            ellipsis: true,
            render: (packageId) => (
                <p>{packageId}</p>
            ),
        },
        // {
        //     title: "Action",
        //     key: "action",
        //     className: " space-x-2",
        //     width: 100,
        //     ellipsis: true,
        //     render: (record) => {
        //         return (
        //             <>
        //                 <Dropdown trigger={['click']} menu={{
        //                     items: [
        //                         {
        //                             key: '4',
        //                             label: (
        //                                 <div onClick={() => openUserDrawer(record._id)} style={{ display: 'flex', alignItems: 'center' }}>
        //                                     Purchase This Package
        //                                 </div>
        //                             ),
        //                         },
        //                     ],
        //                 }}>
        //                     <MdOutlineSettings size={24} />
        //                 </Dropdown>
        //             </>
        //         )
        //     },
        // },
    ];



    const memberColumns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            ellipsis: true,
            width: 200,

        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            width: 200,
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: true,
        },
        {
            title: 'Package Name',
            dataIndex: 'package_id',
            key: 'expiry',
            width: 200,
            ellipsis: true,
            render: (expiry) => (
                <p> {expiry?.name != null && expiry?.name != "" && expiry?.name != undefined ? expiry?.name : "-"}</p>
            ),
        },
        {
            title: 'Package Expiry',
            dataIndex: 'expiry',
            key: 'expiry',
            width: 200,
            ellipsis: true,
            render: (expiry) => (
                expiry != null && expiry != "" && expiry != undefined ? expiry.split("T")[0] : "-"
            ),
        },

    ];
    const now = new Date();

    const rowSelection = {
        preserveSelectedRowKeys: false,
        getCheckboxProps: (record) => ({
            disabled: new Date(record.expiry) > now && selectedPackage == record.package_id?._id,
        }),
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };


    return (
        <>
            {contextHolder}
            {contextHolder2}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>Enterprise Packages</h1>
                    </div>
                    <div className={Style.ActionHeader}>
                        <div>
                        </div>
                        <div>
                            {user_id == "6768f37ff2ef345b103370df" || "67178f602714c2b7a4d2b411" &&
                                <Tooltip title={"Purchase storage"}>
                                    <button onClick={openPackageDrawer} className='Defaulbutton'>Purchase Storage</button>
                                </Tooltip>
                            }
                        </div>
                    </div>
                </div>
                <div className={Style.TableSection}>
                    <Table pagination={false} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} loading={EnterpriseReducer.loading} sticky={{ offsetHeader: 0 }} dataSource={EnterpriseReducer?.data?.filter(data => data._id !== "6807b48c0130a126e001f299")} columns={columns} />
                </div>



                <Drawer
                    title="Purchase Storage"
                    placement={"right"}
                    onClose={closePackageDrawer}
                    open={createPackage}
                    footer={
                        <div className={Style.FooterContainer}>
                            <button onClick={closePackageDrawer}>Close</button>
                            <button disabled={packageLoading} style={{ cursor: packageLoading ? 'not-allowed' : 'pointer' }} onClick={handleStrpiePayment}>{packageLoading ? 'Purchasing...' : 'Purchase'}</button>
                        </div>
                    }
                    maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                >

                    <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, flex: 1, paddingLeft: 3 }}>
                        <label>Number of Terabytes</label>
                        <Select
                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                            placeholder="Enter Number of TB's"
                            onChange={(e) => setNumberTb(e)}
                            disabled={packageLoading}
                            defaultValue={numberTb}
                            max={10} maxLength={2} min={1}
                            style={{ marginTop: 3, width: "100%", height: 45, display: 'flex', alignItems: 'center' }}
                            options={[
                                { value: 1, label: '1' },
                                { value: 2, label: '2' },
                                { value: 3, label: '3' },
                                { value: 4, label: '4' },
                                { value: 5, label: '5' },
                                { value: 6, label: '6' },
                                { value: 7, label: '7' },
                                { value: 8, label: '8' },
                                { value: 9, label: '9' },
                                { value: 10, label: '10' },
                            ]}
                        />
                        {/* <InputNumber disabled={packageLoading} defaultValue={numberTb} keyboard={false} placeholder="Enter Number of TB's" style={{ height: 45, marginTop: 3, width: '100%' }} /> */}
                    </div>
                    <div>
                        <p>Total bill: ${numberTb * 10}</p>
                    </div>
                </Drawer>

                <Drawer
                    size={'large'}
                    title="Purchase Package"
                    placement={"right"}
                    onClose={closeUserDrawer}
                    open={userPackage}
                    footer={
                        <div className={Style.FooterContainer}>
                            <button onClick={closeUserDrawer}>Close</button>
                            <button disabled={packageLoading2 || packageLoading3} style={{ cursor: packageLoading2 || packageLoading3 ? 'not-allowed' : 'pointer' }} onClick={handlePackage}>{packageLoading2 ? 'Purchasing...' : 'Purchase yearly'}</button>
                            <button disabled={packageLoading3 || packageLoading2} style={{ cursor: packageLoading3 || packageLoading2 ? 'not-allowed' : 'pointer' }} onClick={handlePackage2}>{packageLoading3 ? 'Purchasing...' : 'Purchase Monthly'}</button>
                        </div>
                    }
                    maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                >
                    <Table rowClassName={record => !record.enabled && "disabled-row"}
                        scroll={{ x: 'max-content' }} rowKey={(record) => record._id} rowSelection={{
                            ...rowSelection,
                            selectedRowKeys
                        }} sticky={{ offsetHeader: 0 }} dataSource={UserReducer?.data} columns={memberColumns} />
                </Drawer>

            </div >
        </>
    )
}

function mapStateToProps({ EnterpriseReducer, UserReducer }) {
    return { EnterpriseReducer, UserReducer };
}
export default connect(mapStateToProps, EnterPriseAction)(EnterpriseScreen);
