// import { useCallback, useEffect, useRef, useState } from 'react'
// import Style from './AssetsReadScreen.module.css'
// import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider, Checkbox } from 'antd'
// import * as AssetsAction from '../../../../store/actions/Assets/index';
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
import { baseUrl } from '../../../../store/config.json';
// import { MdOutlineLocationSearching } from "react-icons/md";
// import { MdOutlineModeEditOutline } from "react-icons/md";
// import WorkSiteIcon from "../../../assets/marker_worksites.png";
// import myLocationMarker from "../../../assets/myLocationMarker.png";
// import GoogleMapCreate from '../../../component/googleMap';
// import { RxAvatar } from "react-icons/rx";
// import { MdOutlineModeEdit } from "react-icons/md";
// import { MdDeleteOutline } from "react-icons/md";
// import utc from 'dayjs/plugin/utc';


// const ProjectScreenRead = ({ GetCompanyUser, WorkOrderReducer, AssetsReducer, PoiReducer, getDepartment, CreateDepartment, GetAllWorkOrderUnLink, getContractorId, deleteContractor, addContractorAC, UpdateContractorAC, GetAssetsByID, GetAllWorkOrderFilterLink }) => {
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
//     const currentAsset = localStorage.getItem("Wl2^gTP7ys&1aN$E5-/9hu==")
//     const currentUser = localStorage.getItem("zP!4vBN#tw69gV+%2/+1/w==")
//     const [selectedContractorIds, setSelectedContractorIds] = useState([]);
//     const [safetyOffsetMore, setSafetyOffsetMore] = useState(0);
//     const [offsetPolygon, setOffsetPolygon] = useState([]);
//     const [padding, setPadding] = useState(0);
//     const [allFiles, setAllFiles] = useState([])
//     const [allFilesLoading, setAllFilesLoading] = useState(false)

//     const { assetDetail } = AssetsReducer

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

//     const fileNameMap = new Map(
//         AssetsReducer?.assetDetail?.files?.map(file => [
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


//     const selectRef = useRef(null);


//     const [photoFiles, setPhotoFiles] = useState([]);
//     const [pdfFiles, setPdfFiles] = useState([]);
//     const [inspectionFiles, setInspectionFiles] = useState([]);


//     console.log(matchedFiles)

//     useEffect(() => {
//         const files = Array.isArray(matchedFiles) ? matchedFiles : [];

//         const photos = [];
//         const pdfs = [];
//         const inspections = [];

//         files.forEach(file => {
//             const fileName = file?.fileName?.toLowerCase() || "";

//             if (fileName.includes("wsinspection")) {
//                 inspections.push(file);
//                 return;
//             }

//             if (/\.(jpg|jpeg|png)$/i.test(fileName)) {
//                 photos.push(file);
//                 return;
//             }

//             if (/\.pdf$/i.test(fileName)) {
//                 pdfs.push(file);
//             }
//         });

//         setPhotoFiles(photos);
//         setPdfFiles(pdfs);
//         setInspectionFiles(inspections);
//     }, [assetDetail?.files]);



//     const { workOrderLinkData } = PoiReducer


//     const preNotificationOuter = assetDetail?.reminder_time
//         ? dayjs(assetDetail.reminder_time).local()
//         : null;
//     const notificationTimeOuter = assetDetail?.estimated_time
//         ? dayjs(assetDetail.estimated_time).local()
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
//         const preNotification = assetDetail?.reminder_time
//             ? dayjs(assetDetail.reminder_time).local()
//             : null;

//         const notificationTime = assetDetail?.estimated_time
//             ? dayjs(assetDetail.estimated_time).local()
//             : null;
//         const diffInMinutes = notificationTime?.diff(preNotification, 'minute');
//         setParentRadius(assetDetail?.polygon?.radius)
//         setSafetyOffset(assetDetail?.polygon?.safetyZone)
//         setSelectedContractorIds(assetDetail?.contractorContact ?? [])
//         reset(
//             {
//                 assetType: assetDetail?.assetType?.name,
//                 department: assetDetail?.department?.name,
//                 elevationlevel: assetDetail?.elevationLevels,
//                 linkedWorkOrder: workOrderIDs,
//                 model: assetDetail?.model?.name,
//                 date: assetDetail?.year,
//                 ...(assetDetail?.reminder_time && {
//                     preNotificationTimeAndDate: diffInMinutes == 0 ? "" : diffInMinutes,
//                 }),
//                 ...(assetDetail?.estimated_time && {
//                     notificationTimeAndDate: dayjs(assetDetail.estimated_time).local(),
//                 }),
//             }
//         )
//         const firstLocation = assetDetail?.polygon?.locations?.[0];

