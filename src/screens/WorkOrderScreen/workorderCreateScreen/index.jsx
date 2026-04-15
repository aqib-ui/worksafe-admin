import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Style from './workorderCreateScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Steps, Slider, Row, Col, Modal } from 'antd'
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from 'react-router';
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
import { FlagFilled, UploadOutlined } from '@ant-design/icons';
import { baseUrl } from '../../../../store/config.json';
import { MdOutlineLocationSearching } from "react-icons/md";
import { MdOutlineModeEditOutline } from "react-icons/md";
import myLocationMarker from "../../../assets/myLocationMarker.png";
import GoogleMapCreate from '../../../component/googleMap';
import MapWidget from '../../../component/mapComponent/index'
import rightIcon from '../../../assets/icons/screenIcon/indicate-right.png'
import calendarDatePicker from '../../../assets/calendarDatePicker.png'
import deletePersonalIcon from '../../../assets/deletePersonalIcon.png'
import moreIcon from '../../../assets/more-Icon.png'
import blueCalender from '../../../assets/blueCalender.png'
import blueClock from '../../../assets/blueClock.png'
import editIcon from '../../../assets/editIcon.png'
import blueDoc from '../../../assets/blue-Doc.png'
import redDoc from '../../../assets/red-Doc.png'
import removeIcon from '../../../assets/removeIcon.png'
import galleryAdd from '../../../assets/gallery-add.png'
import redGallery from '../../../assets/red-gallery.png'
import searchNormal from '../../../assets/search-normal.png'
import galleryAddBlue from '../../../assets/gallery-add-blue.png'


import { IoChevronDownOutline } from "react-icons/io5";
import { MdOutlineChevronRight } from "react-icons/md";

import { FiInfo } from "react-icons/fi";

import { createStyles } from 'antd-style';
import ExtraData from '../../../component/extraData';
import { AWSUploadModuleFilter } from '../../../component/AWSUploadModule';
const { Dragger } = Upload;



const WorkorderScreenCreate = ({ WorkOrderReducer, GetWorkSite, GetCompanyUser, GetAdminWorkSite, WorkOrderGetById }) => {
    dayjs.extend(customParseFormat);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const Paramlocation = useLocation();
    const queryParams = new URLSearchParams(Paramlocation.search);
    const refer = queryParams.get('refer');
    const Role_ID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')
    useEffect(() => {
        if (Role_ID == '6768f37ff2ef345b103370df') {
            GetAdminWorkSite()
        }
        else {
            GetWorkSite()
        }
        GetCompanyUser()
    }, [])


    function generateRandomId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }



    const ComapnyUserData = WorkOrderReducer?.companyUserData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
    })

    const editId = queryParams.get('editId');
    useEffect(() => {
        if (editId) {
            localStorage.removeItem("Q8@L!zM7B_1xP#t+6R9Dg*v==");
            WorkOrderGetById(editId);
        }
    }, [editId]);
    const { workOrderGetByIDData } = WorkOrderReducer;

    function rgbaStringToPipe(value) {
        if (typeof value !== "string") {
            console.warn("Expected a string, but got:", value);
            return null;
        }

        if (value.startsWith("rgba")) {
            const matches = value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (matches) {
                const [, r, g, b, a] = matches;
                return `${r}|${g}|${b}|${a}`;
            }
        } else if (value.startsWith("rgb")) {
            const matches = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (matches) {
                const [, r, g, b] = matches;
                return `${r}|${g}|${b}|1`;
            }
        }
        return null;
    }


    const basicInfoSectionRef = useRef(null)
    const taskAndLocationRef = useRef(null)
    const attachmentsRef = useRef(null)
    const [currentSteps, setCurrentSteps] = useState(0);
    const [isFirstStepValid, setIsFirstStepValid] = useState(false);
    const [allFormData, setAllFormData] = useState({});
    const StepChange = value => {
        setCurrentSteps(value);
    };
    const [createLoading, setCreateLoading] = useState(false)
    const [counter, setCounter] = useState(0)

    const getStepOneData = async () => {
        const stepOneData = await basicInfoSectionRef.current?.BasicInformationFinalData();
        if (stepOneData) {
            setAllFormData(prev => ({ ...prev, ...stepOneData }));
            StepChange(1)
            setCounter(prev => prev + 1)
        }
        else {
            return
        }
    };

    const getStepTwoData = async () => {
        const stepTwoData = await taskAndLocationRef.current?.TaskInformationFinalData();
        if (stepTwoData) {
            setAllFormData(prev => ({ ...prev, ...stepTwoData }));
            StepChange(2)
            setCounter(prev => prev + 1)
        } else {
            messageApi.open({
                type: "error",
                content: "Map validation failed or no data returned.",
            });
        }
    };

    const getStepThreeData = async () => {
        const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const stepThreeData = await attachmentsRef.current?.attachmentInformationFinalData();
        setCounter(prev => prev + 1)
        if (stepThreeData) {
            const allFormDataFine = { ...allFormData, ...stepThreeData }
            const {
                completeDate: rawCompleteDate,
                startDate: rawStartDate,
            } = allFormDataFine;
            const totalItems = [
                ...allFormDataFine?.warrantyDocumentation,
                ...allFormDataFine?.safetyDocumentation,
                ...allFormDataFine?.photosOrVideos,
            ].length;
            const completeDateFine = dayjs(rawCompleteDate).format('YYYY-MM-DD HH:mm:ss');
            const startDateFine = dayjs(rawStartDate).format('YYYY-MM-DD HH:mm:ss');
            const currentDateFine = dayjs().format('YYYY-MM-DD');



            setCreateLoading(true)
            const fileArray = [
                ...(allFormDataFine?.photosOrVideos || []).map((file, index) => ({
                    fileName: `${generateRandomId()} ${file.name}`,
                    contentType: file.type,
                    size: file.size,
                    source: "photosOrVideos",
                })),
                ...(allFormDataFine?.safetyDocumentation || []).map((file, index) => ({
                    fileName: `${generateRandomId()} ${file.name}`,
                    contentType: file.type,
                    size: file.size,
                    source: "safetyDocumentation",
                })),
                ...(allFormDataFine?.warrantyDocumentation || []).map((file, index) => ({
                    fileName: `${generateRandomId()} ${file.name}`,
                    contentType: file.type,
                    size: file.size,
                    source: "warrantyDocumentation",
                })),
            ];
            const actualFiles = [
                ...(allFormDataFine?.photosOrVideos || []).map(file => ({
                    file,
                    source: "photosOrVideos",
                })),
                ...(allFormDataFine?.safetyDocumentation || []).map(file => ({
                    file,
                    source: "safetyDocumentation",
                })),
                ...(allFormDataFine?.warrantyDocumentation || []).map(file => ({
                    file,
                    source: "warrantyDocumentation",
                })),
            ];


            const AwsUpload = await AWSUploadModuleFilter({
                messageApi,
                fileArray,
                actualFile: actualFiles,
                moduleName: "workorder",
                setCreateLoading,
            });

            const filterBySource = source =>
                AwsUpload?.filter(f => f.source === source);

            const getRemainingIds = (sourceArray, deletedIds = []) =>
                sourceArray
                    ?.filter(item => !deletedIds.includes(item?._id))
                    ?.map(item => item._id) || [];

            const payload = (() => {
                const worksite = WorkOrderReducer?.workSiteData?.find(
                    d => d._id === currentWorkSite
                );
                const basePayload = {
                    ...(editId && { workorderId: editId }),
                    worksiteId: currentWorkSite,
                    worksite_name: worksite?.title || "",
                    requested_date: currentDateFine ?? "",
                    cpc: allFormDataFine?.ChargeableProfitCenter ?? "",
                    cpc_location: allFormDataFine?.specificArea ?? "",
                    daa: rawStartDate === "" ? "" : startDateFine ?? "",
                    hot_work: (allFormDataFine?.hotWork === "Yes").toString(),
                    entry_requirements: allFormDataFine?.entryRequirment ?? "",
                    none: "false",
                    cdr: rawCompleteDate === "" ? "" : completeDateFine ?? "",
                    priority: allFormDataFine?.Priority ?? "",
                    isExcel: Boolean(allFormDataFine?.isExcel).toString(),
                    work_requested: allFormDataFine?.workRequest ?? "",
                    isJSA:
                        allFormDataFine?.jobSafety === undefined ||
                            allFormDataFine?.jobSafety === null ||
                            allFormDataFine?.jobSafety === ""
                            ? "false"
                            : Boolean(allFormDataFine.jobSafety).toString(),

                    title: allFormDataFine?.Title ?? "",
                    requested_by: allFormDataFine?.AssignTo ?? "",
                    email_copy_to: JSON.stringify(allFormDataFine?.actualEmail ?? []),
                    jsaDocumentation: [],
                    otherDocumentation: [],
                    completed_date: "",
                    send_to: "",
                    notification_description: "",
                    notification_title: "",
                    mopo: allFormDataFine?.materialParts ?? "",
                    mopo_date: "",

                    ...(editId
                        ? (filterBySource("photosOrVideos")?.length > 0 && {
                            photosOrVideos: filterBySource("photosOrVideos"),
                        })
                        : {
                            photosOrVideos: filterBySource("photosOrVideos"),
                        }),

                    ...(editId
                        ? (filterBySource("safetyDocumentation")?.length > 0 && {
                            safetyDocumentation: filterBySource("safetyDocumentation"),
                        })
                        : {
                            safetyDocumentation: filterBySource("safetyDocumentation"),
                        }),

                    ...(editId
                        ? (filterBySource("warrantyDocumentation")?.length > 0 && {
                            warrantyDocumentation: filterBySource("warrantyDocumentation"),
                        })
                        : {
                            warrantyDocumentation: filterBySource("warrantyDocumentation"),
                        }),


                    ...(editId && allFormDataFine?.HphotosOrVideos && {
                        photosOrVideoIds: JSON.stringify(getRemainingIds(
                            workOrderGetByIDData?.photosOrVideos,
                            allFormDataFine?.deletePhoto
                        )),
                    }),

                    ...(editId && allFormDataFine?.HsafetyDocumentation && {
                        safetyDocumentationIds: JSON.stringify(getRemainingIds(
                            workOrderGetByIDData?.safetyDocumentation,
                            allFormDataFine?.deleteSafety
                        )),
                    }),

                    ...(editId && allFormDataFine?.HwarrantyDocumentation && {
                        warrantyDocumentationIds: JSON.stringify(getRemainingIds(
                            workOrderGetByIDData?.warrantyDocumentation,
                            allFormDataFine?.deleteWarrenty
                        )),
                    }),


                    /* Hours worked */
                    add_hours_worked: JSON.stringify(
                        allFormDataFine?.personanalDataList?.length > 0
                            ? allFormDataFine.personanalDataList.map(item => ({
                                id: item?.id,
                                name: item?.name,
                                date_and_hours: item?.hourseData?.map(r => ({
                                    date: dayjs(r.date).format("YYYY-MM-DD"),
                                    no_of_hours: r.noHours.toString(),
                                })) ?? [],
                            }))
                            : []),

                    /* Extra fields */
                    extraFields: JSON.stringify(
                        allFormDataFine?.extraDataList?.length > 0
                            ? allFormDataFine.extraDataList.map(item => ({
                                name: item.name,
                                description: item.description,
                                value:
                                    item.value.type === "Date"
                                        ? dayjs(item.value.value).format("YYYY-MM-DD")
                                        : item.value.type === "color"
                                            ? rgbaStringToPipe(item.value.value)
                                            : item.value.value,
                                type: item.value.type,
                                isRequired: false,
                            }))
                            : []),
                };
                /* Map / Polygon Data */
                if (allFormDataFine?.mapData?.type) {
                    const map = allFormDataFine.mapData;
                    basePayload.polygon = JSON.stringify({
                        type: map.type,
                        safetyZone: map.safetyZone ?? 0,
                        altitude: Number(map.altitude ?? 0),
                        radius: map.radius ?? 0,
                        locations: map.locations?.length ? map.locations : [],
                        meta: map.meta ?? "{}",
                        latitude: map.latitude,
                        longitude: map.longitude,
                    });
                }
                return basePayload;
            })();

            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => {
                    controller.abort();
                }, 1000000);
                const options = {
                    method: editId ? "PATCH" : "POST",
                    headers: {
                        "authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                };
                let response;
                if (actualFiles?.length > 0) {
                    if (AwsUpload) {
                        response = await fetch(`${baseUrl}/workorder`, options);
                    }
                }
                else {
                    response = await fetch(`${baseUrl}/workorder`, options);
                }
                if (response.status == 403) {
                    const res = await response.json();
                    if ("roleUpdated" in res) {
                        localStorage.clear()
                        window.location.reload();
                    }
                    else {
                        clearTimeout(timeout);
                        setCreateLoading(false)
                        messageApi.open({
                            type: "info",
                            content: "Payment expired",
                        });
                    }
                }
                if (response.status == 401) {
                    localStorage.clear()
                    window.location.reload();
                }
                if (response.status == 200 || response.status == 201) {
                    clearTimeout(timeout);
                    closeConfirm()
                    messageApi.open({
                        type: "success",
                        content: `Work order has been ${editId ? "updated" : "created"}.`,
                    });
                    localStorage.removeItem("Q8@L!zM7B_1xP#t+6R9Dg*v==")
                    setCreateLoading(false)
                    if (refer == null) {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/workorder/my-work-site')
                        }, 2000);
                    }
                    else if (refer == "draftPOI") {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/POI/read/draft')
                        }, 2000);
                    }
                    else if (refer == "createPOI") {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/POI/create')
                        }, 2000);
                    }
                    else if (refer == "editPOI") {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/POI/edit')
                        }, 2000);
                    }
                    else if (refer == "project") {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/project/create')
                        }, 2000);
                    }
                    else if (refer == "editProject") {

                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/project/edit')
                        }, 2000);
                    }
                    else if (refer == "alert") {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/alerts/create')
                        }, 2000);
                    }
                    else if (refer == "editAlert") {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/alerts/edit')
                        }, 2000);
                    }
                    else if (refer == "asset") {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/assets/create')
                        }, 2000);
                    }
                    else if (refer == "editAsset") {
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/assets/edit')
                        }, 2000);
                    }
                }
                if (response.status == 500) {
                    clearTimeout(timeout);
                    setCreateLoading(false)
                    messageApi.open({
                        type: "error",
                        content: "Something went wrong",
                    });
                }
                if (response.status == 507) {
                    clearTimeout(timeout);
                    setCreateLoading(false)
                    messageApi.open({
                        type: "error",
                        content: "Storage limit exceeded",
                    });
                }
                if (response.status == 400) {
                    clearTimeout(timeout);
                    setCreateLoading(false)
                    messageApi.open({
                        type: "error",
                        content: "Something went wrong",
                    });
                }
            } catch (err) {
                setCreateLoading(false)
                console.error("Error submitting:", err);
            }
        } else {
            setCreateLoading(false)
            messageApi.open({
                type: "error",
                content: "Map validation failed or no data returned.",
            });
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            localStorage.removeItem("Q8@L!zM7B_1xP#t+6R9Dg*v==");
            localStorage.removeItem("cLocation");
            localStorage.removeItem("sLocation");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);


    const [editWorkOrder, setEditWorkOrder] = useState(false);
    const closeConfirm = () => {
        setEditWorkOrder(false)
    }


    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <div className={Style.Allpath}>
                            <h6>Work Orders</h6>
                            <img src={rightIcon} />
                            <h6 className={Style.activePage}>{editId ? "Edit" : "Create"} Work Order</h6>
                        </div>
                        <h3>{editId ? "Edit" : "Create"} Work Order</h3>
                    </div>
                </div>
                <div className={Style.TableSection}>
                    <div className={Style.ActionTabStepper}>
                        <Steps
                            current={currentSteps}
                            onChange={StepChange}
                            labelPlacement='vertical'
                            className="workOrder-steps"
                            items={
                                [
                                    {
                                        title: 'Basic Information',
                                        disabled: true,
                                    },
                                    {
                                        title: 'Task & Location',
                                        disabled: true
                                    },
                                    {
                                        title: 'Attachments & Instructions',
                                        disabled: true
                                    },
                                ]
                            }
                        />
                    </div>

                    {currentSteps === 0 && <BasicInformation counter={counter} workOrderGetByIDData={workOrderGetByIDData} editId={editId} isValidBtn={setIsFirstStepValid} WorkOrderReducer={WorkOrderReducer} messageApi={messageApi} basicInfoSectionRef={basicInfoSectionRef} ComapnyUserData={ComapnyUserData} WorkOrderReducerData={WorkOrderReducer?.workSiteData} />}
                    {currentSteps === 1 && <TaskAndLocation counter={counter} workOrderGetByIDData={workOrderGetByIDData} editId={editId} messageApi={messageApi} taskAndLocationRef={taskAndLocationRef} />}
                    {currentSteps === 2 && <AttachmentsSection counter={counter} workOrderGetByIDData={workOrderGetByIDData} editId={editId} createLoading={createLoading} messageApi={messageApi} attachmentsRef={attachmentsRef} />}
                </div >

                <div className={Style.SubmitSection}>
                    {currentSteps === 0 ?
                        <>
                            <div></div>
                            <button disabled={!isFirstStepValid} onClick={() => getStepOneData()} className={!isFirstStepValid ? Style.SubmitBtnDisable : Style.SubmitBtn}>Continue</button>
                        </>
                        : currentSteps === 1 ?
                            <>
                                <button disabled={createLoading} onClick={() => setCurrentSteps(0)} className={Style.BackMainBtn}>Back</button>
                                <button disabled={createLoading} className={createLoading ? Style.SubmitBtnDisable : Style.SubmitBtn} onClick={() => getStepTwoData()}>Continue</button>
                            </>
                            :
                            currentSteps === 2 ?
                                <>
                                    <button disabled={createLoading} onClick={() => setCurrentSteps(1)} className={Style.BackMainBtn}>Back</button>
                                    <button disabled={createLoading} className={createLoading ? Style.SubmitBtnDisable : Style.SubmitBtn} onClick={() => editId ? setEditWorkOrder(true) : getStepThreeData()}>{createLoading ? <Spin /> : editId ? "Update Work Order" : "Create"}</button>
                                </> :
                                ""
                    }
                </div>

                {/* confirm Edit */}
                <Modal
                    open={editWorkOrder}
                    onCancel={closeConfirm}
                    maskClosable={!createLoading}
                    header={false}
                    centered={true}
                    closeIcon={false}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button onClick={() => closeConfirm()} disabled={createLoading} className={createLoading ? Style.editPersonalModalFooterCancelD : Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button style={{ background: createLoading ? 'var(--gray-60)' : 'var(--primary)' }} disabled={createLoading} onClick={() => { getStepThreeData() }} className={createLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>{`Update Work Order`}</button>
                        </div>
                    </>}

                >
                    <>
                        <h4 className={Style.AreYouSure}>Are you sure you want to update this Work order?</h4>
                        <p className={Style.AreYouSurePara}>You're about to update this work order. Changes will be saved and visible to all relevant team members.</p>
                    </>
                </Modal>
                {/* confirm Edit */}
            </div >
        </>
    )
}

