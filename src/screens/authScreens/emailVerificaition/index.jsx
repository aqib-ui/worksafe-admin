import React from "react";
import Style from './EmailVerificaition.module.css'
import { IconInput, PasswordInput } from '../../../component/input/index'
import SmsImage from '../../../assets/icons/inputIcons/sms.png'
import LockImage from '../../../assets/icons/inputIcons/lock.png'
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';




const EmailVerificaition = () => {
    const schema = yup.object().shape({
        email: yup.string().required("Email is required"),
        password: yup.string().required("Password is required"),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginAction = (prop) => {
        console.log(prop)
    }
    return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <div className={Style.SectionTitle}>
                <h1>Email Verification</h1>
                <h6>Enter your email address and we'll send you a code to <br/>reset your password.</h6>
            </div>
            <div className={Style.CenterWrapper}>
                <IconInput control={control} errors={errors} name={"email"} src={SmsImage} placeholder={'Enter your email address'} label={"Email Address"}  />
                <div>
                    <button onClick={handleSubmit(loginAction)}>Send Code</button>
                </div>
            </div>
            <div className={Style.NewUserSection}>
                <div className={Style.flexClass}>
                    <p>Remember your password?</p>
                    <span>Sign in</span>
                </div>
            </div>
        </div>
    )
}

export default EmailVerificaition