//         const transformedArray = assetDetail?.extraFields?.map(item => {
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
//         if (assetDetail?.files?.length > 0 && allFiles?.length <= 0) {
//             const filesWithPath = assetDetail?.files.map(file =>
//                 new URL(file.url).pathname.replace(/^\/+/, '')
//             );
//             workOrderGetDoc(filesWithPath);
//         }
//         if (assetDetail?.polygon?.type == "Circle") {
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
//                 }, assetDetail?.polygon?.radius, assetDetail?.polygon?.safetyZone)
//                 drawWithRadiusBounds(firstLocation, assetDetail?.polygon?.radius)

//             }, 1000);
//             return () => {
//                 clearTimeout(killtime2)
//                 clearTimeout(killtime)
//             }
//         }
//         else if (assetDetail?.polygon?.type === "Polygon") {
//             setSelectedTab(2)
//             setPoints(
//                 assetDetail?.polygon?.locations?.map(([lat, lng]) => ({
//                     lat: Number(lat),
//                     lng: Number(lng),
//                 })) || []
//             );
//             setPadding(assetDetail?.polygon?.safetyZone)
//             drawPolyLinePolyGoneBond(assetDetail?.polygon?.locations)
//         }
//         else if (assetDetail?.polygon?.type === "Polyline") {
//             setSelectedTab(3)
//             setPointsMore(
//                 assetDetail?.polygon?.locations?.map(([lat, lng]) => ({
//                     lat: Number(lat),
//                     lng: Number(lng),
//                 })) || []
//             );
//             setSafetyOffsetMore(assetDetail?.polygon?.safetyZone)
//             drawPolyLinePolyGoneBond(assetDetail?.polygon?.locations)
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
//     }, [assetDetail, workOrderLinkData])







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
//         getDepartment(currentWorkSite)
//         GetAllWorkOrderUnLink(currentWorkSite)
//         GetAssetsByID(currentAsset)
//         GetAllWorkOrderFilterLink(currentAsset, "Asset", currentWorkSite)
//     }, [])

//     useEffect(() => {
//         if (AssetsReducer?.createDepartmentComplete) {
//             getDepartment(currentWorkSite)
//             setGetSearch("")
//         }
//     }, [AssetsReducer?.createDepartmentComplete])

//     const DeleteContractor = (_ID) => {
//         deleteContractor(_ID)
//     }

//     const depatmentData = AssetsReducer?.departmentData?.map(data => {
//         return { value: data._id, label: data?.name }
//     })




//     // Model
//     const modelExist = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}")?.model
//     const [newModel, setNewModel] = useState(modelExist ? [{ value: modelExist, label: modelExist }] : []);
//     const modelData = AssetsReducer?.modelData?.map(data => ({
//         value: data.name,
//         label: data.name,
//     }));
//     const CreateModelEx = async () => {
//         const trimmedSearch = getSeachModel?.trim();
//         if (!trimmedSearch) return;
//         setNewModel(prev => [
//             ...prev,
//             { value: trimmedSearch, label: trimmedSearch },
//         ]);
//         setValue("model", trimmedSearch, {
//             shouldValidate: true,
//             shouldDirty: true,
//         })
//     };



//     // Asset Type
//     const assetTypeExist = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}")?.assetType
//     const [newAssetType, setNewAssetType] = useState(assetTypeExist ? [{ value: assetTypeExist, label: assetTypeExist }] : []);
//     const assetTypeData = AssetsReducer?.assetTypeData?.map(data => ({
//         value: data.name,
//         label: data.name,
//     }));
//     const CreatesetNewAssetTypeEx = async () => {
//         const trimmedSearch = getSeachAssetType?.trim();
//         if (!trimmedSearch) return;
//         setNewAssetType(prev => [
//             ...prev,
//             { value: trimmedSearch, label: trimmedSearch },
//         ]);
//         setValue("assetType", trimmedSearch, {
//             shouldValidate: true,
//             shouldDirty: true,
//         })
//     };

