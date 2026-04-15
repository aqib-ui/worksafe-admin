// import { useCallback, useEffect, useRef, useState } from 'react'
// import Style from './AlertsReadScreen.module.css'
// import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider, Checkbox } from 'antd'
// import * as AlertAction from '../../../../store/actions/Alerts/index';
// import * as POIAction from '../../../../store/actions/Poi/index';
// import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
// import { connect } from 'react-redux';
// import * as yup from 'yup';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useNavigate } from 'react-router';
// import { Circle, GoogleMap, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { FaRegCircle } from "react-icons/fa";
// import Autocomplete from "react-google-autocomplete";
// import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
// import { MdOutlineEdit, MdOutlinePolyline } from "react-icons/md";
// import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
// import { IoTriangle } from "react-icons/io5";
// import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import { IoSettingsOutline } from "react-icons/io5";
// import { MdOutlineDeleteOutline } from "react-icons/md";
// import { FiPlus } from "react-icons/fi";
// import { FaCheck } from "react-icons/fa6";
// import { UploadOutlined } from '@ant-design/icons';
// import { baseUrl } from '../../../../store/config.json';
// import { MdOutlineLocationSearching } from "react-icons/md";
// import { MdOutlineModeEditOutline } from "react-icons/md";
// import WorkSiteIcon from "../../../assets/marker_worksites.png";
// import myLocationMarker from "../../../assets/myLocationMarker.png";
// import GoogleMapCreate from '../../../component/googleMap';
// import { RxAvatar } from "react-icons/rx";
// import { MdOutlineModeEdit } from "react-icons/md";
// import { MdDeleteOutline } from "react-icons/md";
// import utc from 'dayjs/plugin/utc';


// const AlertScreenRead = ({ WorkOrderReducer, AlertsReducer, PoiReducer, GetAllWorkOrderUnLink, GetAlertsByID, GetAllWorkOrderFilterLink }) => {
//     dayjs.extend(customParseFormat);
//     dayjs.extend(utc);
//     const dateFormat2 = 'YYYY-MM-DD';
//     const now = new Date(Date.now());
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     const formattedDate = `${year}-${month}-${day}`;
//     const [messageApi, contextHolder] = message.useMessage();
//     const [getSeach, setGetSearch] = useState('')
//     const navigate = useNavigate();
//     const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
//     const currentAlert = localStorage.getItem("Pf_!9DqZ@+76MaL#CYxv3tr")
//     const currentUser = localStorage.getItem("zP!4vBN#tw69gV+%2/+1/w==")
//     const [selectedContractorIds, setSelectedContractorIds] = useState([]);
//     const [safetyOffsetMore, setSafetyOffsetMore] = useState(0);
//     const [offsetPolygon, setOffsetPolygon] = useState([]);
//     const [padding, setPadding] = useState(0);
//     const [allFiles, setAllFiles] = useState([])
//     const [allFilesLoading, setAllFilesLoading] = useState(false)


//     const workOrderGetDoc = async (body) => {
//         setAllFilesLoading(true)
//         const controller = new AbortController();
//         const timeout = setTimeout(() => controller.abort(), 1000000);
//         const url = `/assets/files/signed-urls`;
//         const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
//         try {
//             const options = {
//                 method: 'POST',
//                 headers: {
//                     "Content-Type": "application/json",
//                     "authorization": `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({ keys: body }),
//                 signal: controller.signal,
//             };
//             const response = await fetch(`${baseUrl}${url}`, options);
//             const res = await response.json();
//             if (response.status === 200 || response.status === 201) {
//                 setAllFilesLoading(false)
//                 setAllFiles(res)
//                 return res || 0
//             }
//             setAllFilesLoading(false)
//         } catch (error) {
//             setAllFilesLoading(false)
//             if (error.name === "AbortError") console.error("Request timed out");
//         } finally {
//             clearTimeout(timeout);
//         }
//     };


//     const { alertDetail } = AlertsReducer
//     const { workOrderLinkData } = PoiReducer





//     const fileNameMap = new Map(
//         alertDetail?.files?.map(file => [
//             file.fileName,
//             file,
//         ]) || []
//     );

//     const matchedFiles =
//         allFiles?.urls
//             ?.map(item => {
//                 const decodedKey = decodeURIComponent(item.key);

//                 const matchedFile = [...fileNameMap.values()].find(file =>
//                     decodedKey.endsWith(file.fileName)
//                 );

//                 return matchedFile
//                     ? {
//                         ...item,
//                         fileName: matchedFile.fileName,
//                         size: matchedFile.size,
//                         mimeType: matchedFile.mimeType,
//                     }
//                     : null;
//             })
//             .filter(Boolean) || [];


//     const preNotificationOuter = alertDetail?.reminder_time
//         ? dayjs(alertDetail.reminder_time).local()
//         : null;
//     const notificationTimeOuter = alertDetail?.estimated_time
//         ? dayjs(alertDetail.estimated_time).local()
//         : null;

