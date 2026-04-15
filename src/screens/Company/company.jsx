import { useEffect, useState } from 'react'
import Style from './company.module.css'
import { Drawer, Dropdown, InputNumber, message, Progress, Select, Space, Spin, Table } from 'antd'
import * as EnterPriseAction from '../../../store/actions/Enterprise/index';
import * as PaymentAction from '../../../store/actions/Payment/index';

import { connect } from 'react-redux';
import { baseUrl } from '../../../store/config.json'
import { MdOutlineSettings } from 'react-icons/md';
import ReactTimeAgo from 'react-time-ago';


function MyCompany({ PaymentReducer, GetPayment, EnterpriseReducer, GetCompanyInfo, UserReducer, GetUsers, GetPackages, GetAllUsers }) {
    const [messageApi, contextHolder] = message.useMessage();
    const worksite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const userRole = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')?.trim()
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const { companyInfoDate } = EnterpriseReducer

    const logOut = () => {
        localStorage.clear();
        window.location.reload();
        navigate("/");
    }

    useEffect(() => {
        GetCompanyInfo()
        GetUsers()
        GetAllUsers()
        GetPackages()
    }, [])


    useEffect(() => {
        if (!messageApi) return;
        if (EnterpriseReducer.networkError) {
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



    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const converted = bytes / Math.pow(k, i);
        return `${parseFloat(converted.toFixed(2))} ${sizes[i]}`;
    }


    function getRemainingStoragePercentage(usedStorage, totalStorage) {
        if (!totalStorage || totalStorage === 0) return '0';

        const used = usedStorage || 0;
        const remaining = totalStorage - used;
        const percentage = (remaining / totalStorage) * 100;
        const rounded = parseFloat(percentage.toFixed(3));

        return rounded < 0.01 && rounded > 0 ? '0.01' : `${rounded}`;
    }


    function getRemainingStorageFormatted(totalStorage, usedStorage) {
        if (!totalStorage || totalStorage <= 0) return "0 Bytes";
        const remainingBytes = totalStorage - (usedStorage || 0);
        if (remainingBytes <= 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
        const i = Math.floor(Math.log(remainingBytes) / Math.log(k));
        const value = remainingBytes / Math.pow(k, i);

        return `${parseFloat(value.toFixed(2))} ${sizes[i]}`;
    }

    function formatNumberShort(value) {
        const absVal = Math.abs(value);
        if (absVal >= 1_000_000) {
            return `${parseFloat((value / 1_000_000).toFixed(2))}M`;
        } else if (absVal >= 1_000) {
            return `${parseFloat((value / 1_000).toFixed(2))}K`;
        } else {
            return `${parseFloat(value.toFixed(2))}`;
        }
    }


    const [createPackage, setCreatePackage] = useState(false)
    const [numberTb, setNumberTb] = useState(1)

    const openPackageDrawer = () => {
        setCreatePackage(true)
    }
    const closePackageDrawer = () => {
        setCreatePackage(false)
    }

    const [packageLoading, setPackageLoading] = useState(false)

    const { data, AllData } = UserReducer

    const StoragePaymentStrip = async () => {
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

    const [licenseNumber, setLicenseNumber] = useState(0)
    const [licenseLoading, setlicenseLoading] = useState(false)



    const licenseCount = licenseNumber || 0;
    const totalLicenses = licenseCount + (companyInfoDate?.total_licenses || 0);

    const originalPrice = EnterpriseReducer?.data.find(data => data._id == "6807b33e0130a126e001f295")?.pricePerUser ?? 0;
    const discountPrice = totalLicenses > 19 ? EnterpriseReducer?.data.find(data => data._id == "6807b4030130a126e001f297")?.pricePerUser ?? 0 : EnterpriseReducer?.data.find(data => data._id == "6807b33e0130a126e001f295")?.pricePerUser ?? 0;

    const discountPerLicense = originalPrice - discountPrice;
    const discountPercentage = ((discountPerLicense / originalPrice) * 100).toFixed(2);

    const fairPrice = licenseCount * discountPrice;

    const LicensePaymentStrip = async () => {
        if (licenseNumber > 0) {
            try {
                setlicenseLoading(true)
                const response = await fetch(`${baseUrl}/payments/createcheckoutsession/${data?.find(data => data?._id == localStorage.getItem('zP!4vBN#tw69gV+%2/+1/w=='))?.email}/1`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}`, },
                    body: JSON.stringify({
                        license: licenseNumber,
                        isYearly: 'false'
                    })
                });
                if (response.ok) {
                    const { data } = await response.json();
                    setlicenseLoading(false)
                    window.location.href = data;
                } else {
                    logOut()
                    messageApi.destroy();
                    messageApi.open({
                        type: "error",
                        content: "Failed to create payment session",
                    });
                    setlicenseLoading(false)
                }
            } catch (error) {
                logOut()
                messageApi.destroy();
                messageApi.open({
                    type: "error",
                    content: "Failed to create payment session",
                });
                setlicenseLoading(false)
            }
        }
        else {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Atleat 1 License Count required",
            });
        }
    };

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

    ];


    const [userPackage, setUserPackage] = useState(false)


    const openUserDrawer = (e) => {
        setUserPackage(true)
    }
    const closeUserDrawer = () => {
        setUserPackage(false)
    }

    function getUsedStoragePercentage(usedStorage, totalStorage) {
        if (!usedStorage || !totalStorage || totalStorage === 0) return '0';
        const percentage = (usedStorage / totalStorage) * 100;
        const rounded = parseFloat(percentage.toFixed(3));
        return rounded < 0.01 && rounded > 0 ? '0.01' : `${rounded}`;
    }









    const columns21 = [
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

    return (
        <>
            <div className={Style.MainContainer}>
                <>
                    <div>
                        <div className={Style.SecondaryHeader}>
                            <h1>{companyInfoDate?.name || <Spin />}</h1>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {userRole !== "66d1603115bd5a0e63cb7cc2" &&
                                    <>
                                        <button onClick={openPackageDrawer}>Buy Storage</button>
                                        <button onClick={openUserDrawer}>Buy License</button>
                                    </>
                                }
                            </div>
                        </div>

                    </div>
                    <div className={Style.TabHeader}>
                    </div>
                    <div className={Style.TableSectionLayout}>
                        {contextHolder}
                        <div className={Style.UpperLayout}>
                            <div className={Style.TableSection}>
                                <div className={Style.SideInfo}>
                                    <h4>Consumed Storage</h4>
                                    <h1>{`${formatBytes(companyInfoDate?.usedStorage ? companyInfoDate?.usedStorage : 0)}/${formatBytes(companyInfoDate?.totalStorage ? companyInfoDate?.totalStorage : 0)}`}</h1>
                                    {/* <button onClick={openPackageDrawer}>Buy Storage</button> */}
                                </div>
                                <div className={Style.ProgressInfo}>
                                    <Progress type="dashboard" strokeWidth={10} percent={getUsedStoragePercentage(companyInfoDate?.usedStorage, companyInfoDate?.totalStorage)} gapDegree={30} />
                                </div>
                            </div>
                            <div className={Style.TableSection}>
                                <div className={Style.SideInfo}>
                                    <h4>Remaining Storage</h4>
                                    <h1>{`${getRemainingStorageFormatted(companyInfoDate?.totalStorage ? companyInfoDate?.totalStorage : 0, companyInfoDate?.usedStorage ? companyInfoDate?.usedStorage : 0)}/${formatBytes(companyInfoDate?.totalStorage ? companyInfoDate?.totalStorage : 0)}`}</h1>
                                </div>
                                <div className={Style.ProgressInfo}>
                                    <Progress type="dashboard" strokeWidth={10} percent={getRemainingStoragePercentage(companyInfoDate?.usedStorage ? companyInfoDate?.usedStorage : 0, companyInfoDate?.totalStorage ? companyInfoDate?.totalStorage : 0)} gapDegree={30} />
                                </div>
                            </div>
                            <div className={Style.TableSection}>
                                <div className={Style.SideInfo}>
                                    <h4>Total Premium User</h4>
                                    <h1>{AllData?.filter(isData => isData.expiry >= new Date().toISOString() && isData.expiry != null)?.length > 0 ? AllData?.filter(isData => isData.expiry >= new Date().toISOString() && isData.expiry != null)?.length : 0 || 0}/{AllData?.length || 0}</h1>
                                </div>
                                <div className={Style.ProgressInfo}>
                                    <Progress type="dashboard" strokeWidth={10} percent={getUsedStoragePercentage(AllData?.filter(isData => isData.isPremium == true)?.length || 0, AllData?.length || 0)} gapDegree={30} />
                                </div>
                            </div>


                            <div className={Style.TableSection3}>
                                <div style={{ height: 'auto' }} className={Style.SideInfo}>
                                    <h4>Expired Licenses</h4>
                                    <h1>{companyInfoDate?.expire_license || 0}/{companyInfoDate?.total_licenses || 0}</h1>
                                    {/* <button onClick={openUserDrawer}>Buy License</button> */}
                                </div>
                                <div style={{ height: 'auto' }} className={Style.ProgressInfo}>
                                    <Progress type="dashboard" strokeWidth={10} percent={getUsedStoragePercentage(companyInfoDate?.expire_license || 0, companyInfoDate?.total_licenses || 0)} gapDegree={30} />
                                </div>
                            </div>
                            <div className={Style.TableSection3}>
                                <div style={{ height: 'auto' }} className={Style.SideInfo}>
                                    <h4>Total Assigned Licenses</h4>
                                    <h1>{companyInfoDate?.assign_license || 0}/{companyInfoDate?.total_licenses || 0}</h1>
                                    {/* <button onClick={openUserDrawer}>Buy License</button> */}
                                </div>
                                <div style={{ height: 'auto' }} className={Style.ProgressInfo}>
                                    <Progress type="dashboard" strokeWidth={10} percent={getUsedStoragePercentage(companyInfoDate?.assign_license || 0, companyInfoDate?.total_licenses || 0)} gapDegree={30} />
                                </div>
                            </div>
                            <div className={Style.TableSection3}>
                                <div style={{ height: 'auto' }} className={Style.SideInfo}>
                                    <h4>Remaining Licenses</h4>
                                    <h1>{companyInfoDate?.total_licenses - companyInfoDate?.assign_license || 0}/{companyInfoDate?.total_licenses || 0}</h1>
                                    {/* <button onClick={openUserDrawer}>Buy License</button> */}
                                </div>
                                <div style={{ height: 'auto' }} className={Style.ProgressInfo}>
                                    <Progress type="dashboard" strokeWidth={10} percent={getUsedStoragePercentage(companyInfoDate?.total_licenses - companyInfoDate?.assign_license || 0 || 0, companyInfoDate?.total_licenses || 0)} gapDegree={30} />
                                </div>
                            </div>
                            <div className={Style.TableSection2}>
                                <div className={Style.InfoColumnDiv}>
                                    <p>Plan Name</p>
                                    {companyInfoDate?.package_id == null ?
                                        <p>No Package</p>
                                        :
                                        <p>{companyInfoDate?.package_id?.name ? companyInfoDate?.package_id?.name : "Loading..."}</p>
                                    }
                                </div>
                                <div className={Style.InfoColumnDiv}>
                                    <p>Plan Amount</p>
                                    {companyInfoDate?.package_id == null ?
                                        <p>No Package</p>
                                        :
                                        <p>${companyInfoDate?.package_id?.pricePerUser || 0} / Person</p>
                                    }
                                </div>
                                <div className={Style.InfoColumnDiv}>
                                    <p>Total Storage (Given)</p>
                                    {companyInfoDate?.package_id == null ?
                                        <p>No Package</p>
                                        :
                                        <p>{formatBytes(companyInfoDate?.package_id?.storage || 0)} (Shared)</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={Style.UpperLayout}>
                            <div className={Style.MainContainer}>
                                <div style={{paddingBlock:20}}>
                                    <h1>Payment History</h1>
                                </div>
                                <div>
                                    <Table pagination={false} scroll={{ x: 'max-content' }} loading={PaymentReducer.loading} sticky={{ offsetHeader: 0 }} dataSource={PaymentReducer?.data} columns={columns21} />
                                </div>
                            </div >
                        </div>
                        <Drawer
                            title="Purchase Storage"
                            placement={"right"}
                            onClose={closePackageDrawer}
                            open={createPackage}
                            footer={
                                <div className={Style.FooterContainer}>
                                    <button onClick={closePackageDrawer}>Close</button>
                                    <button disabled={packageLoading} style={{ cursor: packageLoading ? 'not-allowed' : 'pointer' }} onClick={StoragePaymentStrip}>{packageLoading ? 'Purchasing...' : 'Purchase'}</button>
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
                            maskClosable={false}
                            getContainer={document.body}
                            afterOpenChange={(visible) => {
                                document.body.style.overflow = visible ? "hidden" : "auto";
                            }}
                            footer={
                                <div className={Style.FooterContainer}>
                                    <button onClick={closeUserDrawer}>Close</button>
                                    <button disabled={licenseLoading} style={{ cursor: licenseLoading ? 'not-allowed' : 'pointer' }} onClick={LicensePaymentStrip}>{licenseLoading ? 'Purchasing...' : 'Buy License'}</button>
                                </div>
                            }
                        >
                            <Table sticky={{ offsetHeader: 0 }} scroll={{ x: 'max-content' }} pagination={false} dataSource={EnterpriseReducer?.data?.filter(data => data._id !== "6807b48c0130a126e001f299")} columns={columns} />
                            <div className={Style.CountPurchase}>
                                <label>License Count</label>
                                <InputNumber
                                    min={1}
                                    maxLength={4}
                                    minLength={1}
                                    max={1000}
                                    placeholder='Please select number how many license you want to buy'
                                    style={{ height: 45, marginTop: 3, width: '100%', display: 'flex', alignItems: 'center' }}
                                    onChange={(e) => setLicenseNumber(e)}
                                />
                            </div>
                            <h4 style={{ margin: 0, paddingTop: 20, display: 'flex', alignItems: 'center' }}>Price: <p style={{ marginBottom: 0, marginTop: 0, fontWeight: 400, color: '#808080', marginLeft: 4 }}>${fairPrice}</p></h4>
                            <h4 style={{ margin: 0, paddingTop: 5, display: 'flex', alignItems: 'center' }}>Discount: <p style={{ marginBottom: 0, marginTop: 0, fontWeight: 400, color: '#808080', marginLeft: 4 }}>{discountPercentage}%</p></h4>
                            <h4 style={{ margin: 0, paddingTop: 5, display: 'flex', alignItems: 'center' }}>Price per item: <p style={{ marginBottom: 0, marginTop: 0, fontWeight: 400, color: '#808080', marginLeft: 4 }}>${discountPrice}</p></h4>
                            <div>
                                <h4 style={{ margin: 0, paddingTop: 20 }}>Note:</h4>
                                <p style={{ margin: 0, color: '#808080' }}>
                                    A suitable package will be automatically assigned to your account based on your license purchase history, ensuring you receive the most appropriate features and benefits aligned with your previous selections.
                                </p>
                            </div>
                        </Drawer>
                    </div>
                </>
            </div>
        </>
    )
}

function mapStateToProps({ EnterpriseReducer, UserReducer, PaymentReducer }) {
    return { EnterpriseReducer, UserReducer, PaymentReducer };
}
export default connect(mapStateToProps, { ...EnterPriseAction, ...PaymentAction })(MyCompany);