//     const CreateDepartmentEx = async () => {
//         CreateDepartment({
//             name: getSeach,
//             worksiteId: currentWorkSite
//         })
//     }

//     useEffect(() => {
//         if (!messageApi) return;
//         if (AssetsReducer.networkError) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "error",
//                 content: "Something went wrong, please try again",
//             });
//         }
//     }, [
//         AssetsReducer.networkError,
//         messageApi,
//     ]);























































//     const [isDraft, setIsDraft] = useState(false);
//     const schema = yup.object().shape({
//         assetType: yup.string().required(),
//         department: yup.string().required(),
//         elevationlevel: yup.array().required(),
//         linkedWorkOrder: yup.array().notRequired(),
//         model: yup.string().notRequired(),
//         date: yup.string().required(),
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
//             assetType: "",
//             department: "",
//             elevationlevel: [],
//             linkedWorkOrder: [],
//             model: "",
//             date: "",
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
//         mapRef.current.addListener("click", (e) => {
//             const newCenter = {
//                 lat: e.latLng.lat(),
//                 lng: e.latLng.lng()
//             };
//             setActualCenter(newCenter);
//             if (circleRef.current) {
//                 circleRef.current.setCenter(newCenter);
//             }
//             if (childCircleRef.current) {
//                 childCircleRef.current.setCenter(newCenter);
//             }
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





//     // Contractor Data
//     const [addContractor, setAddContractor] = useState(false);
//     const [viewContractor, setViewContractor] = useState(false);
//     const [contractorData, setContractorData] = useState({});
//     const [isContractorNow, setIsContractorNow] = useState('')



//     const UpdateContractorDrawer = (StateHe, format) => {
//         setIsContractorNow(StateHe)
//         setContractorData(format)
//     };

//     const closeAddContractorDrawer = () => {
//         setAddContractor(false);
//     };

//     const addViewContractorDrawer = () => {
//         setViewContractor(true);
//     };
//     const closeViewContractorDrawer = () => {
//         setViewContractor(false);
//     };

//     const handleAddContractor = () => {
//         const {
//             name,
//             address,
//             zipCode,
//             country,
//             email,
//             state,
//             phone,
//             orderPurchaseNumber,
//         } = contractorData || {};

//         const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,100}$/i;
//         if (!name || !address || !zipCode || !country || !email || !state || !phone || !orderPurchaseNumber) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "error",
//                 content: "All fields are required.",
//             });
//             return false;
//         }

//         else if (!emailRegex.test(email)) {
//             messageApi.destroy();
//             messageApi.open({
//                 type: "error",
//                 content: "Invalid email format.",
//             });
//             return false;
//         }
//         else {
//             if (isContractorNow == "Update") {
//                 UpdateContractorAC({ ...contractorData, contractorId: contractorData?._id })
//             }
//             else {
//                 addContractorAC(contractorData)
//             }
//         }
//     };
//     // Contractor Data






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











//     // worksite
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


//     const [width, setWidth] = useState(window.innerWidth);

//     useEffect(() => {
//         const handleResize = () => setWidth(window.innerWidth);

//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []); return (

