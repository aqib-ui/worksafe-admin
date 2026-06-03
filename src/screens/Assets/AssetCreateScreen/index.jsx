import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Style from './AssetsCreateScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Steps, Slider, Row, Col, Modal, Popconfirm, Divider } from 'antd'
import * as AssetsAction from '../../../../store/actions/Assets/index';
import * as POIAction from '../../../../store/actions/Poi/index';
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
import galleryAddBlue from '../../../assets/gallery-add-blue.png'
import redGallery from '../../../assets/red-gallery.png'
import searchNormal from '../../../assets/search-normal.png'
import { IoIosCheckmark } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
import closeCircleSmall from "../../../assets/close-circle-small.png"

import { IoChevronDownOutline } from "react-icons/io5";
import { MdOutlineChevronRight } from "react-icons/md";

import { FiInfo } from "react-icons/fi";
import { useDispatch } from 'react-redux';
import { TASK_GET_ARCHIVED_ALERTS_COMPLETE, TASK_WORKORDER_LINK_FOR_POI_COMPLETE } from '../../../../store/actions/types';


import { createStyles } from 'antd-style';
import ExtraData from '../../../component/extraData';
import { deleteWarrantyFile, getWarrantyFiles, saveWarrantyFile } from '../../../component/indexDB';
import { AWSUploadModule } from '../../../component/AWSUploadModule';
import AddDataSelect from '../../../component/addDataSelect';
const { Dragger } = Upload;


