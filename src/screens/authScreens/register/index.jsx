import React from "react";
import Style from './Register.module.css'
import { IconInput, PasswordInput } from '../../../component/input/index'
import SmsImage from '../../../assets/icons/inputIcons/sms.png'
import LockImage from '../../../assets/icons/inputIcons/lock.png'
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';




const Register = () => {
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
        <div>
            <div className={Style.SectionTitle}>
                <h1>Create an Account</h1>
            </div>
            <div className={Style.CenterWrapper}>
                <IconInput control={control} errors={errors} name={"email"} src={SmsImage} placeholder={'Enter your email address'} label={"Email Address"}  />
                <div style={{ marginTop: 16, marginBottom: 12 }}>
                    <PasswordInput control={control} errors={errors} name={"password"} src={LockImage} placeholder={'Enter your password'} label={"Password"}  />
                </div>

                <div style={{ marginTop: 16, marginBottom: 12 }}>
                    <PasswordInput control={control} errors={errors} name={"password"} src={LockImage} placeholder={'Enter your password'} label={"Confirm Password"}  />
                </div>
                <div>
                    <button onClick={handleSubmit(loginAction)}>Sign Up</button>
                </div>
            </div>
            <div className={Style.NewUserSection}>
                <div className={Style.flexClass}>
                    <p>Already have an account?</p>
                    <span>Login</span>
                </div>
            </div>
        </div>
    )
}

export default Register