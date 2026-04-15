// import { useEffect, useState } from 'react'
// import Style from './LoginScreen.module.css'
// import { Button, Input, message } from 'antd'
// import * as yup from 'yup';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
// import * as LoginAction from '../../../../store/actions/Login/index';
// import { connect } from 'react-redux';
// import { useNavigate } from "react-router-dom";


// function LoginScreen({ LoginReducer, LoginUser }) {
//     const [messageApi, contextHolder] = message.useMessage();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!messageApi) return;
//         if (LoginReducer.networkError) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "error",
//                 content: "Something went wrong, Please try again",
//             });
//         }
//         if (LoginReducer.errorState) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "error",
//                 content: LoginReducer?.errorState,
//             });
//         }
//         if (LoginReducer.data.userId) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "success",
//                 content: "Login successfully",
//             });
//             navigate("/");
//             window.location.reload();
//         }
//     }, [
//         LoginReducer.networkError,
//         LoginReducer.data,
//         LoginReducer.errorState,
//         messageApi,
//     ]);
//     const schema = yup.object().shape({
//         email: yup.string()
//             .required('Email is Required')
//             .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Invalid email address').lowercase(),
//         Password: yup.string().required('Password is required').min(3),
//     });

//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         reset,
//     } = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: {
//             email: '',
//             Password: '',
//         },
//     });

//     const onSubmit = data => {
//         LoginUser(data)
//     };
//     const handleKeyDown = (event) => {
//         if (event.key === 'Enter') {
//             handleSubmit(onSubmit)();
//         }
//     };
//     return (
//         <>
//             {contextHolder}
//             <div className={Style.Container}>
//                 <div className={Style.InnerContainer}>
//                     <h2>Sign in</h2>
//                     <h6>Welcome back! Please enter your details.</h6>

//                     <div className={Style.InputContainer}>
//                         <Controller
//                             control={control}
//                             rules={{
//                                 required: true,
//                             }}
//                             render={({ field: { onChange, value } }) => (
//                                 <>
//                                     <label>Email</label>
//                                     <Input
//                                         onKeyDown={handleKeyDown}
//                                         disabled={LoginReducer.loading}
//                                         onChange={onChange} value={value} maxLength={40} status={errors?.email?.message !== undefined ? 'error' : ''} placeholder='Enter your email' style={{ paddingBlock: 12 }} />
//                                 </>
//                             )}
//                             name="email"
//                         />
//                     </div>

//                     <div className={Style.InputContainer}>
//                         <Controller
//                             control={control}
//                             rules={{
//                                 required: true,
//                             }}
//                             render={({ field: { onChange, value } }) => (
//                                 <>
//                                     <label>Password</label>
//                                     <Input.Password
//                                         onKeyDown={handleKeyDown}
//                                         disabled={LoginReducer.loading}
//                                         onChange={onChange} value={value} maxLength={40} status={errors?.Password?.message !== undefined ? 'error' : ''} placeholder='Please type your password' style={{ paddingBlock: 12 }}
//                                         iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
//                                     />
//                                 </>
//                             )}
//                             name="Password"
//                         />

//                     </div>

//                     <div className={Style.BtnContainer}>
//                         <Button loading={LoginReducer.loading} disabled={LoginReducer.loading} onClick={handleSubmit(onSubmit)} style={{ paddingBlock: 23, backgroundColor: '#214CBC', color: 'white', width: '100%', cursor: LoginReducer.loading ? "no-drop" : 'pointer' }}>
//                             Login
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// function mapStateToProps({ LoginReducer }) {
//     return { LoginReducer };
// }
// export default connect(mapStateToProps, LoginAction)(LoginScreen);



import React, { useEffect } from "react";
import Style from './LoginScreen.module.css'
import { IconInput, PasswordInput } from '../../../component/input/index'
import SmsImage from '../../../assets/icons/inputIcons/sms.png'
import LockImage from '../../../assets/icons/inputIcons/lock.png'
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router";
import { message } from "antd";
import * as LoginAction from '../../../../store/actions/Login/index';
import { connect } from 'react-redux';
import Loader from "../../../component/loader";



const LoginScreen = ({ LoginReducer, LoginUser }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        if (!messageApi) return;
        if (LoginReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, Please try again",
            });
        }
        if (LoginReducer.errorState) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: LoginReducer?.errorState,
            });
        }
        if (LoginReducer.data.userId) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Login successfully",
            });
            navigate("/");
            window.location.reload();
        }
    }, [
        LoginReducer.networkError,
        LoginReducer.data,
        LoginReducer.errorState,
        messageApi,
    ]);
    const schema = yup.object().shape({
        email: yup.string()
            .required('Email is Required')
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Invalid email address').lowercase(),
        Password: yup.string().required('Password is required').min(3),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            Password: '',
        },
    });

    const [email, password] = watch(["email", "Password"])
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const onSubmit = (data) => {
        LoginUser(data)
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(onSubmit)();
        }
    };
    return (
        <>
            {contextHolder}
            <div>
                <div className={Style.SectionTitle}>
                    <h1>Welcome Back</h1>
                </div>
                <div className={Style.CenterWrapper}>
                    <IconInput onKeyDown={handleKeyDown} control={control} errors={errors} name={"email"} src={SmsImage} placeholder={'Enter your email address'} label={"Email Address"} />
                    <div style={{ marginTop: 16, marginBottom: 12 }}>
                        <PasswordInput onKeyDown={handleKeyDown} control={control} errors={errors} name={"Password"} src={LockImage} placeholder={'Enter your password'} label={"Password"} />
                    </div>
                    {/* <span>Forgot your password?</span> */}
                    <div>
                        <button style={{ opacity: LoginReducer.loading ? 0.5 : 1, cursor: LoginReducer.loading || !isValidEmail || password.length < 6 ? 'no-drop' : 'pointer', background: !isValidEmail || password.length < 6 ? 'var(--gray-20)' : 'var(--primary)', color: !isValidEmail || password.length < 6 ? 'var(--gray-70)' : 'var(--white)' }} disabled={LoginReducer.loading} onClick={handleSubmit(onSubmit)}>
                            {LoginReducer.loading ?
                                <Loader stroke={4} speed={0.8} color="#fff" />
                                :
                                "Sign In"
                            }
                        </button>
                    </div>
                </div>
                {/* <div className={Style.NewUserSection}>
                    <div className={Style.flexClass}>
                        <p>Are you a new user?</p>
                        <span>Create an account</span>
                    </div>
                </div> */}
            </div>
        </>
    )
}


function mapStateToProps({ LoginReducer }) {
    return { LoginReducer };
}
export default connect(mapStateToProps, LoginAction)(LoginScreen);