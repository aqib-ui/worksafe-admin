import React from "react";
import Style from '../DailyProjectCreateScreen/ProjectCreateScreen.module.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider, Checkbox } from 'antd'
import { connect } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { Circle, GoogleMap, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { FaRegCircle } from "react-icons/fa";
import Autocomplete from "react-google-autocomplete";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { MdOutlineEdit, MdOutlinePolyline } from "react-icons/md";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoTriangle } from "react-icons/io5";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { UploadOutlined } from '@ant-design/icons';
import { MdOutlineLocationSearching } from "react-icons/md";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import utc from 'dayjs/plugin/utc';
import { IoAddCircleOutline } from "react-icons/io5";



const ScopeChange = ({ isRead = false, messageApi, UpdateContractorAC, addContractorAC, CreateLoading, WorkOrderReducer, control, errors, listemailCTC, setListEmailCTC }) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateFormat2 = 'YYYY-MM-DD';



    // Contractor Data
    const [addContractor, setAddContractor] = useState(false);
    const [viewContractor, setViewContractor] = useState(false);
    const [contractorData, setContractorData] = useState({
        name: "",
        address: "",
        zipCode: "",
        country: "",
        email: "",
        state: "",
        phone: "",
        orderPurchaseNumber: ""
    });
    const [selectedContractorIds, setSelectedContractorIds] = useState(JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}").contractor || []);
    const [isContractorNow, setIsContractorNow] = useState('')



    const UpdateContractorDrawer = (StateHe, format) => {
        setIsContractorNow(StateHe)
        setContractorData(format)
    };

    const addContractorDrawer = (StateHe, format) => {
        setIsContractorNow(StateHe)
        setContractorData(format)
        setAddContractor(true);
    };
    const closeAddContractorDrawer = () => {
        setAddContractor(false);
    };

    const addViewContractorDrawer = () => {
        setViewContractor(true);
    };
    const closeViewContractorDrawer = () => {
        setViewContractor(false);
    };

    const OpenReadPromp = (State, format) => {
        closeViewContractorDrawer()
        addContractorDrawer(State, format)
    }

    const handleAddContractor = () => {
        const {
            name,
            address,
            zipCode,
            country,
            email,
            state,
            phone,
            orderPurchaseNumber,
        } = contractorData || {};

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,100}$/i;
        const phoneRegex = /^[0-9+\-() ]*$/;

        // Validate required string fields
        if (!name?.trim()) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Name is required.",
            });
            return false;
        }

        if (!address?.trim()) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Address is required.",
            });
            return false;
        }

        if (!country?.trim()) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Country is required.",
            });
            return false;
        }

        if (!orderPurchaseNumber) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Order Purchase Number is required.",
            });
            return false;
        } else if (!/^[a-zA-Z0-9]{10}$/.test(orderPurchaseNumber)) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Invalid Order Purchase Number. It must be exactly 10 alphanumeric characters.",
            });
            return false;
        }

        // Validate zipCode string (not array)
        if (!zipCode) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Zip code is required.",
            });
            return false;
        } else if (!/^\d{5}$/.test(zipCode)) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Zip code must be exactly 5 digits.",
            });
            return false;
        }

        // Validate state string (not array)
        if (!state || state.trim() === "") {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "State is required.",
            });
            return false;
        }

        // Validate email
        if (!email?.trim()) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Email is required.",
            });
            return false;
        }

        if (!emailRegex.test(email)) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Invalid email format.",
            });
            return false;
        }

        // Validate phone
        if (!phone) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Phone is required.",
            });
            return false;
        } else if (!/^\d{10,15}$/.test(phone)) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Invalid phone number: must be 10 to 15 digits.",
            });
            return false;
        }

        if (!phoneRegex.test(phone)) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Invalid phone number format.",
            });
            return false;
        }
        const contractorDataStringified = Object.fromEntries(
            Object.entries(contractorData || {}).map(([key, value]) => [
                key,
                value !== undefined && value !== null ? String(value) : "",
            ])
        );
        if (isContractorNow === "Update") {
            UpdateContractorAC({ ...contractorDataStringified, contractorId: contractorDataStringified?._id });
        } else {
            addContractorAC(contractorDataStringified);
        }
    };


    const handleKeyDown = (e) => {
        const allowedKeys = [
            "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Home", "End"
        ];

        if (
            !/^[0-9]$/.test(e.key) && // not a digit
            !allowedKeys.includes(e.key)
        ) {
            e.preventDefault();
        }
    };
    // Contractor Data




    const ComapnyUserData = WorkOrderReducer?.companyUserData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
    })








    const [emailCTC, setEmailCTC] = useState("")
    const AddEmailExtra = () => {
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailCTC === "") {
            messageApi.destroy()
            messageApi.open({
                type: "error",
                content: "Please enter email.",
            });
        } else if (!regEmail.test(emailCTC)) {
            messageApi.destroy()
            messageApi.open({
                type: "error",
                content: "Please enter correct email.",
            });
        } else {
            setListEmailCTC(prev => [...prev, emailCTC]);
            setEmailCTC('');
        }
    }

    const DeleteEmailExtra = (indexRemover) => {
        setListEmailCTC(prev => prev?.filter((_, index) => index !== indexRemover));
    }
    return (
        <>
            <div className={Style.FeildRow}>
                <div className={Style.FeildColLeft}>
                    <label>Descriptions Of Changes</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input disabled={CreateLoading || isRead} onChange={onChange} value={value} status={errors?.descriptionOfChanges?.message !== undefined ? 'error' : ''} placeholder='Enter Descriptions Of Changes' style={{ height: 45, marginTop: 3 }} />
                        )}
                        name="descriptionOfChanges"
                    />
                </div>

                <div className={Style.FeildColRight}>
                    <label>Safety Concerns Of Changes</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input disabled={CreateLoading || isRead} onChange={onChange} value={value} status={errors?.safetyCOC?.message !== undefined ? 'error' : ''} placeholder='Enter Safety Concerns Of Changes' style={{ height: 45, marginTop: 3 }} />
                        )}
                        name="safetyCOC"
                    />
                </div>
            </div>

            <div className={Style.FeildRow} style={{ alignItems: 'flex-start' }}>
                <div className={Style.FeildColLeft}>
                    <label >Notifications Emails</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Input disabled={CreateLoading || isRead} value={emailCTC} onChange={(e) => setEmailCTC(e.target.value)} type='email' placeholder='Enter Notifications Emails' style={{ height: 45, marginTop: 3 }} />
                        {!isRead &&
                            <button onClick={AddEmailExtra} className={Style.AddEmailBtn}><IoAddCircleOutline size={28} /></button>
                        }
                    </div>

                    {listemailCTC?.map((data, index) =>
                        <div style={{ paddingTop: 10, display: 'flex', alignItems: 'center' }} className={Style.FeildRow}>
                            <div>
                                <Tooltip title={data}>
                                    <p style={{ margin: 0 }}>{data}</p>
                                </Tooltip>
                            </div>
                            {!isRead &&
                                <button disabled={CreateLoading} onClick={() => DeleteEmailExtra(index)} className={Style.DeleteEmailBtn}>
                                    <AiOutlineDelete size={22} color='red' />
                                </button>
                            }
                        </div>
                    )}
                </div>

                <div className={Style.FeildColRight}>
                    <label>Approvers</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => {
                            return (
                                <Select
       getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                    mode="multiple"
                                    placeholder="Select Approvers"
                                    loading={WorkOrderReducer?.companyUserLoading}
                                    disabled={WorkOrderReducer?.companyUserLoading || CreateLoading || isRead}
                                    onChange={onChange}
                                    value={value == "" ? null : value}
                                    status={errors?.approvers?.message !== undefined ? 'error' : ''}
                                    style={{ marginTop: 3, width: "100%", height: 45 }}
                                    options={ComapnyUserData}
                                />)
                        }}
                        name="approvers"
                    />
                </div>
            </div>




            <div className={Style.FeildRow}>
                <div className={Style.FeildColLeft}>
                    <label>Date Approved</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading || isRead} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value} status={errors?.dateApproved?.message !== undefined ? 'error' : ''} placeholder='Select Date Approved' style={{ height: 45, marginTop: 3 }} />
                        )}
                        name="dateApproved"
                    />
                </div>

                <div className={Style.FeildColRight}>
                    <label>Reminder Date & Time</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading || isRead} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value} status={errors?.reminderDateandTime?.message !== undefined ? 'error' : ''} placeholder='Select Reminder Date & Time' style={{ height: 45, marginTop: 3 }} />
                        )}
                        name="reminderDateandTime"
                    />
                </div>

            </div>
        </>
    )
}

export default ScopeChange;