//     const diffInMinutes = notificationTimeOuter?.diff(preNotificationOuter, 'minute');




//     const drawWithRadiusBounds = (firstLocation, radius) => {
//         const lat = Number(firstLocation[0]);
//         const lng = Number(firstLocation[1]);
//         const deltaLat = radius / 111320;
//         const deltaLng = radius / (111320 * Math.cos(lat * (Math.PI / 180)));
//         const center = new window.google.maps.LatLng(lat, lng);
//         const bounds = new window.google.maps.LatLngBounds();
//         bounds.extend(new window.google.maps.LatLng(lat + deltaLat, lng + deltaLng));
//         bounds.extend(new window.google.maps.LatLng(lat - deltaLat, lng - deltaLng));
//         mapRef.current.fitBounds(bounds);
//     };

//     const drawPolyLinePolyGoneBond = (coords = []) => {
//         if (!coords.length) return;
//         const numericCoords = coords.map(([lat, lng]) => ({
//             lat: Number(lat),
//             lng: Number(lng),
//         }));
//         const center = numericCoords.reduce(
//             (acc, p) => {
//                 acc.lat += p.lat;
//                 acc.lng += p.lng;
//                 return acc;
//             },
//             { lat: 0, lng: 0 }
//         );
//         center.lat /= numericCoords.length;
//         center.lng /= numericCoords.length;
//         setLocation(center);
//         let minLat = Infinity,
//             maxLat = -Infinity,
//             minLng = Infinity,
//             maxLng = -Infinity;
//         numericCoords.forEach((p) => {
//             minLat = Math.min(minLat, p.lat);
//             maxLat = Math.max(maxLat, p.lat);
//             minLng = Math.min(minLng, p.lng);
//             maxLng = Math.max(maxLng, p.lng);
//         });
//         const latPadding = (maxLat - minLat) * 0.10;
//         const lngPadding = (maxLng - minLng) * 0.10;
//         const paddedBounds = new window.google.maps.LatLngBounds(
//             {
//                 lat: minLat - latPadding,
//                 lng: minLng - lngPadding,
//             },
//             {
//                 lat: maxLat + latPadding,
//                 lng: maxLng + lngPadding,
//             }
//         );
//         if (mapRef?.current) {
//             mapRef.current.fitBounds(paddedBounds);
//         }
//     };


//     useEffect(() => {
//         const workOrderIDs = workOrderLinkData?.map(item => item?.title) || [];
//         const preNotification = alertDetail?.reminder_time
//             ? dayjs(alertDetail.reminder_time).local()
//             : null;

//         const notificationTime = alertDetail?.estimated_time
//             ? dayjs(alertDetail.estimated_time).local()
//             : null;
//         const diffInMinutes = notificationTime?.diff(preNotification, 'minute');
//         setParentRadius(alertDetail?.polygon?.radius)
//         setSafetyOffset(alertDetail?.polygon?.safetyZone)
//         setSelectedContractorIds(alertDetail?.contractorContact ?? [])
//         reset(
//             {
//                 title: alertDetail?.title,
//                 threatLevel: alertDetail?.riskLevel,
//                 typeOfAlert: alertDetail?.alertType,
//                 linkedWorkOrder: workOrderIDs,
//                 ...(alertDetail?.reminder_time && {
//                     preNotificationTimeAndDate: diffInMinutes == 0 ? "" : diffInMinutes,
//                 }),
//                 ...(alertDetail?.estimated_time && {
//                     notificationTimeAndDate: dayjs(alertDetail.estimated_time).local(),
//                 }),
//                 notificationBody: alertDetail?.notification_description !== "undefined" && alertDetail?.notification_description !== "" ? alertDetail?.notification_description : 'N/A',
//                 notificationTitle: alertDetail?.notification_title !== "undefined" && alertDetail?.notification_title !== "" ? alertDetail?.notification_title : 'N/A',
//                 description: alertDetail?.description !== "undefined" && alertDetail?.description !== "" ? alertDetail?.description : 'N/A',
//             }
//         )
//         const firstLocation = alertDetail?.polygon?.locations?.[0];