//         <>
//             {contextHolder}
//             <div className={Style.MainContainer}>
//                 <div>
//                     <div className={Style.SecondaryHeader}>
//                         <h1>View Asset</h1>
//                         <div>
//                         </div>
//                     </div>
//                     <div className={Style.ActionHeader}></div>
//                 </div>
//                 <div className={Style.TableSection}>
//                     <div className={Style.FeildSide}>
//                         <div className={Style.FeildRow}>
//                             <div className={Style.FeildColRight}>
//                                 <label>Asset Type</label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <Select
//                                             getPopupContainer={(triggerNode) => triggerNode.parentElement}
//                                             showSearch={true}
//                                             loading={AssetsReducer?.assetTypeLoading}
//                                             disabled={true}
//                                             placeholder="Select Asset"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.assetType?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={[...assetTypeData]}
//                                             filterOption={(input, option) =>
//                                                 (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                                             }
//                                         />
//                                     )}
//                                     name="assetType"
//                                 />
//                             </div>
//                             <div className={Style.FeildColRight}>
//                                 <label>Department</label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <Select
//                                             getPopupContainer={(triggerNode) => triggerNode.parentElement}
//                                             ref={selectRef}
//                                             showSearch={true}
//                                             loading={AssetsReducer?.departmentLoading}
//                                             disabled={true}
//                                             placeholder="Select Department"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.department?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={[...depatmentData]}
//                                         />
//                                     )}
//                                     name="department"
//                                 />
//                             </div>
//                         </div>
//                         <div className={Style.FeildRow}>
//                             <div className={Style.FeildColLeft}>
//                                 <label>Elevation Level</label>
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
//                                             placeholder="Select Elevation Level"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.elevationlevel?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={elevationLevelOption}
//                                         />)}
//                                     name="elevationlevel"
//                                 />
//                             </div>
//                             <div className={Style.FeildColRight}>
//                                 <label>Linked work order <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => {
//                                         return (
//                                             <Select
//                                                 getPopupContainer={(triggerNode) => triggerNode.parentElement}
//                                                 mode="multiple"
//                                                 loading={PoiReducer?.workOrderLoading}
//                                                 disabled={true}
//                                                 placeholder="Select Linked work order"
//                                                 onChange={onChange}
//                                                 value={value == "" ? null : value}
//                                                 filterOption={(input, option) =>
//                                                     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                                                 }
//                                                 status={errors?.linkedWorkOrder?.message !== undefined ? 'error' : ''}
//                                                 style={{ marginTop: 3, width: "100%", height: 45 }}
//                                                 options={WorkOrderData}
//                                             />)
//                                     }}
//                                     name="linkedWorkOrder"
//                                 />
//                             </div>
//                         </div>
//                         <div className={Style.FeildRow}>
//                             <div className={Style.FeildColLeft}>
//                                 <label>Model <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <Select
//                                             getPopupContainer={(triggerNode) => triggerNode.parentElement}
//                                             showSearch={true}
//                                             loading={AssetsReducer?.modelLoading}
//                                             disabled={true}
//                                             placeholder="Select Model"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.model?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={[...modelData]}
//                                         />
//                                     )}
//                                     name="model"
//                                 />
//                             </div>
//                             <div className={Style.FeildColRight}>
//                                 <label>Date</label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <>
//                                             <DatePicker inputReadOnly disabled={true} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs.utc(value).local() : null} status={errors?.date?.message !== undefined ? 'error' : ''} placeholder='Select Date' style={{ height: 45 }} />
//                                         </>
//                                     )}
//                                     name="date"
//                                 />
//                             </div>
//                         </div>
//                         <div className={Style.FeildRow}>
//                             <div className={Style.FeildColLeft}>
//                                 <label>Add Extra Data <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <div className={Style.AddExtraDataFeild} onClick={showAddExtraDrawer}>
//                                     <div>
//                                         <p>Extra Data<span> ({extraDataList.length})</span></p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className={Style.FeildColRight}>
//                                 <label>Notification Date & Time <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <>
//                                             <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={true} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs.utc(value).local() : null} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45 }} />
//                                         </>
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
//                                 }) : <Empty description="No extra data found" />}
//                             </Drawer>
//                             {/* extra Data drawer */}
//                         </div>
//                         <div className={Style.FeildRow} style={{ alignItems: 'flex-start' }}>
//                             {assetDetail?.estimated_time !== "" &&
//                                 <div className={Style.FeildColLeft}>
//                                     <label>Reminder Date & Time </label>
//                                     <Controller
//                                         control={control}
//                                         rules={{
//                                             required: true,
//                                         }}
//                                         render={({ field: { onChange, value } }) => (
//                                             <DatePicker inputReadOnly disabled={true} showTime={{ format: 'hh:mm A', use12Hours: true }} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={assetDetail?.reminder_time == "" ? "" : preNotificationOuter} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45, marginTop: 3 }} />
//                                         )}
//                                         name="reminderTime"
//                                     />
//                                 </div>
//                             }
//                         </div>
//                         {assetDetail?.files?.length > 0 ?
//                             <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start', margin: 0 }}>
//                                 {photoFiles?.length > 0 ?
//                                     <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
//                                         <label style={{ marginBottom: 10 }}>Add Photos</label>
//                                         {photoFiles.map(data => {
//                                             return (
//                                                 <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
//                                                     {data?.fileName}
//                                                 </a>
//                                             )
//                                         })}
//                                     </div>
//                                     : ""}

