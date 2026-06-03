import React, { useCallback, useEffect, useRef, useState } from "react";
import Style from "./workOrderScreen.module.css";
import { MdOutlineFilterList, MdOutlineLocationSearching } from "react-icons/md";
import { Checkbox, Col, DatePicker, Drawer, Input, Modal, Radio, Row, Slider, Tooltip } from "antd";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import myLocationMarker from "../../../assets/myLocationMarker.png";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from "react-redux";
import { TASK_LOAD_ARCHIVED_COMPLETE, TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, TASK_LOAD_MY_WORK_ORDER_COMPLETE } from "../../../../store/actions/types";


const DEFAULT_EXTRA_DATA = { name: '', type: '' };
const DEFAULT_FORM_VALUES = {
    workOrderModuleName: '',
    workOrderNumber: '',
    assigneName: '',
    assigneEmail: '',
    creatorName: '',
    creatorEmail: '',
    entryRequirements: '',
    hoursWorked: '',
    createDateS: null,
    createDateE: '',
    dateCompletedS: null,
    dateCompletedE: '',
    dateAAS: null,
    dateAAE: '',
};


const WorkOrderFilter = ({ setPage, setIsNext, loading, GetMyAssignedWorkOrder, workSite, page, searchQuery, setParamsNew }) => {
    dayjs.extend(customParseFormat);
    const [polygonType, setPolygonType] = useState([]);
    const dispatch = useDispatch()
    const [assetsFilter, setAssteFilter] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null)
    const [sortBy, setSortBy] = useState('newest')

    const [radius, setRadius] = useState(1)
    const [searchValue, setSearchValue] = useState("")
    const [submitAfterClear, setSubmitAfterClear] = useState(false)
    const onShowAssetsDrawer = () => {
        setAssteFilter(true);
    };
    const onCloseAssetsDrawer = () => {
        const drawerBody = document.querySelector(".ant-drawer-body");
        if (drawerBody) {
            drawerBody.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
        setAssteFilter(false);
    };


    const RemoveAssetFilter = () => {
        if (loading) return;
        setSearchLocation(null)
        setSelectedPosition(null)
        reset(DEFAULT_FORM_VALUES);
        setPriorityFilter([]);
        setCpc([]);
        setLinkModule([]);
        setPolygonType([]);
        setSortBy('newest');
        setRadius(1);
        setExtraDataState(DEFAULT_EXTRA_DATA);
        setSearchValue("")
        setValue1(null)
        setSubmitAfterClear(true)
    }




    // Extra Data


    const [extraDataState, setExtraDataState] = useState(DEFAULT_EXTRA_DATA);


    const [searchLocationModal, setsearchLocationModal] = useState(false);
    const showLocationModal = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setSearchLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setSelectedPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            },
        );
        setsearchLocationModal(true);
    };
    const handleLocationCancel = () => {
        setsearchLocationModal(false);
    };






    const submitParam = async (data) => {
        const params = {
            ...data,
            sortBy,
            priorityFilter,
            cpc,
            linkModule,
            extraData: extraDataState,
            location: selectedPosition ? { ...selectedPosition, radius } : null,
            polygonType,
        };
        dispatch({
            type: TASK_LOAD_MY_WORK_ORDER_COMPLETE,
            loading: false,
            payload: [],
        });
        dispatch({
            type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE,
            loading: false,
            payload: [],
        });
        dispatch({
            type: TASK_LOAD_ARCHIVED_COMPLETE,
            loading: false,
            payload: [],
        });
        setParamsNew(params)
        if (page == 1) {
            const totalLegngth = await GetMyAssignedWorkOrder(workSite, 1, searchQuery, params, setIsNext)
        }
        const drawerBody = document.querySelector(".ant-drawer-body");
        if (drawerBody) {
            drawerBody.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
        setPage(1)
        setAssteFilter(false);
    }







    const [priorityFilter, setPriorityFilter] = useState([]);
    const AddTypeKeyPriority = (UpperParams) => {
        setPriorityFilter((prev) => {
            if (prev.includes(UpperParams)) {
                return prev.filter(item => item !== UpperParams);
            } else {
                return [...prev, UpperParams];
            }
        });
    };


    const [cpc, setCpc] = useState([]);
    const AddCpcTypeKey = (UpperParams) => {
        setCpc((prev) => {
            if (prev.includes(UpperParams)) {
                return prev.filter(item => item !== UpperParams);
            } else {
                return [...prev, UpperParams];
            }
        });
    };


    const [linkModule, setLinkModule] = useState([]);
    const AddLinkModuleKey = (UpperParams) => {
        setLinkModule((prev) => {
            if (prev.includes(UpperParams)) {
                return prev.filter(item => item !== UpperParams);
            } else {
                return [...prev, UpperParams];
            }
        });
    };







    const schema = yup.object().shape({
        workOrderModuleName: yup.string().notRequired(),
        workOrderNumber: yup.string().notRequired(),
        assigneName: yup.string().notRequired(),
        assigneEmail: yup.string().notRequired(),
        creatorName: yup.string().notRequired(),
        creatorEmail: yup.string().notRequired(),
        entryRequirements: yup.string().notRequired(),
        hoursWorked: yup.string().notRequired(),
        createDateS: yup.string().notRequired(),
        createDateE: yup.string().notRequired(),
        dateCompletedS: yup.string().notRequired(),
        dateCompletedE: yup.string().notRequired(),
        dateAAS: yup.string().notRequired(),
        dateAAE: yup.string().notRequired(),

    });
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        getValues,
        setValue,
        watch,
        reset,
        resetField
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: DEFAULT_FORM_VALUES,
    });

    useEffect(() => {
        if (!submitAfterClear) return;

        setSubmitAfterClear(false);
        handleSubmit(submitParam)();
    }, [handleSubmit, submitAfterClear]);



    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
    });
    const StyleLocation = { width: '100%', height: 200 }
    const StyleLocation2 = { width: "100%", height: 500 }



    const [searchLocation, setSearchLocation] = useState(null);

    const mapRef1 = useRef()

    const onMapLoad1 = useCallback((map) => {
        mapRef1.current = map;
    }, []);


    const mapRef2 = useRef()

    const onMapLoad2 = useCallback((map) => {
        mapRef2.current = map;
    }, []);








    const [width, setWidth] = useState(window.innerWidth);


    const [value1, setValue1] = useState(null);
    const locationDataFunc = (ee) => {
        setValue1(ee)
        geocodeByAddress(ee?.label)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                setSearchLocation({
                    lat: lat,
                    lng: lng,
                })
            }
            );
    }





    const handleRecenter = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (mapRef1.current && mapRef2.current) {
                    mapRef1.current.panTo(new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    mapRef1.current.setZoom(18);
                    mapRef2.current.panTo(new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    mapRef2.current.setZoom(18);
                }
            },
            (err) => {
                if (err.code === 2) {
                    setError('Location unavailable.');
                } else if (err.code === 3) {
                    setError('Location request timed out.');
                } else {
                    setError('An unknown error occurred.');
                }
                console.error('Geolocation error:', err);
            }
        );

    };


    const AddTypeKey = (UpperParams) => {
        setPolygonType((prev) => {
            if (prev.includes(UpperParams)) {
                return prev.filter(item => item !== UpperParams);
            } else {
                return [...prev, UpperParams];
            }
        });
    };

    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateFormat2 = 'YYYY-MM-DD';

    useEffect(() => {
        const shouldShow =
            Array.isArray(linkModule) &&
            linkModule.length > 0 &&
            !(linkModule.length === 1 && linkModule[0] === 'Asset');

        if (!shouldShow) {
            setValue('workOrderModuleName', '');
        }
    }, [linkModule, setValue]);


    // console.log(watch("createDateS"), "createDateE",)
    return (
        <>

            <Modal
                title="Select Search"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={searchLocationModal}
                onCancel={handleLocationCancel}
                width={width < 1000 ? "100%" : width < 1550 ? "100%" : "35%"}
                centered={width < 1000 ? false : width < 1550 ? true : true}
                style={{ top: width < 1000 ? 10 : width < 1550 ? 0 : 0 }}
                footer={() => { <></> }}
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
            >
                <div className={Style.SearchLocationType}>
                    <GooglePlacesAutocomplete
                        apiKey="AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY"
                        autocompletionRequest={{
                            componentRestrictions: {
                                country: ['us'],
                            },
                        }}
                        selectProps={{
                            value: value1,
                            placeholder: 'Search location...',
                            onChange: locationDataFunc,
                            isClearable: true,
                        }}
                        debounce={400}
                        minLengthAutocomplete={2}
                    />
                </div>


                <div style={{ paddingTop: 20 }}>
                    {isLoaded &&
                        <GoogleMap
                            mapContainerStyle={StyleLocation2}
                            center={searchLocation}
                            onLoad={onMapLoad2}
                            onClick={(e) => {
                                setSearchLocation({
                                    lat: e.latLng.lat(),
                                    lng: e.latLng.lng()
                                });
                                setSelectedPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                            }}
                            zoom={12}
                            ref={mapRef2}
                            options={{
                                mapTypeId: "satellite",
                                mapTypeControl: false,
                                cameraControl: false,
                                clickableIcons: false,
                                streetViewControl: false,
                                fullscreenControl: false,

                            }}
                        >
                            <Marker
                                position={selectedPosition}
                                icon={{
                                    url: myLocationMarker,
                                    scaledSize: new window.google.maps.Size(40, 50),
                                }}
                            />
                            <div className={Style.PolyCenter}>
                                <Tooltip title="Move to current location" placement="leftTop">
                                    <div onClick={handleRecenter} className={Style.PolyDot}>
                                        <MdOutlineLocationSearching size={20} color="black" />
                                    </div>
                                </Tooltip>
                            </div>
                        </GoogleMap>
                    }
                </div>
            </Modal>

            <Drawer
                title={"Apply Filter"}
                onClose={onCloseAssetsDrawer}
                open={assetsFilter}
                height={'100%'}
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                    const drawerBody = document.querySelector(".ant-drawer-body");
                    if (drawerBody) {
                        drawerBody.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                    }
                }}
            >
                <>
                    <Row>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Sort by</label>
                                </div>
                                <Radio.Group
                                    name="radiogroup"
                                    disabled={loading}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    options={[
                                        { value: 'newest', label: 'Newest first' },
                                        { value: 'recently_updated', label: 'Last updated' },
                                        { value: 'cpc_asc', label: 'Chargeable Profit Center Ascending' },
                                        { value: 'cpc_desc', label: 'Chargeable Profit Center Descending' },
                                        { value: 'status_asc', label: 'Status Ascending' },
                                        { value: 'status_desc', label: 'Status Descending' },
                                        { value: 'priority_asc', label: 'Priority Ascending' },
                                        { value: 'priority_desc', label: 'Priority Descending' },
                                        { value: 'wol_asc', label: 'Work Order Linked Ascending' },
                                        { value: 'wol_desc', label: 'Work Order Linked Descending' },
                                    ]}
                                />
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Select Priority</label>
                                    <label onClick={() => loading ? null : setPriorityFilter([])} className={Style.ResetButton}>Reset</label>
                                </div>
                                <div>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKeyPriority("Standard")} checked={priorityFilter.includes('Standard') ? true : false} defaultChecked={false}>Standard</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKeyPriority("Immediate")} checked={priorityFilter.includes('Immediate') ? true : false} defaultChecked={false}>Immediate</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKeyPriority("High")} checked={priorityFilter.includes('High') ? true : false} defaultChecked={false}>High</Checkbox>
                                </div>
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Select Chargeable Profit Center</label>
                                    <label onClick={() => loading ? null : setCpc([])} className={Style.ResetButton}>Reset</label>
                                </div>
                                <div>
                                    <Checkbox disabled={loading} onClick={() => AddCpcTypeKey("Environment")} checked={cpc.includes('Environment') ? true : false} defaultChecked={false}>Environment</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddCpcTypeKey("Maintenance")} checked={cpc.includes('Maintenance') ? true : false} defaultChecked={false}>Maintenance</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddCpcTypeKey("Operation")} checked={cpc.includes('Operation') ? true : false} defaultChecked={false}>Operation</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddCpcTypeKey("Capital")} checked={cpc.includes('Capital') ? true : false} defaultChecked={false}>Capital</Checkbox>
                                </div>
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Select Work Order Link Module</label>
                                    <label onClick={() => loading ? null : setLinkModule([])} className={Style.ResetButton}>Reset</label>
                                </div>
                                <div>
                                    <Checkbox disabled={loading} onClick={() => AddLinkModuleKey("Alert")} checked={linkModule.includes('Alert') ? true : false} defaultChecked={false}>Alert</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddLinkModuleKey("Asset")} checked={linkModule.includes('Asset') ? true : false} defaultChecked={false}>Asset</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddLinkModuleKey("Suggestion")} checked={linkModule.includes('Suggestion') ? true : false} defaultChecked={false}>POIs</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddLinkModuleKey("Project")} checked={linkModule.includes('Project') ? true : false} defaultChecked={false}>Project</Checkbox>
                                </div>
                            </div>
                        </Col>


                        {Array.isArray(linkModule) &&
                            linkModule.length > 0 &&
                            !(linkModule.length === 1 && linkModule[0] === 'Asset') && (
                                <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                    <div className={Style.FeildCol}>
                                        <label className={Style.LabelFilter}>
                                            Work Order Module Name
                                        </label>

                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Input
                                                    disabled={loading}
                                                    name="workOrderModuleName"
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder="Type Work Order Module Name"
                                                />
                                            )}
                                            name="workOrderModuleName"
                                        />
                                    </div>
                                </Col>
                            )}


                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <label className={Style.LabelFilter}>Work Order Number</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Input disabled={loading} name="workOrderNumber" value={value} onChange={onChange} placeholder="Type Work Order Number" />
                                        </>
                                    )}
                                    name="workOrderNumber"
                                />
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <label className={Style.LabelFilter}>Assignee Name</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Input disabled={loading} name="assigneName" value={value} onChange={onChange} placeholder="Type Work Order Assignee Name" />
                                        </>
                                    )}
                                    name="assigneName"
                                />
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <label className={Style.LabelFilter}>Assignee Email</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Input disabled={loading} name="assigneEmail" value={value} onChange={onChange} placeholder="Type Work Order Assignee Email" />
                                        </>
                                    )}
                                    name="assigneEmail"
                                />
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <label className={Style.LabelFilter}>Creator Name</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Input disabled={loading} name="creatorName" value={value} onChange={onChange} placeholder="Type Work Order Creator Name" />
                                        </>
                                    )}
                                    name="creatorName"
                                />
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <label className={Style.LabelFilter}>Creator Email</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Input disabled={loading} name="creatorEmail" value={value} onChange={onChange} placeholder="Type Work Order Creator Email" />
                                        </>
                                    )}
                                    name="creatorEmail"
                                />
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <label className={Style.LabelFilter}>Entry Requirments</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Input disabled={loading} name="entryRequirements" value={value} onChange={onChange} placeholder="Type Work Order Entry Requirments" />
                                        </>
                                    )}
                                    name="entryRequirements"
                                />
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <label className={Style.LabelFilter}>Hours Worked</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Input disabled={loading} name="hoursWorked" value={value} onChange={onChange} placeholder="Type Work Order Hours Worked" />
                                        </>
                                    )}
                                    name="hoursWorked"
                                />
                            </div>
                        </Col>



                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Create Date</label>
                                    <label onClick={() => { if (!loading) { setValue('createDateS', ''); setValue('createDateE', ''); } }} className={Style.ResetButton}>Reset</label>
                                </div>
                                <Row gutter={12}>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <DatePicker name="createDateS" disabled={loading} style={{ width: '100%' }} placeholder="Start Date"
                                                        value={value ? dayjs(value) : null}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                const formatted = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS");
                                                                onChange(formatted);
                                                                if (getValues("createDateE") && dayjs(getValues("createDateE")).isBefore(date, "day")) {
                                                                    setValue("createDateE", '');
                                                                }
                                                                const nextDay = dayjs(date)
                                                                    .add(1, "day")
                                                                    .startOf("day")
                                                                    .format("YYYY-MM-DD HH:mm:ss.SSS");

                                                                setValue("createDateE", nextDay);
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                    // disabledDate={(current) =>
                                                    //     value ? current && current.isAfter(dayjs(value), "day") : false
                                                    // }
                                                    />
                                                </>
                                            )}
                                            name="createDateS"
                                        />
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <DatePicker name="createDateE" disabled={loading || watch("createDateS") == null} style={{ width: '100%' }} placeholder="End Date"
                                                        value={value ? dayjs(value) : null}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                const formatted = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS");
                                                                onChange(formatted);
                                                                if (getValues("createDateS") && dayjs(date).isBefore(getValues("createDateS"), "day")) {
                                                                    onChange(null);
                                                                }
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                        disabledDate={(current) =>
                                                            getValues("createDateS")
                                                                ? current &&
                                                                (current.isBefore(dayjs(getValues("createDateS")), "day") ||
                                                                    current.isSame(dayjs(getValues("createDateS")), "day"))
                                                                : false
                                                        }
                                                    />
                                                </>
                                            )}
                                            name="createDateE"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>


                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Date Completed</label>
                                    <label onClick={() => { if (!loading) { setValue('dateCompletedS', ''); setValue('dateCompletedE', ''); } }} className={Style.ResetButton}>Reset</label>
                                </div>
                                <Row gutter={12}>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <DatePicker name="dateCompletedS" disabled={loading} style={{ width: '100%' }} onChange={onChange}
                                                        value={value ? dayjs(value) : null}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                const formatted = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS");
                                                                onChange(formatted);
                                                                if (getValues("dateCompletedE") && dayjs(getValues("dateCompletedE")).isBefore(date, "day")) {
                                                                    setValue("dateCompletedE", '');
                                                                }
                                                                const nextDay = dayjs(date)
                                                                    .add(1, "day")
                                                                    .startOf("day")
                                                                    .format("YYYY-MM-DD HH:mm:ss.SSS");

                                                                setValue("dateCompletedE", nextDay);
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                        // disabledDate={(current) =>
                                                        //     value ? current && current.isAfter(dayjs(value), "day") : false
                                                        // }
                                                        placeholder="Start Date" />
                                                </>
                                            )}
                                            name="dateCompletedS"
                                        />
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <DatePicker name="dateCompletedE" disabled={loading || watch("dateCompletedS") == null} style={{ width: '100%' }} onChange={onChange}
                                                        value={value ? dayjs(value) : null}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                const formatted = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS");
                                                                onChange(formatted);
                                                                if (getValues("dateCompletedS") && dayjs(date).isBefore(getValues("dateCompletedS"), "day")) {
                                                                    onChange(null);
                                                                }
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                        disabledDate={(current) =>
                                                            getValues("dateCompletedS")
                                                                ? current &&
                                                                (current.isBefore(dayjs(getValues("dateCompletedS")), "day") ||
                                                                    current.isSame(dayjs(getValues("dateCompletedS")), "day"))
                                                                : false
                                                        }
                                                        placeholder="End Date" />
                                                </>
                                            )}
                                            name="dateCompletedE"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>



                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Date access available</label>
                                    <label onClick={() => { if (!loading) { setValue('dateAAS', ''); setValue('dateAAE', ''); } }} className={Style.ResetButton}>Reset</label>
                                </div>
                                <Row gutter={12}>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <DatePicker name="dateAAS" disabled={loading} style={{ width: '100%' }} onChange={onChange} value={value ? dayjs(value) : null}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                const formatted = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS");
                                                                onChange(formatted);
                                                                if (getValues("dateAAE") && dayjs(getValues("dateAAE")).isBefore(date, "day")) {
                                                                    setValue("dateAAE", '');
                                                                }
                                                                const nextDay = dayjs(date)
                                                                    .add(1, "day")
                                                                    .startOf("day")
                                                                    .format("YYYY-MM-DD HH:mm:ss.SSS");

                                                                setValue("dateAAE", nextDay);
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                        // disabledDate={(current) =>
                                                        //     value ? current && current.isAfter(dayjs(value), "day") : false
                                                        // }
                                                        placeholder="Start Date" />
                                                </>
                                            )}
                                            name="dateAAS"
                                        />
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    <DatePicker name="dateAAE" disabled={loading || watch("dateAAS") == null} style={{ width: '100%' }} onChange={onChange}
                                                        value={value ? dayjs(value) : null}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                const formatted = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS");
                                                                onChange(formatted);
                                                                if (getValues("dateAAS") && dayjs(date).isBefore(getValues("dateAAS"), "day")) {
                                                                    onChange(null);
                                                                }
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                        disabledDate={(current) =>
                                                            getValues("dateAAS")
                                                                ? current &&
                                                                (current.isBefore(dayjs(getValues("dateAAS")), "day") ||
                                                                    current.isSame(dayjs(getValues("dateAAS")), "day"))
                                                                : false
                                                        }
                                                        placeholder="End Date" />
                                                </>
                                            )}
                                            name="dateAAE"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>


                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Select Location</label>
                                    <label className={Style.ResetButton} onClick={() => {
                                        setSearchLocation(null)
                                        setSelectedPosition(null)
                                        setRadius(1)
                                    }}>Reset</label>
                                </div>
                                <div>
                                    {isLoaded &&
                                        <GoogleMap
                                            mapContainerStyle={StyleLocation}
                                            center={searchLocation ? searchLocation : { lat: 39.8283, lng: -98.5795 }}
                                            onLoad={onMapLoad1}
                                            onClick={showLocationModal}
                                            zoom={12}
                                            ref={mapRef1}
                                            options={{
                                                mapTypeId: "satellite",
                                                mapTypeControl: false,
                                                cameraControl: false,
                                                clickableIcons: false,
                                                streetViewControl: false,
                                                fullscreenControl: false,

                                            }}
                                        >
                                            <Marker
                                                position={selectedPosition}
                                                icon={{
                                                    url: myLocationMarker,
                                                    scaledSize: new window.google.maps.Size(40, 50),
                                                }}
                                            />

                                        </GoogleMap>
                                    }
                                </div>
                                {selectedPosition &&
                                    <div style={{ paddingTop: 20 }}>
                                        <label>Set Radius</label>
                                        <Slider disabled={loading} value={radius} min={1} max={1000} onChange={(e) => setRadius(e)} />
                                    </div>
                                }
                            </div>
                        </Col>


                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <div>
                                    <div className={Style.ResetterIcon}>
                                        <label>Extra Data</label>
                                        <label
                                            onClick={() => loading ? null : setExtraDataState({
                                                name: '',
                                                type: '',
                                            })}
                                            className={Style.ResetButton}>Reset</label>
                                    </div>
                                    <Input value={extraDataState.name} disabled={loading} onChange={(e) => setExtraDataState(prev => ({ type: e.target.value == "" ? "" : prev.type == "" ? "Input" : prev.type, name: e.target.value }))} placeholder='Enter name' />
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <label>Value Type</label>
                                    <div className={Style.ValueTypeWrapper}>
                                        <div onClick={() => loading ? null : setExtraDataState(prev => ({ ...prev, type: "Input" }))} className={extraDataState.type == "Input" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Input</div>
                                        <div onClick={() => loading ? null : setExtraDataState(prev => ({ ...prev, type: "Boolean" }))} className={extraDataState.type == "Boolean" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Boolean</div>
                                        <div onClick={() => loading ? null : setExtraDataState(prev => ({ ...prev, type: "Date" }))} className={extraDataState.type == "Date" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Date</div>
                                        <div onClick={() => loading ? null : setExtraDataState(prev => ({ ...prev, type: "Color" }))} className={extraDataState.type == "Color" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Color</div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label>Select location type</label>
                                    <label onClick={() => loading ? null : setPolygonType([])} className={Style.ResetButton}>Reset</label>
                                </div>
                                <div>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKey("Polygon")} checked={polygonType.includes('Polygon') ? true : false} defaultChecked={false}>Polygon</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKey("Polyline")} checked={polygonType.includes('Polyline') ? true : false} defaultChecked={false}>Polyline</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKey("Circle")} checked={polygonType.includes('Circle') ? true : false} defaultChecked={false}>Circle</Checkbox>
                                </div>
                            </div>

                        </Col>

                        <Col style={{ marginTop: 20 }} xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <button onClick={handleSubmit(submitParam)} disabled={loading} style={{ opacity: loading ? 0.4 : 1, cursor: loading ? 'no-drop' : 'pointer' }} className={Style.ApplyBtn}>Apply</button>
                        </Col>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <button onClick={() => RemoveAssetFilter()} disabled={loading} style={{ opacity: loading ? 0.4 : 1, cursor: loading ? 'no-drop' : 'pointer' }} className={Style.CancelBtn}>Remove all filter</button>
                        </Col>
                    </Row>

                </>
            </Drawer>

            <button onClick={onShowAssetsDrawer} className={Style.filterMainBtn}>
                <MdOutlineFilterList size={24} color="white" />
            </button>
        </>
    )
}

export default WorkOrderFilter;