//         const transformedArray = alertDetail?.extraFields?.map(item => {
//             const { type, value, ...rest } = item;
//             const newValue = type === "date" ? dayjs(value).local() : value;
//             return {
//                 ...rest,
//                 value: {
//                     type,
//                     value: newValue
//                 }
//             };
//         });
//         setExtraDataList(transformedArray || []);
//         if (alertDetail?.files?.length > 0 && allFiles?.length <= 0) {
//             const filesWithPath = alertDetail?.files.map(file =>
//                 new URL(file.url).pathname.replace(/^\/+/, '')
//             );
//             workOrderGetDoc(filesWithPath);
//         }
//         if (alertDetail?.polygon?.type == "Circle") {
//             if (
//                 Array.isArray(firstLocation) &&
//                 firstLocation.length >= 2 &&
//                 !isNaN(firstLocation[0]) &&
//                 !isNaN(firstLocation[1])
//             ) {
//                 setLocation({
//                     lat: Number(firstLocation[0]),
//                     lng: Number(firstLocation[1]),
//                 });
//             }
//             const killtime2 = setTimeout(() => {
//                 setSelectedTab(1)
//             }, 4000);
//             const killtime = setTimeout(() => {
//                 setSelectedTab(1)
//                 drawCircleForSee({
//                     lat: Number(firstLocation[0]),
//                     lng: Number(firstLocation[1]),
//                 }, alertDetail?.polygon?.radius, alertDetail?.polygon?.safetyZone)
//                 drawWithRadiusBounds(firstLocation, alertDetail?.polygon?.radius)
//             }, 1000);
//             return () => {
//                 clearTimeout(killtime2)
//                 clearTimeout(killtime)
//             }
//         }
//         else if (alertDetail?.polygon?.type === "Polygon") {
//             setSelectedTab(2)
//             setPoints(
//                 alertDetail?.polygon?.locations?.map(([lat, lng]) => ({
//                     lat: Number(lat),
//                     lng: Number(lng),
//                 })) || []
//             );
//             setPadding(alertDetail?.polygon?.safetyZone)
//             drawPolyLinePolyGoneBond(alertDetail?.polygon?.locations)
//         }
//         else if (alertDetail?.polygon?.type === "Polyline") {
//             setSelectedTab(3)
//             setPointsMore(
//                 alertDetail?.polygon?.locations?.map(([lat, lng]) => ({
//                     lat: Number(lat),
//                     lng: Number(lng),
//                 })) || []
//             );
//             setSafetyOffsetMore(alertDetail?.polygon?.safetyZone)
//             drawPolyLinePolyGoneBond(alertDetail?.polygon?.locations)
//         }
//         return () => {
//             setPoints([]);
//             setExtraDataList([]);
//             setLocation(null);
//             setPointsMore([]);
//             setSafetyOffset();
//             setParentRadius();
//             setSafetyOffsetMore(0)
//             setOffsetPolygon([])
//         }
//     }, [alertDetail, workOrderLinkData])








//     const drawCircleForSee = (a, b, c) => {
//         setPoints([])
//         setPointsMore([])
//         setSelectedTab(1)
//         const parent = new window.google.maps.Circle({
//             map: mapRef.current,
//             center: a,
//             radius: b,
//             strokeColor: '#fe541e',
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: '#fe541e',
//             fillOpacity: 0.35,
//             draggable: false,
//             editable: false,
//             clickable: false
//         });
//         const child = new window.google.maps.Circle({
//             map: mapRef.current,
//             center: a,
//             radius: b + c,
//             strokeColor: '#1e88e5',
//             strokeOpacity: 0.7,
//             strokeWeight: 2,
//             fillColor: '#90caf9',
//             fillOpacity: 0.3,
//             editable: false,
//             draggable: false,
//             clickable: false
//         });
//         parent.addListener('center_changed', () => {
//             const newCenter = parent.getCenter();
//             child.setCenter(newCenter);
//         });
//         parent.addListener('radius_changed', () => {
//             const newRadius = parent.getRadius();
//             setParentRadius(newRadius);
//         });
//         circleRef.current = parent;
//         childCircleRef.current = child;
//     };







//     useEffect(() => {
//         GetAllWorkOrderUnLink(currentWorkSite)
//         GetAlertsByID(currentAlert)
//         GetAllWorkOrderFilterLink(currentAlert, "Alert", currentWorkSite)
//     }, [])

//     const depatmentData = AlertsReducer?.departmentData?.map(data => {
//         return { value: data._id, label: data?.name }
//     })

//     useEffect(() => {
//         if (!messageApi) return;
//         if (AlertsReducer.networkError) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "error",
//                 content: "Something went wrong, please try again",
//             });
//         }
//     }, [
//         AlertsReducer.networkError,
//         messageApi,
//     ]);























































//     const [isDraft, setIsDraft] = useState(false);
//     const schema = yup.object().shape({
//         projectName: yup.string().required(),
//         department: yup.string().required(),
//         elevationlevel: yup.array().required(),
//         linkedWorkOrder: yup.array().notRequired(),
//         projectmanager: yup.string().required(),
//         preNotificationTimeAndDate: yup.string().notRequired(),
//         notificationTimeAndDate: yup.string().notRequired(),
//     });
//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         watch,
//         reset
//     } = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: {
//             projectName: "",
//             department: "",
//             elevationlevel: "",
//             linkedWorkOrder: "",
//             projectmanager: "",
//             preNotificationTimeAndDate: "",
//             notificationTimeAndDate: "",
//         },
//     });

//     // const getCurrentDate = () => {
//     //     const now = new Date();
//     //     const year = now.getFullYear();
//     //     const month = String(now.getMonth() + 1).padStart(2, '0');
//     //     const day = String(now.getDate()).padStart(2, '0');
//     //     return `${year}/${month}/${day}`;
//     // };

