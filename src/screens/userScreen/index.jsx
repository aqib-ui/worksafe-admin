import { useEffect, useState } from 'react'
import Style from './UserScreen.module.css'
import { Button, Drawer, Dropdown, Empty, message, Skeleton, Table } from 'antd'
import * as UserAction from '../../../store/actions/Users/index';
import { connect } from 'react-redux';
import { MdOutlineSettings } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import { baseUrl } from '../../../store/config.json'

function UserScreen({ UserReducer, GetUsers, DeleteUser, RecoverUser, GetPackages, RecoverPayment }) {
    const role_ids = localStorage.getItem("0U7Qv$N3tw69gV+T2/~1/w==");
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const userRole = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')?.trim()
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedPackage, setSelectPackage] = useState("")
    const [packageLoading, setPackageLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState("")
    const [open, setOpen] = useState(false);



    const showDrawer = () => {
        GetPackages()
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        setSelectPackage("")
    };
    useEffect(() => {
        if (!messageApi) return;
        if (UserReducer.networkError == true) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (UserReducer.deleteLoading == true) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "User deleting...",
                duration: 100,
            });
        }
        if (UserReducer.deleteSuccess == true) {
            GetUsers()
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "User deleted successfully",
            });
        }
        if (UserReducer.recoverLoading == true) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "User recovering...",
                duration: 100,
            });
        }
        if (UserReducer.recoverSuccess == true) {
            GetUsers()
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "User recovered successfully",
            });
        }
        if (UserReducer.paymentRecoverLoading == true) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Payment recovering...",
                duration: 100,
            });
        }
        if (UserReducer.paymentRecoverSuccess == true) {
            GetUsers()
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Payment recovered successfully",
            });
        }
    }, [
        UserReducer.networkError,
        UserReducer.deleteLoading,
        UserReducer.deleteSuccess,
        UserReducer.recoverLoading,
        UserReducer.recoverSuccess,
        UserReducer.paymentRecoverSuccess,
        UserReducer.paymentRecoverLoading,
        messageApi,
    ]);

    useEffect(() => {
        GetUsers()
    }, [])



    const DeleteMessage = (_id) => {
        messageApi.open({
            type: 'warning',
            content: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    Are you sure you want to delete this user
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className={Style.CloseBtn} onClick={() => messageApi.destroy()}><IoClose size={20} color='white' /></button>
                        <button className={Style.CheckBtn} onClick={() => DeleteUser(_id)}><IoCheckmark size={20} color='white' /></button>
                    </div>
                </div>
            ),
        });
    };
    const RecoverMessage = (_id) => {
        messageApi.open({
            type: 'warning',
            content: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    Are you sure you want to recover this user
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className={Style.CloseBtn} onClick={() => messageApi.destroy()}><IoClose size={20} color='white' /></button>
                        <button className={Style.CheckBtn} onClick={() => RecoverUser(_id)}><IoCheckmark size={20} color='white' /></button>
                    </div>
                </div>
            ),
        });
    };
    const RecoverPaymentF = (_id) => {
        messageApi.open({
            type: 'warning',
            content: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    Are you sure you want to recover this payment
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className={Style.CloseBtn} onClick={() => messageApi.destroy()}><IoClose size={20} color='white' /></button>
                        <button className={Style.CheckBtn} onClick={() => RecoverPayment(_id)}><IoCheckmark size={20} color='white' /></button>
                    </div>
                </div>
            ),
        });
    };
    const columns = [
        {
            title: "First Name",
            dataIndex: "firstName",
            key: "firstName",
            width: 100,
            ellipsis: false,
        },
        {
            title: "Last Name",
            dataIndex: "lastName",
            key: "lastName",
            width: 100,
            ellipsis: false,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Role Name",
            dataIndex: ["role_id", "roleName"],
            key: "role_id.roleName",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Verified",
            dataIndex: "isVerified",
            key: "isVerified",
            ellipsis: true,
            width: 100,
            render: (text, record) => {
                return (
                    record.isVerified ?
                        <div className={Style.YesTag}>Yes</div>
                        :
                        <div className={Style.NoTag}>No</div>

                )
            },
        },
        {
            title: "Premium",
            dataIndex: "isPremium",
            key: "isPremium",
            ellipsis: true,
            width: 100,
            render: (text, record) => {
                return (
                    record.expiry >= new Date().toISOString() ?
                        <div className={Style.YesTag}>Yes</div>
                        :
                        <div className={Style.NoTag}>No</div>

                )
            },
        },
        {
            title: "Expiry",
            dataIndex: "expiry",
            key: "expiry",
            width: 200,
            ellipsis: true,
            render: (expiry) => (expiry != null && expiry != "" && expiry != undefined ? expiry.split("T")[0] : ""),
        },
        {
            title: "Action",
            key: "action",
            className: " space-x-2",
            ellipsis: true,
            width: 100,
            render: (text, record) => {
                return (
                    <>
                        <Dropdown trigger={['click']} menu={{
                            items: record.isPremium && role_ids == "6768f37ff2ef345b103370df" ? [
                                {
                                    key: '1',
                                    label: (
                                        <div onClick={() => record.isDelete ? RecoverMessage(record._id) : DeleteMessage(record._id)} style={{ color: !record.isDelete ? 'red' : '#214CBC' }}>
                                            {record.isDelete ? "Recover" : "Delete"}
                                        </div>
                                    ),
                                },
                                // {
                                //     key: '2',
                                //     label: (
                                //         <div onClick={() => {
                                //             showDrawer()
                                //             setSelectedUser(record)
                                //         }}>
                                //             Make Payment
                                //         </div>
                                //     ),
                                // },
                                {
                                    key: '3',
                                    label: (
                                        <div onClick={() => RecoverPaymentF(record._id)}>
                                            Recover Payment
                                        </div>
                                    ),
                                },
                            ] : [
                                {
                                    key: '1',
                                    label: (
                                        <div onClick={() => record.isDelete ? RecoverMessage(record._id) : DeleteMessage(record._id)} style={{ color: !record.isDelete ? 'red' : '#214CBC' }}>
                                            {record.isDelete ? "Recover" : "Delete"}
                                        </div>
                                    ),
                                },
                                // {
                                //     key: '2',
                                //     label: (
                                //         <div onClick={() => {
                                //             showDrawer()
                                //             setSelectedUser(record)
                                //         }}>
                                //             Make Payment
                                //         </div>
                                //     ),
                                // },
                            ]
                        }} placement="bottomLeft" arrow>
                            <div style={{ paddingInline: 7, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                <MdOutlineSettings color='black' size={26} />
                            </div>
                        </Dropdown>
                    </>
                )
            },
        },
    ];

    const Admincolumns = [
        {
            title: "First Name",
            dataIndex: "firstName",
            key: "firstName",
            width: 100,
            ellipsis: false,
        },
        {
            title: "Last Name",
            dataIndex: "lastName",
            key: "lastName",
            width: 100,
            ellipsis: false,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Role Name",
            dataIndex: ["role_id", "roleName"],
            key: "role_id.roleName",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Delete",
            dataIndex: "isDelete",
            key: "isDelete",
            ellipsis: true,
            width: 100,
            render: (text, record) => {
                return (
                    record.isDelete ?
                        <div className={Style.YesTag}>Yes</div>
                        :
                        <div className={Style.NoTag}>No</div>

                )
            },
        },
        {
            title: "Verified",
            dataIndex: "isVerified",
            key: "isVerified",
            ellipsis: true,
            width: 100,
            render: (text, record) => {
                return (
                    record.isVerified ?
                        <div className={Style.YesTag}>Yes</div>
                        :
                        <div className={Style.NoTag}>No</div>

                )
            },
        },
        {
            title: "Premium",
            dataIndex: "isPremium",
            key: "isPremium",
            ellipsis: true,
            width: 100,
            render: (text, record) => {
                return (
                    record.expiry >= new Date().toISOString() ?
                        <div className={Style.YesTag}>Yes</div>
                        :
                        <div className={Style.NoTag}>No</div>

                )
            },
        },
        {
            title: "Expiry",
            dataIndex: "expiry",
            key: "expiry",
            width: 200,
            ellipsis: true,
            render: (expiry) => (expiry != null && expiry != "" && expiry != undefined ? expiry.split("T")[0] : ""),
        },
        {
            title: "Action",
            key: "action",
            className: " space-x-2",
            ellipsis: true,
            width: 100,
            render: (text, record) => {
                return (
                    <>
                        <Dropdown trigger={['click']} menu={{
                            items: record.isPremium && role_ids == "6768f37ff2ef345b103370df" ? [
                                {
                                    key: '1',
                                    label: (
                                        <div onClick={() => record.isDelete ? RecoverMessage(record._id) : DeleteMessage(record._id)} style={{ color: !record.isDelete ? 'red' : '#214CBC' }}>
                                            {record.isDelete ? "Recover" : "Delete"}
                                        </div>
                                    ),
                                },
                                // {
                                //     key: '2',
                                //     label: (
                                //         <div onClick={() => {
                                //             showDrawer()
                                //             setSelectedUser(record)
                                //         }}>
                                //             Make Payment
                                //         </div>
                                //     ),
                                // },
                                {
                                    key: '3',
                                    label: (
                                        <div onClick={() => RecoverPaymentF(record._id)}>
                                            Recover Payment
                                        </div>
                                    ),
                                },
                            ] : [
                                {
                                    key: '1',
                                    label: (
                                        <div onClick={() => record.isDelete ? RecoverMessage(record._id) : DeleteMessage(record._id)} style={{ color: !record.isDelete ? 'red' : '#214CBC' }}>
                                            {record.isDelete ? "Recover" : "Delete"}
                                        </div>
                                    ),
                                },
                                // {
                                //     key: '2',
                                //     label: (
                                //         <div onClick={() => {
                                //             showDrawer()
                                //             setSelectedUser(record)
                                //         }}>
                                //             Make Payment
                                //         </div>
                                //     ),
                                // },
                            ]
                        }} placement="bottomLeft" arrow>
                            <div style={{ paddingInline: 7, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                <MdOutlineSettings color='black' size={26} />
                            </div>
                        </Dropdown>
                    </>
                )
            },
        },
    ];
    const handleStrpiePayment = async () => {
        try {
            setPackageLoading(true)
            const response = await fetch(`${baseUrl}/payments/createcheckoutsession/${selectedUser?.email}/${selectedPackage}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}`, },
            });
            if (response.ok) {
                const { data } = await response.json();
                setPackageLoading(false)
                window.location.href = data;
            } else {
                message.error("Failed to create payment session");
                setPackageLoading(false)
            }
        } catch (error) {
            message.error("Error creating payment session");
            setPackageLoading(false)
        }
    };

    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>User Management</h1>
                    </div>
                    <div className={Style.ActionHeader}>
                        <div>
                            <div className={Style.InputWrapper}>
                                <input onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder='Search user' />
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" color="#A3A3A3" cursor="pointer" height="20" width="20" xmlns="http://www.w3.org/2000/svg" style={{ color: "rgb(163, 163, 163)" }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
                <div className={Style.TableSection}>
                    <Table pagination={false} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} loading={UserReducer.loading} sticky={{ offsetHeader: 0 }} dataSource={UserReducer?.data?.filter(data =>
                        (data.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            data.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            data.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                        data?.role_id?._id?.toString() !== "6768f37ff2ef345b103370df" &&
                        data?.role_id?._id?.toString() !== "67178f602714c2b7a4d2b411"
                    )}
                        columns={userRole === "6768f37ff2ef345b103370df" ? Admincolumns : columns} />
                </div>
                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title="Choose a Package"
                    placement={"right"}
                    onClose={onClose}
                    open={open}
                    footer={
                        <div className={Style.FooterContainer}>
                            <button onClick={onClose}>Close</button>
                            <button onClick={handleStrpiePayment} disabled={selectedPackage !== "" && !packageLoading ? false : true} style={selectedPackage !== "" && !packageLoading ? { cursor: 'pointer' } : { cursor: 'no-drop' }}>{packageLoading ? 'Loading...' : 'Pay with stripe'}</button>
                        </div>
                    }
                >
                    {UserReducer.loadingPackage ?
                        <>
                            <Skeleton active />
                            <Skeleton active />
                            <Skeleton active />
                        </>
                        :
                        UserReducer?.packageData !== undefined && UserReducer?.packageData !== null && UserReducer?.packageData !== "" && UserReducer?.packageData.length > 0 ? UserReducer?.packageData.map(data =>
                            <>
                                <div onClick={() => setSelectPackage(data?._id)} className={Style.CardMainPackage}>
                                    <div className={Style.packageCard}>
                                        <h3>{data.name}</h3>
                                        <p>{data?.type}</p>
                                        {selectedPackage == data?._id ?
                                            <FaCheck color='green' size={25} style={{ marginLeft: 10 }} />
                                            : ""}
                                    </div>
                                    <p className={Style.CardDescription}>{data.description}</p>
                                    <h3 className={Style.CardAmount}>${data.amount}</h3>
                                </div >
                            </>
                        ) :
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                </Drawer>
            </div >
        </>
    )
}

function mapStateToProps({ UserReducer }) {
    return { UserReducer };
}
export default connect(mapStateToProps, UserAction)(UserScreen);