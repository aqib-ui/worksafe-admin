import React from "react";
import Style from './Otp.module.css'
import { IconInput, PasswordInput } from '../../../component/input/index'
import passwordCheck from '../../../assets/icons/inputIcons/password-check.png'
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';




const Otp = () => {
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
                <h1>Check your Inbox</h1>
                <h6>Please enter the verification code sent to <br /><b>davesmith10@gmail.com</b> to verify your request and <br />continue resetting your password.</h6>
            </div>
            <div className={Style.CenterWrapper}>
                <IconInput control={control} errors={errors} name={"email"} src={passwordCheck} placeholder={'Enter Code'} label={"Code"}  />
                <div style={{ marginTop: 16 }}>
                    <span>Resend Code (00:29)</span>
                </div>
                <div>
                    <button onClick={handleSubmit(loginAction)}>Continue</button>
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

export default Otp