//     const WorkOrderData = PoiReducer?.workOrderData?.map(data => {
//         return { value: data._id, label: data?.title }
//     })
//     const ComapnyUserData = WorkOrderReducer?.companyUserData?.map(data => {
//         return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
//     })
//     const elevationLevelOption = [
//         { value: "Below Ground", label: "Below Ground" },
//         { value: "Ground Level", label: "Ground Level" },
//         { value: "Overhead", label: "Overhead" },
//     ]




//     const [location, setLocation] = useState(null);
//     const [error, setError] = useState(null);
//     const [locationToggle, setLocationToggle] = useState(false);




//     function requestLocationAgain() {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 // console.log("Location success:", position);
//             },
//             (error) => {
//                 if (error.code === error.PERMISSION_DENIED) {
//                     messageApi.destroy();
//                     messageApi.open({
//                         type: "error",
//                         content: "You need to enable location access in your browser settings.",
//                     });
//                 }
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0
//             }
//         );
//     }
//     useEffect(() => {
//         if (!navigator.geolocation) {
//             setError('Geolocation is not supported by your browser.');
//             return;
//         }
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 setLocationToggle(true)
//                 setLocation({
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 });
//             },
//             (err) => {
//                 if (err.code === 1) {
//                     setLocationToggle(false)
//                     setError('Permission denied. Please allow location access in your browser settings.');
//                 } else if (err.code === 2) {
//                     setLocationToggle(false)
//                     setError('Location unavailable.');
//                 } else if (err.code === 3) {
//                     setLocationToggle(false)
//                     setError('Location request timed out.');
//                 } else {
//                     setLocationToggle(false)
//                     setError('An unknown error occurred.');
//                 }
//                 setLocationToggle(false)
//                 console.error('Geolocation error:', err);
//             }
//         );
//     }, []);


//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
//     });

//     const mapRef = useRef(null);
//     const circleRef = useRef(null);
//     const childCircleRef = useRef(null)
//     const onMapLoad = useCallback((map) => {
//         mapRef.current = map;
//     }, []);





//     // circle 
//     const [safetyOffset, setSafetyOffset] = useState(0);
//     const [altitude, setAltitude] = useState(0);
//     const [parentRadius, setParentRadius] = useState(100);
//     const [points, setPoints] = useState([]);
//     const [pointsMore, setPointsMore] = useState([]);
//     const [selectedTab, setSelectedTab] = useState(0);
//     const [actualCenter, setActualCenter] = useState()


//     useEffect(() => {
//         if (circleRef.current && childCircleRef.current) {
//             childCircleRef.current.setRadius(parentRadius + safetyOffset);
//         }
//     }, [safetyOffset, parentRadius]);
//     const handleOffsetChange = (e) => {
//         const newOffset = Number(e.target.value);
//         setSafetyOffset(newOffset);
//     };
//     const drawCircle = () => {
//         setPoints([])
//         setPointsMore([])
//         setSelectedTab(1)
//         const parent = new window.google.maps.Circle({
//             map: mapRef.current,
//             center: location,
//             radius: parentRadius,
//             strokeColor: '#fe541e',
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: '#fe541e',
//             fillOpacity: 0.35,
//             draggable: false,
//             editable: false,
//         });
//         const child = new window.google.maps.Circle({
//             map: mapRef.current,
//             center: location,
//             radius: parentRadius + safetyOffset,
//             strokeColor: '#1e88e5',
//             strokeOpacity: 0.7,
//             strokeWeight: 2,
//             fillColor: '#90caf9',
//             fillOpacity: 0.3,
//             clickable: false,
//         });
//         parent.addListener('center_changed', () => {
//             const newCenter = parent.getCenter();
//             child.setCenter(newCenter);
//         });
//         parent.addListener('radius_changed', () => {
//             const newRadius = parent.getRadius();
//             setParentRadius(newRadius);
//         });
//         circleRef.current = parent;
//         childCircleRef.current = child;
//     };
//     const handlePolygonClick = (e) => {
//         const newCenter = {
//             lat: e.latLng.lat(),
//             lng: e.latLng.lng(),
//         };
//         setActualCenter(newCenter);
//         if (circleRef.current) {
//             circleRef.current.setCenter(newCenter);
//         }
//         if (childCircleRef.current) {
//             childCircleRef.current.setCenter(newCenter);
//         }
//     };
//     // circle 




//     // polygon 
//     const getSafetyZonePath = () => {
//         if (points.length < 3) return [];
//         const center = {
//             lat: points.reduce((sum, p) => sum + p.lat, 0) / points.length,
//             lng: points.reduce((sum, p) => sum + p.lng, 0) / points.length,
//         };
//         const padded = points.map((pt) => offsetPoint(pt, center, padding));
//         return [...padded, padded[0]];
//     };
//     const offsetPoint = (point, center, offsetMeters) => {
//         const R = 6378137;
//         const dLat = point.lat - center.lat;
//         const dLng = point.lng - center.lng;
//         const len = Math.sqrt(dLat * dLat + dLng * dLng);
//         const scale = (len + offsetMeters / R * (180 / Math.PI)) / len;
//         return {
//             lat: center.lat + dLat * scale,
//             lng: center.lng + dLng * scale,
//         };
//     };
//     const handleMapClick = useCallback((e) => {
//         if (points.length < 3) {
//             const newPoint = {
//                 lat: e.latLng.lat(),
//                 lng: e.latLng.lng(),
//             };
//             setPoints((prev) => [...prev, newPoint]);
//         }
//     }, [points]);