function mapStateToProps({ WorkOrderReducer }) {
    return { WorkOrderReducer };
}
export default connect(mapStateToProps, WorkOrderAction)(WorkorderScreenCreate);






// first Step complete
const BasicInformation = forwardRef(({ counter, basicInfoSectionRef, ComapnyUserData, WorkOrderReducerData, messageApi, WorkOrderReducer, isValidBtn, editId, workOrderGetByIDData }) => {
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const [mapKey, setMapKey] = useState(0)
    const [workSiteMarker, setWorkSiteMarker] = useState(null)
    const [pointsWorkSite, setPointsWorkSite] = useState([]);
    const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);
    const [workSiteLoader, setWorkSiteLoader] = useState(false)
    const mapRefParent = useRef()
    const [loadingMapData, setLoadingMapData] = useState(false)

    const [selectedShape, setSelectShape] = useState(0);

    // polyline
    const [pointsPolyLine, setPointsPolyLine] = useState([]);
    const [bandPolygon, setBandPolygon] = useState([]);
    const [polylineWidth, setPolylineWidth] = useState(0)
    const [polylineSafety, setPolylineSafety] = useState(0)
    const [polylineElevation, setPolylineElevation] = useState(0)
    const [safetyZonePolyLine, setSafetyZonePolyLine] = useState([]);
    // polyline

    const [measureSetting, setMeasureSetting] = useState("m")
    const childRefParent = useRef();


    // circle
    const [circleRadius, setCircleRadius] = useState(100)
    const [circleSafety, setCircleSafety] = useState(0)
    const [circleElevation, setCircleElevation] = useState(0)
    const circleRef = useRef(null);
    const childCircleRef = useRef(null)
    const [circleCenter, setCircleCenter] = useState(null);
    // circle



    // custom area
    const [customAreaSafety, setCustomAreaSafety] = useState(0)
    const [customAreaElevation, setCustomAreaElevation] = useState(0)
    const [polygonPoint, setPolygonPoint] = useState([])
    // custom area

    // forCircle
    const drawWithRadiusBounds = (firstLocation, radius) => {
        const deltaLat = radius / 111320;
        const deltaLng = radius / (111320 * Math.cos(firstLocation?.lat * (Math.PI / 180)));
        const center = new window.google.maps.LatLng(firstLocation?.lat, firstLocation?.lng);
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(firstLocation?.lat + deltaLat, firstLocation?.lng + deltaLng));
        bounds.extend(new window.google.maps.LatLng(firstLocation?.lat - deltaLat, firstLocation?.lng - deltaLng));
        mapRefParent?.current?.fitBounds(bounds);
    };
    // forCircle


    // forPoints
    const drawPolyLinePolyGoneBond = (coords = []) => {
        if (!coords.length) return;
        const numericCoords = coords.map(([lat, lng]) => ({
            lat: Number(lat),
            lng: Number(lng),
        }));
        const center = numericCoords.reduce(
            (acc, p) => {
                acc.lat += p.lat;
                acc.lng += p.lng;
                return acc;
            },
            { lat: 0, lng: 0 }
        );
        center.lat /= numericCoords.length;
        center.lng /= numericCoords.length;
        // setLocation(center);
        let minLat = Infinity,
            maxLat = -Infinity,
            minLng = Infinity,
            maxLng = -Infinity;
        numericCoords.forEach((p) => {
            minLat = Math.min(minLat, p.lat);
            maxLat = Math.max(maxLat, p.lat);
            minLng = Math.min(minLng, p.lng);
            maxLng = Math.max(maxLng, p.lng);
        });
        const latPadding = (maxLat - minLat) * 0.10;
        const lngPadding = (maxLng - minLng) * 0.10;
        const paddedBounds = new window.google.maps.LatLngBounds(
            {
                lat: minLat - latPadding,
                lng: minLng - lngPadding,
            },
            {
                lat: maxLat + latPadding,
                lng: maxLng + lngPadding,
            }
        );
        if (mapRefParent?.current) {
            mapRefParent.current.fitBounds(paddedBounds);
        }
    };
    // forPoints


    const getMarkerPosition = (locations) => {
        if (!locations) return { lat: 0, lng: 0 };

        // Case: Polygon (array of arrays)
        if (Array.isArray(locations[0])) {
            return {
                lat: Number(locations[0][0]),
                lng: Number(locations[0][1]),
            };
        }

        // Case: Single coordinate
        return {
            lat: Number(locations[0]),
            lng: Number(locations[1]),
        };
    };
    useEffect(() => {
        setLoadingMapData(true)
        const position = getMarkerPosition(workOrderGetByIDData?.polygon?.locations);
        if (editId && counter == 0) {
            reset(
                {
                    Title: workOrderGetByIDData.title,
                    Worksite: workOrderGetByIDData?.WorkSite,
                    Priority: workOrderGetByIDData?.priority,
                    ChargeableProfitCenter: workOrderGetByIDData?.cpc,
                    AssignTo: workOrderGetByIDData?.last_assigned_by,
                }
            )
            if (workOrderGetByIDData?.polygon?.type == "Circle") {
                setSelectShape(2);
                setCircleRadius(Number(workOrderGetByIDData?.polygon?.radius.toFixed()))
                setCircleSafety(Number(workOrderGetByIDData?.polygon?.safetyZone.toFixed()))
                setCircleElevation(Number(workOrderGetByIDData?.polygon?.altitude.toFixed()))
                setTimeout(() => {
                    const STORAGE_KEY = "Q8@L!zM7B_1xP#t+6R9Dg*v==";
                    let prevJsonData = {};
                    try {
                        prevJsonData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
                    } catch {
                        prevJsonData = {};
                    }
                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify({
                            ...prevJsonData,
                            mapData: {
                                ...(prevJsonData.mapData || {}),
                                locations: [[position.lat, position.lng]],
                            },
                        })
                    );
                    childRefParent.current?.drawCircle();
                    circleRef.current?.setCenter(position);
                    childCircleRef.current?.setCenter(position);
                    drawWithRadiusBounds(position, Number(workOrderGetByIDData?.polygon?.radius.toFixed()))
                    setLoadingMapData(false)
                }, 2000);
            }
            else if (workOrderGetByIDData?.polygon?.type === "Polygon") {
                setSelectShape(3)
                const killtime = setTimeout(() => {
                    setCustomAreaSafety(Number(workOrderGetByIDData?.polygon?.safetyZone.toFixed()))
                    setCustomAreaElevation(Number(workOrderGetByIDData?.polygon?.altitude.toFixed()))
                    drawPolyLinePolyGoneBond(workOrderGetByIDData?.polygon?.locations)
                    setPolygonPoint(
                        workOrderGetByIDData?.polygon?.locations?.map(([lat, lng]) => ({
                            lat: Number(lat),
                            lng: Number(lng),
                        })) || []
                    );
                    setLoadingMapData(false)
                }, 1000);
                return () => {
                    clearTimeout(killtime)
                }
            }
            else if (workOrderGetByIDData?.polygon?.type === "Polyline") {
                setSelectShape(1)
                const killtime = setTimeout(() => {
                    setPolylineWidth(Number(workOrderGetByIDData?.polygon?.radius.toFixed()))
                    setPolylineSafety(Number(workOrderGetByIDData?.polygon?.safetyZone.toFixed()))
                    setPolylineElevation(Number(workOrderGetByIDData?.polygon?.altitude.toFixed()))
                    drawPolyLinePolyGoneBond(workOrderGetByIDData?.polygon?.locations)
                    setPointsPolyLine(
                        workOrderGetByIDData?.polygon?.locations?.map(([lat, lng]) => ({
                            lat: Number(lat),
                            lng: Number(lng),
                        })) || []
                    );
                    setLoadingMapData(false)
                }, 1000);
                return () => {
                    clearTimeout(killtime)
                }
            }
            else {
                setLoadingMapData(false)
            }
        }
        else {
            setLoadingMapData(false)
        }
    }, [workOrderGetByIDData])


    useEffect(() => {
        setLoadingMapData(true)
        const stored = JSON.parse(
            localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}"
        );
        const mapData = stored?.mapData;
        const formattedLocation = mapData?.locations?.map(([lat, lng]) => ({
            lat: Number(lat),
            lng: Number(lng),
        }));
        if (!mapData) {
            setLoadingMapData(false)
            return
        };
        const position = getMarkerPosition(mapData?.locations);
        if (mapData.type === "Polyline") {
            setSelectShape(1);
            setPolylineWidth(mapData?.radius)
            setPolylineSafety(mapData?.safetyZone)
            setPolylineElevation(mapData?.altitude)
            setPointsPolyLine(formattedLocation)
            setBandPolygon(mapData?.bandPolygon)
            setSafetyZonePolyLine(mapData?.safetyZonePolyLine)
            const killtime = setTimeout(() => {
                drawPolyLinePolyGoneBond(mapData?.locations)
                setLoadingMapData(false)
            }, 1000);
            return () => {
                clearTimeout(killtime)
            }
        }
        else if (mapData.type === "Polygon") {
            setSelectShape(3);
            setCustomAreaSafety(mapData?.safetyZone)
            setCustomAreaElevation(mapData?.altitude)
            setPolygonPoint(formattedLocation)
            const killtime = setTimeout(() => {
                drawPolyLinePolyGoneBond(mapData?.locations)
                setLoadingMapData(false)
            }, 1000);
            return () => {
                clearTimeout(killtime)
            }
        }
        else if (mapData.type === "Circle") {
            setSelectShape(2);
            setCircleRadius(mapData?.radius)
            setCircleSafety(mapData?.safetyZone)
            setCircleElevation(mapData?.altitude)
            setTimeout(() => {
                const center = {
                    lat: Number(mapData?.locations[0][0]),
                    lng: Number(mapData?.locations[0][1]),
                }
                childRefParent.current?.drawCircle();
                circleRef.current?.setCenter(center);
                childCircleRef.current?.setCenter(center);
                drawWithRadiusBounds(position, Number(mapData?.radius.toFixed()))
                setLoadingMapData(false)
            }, 2000);
        }
        else {
            setLoadingMapData(false)
        }
    }, []);



    useEffect(() => {
        setWorkSiteLoader(true)
        const polygons = WorkOrderReducerData?.find(data => data._id == currentWorkSite)?.polygon;
        const firstLocation = polygons?.locations?.[0];
        const searchLocation = localStorage.getItem("sLocation")
        setValue1(JSON.parse(searchLocation))
        if (polygons?.type == "Circle") {
            const killtime = setTimeout(() => {
                childRefParent.current?.drawCircleWorkSite({
                    lat: Number(firstLocation[0]),
                    lng: Number(firstLocation[1]),
                }, polygons.radius, polygons?.safetyZone)
                setWorkSiteMarker({
                    lat: Number(firstLocation[0]),
                    lng: Number(firstLocation[1]),
                });
                setWorkSiteLoader(false)
            }, 1000);
            return () => {
                clearTimeout(killtime)
            }
        }
        if (polygons?.type == "Polygon") {
            setPointsWorkSite(
                polygons?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            let sumLat = 0;
            let sumLng = 0;
            const count = polygons?.locations.length;
            polygons?.locations.forEach(([latStr, lngStr]) => {
                sumLat += Number(latStr);
                sumLng += Number(lngStr);
            });
            const centerLat = sumLat / count;
            const centerLng = sumLng / count;
            setWorkSiteMarker({
                lat: Number(centerLat),
                lng: Number(centerLng),
            });
            setWorkSiteLoader(false)
        }
        if (polygons?.type == "Polyline") {
            setPointsMoreWorkSite(
                polygons?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            let sumLat = 0;
            let sumLng = 0;
            const count = polygons?.locations.length;
            polygons?.locations.forEach(([latStr, lngStr]) => {
                sumLat += Number(latStr);
                sumLng += Number(lngStr);
            });
            const centerLat = sumLat / count;
            const centerLng = sumLng / count;
            setWorkSiteMarker({
                lat: Number(centerLat),
                lng: Number(centerLng),
            });
            setWorkSiteLoader(false)
        }
    }, [WorkOrderReducerData])






    const resetController = (slide) => {
        if (slide === 1) {
            setSelectShape(1)
            setCircleRadius(100)
            setCircleSafety(0)
            setCircleElevation(0)
            setCircleCenter(null)
            circleRef.current?.setMap(null);
            circleRef.current = null;
            childCircleRef.current?.setMap(null);
            childCircleRef.current = null;
            setCustomAreaSafety(0)
            setCustomAreaElevation(0)
            setPolygonPoint([])
        } else if (slide === 2) {
            setSelectShape(2)
            setPointsPolyLine([])
            setBandPolygon([])
            setPolylineWidth(0)
            setPolylineSafety(0)
            setPolylineElevation(0)
            setSafetyZonePolyLine([])
            setCustomAreaSafety(0)
            setCustomAreaElevation(0)
            setPolygonPoint([])
        } else if (slide === 3) {
            setSelectShape(3)
            setPointsPolyLine([])
            setBandPolygon([])
            setPolylineWidth(0)
            setPolylineSafety(0)
            setPolylineElevation(0)
            setSafetyZonePolyLine([])
            setCircleRadius(100)
            setCircleSafety(0)
            setCircleElevation(0)
            setCircleCenter(null)
            circleRef.current?.setMap(null);
            circleRef.current = null;
            childCircleRef.current?.setMap(null);
            childCircleRef.current = null;
        }
    };


    useEffect(() => {
        const saveDataLocal = async () => {
            const mapAllPoints = childRefParent.current?.returnPoints();
            const getValuesOfForm = getValues()
            const verifyMapTypeData = await verifyMapType(mapAllPoints, getValuesOfForm?.Title);
            const savedForms = JSON.parse(localStorage.getItem('Q8@L!zM7B_1xP#t+6R9Dg*v==')) || [];
            const ParseDataBefore = { ...savedForms, mapData: verifyMapTypeData }
            localStorage.setItem("Q8@L!zM7B_1xP#t+6R9Dg*v==", JSON.stringify(ParseDataBefore));
        }
        saveDataLocal()
    }, [circleCenter, pointsPolyLine, polygonPoint, circleRadius, circleSafety, circleElevation, polylineWidth, polylineSafety, polylineElevation, customAreaSafety, customAreaElevation])


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
    });

    useEffect(() => {
        if (selectedShape !== 2) {
            setMapKey(prev => prev + 1)
        }
    }, [selectedShape])

    const PriorityData = [
        { value: "Immediate", label: "Immediate" },
        { value: "High", label: "High" },
        { value: "Standard", label: "Standard" }
    ]
    const CpcOption = [
        { value: "Environment", label: "Environment" },
        { value: "Maintenance", label: "Maintenance" },
        { value: "Operation", label: "Operation" },
        { value: "Capital", label: "Capital" },
    ]

    const schema = yup.object().shape({
        Title: yup.string().required(),
        Priority: yup.string().required(),
        AssignTo: yup.string().required(),
        ChargeableProfitCenter: yup.string().required(),
    });
    const localData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        getValues,
        watch,
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            Title: '',
            Priority: '',
            AssignTo: '',
            ChargeableProfitCenter: "",
            ...localData
        },
    });

    useEffect(() => {
        const subscription = watch((value) => {
            const savedForms = JSON.parse(localStorage.getItem('Q8@L!zM7B_1xP#t+6R9Dg*v==')) || [];
            const ParseDataBefore = { ...savedForms, ...value }
            localStorage.setItem("Q8@L!zM7B_1xP#t+6R9Dg*v==", JSON.stringify(ParseDataBefore));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (selectedShape !== 0) {
            isValidBtn(isValid);
        }
    }, [isValid, selectedShape]);


    const stylesObjectBlue = {
        root: { alignItems: 'center', display: 'flex' },
        track: { backgroundColor: 'var(--blue-50)', height: "8px", borderRadius: "80px" },
        rail: { backgroundColor: 'var(--gray-10)', height: "8px", borderRadius: "100px" }
    };

    const stylesObjectGreen = {
        root: { alignItems: 'center', display: 'flex' },
        track: { backgroundColor: 'var(--green-50)', height: "8px", borderRadius: "80px" },
        rail: { backgroundColor: 'var(--gray-10)', height: "8px", borderRadius: "100px" }
    };


    useImperativeHandle(basicInfoSectionRef, () => ({
        BasicInformationFinalData: async () => await BasicInformationFinalData(),
    }));

    const verifyMapType = async (mapAllPoints, title) => {
        const points = mapAllPoints?.points || [];
        let centerSelectionScoped = { lat: 0, lng: 0 };
        if (selectedShape !== 2 && points.length > 0) {
            const centerSelection = points.reduce(
                (acc, point) => {
                    acc.lat += point.lat || 0;
                    acc.lng += point.lng || 0;
                    return acc;
                },
                { lat: 0, lng: 0 }
            );
            centerSelection.lat /= points.length;
            centerSelection.lng /= points.length;
            centerSelectionScoped = centerSelection;
        }
        // Meta fallback
        const metaString = JSON.stringify({
            id: editId ? editId : "",
            type: "workorder",
            title: title || "",
        });

        if (selectedShape === 1) {
            const polylineData = {
                type: "Polyline",
                locations: points.map(location => [
                    (location.lat || 0).toString(),
                    (location.lng || 0).toString(),
                ]),
                safetyZone: polylineSafety || 0.0,
                altitude: Number(polylineElevation) || 0.0,
                radius: polylineWidth,
                meta: metaString,
                bandPolygon: bandPolygon,
                safetyZonePolyLine: safetyZonePolyLine
            };
            return {
                safetyZone: polylineData.safetyZone,
                altitude: polylineData.altitude,
                radius: polylineData.radius,
                locations: polylineData.locations.length > 0 ? polylineData.locations : [],
                type: polylineData.type,
                meta: polylineData.meta || "{}",
                latitude: centerSelectionScoped.lat,
                longitude: centerSelectionScoped.lng,
                bandPolygon: polylineData?.bandPolygon,
                safetyZonePolyLine: polylineData?.safetyZonePolyLine
            };
        }

        else if (selectedShape === 2) {
            const firstPoint = points || { lat: 0, lng: 0 };
            const circleData = {
                type: "Circle",
                locations: [[(firstPoint.lat || 0).toString(), (firstPoint.lng || 0).toString()]],
                safetyZone: circleSafety || 0.0,
                altitude: Number(circleElevation) || 0.0,
                radius: circleRadius || 0.0,
                meta: metaString,
            };
            return {
                safetyZone: circleData.safetyZone,
                altitude: circleData.altitude,
                radius: circleData.radius,
                locations: circleData.locations,
                type: circleData.type,
                meta: circleData.meta || "{}",
                latitude: (firstPoint.lat || 0),
                longitude: (firstPoint.lng || 0),
            };
        }

        else if (selectedShape === 3) {
            const customAreaData = {
                type: "Polygon",
                locations: points.map(location => [
                    (location.lat || 0).toString(),
                    (location.lng || 0).toString(),
                ]),
                safetyZone: customAreaSafety || 0.0,
                altitude: Number(customAreaElevation) || 0.0,
                radius: 0,
                meta: metaString,
            };
            return {
                safetyZone: customAreaData.safetyZone,
                altitude: customAreaData.altitude,
                radius: customAreaData.radius,
                locations: customAreaData.locations.length > 0 ? customAreaData.locations : [],
                type: customAreaData.type,
                meta: customAreaData.meta || "{}",
                latitude: centerSelectionScoped.lat,
                longitude: centerSelectionScoped.lng,
            };
        }

        // Fallback if shape is unknown
        return {
            safetyZone: 0.0,
            altitude: 0.0,
            radius: 0.0,
            locations: [],
            type: "Unknown",
            meta: "{}",
            latitude: 0,
            longitude: 0,
        };
    };

    const BasicInformationFinalData = async () => {
        try {
            const isMapShapeVerified = childRefParent.current?.VerifyMapShape?.();
            const mapAllPoints = childRefParent.current?.returnPoints();
            const getValuesOfForm = getValues()
            const verifyMapTypeData = await verifyMapType(mapAllPoints, getValuesOfForm?.Title);
            if (isMapShapeVerified === 1) {
                return { ...getValuesOfForm, mapData: verifyMapTypeData };
            }
            messageApi.destroy();
            const messages = {
                2: "Please select a shape and mark an area on the map.",
                3: "Please select minimum 2 points.",
                4: "Please select minimum 3 points.",
            };
            messageApi.open({
                type: "error",
                content: messages[isMapShapeVerified] || "Please select a shape and mark an area on the map.",
            });
            return null;
        } catch (error) {
            console.log(error);
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong while processing the data.",
            });
            return null;
        }
    };

    const [showPersonnelToolTip, setShowPersonnelToolTip] = useState(false);




    const [value1, setValue1] = useState(null);
    const locationDataFunc = (ee) => {
        geocodeByAddress(ee?.label)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                localStorage.setItem("sLocation", JSON.stringify({
                    lat: lat,
                    lng: lng,
                }))
                setValue1({
                    lat: lat,
                    lng: lng,
                })
            }
            );
    }

    return (
        <>
            <div className={Style.BasicContainer}>
                <Row gutter={[24, 10]} style={{ width: '100%' }}>
                    <Col xxl={10} xl={10} lg={12} md={24} sm={24} xs={24}>
                        <Row align={'middle'} gutter={[16, 10]}>
                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Work Order Title <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input onChange={onChange} value={value} status={errors?.Title?.message !== undefined ? 'error' : ''} placeholder='Enter workorder title' />
                                        )}
                                        name="Title"
                                    />
                                </div>
                            </Col>
                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Select priority level <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                // disabled={CreateLoading}
                                                placeholder="Select Priority"
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.Priority?.message !== undefined ? 'error' : ''}
                                                options={PriorityData}
                                            />)}
                                        name="Priority"
                                    />
                                </div>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Assign To <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                placeholder="Select users"
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.AssignTo?.message !== undefined ? 'error' : ''}
                                                options={ComapnyUserData}
                                                disabled={WorkOrderReducer?.companyUserLoading}
                                                loading={WorkOrderReducer?.companyUserLoading}
                                            />)}
                                        name="AssignTo"
                                    />
                                </div>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Chargeable Profit Center <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                placeholder="Select chargeable profit center"
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.ChargeableProfitCenter?.message !== undefined ? 'error' : ''}
                                                options={CpcOption}
                                            />)}
                                        name="ChargeableProfitCenter"
                                    />
                                </div>
                            </Col>
                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Select Shape <span style={{ color: 'red' }}>*</span></label>
                                </div>
                            </Col>
                            <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
                                <button style={{ cursor: workSiteLoader || loadingMapData ? 'no-drop' : 'pointer' }} disabled={workSiteLoader || loadingMapData} onClick={() => resetController(1)} className={selectedShape == 1 ? Style.ShapeSelectorSelected : Style.ShapeSelector}>
                                    <div className={selectedShape == 1 ? Style.SelectRadioSelected : Style.SelectRadio}></div>
                                    <p>Polyline</p>
                                </button>
                            </Col>
                            <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
                                <button style={{ cursor: workSiteLoader || loadingMapData ? 'no-drop' : 'pointer' }} onClick={() => resetController(2)} disabled={selectedShape == 2 || workSiteLoader || loadingMapData} className={selectedShape == 2 ? Style.ShapeSelectorSelected : Style.ShapeSelector}>
                                    <div className={selectedShape == 2 ? Style.SelectRadioSelected : Style.SelectRadio}></div>
                                    <p>Circle</p>
                                </button>
                            </Col>
                            <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
                                <button style={{ cursor: workSiteLoader || loadingMapData ? 'no-drop' : 'pointer' }} disabled={workSiteLoader || loadingMapData} onClick={() => resetController(3)} className={selectedShape == 3 ? Style.ShapeSelectorSelected : Style.ShapeSelector}>
                                    <div className={selectedShape == 3 ? Style.SelectRadioSelected : Style.SelectRadio}></div>
                                    <p style={{ textOverflow: 'ellipsis', overflow: 'hidden', minWidth: 60, maxWidth: 100, whiteSpace: 'nowrap' }}>Custom Area</p>
                                </button>
                            </Col>
                        </Row>

                        {/* PolyLine Controller */}
                        {selectedShape == 1 ?
                            <>
                                <div className={Style.FeildCol}>
                                    <label>Set Stroke</label>
                                    <div className={Style.SliderContainer}>
                                        <Slider value={polylineWidth} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 1067 : 3500} onChange={(e) => setPolylineWidth(e)} className='blue-slider' styles={stylesObjectBlue} />
                                        <div className={Style.SliderValueBox}>
                                            <p>
                                                {polylineWidth}{measureSetting}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={Style.FeildCol}>
                                    <label>Safety Zone</label>
                                    <div className={Style.SliderContainer}>
                                        <Slider value={polylineSafety} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 107 : 350} onChange={(e) => setPolylineSafety(e)} className='green-slider' styles={stylesObjectGreen} />
                                        <div className={Style.SliderValueBox}>
                                            <p>
                                                {polylineSafety}{measureSetting}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={Style.FeildCol}>
                                    {/* <label>Set Elevation</label> */}
                                    <label style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}>Set Elevation
                                        <div onMouseEnter={() => setShowPersonnelToolTip(true)} onMouseLeave={() => setShowPersonnelToolTip(false)} className={Style.FillPoint}>
                                            <FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' />
                                            {showPersonnelToolTip && (
                                                <div className={Style.tooltipBox} >
                                                    <p>Enter the height or altitude of this area for record-<br />keeping purposes. This does not affect the map view.</p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    <div className={Style.SliderContainer}>
                                        <Slider min={measureSetting == "m" ? -1067 : -3500} value={polylineElevation} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 1067 : 3500} onChange={(e) => setPolylineElevation(e)} className='blue-slider' styles={stylesObjectBlue} />
                                        <div className={Style.SliderValueBox}>
                                            <p>
                                                {polylineElevation}{measureSetting}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                            : selectedShape == 3 ?
                                <>
                                    <div className={Style.FeildCol}>
                                        <label>Safety Zone</label>
                                        <div className={Style.SliderContainer}>
                                            <Slider value={customAreaSafety} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 1000 : 3500} onChange={(e) => setCustomAreaSafety(e)} className='green-slider' styles={stylesObjectGreen} />
                                            <div className={Style.SliderValueBox}>
                                                <p>
                                                    {customAreaSafety}{measureSetting}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={Style.FeildCol}>
                                        {/* <label>Set Elevation</label> */}
                                        <label style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}>Set Elevation
                                            <div onMouseEnter={() => setShowPersonnelToolTip(true)} onMouseLeave={() => setShowPersonnelToolTip(false)} className={Style.FillPoint}>
                                                <FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' />
                                                {showPersonnelToolTip && (
                                                    <div className={Style.tooltipBox} >
                                                        <p>Enter the height or altitude of this area for record-<br />keeping purposes. This does not affect the map view.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                        <div className={Style.SliderContainer}>
                                            <Slider min={measureSetting == "m" ? -1067 : -3500} value={customAreaElevation} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 1000 : 3500} onChange={(e) => setCustomAreaElevation(e)} className='blue-slider' styles={stylesObjectBlue} />
                                            <div className={Style.SliderValueBox}>
                                                <p>
                                                    {customAreaElevation}{measureSetting}
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                </>
                                : selectedShape == 2 ?
                                    <>
                                        <div className={Style.FeildCol}>
                                            <label>Set Radius</label>
                                            <div className={Style.SliderContainer}>
                                                <Slider disabled={selectedShape == 0} value={circleRadius} style={{ width: '100%' }} min={0} max={measureSetting == "m" ? 1067 : 3500} onChange={(e) => setCircleRadius(e)} className='blue-slider' styles={stylesObjectBlue} />
                                                <div className={Style.SliderValueBox}>
                                                    <p>
                                                        {circleRadius}{measureSetting}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={Style.FeildCol}>
                                            <label>Safety Zone</label>
                                            <div className={Style.SliderContainer}>
                                                <Slider disabled={selectedShape == 0} value={circleSafety} style={{ width: '100%' }} max={measureSetting == "m" ? 1067 : 350} onChange={(e) => setCircleSafety(e)} className='green-slider' styles={stylesObjectGreen} />
                                                <div className={Style.SliderValueBox}>
                                                    <p>
                                                        {circleSafety}{measureSetting}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={Style.FeildCol}>
                                            {/* <label>Set Elevation</label> */}
                                            <label style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}>Set Elevation
                                                <div onMouseEnter={() => setShowPersonnelToolTip(true)} onMouseLeave={() => setShowPersonnelToolTip(false)} className={Style.FillPoint}>
                                                    <FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' />
                                                    {showPersonnelToolTip && (
                                                        <div className={Style.tooltipBox} >
                                                            <p>Enter the height or altitude of this area for record-<br />keeping purposes. This does not affect the map view.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                            <div className={Style.SliderContainer}>
                                                <Slider min={measureSetting == "m" ? -1067 : -3500} disabled={selectedShape == 0} value={circleElevation} style={{ width: '100%' }} max={measureSetting == "m" ? 1067 : 3500} onChange={(e) => setCircleElevation(e)} className='blue-slider' styles={stylesObjectBlue} />
                                                <div className={Style.SliderValueBox}>
                                                    <p>
                                                        {circleElevation}{measureSetting}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={Style.FeildCol}>
                                            <label>Set Stroke</label>
                                            <div className={Style.SliderContainer}>
                                                <Slider value={polylineWidth} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 1000 : 3500} onChange={(e) => setPolylineWidth(e)} className='blue-slider' styles={stylesObjectBlue} />
                                                <div className={Style.SliderValueBox}>
                                                    <p>
                                                        {polylineWidth}{measureSetting}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={Style.FeildCol}>
                                            <label>Safety Zone</label>
                                            <div className={Style.SliderContainer}>
                                                <Slider value={polylineSafety} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 1000 : 350} onChange={(e) => setPolylineSafety(e)} className='green-slider' styles={stylesObjectGreen} />
                                                <div className={Style.SliderValueBox}>
                                                    <p>
                                                        {polylineSafety}{measureSetting}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={Style.FeildCol}>
                                            {/* <label>Set Elevation</label> */}
                                            <label style={{ display: 'flex', alignItems: 'center', overflow: 'visible', width: '100%' }}>Set Elevation
                                                <div onMouseEnter={() => setShowPersonnelToolTip(true)} onMouseLeave={() => setShowPersonnelToolTip(false)} className={Style.FillPoint}>
                                                    <FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' />
                                                    {showPersonnelToolTip && (
                                                        <div className={Style.tooltipBox} >
                                                            <p>Enter the height or altitude of this area for record-<br />keeping purposes. This does not affect the map view.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                            <div className={Style.SliderContainer}>
                                                <Slider min={measureSetting == "m" ? -1067 : -3500} value={polylineElevation} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 1000 : 3500} onChange={(e) => setPolylineElevation(e)} className='blue-slider' styles={stylesObjectBlue} />
                                                <div className={Style.SliderValueBox}>
                                                    <p>
                                                        {polylineElevation}{measureSetting}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                        }
                        {/* PolyLine Controller */}
                    </Col>
                    <Col xxl={14} xl={14} lg={12} md={24} sm={24} xs={24} style={{ paddingBottom: 66 }}>
                        <div style={{ marginBlock: 16 }}>
                            <GooglePlacesAutocomplete
                                apiKey="AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY"
                                autocompletionRequest={{
                                    componentRestrictions: {
                                        country: ['us'],
                                    },
                                }}
                                selectProps={{
                                    className: "NewSearchInputMap",
                                    placeholder: 'Search Location',
                                    onChange: locationDataFunc,
                                }}
                                debounce={400}
                                minLengthAutocomplete={2}
                            />
                            {/* <Input placeholder='Search Location' suffix={<img style={{height:24}} src={searchNormal}/>}/> */}
                        </div>
                        <div className={Style.MapSide}>
                            {isLoaded ? (
                                <>
                                    <MapWidget
                                        // center Marker
                                        value1={value1}
                                        setValue1={setValue1}
                                        // center Marker
                                        currectType={selectedShape}
                                        mapKey={mapKey}
                                        childRefParent={childRefParent}
                                        // polyLine
                                        polylineSafetyZone={polylineSafety}
                                        polylineWidth={polylineWidth}
                                        pointsPolyLine={pointsPolyLine}
                                        setPointsPolyLine={setPointsPolyLine}
                                        setBandPolygon={setBandPolygon}
                                        bandPolygon={bandPolygon}
                                        setSafetyZonePolyLine={setSafetyZonePolyLine}
                                        safetyZonePolyLine={safetyZonePolyLine}
                                        // polyLine

                                        // Circle
                                        circleWidth={circleRadius}
                                        circleSafetyZone={circleSafety}
                                        mapRefParent={mapRefParent}
                                        circleRef={circleRef}
                                        setCircleCenter={setCircleCenter}
                                        circleCenter={circleCenter}
                                        childCircleRef={childCircleRef}
                                        // Circle

                                        // Custom Area
                                        polygonSafetyZone={customAreaSafety}
                                        setPolygonPoint={setPolygonPoint}
                                        polygonPoint={polygonPoint}
                                        // Custom Area


                                        // center Worksite
                                        centerWorkSite={workSiteMarker}
                                        // center Worksite

                                        // worksite CustomArea
                                        customAreaPoint={pointsWorkSite}
                                        // worksite CustomArea

                                        // worksite polyline
                                        polylinePoint={pointsMoreWorkSite}
                                        // worksite polyline

                                        // worksite Loader
                                        workSiteLoader={workSiteLoader}
                                        loadingMapData={loadingMapData}
                                        loadingTitle={"Loading data for map."}
                                        loadingPara={"Fetching map data. This may take a moment."}
                                    // worksite Loader
                                    />
                                </>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: "100%" }}>
                                    <Spin size='default' />
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div >
        </>
    )
})
// first Step complete


