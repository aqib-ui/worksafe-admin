import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './AlertsReadScreen.module.css'
import { Image, Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Space, ConfigProvider, Modal, Skeleton, Tag } from 'antd'
import * as AlertAction from '../../../../store/actions/Alerts/index';
import * as POIAction from '../../../../store/actions/Poi/index';
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { Circle, GoogleMap, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineChevronRight, MdOutlineLocationSearching, MdOutlineModeEditOutline, MdOutlinePolyline } from "react-icons/md";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoTriangle } from "react-icons/io5";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { UploadOutlined } from '@ant-design/icons';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import WorkSiteIcon from "../../../assets/marker_worksites.png";
import myLocationMarker from "../../../assets/myLocationMarker.png";
import rightIcon from '../../../assets/icons/screenIcon/indicate-right.png'
import polylineBlue from '../../../assets/polylineBlue.png'
import customAreaBlue from '../../../assets/customAreaBlue.png'
import circleBlue from '../../../assets/circleBlue.png'
import { IoClose } from "react-icons/io5";
import redDoc from '../../../assets/red-Doc.png'
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import moreIcon from '../../../assets/more-Icon.png'
import editIcon from '../../../assets/editIcon.png'
import deletePersonalIcon from '../../../assets/deletePersonalIcon.png'
import removeIcon from '../../../assets/removeIcon.png'
import Dragger from 'antd/es/upload/Dragger';
import blueDoc from '../../../assets/blue-Doc.png'
import calendarDatePicker from '../../../assets/calendarDatePicker.png'
import MapWidget from '../../../component/mapComponent';
import blueCalender from '../../../assets/blueCalender.png'
import blueClock from '../../../assets/blueClock.png'
import { useDownloadNotification } from '../../../provider/downloadProvider';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { TASK_CLEAR_EXPIRED, TASK_GET_ALERTS_COMPLETE, TASK_GET_ARCHIVED_ALERTS_COMPLETE, TASK_GET_POI_ARCHIVED_COMPLETE, TASK_GET_POI_COMPLETE, TASK_LOAD_ARCHIVED_COMPLETE, TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, TASK_LOAD_MY_WORK_ORDER_COMPLETE } from '../../../../store/actions/types';
import linkBlue from '../../../assets/link-blue.png'