//     // PolyLine

//     const drawPolyLine = () => {
//         setSelectedTab(3)
//         setPoints([])
//         circleRef.current.setMap(null);
//         circleRef.current = null;
//         childCircleRef.current.setMap(null);
//         childCircleRef.current = null;
//     }
//     const handleMapClickMore = useCallback((e) => {
//         setPoints([])
//         const newPoint = {
//             lat: e.latLng.lat(),
//             lng: e.latLng.lng(),
//         };
//         setPointsMore((prev) => [...prev, newPoint]);
//     }, []);
//     function computeOffsetPolyline(points45, offsetDistance) {
//         const offsetLeftPoints = [];
//         const offsetRightPoints = [];
//         for (let i = 0; i < points45.length - 1; i++) {
//             const p1 = points45[i];
//             const p2 = points45[i + 1];
//             const dx = p2.lng - p1.lng;
//             const dy = p2.lat - p1.lat;
//             const length = Math.sqrt(dx * dx + dy * dy);
//             const ux = dx / length;
//             const uy = dy / length;
//             const px = -uy;
//             const py = ux;
//             const metersPerDegreeLat = 111320;
//             const metersPerDegreeLng = 111320 * Math.cos((p1.lat * Math.PI) / 180);
//             const offsetLat = (py * offsetDistance) / metersPerDegreeLat;
//             const offsetLng = (px * offsetDistance) / metersPerDegreeLng;
//             const offsetLeftP1 = { lat: p1.lat + offsetLat, lng: p1.lng + offsetLng };
//             const offsetLeftP2 = { lat: p2.lat + offsetLat, lng: p2.lng + offsetLng };
//             const offsetRightP1 = { lat: p1.lat - offsetLat, lng: p1.lng - offsetLng };
//             const offsetRightP2 = { lat: p2.lat - offsetLat, lng: p2.lng - offsetLng };
//             offsetLeftPoints.push(offsetLeftP1, offsetLeftP2);
//             offsetRightPoints.push(offsetRightP1, offsetRightP2);
//         }

//         return { offsetLeftPoints, offsetRightPoints };
//     }
//     useEffect(() => {
//         if (pointsMore.length >= 2) {
//             const { offsetLeftPoints, offsetRightPoints } = computeOffsetPolyline(pointsMore, safetyOffsetMore);
//             const safetyZonePath = [...offsetLeftPoints, ...offsetRightPoints.reverse()];
//             setOffsetPolygon(safetyZonePath);
//         } else {
//             setOffsetPolygon([]);
//         }
//     }, [pointsMore, safetyOffsetMore]);

//     // PolyLine








//     // Drawer Extra Data
//     const [extraAddData, setExtraAddData] = useState(false);
//     const showAddExtraDrawer = () => {
//         setExtraAddData(true);
//     };
//     const closeAddExtraDrawer = () => {
//         setExtraAddData(false);
//     };
//     const [extraDataList, setExtraDataList] = useState([]);
//     // Drawer Extra Data





//     // Drawer Daily Project
//     const [dailyProjectDrawer, setDailyProjectDrawer] = useState(false);
//     const showDailyProjectDrawer = () => {
//         setDailyProjectDrawer(true);
//     };
//     const closeDailyProjectDrawer = () => {
//         setDailyProjectDrawer(false);
//     };
//     // Drawer Daily Project





















//     // Contractor Data

//     const addContractorDrawer = (StateHe, format) => {
//         setIsContractorNow(StateHe)
//         setContractorData(format)
//         setAddContractor(true);
//     };

//     const OpenReadPromp = (State, format) => {
//         closeViewContractorDrawer()
//         addContractorDrawer(State, format)
//     }











//     const [locationCurrent, setLocationCurrent] = useState(null);
//     const handleRecenter = () => {
//         if (mapRef.current) {
//             mapRef.current.panTo(new window.google.maps.LatLng(locationCurrent?.lat, locationCurrent?.lng));
//             mapRef.current.setZoom(14.5);
//         }
//     };


//     useEffect(() => {
//         if (!navigator.geolocation) {
//             setError('Geolocation is not supported by your browser.');
//             return;
//         }
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 setLocationCurrent({
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 });
//             },
//             (err) => {
//                 if (err.code === 1) {
//                     setError('Permission denied. Please allow location access in your browser settings.');
//                 } else if (err.code === 2) {
//                     setError('Location unavailable.');
//                 } else if (err.code === 3) {
//                     setError('Location request timed out.');
//                 } else {
//                     setError('An unknown error occurred.');
//                 }
//                 console.error('Geolocation error:', err);
//             }
//         );
//     }, []);

