//                                 {pdfFiles?.length > 0 ?
//                                     <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
//                                         <label style={{ marginBottom: 10 }}>Upload Document</label>
//                                         {pdfFiles.map(data => {
//                                             return (
//                                                 <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
//                                                     {data?.fileName}
//                                                 </a>
//                                             )
//                                         })}
//                                     </div>
//                                     : ""}

//                                 {inspectionFiles?.length > 0 ?
//                                     <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
//                                         <label style={{ marginBottom: 10 }}>Inspection Document</label>
//                                         {inspectionFiles.map(data => {
//                                             return (
//                                                 <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
//                                                     {data?.fileName}
//                                                 </a>
//                                             )
//                                         })}
//                                     </div>
//                                     : ""}

//                             </div>
//                             : ""}
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

// function mapStateToProps({ PoiReducer, AssetsReducer, WorkOrderReducer }) {
//     return { PoiReducer, AssetsReducer, WorkOrderReducer };
// }
// export default connect(
//     mapStateToProps,
//     { ...AssetsAction, ...POIAction, ...WorkOrderAction }
// )(ProjectScreenRead);





















import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './AssetsReadScreen.module.css'
import { Image, Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Space, ConfigProvider, Modal, Skeleton } from 'antd'
import * as AssetsAction from '../../../../store/actions/Assets/index';
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
import { TASK_CLEAR_EXPIRED, TASK_GET_POI_ARCHIVED_COMPLETE, TASK_GET_POI_COMPLETE, TASK_LOAD_ARCHIVED_COMPLETE, TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, TASK_LOAD_MY_WORK_ORDER_COMPLETE } from '../../../../store/actions/types';
import linkBlue from '../../../assets/link-blue.png'