const AssetsScreenCreate = ({ GetAssetsByID, GetAllWorkOrderFilterLink, GetCompanyUser, WorkOrderReducer, AssetsReducer, PoiReducer, getDepartment, getModel, getAssetType, CreateDepartment, GetAllWorkOrderUnLink, getContractor, addContractorAC, UpdateContractorAC }) => {
    dayjs.extend(customParseFormat);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const Paramlocation = useLocation();
    const queryParams = new URLSearchParams(Paramlocation.search);
    const refer = queryParams.get('refer');
    const Role_ID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const localStoreKey = "Q9#M@xA!K7P_2LZ+vR8d*t=="
    const rawDrafts = localStorage.getItem(localStoreKey);
    const fineRawDrafts = JSON.parse(rawDrafts)
    const editId = queryParams.get('editId');
    const dispatch = useDispatch()


    useEffect(() => {
        GetAllWorkOrderUnLink(currentWorkSite)
    }, [])


    useEffect(() => {
        if (!messageApi) return;
        if (AssetsReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
    }, [
        AssetsReducer.networkError,
        messageApi,
    ]);


    const { POIGetByIDData, workOrderLinkData } = PoiReducer
    const { assetDetail, alertDetailLoading } = AssetsReducer


    const ComapnyUserData = WorkOrderReducer?.companyUserData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
    })

    useEffect(() => {
        dispatch({ type: TASK_WORKORDER_LINK_FOR_POI_COMPLETE, loading: true, payload: [] });
        if (editId) {
            localStorage.removeItem(localStoreKey);
            GetAssetsByID(editId)
            GetAllWorkOrderFilterLink(editId, "Asset", editId)
        }
    }, [editId]);

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
            setCounter(1)
        }
        else {
            return
        }
    };

    const [isDraft, setIsDraft] = useState(false);
    const closeDraft = () => {
        setIsDraft(false)
    }




    const [isDraftWorkOrder, setIsDraftWorkOrder] = useState(false);
    const closeDraftWorkOrder = () => {
        setIsDraftWorkOrder(false)
    }




    const getStepThreeData = async () => {
        const stepThreeData = await taskAndLocationRef.current?.POICustomizationFinalData();
        const allFormDataFine = { ...(allFormData || {}), ...(stepThreeData || {}) }
        const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        setCounter(prev => prev + 1)
        if (stepThreeData) {
            const {
                NotificationDate: rawNotificationTimeAndDate,
            } = allFormDataFine;
            const notificationTimeAndDate = dayjs(rawNotificationTimeAndDate == undefined ? "Invalid Date" : rawNotificationTimeAndDate).format('YYYY-MM-DD HH:mm:ss')
            const notificationTime = dayjs(rawNotificationTimeAndDate == undefined ? "Invalid Date" : rawNotificationTimeAndDate);

            const rawPreNotification = allFormDataFine?.preNotification;
            const preNotificationNumber = Number(rawPreNotification);
            const preNotificationOffset =
                !preNotificationNumber || isNaN(preNotificationNumber) ? 5 : preNotificationNumber;
            const preNotificationTime = notificationTime.subtract(preNotificationOffset, 'minute');
            const preNotificationTimeFormatted = preNotificationTime.format('YYYY-MM-DD HH:mm:ss');
            const yearDate = dayjs(allFormDataFine?.date).format('YYYY-MM-DD')


            const allWorkOrders = [...(PoiReducer?.workOrderLinkData || []), ...(PoiReducer?.workOrderUnData || [])];
            const workOrderIDs = allWorkOrders.filter(item =>
                allFormDataFine?.workOrders?.includes(item._id)
            );
            const workOrderIDsAll = workOrderIDs.map(item => item._id);
            const removedWorkOrders = allWorkOrders.filter(item =>
                !allFormDataFine?.workOrders?.includes(item._id)
            );
            const removedWorkOrderIDs = removedWorkOrders.map(item => item._id);
            const inspectionFiles = (allFormDataFine?.inspection || []).map(file => ({
                file,
                meta: {
                    fileName: file.name,
                    size: file.size,
                    contentType: file.type,
                    key: "inspection"
                }
            }));

            const otherFiles = [
                ...(allFormDataFine?.uploadDocument || []),
                ...(allFormDataFine?.addPhoto || [])
            ].map(file => ({
                file,
                meta: {
                    fileName: file.name,
                    size: file.size,
                    contentType: file.type,
                }
            }));

            const mergedFiles = [...inspectionFiles, ...otherFiles];

            const fileArray = mergedFiles.map(item => item.meta);
            const actualFile = mergedFiles.map(item => item.file);
            try {
                setCreateLoading(true)
                const AwsUpload = await AWSUploadModule({
                    messageApi,
                    fileArray,
                    actualFile,
                    moduleName: 'asset'
                });
                const payload = {
                    assetType: allFormDataFine?.assetType ?? "",
                    department: allFormDataFine?.department ?? "",
                    year: yearDate,
                    model: allFormDataFine?.model ?? "",
                    description: allFormDataFine?.description,
                    worksiteId: currentWorkSite,
                    files: !AwsUpload ? [] : AwsUpload,
                    ...(editId && {
                        assetId: editId,
                    }),
                    ...(allFormDataFine?.extraDataList?.length > 0 && {
                        extraFields: JSON.stringify(allFormDataFine.extraDataList.map(item => ({
                            name: item.name,
                            description: item.description,
                            value:
                                item.value.type === "date"
                                    ? dayjs(item.value.value).format("YYYY-MM-DD")
                                    : item.value.type === "Color"
                                        ? rgbaStringToPipe(item.value.value)
                                        : item.value.value,
                            type: item.value.type,
                            isRequired: false,
                        }))),
                    }),
                    reminder_time:
                        preNotificationTimeFormatted === "Invalid Date"
                            ? ""
                            : notificationTimeAndDate === "Invalid Date"
                                ? ""
                                : preNotificationTimeFormatted,
                    estimated_time:
                        notificationTimeAndDate === "Invalid Date"
                            ? ""
                            : notificationTimeAndDate,
                    elevationLevels: Array.isArray(allFormDataFine?.elevation)
                        ? [...(allFormDataFine.elevation || [])]
                        : [],
                    workOrders: JSON.stringify(workOrderIDsAll) ?? [],
                    removeWorkOrders: JSON.stringify(removedWorkOrderIDs) ?? [],
                    ...(allFormDataFine?.mapData?.type === "Circle" && {
                        polygon: JSON.stringify({
                            type: "Circle",
                            locations: allFormDataFine?.mapData?.locations ?? [],
                            safetyZone: allFormDataFine?.mapData?.safetyZone ?? 0,
                            altitude: Number(allFormDataFine?.mapData?.altitude ?? 0),
                            radius: allFormDataFine?.mapData?.radius ?? 0,
                            meta: allFormDataFine?.mapData?.meta ?? "{}",
                            latitude: allFormDataFine?.mapData?.latitude,
                            longitude: allFormDataFine?.mapData?.longitude,
                        }),
                    }),
                    ...(allFormDataFine?.mapData?.type === "Polygon" && {
                        polygon: JSON.stringify({
                            type: "Polygon",
                            locations: allFormDataFine?.mapData?.locations ?? [],
                            safetyZone: allFormDataFine?.mapData?.safetyZone ?? 0,
                            altitude: Number(allFormDataFine?.mapData?.altitude ?? 0),
                            radius: allFormDataFine?.mapData?.radius ?? 0,
                            meta: allFormDataFine?.mapData?.meta ?? "{}",
                            latitude: allFormDataFine?.mapData?.latitude,
                            longitude: allFormDataFine?.mapData?.longitude,
                        }),
                    }),
                    ...(allFormDataFine?.mapData?.type === "Polyline" && {
                        polygon: JSON.stringify({
                            type: "Polyline",
                            locations: allFormDataFine?.mapData?.locations ?? [],
                            safetyZone: allFormDataFine?.mapData?.safetyZone ?? 0,
                            altitude: Number(allFormDataFine?.mapData?.altitude ?? 0),
                            radius: allFormDataFine?.mapData?.radius ?? 0,
                            meta: allFormDataFine?.mapData?.meta ?? "{}",
                            latitude: allFormDataFine?.mapData?.latitude,
                            longitude: allFormDataFine?.mapData?.longitude,
                        }),
                    }),
                };


                const controller = new AbortController();
                const timeout = setTimeout(() => {
                    controller.abort();
                }, 1000000);
                const options = {
                    method: editId ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(editId ? [
                        ...(allFormDataFine?.safetyDocumentation || []),
                        ...(allFormDataFine?.warrantyDocumentation || []),
                    ] ? { ...(payload || {}), filesId: JSON.stringify(assetDetail?.files?.filter(data => !allFormDataFine?.deletePhoto?.includes(data?._id)).map(data => { return data._id })) } : "" : payload),
                    signal: controller.signal,
                };
                const response = await fetch(`${baseUrl}/assets`, options);
                if (response.status == 401) {
                    localStorage.clear()
                    window.location.reload();
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
                if (response.status == 200 || response.status == 201) {
                    clearTimeout(timeout);
                    closeConfirm()
                    messageApi.open({
                        type: "success",
                        content: `Asset has been ${editId ? "updated" : "created"}.`,
                    });
                    setCreateLoading(false)
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'auto' });
                        navigate('/assets/my-assets')
                    }, 2000);

                    fineRawDrafts
                    const localStoreKeyDraft = "A7@MD!xKRP_2#RZ+AL8FT*t==2";
                    const rawDrafts = localStorage.getItem(localStoreKeyDraft);
                    const parsedDrafts = rawDrafts ? JSON.parse(rawDrafts) : [];
                    const updatedDrafts = parsedDrafts.filter(
                        draft => draft?._id !== fineRawDrafts?._id
                    );
                    getWarrantyFiles().then((saved) => {
                        let Newsaved = saved.filter(data => data.temp == "false" && data._id == fineRawDrafts?._id)
                        Newsaved?.map(data => deleteWarrantyFile(data?.uid))
                    });
                    localStorage.setItem(localStoreKeyDraft, JSON.stringify(updatedDrafts));
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
                setCreateLoading(false)

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




    const getStepThreeDataSaveData = async () => {
        if (isDraft || isDraftWorkOrder) {
            try {
                messageApi.open({
                    type: "success",
                    content: "Asset Saved successfully.",
                });
                closeDraft()
                setTimeout(() => {
                    if (isDraft) {
                        navigate('/assets/my-assets');
                    }
                    else {
                        navigate('/workorder/create?refer=asset')
                    }
                }, 2000);
            } catch (error) {
                console.error("Draft save failed:", error);
                messageApi.open({
                    type: "error",
                    content: "Failed to save draft.",
                });
            }
        }
    };



    useEffect(() => {
        const handleBeforeUnload = (event) => {
            localStorage.removeItem(localStoreKey);
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






    useEffect(() => {
        getDepartment(currentWorkSite)
        getModel()
        getAssetType()

        GetAllWorkOrderUnLink(currentWorkSite)
        getContractor(currentWorkSite)
        GetCompanyUser()
    }, [])

    useEffect(() => {
        if (AssetsReducer?.createDepartmentComplete) {
            getDepartment(currentWorkSite)
        }
    }, [AssetsReducer?.createDepartmentComplete])





    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <div className={Style.Allpath}>
                            <h6>Asset</h6>
                            <img src={rightIcon} />
                            <h6 className={Style.activePage}>{editId ? "Edit" : "Create"} Asset</h6>
                        </div>
                        <h3>{editId ? "Edit" : "Create"} Asset</h3>
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
                                        title: 'Asset Customization',
                                        disabled: true
                                    },
                                ]
                            }
                        />
                    </div>

                    {currentSteps === 0 && <BasicInformation PoiReducer={PoiReducer} counter={counter} workOrderGetByIDData={assetDetail} editId={editId} isValidBtn={setIsFirstStepValid} WorkOrderReducer={AssetsReducer} messageApi={messageApi} basicInfoSectionRef={basicInfoSectionRef} ComapnyUserData={ComapnyUserData} WorkOrderReducerData={WorkOrderReducer?.workSiteData} />}
                    {currentSteps === 1 && <POICustomization fineEdit={fineRawDrafts?._id} isDraft={isDraftWorkOrder} setIsDraft={setIsDraftWorkOrder} getStepThreeData={getStepThreeData} workOrderLinkData={workOrderLinkData} PoiReducer={PoiReducer} counter={counter} workOrderGetByIDData={assetDetail} editId={editId} messageApi={messageApi} taskAndLocationRef={taskAndLocationRef} createLoading={createLoading} />}
                    {/* {currentSteps === 2 && <AttachmentsSection counter={counter} workOrderGetByIDData={workOrderGetByIDData} editId={editId} createLoading={createLoading} messageApi={messageApi} attachmentsRef={attachmentsRef} />} */}
                </div >

                <div className={Style.SubmitSection}>
                    {currentSteps === 0 ?
                        <>
                            <div></div>
                            <button disabled={!isFirstStepValid} onClick={() => getStepOneData()} className={!isFirstStepValid ? Style.SubmitBtnDisable : Style.SubmitBtn}>Continue</button>
                        </>
                        : currentSteps === 1 ?
                            <>
                                <button disabled={createLoading} style={{ cursor: createLoading ? "no-drop" : "pointer" }} onClick={() => setCurrentSteps(0)} className={Style.BackMainBtn}>Back</button>
                                <div>
                                    <button disabled={createLoading} className={createLoading ? Style.SubmitBtnDisable : Style.SubmitBtn} onClick={() => editId ? setEditWorkOrder(true) : getStepThreeData()}>{createLoading ? <Spin /> : editId ? "Update Asset" : "Create"}</button>
                                </div>
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
                            <button onClick={() => closeConfirm()} disabled={createLoading} style={{ cursor: createLoading ? 'no-drop' : 'pointer' }} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button style={{ background: createLoading ? 'var(--gray-60)' : 'var(--primary)' }} disabled={createLoading} onClick={() => { getStepThreeData() }} className={createLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>{`Update Asset`}</button>
                        </div>
                    </>}

                >
                    <>
                        <h4 className={Style.AreYouSure}>Are you sure you want to update this Asset?</h4>
                        <p className={Style.AreYouSurePara}>You're about to update this Asset. Changes will be saved and visible to all relevant team members.</p>
                    </>
                </Modal>
                {/* confirm Edit */}



                {/* confirm from WorkOrder Draft */}
                <Modal
                    open={isDraftWorkOrder}
                    onCancel={closeDraftWorkOrder}
                    header={false}
                    centered={true}
                    closeIcon={false}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button onClick={() => {
                                localStorage.removeItem("Q9#M@xA!K7P_2LZ+vR8d*t==");
                                localStorage.removeItem("Q8@L!zM7B_1xP#t+6R9Dg*v==");
                                closeDraftWorkOrder()
                                navigate('/workorder/create?refer=asset')
                            }} className={Style.editPersonalModalFooterCancel}>Continue Without Saving</button>
                            <button style={{ background: createLoading ? 'var(--gray-60)' : 'var(--primary)' }} disabled={createLoading} onClick={() => { getStepThreeDataSaveData() }} className={createLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>{`Save Asset`}</button>
                        </div>
                    </>}

                >
                    <>
                        <h4 className={Style.AreYouSure}>You want to save this Assets?</h4>
                        <p className={Style.AreYouSurePara}>You're about to save this Assets. Changes will be saved and visible to you in draft section.</p>
                    </>
                </Modal>
                {/* confirm from WorkOrder  Draft */}





            </div >
        </>
    )
}