const AlertScreenRead = ({ WorkOrderReducer, AlertsReducer, GetAllWorkOrderUnLink, GetAlertsByID, GetPOI, PoiReducer, ArchiveAlerts, WorkPOIGetById, GetAllWorkOrderFilterLink, PoiArchived, WorkPOIGetByIdDoc }) => {
    const current_Id = localStorage.getItem('Zk2@pHL5uy!6mW+L9/=2&y==')
    const currentAlert = localStorage.getItem("Pf_!9DqZ@+76MaL#CYxv3tr")

    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const dateFormat2 = 'YYYY-MM-DD';


    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const dateFormat = 'YYYY-MM-DD hh:mm A';
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [messageApi, contextHolder] = message.useMessage();
    const Role_ID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')
    const [personanalDataList, setPersonanalDataList] = useState([]);
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")


    const { POIGetByIDData, workSiteData, workOrderLinkData, POIGetByIDDataLoading } = PoiReducer
    const { alertDetail, alertDetailLoading } = AlertsReducer


    useEffect(() => {
        GetAlertsByID(currentAlert)
        if (currentWorkSite) {
            GetAllWorkOrderFilterLink(currentAlert, "Alert", currentWorkSite)
        }
    }, [])


    useEffect(() => {
        if (!messageApi) return;
        if (AlertsReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (AlertsReducer.projectExpiredError) {
            messageApi.destroy();
            messageApi.open({
                type: "info",
                content: "Payment Expired",
            });
            const timeoutNavigate = setTimeout(() => {
                navigate('/')
            }, 1000);
            return () => {
                dispatch({ type: TASK_CLEAR_EXPIRED });
                clearTimeout(timeoutNavigate)
            }
        }
        if (AlertsReducer.alertDeleteLoading) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Loading...",
            });
        }
        if (AlertsReducer.alertDelete) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Alert archived successfully",
            });
            dispatch({ type: TASK_GET_ARCHIVED_ALERTS_COMPLETE, loading: true, payload: [] });
            dispatch({ type: TASK_GET_ALERTS_COMPLETE, loading: true, payload: [] });
            navigate('/alerts/my-alerts')
        }
    }, [
        AlertsReducer.networkError,
        AlertsReducer.projectExpiredError,
        AlertsReducer.alertDelete,
        AlertsReducer.alertDeleteLoading,
        messageApi,
    ]);


    const [addDrawer, setAddDrawer] = useState(false);

    const showAddDrawer = () => {
        setAddDrawer(true);
    };
    const closeAddDrawer = () => {
        setAddDrawer(false);
    };



    const [addExtraDrawer, setAddExtraDrawer] = useState(false);

    const showExtraDrawer = (e) => {
        setAddExtraDrawer(true);
    };
    const closeExtraDrawer = () => {
        setAddExtraDrawer(false);
    };

    const { downloadWorkOrderFile, fileLoader } = useDownloadNotification();








    // map
    const [workSiteMarker, setWorkSiteMarker] = useState(null)
    const [pointsWorkSite, setPointsWorkSite] = useState([]);
    const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);
    const [workOrderListing, setWorkOrderListing] = useState([])


    useEffect(() => {
        const workOrderIDs = workOrderLinkData?.map(item => item?.title) || [];
        setPersonanalDataList(alertDetail?.add_hours_worked ? JSON.parse(alertDetail?.add_hours_worked) : [])
        const polygons = workSiteData?.find(data => data._id == currentWorkSite)?.polygon;
        setWorkOrderListing(workOrderIDs)
        const firstLocation = polygons?.locations?.[0];
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
        }
        // WorkPOIGetByIdDoc()
    }, [workSiteData, workOrderLinkData])










    const [mapKey, setMapKey] = useState(0)
    const mapRefParent = useRef()


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


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
    });






    // forCircle
    const drawWithRadiusBounds = (firstLocation, radius) => {
        const deltaLat = radius / 111320;
        const deltaLng = radius / (111320 * Math.cos(firstLocation?.lat * (Math.PI / 180)));
        const center = new window.google.maps.LatLng(firstLocation?.lat, firstLocation?.lng);
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(firstLocation?.lat + deltaLat, firstLocation?.lng + deltaLng));
        bounds.extend(new window.google.maps.LatLng(firstLocation?.lat - deltaLat, firstLocation?.lng - deltaLng));
        mapRefParent.current.fitBounds(bounds, {
            top: 50,
            bottom: 50,
            right: 50,
            left: window.innerWidth * 0.25,
        });
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
            mapRefParent.current.fitBounds(paddedBounds, {
                top: 50,
                bottom: 50,
                right: 50,
                left: window.innerWidth * 0.25,
            });
        }
    };
    // forPoints


    const dispatch = useDispatch()
    const navigate = useNavigate();




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



    const [mapLoader, setMapLoader] = useState(false)
    useEffect(() => {
        setMapLoader(true)
        const position = getMarkerPosition(alertDetail?.polygon?.locations);
        if (alertDetail?.files?.length > 0 && PoiReducer?.poiDoc?.length <= 0) {
            const filesWithPath = alertDetail?.files.map(file =>
                new URL(file.url).pathname.replace(/^\/+/, '')
            );
            WorkPOIGetByIdDoc(filesWithPath);
        }

        if (alertDetail?.polygon?.type == "Circle") {
            setSelectShape(2);
            setCircleRadius(Number(alertDetail?.polygon?.radius.toFixed()))
            setCircleSafety(Number(alertDetail?.polygon?.safetyZone.toFixed()))
            setCircleElevation(Number(alertDetail?.polygon?.altitude.toFixed()))
            setTimeout(() => {
                childRefParent.current?.drawCircle();
                circleRef.current?.setCenter(position);
                childCircleRef.current?.setCenter(position);
                drawWithRadiusBounds(position, Number(alertDetail?.polygon?.radius.toFixed()))
                setMapLoader(false)
            }, 2000);
        }
        else if (alertDetail?.polygon?.type === "Polygon") {
            setSelectShape(3)
            const killtime = setTimeout(() => {
                setCustomAreaSafety(Number(alertDetail?.polygon?.safetyZone.toFixed()))
                setCustomAreaElevation(Number(alertDetail?.polygon?.altitude.toFixed()))
                drawPolyLinePolyGoneBond(alertDetail?.polygon?.locations)
                setPolygonPoint(
                    alertDetail?.polygon?.locations?.map(([lat, lng]) => ({
                        lat: Number(lat),
                        lng: Number(lng),
                    })) || []
                );
                setMapLoader(false)
            }, 1000);

            return () => {
                clearTimeout(killtime)
            }
        }
        else if (alertDetail?.polygon?.type === "Polyline") {
            setSelectShape(1)
            const killtime = setTimeout(() => {
                setPolylineWidth(Number(alertDetail?.polygon?.radius.toFixed()))
                setPolylineSafety(Number(alertDetail?.polygon?.safetyZone.toFixed()))
                setPolylineElevation(Number(alertDetail?.polygon?.altitude.toFixed()))
                drawPolyLinePolyGoneBond(alertDetail?.polygon?.locations)
                setPointsPolyLine(
                    alertDetail?.polygon?.locations?.map(([lat, lng]) => ({
                        lat: Number(lat),
                        lng: Number(lng),
                    })) || []
                );
                setMapLoader(false)
            }, 1000);
            return () => {
                clearTimeout(killtime)
            }
        }
    }, [alertDetail])
    // map


    function convertBytes(bytes) {
        return {
            kb: +(bytes / 1024).toFixed(2),
            mb: +(bytes / (1024 * 1024)).toFixed(2),
            gb: +(bytes / (1024 * 1024 * 1024)).toFixed(4),
        };
    }


































    // complete workorder



    // Email add Workorder complete
    const [showAddEmail, setShowAddEmail] = useState(false);
    const [queueEmail, setQueueEmail] = useState("");
    const [actualEmail, setActualEmail] = useState([]);

    const openAddEmail = () => {
        setShowAddEmail(true)
    }
    const closeAddEmail = () => {
        setShowAddEmail(false)
    }
    // Email add Workorder complete





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
            return updatedList;
        });

        setQueueEmail("");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    const hasInvalidExtraData =
        !queueEmail?.trim() ||
        !emailRegex.test(queueEmail.trim());


    const deleteEmail = (index) => {
        setActualEmail(prev => prev.filter((item, index1) => index1 !== index));
        messageApi.open({
            type: "error",
            content: "Email has been deleted.",
        });
    };


    const [sendTo, setSendTo] = useState("Yes");
    const [jsaRequired, setJsaRequired] = useState(false)
    const [currentWorkOrder, setCurrentWorkOrder] = useState();


    const [deleteSafetyH, setDeleteSafetyH] = useState([])
    const [JSA2, setJSA2] = useState([]);


    const [isExcel, setIsExcel] = useState(false)
    const isSendExcel = checked => {
        setIsExcel(checked)
    };


    const [allJSA, setAllJSA] = useState([])
    const [HJSAOrVideos, setHJSAOrVideos] = useState()


    const getCurrentDate = () => {
        return dayjs(Date.now()).format('YYYY-MM-DD hh:mm A');
    };
    const [currentDate, setCurrentDate] = useState();




    const showEditModal = (id) => {
        setEditPersonalModal(true);
        setCurrentWorkOrder(id._id)
        setJsaRequired(id?.isJSA == "true" ? true : false)
        setHJSAOrVideos(id?.jsaDocumentation?.length > 0 ? true : false)
        setAllJSA(id?.jsaDocumentation)
        setActualEmail(JSON.parse(id?.email_copy_to_completed))
        setIsExcel(id?.isExcelCompleted == "true" ? true : false)
        setCurrentDate(id?.completed_date !== "" ? dayjs(id?.completed_date == "null" ? Date.now() : id?.completed_date).format('YYYY-MM-DD hh:mm A') : getCurrentDate())
        setSendTo(id?.send_to == "true" ? "Yes" : "No")
    };
    const [editPersonalModal, setEditPersonalModal] = useState(false);
    const cancelEditModal = () => {
        setEditPersonalModal(false);
    };



    const getCombinedDateTime = () => {
        if (currentDate) {
            const combined = dayjs(currentDate).format(dateFormat);
            return combined
        }
        return null;
    };



    const editWorkOrder = (eId) => {
        window.location.reload()
        window.location.href = `/alerts/create?editId=${eId}`;
    }

    const UserID = localStorage.getItem('zP!4vBN#tw69gV+%2/+1/w==')


    const [deleteExtra, setDeleteExtra] = useState(false);
    const closeConfirm = () => {
        setDeleteExtra(false)
    }




    const [JSAOrVideos, setJSAOrVideos] = useState([])
    const [deleteJSA, setDeleteJSA] = useState([])
    const handleBeforeUpload3 = (file) => {
        setJSAOrVideos((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
        return false;
    };




    const capitalizeWord = (word) =>
        typeof word === "string" && word.length > 0
            ? word[0].toUpperCase() + word.slice(1)
            : "";

    const menuItems = () => {
        if (alertDetail?.isArchived) return [];
        else {
            return [
                {
                    key: "archive",
                    label: "Archive Alert",
                    icon: <RiDeleteBin7Line size={18} color="red" />,
                    onClick: () => setDeleteExtra(true),
                },
                {
                    key: "edit",
                    label: "Edit Alert",
                    icon: <img src={editIcon} style={{ height: 18 }} />,
                    onClick: () => editWorkOrder(alertDetail?._id),
                },
            ];
        }
        return [];
    };


    const fileNameMap = new Map(
        alertDetail?.files?.map(file => [
            file.fileName,
            file, // contains size, mimeType, etc.
        ]) || []
    );

    const matchedFiles =
        PoiReducer?.poiDoc?.urls
            ?.map(item => {
                const decodedKey = decodeURIComponent(item.key);

                const matchedFile = [...fileNameMap.values()].find(file =>
                    decodedKey.endsWith(file.fileName)
                );

                return matchedFile
                    ? {
                        ...item,
                        fileName: matchedFile.fileName,
                        size: matchedFile.size,
                        mimeType: matchedFile.mimeType,
                    }
                    : null;
            })
            .filter(Boolean) || [];




    const getExtensionFromUrl = (url = '') =>
        new URL(url).pathname.split('.').pop().toLowerCase();

    const pdfFiles = matchedFiles?.filter(
        file => getExtensionFromUrl(file.url) === 'pdf'
    );

    const photoFiles = matchedFiles?.filter(
        file => ['png', 'jpg', 'jpeg', 'svg'].includes(
            getExtensionFromUrl(file.url)
        )
    );

    const preNotification = alertDetail?.reminder_time
        ? dayjs(alertDetail.reminder_time).local()
        : null;

    const notificationTime = alertDetail?.estimated_time
        ? dayjs(alertDetail.estimated_time).local()
        : null;
    const diffInMinutes = notificationTime?.diff(preNotification, 'minute');

    const notificationTimeFy = alertDetail?.estimated_time
        ? dayjs(alertDetail.estimated_time).local().format("D-M-YY, hh:mm A")
        : null;


    const shouldShowNotification =
        alertDetail?.notification_title ||
        alertDetail?.notification_description ||
        notificationTimeFy ||
        diffInMinutes;




    // console.log(alertDetail?.workSite?._id == workSite,'asalskdksa')
    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <div className={Style.Allpath}>
                            <h6>Alert</h6>
                            <img src={rightIcon} />
                            <h6 className={Style.activePage}>Alert Detail</h6>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3>Alert Detail</h3>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {!alertDetail?.isArchived && alertDetail?.workSite?._id == workSite && (
                                    < Dropdown trigger={['click']} menu={{ items: menuItems() }} placement="bottomRight">
                                        <span style={{ display: "flex", alignItems: 'center', justifyContent: 'center', width: 50 }}><img src={moreIcon} style={{ height: "24px" }} /></span>
                                    </Dropdown>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Style.Container}>
                    <div className={Style.FloaterBubble}>
                        <div className={Style.FloaterContainer}>
                            {alertDetailLoading ?
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", width: '100%' }}>
                                    <Spin />
                                </div>
                                :
                                <div className={Style.FloatingFilter}>
                                    {alertDetail?.riskLevel == "No Threat" ?
                                        <div className={Style.signalTopHigh1}>
                                            <p>{alertDetail?.riskLevel}</p>
                                        </div>
                                        : alertDetail?.riskLevel == "Lowest" ?
                                            <div className={Style.signalTopHigh2}>
                                                <p>{alertDetail?.riskLevel}</p>
                                            </div>
                                            : alertDetail?.riskLevel == "Moderate" ?
                                                <div className={Style.signalTopHigh3}>
                                                    <p>{alertDetail?.riskLevel}</p>
                                                </div>
                                                : alertDetail?.riskLevel == "High" ?
                                                    <div className={Style.signalTopHigh4}>
                                                        <p>{alertDetail?.riskLevel}</p>
                                                    </div>
                                                    : alertDetail?.riskLevel == "Extreme" ?
                                                        <div className={Style.signalTopHigh5}>
                                                            <p>{alertDetail?.riskLevel}</p>
                                                        </div>
                                                        : ""}
                                    <div className={Style.basicInfoSec}>
                                        <h4>{alertDetail?.title}</h4>

                                        <div style={{ paddingBottom: alertDetail?.elevationLevels?.length > 0 ? 10 : 0 }} className={Style.NewLayerWorkOrder}>
                                            {alertDetail?.elevationLevels?.map(item => (
                                                <div key={item} className={Style.InContent}>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>


                                        {alertDetail?.polygon?.type == "Circle" ?
                                            <div className={Style.mapInfoTag}>
                                                <img src={circleBlue} /> <p>{alertDetail?.polygon?.type}</p>
                                            </div>
                                            :
                                            alertDetail?.polygon?.type == "Polygon" ?
                                                <div className={Style.mapInfoTag}>
                                                    <img src={customAreaBlue} /> <p>{"Custom Area"}</p>
                                                </div>
                                                :
                                                alertDetail?.polygon?.type == "Polyline" ?
                                                    <div className={Style.mapInfoTag}>
                                                        <img src={polylineBlue} /> <p>{alertDetail?.polygon?.type}</p>
                                                    </div>
                                                    : ""
                                        }

                                        <div className={Style.MapInfoAll}>
                                            {alertDetail?.polygon?.type == "Polyline" ?
                                                <>
                                                    <div>
                                                        <p>{Number(alertDetail?.polygon?.safetyZone).toFixed(2)} m</p>
                                                        <h6>Width Stroke</h6>
                                                    </div>
                                                    <span></span>
                                                </>
                                                : alertDetail?.polygon?.type == "Circle" ?
                                                    <>
                                                        <div>
                                                            <p>{Number(alertDetail?.polygon?.safetyZone).toFixed(2)} m</p>
                                                            <h6>Radius</h6>
                                                        </div>
                                                        <span></span>
                                                    </>
                                                    : ""}
                                            <div>
                                                <p>{Number(alertDetail?.polygon?.safetyZone).toFixed(2)} m</p>
                                                <h6>Safety Zone</h6>
                                            </div>
                                            <span></span>
                                            <div>
                                                <p>{alertDetail?.polygon?.altitude} m</p>
                                                <h6>Elevation</h6>
                                            </div>
                                        </div>

                                        <div className={Style.MapInfoAll}>
                                            <h6 style={{ marginTop: 6, color: 'var(--gray-100)' }}>{alertDetail?.description}</h6>
                                        </div>

                                        {/* <div className={Style.MapInfoAll}> */}
                                        <Tag style={{ color: alertDetail?.alertType == "HAZARD" ? "#D32029" : alertDetail?.alertType == "WEATHER" ? "#129154" : alertDetail?.alertType == "COMMUNICATION" ? '#F4B740' : alertDetail?.alertType == "SECURITY" ? '#016483' : null }} color={alertDetail?.alertType == "HAZARD" ? "rgb(210, 25, 41,0.1)" : alertDetail?.alertType == "WEATHER" ? "rgb(18, 145, 84,0.1)" : alertDetail?.alertType == "COMMUNICATION" ? 'rgb(196, 146, 56,0.1)' : alertDetail?.alertType == "SECURITY" ? 'rgb(1, 100, 131,0.1)' : null}>
                                            {alertDetail?.alertType === "HAZARD" ? "Potential hazard" : alertDetail?.alertType === "WEATHER" ? "Weather condition" : alertDetail?.alertType === "COMMUNICATION" ? "Communication" : alertDetail?.alertType === "SECURITY" ? "Security" : alertDetail?.alertType}
                                        </Tag>
                                        {/* </div> */}

                                    </div>
                                    <div className={Style.secondSec}>
                                        {workOrderListing?.length > 0 ?
                                            <>
                                                <p className={Style.workOrderText}>Work Order</p>
                                                <div className={Style.NewLayerWorkOrder}>
                                                    {workOrderListing?.map(item => (
                                                        <div key={item} className={Style.InContent}>
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                            : ""}
                                        <div onClick={showExtraDrawer} style={{ marginTop: workOrderListing?.length > 0 ? 16 : 0 }}>
                                            <div className={Style.TaskFeild} style={{ marginTop: workOrderListing?.length > 0 ? 16 : 0 }}>
                                                <div className={Style.AddExtraDataFeild}>
                                                    <div>
                                                        <p>Extra data <span>({alertDetail?.extraFields?.length ?? 0})</span></p>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <MdOutlineChevronRight size={28} color='#626D6F' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {shouldShowNotification && (
                                        <div style={{ borderTop: '0px solid transparent' }} className={Style.secondSec}>
                                            <div className={Style.NotificationCycle}>
                                                <div className={Style.headerTopNot}>
                                                    <p>Notification Information</p>
                                                </div>
                                                <div className={Style.AfterHeader}>
                                                    {alertDetail?.notification_title &&
                                                        <p>{alertDetail?.notification_title}</p>
                                                    }
                                                    {alertDetail?.notification_description &&
                                                        <h6>{alertDetail?.notification_description}</h6>
                                                    }
                                                </div>
                                                <div className={Style.NofificationTime}>
                                                    <div className={Style.fullTime}>
                                                        <img src={blueCalender} />
                                                        <p>{notificationTimeFy}</p>
                                                    </div>
                                                    <div className={Style.prefullTime}>
                                                        <img src={blueClock} />
                                                        <p>{diffInMinutes} minutes before</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ border: '0px solid transparent' }} className={Style.secondSec}>
                                        {PoiReducer?.poiDocLoading ?
                                            <>
                                                <Space>
                                                    <Skeleton.Avatar active shape={'circle'} />
                                                    <Skeleton.Input active size={'default'} />
                                                </Space>

                                                <Space style={{ marginTop: 10 }}>
                                                    <Skeleton.Avatar active shape={'circle'} />
                                                    <Skeleton.Input active size={'default'} />
                                                </Space>
                                                <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                    <div>
                                                        <h6 style={{ width: "100%" }}>Photos</h6>
                                                        <div className={Style.PhotoGrid}>
                                                            <Skeleton.Image active />
                                                            <Skeleton.Image active />
                                                            <Skeleton.Image active />
                                                            <Skeleton.Image active />
                                                            <Skeleton.Image active />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                {pdfFiles?.length > 0 ?
                                                    <div style={{ marginTop: 16, flexDirection: 'column' }} className={Style.MapInfoAll}>
                                                        <h6 style={{ width: "100%" }}>Documents</h6>
                                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                            {pdfFiles.map((data, index) => (
                                                                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                                                                    <>
                                                                        <div className={Style.DocHear}>
                                                                            <img src={redDoc} style={{ height: 24 }} />
                                                                        </div>
                                                                        <div className={Style.DocData}>
                                                                            <a target='_blank' href={data?.url}>{data?.fileName}</a>
                                                                            <h6>{`${convertBytes(data?.size)?.mb} MB`}</h6>
                                                                        </div>
                                                                    </>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    : ""}


                                                {photoFiles?.length > 0 ?
                                                    <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                        <div>
                                                            <h6 style={{ width: "100%" }}>Photos</h6>
                                                            <div className={Style.PhotoGrid}>
                                                                {photoFiles.map((data, index) => (
                                                                    <>
                                                                        <div key={index} className={Style.PhotoIn}>
                                                                            <Image
                                                                                height={86}
                                                                                alt="basic"
                                                                                src={data?.url}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ""}
                                            </>
                                        }
                                    </div>
                                </div>
                            }

                        </div>
                    </div>


                    {isLoaded ? (
                        <>
                            <MapWidget
                                isAlert={true}
                                alertType={alertDetail?.alertType}
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
                                workSiteLoader={mapLoader}
                                isRead={true}
                                loadingTitle={"Loading Alert."}
                                loadingPara={"Loading your Alert. Please wait a moment."}
                            // worksite Loader
                            />
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: "100%" }}>
                            <Spin size='default' />
                        </div>
                    )}
                </div >


                {/* Extra Data */}
                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title="Add Extra Data"
                    placement={'right'}
                    styles={{ header: { padding: '17px 24px' }, body: { padding: '24px' } }}
                    onClose={closeExtraDrawer}
                    open={addExtraDrawer}
                    width={486}
                    key={'right'}
                >
                    <>
                        {alertDetail?.extraFields?.length > 0 ? alertDetail?.extraFields?.map((data, index) => {
                            let rgbaString = '';
                            if (capitalizeWord(data?.type) == "Color") {
                                const [r, g, b, a] = data?.value?.split('|').map(Number);
                                rgbaString = `rgba(${r}, ${g}, ${b}, ${a})`;
                            }
                            return (
                                <div key={index} className={Style.MainListingHourWork}>
                                    <div className={Style.HoursWorkListTop}>
                                        {capitalizeWord(data?.type) == "Input" ?
                                            <h6>{data?.value}</h6>
                                            : capitalizeWord(data?.type) == "Boolean" ?
                                                <div className={data?.value ? Style.InputDesign : Style.FInputDesign}>
                                                    <p>{data?.value ? "On" : "Off"}</p>
                                                    <Switch size='small' disabled={true} value={data?.value} />
                                                </div>
                                                : capitalizeWord(data?.type) == "Date" ?
                                                    <h6>{data?.value}</h6>
                                                    : capitalizeWord(data?.type) == "Color" ?
                                                        <ColorPicker value={rgbaString} disabled={false} style={{ marginTop: 8 }} />
                                                        : ""
                                        }
                                    </div>
                                    <h6>{data?.name}</h6>
                                    <p>{data?.description}</p>
                                </div>
                            )
                        }) :
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", width: '100%', flexDirection: 'column', textAlign: 'center' }}>
                                <img src={blueDoc} style={{ height: 72 }} />
                                <h5 style={{ fontSize: 20, fontWeight: 500, marginTop: 8 }}>No Extra Data Added Yet</h5>
                                <p style={{ fontSize: 14, fontWeight: 400, color: "#51595A", marginTop: 8 }}>You haven’t added any extra details to this Alert yet.</p>
                            </div>
                        }
                    </>
                </Drawer>
                {/* Extra Data */}

                {/* confirm delete */}
                <Modal
                    open={deleteExtra}
                    onCancel={closeConfirm}
                    header={false}
                    centered={true}
                    closeIcon={false}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button disabled={AlertsReducer.alertDeleteLoading} onClick={() => setDeleteExtra(false)} className={AlertsReducer.alertDeleteLoading ? Style.editPersonalModalFooterCancelD : Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button disabled={AlertsReducer.alertDeleteLoading} onClick={() => { ArchiveAlerts(currentAlert) }} className={AlertsReducer.alertDeleteLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>Archive Alert</button>
                        </div>
                    </>}

                >
                    <>
                        <h4 className={Style.AreYouSure}>Archive this Alert?</h4>
                        <p className={Style.AreYouSurePara}>This alert will be permanently removed from your active list and moved to your archive.</p>
                    </>
                </Modal>
                {/* confirm delete */}

            </div >
        </>
    )
}


function mapStateToProps({ PoiReducer, AlertsReducer, WorkOrderReducer }) {
    return { PoiReducer, AlertsReducer, WorkOrderReducer };
}
export default connect(
    mapStateToProps,
    { ...AlertAction, ...POIAction, ...WorkOrderAction }
)(AlertScreenRead);