//     const drawCircleWorkSite = (loc, radius, safetyZone2) => {
//         new window.google.maps.Circle({
//             map: mapRef.current,
//             center: loc,
//             radius: radius,
//             strokeColor: '#050c1f',
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: '#0d1e4b',
//             fillOpacity: 0.35,
//             draggable: false,
//             editable: false,
//         });
//     };


//     const [workSiteMarker, setWorkSiteMarker] = useState(null)
//     const [pointsWorkSite, setPointsWorkSite] = useState([]);
//     const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);
//     const [editExtraDataList, setEditExtraDataList] = useState({});


//     useEffect(() => {
//         const polygons = PoiReducer?.workSiteData.find(data => data._id == currentWorkSite)?.polygon;
//         const firstLocation = polygons?.locations?.[0];
//         console.log(polygons?.locations)
//         if (polygons?.type == "Circle") {
//             const killtime = setTimeout(() => {
//                 drawCircleWorkSite({
//                     lat: Number(firstLocation[0]),
//                     lng: Number(firstLocation[1]),
//                 }, polygons.radius, polygons?.safetyZone)
//                 setWorkSiteMarker({
//                     lat: Number(firstLocation[0]),
//                     lng: Number(firstLocation[1]),
//                 });
//             }, 1000);
//             return () => {
//                 clearTimeout(killtime)
//             }
//         }
//         if (polygons?.type == "Polygon") {
//             setPointsWorkSite(
//                 polygons?.locations?.map(([lat, lng]) => ({
//                     lat: Number(lat),
//                     lng: Number(lng),
//                 })) || []
//             );
//             let sumLat = 0;
//             let sumLng = 0;
//             const count = polygons?.locations.length;
//             polygons?.locations.forEach(([latStr, lngStr]) => {
//                 sumLat += Number(latStr);
//                 sumLng += Number(lngStr);
//             });
//             const centerLat = sumLat / count;
//             const centerLng = sumLng / count;
//             setWorkSiteMarker({
//                 lat: Number(centerLat),
//                 lng: Number(centerLng),
//             });
//         }
//         if (polygons?.type == "Polyline") {
//             setPointsMoreWorkSite(
//                 polygons?.locations?.map(([lat, lng]) => ({
//                     lat: Number(lat),
//                     lng: Number(lng),
//                 })) || []
//             );
//             let sumLat = 0;
//             let sumLng = 0;
//             const count = polygons?.locations.length;
//             polygons?.locations.forEach(([latStr, lngStr]) => {
//                 sumLat += Number(latStr);
//                 sumLng += Number(lngStr);
//             });
//             const centerLat = sumLat / count;
//             const centerLng = sumLng / count;
//             setWorkSiteMarker({
//                 lat: Number(centerLat),
//                 lng: Number(centerLng),
//             });
//         }
//     }, [PoiReducer?.workSiteData])


//     const threatLevelOption = [
//         { label: "No Risk", value: "No Threat" },
//         { label: "Lowest Risk", value: "Lowest" },
//         { label: "Moderate Risk", value: "Moderate" },
//         { label: "High Risk", value: "High" },
//         { label: "Extreme Risk", value: "Extreme" }
//     ]
//     const typesOfAlert = [
//         { label: "Potential hazard", value: "HAZARD" },
//         { label: "Weather condition", value: "WEATHER" },
//         { label: "Communication", value: "COMMUNICATION" },
//         { label: "Security", value: "SECURITY" },
//     ]


//     const [width, setWidth] = useState(window.innerWidth);

//     useEffect(() => {
//         const handleResize = () => setWidth(window.innerWidth);

//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);
//     return (

//         <>
//             {contextHolder}
//             <div className={Style.MainContainer}>
//                 <div>
//                     <div className={Style.SecondaryHeader}>
//                         <h1>View Alert</h1>
//                         <div>
//                         </div>
//                     </div>
//                     <div className={Style.ActionHeader}></div>
//                 </div>
//                 <div className={Style.TableSection}>
//                     <div className={Style.FeildSide}>
//                         <div className={Style.FeildRow}>
//                             <div className={Style.FeildColRight}>
//                                 <label>Title</label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <Input disabled={true} onChange={onChange} value={value} status={errors?.title?.message !== undefined ? 'error' : ''} placeholder='Enter Title' style={{ height: 45, marginTop: 3 }} />
//                                     )}
//                                     name="title"
//                                 />
//                             </div>
//                             <div className={Style.FeildColRight}>
//                                 <label>Threat Level</label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <Select
//                                             getPopupContainer={(triggerNode) => triggerNode.parentElement}
//                                             disabled={true}
//                                             placeholder="Select Threat Level"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.threatLevel?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={threatLevelOption}
//                                         />)}
//                                     name="threatLevel"
//                                 />
//                             </div>
//                         </div>
//                         <div className={Style.FeildRow}>
//                             <div className={Style.FeildColLeft}>
//                                 <label>Type of Alert</label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <Select
//                                             getPopupContainer={(triggerNode) => triggerNode.parentElement}
//                                             disabled={true}
//                                             placeholder="Select Threat Level"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.typeOfAlert?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={typesOfAlert}
//                                         />)}
//                                     name="typeOfAlert"
//                                 />
//                             </div>
//                             <div className={Style.FeildColRight}>
//                                 <label>Linked work order </label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <Select
//                                             getPopupContainer={(triggerNode) => triggerNode.parentElement}
//                                             mode="multiple"
//                                             disabled={true}
//                                             placeholder="Select Linked work order"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.linkedWorkOrder?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={WorkOrderData}
//                                         />)}
//                                     name="linkedWorkOrder"
//                                 />
//                             </div>
//                         </div>

