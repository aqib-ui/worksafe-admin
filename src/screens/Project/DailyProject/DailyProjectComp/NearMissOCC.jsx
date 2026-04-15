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



const NearMissOCC = ({ expandNMO, deleteContractor, getContractor, currentWorkSite, messageApi, UpdateContractorAC, addContractorAC, ProjectReducer, CreateLoading, WorkOrderReducer, control, errors, setSelectedContractorIds, selectedContractorIds, isRead = false }) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateFormat2 = 'YYYY-MM-DD';

    const [nowDeleteContractor, setNowDeleteContractor] = useState()
    const DeleteContractoFr = (_ID) => {
        deleteContractor(_ID);
        setNowDeleteContractor(_ID)
    };



    useEffect(() => {
        if (!messageApi) return;
        if (ProjectReducer.contractorDelete) {
            const isAlreadySelected = selectedContractorIds?.includes(nowDeleteContractor);
            const newSelectedIds = isAlreadySelected
                ? selectedContractorIds.filter(id => id !== nowDeleteContractor)
                : selectedContractorIds;

            setSelectedContractorIds(newSelectedIds);
            const PrevJsonData = JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}");
            const UpdatedJson = {
                ...PrevJsonData,
                contractor: newSelectedIds,
            };
            localStorage.setItem("Rd9!tMQ4vz#1gN*B6_+7@x==", JSON.stringify(UpdatedJson));
            UpdateContractorDrawer('', {
                name: "",
                address: "",
                zipCode: "",
                country: "",
                email: "",
                state: "",
                phone: "",
                orderPurchaseNumber: ""
            })
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Contractor delete successfully",
            });
            getContractor(currentWorkSite)
            closeAddContractorDrawer()
        }
        if (ProjectReducer.contractorAdd?._id) {
            if (isContractorNow !== "Update") {
                const isAlreadySelected = selectedContractorIds.includes(ProjectReducer.contractorAdd?._id);
                const newSelectedIds = isAlreadySelected
                    ? selectedContractorIds.filter(id => id !== ProjectReducer.contractorAdd?._id)
                    : [...selectedContractorIds, ProjectReducer.contractorAdd?._id];
                setSelectedContractorIds(newSelectedIds);
                const PrevJsonData = JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}");
                const UpdatedJson = {
                    ...PrevJsonData,
                    contractor: newSelectedIds,
                };
                localStorage.setItem("Rd9!tMQ4vz#1gN*B6_+7@x==", JSON.stringify(UpdatedJson));
            }
            UpdateContractorDrawer('', {})
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: `Contractor ${isContractorNow == "Update" ? "Updated" : "Added"} successfully`,
            });
            getContractor(currentWorkSite)
            closeAddContractorDrawer()
            const element = document.querySelector(`.ant-drawer-content-wrapper`);
            if (element) {
                element.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            };
        }
    }, [
        ProjectReducer.contractorAdd,
        ProjectReducer.contractorDelete,
        messageApi,
    ]);



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
    return (
        <>
            <div className={Style.FeildRow}>
                <div className={Style.FeildColLeft}>
                    <label>Contractor</label>
                    <div className={Style.AddExtraDataFeild}>
                        <div onClick={addViewContractorDrawer} style={{ width: "100%" }}>
                            <p>Select Contractor<span> {`(${selectedContractorIds.length})`}</span></p>
                        </div>
                        {!isRead &&
                            <div>
                                <button disabled={CreateLoading} onClick={() => addContractorDrawer("Create")}>Add</button>
                            </div>
                        }
                    </div>
                </div>

                <div className={Style.FeildColRight}>
                    <label>Incident Review</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input disabled={CreateLoading || isRead} onChange={onChange} value={value} status={errors?.incidentReview?.message !== undefined ? 'error' : ''} placeholder='Enter Incident Review' style={{ height: 45, marginTop: 3 }} />
                        )}
                        name="incidentReview"
                    />
                </div>


                {/* Add Contractor drawer */}
                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title={<div className={Style.ViewHeaderConstructor}>{isContractorNow} Contractor
                        {isContractorNow == "View" && !isRead &&
                            <div>
                                <button onClick={() => UpdateContractorDrawer("Update", contractorData)}><MdOutlineModeEdit color='green' /></button>
                                <Popconfirm
                                    title="Delete the contractor"
                                    description="Are you sure to delete this contractor?"
                                    okText="Yes"
                                    onConfirm={() => DeleteContractoFr(contractorData._id)}
                                    cancelText="No"
                                >
                                    <button><MdDeleteOutline color='red' /></button>
                                </Popconfirm>
                            </div>
                        }</div>}
                    placement={'right'}
                    onClose={closeAddContractorDrawer}
                    open={addContractor}
                    key={'right'}
                >
                    <div style={{ paddingTop: 10 }}>
                        <label>Name <span style={{ color: 'red' }}>*</span></label>
                        <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.name} onChange={(e) => setContractorData(prev => ({ ...prev, name: e.target.value }))} placeholder='Enter Name' style={{ height: 45, marginTop: 3 }} />
                    </div>

                    <div style={{ paddingTop: 10 }}>
                        <label>Address <span style={{ color: 'red' }}>*</span></label>
                        <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.address} onChange={(e) => setContractorData(prev => ({ ...prev, address: e.target.value }))} placeholder='Enter Address' style={{ height: 45, marginTop: 3 }} />
                    </div>

                    <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
                        <label>Zip code <span style={{ color: 'red' }}>*</span></label>
                        <Input
                            min={1}
                            disabled={isContractorNow === "View"}
                            value={contractorData?.zipCode}
                            onChange={(e) => setContractorData(prev => ({ ...prev, zipCode: e.target.value }))}
                            placeholder="Enter Zip Code"
                            style={{ height: 45, width: '100%' }}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div style={{ paddingTop: 10 }}>
                        <label>State <span style={{ color: 'red' }}>*</span></label>
                        <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.state} onChange={(e) => setContractorData(prev => ({ ...prev, state: e.target.value }))} placeholder='Enter State' style={{ height: 45, marginTop: 3 }} />
                    </div>

                    <div style={{ paddingTop: 10 }}>
                        <label>Country <span style={{ color: 'red' }}>*</span></label>
                        <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.country} onChange={(e) => setContractorData(prev => ({ ...prev, country: e.target.value }))} placeholder='Enter Country' style={{ height: 45, marginTop: 3 }} />
                    </div>

                    <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
                        <label>Phone <span style={{ color: 'red' }}>*</span></label>
                        <Input
                            min={1}
                            disabled={isContractorNow === "View"}
                            value={contractorData?.phone}
                            onChange={(e) => setContractorData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter Phone"
                            style={{ height: 45, width: '100%' }}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div style={{ paddingTop: 10 }}>
                        <label>Email <span style={{ color: 'red' }}>*</span></label>
                        <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.email} onChange={(e) => setContractorData(prev => ({ ...prev, email: e.target.value }))} placeholder='Enter Email' style={{ height: 45, marginTop: 3 }} />
                    </div>

                    <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
                        <label>Other purchase number <span style={{ color: 'red' }}>*</span></label>
                        <Input
                            disabled={isContractorNow === "View"}
                            value={contractorData?.orderPurchaseNumber}
                            onChange={(e) => setContractorData(prev => ({ ...prev, orderPurchaseNumber: e.target.value }))}
                            placeholder="Enter Purchase Number"
                            style={{ height: 45, width: '100%' }}
                            onKeyDown={(e) => {
                                if (blockedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                    {isContractorNow !== "View" &&
                        <div style={{ width: "100%", paddingTop: 20, marginBottom: 20 }}>
                            <button disabled={ProjectReducer?.contractorAddLoading} onClick={handleAddContractor} className={Style.AddWorkBtn}>{ProjectReducer?.contractorAddLoading ? "Loading..." : isContractorNow == "Update" ? "Update Contractor" : "Add Contractor"}</button>
                        </div>
                    }
                </Drawer>
                {/* Add Contractor drawer */}

                {/* View Contractor drawer */}
                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title="View Contractor"
                    placement={'right'}
                    onClose={closeViewContractorDrawer}
                    open={viewContractor}
                    key={'right'}
                >

                    {ProjectReducer?.contractorData !== undefined && ProjectReducer?.contractorData !== null && ProjectReducer?.contractorData !== "" && ProjectReducer?.contractorData.length > 0 ? ProjectReducer?.contractorData.map((data, index) => (
                        <div key={data.id || index} className={Style.ContractorViewContainer}>
                            <div onClick={() => OpenReadPromp("View", data)} style={{ display: 'flex', alignItems: 'center', width: '90%' }}>
                                <div className={Style.IconContractor}>
                                    <RxAvatar size={60} />
                                </div>
                                <div style={{ marginLeft: 5 }}>
                                    <h4>{data?.name}</h4>
                                    <p>{data?.phone}</p>
                                </div>
                            </div>

                            <div>
                                <Checkbox
                                    disabled={isRead}
                                    checked={selectedContractorIds.includes(data._id)}
                                    onChange={() => {
                                        const isAlreadySelected = selectedContractorIds.includes(data._id);
                                        const newSelectedIds = isAlreadySelected
                                            ? selectedContractorIds.filter(id => id !== data._id)
                                            : [...selectedContractorIds, data._id];
                                        setSelectedContractorIds(newSelectedIds);
                                        const PrevJsonData = JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}");
                                        const UpdatedJson = {
                                            ...PrevJsonData,
                                            contractor: newSelectedIds,
                                        };
                                        localStorage.setItem("Rd9!tMQ4vz#1gN*B6_+7@x==", JSON.stringify(UpdatedJson));
                                    }}
                                />
                            </div>
                        </div>
                    )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No contractor found" />}
                </Drawer>
                {/* View Contractor drawer */}
            </div>

            <div className={Style.FeildRow}>
                <div className={Style.FeildColLeft}>
                    <label>Verbally Reported To</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => {
                            return (
                                <Select
                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                    placeholder="Select Verbally Reported To"
                                    loading={WorkOrderReducer?.companyUserLoading}
                                    disabled={WorkOrderReducer?.companyUserLoading || CreateLoading || isRead}
                                    onChange={onChange}
                                    value={value == "" ? null : value}
                                    status={errors?.verballyReportedTo?.message !== undefined ? 'error' : ''}
                                    style={{ marginTop: 3, width: "100%", height: 45 }}
                                    options={ComapnyUserData}
                                />)
                        }}
                        name="verballyReportedTo"
                    />
                </div>

                <div className={Style.FeildColRight}>
                    <label>Reported Date</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading || isRead} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value} status={errors?.reportedDate?.message !== undefined ? 'error' : ''} placeholder='Select Reported Date' style={{ height: 45, marginTop: 3 }} />
                        )}
                        name="reportedDate"
                    />
                </div>
            </div>

            <div className={Style.FeildRowSpacer}>
                <label>Root Cause Analysis</label>
            </div>


            <div className={Style.FeildRow}>
                <div className={Style.FeildColLeft}>
                    <label>What Happened</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input disabled={CreateLoading || isRead} onChange={onChange} value={value} status={errors?.whatHappend?.message !== undefined ? 'error' : ''} placeholder='Enter What Happened' style={{ height: 45, marginTop: 3 }} />
                        )}
                        name="whatHappend"
                    />
                </div>

                <div className={Style.FeildColRight}>
                    <label>Why Did It Happen</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input disabled={CreateLoading || isRead} onChange={onChange} value={value} status={errors?.whyDidItHappen?.message !== undefined ? 'error' : ''} placeholder='Enter Why Did It Happen' style={{ height: 45, marginTop: 3 }} />
                        )}
                        name="whyDidItHappen"
                    />
                </div>
            </div>

            <div className={Style.FeildRow}>
                <div className={Style.FeildColLeft}>
                    <label>How To Prevent Reoccurance</label>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input disabled={CreateLoading || isRead} onChange={onChange} value={value} status={errors?.howToPR?.message !== undefined ? 'error' : ''} placeholder='Enter How To Prevent Reoccurance' style={{ height: 45, marginTop: 3 }} />
                        )}
                        name="howToPR"
                    />
                </div>
            </div>
        </>
    )
}

export default NearMissOCC;