function mapStateToProps({ PoiReducer, AssetsReducer, WorkOrderReducer }) {
    return { PoiReducer, AssetsReducer, WorkOrderReducer };
}
export default connect(
    mapStateToProps,
    { ...AssetsAction, ...POIAction, ...WorkOrderAction }
)(AssetsScreenCreate);






// first Step complete
const BasicInformation = forwardRef(({ PoiReducer, counter, basicInfoSectionRef, ComapnyUserData, WorkOrderReducerData, messageApi, WorkOrderReducer, isValidBtn, editId, workOrderGetByIDData }) => {
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const localStoreKey = "Q9#M@xA!K7P_2LZ+vR8d*t=="

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
    const [polylineWidth, setPolylineWidth] = useState(50)
    const [polylineSafety, setPolylineSafety] = useState(0)
    const [polylineElevation, setPolylineElevation] = useState(0)
    const [safetyZonePolyLine, setSafetyZonePolyLine] = useState([]);
    // polyline

    const [measureSetting, setMeasureSetting] = useState("m")
    const childRefParent = useRef();


    // circle
    const [circleRadius, setCircleRadius] = useState(250)
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

    const [elevationSelector, setElevationSelector] = useState(JSON.parse(localStorage.getItem(localStoreKey) || "[]").elevation ?? [])


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
                    assetType: workOrderGetByIDData?.assetType?.name,
                    department: workOrderGetByIDData?.department?.name,
                    model: workOrderGetByIDData?.model?.name,
                    date: workOrderGetByIDData?.year,
                }
            )
            setElevationSelector(() => {
                const prevJsonData = JSON.parse(localStorage.getItem(localStoreKey) || "{}");
                localStorage.setItem(
                    localStoreKey,
                    JSON.stringify({
                        ...prevJsonData,
                        elevation: workOrderGetByIDData?.elevationLevels,
                    })
                );
                return workOrderGetByIDData?.elevationLevels;
            });
            if (workOrderGetByIDData?.polygon?.type == "Circle") {
                setSelectShape(2);
                setCircleRadius(Number(workOrderGetByIDData?.polygon?.radius.toFixed()))
                setCircleSafety(Number(workOrderGetByIDData?.polygon?.safetyZone.toFixed()))
                setCircleElevation(Number(workOrderGetByIDData?.polygon?.altitude.toFixed()))
                setTimeout(() => {
                    let prevJsonData = {};
                    try {
                        prevJsonData = JSON.parse(localStorage.getItem(localStoreKey)) || {};
                    } catch {
                        prevJsonData = {};
                    }
                    localStorage.setItem(
                        localStoreKey,
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
            localStorage.getItem(localStoreKey) || "{}"
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
            setCircleRadius(250)
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
            setPolylineWidth(50)
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
            setPolylineWidth(50)
            setPolylineSafety(0)
            setPolylineElevation(0)
            setSafetyZonePolyLine([])
            setCircleRadius(250)
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
            const verifyMapTypeData = await verifyMapType(mapAllPoints, getValuesOfForm?.assetType);
            const savedForms = JSON.parse(localStorage.getItem(localStoreKey)) || [];
            const ParseDataBefore = { ...savedForms, mapData: verifyMapTypeData }
            localStorage.setItem(localStoreKey, JSON.stringify(ParseDataBefore));
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




    const schema = yup.object().shape({
        assetType: yup.string().required(),
        department: yup.string().required(),
        model: yup.string().required(),
        date: yup.string().required()
    });
    const localData = JSON.parse(localStorage.getItem(localStoreKey) || "{}");
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        getValues,
        watch,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            assetType: '',
            department: '',
            model: '',
            date: '',
            ...localData
        },
    });

    useEffect(() => {
        const subscription = watch((value) => {
            const savedForms = JSON.parse(localStorage.getItem(localStoreKey)) || [];
            const ParseDataBefore = { ...savedForms, ...value }
            localStorage.setItem(localStoreKey, JSON.stringify(ParseDataBefore));
        });
        return () => subscription.unsubscribe();
    }, [watch]);
    const data_Alert = watch()

    useEffect(() => {
        if (isValid && selectedShape !== 0 && elevationSelector.length > 0) {
            isValidBtn(true);
        }
        else {
            isValidBtn(false)
        }
    }, [isValid, selectedShape, elevationSelector]);


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
            // id: "",
            id: editId ? editId : "",
            type: "asset",
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
            const verifyMapTypeData = await verifyMapType(mapAllPoints, getValuesOfForm?.assetType);
            if (isMapShapeVerified === 1) {
                return { ...getValuesOfForm, mapData: verifyMapTypeData, elevation: elevationSelector };
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



    const isBelowGround = elevationSelector?.includes("Below Ground");
    const isGroundLevel = elevationSelector?.includes("Ground Level");
    const isOverhead = elevationSelector?.includes("Overhead");


    const isDisabled = workSiteLoader || loadingMapData;

    const editElevation = (e) => {
        const prevJsonData = JSON.parse(localStorage.getItem(localStoreKey) || "{}");
        const prevElevation = Array.isArray(prevJsonData.elevation)
            ? prevJsonData.elevation
            : [];
        const updatedElevation = prevElevation?.includes(e)
            ? prevElevation.filter((item) => item !== e)
            : [...prevElevation, e];
        const updatedJson = {
            ...prevJsonData,
            elevation: updatedElevation,
        };
        localStorage.setItem(localStoreKey, JSON.stringify(updatedJson));
        setElevationSelector(updatedElevation);
    }









    // department
    const departExist = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}")?.department
    const [newDepartment, setNewDepartment] = useState(departExist ? [{ value: departExist, label: departExist }] : []);
    const depatmentData = WorkOrderReducer?.departmentData?.map(data => ({
        value: data.name,
        label: data.name,
    }));
    const CreateDepartmentEx = async (valueToAdd) => {
        const trimmedSearch = valueToAdd?.trim();
        if (!trimmedSearch) return;
        setNewDepartment(prev => [
            { value: trimmedSearch, label: trimmedSearch },
            ...prev,
        ]);
    };



    // Model
    const modelExist = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}")?.model
    const [newModel, setNewModel] = useState(modelExist ? [{ value: modelExist, label: modelExist }] : []);
    const modelData = WorkOrderReducer?.modelData?.map(data => ({
        value: data.name,
        label: data.name,
    }));
    const CreateModelEx = async (valueToAdd) => {
        const trimmedSearch = valueToAdd?.trim();
        if (!trimmedSearch) return;
        setNewModel(prev => [
            { value: trimmedSearch, label: trimmedSearch },
            ...prev,
        ]);
    };



    // Asset Type
    const assetTypeExist = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}")?.assetType
    const [newAssetType, setNewAssetType] = useState(assetTypeExist ? [{ value: assetTypeExist, label: assetTypeExist }] : []);
    const assetTypeData = WorkOrderReducer?.assetTypeData?.map(data => ({
        value: data.name,
        label: data.name,
    }));
    const CreatesetNewAssetTypeEx = async (valueToAdd) => {
        const trimmedSearch = valueToAdd?.trim();
        if (!trimmedSearch) return;
        setNewAssetType(prev => [
            { value: trimmedSearch, label: trimmedSearch },
            ...prev,
        ]);
    };



    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateFormat2 = 'YYYY-MM-DD';




    return (
        <>
            <div className={Style.BasicContainer}>
                <Row gutter={[24, 10]} style={{ width: '100%' }}>
                    <Col xxl={10} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <Row align={'middle'} gutter={[16, 0]}>
                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Assets type <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <AddDataSelect name={"Assets type"} loading={WorkOrderReducer?.assetTypeLoading} addNewValue={CreatesetNewAssetTypeEx} setValue={onChange} value={value} optionData={[...newAssetType, ...assetTypeData]} />
                                            </>
                                        )}
                                        name="assetType"
                                    />
                                </div>
                            </Col>
                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Department <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <AddDataSelect name={"Department"} loading={WorkOrderReducer?.departmentLoading} addNewValue={CreateDepartmentEx} setValue={onChange} value={value} optionData={[...newDepartment, ...depatmentData]} />
                                            </>
                                        )}
                                        name="department"
                                    />
                                </div>
                            </Col>

                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Model <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <AddDataSelect name={"Model"} loading={WorkOrderReducer?.modelLoading} addNewValue={CreateModelEx} setValue={onChange} value={value} optionData={[...newModel, ...modelData]} />
                                            </>
                                        )}
                                        name="model"
                                    />
                                </div>
                            </Col>
                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                                    <label>Date <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <DatePicker suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs(value) : null} status={errors?.date?.message !== undefined ? 'error' : ''} placeholder='Select date' />
                                            )
                                        }}
                                        name="date"
                                    />
                                </div>
                            </Col>





                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Elevation Level <span style={{ color: 'red' }}>*</span></label>
                                </div>
                            </Col>

                            <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
                                <button
                                    style={{ cursor: isDisabled ? "no-drop" : "pointer" }}
                                    disabled={isDisabled}
                                    onClick={() => editElevation("Below Ground")}
                                    className={isBelowGround ? Style.ShapeSelectorSelected : Style.ShapeSelector}
                                >
                                    <div
                                        className={
                                            isBelowGround
                                                ? Style.SelectRadioBoxSelected
                                                : Style.SelectRadioBox
                                        }
                                    >
                                        {isBelowGround && <FaCheck size={12} color="white" />}
                                    </div>
                                    <p>Below Ground</p>
                                </button>
                            </Col>

                            <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
                                <button
                                    style={{ cursor: isDisabled ? "no-drop" : "pointer" }}
                                    disabled={isDisabled}
                                    onClick={() => editElevation("Ground Level")}
                                    className={
                                        isGroundLevel ? Style.ShapeSelectorSelected : Style.ShapeSelector
                                    }
                                >
                                    <div
                                        className={
                                            isGroundLevel
                                                ? Style.SelectRadioBoxSelected
                                                : Style.SelectRadioBox
                                        }
                                    >
                                        {isGroundLevel && <FaCheck size={12} color="white" />}
                                    </div>
                                    <p>Ground Level</p>
                                </button>
                            </Col>

                            <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
                                <button
                                    style={{ cursor: isDisabled ? "no-drop" : "pointer" }}
                                    disabled={isDisabled}
                                    onClick={() => editElevation("Overhead")}
                                    className={isOverhead ? Style.ShapeSelectorSelected : Style.ShapeSelector}
                                >
                                    <div
                                        className={
                                            isOverhead
                                                ? Style.SelectRadioBoxSelected
                                                : Style.SelectRadioBox
                                        }
                                    >
                                        {isOverhead && <FaCheck size={12} color="white" />}
                                    </div>
                                    <p
                                        style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            minWidth: 60,
                                            maxWidth: 100,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Overhead
                                    </p>
                                </button>
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
                        </Row >

                        {/* PolyLine Controller */}
                        {
                            selectedShape == 1 ?
                                <>
                                    <div className={Style.FeildCol}>
                                        <label>Set Width Stroke</label>
                                        <div className={Style.SliderContainer}>
                                            <Slider min={1} value={polylineWidth} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 1067 : 3500} onChange={(e) => setPolylineWidth(e)} className='blue-slider' styles={stylesObjectBlue} />
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
                                                <label>Set Width Stroke</label>
                                                <div className={Style.SliderContainer}>
                                                    <Slider min={1} value={polylineWidth} disabled={selectedShape == 0} style={{ width: '100%' }} max={measureSetting == "m" ? 1000 : 3500} onChange={(e) => setPolylineWidth(e)} className='blue-slider' styles={stylesObjectBlue} />
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
                    </Col >
                    <Col xxl={14} xl={12} lg={12} md={24} sm={24} xs={24} style={{ paddingBottom: 66 }}>
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
                                    isClearable: true,
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
                                        isAlert={false}
                                        alertType={data_Alert.typeOfAlerts}
                                        // center Marker
                                        value1={value1}
                                        setValue1={setValue1}
                                        // center Marker
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
                </Row >
            </div >
        </>
    )
})
// first Step complete