//                         <div className={Style.FeildRow}>
//                             <div className={Style.FeildColLeft}>
//                                 <label>Notification Title <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => {
//                                         return (
//                                             <Input maxLength={70} disabled={true} onChange={onChange} value={value} status={errors?.notificationTitle?.message !== undefined ? 'error' : ''} placeholder='Enter Notification Title' style={{ height: 45, marginTop: 3 }} />
//                                         )
//                                     }}
//                                     name="notificationTitle"
//                                 />
//                             </div>

//                             <div className={Style.FeildColLeft}>
//                                 <label>Add Extra Data <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <div className={Style.AddExtraDataFeild} onClick={showAddExtraDrawer}>
//                                     <div>
//                                         <p>Extra Data<span> ({extraDataList.length})</span></p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className={Style.FeildRow}>

//                             <div className={Style.FeildColRight}>
//                                 <label>Notification Date & Time <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <DatePicker inputReadOnly disabled={true} showTime={{ format: 'hh:mm A', use12Hours: true }} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs.utc(value).local() : null} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45, marginTop: 3 }} />
//                                     )}
//                                     name="notificationTimeAndDate"
//                                 />
//                             </div>
//                             {/* extra Data drawer */}
//                             <Drawer
//                                 title="Add Extra Data"
//                                 placement={'right'}
//                                 onClose={closeAddExtraDrawer}
//                                 open={extraAddData}
//                                 key={'right'}
//                                 maskClosable={false}
//                                 getContainer={document.body}
//                                 afterOpenChange={(visible) => {
//                                     document.body.style.overflow = visible ? "hidden" : "auto";
//                                 }}
//                             >
//                                 {extraDataList?.length > 0 ? extraDataList.map((data, index) => {
//                                     return (
//                                         <div key={index} className={Style.MainListingHourWork} style={{ marginTop: 10 }}>
//                                             <div className={Style.HoursWorkListTop}>
//                                                 <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//                                                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 }}>
//                                                         <label style={{ fontWeight: '500' }}>{data.name}</label>
//                                                     </div>
//                                                     {data?.value?.type == "input" ?
//                                                         <Input disabled={true} contentEditable={false} value={data?.value?.value.toString()} style={{ height: 45, marginTop: 3 }} />
//                                                         : data?.value?.type == "boolean" ?
//                                                             <Switch
//                                                                 checked={data?.value?.value}
//                                                                 style={{ marginLeft: 5, width: 30 }}
//                                                             />
//                                                             : data?.value?.type == "date" ?
//                                                                 <DatePicker inputReadOnly
//                                                                     disabled={true}
//                                                                     value={data?.value?.value}
//                                                                     style={{ height: 45, marginTop: 3 }}
//                                                                     contentEditable={false}
//                                                                 /> : data?.value?.type == "color" ?
//                                                                     <ColorPicker
//                                                                         disabled={true}
//                                                                         format='rgb'
//                                                                         value={data?.value?.value}
//                                                                         showText
//                                                                         style={{ height: 45, marginTop: 3 }}
//                                                                     /> : ""
//                                                     }
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <p style={{ marginBottom: 0, marginTop: 10, fontSize: 14, color: '#898989' }}>{data?.description}</p>
//                                             </div>
//                                         </div>
//                                     );
//                                 }) : ""}
//                             </Drawer>
//                             {/* extra Data drawer */}