// second Step complete
const TaskAndLocation = forwardRef(({ counter, taskAndLocationRef, messageApi, editId, workOrderGetByIDData }) => {
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateFormat2 = 'YYYY-MM-DD';

    const schema = yup.object().shape({
        startDate: yup.string().notRequired(),
        completeDate: yup.string().notRequired(),
        specificArea: yup.string().notRequired(),
        hotWork: yup.string().notRequired(),
        entryRequirment: yup.string().notRequired(),
        materialParts: yup.string().notRequired().max(100)
    });
    const localData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");
    function generateRandomId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    useEffect(() => {
        if (editId && counter == 1) {
            reset(
                {
                    startDate: workOrderGetByIDData.cdr,
                    completeDate: workOrderGetByIDData?.daa,
                    specificArea: workOrderGetByIDData?.cpc_location,
                    hotWork: workOrderGetByIDData?.hot_work == true ? "Yes" : "No",
                    entryRequirment: workOrderGetByIDData?.entry_requirements,
                    materialParts: workOrderGetByIDData?.mopo,
                }
            )
            const capitalizeWord = (word) =>
                typeof word === "string" && word.length > 0
                    ? word[0].toUpperCase() + word.slice(1)
                    : "";
            const formattedData = workOrderGetByIDData?.extraFields.map(item => ({
                name: item.name || '',
                description: item.description ?? null,
                type: capitalizeWord(item.type) || 'Input',
                id: generateRandomId(),
                value: {
                    type: item.type || '',
                    value: item.value || ''
                }
            }));
            // setExtraDataList(formattedData)
            setExtraDataList(() => {
                const updatedList = [...formattedData];
                const prevJsonData = JSON.parse(
                    localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}"
                );
                localStorage.setItem(
                    "Q8@L!zM7B_1xP#t+6R9Dg*v==",
                    JSON.stringify({
                        ...prevJsonData,
                        extraData: updatedList,
                    })
                );
                return updatedList;
            });
            const dataPersonanal = JSON.parse(workOrderGetByIDData?.add_hours_worked ? workOrderGetByIDData?.add_hours_worked : null);
            const transformedDataPersonal = dataPersonanal?.map(item => ({
                ...item,
                hourseData: item.date_and_hours.map(entry => ({
                    ...entry,
                    date: dayjs(entry.date).local(),
                    noHours: entry?.no_of_hours
                }))
            }));

            setPersonanalDataList(() => {
                const updatedList = [...transformedDataPersonal];
                const prevJsonData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");
                localStorage.setItem(
                    "Q8@L!zM7B_1xP#t+6R9Dg*v==",
                    JSON.stringify({
                        ...prevJsonData,
                        personanalDataList: updatedList,
                    })
                );
                return updatedList;
            });
        }
    }, [workOrderGetByIDData])


    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        getValues,
        watch,
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            startDate: '',
            completeDate: '',
            specificArea: '',
            hotWork: '',
            entryRequirment: '',
            materialParts: '',
            ...localData
        },
    });
    const BooleanOpiton = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ]

    useEffect(() => {
        const subscription = watch((value) => {
            const savedForms = JSON.parse(localStorage.getItem('Q8@L!zM7B_1xP#t+6R9Dg*v==')) || [];
            const ParseDataBefore = { ...savedForms, ...value }
            localStorage.setItem("Q8@L!zM7B_1xP#t+6R9Dg*v==", JSON.stringify(ParseDataBefore));
        });
        return () => subscription.unsubscribe();
    }, [watch]);


    // Drawer Personanal
    const [showExtraToolTip, setShowExtraToolTip] = useState(false);
    const [showPersonnelToolTip, setShowPersonnelToolTip] = useState(false);
    const [personanalDataList, setPersonanalDataList] = useState(JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "[]").personanalDataList ?? []);

    const [addDrawer, setAddDrawer] = useState(false);
    const showAddDrawer = () => {
        setAddDrawer(true);
    };
    const closeAddDrawer = () => {
        setAddDrawer(false);
    };
    const [personanalData, setPersonanalData] = useState({
        name: '',
        id: Date.now(),
        hourseData: [
            {
                date: '',
                noHours: 1,
                id: Date.now(),
            },
        ],
    });

    const [editPersonanalData, setEditPersonanalData] = useState();
    const handleAddEntry = () => {
        setPersonanalData(prev => ({
            ...prev,
            hourseData: [
                ...prev.hourseData,
                {
                    date: '',
                    noHours: 1,
                    id: Date.now(),
                },
            ],

        }));
    };

    const handleAddEntryEdit = () => {
        setEditPersonanalData(prev => ({
            ...prev,
            hourseData: [
                ...prev.hourseData,
                {
                    date: '',
                    noHours: 1,
                    id: Date.now(),
                },
            ],

        }));
    };

    const handleRemoveEntry = (index) => {
        setPersonanalData(prev => ({
            ...prev,
            hourseData: prev.hourseData?.filter((_, i) => i !== index),
        }));
    };
    const handleRemoveEntryEdit = (index) => {
        setEditPersonanalData(prev => ({
            ...prev,
            hourseData: prev.hourseData?.filter((_, i) => i !== index),
        }));
    };

    const handleChange = (index, key, value) => {
        setPersonanalData(prev => {
            const updated = [...prev.hourseData];
            updated[index] = {
                ...updated[index],
                [key]: value,
            };
            return { ...prev, hourseData: updated };
        });
    };

    const handleChangeEdit = (index, key, value) => {
        setEditPersonanalData(prev => {
            const updated = [...prev.hourseData];
            updated[index] = {
                ...updated[index],
                [key]: value,
            };
            return { ...prev, hourseData: updated };
        });
    };

    const resetHours = () => {
        setPersonanalData({
            name: '',
            hourseData: [
                {
                    date: '',
                    noHours: 1,
                    id: Date.now(),
                },
            ],
        })
        setAddDrawer(false)
    }

    const isOnlyOne = personanalData?.hourseData?.length === 1;
    const isOnlyOneEdit = editPersonanalData?.hourseData?.length === 1;
    const isNoName = personanalData.name === "" ? true : false;
    const hasInvalidEntry = personanalData.hourseData.some(
        entry =>
            !entry?.date ||
            entry?.noHours === '' ||
            entry?.noHours === null ||
            entry?.noHours === undefined ||
            entry?.noHours <= 0
    );


    const isNoNameEdit = editPersonanalData?.name === "" ? true : false;
    const hasInvalidEntryEdit = editPersonanalData?.hourseData?.some(
        entry =>
            !entry?.date ||
            entry?.noHours === '' ||
            entry?.noHours === null ||
            entry?.noHours === undefined ||
            entry?.noHours <= 0
    );

    const handleAddData = () => {
        if (!personanalData.name) {
            messageApi.open({
                type: "error",
                content: "Please provide a name",
            });
            return;
        }

        setPersonanalDataList(prev => {
            const updatedList = [...prev, { ...personanalData, id: Date.now() }];

            const prevJsonData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");
            localStorage.setItem(
                "Q8@L!zM7B_1xP#t+6R9Dg*v==",
                JSON.stringify({
                    ...prevJsonData,
                    personanalDataList: updatedList,
                })
            );

            return updatedList;
        });

        // Reset form
        setPersonanalData({
            name: '',
            id: Date.now(),
            hourseData: [{ date: '', noHours: 1, id: Date.now() }],
        });
    };
    const handleSaveEdit = (editData) => {
        setPersonanalDataList(prev =>
            prev.map(item => item.id === editData ? editPersonanalData : item)
        );
        const prevJsonData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");
        const updatedList = prevJsonData?.personanalDataList?.map(item =>
            item.id === editData ? editPersonanalData : item
        ) || [];
        localStorage.setItem(
            "Q8@L!zM7B_1xP#t+6R9Dg*v==",
            JSON.stringify({ ...prevJsonData, personanalDataList: updatedList })
        );
        cancelEditModal()
        messageApi.open({
            type: "success",
            content: "Personnel has been updated.",
        });
    };
    const deletePersonalList = (id) => {
        setPersonanalDataList(prev => prev?.filter(item => item.id !== id));

        const prevJsonData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");
        const updatedList = prevJsonData?.personanalDataList?.filter(item => item.id !== id) || [];
        localStorage.setItem(
            "Q8@L!zM7B_1xP#t+6R9Dg*v==",
            JSON.stringify({ ...prevJsonData, personanalDataList: updatedList })
        );

        messageApi.open({
            type: "error",
            content: "Personnel has been deleted.",
        });
    };
    const showEditModal = (id) => {
        setEditPersonalModal(true);
        setEditPersonanalData(
            personanalDataList.find((pre) => pre?.id === id)
        );
    };
    const [editPersonalModal, setEditPersonalModal] = useState(false);
    const cancelEditModal = () => {
        setEditPersonalModal(false);
    };
    const getPersonalDropdown = (id) => [
        {
            key: '1',
            label: (
                <div onClick={() => showEditModal(id)} className={Style.DropdownOption}>
                    <img src={editIcon} style={{ height: 20 }} />
                    <p>
                        Edit
                    </p>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <>
                    <div onClick={() => deletePersonalList(id)} className={Style.DropdownOption}>
                        <img src={deletePersonalIcon} style={{ height: 20 }} />
                        <p>
                            Delete
                        </p>
                    </div>
                </>
            ),
        },
    ];
    // Drawer Personanal




    // Drawer Extra Data
    const localStoreKey = "Q8@L!zM7B_1xP#t+6R9Dg*v=="
    const [extraDataList, setExtraDataList] = useState(JSON.parse(localStorage.getItem(localStoreKey) || "[]").extraData ?? []);
    useImperativeHandle(taskAndLocationRef, () => ({
        TaskInformationFinalData: async () => await TaskInformationFinalData(),
    }));
    // Drawer Extra Data

    const TaskInformationFinalData = async () => {
        try {
            const getValuesOfForm = getValues()
            return { ...getValuesOfForm, personanalDataList: personanalDataList, extraDataList: extraDataList };
        } catch (error) {
            console.log(error);
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong while processing the data.",
            });
            return null;
        }
    };




    return (
        <>
            <div className={Style.BasicContainer}>
                <Row gutter={16} style={{ width: '100%' }}>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} >
                        <Row gutter={16}>
                            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={12}>
                                <div className={Style.TaskFeild}>
                                    <label>Start Date & Time</label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <DatePicker suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />} showTime={{ format: 'hh:mm A', use12Hours: true, showSecond: false, }} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs(value) : null} status={errors?.startDate?.message !== undefined ? 'error' : ''} placeholder='Select date & time' />
                                            )
                                        }}
                                        name="startDate"
                                    />
                                </div>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={12}>
                                <div className={Style.TaskFeild}>
                                    <label>Completion Date & Time</label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <DatePicker suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />} showTime={{ format: 'hh:mm A', use12Hours: true, showSecond: false, }} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs(value) : null} status={errors?.completeDate?.message !== undefined ? 'error' : ''} placeholder='Select date & time' />
                                            )
                                        }}
                                        name="completeDate"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild}>
                            <label>Specific Area</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input onChange={onChange} value={value} status={errors?.specificArea?.message !== undefined ? 'error' : ''} placeholder='Enter specific area' />
                                )}
                                name="specificArea"
                            />
                        </div>
                    </Col>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} >
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Hot Work</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                        placeholder="Select hot work"
                                        onChange={onChange}
                                        value={value == "" ? null : value}
                                        status={errors?.hotWork?.message !== undefined ? 'error' : ''}
                                        options={BooleanOpiton}
                                        suffixIcon={<IoChevronDownOutline size={24} color='#626D6F' />}
                                        MdOutlineChevronRight
                                    />)}
                                name="hotWork"
                            />
                        </div>
                    </Col>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Entry Requirement</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input onChange={onChange} value={value} status={errors?.entryRequirment?.message !== undefined ? 'error' : ''} placeholder='Enter entry requirement' />
                                )}
                                name="entryRequirment"
                            />
                        </div>
                    </Col>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}>Personnel (Hours Worked)
                                <div onMouseEnter={() => setShowPersonnelToolTip(true)} onMouseLeave={() => setShowPersonnelToolTip(false)} className={Style.FillPoint}>
                                    <FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' />
                                    {showPersonnelToolTip && (
                                        <div className={Style.tooltipBox} >
                                            <p>Add team members involved in this task and log the<br /> number of hours worked by each person.</p>
                                        </div>
                                    )}
                                </div>
                            </label>
                            {/* <label style={{ display: 'flex', alignItems: 'center' }}>Personnel (Hours Worked)<FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' /></label> */}
                            <div onClick={showAddDrawer} className={Style.AddExtraDataFeild}>
                                <div>
                                    <p>Add personnel<span> ({personanalDataList?.length ?? 0})</span></p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MdOutlineChevronRight size={28} color='#626D6F' />
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        {/* <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}>Extra Data
                                <div onMouseEnter={() => setShowExtraToolTip(true)} onMouseLeave={() => setShowExtraToolTip(false)} className={Style.FillPoint}>
                                    <FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' />
                                    {showExtraToolTip && (
                                        <div className={Style.tooltipBox} >
                                            <p> Attach any additional notes or custom data relevant to<br /> the task.</p>
                                        </div>
                                    )}
                                </div>
                            </label>
                            <div onClick={showAddExtraDrawer} className={Style.AddExtraDataFeild}>
                                <div>
                                    <p>Add extra data<span> ({extraDataList?.length ?? 0})</span></p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MdOutlineChevronRight size={28} color='#626D6F' />
                                </div>
                            </div>
                        </div> */}
                        <ExtraData name={"Work Order"} extraDataList={extraDataList} setExtraDataList={setExtraDataList} localStoreKey={localStoreKey} counter={counter} workOrderGetByIDData={workOrderGetByIDData} editId={editId} messageApi={messageApi} taskAndLocationRef={taskAndLocationRef} />
                    </Col>
                    <Col span={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Material / Parts Ordered</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input.TextArea rows={6} onChange={onChange} value={value} status={errors?.materialParts?.message !== undefined ? 'error' : ''} placeholder='Enter material or parts ordered' />
                                )}
                                name="materialParts"
                            />
                        </div>
                    </Col>
                </Row>


                {/* Personanal drawer */}
                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title="Add Personnel (Hours Worked)"
                    placement={'right'}
                    styles={{ header: { padding: '17px 24px' }, body: { padding: '24px' } }}
                    onClose={closeAddDrawer}
                    open={addDrawer}
                    width={486}
                    key={'right'}
                >


                    <>
                        <div>
                            <label>Name <span style={{ color: 'red' }}>*</span></label>
                            <Input value={personanalData.name} onChange={(e) => setPersonanalData(prev => ({ ...prev, name: e.target.value }))} placeholder='Name here' />
                        </div>

                        <hr className={Style.HRHtm} />
                        {personanalData.hourseData.map((entry, i) => (
                            <div key={entry.id} style={{ display: 'flex', alignItems: 'flex-end', marginTop: 10 }}>
                                <div style={{ flex: 1, paddingRight: 6 }}>
                                    <label>Date <span style={{ color: 'red' }}>*</span></label>
                                    <DatePicker
                                        suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />}
                                        inputReadOnly
                                        value={entry.date ? dayjs(entry.date, 'YYYY-MM-DD') : null}
                                        minDate={dayjs(formattedDate, dateFormat2)}
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                'date',
                                                e ? dayjs(e).format('YYYY-MM-DD') : ''
                                            )
                                        }
                                        format={dateFormat2}
                                        placeholder="Date here"
                                    />
                                </div>

                                <div style={{ flex: 1, paddingLeft: 6 }}>
                                    <label>No of hours <span style={{ color: 'red' }}>*</span></label>
                                    <InputNumber
                                        min={1}
                                        max={999}
                                        value={entry.noHours}
                                        onChange={(value) =>
                                            handleChange(i, 'noHours', value)
                                        }
                                        placeholder="Number of hours"
                                    />
                                </div>

                                <div
                                    onClick={() => {
                                        if (!isOnlyOne) handleRemoveEntry(i);
                                    }} className={Style.DeletePersonelIcon}
                                    style={{
                                        cursor: isOnlyOne ? 'not-allowed' : 'pointer',
                                        opacity: isOnlyOne ? 0.4 : 1,
                                    }}                                >
                                    <img src={deletePersonalIcon} style={{ height: 24 }} />
                                </div>
                            </div>
                        ))}

                        <div className={Style.PersonAnother}>
                            <button onClick={() => handleAddEntry()}>
                                <FiPlus size={18} color='#214CBC' style={{ marginRight: 5 }} />Add Another
                            </button>
                        </div>

                        <div className={Style.PersonalActionWrapper}>
                            <button onClick={resetHours} className={Style.cancelWorkBtn}>Cancel</button>
                            <button onClick={handleAddData} disabled={hasInvalidEntry || isNoName} className={hasInvalidEntry || isNoName ? Style.AddWorkBtnD : Style.AddWorkBtn}>Add Work</button>
                        </div>
                    </>
                    {personanalDataList?.length > 0 ? personanalDataList?.map((data, index) => {
                        const totalHours = data.hourseData?.reduce((acc, record) => acc + Number(record.noHours || 0), 0);
                        return (
                            <div key={index} className={Style.MainListingHourWork}>
                                <div className={Style.HoursWorkListTop}>
                                    <h6>{data.name}</h6>
                                    <Dropdown trigger={['click']} menu={{ items: getPersonalDropdown(data?.id) }} placement="bottomRight">
                                        <button><img src={moreIcon} style={{ height: "24px" }} /></button>
                                    </Dropdown>
                                </div>
                                <p>Total time: {totalHours} hours</p>

                                {data.hourseData.map((record, i) => (
                                    <div key={i} className={Style.HoursWorkListBottom}>
                                        <img src={blueCalender} style={{ height: 20 }} /><p>{new Date(record.date).toISOString().split('T')[0]}</p>
                                        <img src={blueClock} style={{ height: 20, marginLeft: 10 }} /> <p>{record.noHours}</p>
                                    </div>
                                ))}
                            </div>
                        )
                    }) : ""}
                </Drawer>
                <Modal
                    title="Edit Personnel"
                    open={editPersonalModal}
                    onCancel={cancelEditModal}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button onClick={cancelEditModal} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button disabled={hasInvalidEntryEdit || isNoNameEdit} onClick={() => handleSaveEdit(editPersonanalData?.id)} className={hasInvalidEntryEdit || isNoNameEdit ? Style.editPersonalModalFooterSaveD : Style.editPersonalModalFooterSave}>Save Changes</button>
                        </div>
                    </>}
                >
                    <>
                        <div>
                            <label>Name <span style={{ color: 'red' }}>*</span></label>
                            <Input value={editPersonanalData?.name} onChange={(e) => setEditPersonanalData(prev => ({ ...prev, name: e.target.value }))} placeholder='Name here' />
                        </div>
                        <hr className={Style.HRHtm} />
                        {editPersonanalData?.hourseData.map((entry, i) => (
                            <div key={entry.id} style={{ display: 'flex', alignItems: 'flex-end', marginTop: 10 }}>
                                <div style={{ flex: 1, paddingRight: 6 }}>
                                    <label>Date <span style={{ color: 'red' }}>*</span></label>
                                    <DatePicker
                                        suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />}
                                        inputReadOnly
                                        value={entry.date ? dayjs(entry.date, 'YYYY-MM-DD') : null}
                                        minDate={dayjs(formattedDate, dateFormat2)}
                                        onChange={(e) =>
                                            handleChangeEdit(
                                                i,
                                                'date',
                                                e ? dayjs(e).format('YYYY-MM-DD') : ''
                                            )
                                        }
                                        format={dateFormat2}
                                        placeholder="Date here"
                                    />
                                </div>

                                <div style={{ flex: 1, paddingLeft: 6 }}>
                                    <label>No of hours <span style={{ color: 'red' }}>*</span></label>
                                    <InputNumber
                                        min={1}
                                        max={999}
                                        value={entry.noHours}
                                        onChange={(value) =>
                                            handleChangeEdit(i, 'noHours', value)
                                        }
                                        placeholder="Number of hours"
                                    />
                                </div>

                                <div
                                    onClick={() => {
                                        if (!isOnlyOneEdit) handleRemoveEntryEdit(i);
                                    }} className={Style.DeletePersonelIcon}
                                    style={{
                                        cursor: isOnlyOneEdit ? 'not-allowed' : 'pointer',
                                        opacity: isOnlyOneEdit ? 0.4 : 1,
                                    }}                                >
                                    <img src={deletePersonalIcon} style={{ height: 24 }} />
                                </div>
                            </div>
                        ))}

                        <div className={Style.PersonAnother} style={{ marginBottom: 0 }}>
                            <button onClick={() => handleAddEntryEdit()}>
                                <FiPlus size={18} color='#214CBC' style={{ marginRight: 5 }} />Add Another
                            </button>
                        </div>
                    </>
                </Modal>
                {/* Personanal drawer */}


                {/* <Drawer

                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title="Add Extra Data"
                    placement={'right'}
                    styles={{ header: { padding: '17px 24px' }, body: { padding: '24px' } }}
                    onClose={closeAddExtraDrawer}
                    open={addExtraDrawer}
                    width={486}
                    key={'right'}
                >
                    <div onFocus={() => { document.body.style.overflow = "hidden"; }}>
                        <div>
                            <label>Name <span style={{ color: 'red' }}>*</span></label>
                            <Input value={extraDataState.name} onChange={(e) => setExtraDataState(prev => ({ ...prev, name: e.target.value }))} placeholder='Enter name' />
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <label>Value Type <span style={{ color: 'red' }}>*</span></label>
                            <div className={Style.ValueTypeWrapper}>
                                <div onClick={() => setExtraDataState(prev => ({ ...prev, type: "Input", value: { type: "Input", value: "" } }))} className={extraDataState.type == "Input" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Input</div>
                                <div onClick={() => setExtraDataState(prev => ({ ...prev, type: "Boolean", value: { type: "Boolean", value: true } }))} className={extraDataState.type == "Boolean" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Boolean</div>
                                <div onClick={() => setExtraDataState(prev => ({ ...prev, type: "Date", value: { type: "Date", value: "" } }))} className={extraDataState.type == "Date" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Date</div>
                                <div onClick={() => setExtraDataState(prev => ({ ...prev, type: "Color", value: { type: "Color", value: "" } }))} className={extraDataState.type == "Color" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Color</div>
                            </div>
                        </div>

                        {extraDataState.type == "Input" ?
                            <div style={{ marginTop: 16 }}>
                                <label>Value <span style={{ color: 'red' }}>*</span></label>
                                <Input value={extraDataState.value.value}
                                    onChange={(e) => setExtraDataState(prev => ({
                                        ...prev,
                                        value: { type: "Input", value: e.target.value }
                                    }))}
                                    placeholder='Enter value' />
                            </div>
                            : extraDataState.type == "Boolean" ?
                                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <label>{extraDataState.value.value ? "On" : "Off"}</label>
                                    <Switch value={extraDataState.value.value} onChange={(e) => setExtraDataState(prev => ({
                                        ...prev,
                                        value: { type: "Boolean", value: e }
                                    }))} />
                                </div>
                                : extraDataState.type == "Date" ?
                                    <div style={{ marginTop: 16 }}>
                                        <label>Date <span style={{ color: 'red' }}>*</span></label>
                                        <DatePicker value={extraDataState.value.value ? dayjs(extraDataState.value.value) : null} suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />} onChange={(date) => {
                                            setExtraDataState(prev => ({
                                                ...prev,
                                                value: { type: 'Date', value: date ? dayjs(date).format('YYYY-MM-DD') : null }
                                            }));
                                        }} minDate={dayjs(formattedDate, dateFormat2)} placeholder='Select date' />
                                    </div>
                                    : extraDataState.type == "Color" ?
                                        <div style={{ marginTop: 16 }}>
                                            <label>Color <span style={{ color: 'red' }}>*</span></label>
                                            <ColorPicker value={extraDataState.value.value} onChange={(color) =>
                                                setExtraDataState(prev => ({
                                                    ...prev,
                                                    value: { type: "Color", value: color.toRgbString() }
                                                }))
                                            } style={{ marginTop: 8 }} />
                                        </div>
                                        : ""
                        }
                        <hr className={Style.HRHtm} />
                        <div style={{ marginTop: 16 }}>
                            <label>Description</label>
                            <Input.TextArea onFocus={() => { document.body.style.overflow = "hidden"; }} rows={4} style={{ padding: 16 }} value={extraDataState.description} onChange={(e) => setExtraDataState(prev => ({ ...prev, description: e.target.value }))} placeholder='Write description' />
                        </div>
                        <div style={{ marginTop: 16 }} className={Style.PersonalActionWrapper}>
                            <button onClick={handleCloseExtra} className={Style.cancelWorkBtn}>Cancel</button>
                            <button disabled={hasInvalidExtraData} className={hasInvalidExtraData ? Style.AddWorkBtnD : Style.AddWorkBtn} style={{ paddingInline: 30 }} onClick={handleAddExtraData}>Add</button>
                        </div>


                        {extraDataList?.length > 0 ? extraDataList?.map((data, index) => {
                            return (
                                <div key={index} className={Style.MainListingHourWork}>
                                    <div className={Style.HoursWorkListTop}>
                                        {data?.type == "Input" ?
                                            <h6>{data?.value?.value}</h6>
                                            : data?.type == "Boolean" ?
                                                <div className={data?.value?.value ? Style.InputDesign : Style.FInputDesign}>
                                                    <p>{data?.value?.value ? "On" : "Off"}</p>
                                                    <Switch size='small' disabled={true} value={data?.value?.value} />
                                                </div>
                                                : data?.type == "Date" ?
                                                    <h6>{data?.value?.value}</h6>
                                                    : data?.type == "Color" ?
                                                        <ColorPicker value={data?.value?.value} disabled={false} style={{ marginTop: 8 }} />
                                                        : ""
                                        }
                                        <Dropdown trigger={['click']} menu={{ items: getExtraDropdown(data?.id) }} placement="bottomRight">
                                            <button><img src={moreIcon} style={{ height: "24px" }} /></button>
                                        </Dropdown>
                                    </div>
                                    <h6>{data?.name}</h6>
                                    <p>{data?.description}</p>
                                </div>
                            )
                        }) : ""}
                    </div>
                </Drawer>
                <Modal
                    open={deleteExtra}
                    onCancel={cancelEditModal}
                    header={false}
                    centered={true}
                    closeIcon={false}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button onClick={() => setDeleteExtra(false)} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button onClick={() => deleteExtraList(deleteExtraId)} className={Style.editPersonalModalFooterDelete}>Delete</button>
                        </div>
                    </>}
                >
                    <>
                        <h4 className={Style.AreYouSure}>Are you sure you want to delete this extra data?</h4>
                        <p className={Style.AreYouSurePara}>This will permanently remove this extra field and its value from the Work Order.</p>
                    </>
                </Modal>
                <Modal
                    title="Edit Extra Data"
                    open={editExtra}
                    onCancel={cancelEditExtraModal}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button onClick={cancelEditExtraModal} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button disabled={hasInvalidExtraDataEdit} onClick={() => handleSaveExtraEdit(extraDataEditState?.id)} className={hasInvalidExtraDataEdit ? Style.editPersonalModalFooterSaveD : Style.editPersonalModalFooterSave}>Save Changes</button>
                        </div>
                    </>}
                >
                    <>
                        <div>
                            <label>Name <span style={{ color: 'red' }}>*</span></label>
                            <Input value={extraDataEditState?.name} onChange={(e) => setExtraDataEditState(prev => ({ ...prev, name: e.target.value }))} placeholder='Enter name' />
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <label>Value Type <span style={{ color: 'red' }}>*</span></label>
                            <div className={Style.ValueTypeWrapper}>
                                <div onClick={() => setExtraDataEditState(prev => ({ ...prev, type: "Input", value: { type: "Input", value: "" } }))} className={extraDataEditState?.type == "Input" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Input</div>
                                <div onClick={() => setExtraDataEditState(prev => ({ ...prev, type: "Boolean", value: { type: "Boolean", value: true } }))} className={extraDataEditState?.type == "Boolean" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Boolean</div>
                                <div onClick={() => setExtraDataEditState(prev => ({ ...prev, type: "Date", value: { type: "Date", value: "" } }))} className={extraDataEditState?.type == "Date" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Date</div>
                                <div onClick={() => setExtraDataEditState(prev => ({ ...prev, type: "Color", value: { type: "Color", value: "" } }))} className={extraDataEditState?.type == "Color" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Color</div>
                            </div>
                        </div>

                        {extraDataEditState?.type == "Input" ?
                            <div style={{ marginTop: 16 }}>
                                <label>Value <span style={{ color: 'red' }}>*</span></label>
                                <Input value={extraDataEditState?.value.value}
                                    onChange={(e) => setExtraDataEditState(prev => ({
                                        ...prev,
                                        value: { type: "Input", value: e.target.value }
                                    }))}
                                    placeholder='Enter value' />
                            </div>
                            : extraDataEditState?.type == "Boolean" ?
                                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <label>{extraDataEditState?.value.value ? "On" : "Off"}</label>
                                    <Switch value={extraDataEditState?.value.value} onChange={(e) => setExtraDataEditState(prev => ({
                                        ...prev,
                                        value: { type: "Boolean", value: e }
                                    }))} />
                                </div>
                                : extraDataEditState?.type == "Date" ?
                                    <div style={{ marginTop: 16 }}>
                                        <label>Date <span style={{ color: 'red' }}>*</span></label>
                                        <DatePicker value={extraDataEditState?.value.value ? dayjs(extraDataEditState?.value.value) : null} suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />} onChange={(date) => {
                                            setExtraDataEditState(prev => ({
                                                ...prev,
                                                value: { type: 'Date', value: date ? dayjs(date).format('YYYY-MM-DD') : null }
                                            }));
                                        }} minDate={dayjs(formattedDate, dateFormat2)} placeholder='Select date' />
                                    </div>
                                    : extraDataEditState?.type == "Color" ?
                                        <div style={{ marginTop: 16 }}>
                                            <label>Color <span style={{ color: 'red' }}>*</span></label>
                                            <ColorPicker value={extraDataEditState?.value.value} onChange={(color) =>
                                                setExtraDataEditState(prev => ({
                                                    ...prev,
                                                    value: { type: "Color", value: color.toRgbString() }
                                                }))
                                            } style={{ marginTop: 8 }} />
                                        </div>
                                        : ""
                        }
                        <hr className={Style.HRHtm} />
                        <div style={{ marginTop: 16 }}>
                            <label>Description</label>
                            <Input.TextArea rows={4} style={{ padding: 16 }} value={extraDataEditState?.description} onChange={(e) => setExtraDataEditState(prev => ({ ...prev, description: e.target.value }))} placeholder='Write description' />
                        </div>
                    </>
                </Modal> */}
            </div >
        </>
    )
})
// second Step complete