// second Step complete
const POICustomization = forwardRef(({ fineEdit, setIsDraft, isDraft, assetDetail, workOrderLinkData, PoiReducer, counter, taskAndLocationRef, messageApi, editId, workOrderGetByIDData, createLoading }) => {
    const navigate = useNavigate();
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateFormat2 = 'YYYY-MM-DD';
    const localStoreKey = "Q9#M@xA!K7P_2LZ+vR8d*t=="

    const schema = yup.object().shape({
        description: yup.string().notRequired(),
        workOrders: yup.array().notRequired(),
        notificationTitle: yup.string().notRequired(),
        notificationBody: yup.string().notRequired(),
        NotificationDate: yup.string().notRequired(),
        preNotification: yup.string().notRequired(),
    });
    const localData = JSON.parse(localStorage.getItem(localStoreKey) || "{}");
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
            const preNotification = workOrderGetByIDData?.reminder_time
                ? dayjs(workOrderGetByIDData.reminder_time).local()
                : null;

            const notificationTime = workOrderGetByIDData?.estimated_time
                ? dayjs(workOrderGetByIDData.estimated_time).local()
                : null;
            const diffInMinutes = notificationTime?.diff(preNotification, 'minute');
            const workOrderIDs = workOrderLinkData?.map(item => item?._id) || [];
            const resetData = {
                description: workOrderGetByIDData.description ?? "",
                workOrders: workOrderIDs,
                notificationTitle: workOrderGetByIDData?.notification_title ?? "",
                notificationBody: workOrderGetByIDData?.notification_description ?? "",
                ...(workOrderGetByIDData?.reminder_time && {
                    preNotification: diffInMinutes == 0 ? "" : diffInMinutes,
                }),
                ...(workOrderGetByIDData?.estimated_time && {
                    NotificationDate: dayjs(workOrderGetByIDData.estimated_time).local(),
                }),
            }
            reset(resetData);
            const prevData = JSON.parse(localStorage.getItem(localStoreKey)) || {};
            localStorage.setItem(
                localStoreKey,
                JSON.stringify({ ...prevData, ...resetData })
            );
            const capitalizeWord = (word) =>
                typeof word === "string" && word.length > 0
                    ? word[0].toUpperCase() + word.slice(1)
                    : "";
            const transformedArray = workOrderGetByIDData?.extraFields?.map(item => {
                const { type, value, ...rest } = item;
                let rgbaString = '';
                if (capitalizeWord(type) == "Color") {
                    const [r, g, b, a] = value?.split('|').map(Number);
                    rgbaString = `rgba(${r}, ${g}, ${b}, ${a})`;
                }
                const newValue = capitalizeWord(type) === "Color" ? rgbaString : value;
                return {
                    name: item.name || '',
                    description: item.description ?? null,
                    type: capitalizeWord(item.type) || 'Input',
                    id: generateRandomId(),
                    value: {
                        type: capitalizeWord(item.type) || 'Input',
                        value: newValue
                    }
                };
            });
            setExtraDataList(() => {
                const updatedList = [...transformedArray];
                const prevJsonData = JSON.parse(
                    localStorage.getItem(localStoreKey) || "{}"
                );
                localStorage.setItem(
                    localStoreKey,
                    JSON.stringify({
                        ...prevJsonData,
                        extraData: updatedList,
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
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            description: '',
            workOrders: [],
            NotificationDate: '',
            preNotification: '',
            ...localData
        },
    });

    useEffect(() => {
        const subscription = watch((value) => {
            const savedForms = JSON.parse(localStorage.getItem(localStoreKey)) || [];
            const ParseDataBefore = { ...savedForms, ...value }
            localStorage.setItem(localStoreKey, JSON.stringify(ParseDataBefore));
        });
        return () => subscription.unsubscribe();
    }, [watch]);




    // Drawer Extra Data
    useImperativeHandle(taskAndLocationRef, () => ({
        POICustomizationFinalData: async () => await POICustomizationFinalData(),
    }));
    const [extraDataList, setExtraDataList] = useState(JSON.parse(localStorage.getItem(localStoreKey) || "[]").extraData ?? []);
    // Drawer Extra Data




    const [addPhoto, setAddPhoto] = useState([]);
    const [uploadDocument, setUploadDocument] = useState([]);
    const [inspection, setInspectionDco] = useState([]);



    const POICustomizationFinalData = async () => {
        try {
            const getValuesOfForm = getValues()
            return { ...getValuesOfForm, addPhoto, uploadDocument, inspection, extraDataList, deletePhoto };
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

    const allWorkOrders = [...(PoiReducer?.workOrderLinkData || []), ...(PoiReducer?.workOrderUnData || [])];
    console.log(PoiReducer?.workOrderLinkData, PoiReducer?.workOrderUnData, 'ASDJAKSDI**D')
    const WorkOrderData = allWorkOrders?.map(data => {
        return { value: data._id, label: data?.title }
    })



    const fileSetters = {
        addPhoto: setAddPhoto,
        uploadDocument: setUploadDocument,
        inspection: setInspectionDco,
    };




    const createBeforeUploadHandler = (key) => async (file) => {
        const setter = fileSetters[key];
        var insName;
        if (key == "inspection") {
            const renamedFile = new File([file], `ws${key}_${file.name}`, { type: file.type });
            insName = renamedFile
        }
        if (setter) {
            if (key == "inspection") {
                setter((prev) => Array.isArray(prev) ? [...prev, insName] : [insName]);
            }
            else {
                setter((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
            }
        } else {
            console.warn(`Unknown file key: ${key}`);
        }
        await saveWarrantyFile({
            temp: "true",
            uid: file.uid,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            file,
        });

        const prevJsonData = JSON.parse(
            localStorage.getItem(localStoreKey) || "{}"
        );
        localStorage.setItem(
            localStoreKey,
            JSON.stringify({
                ...prevJsonData,
                files: [...prevJsonData?.files || [], file.uid],
            })
        );
        return false;
    };

    const [deletePhoto, setDeletePhoto] = useState([])


    useEffect(() => {
        getWarrantyFiles().then((saved) => {
            let Newsaved = saved.filter(data => localData?.files?.includes(data.uid))
            if (Newsaved.length) {
                const warrantyFiles = Newsaved
                    ?.filter(item => item.type === "application/pdf")
                    ?.map(item => ({
                        uid: item.uid,
                        name: item.name,
                        size: item.size,
                        originFileObj: item.file,
                    }));
                const safetyFiles = Newsaved
                    ?.filter(item => item.type?.startsWith("image/"))
                    ?.map(item => ({
                        uid: item.uid,
                        name: item.name,
                        size: item.size,
                        originFileObj: item.file,
                    }));
                setWarrantyDocumentation(warrantyFiles);
                setSafetyDocumentation(safetyFiles);
            }
        });
    }, []);




    function convertBytes(bytes) {
        return {
            kb: +(bytes / 1024).toFixed(2),
            mb: +(bytes / (1024 * 1024)).toFixed(2),
            gb: +(bytes / (1024 * 1024 * 1024)).toFixed(4),
        };
    }


    const [openWorkOrderSelect, setOpenWorkOrderSelect] = useState(false);

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
                    <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24} >
                        <Row gutter={16}>
                            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={12}>
                                <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                                    <label>Work Orders</label>
                                    <Controller
                                        name="workOrders"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, value = [] } }) => (
                                            <>
                                                <Select
                                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                    mode="multiple"
                                                    className="WorkOrderInputSelect"
                                                    loading={PoiReducer?.workOrderUnLoading}
                                                    disabled={PoiReducer?.workOrderUnLoading || createLoading}
                                                    placeholder="Select Work Orders"
                                                    onChange={onChange}
                                                    value={value.length ? value : undefined}
                                                    status={errors?.workOrders ? 'error' : ''}
                                                    options={WorkOrderData}
                                                    open={openWorkOrderSelect}
                                                    onDropdownVisibleChange={setOpenWorkOrderSelect}
                                                    dropdownRender={menu => (
                                                        <>
                                                            {menu}
                                                            <Divider style={{ margin: '8px 0' }} />
                                                            <div
                                                                style={{
                                                                    padding: '8px',
                                                                    cursor: 'pointer',
                                                                    color: '#1890ff',
                                                                    textAlign: 'center'
                                                                }}
                                                                onMouseDown={e => e.preventDefault()}
                                                                onClick={() => {
                                                                    if (editId) {
                                                                        navigate('/workorder/create?refer=asset')
                                                                    }
                                                                    else {
                                                                        setOpenWorkOrderSelect(false);
                                                                        setIsDraft(true);
                                                                    }
                                                                }}
                                                            >
                                                                Create work order
                                                            </div>
                                                        </>
                                                    )}
                                                />

                                                <div style={{ paddingBottom: allWorkOrders.length > 0 ? 10 : 0 }} className={Style.NewLayerWorkOrder}>
                                                    {allWorkOrders
                                                        .filter(item => value?.includes(item._id))
                                                        .map(item => (
                                                            <div key={item._id} className={Style.InContent}>
                                                                {item.title}
                                                                <button onClick={() =>
                                                                    setValue(
                                                                        "workOrders",
                                                                        value.filter(id => id !== item._id)
                                                                    )
                                                                }>
                                                                    <img src={closeCircleSmall} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                </div>
                                            </>
                                        )}
                                    />

                                </div>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={12}>
                                <ExtraData name={"Asset"} createLoading={createLoading} extraDataList={extraDataList} setExtraDataList={setExtraDataList} localStoreKey={localStoreKey} messageApi={messageApi} />
                            </Col>
                        </Row>
                    </Col>


                    <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24} >
                        <Row gutter={16}>
                            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={12}>
                                <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                                    <label>Notification Date & Time</label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <DatePicker allowClear={editId ? false : true} disabled={createLoading} suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />} showTime={{ format: 'hh:mm A', use12Hours: true, showSecond: false, }} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs(value) : null} status={errors?.NotificationDate?.message !== undefined ? 'error' : ''} placeholder='Select date & time' />
                                            )
                                        }}
                                        name="NotificationDate"
                                    />
                                </div>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={12}>
                                <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                                    <label>Pre-Notification Time (in minutes)</label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <InputNumber disabled={createLoading} max={999} maxLength={3} min={5} onChange={onChange} value={value} status={errors?.preNotification?.message !== undefined ? 'error' : ''} placeholder='Enter Pre-Notification Time' />
                                        )}
                                        name="preNotification"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Upload Photos</label>
                            <Dragger
                                fileList={addPhoto}
                                onRemove={async (file) => {
                                    setAddPhoto((prev) =>
                                        prev.filter((f) => f.uid !== file.uid)
                                    );
                                    await deleteWarrantyFile(file.uid);
                                }}

                                accept={".png,.jpg,.jpeg"} multiple={true} beforeUpload={createBeforeUploadHandler('addPhoto')}
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
                                <img src={galleryAddBlue} style={{ height: 32 }} />
                                <p>Upload photos (JPG, PNG, JPEG)</p>
                            </Dragger>
                            {editId &&
                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.files?.length > 0 ? workOrderGetByIDData?.files?.filter(data => {
                                        const name = data?.fileName?.toLowerCase() || "";
                                        const ext = name.split('.').pop();
                                        return (
                                            !deletePhoto?.includes(data?._id) &&
                                            ['png', 'jpg', 'jpeg'].includes(ext) &&
                                            !name.includes("wsinspection")
                                        );
                                    }).map((data, index) => {
                                        return (
                                            <div onClick={async () => {
                                                const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                                if (AllowNewTab?.url) {
                                                    window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                                }
                                            }}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: index == 0 ? 0 : 8 }}>
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
                                                <div onClick={() => setDeletePhoto(prev => [...prev, data?._id])} style={{ cursor: 'pointer', position: 'absolute', right: 10, zIndex: 999 }}>
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
                            <label>Upload Documents</label>
                            <Dragger
                                fileList={uploadDocument}
                                onRemove={async (file) => {
                                    setUploadDocument((prev) =>
                                        prev.filter((f) => f.uid !== file.uid)
                                    );
                                    await deleteWarrantyFile(file.uid);
                                }}
                                accept={".pdf"} multiple={true} beforeUpload={createBeforeUploadHandler('uploadDocument')}
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
                                <img src={blueDoc} style={{ height: 32 }} />
                                <p>Upload a PDF</p>
                            </Dragger>
                            {editId &&
                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.files?.length > 0 ? workOrderGetByIDData?.files.filter(file => !deletePhoto?.includes(file?._id) && /\.(pdf)$/i.test(file?.fileName) && !file?.fileName?.toLowerCase()?.includes("wsinspection")).map((data, index) => {
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
                                                <div onClick={() => setDeletePhoto(prev => [...prev, data?._id])} style={{ cursor: 'pointer', position: 'absolute', right: 10, zIndex: 999 }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>

                                        )
                                    }) : ""}
                                </div>
                            }
                        </div>
                    </Col>

                    <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Inspection Documents</label>
                            <Dragger
                                fileList={inspection}
                                onRemove={async (file) => {
                                    setInspectionDco((prev) =>
                                        prev.filter((f) => f.uid !== file.uid)
                                    );
                                    await deleteWarrantyFile(file.uid);
                                }}
                                accept={".pdf"} multiple={true} beforeUpload={createBeforeUploadHandler('inspection')}
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
                                <img src={blueDoc} style={{ height: 32 }} />
                                <p>Upload a PDF</p>
                            </Dragger>
                            {editId &&
                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.files?.length > 0 ? workOrderGetByIDData?.files.
                                        filter(data => {
                                            const name = data?.fileName?.toLowerCase() || "";
                                            const ext = name.split('.').pop();

                                            return (
                                                !deletePhoto?.includes(data?._id) &&
                                                !['png', 'jpg', 'jpeg'].includes(ext) &&
                                                name.includes("wsinspection")
                                            );
                                        })
                                        .map((data, index) => {
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
                                                    <div onClick={() => setDeletePhoto(prev => [...prev, data?._id])} style={{ cursor: 'pointer', position: 'absolute', right: 10, zIndex: 999 }}>
                                                        <AiOutlineDelete size={22} color='red' />
                                                    </div>
                                                </div>

                                            )
                                        }) : ""}
                                </div>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
})
// second Step complete