//                             {alertDetail?.estimated_time !== "" &&
//                                 <div className={Style.FeildColLeft}>
//                                     <label>Reminder Date & Time</label>
//                                     <Controller
//                                         control={control}
//                                         rules={{
//                                             required: true,
//                                         }}
//                                         render={({ field: { onChange, value } }) => (
//                                             <DatePicker inputReadOnly disabled={true} showTime={{ format: 'hh:mm A', use12Hours: true }} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={alertDetail?.reminder_time == "" ? "" : preNotificationOuter} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45, marginTop: 3 }} />
//                                         )}
//                                         name="reminderTime"
//                                     />
//                                 </div>
//                             }
//                         </div>
//                         <div className={Style.FeildRow} style={{ alignItems: 'flex-start' }}>
//                             <div className={Style.FeildColRight} style={{ width: '100%' }}>
//                                 <label>Notification Body <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => {
//                                         return (
//                                             <Input.TextArea onFocus={() => {
//                                                 document.body.style.overflow = "hidden";
//                                             }}
//                                                 onBlur={() => {
//                                                     document.body.style.overflow = "auto";
//                                                 }} maxLength={150} disabled={true} rows={6} onChange={onChange} value={value} status={errors?.notificationBody?.message !== undefined ? 'error' : ''} placeholder='Enter Notification Body' style={{ marginTop: 3 }} />
//                                         )
//                                     }}
//                                     name="notificationBody"
//                                 />
//                             </div>
//                         </div>
//                         <div className={Style.FeildRow} style={{ alignItems: 'flex-start' }}>
//                             <div className={Style.FeildColRight} style={{ width: '100%' }}>
//                                 <label>Description <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => {
//                                         return (
//                                             <Input.TextArea onFocus={() => {
//                                                 document.body.style.overflow = "hidden";
//                                             }}
//                                                 onBlur={() => {
//                                                     document.body.style.overflow = "auto";
//                                                 }} disabled={true} rows={6} onChange={onChange} value={value} status={errors?.description?.message !== undefined ? 'error' : ''} placeholder='Enter Description' style={{ marginTop: 3 }} />

//                                         )
//                                     }}
//                                     name="description"
//                                 />
//                             </div>
//                         </div>

//                         {/* {alertDetail?.files?.length > 0 ? */}


//                         {allFilesLoading ?
//                             <div style={{ paddingTop: 20 }}>
//                                 <Spin />
//                             </div>
//                             :
//                             <>
//                                 {matchedFiles?.length > 0 ?
//                                     <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start', margin: 0 }}>
//                                         {matchedFiles?.length > 0 ?
//                                             <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
//                                                 <label style={{ marginBottom: 10 }}>Add Photos</label>
//                                                 {matchedFiles.map(data => {
//                                                     return (
//                                                         <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
//                                                             {data?.fileName}
//                                                         </a>
//                                                     )
//                                                 })}
//                                             </div>
//                                             : ""}
//                                     </div>
//                                     : ""}
//                             </>
//                         }
//                         {/* : ""} */}
//                     </div >
//                     <div className={Style.MapSide}>
//                         {isLoaded ? (
//                             <>
//                                 <GoogleMapCreate
//                                     locationCurrent={locationCurrent}
//                                     center={location}
//                                     onMapLoad={onMapLoad}
//                                     points={points}
//                                     pointsMore={pointsMore}
//                                     pointsWorkSite={pointsWorkSite}
//                                     pointsMoreWorkSite={pointsMoreWorkSite}
//                                     offsetPolygon={offsetPolygon}
//                                     selectedTab={selectedTab}
//                                     location={location}
//                                     workSiteMarker={workSiteMarker}
//                                     myLocationMarker={myLocationMarker}
//                                     WorkSiteIcon={WorkSiteIcon}
//                                     circleRef={circleRef}
//                                     padding={padding}
//                                     setPadding={setPadding}
//                                     safetyOffset={safetyOffset}
//                                     safetyOffsetMore={safetyOffsetMore}
//                                     setSafetyOffsetMore={setSafetyOffsetMore}
//                                     drawCircle={drawCircle}
//                                     drawPolyLine={drawPolyLine}
//                                     handleRecenter={handleRecenter}
//                                     getSafetyZonePath={getSafetyZonePath}
//                                     locationToggle={true}
//                                     readMap={true}
//                                 />
//                             </>
//                         ) : (
//                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: "100%" }}>
//                                 <Spin size='default' />
//                             </div>
//                         )}
//                     </div>
//                 </div >
//             </div >
//         </>
//     )
// }

// function mapStateToProps({ PoiReducer, AlertsReducer, WorkOrderReducer }) {
//     return { PoiReducer, AlertsReducer, WorkOrderReducer };
// }
// export default connect(
//     mapStateToProps,
//     { ...AlertAction, ...POIAction, ...WorkOrderAction }
// )(AlertScreenRead);











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
        GetAllWorkOrderFilterLink(currentAlert, "Alert", currentWorkSite)
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
        if (alertDetail?.suggester === UserID) {
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
                                {!alertDetail?.isArchived && (
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
                                                        <p>{alertDetail?.polygon?.radius} m</p>
                                                        <h6>Width Stroke</h6>
                                                    </div>
                                                    <span></span>
                                                </>
                                                : alertDetail?.polygon?.type == "Circle" ?
                                                    <>
                                                        <div>
                                                            <p>{alertDetail?.polygon?.radius} m</p>
                                                            <h6>Radius</h6>
                                                        </div>
                                                        <span></span>
                                                    </>
                                                    : ""}
                                            <div>
                                                <p>{alertDetail?.polygon?.safetyZone} m</p>
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
                                                        <ColorPicker value={data?.value} disabled={false} style={{ marginTop: 8 }} />
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