const ProjectScreenRead = ({ ArchiveAssets, GetCompanyUser, WorkOrderReducer, AssetsReducer, PoiReducer, getDepartment, CreateDepartment, GetAllWorkOrderUnLink, getContractorId, deleteContractor, addContractorAC, UpdateContractorAC, GetAssetsByID, GetAllWorkOrderFilterLink }) => {
    const currentAsset = localStorage.getItem('Wl2^gTP7ys&1aN$E5-/9hu==')
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

    const { assetDetail } = AssetsReducer

    const [allFiles, setAllFiles] = useState([])
    const [allFilesLoading, setAllFilesLoading] = useState(false)


    const WorkPOIGetByIdDoc = async (body) => {
        setAllFilesLoading(true)
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
                body: JSON.stringify({ keys: body }),
                signal: controller.signal,
            };
            const response = await fetch(`${baseUrl}${url}`, options);
            const res = await response.json();
            if (response.status === 200 || response.status === 201) {
                setAllFilesLoading(false)
                setAllFiles(res?.urls)
                return res || 0
            }
            setAllFilesLoading(false)
        } catch (error) {
            setAllFilesLoading(false)
            if (error.name === "AbortError") console.error("Request timed out");
        } finally {
            clearTimeout(timeout);
        }
    };



    useEffect(() => {
        getDepartment(currentWorkSite)
        GetAllWorkOrderUnLink(currentWorkSite)
        GetAssetsByID(currentAsset)
        GetAllWorkOrderFilterLink(currentAsset, "Asset", currentWorkSite)
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
        if (AssetsReducer.AssetsDeleteLoading) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Loading...",
            });
        }
        if (AssetsReducer.AssetsDelete) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Asset archived successfully",
            });
            dispatch({ type: TASK_GET_POI_ARCHIVED_COMPLETE, loading: true, payload: [] });
            dispatch({ type: TASK_GET_POI_COMPLETE, loading: true, payload: [] });
            navigate('/assets/my-assets')
        }
        if (AssetsReducer.poiExpiredError) {
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
    }, [
        AssetsReducer.networkError,
        AssetsReducer.poiExpiredError,
        AssetsReducer.AssetsDeleteLoading,
        AssetsReducer.AssetsDelete,
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
        setPersonanalDataList(assetDetail?.add_hours_worked ? JSON.parse(assetDetail?.add_hours_worked) : [])
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
        const position = getMarkerPosition(assetDetail?.polygon?.locations);
        if (assetDetail?.files?.length > 0 && allFiles?.length <= 0) {
            const filesWithPath = assetDetail?.files.map(file =>
                new URL(file.url).pathname.replace(/^\/+/, '')
            );
            WorkPOIGetByIdDoc(filesWithPath);
        }

        if (assetDetail?.polygon?.type == "Circle") {
            setSelectShape(2);
            setCircleRadius(Number(assetDetail?.polygon?.radius.toFixed()))
            setCircleSafety(Number(assetDetail?.polygon?.safetyZone.toFixed()))
            setCircleElevation(Number(assetDetail?.polygon?.altitude.toFixed()))
            setTimeout(() => {
                childRefParent.current?.drawCircle();
                circleRef.current?.setCenter(position);
                childCircleRef.current?.setCenter(position);
                drawWithRadiusBounds(position, Number(assetDetail?.polygon?.radius.toFixed()))
                setMapLoader(false)
            }, 2000);
        }
        else if (assetDetail?.polygon?.type === "Polygon") {
            setSelectShape(3)
            const killtime = setTimeout(() => {
                setCustomAreaSafety(Number(assetDetail?.polygon?.safetyZone.toFixed()))
                setCustomAreaElevation(Number(assetDetail?.polygon?.altitude.toFixed()))
                drawPolyLinePolyGoneBond(assetDetail?.polygon?.locations)
                setPolygonPoint(
                    assetDetail?.polygon?.locations?.map(([lat, lng]) => ({
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
        else if (assetDetail?.polygon?.type === "Polyline") {
            setSelectShape(1)
            const killtime = setTimeout(() => {
                setPolylineWidth(Number(assetDetail?.polygon?.radius.toFixed()))
                setPolylineSafety(Number(assetDetail?.polygon?.safetyZone.toFixed()))
                setPolylineElevation(Number(assetDetail?.polygon?.altitude.toFixed()))
                drawPolyLinePolyGoneBond(assetDetail?.polygon?.locations)
                setPointsPolyLine(
                    assetDetail?.polygon?.locations?.map(([lat, lng]) => ({
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
    }, [assetDetail])
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
        window.location.href = `/assets/create?editId=${eId}`;
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
        if (assetDetail?.isArchived) return [];
        if (assetDetail?.suggester === UserID) {
            return [
                {
                    key: "archive",
                    label: "Archive asset",
                    icon: <RiDeleteBin7Line size={18} color="red" />,
                    onClick: () => setDeleteExtra(true),
                },
                {
                    key: "edit",
                    label: "Edit asset",
                    icon: <img src={editIcon} style={{ height: 18 }} />,
                    onClick: () => editWorkOrder(assetDetail?._id),
                },
            ];
        }
        return [];
    };


    const fileNameMap = new Map(
        assetDetail?.files?.map(file => [
            file.fileName,
            file, // contains size, mimeType, etc.
        ]) || []
    );

    const matchedFiles =
        allFiles?.map(item => {
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
        file => ['png', 'jpg', 'jpeg'].includes(
            getExtensionFromUrl(file.url)
        )
    );

    const preNotification = assetDetail?.reminder_time
        ? dayjs(assetDetail.reminder_time).local()
        : null;

    const notificationTime = assetDetail?.estimated_time
        ? dayjs(assetDetail.estimated_time).local()
        : null;
    const diffInMinutes = notificationTime?.diff(preNotification, 'minute');

    const notificationTimeFy = assetDetail?.estimated_time
        ? dayjs(assetDetail.estimated_time).local().format("D-M-YY, hh:mm A")
        : null;


    const shouldShowNotification =
        assetDetail?.notification_title ||
        assetDetail?.notification_description ||
        notificationTimeFy ||
        diffInMinutes;


    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <div className={Style.Allpath}>
                            <h6>Asset</h6>
                            <img src={rightIcon} />
                            <h6 className={Style.activePage}>Asset Detail</h6>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3>Asset Detail</h3>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {!assetDetail?.isArchived && (
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
                            {POIGetByIDDataLoading ?
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", width: '100%' }}>
                                    <Spin />
                                </div>
                                :
                                <div className={Style.FloatingFilter}>
                                    <div className={Style.basicInfoSec}>
                                        <h4>{assetDetail?.assetType?.name}</h4>

                                        <div className={Style.MapInfoAll}>
                                            <div>
                                                <p>{assetDetail?.department?.name}</p>
                                                <h6>Department</h6>
                                            </div>
                                            <span></span>
                                            <div>
                                                <p>{assetDetail?.model?.name}</p>
                                                <h6>Model</h6>
                                            </div>
                                            <span></span>
                                            <div>
                                                <p>{assetDetail?.polygon?.altitude}</p>
                                                <h6>Location</h6>
                                            </div>
                                        </div>


                                        <div style={{ paddingBottom: assetDetail?.elevationLevels?.length > 0 ? 10 : 0 }} className={Style.NewLayerWorkOrder}>
                                            {assetDetail?.elevationLevels?.map(item => (
                                                <div key={item} className={Style.InContent}>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>


                                        {assetDetail?.polygon?.type == "Circle" ?
                                            <div className={Style.mapInfoTag}>
                                                <img src={circleBlue} /> <p>{assetDetail?.polygon?.type}</p>
                                            </div>
                                            :
                                            assetDetail?.polygon?.type == "Polygon" ?
                                                <div className={Style.mapInfoTag}>
                                                    <img src={customAreaBlue} /> <p>{"Custom Area"}</p>
                                                </div>
                                                :
                                                assetDetail?.polygon?.type == "Polyline" ?
                                                    <div className={Style.mapInfoTag}>
                                                        <img src={polylineBlue} /> <p>{assetDetail?.polygon?.type}</p>
                                                    </div>
                                                    : ""
                                        }

                                        <div className={Style.MapInfoAll}>
                                            {assetDetail?.polygon?.type == "Polyline" ?
                                                <>
                                                    <div>
                                                        <p>{assetDetail?.polygon?.radius} m</p>
                                                        <h6>Width Stroke</h6>
                                                    </div>
                                                    <span></span>
                                                </>
                                                : assetDetail?.polygon?.type == "Circle" ?
                                                    <>
                                                        <div>
                                                            <p>{assetDetail?.polygon?.radius} m</p>
                                                            <h6>Radius</h6>
                                                        </div>
                                                        <span></span>
                                                    </>
                                                    : ""}
                                            <div>
                                                <p>{assetDetail?.polygon?.safetyZone} m</p>
                                                <h6>Safety Zone</h6>
                                            </div>
                                            <span></span>
                                            <div>
                                                <p>{assetDetail?.polygon?.altitude} m</p>
                                                <h6>Elevation</h6>
                                            </div>
                                        </div>

                                        <div className={Style.MapInfoAll}>
                                            <h6 style={{ marginTop: 6, color: 'var(--gray-100)' }}>{assetDetail?.description}</h6>
                                        </div>
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
                                                        <p>Extra data <span>({assetDetail?.extraFields?.length ?? 0})</span></p>
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
                                                    {assetDetail?.notification_title &&
                                                        <p>{assetDetail?.notification_title}</p>
                                                    }
                                                    {assetDetail?.notification_description &&
                                                        <h6>{assetDetail?.notification_description}</h6>
                                                    }
                                                </div>
                                                <div className={Style.NofificationTime}>
                                                    <div className={Style.fullTime}>
                                                        <img src={blueCalender} />
                                                        <p>{notificationTimeFy}</p>
                                                    </div>
                                                    <div className={Style.prefullTime}>
                                                        <img src={blueClock} />
                                                        <p>{diffInMinutes} minutes</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ border: '0px solid transparent' }} className={Style.secondSec}>
                                        {allFilesLoading ?
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
                                loadingTitle={"Loading Asset."}
                                loadingPara={"Loading your Asset. Please wait a moment."}
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
                        {assetDetail?.extraFields?.length > 0 ? assetDetail?.extraFields?.map((data, index) => {
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
                                <p style={{ fontSize: 14, fontWeight: 400, color: "#51595A", marginTop: 8 }}>You haven’t added any extra details to this Asset yet.</p>
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
                            <button disabled={AssetsReducer.AssetsDeleteLoading} onClick={() => setDeleteExtra(false)} className={AssetsReducer.AssetsDeleteLoading ? Style.editPersonalModalFooterCancelD : Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button disabled={AssetsReducer.AssetsDeleteLoading} onClick={() => { ArchiveAssets(currentAsset) }} className={AssetsReducer.AssetsDeleteLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>Archive Asset</button>

                        </div>
                    </>}
                >
                    <>
                        <h4 className={Style.AreYouSure}>Archive this Asset?</h4>
                        <p className={Style.AreYouSurePara}>This asset will be permanently removed from your active list and moved to your archive.</p>
                    </>
                </Modal>
                {/* confirm delete */}

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
)(ProjectScreenRead);


