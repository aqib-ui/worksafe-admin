import React from "react";
import OnBoardHeader from "./onboardHeader";
import Style from './onboard.module.css'
import { SimpleInput } from "../../../component/input";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';







const OnBoardingStepOne = () => {
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
    return (
        <>
            <div className={Style.contentWrapper}>
                <h3>Tell Us About Yourself</h3>
                <h6>Start by providing your contact details so we can set up <br />your company workspace.</h6>

                <div className={Style.WhiteWrapper}>
                    <SimpleInput control={control} errors={errors} name={"first"} placeholder={'Enter first name'} label={"First Name"} width={332} />


                    <div style={{ paddingTop: 16 }}>
                        <SimpleInput control={control} errors={errors} name={"first"} placeholder={'Enter last name'} label={"Last Name"} width={332} />
                    </div>


                    <div style={{ paddingTop: 16 }}>
                        <SimpleInput control={control} errors={errors} name={"first"} placeholder={'000 0000000'} label={"Phone Number"} width={332} />
                    </div>


                    <div style={{ paddingTop: 24 }}>
                        <button>Continue</button>
                    </div>
                </div>
            </div>
        </>
    )
}

const OnBoardingStepTwo = () => {
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
    return (
        <>
            <div className={Style.contentWrapper}>
                <h3>Tell Us About Yourself</h3>
                <h6>Start by providing your contact details so we can set up <br />your company workspace.</h6>

                <div className={Style.WhiteWrapper}>
                    <SimpleInput control={control} errors={errors} name={"first"} placeholder={'Enter first name'} label={"First Name"} width={332} />


                    <div style={{ paddingTop: 16 }}>
                        <SimpleInput control={control} errors={errors} name={"first"} placeholder={'Enter last name'} label={"Last Name"} width={332} />
                    </div>


                    <div style={{ paddingTop: 16 }}>
                        <SimpleInput control={control} errors={errors} name={"first"} placeholder={'000 0000000'} label={"Phone Number"} width={332} />
                    </div>


                    <div style={{ paddingTop: 24 }}>
                        <button>Continue</button>
                    </div>
                </div>
            </div>
        </>
    )
}


const OnBoarding = () => {
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
    return (
        <>
            <div className={Style.onboardWrapper}>
                <OnBoardHeader count={1} totalSteps={3} />
                <OnBoardingStepOne/>
            </div>
        </>
    )
}


export default OnBoarding;