// Third Step complete
const AttachmentsSection = forwardRef(({ counter, attachmentsRef, messageApi, createLoading, editId, workOrderGetByIDData }) => {
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const schema = yup.object().shape({
        workRequest: yup.string().required(),
        jobSafety: yup.string().required(),
    });

    const localData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        getValues,
        watch,
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            workRequest: '',
            jobSafety: '',
            ...localData
        },
    });




    const [isExcel, setIsExcel] = useState(false)

    const isSendExcel = checked => {
        setIsExcel(checked)
    };

    useEffect(() => {
        if (editId && counter == 2) {
            reset(
                {
                    workRequest: workOrderGetByIDData.work_requested,
                    jobSafety: workOrderGetByIDData?.isJSA == "false" ? false : true,
                }
            )
            const dataCompyToEmail = JSON.parse(workOrderGetByIDData?.email_copy_to ? workOrderGetByIDData?.email_copy_to : null);
            setActualEmail(() => {
                const updatedList = [...dataCompyToEmail];
                const prevJsonData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");
                localStorage.setItem(
                    "Q8@L!zM7B_1xP#t+6R9Dg*v==",
                    JSON.stringify({
                        ...prevJsonData,
                        actualEmail: updatedList,
                    })
                );
                return updatedList;
            });
            setIsExcel(workOrderGetByIDData?.isExcel == "false" ? false : true)
            setHwarrantyDocumentation(workOrderGetByIDData?.warrantyDocumentation?.length > 0 ? true : false)
            setHphotosOrVideos(workOrderGetByIDData?.photosOrVideos?.length > 0 ? true : false)
            setHSafetyDocumentation(workOrderGetByIDData?.safetyDocumentation?.length > 0 ? true : false)
        }
        else if (editId) {
            setHwarrantyDocumentation(workOrderGetByIDData?.warrantyDocumentation?.length > 0 ? true : false)
            setHphotosOrVideos(workOrderGetByIDData?.photosOrVideos?.length > 0 ? true : false)
            setHSafetyDocumentation(workOrderGetByIDData?.safetyDocumentation?.length > 0 ? true : false)
        }
    }, [workOrderGetByIDData])



    useEffect(() => {
        const subscription = watch((value) => {
            const savedForms = JSON.parse(localStorage.getItem('Q8@L!zM7B_1xP#t+6R9Dg*v==')) || [];
            const ParseDataBefore = { ...savedForms, ...value }
            localStorage.setItem("Q8@L!zM7B_1xP#t+6R9Dg*v==", JSON.stringify(ParseDataBefore));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const [showPersonnelToolTip, setShowPersonnelToolTip] = useState(false);

    const [showAddEmail, setShowAddEmail] = useState(false);
    const [queueEmail, setQueueEmail] = useState("");
    const [actualEmail, setActualEmail] = useState(JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "[]").actualEmail ?? []);

    const openAddEmail = () => {
        setShowAddEmail(true)
    }
    const closeAddEmail = () => {
        setShowAddEmail(false)
    }

    const deleteEmail = (index) => {
        setActualEmail(prev => prev?.filter((item, index1) => index1 !== index));
        const prevJsonData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");
        const updatedList = prevJsonData?.actualEmail?.filter((item, index2) => index2 !== index) || [];
        localStorage.setItem(
            "Q8@L!zM7B_1xP#t+6R9Dg*v==",
            JSON.stringify({
                ...prevJsonData,
                actualEmail: updatedList,
            })
        );
        messageApi.open({
            type: "error",
            content: "Email has been deleted.",
        });
    };

    const addActualEmail = () => {
        if (!queueEmail.trim()) {
            messageApi.open({
                type: "error",
                content: "Please enter a valid email.",
            });
            return;
        }

        setActualEmail(prev => {
            const updatedList = [...prev, queueEmail];
            const prevJsonData = JSON.parse(localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}");
            localStorage.setItem(
                "Q8@L!zM7B_1xP#t+6R9Dg*v==",
                JSON.stringify({
                    ...prevJsonData,
                    actualEmail: updatedList,
                })
            );
            return updatedList;
        });

        setQueueEmail("");
    }


    useImperativeHandle(attachmentsRef, () => ({
        attachmentInformationFinalData: async () => await attachmentInformationFinalData(),
    }));


    const [HwarrantyDocumentation, setHwarrantyDocumentation] = useState()
    const [HphotosOrVideos, setHphotosOrVideos] = useState()
    const [HsafetyDocumentation, setHSafetyDocumentation] = useState()



    const [photosOrVideos, setPhotosOrVideos] = useState([])
    const [safetyDocumentation, setSafetyDocumentation] = useState([])
    const [warrantyDocumentation, setWarrantyDocumentation] = useState([])


    const [deleteWarrenty, setDeleteWarrenty] = useState([])
    const [deletePhoto, setDeletePhoto] = useState([])
    const [deleteSafety, setDeleteSafety] = useState([])
    const attachmentInformationFinalData = async () => {
        try {
            const getValuesOfForm = getValues()
            return {
                ...getValuesOfForm,
                actualEmail,
                photosOrVideos,
                safetyDocumentation,
                warrantyDocumentation,
                isExcel,
                HwarrantyDocumentation,
                HphotosOrVideos,
                HsafetyDocumentation,
                deleteWarrenty,
                deletePhoto,
                deleteSafety
            };
        } catch (error) {
            console.log(error);
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong while processing the data.",
            });
            return null;
        }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const hasInvalidExtraData =
        !queueEmail?.trim() ||
        !emailRegex.test(queueEmail.trim());




    const handleBeforeUpload1 = (file) => {
        setWarrantyDocumentation((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
        return false;
    };
    const handleBeforeUpload2 = (file) => {
        setPhotosOrVideos((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
        return false;
    };
    const handleBeforeUpload3 = (file) => {
        setSafetyDocumentation((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
        return false;
    };



    function convertBytes(bytes) {
        return {
            kb: +(bytes / 1024).toFixed(2),
            mb: +(bytes / (1024 * 1024)).toFixed(2),
            gb: +(bytes / (1024 * 1024 * 1024)).toFixed(4),
        };
    }


    const WorkPOIGetByIdDoc = async (body) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1000000);
        const url = `/assets/files/signed-urls`;
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        try {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ keys: [body] }),
                signal: controller.signal,
            };
            const response = await fetch(`${baseUrl}${url}`, options);
            const res = await response.json();
            if (response.status === 200 || response.status === 201) {
                return res?.urls[0] || 0
            }
        } catch (error) {
            if (error.name === "AbortError") console.error("Request timed out");
        } finally {
            clearTimeout(timeout);
        }
    };
    return (
        <>
            <div className={Style.BasicContainer}>
                <Row gutter={16} style={{ width: '100%' }}>
                    <Col span={24}>
                        <div className={Style.TaskFeild}>
                            <label>Work Requested</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input.TextArea disabled={createLoading} rows={6} onChange={onChange} value={value} status={errors?.workRequest?.message !== undefined ? 'error' : ''} placeholder='Enter work requested' />
                                )}
                                name="workRequest"
                            />
                        </div>
                    </Col>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}>Send a copy to external contact(s)
                                <div onMouseEnter={() => setShowPersonnelToolTip(true)} onMouseLeave={() => setShowPersonnelToolTip(false)} className={Style.FillPoint}>
                                    <FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' />
                                    {showPersonnelToolTip && (
                                        <div className={Style.tooltipBox} style={{ top: -80 }}>
                                            <p>Add one or more recipients to automatically send<br /> them a PDF summary (and optional Excel file) of this<br /> work order.</p>
                                        </div>
                                    )}
                                </div>
                            </label>
                            {/* <label style={{ display: 'flex', alignItems: 'center' }}>Personnel (Hours Worked)<FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' /></label> */}
                            <div style={{ cursor: createLoading ? 'no-drop' : 'pointer' }} disabled={createLoading} onClick={createLoading ? null : openAddEmail} className={Style.AddExtraDataFeild}>
                                <div>
                                    <p>Add emails <span>({actualEmail?.length ?? 0})</span></p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MdOutlineChevronRight size={28} color='#626D6F' />
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} >
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <div className={Style.JobSafetController}>
                                        <p>Job Safety Analysis Required?</p>
                                        <Switch
                                            disabled={createLoading}
                                            onChange={onChange}
                                            value={value}
                                            status={errors?.jobSafety?.message !== undefined ? 'error' : ''}
                                        />
                                    </div>
                                )}
                                name="jobSafety"
                            />
                        </div>
                    </Col>





                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Warranty Documents</label>
                            <Dragger
                                disabled={createLoading}
                                onRemove={(e) => setWarrantyDocumentation(prev =>
                                    prev?.filter(file => file.uid !== e.uid)
                                )} accept={".pdf"} multiple={true} beforeUpload={handleBeforeUpload1}
                                showUploadList={{
                                    extra: ({ size }) => (
                                        <span style={{ color: '#626D6F' }}>
                                            ({(size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    ),
                                    showDownloadIcon: true,
                                    removeIcon: <img src={removeIcon} style={{ height: 24 }} />,
                                }}
                                iconRender={() => (<img src={redDoc} style={{ height: 24 }} />)}>
                                <img src={blueDoc} style={{ height: 32, opacity: createLoading ? '0.3' : '1' }} />
                                <p>Upload a PDF</p>
                            </Dragger>
                            {editId &&
                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.warrantyDocumentation?.length > 0 ? workOrderGetByIDData?.warrantyDocumentation?.filter(data => !deleteWarrenty.includes(data?._id)).map((data, index) => {
                                        return (
                                            <div onClick={async () => {
                                                const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                                if (AllowNewTab?.url) {
                                                    window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                                }
                                            }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: index == 0 ? 0 : 8 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <div className={Style.CardOption}>
                                                        <img src={redDoc} style={{ height: 24 }} />
                                                    </div>
                                                    <div>
                                                        <a style={{ textDecoration: 'underline', color: 'black', marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                        <h6 style={{ fontSize: 14, fontWeight: 400, marginLeft: 5, color: '#626D6F' }}>{`(${convertBytes(data?.size).mb} MB)`}</h6>
                                                    </div>
                                                </div>
                                                <div onClick={() => setDeleteWarrenty(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>

                                        )
                                    }) : ""}
                                </div>
                            }

                        </div>
                    </Col>
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Safety Guidelines</label>
                            <Dragger
                                disabled={createLoading}
                                onRemove={(e) => setSafetyDocumentation(prev =>
                                    prev?.filter(file => file.uid !== e.uid)
                                )} accept={".pdf"} multiple={true} beforeUpload={handleBeforeUpload3}
                                showUploadList={{
                                    extra: ({ size }) => (
                                        <span style={{ color: '#626D6F' }}>
                                            ({(size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    ),
                                    showDownloadIcon: true,
                                    removeIcon: <img src={removeIcon} style={{ height: 24 }} />,
                                }}
                                iconRender={() => (<img src={redDoc} style={{ height: 24 }} />)}>
                                <img src={blueDoc} style={{ height: 32, opacity: createLoading ? '0.3' : '1' }} />
                                <p>Upload a PDF</p>
                            </Dragger>
                            {editId &&
                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.safetyDocumentation?.length > 0 ? workOrderGetByIDData?.safetyDocumentation?.filter(data => !deleteSafety.includes(data?._id)).map((data, index) => {
                                        return (
                                            <div onClick={async () => {
                                                const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                                if (AllowNewTab?.url) {
                                                    window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                                }
                                            }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: index == 0 ? 0 : 8 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <div className={Style.CardOption}>
                                                        <img src={redDoc} style={{ height: 24 }} />
                                                    </div>
                                                    <div>
                                                        <a style={{ textDecoration: 'underline', color: 'black', marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                        <h6 style={{ fontSize: 14, fontWeight: 400, marginLeft: 5, color: '#626D6F' }}>{`(${convertBytes(data?.size).mb} MB)`}</h6>
                                                    </div>
                                                </div>
                                                <div onClick={() => setDeleteSafety(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>
                                        )
                                    }) : ""}
                                </div>
                            }

                        </div>
                    </Col>
                    <Col span={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Upload Photos</label>
                            <Dragger
                                disabled={createLoading}
                                onRemove={(e) => setPhotosOrVideos(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} accept={".png,.jpg,.jpeg"} multiple={true} beforeUpload={handleBeforeUpload2}
                                showUploadList={{
                                    extra: ({ size }) => (
                                        <span style={{ color: '#626D6F' }}>
                                            ({(size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    ),
                                    showDownloadIcon: true,
                                    removeIcon: <img src={removeIcon} style={{ height: 24 }} />,
                                }}
                                iconRender={() => (<img src={redGallery} style={{ height: 24 }} />)}>
                                <img src={galleryAddBlue} style={{ height: 32, opacity: createLoading ? '0.3' : '1' }} />
                                <p>Upload photos (JPG, PNG, JPEG, SVG)</p>
                            </Dragger>
                            {editId &&
                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.photosOrVideos?.length > 0 ? workOrderGetByIDData?.photosOrVideos?.filter(data => !deletePhoto.includes(data?._id)).map((data, index) => {
                                        return (
                                            <div onClick={async () => {
                                                const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                                if (AllowNewTab?.url) {
                                                    window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                                }
                                            }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: index == 0 ? 0 : 8 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <div className={Style.CardOption}>
                                                        <img src={redGallery} style={{ height: 24 }} />
                                                    </div>
                                                    <div>
                                                        <a style={{ textDecoration: 'underline', color: 'black', marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                        <h6 style={{ fontSize: 14, fontWeight: 400, marginLeft: 5, color: '#626D6F' }}>{`(${convertBytes(data?.size).kb} MB)`}</h6>
                                                    </div>
                                                </div>
                                                <div onClick={() => setDeletePhoto(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>
                                        )
                                    }) : ""}
                                </div>
                            }
                        </div>
                    </Col>
                    <Drawer
                        maskClosable={false}
                        getContainer={document.body}
                        afterOpenChange={(visible) => {
                            document.body.style.overflow = visible ? "hidden" : "auto";
                        }}
                        title="Add Emails"
                        placement={'right'}
                        styles={{ header: { padding: '17px 24px' }, body: { padding: '24px' } }}
                        onClose={closeAddEmail}
                        open={showAddEmail}
                        width={486}
                        key={'right'}
                    >
                        <div>
                            <label>Email <span style={{ color: 'red' }}>*</span></label>
                            <Input value={queueEmail} onChange={(e) => setQueueEmail(e.target.value)} placeholder='Enter email' />
                        </div>

                        {actualEmail.length >= 1 &&
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                                    <p>Send excel file with pdf</p>
                                    <Switch defaultValue={isExcel} onChange={isSendExcel} />
                                </div>
                                <hr className={Style.HRHtm} />
                            </>
                        }
                        {actualEmail.map((data, index) =>
                            <div className={Style.ListIconType}>
                                <p>{data}</p>
                                <div onClick={() => deleteEmail(index)} className={Style.DeleteIcon}>
                                    <img src={deletePersonalIcon} style={{ height: "24px" }} />
                                </div>
                            </div>
                        )}
                        <div className={Style.PersonalActionWrapper} style={{ marginTop: 16 }}>
                            <button onClick={() => {
                                setQueueEmail("")
                                closeAddEmail()
                            }} className={Style.cancelWorkBtn}>Cancel</button>
                            <button onClick={() => addActualEmail()} disabled={hasInvalidExtraData} className={hasInvalidExtraData ? Style.AddWorkBtnD : Style.AddWorkBtn}>Add</button>
                        </div>
                    </Drawer>
                </Row>

            </div >
        </>
    )
})
// Third Step complete
