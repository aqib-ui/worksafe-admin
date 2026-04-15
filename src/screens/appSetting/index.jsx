import { useEffect, useState } from 'react'
import Style from './appSetting.module.css'
import { Button, InputNumber, message } from 'antd'
import * as EnterPriseAction from '../../../store/actions/Enterprise/index';
import { connect } from 'react-redux';
import { baseUrl } from '../../../store/config.json'
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row } from 'antd';
import { Popconfirm } from 'antd';



function AppSetting() {
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const [messageApi, contextHolder] = message.useMessage();
    const [currentSetting, setCurrentSetting] = useState([])
    const [loading, setLoading] = useState(false)
    const LoadSetting = async () => {
        setLoading(true)
        try {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
            };
            const response = await fetch(`${baseUrl}/appsetting`, options);
            const res = await response.json();
            setCurrentSetting(res[0])
            setLoading(false)
            return res[0]
        }
        catch (err) {
            setLoading(false)
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong",
            });
        }
    }

    useEffect(() => {
        const loadDataOPS = async () => {
            const result = await LoadSetting()
            reset(
                {
                    ANDROIDV: parseInt(result?.androidVersion),
                    IOSV: parseInt(result?.iosVersion),
                }
            )
        }
        loadDataOPS()
    }, [])




    const schema = yup.object().shape({
        ANDROIDV: yup.number().required(),
        IOSV: yup.number().required(),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            ANDROIDV: 0,
            IOSV: 0,
        },
    });

    const UpdateSettign = async (data) => {
        setLoading(true)
        try {
            const options = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    androidVersion: data?.ANDROIDV.toString(),
                    iosVersion: data?.IOSV.toString(),
                })
            };
            const response = await fetch(`${baseUrl}/appsetting`, options);
            if (response.status == 200 || response.status == 201) {
                setLoading(false)
                messageApi.destroy()
                messageApi.open({
                    type: "success",
                    content: "App version updated",
                });
            }
        }
        catch (err) {
            setLoading(false)
            console.error(err)
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong",
            });
        }
    }




    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>Settings</h1>
                    </div>
                    <div className={Style.ActionHeader}>
                    </div>
                </div>
                <div className={Style.TableSection}>
                    <Row>
                        <Col xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                            <div>
                                <label>Android Version</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <InputNumber max={999} maxLength={3} disabled={loading} min={parseInt(currentSetting?.androidVersion)} onChange={onChange} value={value} status={errors?.ANDROIDV?.message !== undefined ? 'error' : ''} placeholder='Enter Pre-Notification Time' style={{ height: 45, marginTop: 3, width: '100%', display: 'flex', alignItems: 'center' }} />
                                        </>
                                    )}
                                    name="ANDROIDV"
                                />
                            </div>
                            <div style={{ paddingTop: 10 }}>
                                <label>IOS Version</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <InputNumber max={999} maxLength={3} disabled={loading} min={parseInt(currentSetting?.iosVersion)} onChange={onChange} value={value} status={errors?.IOSV?.message !== undefined ? 'error' : ''} placeholder='Enter Pre-Notification Time' style={{ height: 45, marginTop: 3, width: '100%', display: 'flex', alignItems: 'center' }} />
                                        </>
                                    )}
                                    name="IOSV"
                                />
                            </div>
                            <div style={{ paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                                <Popconfirm
                                    title="Are you sure"
                                    description="Are you sure you want to change app versions?"
                                    onConfirm={handleSubmit(UpdateSettign)}
                                    okText="Yes"
                                    disabled={loading}
                                    cancelText="No"
                                >
                                    <Button disabled={loading}>Update</Button>
                                </Popconfirm>
                            </div>
                        </Col>
                        <Col xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}></Col>
                        <Col xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}></Col>
                    </Row>

                </div>
            </div >
        </>
    )
}

function mapStateToProps({ EnterpriseReducer, UserReducer }) {
    return { EnterpriseReducer, UserReducer };
}
export default connect(mapStateToProps, EnterPriseAction)(AppSetting);
