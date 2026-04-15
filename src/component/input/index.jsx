import React, { useState } from "react";
import Style from './input.module.css'
import { Controller } from "react-hook-form";
import { Input } from "antd";
import EyeSlash from '../../assets/icons/inputIcons/eye-slash.png'



const IconInput = ({onKeyDown, label, type = "text", placeholder, width = "100%", src = "", control, name, errors }) => {
    return (
        <>
            <div className={Style.ImageInputWrapper} >
                <label>{label}</label>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <>
                                <div className={Style.BoxInputWrapper}>
                                    <div className={Style.ImageWrapper}>
                                        <img src={src} />
                                    </div>
                                    <Input onKeyDown={onKeyDown} onChange={onChange} value={value} status={errors?.[name]?.message !== undefined ? 'error' : ''} type={type} placeholder={placeholder} style={{ width: width }} />
                                </div>
                                {errors?.[name]?.message &&
                                    <p>{errors?.[name]?.message}</p>
                                }
                            </>
                        )
                    }}
                    name={name}
                />
            </div>
        </>
    )
}



const SimpleInput = ({onKeyDown, label, type = "text", placeholder, width = "100%", src = "", control, name, errors }) => {
    return (
        <>
            <div className={Style.ImageInputWrapper} >
                <label>{label}</label>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <>
                                <div className={Style.BoxInputWrapperSimple}>
                                    <Input onKeyDown={onKeyDown} onChange={onChange} value={value} status={errors?.[name]?.message !== undefined ? 'error' : ''} type={type} placeholder={placeholder} style={{ width: width }} />
                                </div>
                                {errors?.[name]?.message &&
                                    <p>{errors?.[name]?.message}</p>
                                }
                            </>
                        )
                    }}
                    name={name}
                />
            </div>
        </>
    )
}



const PasswordInput = ({onKeyDown, label, type = "text", placeholder, width = "100%", src = "", control, name, errors }) => {
    const [controlEye, setControlEye] = useState(false)
    return (
        <>
            <div className={Style.ImageInputWrapper} >
                <label>{label}</label>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <>
                                <div className={Style.BoxInputWrapper}>
                                    <div className={Style.ImageWrapper}>
                                        <img src={src} />
                                    </div>
                                    <input onKeyDown={onKeyDown} type={controlEye ? "text" : "password"} onChange={onChange} value={value} status={errors?.[name]?.message !== undefined ? 'error' : ''} placeholder={placeholder} style={{ width: width }} />
                                    <div onClick={() => setControlEye(!controlEye)} className={Style.PasswordIconWrapper}>
                                        <img src={EyeSlash} />
                                    </div>
                                </div>
                                {errors?.[name]?.message &&
                                    <p>{errors?.[name]?.message}</p>
                                }
                            </>
                        )
                    }}
                    name={name}
                />
            </div>
        </>
    )
}

export { IconInput, PasswordInput ,SimpleInput}