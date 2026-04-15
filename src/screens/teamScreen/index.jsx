import { useEffect, useState } from 'react'
import Style from './TeamScreen.module.css'
import { Button, Drawer, Dropdown, Input, message, Select, Space, Spin, Table, Tooltip } from 'antd'
import * as TeamAction from '../../../store/actions/Teams/index';
import * as UserAction from '../../../store/actions/Users/index';
import { connect, useDispatch } from 'react-redux';
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuEye } from "react-icons/lu";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdOutlineSettings } from 'react-icons/md';
import ReactTimeAgo from 'react-time-ago';
import { useOutletContext } from 'react-router';
import { TASK_LOAD_TEAM_COMPLETE, TASK_LOAD_USER_COMPLETE } from '../../../store/actions/types';

function TeamScreen({ TeamReducer, GetTeam, RemoveTeamUser, GetRoles, InserTeamUser, GetUsers, GetTeamAdmin, RemoveTeamUserAdmin }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [memberDrawer, setMemberDrawer] = useState(false);
    const [addMemberDrawer, setAddMemberDrawer] = useState(false);
    const [currentTeamID, setCurrentTeamID] = useState();
    const [currentCompanyID, setCurrentCompanyID] = useState();
    const [currentTeam, setCurrentTeam] = useState();
    const [currentTeamName, setCurrentTeamName] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const userRole = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')?.trim()
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const [page, setPage] = useState(1)

    const dispatch = useDispatch()


    const [isNext, setIsNext] = useState(true)
    useEffect(() => {
        const init = async () => {
            if (userRole !== "6768f37ff2ef345b103370df") {
                const totalLegngth = await GetTeam(currentWorkSite, page)
                if (totalLegngth < 10) {
                    setIsNext(false)
                }
            }
            else {
                const totalLegngth = await GetTeamAdmin(page)
                if (totalLegngth < 10) {
                    setIsNext(false)
                }
            }
        }
        init()
    }, [page, searchTerm])


    useEffect(() => {

    }, [])
    const RoleData = TeamReducer?.roleData?.filter(data => data?._id !== "6768f37ff2ef345b103370df" && data?._id !== "67178f602714c2b7a4d2b411" && data?._id !== "66d1603115bd5a0e63cb7cbd" && data?.priority >= localStorage.getItem('Zd9!u*K3tVp2^Ax7BQ+/==')).map(data => {
        return { value: data._id, label: data?.roleName }
    })

    useEffect(() => {
        if (!messageApi) return;
        if (TeamReducer.networkError) {
            messageApi.destroy();
            if (localStorage.getItem("expireUser") == "true") {
                messageApi.open({
                    type: "info",
                    content: "Payment Expired",
                });
            }
            else {
                const TimeClean = setTimeout(() => {
                    messageApi.open({
                        type: "error",
                        content: "Something went wrong, please try again",
                    });
                }, 1000);
                return () => {
                    clearTimeout(TimeClean)
                }
            }
        }
        if (TeamReducer.emailError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Email already exist, try other emails",
            });
        }
        if (TeamReducer.insetUserComplete) {
            GetUsers()
            dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: true, payload: [] });
            CloseAddMemberDrawer()
            if (userRole !== "6768f37ff2ef345b103370df") {
                GetTeam(currentWorkSite, page)
            }
            else {
                GetTeamAdmin(page)
            }
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "User successfully added",
            });
            const element = document.querySelector(`.ant-drawer-content-wrapper`);
            if (element) {
                element.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            };
        }
        if (TeamReducer.DeleteUserComplete) {
            dispatch({ type: TASK_LOAD_TEAM_COMPLETE, loading: true, payload: [] });
            onClose()
            if (userRole !== "6768f37ff2ef345b103370df") {
                GetTeam(currentWorkSite, page)
            }
            else {
                GetTeamAdmin(page)
            }
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "User successfully removed",
            });
        }
    }, [
        TeamReducer.networkError,
        TeamReducer.emailError,
        TeamReducer.insetUserComplete,
        TeamReducer.DeleteUserComplete,
        messageApi,
    ]);
    const schema = yup.object().shape({
        firstName: yup.string()
            .required("First name is required")
            .min(3, "First name must be at least 3 characters")
            .matches(/^[A-Za-z]+$/, "Only alphabets are allowed in first name"),
        lastName: yup.string().required("Last name is required")
            .min(3, "Last name must be at least 3 characters")
            .matches(/^[A-Za-z]+$/, "Only alphabets are allowed in last name"),

        email: yup.string()
            .required('Email is Required')
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,100}$/i, 'Invalid email address').lowercase(),

        position: yup.string()
            .required("Position is required")
            .min(3, "Position must be at least 3 characters")
            .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed in position"),

        phone: yup
            .string()
            .required("Phone is required")
            .matches(/^\+?[0-9]{10,15}$/, "Phone number must be 10–15 digits"),

        officePhone: yup.string()
            .required("Office phone is required")
            .matches(/^\+?[0-9]{10,15}$/, "Office phone must be 10–15 digits"),

        role: yup.string().required('User role is required'),
        manager: yup.string().required('Manager is required'),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            role: '',
            manager: '',
            position: '',
            phone: '',
            officePhone: '',
        },
    });




    
    const ShowAddMemberDrawer = (creteTeamProp) => {
        setAddMemberDrawer(true)
        setCurrentTeamID(creteTeamProp?._id)
        setCurrentCompanyID(creteTeamProp?.company)
        GetRoles()
    }
    const CloseAddMemberDrawer = () => {
        reset({
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            manager: "",
            position: "",
            phone: "",
            officePhone: "",
        })
        setAddMemberDrawer(false)
    }
    const showDrawer = (teamData) => {
        setMemberDrawer(true);
        setCurrentTeamName(teamData)
        const users = teamData?.members?.map(member => ({
            _id: member.user?._id ?? "",
            firstName: member.user?.firstName ?? "Unknown",
            lastName: member.user?.lastName ?? "Unknown",
            email: member.user?.email ?? "Unknown",
            role: member.role ?? "Unknown",
            description: member.description || "No description",
            position: member.title || "No Position",
            phone: member.title || "No Phone",
            officePhone: member.ofcNo || "No office Phone",
        }));
        setCurrentTeam(users)
    };
    const onClose = () => {
        setMemberDrawer(false);
        setCurrentTeam("")
        setSelectedRowKeys([])
    };
    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 200,
            ellipsis: false,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 200,
            ellipsis: false,
        },
        {
            title: "Team Members",
            key: "action",
            ellipsis: true,
            width: 200,
            render: (_, record) => (
                <Space size="middle">
                    <div onClick={() => showDrawer(record)} className={Style.MemContainer}>
                        <>
                            {record?.members?.slice(0, 3).map((member, index) => {
                                const initials = `${member?.user?.firstName?.[0] || ""}${member?.user?.lastName?.[0] || ""}`;
                                const classNames = [Style.FirstMemCont, Style.SecondMemCont, Style.ThirdMemCont];
                                return (
                                    <Tooltip key={index} title={`${member?.user?.firstName} ${member?.user?.lastName}`}>
                                        <div key={index} className={classNames[index]}>
                                            <p>{initials}</p>
                                        </div>
                                    </Tooltip>
                                );
                            })}
                        </>
                        {record?.members?.length > 3 && (
                            <p className={Style.paraMore}>{`+${record?.members?.length - 3}`}</p>
                        )}
                    </div>
                </Space>
            ),
        },

        {
            title: "Created At",
            key: "createAt",
            ellipsis: true,
            width: 200,
            render: (users) => (
                <Space direction="vertical">
                    <ReactTimeAgo date={users?.createdAt} locale="en-US" />
                </Space>
            ),
        },
        {
            title: "Action",
            key: "action",
            ellipsis: true,
            width: 100,
            hidden: userRole === "6768f37ff2ef345b103370df" ? true : false,
            render: (_, record) => {
                return (
                    <>
                        <Dropdown trigger={['click']} menu={{
                            items: [
                                {
                                    key: '1',
                                    label: (
                                        <div onClick={() => ShowAddMemberDrawer(record)}>
                                            Add member
                                        </div>
                                    ),
                                },
                            ]
                        }} placement='bottomLeft' arrow>
                            <div style={{ paddingInline: 7, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                <MdOutlineSettings color='black' size={26} />
                            </div>
                        </Dropdown>
                    </>
                )
            },
        },
    ];
    const memberColumns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            width: 200,
            ellipsis: true,
            render: (text) => (
                <div style={{ overflowWrap: "anywhere" }}>
                    {text}
                </div>
            )
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            ellipsis: true,
            width: 200,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: true,
        },
        {
            title: 'Role Name',
            dataIndex: 'role',
            key: 'role',
            ellipsis: true,
            width: 100,
        },
    ];
    const rowSelection = {
        preserveSelectedRowKeys: false,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    const RemoveUser = () => {
        if (selectedRowKeys.length > 0) {
            let selectedMembers = [];
            currentTeamName?.members?.forEach(member => {
                if (!selectedRowKeys.includes(member?.user?._id)) {
                    selectedMembers.push({
                        userId: member?.user?._id,
                        role: member.role,
                        description: member.description
                    });
                }
            });
            if (userRole !== "6768f37ff2ef345b103370df") {
                RemoveTeamUser(selectedMembers, currentTeamName._id, currentTeamName?.title, currentTeamName?.description, currentTeamName?.worksites?.map(data => data._id))
            }
            else {
                RemoveTeamUserAdmin(selectedMembers, currentTeamName._id)
            }

        }
        else {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Please select user before removing",
            });
        }
    }
    const onSubmit = async data => {
        InserTeamUser(data, currentTeamID, currentCompanyID)
    };




    useEffect(() => {
        if (errors?.firstName) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: errors?.firstName?.message,
            });
            return;
        }

        if (errors?.lastName) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: errors?.lastName?.message,
            });
            return;
        }
        if (errors?.email) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: errors?.email?.message,
            });
            return;
        }
        if (errors?.position) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: errors?.position?.message,
            });
            return;
        }
        if (errors?.phone) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: errors?.phone?.message,
            });
            return;
        }
        if (errors?.officePhone) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: errors?.officePhone?.message,
            });
            return;
        }
        if (errors?.role) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: errors?.role?.message,
            });
            return;
        }
        if (errors?.manager) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: errors?.manager?.message,
            });
            return;
        }
    }, [errors])


    // const sortedData = [...TeamReducer?.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>Team Management</h1>
                    </div>
                    <div className={Style.ActionHeader}>
                        <div>
                            <div className={Style.InputWrapper}>
                                <input onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder='Search team' />
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" color="#A3A3A3" cursor="pointer" height="20" width="20" xmlns="http://www.w3.org/2000/svg" style={{ color: "rgb(163, 163, 163)" }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={Style.TableSection}>
                    <Table footer={() => (
                        <>
                            {TeamReducer?.data.length > 0 && !TeamReducer?.AssetsLoading &&
                                <>
                                    {isNext && searchTerm == "" &&
                                        <div style={{ textAlign: "center", padding: "0 0" }}>
                                            <button
                                                onClick={() => setPage(prev => prev + 1)}
                                                disabled={TeamReducer?.AssetsLoading}
                                                style={{
                                                    border: "1px solid #1890ff",
                                                    background: "#1890ff",
                                                    color: "white",
                                                    padding: "6px 16px",
                                                    borderRadius: "4px",
                                                    cursor: TeamReducer?.AssetsLoading ? "not-allowed" : "pointer",
                                                }}
                                            >
                                                {TeamReducer?.AssetsLoading ? "Loading..." : "Load More"}
                                            </button>
                                        </div>
                                    }
                                </>
                            }
                        </>
                    )} pagination={false} style={{ height: '100%' }} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} loading={TeamReducer.loading} sticky={{ offsetHeader: 0 }} dataSource={TeamReducer?.data?.filter(data =>
                        data.title?.toLowerCase().includes(searchTerm.toLowerCase())
                    )} columns={columns} />
                </div>

                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title={`${currentTeamName?.title}`}
                    placement={"right"}
                    onClose={onClose}
                    open={memberDrawer}
                    width={'80%'}
                    footer={
                        <div className={Style.FooterContainer}>
                            <button onClick={onClose}>Close</button>
                            <button onClick={RemoveUser} disabled={!TeamReducer.Deleteloading ? false : true} style={!TeamReducer.Deleteloading ? { cursor: 'pointer' } : { cursor: 'no-drop' }}>{!TeamReducer.Deleteloading ? "Remove user" : "Removing..."}</button>
                        </div>
                    }
                >
                    <Table pagination={false} scroll={{ x: 'max-content' }} rowKey={(record) => record._id} rowSelection={{
                        ...rowSelection,
                        selectedRowKeys
                    }} sticky={{ offsetHeader: 0 }} dataSource={currentTeam} columns={memberColumns} />
                </Drawer>

                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title={`Add User In Team`}
                    placement={"right"}
                    onClose={CloseAddMemberDrawer}
                    open={addMemberDrawer}
                    footer={
                        <div className={Style.FooterContainer}>
                            <button onClick={CloseAddMemberDrawer}>Close</button>
                            <button disabled={TeamReducer.userInsertLoading} style={TeamReducer.userInsertLoading ? { cursor: 'no-drop' } : { cursor: 'pointer' }} onClick={handleSubmit(onSubmit)}>{TeamReducer.userInsertLoading ? "Adding..." : "Add user"}</button>
                        </div>
                    }
                >
                    <div>
                        <div style={{ paddingTop: 10 }}>
                            <label>First Name</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} maxLength={20} status={errors?.firstName?.message !== undefined ? 'error' : ''} placeholder='Enter first name' style={{ height: 45, marginTop: 3 }} />
                                )}
                                name="firstName"
                            />
                        </div>
                        <div style={{ paddingTop: 10 }}>
                            <label>Last Name</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} maxLength={20} status={errors?.lastName?.message !== undefined ? 'error' : ''} placeholder='Enter last name' style={{ height: 45, marginTop: 3 }} />
                                )}
                                name="lastName"
                            />
                        </div>
                        <div style={{ paddingTop: 10 }}>
                            <label>Email</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} status={errors?.email?.message !== undefined ? 'error' : ''} placeholder='Enter email' style={{ height: 45, marginTop: 3 }} />
                                )}
                                name="email"
                            />
                        </div>

                        <div style={{ paddingTop: 10 }}>
                            <label>Position</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} status={errors?.position?.message !== undefined ? 'error' : ''} placeholder='Enter position' style={{ height: 45, marginTop: 3 }} />
                                )}
                                name="position"
                            />
                        </div>



                        <div style={{ paddingTop: 10 }}>
                            <label>Phone</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input onKeyDown={(e) => {
                                        if (["e", "E", "."].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }} type='number' disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} status={errors?.phone?.message !== undefined ? 'error' : ''} placeholder='Enter phone' style={{ height: 45, marginTop: 3 }} />
                                )}
                                name="phone"
                            />
                        </div>


                        <div style={{ paddingTop: 10 }}>
                            <label>Office Phone</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input onKeyDown={(e) => {
                                        if (["e", "E", "."].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }} type='number' count={{ show: false }} showCount={false} disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} status={errors?.officePhone?.message !== undefined ? 'error' : ''} placeholder='Enter office phone' style={{ height: 45, marginTop: 3 }} />
                                )}
                                name="officePhone"
                            />
                        </div>
                        <div style={{ paddingTop: 10 }}>
                            <label>Role</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                        placeholder="Select role"
                                        loading={TeamReducer?.roleLoading}
                                        disabled={TeamReducer?.roleLoading || TeamReducer.userInsertLoading}
                                        onChange={onChange}
                                        value={value == "" ? null : value}
                                        status={errors?.role?.message !== undefined ? 'error' : ''}
                                        style={{ marginTop: 3, width: "100%", height: 45 }}
                                        options={RoleData}

                                    />
                                )}
                                name="role"
                            />
                        </div>
                        <div style={{ paddingTop: 10 }}>
                            <label>Manager</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                        placeholder="Select Manager"
                                        onChange={onChange}
                                        disabled={TeamReducer.userInsertLoading}
                                        value={value == "" ? null : value}
                                        status={errors?.manager?.message !== undefined ? 'error' : ''}
                                        style={{ marginTop: 3, width: "100%", height: 45 }}
                                        options={[
                                            { value: 'Yes', label: 'Yes' },
                                            { value: 'No', label: 'No' },
                                        ]}
                                    />
                                )}
                                name="manager"
                            />
                        </div>
                    </div>
                </Drawer>
            </div >
        </>
    )
}


function mapStateToProps({ TeamReducer }) {
    return { TeamReducer };
}
export default connect(
    mapStateToProps,
    { ...TeamAction, ...UserAction }
)(TeamScreen);



