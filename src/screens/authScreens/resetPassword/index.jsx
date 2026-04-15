import React from "react";
import Style from './ResetPassword.module.css'
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className={Style.SectionTitle}>
                <h1>Reset Password</h1>
                <h6>Now that we know it’s you, please create a new<br /> password to sign in. </h6>
            </div>
            <div className={Style.CenterWrapper}>
                <PasswordInput control={control} errors={errors} name={"email"} src={SmsImage} placeholder={'Enter your password'} label={"New Password"}  />
                <div style={{ marginTop: 16, marginBottom: 12 }}>
                    <PasswordInput control={control} errors={errors} name={"email"} src={SmsImage} placeholder={'Enter your confirm password'} label={"Confirm Password"}  />
                </div>
                <div>
                    <button onClick={handleSubmit(loginAction)}>Reset Password</button>
                </div>
            </div>
            {/* <div className={Style.NewUserSection}>
                <div className={Style.flexClass}>
                    <p>Remember your password?</p>
                    <span>Sign in</span>
                </div>
            </div> */}
        </div>
    )
}

export default EmailVerificaition