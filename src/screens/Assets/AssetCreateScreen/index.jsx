// import { useCallback, useEffect, useRef, useState } from 'react'
// import Style from './AssetsCreateScreen.module.css'
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
// import { AWSUploadModule } from '../../../component/AWSUploadModule';


// const ProjectScreenCreate = ({ GetCompanyUser, WorkOrderReducer, AssetsReducer, PoiReducer, getDepartment, getModel, getAssetType, CreateDepartment, GetAllWorkOrderUnLink, getContractor, addContractorAC, UpdateContractorAC }) => {
//     dayjs.extend(customParseFormat);
//     dayjs.extend(utc);
//     const dateFormat2 = 'YYYY-MM-DD';
//     const now = new Date(Date.now());
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     const formattedDate = `${year}-${month}-${day}`;
//     const [messageApi, contextHolder] = message.useMessage();
//     const [getSeachDepartment, setGetSearchDepartment] = useState('')
//     const [getSeachModel, setGetSearchModel] = useState('')
//     const [getSeachAssetType, setGetSearchAssetType] = useState('')
//     const navigate = useNavigate();
//     const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")

//     const [localDraftData, setLocalDraftData] = useState();
//     useEffect(() => {
//         const savedForms1 = JSON.parse(localStorage.getItem('#qz+M8t^d@LACY9PkE1X7vr')) || [];
//         if (savedForms1 && typeof savedForms1 === 'object') {
//             setLocalDraftData({ ...savedForms1 });
//         }
//     }, []);
//     const selectRef = useRef(null);


//     useEffect(() => {
//         const polyGonParse = JSON.parse(localDraftData?.polygon || null)
//         const firstLocation = polyGonParse?.locations?.[0];
//         if (
//             Array.isArray(firstLocation) &&
//             firstLocation.length >= 2 &&
//             !isNaN(firstLocation[0]) &&
//             !isNaN(firstLocation[1])
//         ) {
//             setLocation({
//                 lat: Number(firstLocation[0]),
//                 lng: Number(firstLocation[1]),
//             });
//         }
//         setParentRadius(polyGonParse?.radius ? polyGonParse?.radius : 100)
//         setSafetyOffset(polyGonParse?.safetyZone ? polyGonParse?.safetyZone : 0)
//         if (polyGonParse?.type == "Circle") {
//             const killtime = setTimeout(() => {
//                 setSelectedTab(1)
//                 drawCircleForSee({
//                     lat: Number(firstLocation[0]),
//                     lng: Number(firstLocation[1]),
//                 }, polyGonParse?.radius, polyGonParse?.safetyZone)
//             }, 2000);
//             return () => {
//                 clearTimeout(killtime)
//             }
//         }
//         else if (polyGonParse?.type === "Polygon") {
//             setSelectedTab(2)
//             setPoints(
//                 polyGonParse?.locations?.map(([lat, lng]) => ({
//                     lat: Number(lat),
//                     lng: Number(lng),
//                 })) || []
//             );
//             setPadding(polyGonParse?.safetyZone)
//         }
//         else if (polyGonParse?.type === "Polyline") {
//             setSelectedTab(3)
//             setPointsMore(
//                 polyGonParse?.locations?.map(([lat, lng]) => ({
//                     lat: Number(lat),
//                     lng: Number(lng),
//                 })) || []
//             );
//             setSafetyOffsetMore(polyGonParse?.safetyZone)
//         }
//         return () => {
//             setPoints([]);
//             setLocation(null);
//             setPointsMore([]);
//             setSafetyOffset();
//             setParentRadius();
//         }
//     }, [localDraftData])


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
//             draggable: true,
//             editable: true,
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
//             clickable: false,
//         });
//         parent.addListener('center_changed', () => {
//             const newCenter = parent.getCenter();
//             child.setCenter(newCenter);
//             const newCenterString = {
//                 lat: newCenter.lat(),
//                 lng: newCenter.lng()
//             };
//             setActualCenter(newCenterString);
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




































//     useEffect(() => {
//         getDepartment(currentWorkSite)
//         getModel()
//         getAssetType()

//         GetAllWorkOrderUnLink(currentWorkSite)
//         getContractor(currentWorkSite)
//         GetCompanyUser()
//     }, [])

//     useEffect(() => {
//         if (AssetsReducer?.createDepartmentComplete) {
//             getDepartment(currentWorkSite)
//             setGetSearch("")
//         }
//     }, [AssetsReducer?.createDepartmentComplete])
//     const localData = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}");

//     const schema = yup.object().shape({
//         assetType: yup.string().required(),
//         department: yup.string().required(),
//         elevationlevel: yup.array().min(1),
//         linkedWorkOrder: yup.array().notRequired(),
//         model: yup.string().required().min(1),
//         date: yup.string().required(),
//         preNotificationTimeAndDate: yup.string().notRequired(),
//         notificationTimeAndDate: yup.string().notRequired(),
//     });

//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         watch,
//         setValue
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
//             ...localData,
//         },
//     });


//     // department


//     const departExist = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}")?.department
//     const [newDepartment, setNewDepartment] = useState(departExist ? [{ value: departExist, label: departExist }] : []);
//     const depatmentData = AssetsReducer?.departmentData?.map(data => ({
//         value: data.name,
//         label: data.name,
//     }));
//     const CreateDepartmentEx = async () => {
//         const trimmedSearch = getSeachDepartment?.trim();
//         if (!trimmedSearch) return;
//         setNewDepartment(prev => [
//             ...prev,
//             { value: trimmedSearch, label: trimmedSearch },
//         ]);
//         setValue("department", trimmedSearch, {
//             shouldValidate: true,
//             shouldDirty: true,
//         })
//         selectRef.current.blur()
//     };


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






















































//     useEffect(() => {
//         const subscription = watch((value) => {
//             const savedForms = JSON.parse(localStorage.getItem('tMk+@!v2YCXzqLd79#PrA8E')) || [];
//             const ParseDataBefore = { ...savedForms, ...value }
//             localStorage.setItem("tMk+@!v2YCXzqLd79#PrA8E", JSON.stringify(ParseDataBefore));
//         });
//         return () => subscription.unsubscribe();
//     }, [watch]);


//     // const getCurrentDate = () => {
//     //     const now = new Date();
//     //     const year = now.getFullYear();
//     //     const month = String(now.getMonth() + 1).padStart(2, '0');
//     //     const day = String(now.getDate()).padStart(2, '0');
//     //     return `${year}/${month}/${day}`;
//     // };

//     const WorkOrderData = PoiReducer?.workOrderUnData?.map(data => {
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
//             draggable: true,
//             editable: true,
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
//             const newCenterString = {
//                 lat: newCenter.lat(),
//                 lng: newCenter.lng()
//             };
//             setActualCenter(newCenterString);
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
//     const [padding, setPadding] = useState(0);
//     const getSafetyZonePath = () => {
//         // if (points.length < 3) return [];
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
//         // if (points.length < 3) {
//         const newPoint = {
//             lat: e.latLng.lat(),
//             lng: e.latLng.lng(),
//         };
//         setPoints((prev) => [...prev, newPoint]);
//         // }
//     }, [points]);

//     const removeIconCustomArea = (indexRemover) => {
//         setPoints(prev => prev?.filter((_, index) => index !== indexRemover));
//     }
//     const drawCustomArea = () => {
//         setSelectedTab(2)
//         setPointsMore([])
//         circleRef.current.setMap(null);
//         circleRef.current = null;
//         childCircleRef.current.setMap(null);
//         childCircleRef.current = null;
//     }
//     // polygon 











//     // PolyLine
//     const [safetyOffsetMore, setSafetyOffsetMore] = useState(0);
//     const [offsetPolygon, setOffsetPolygon] = useState([]);
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
//     function computeOffsetPolyline(points, offsetDistance) {
//         const offsetLeftPoints = [];
//         const offsetRightPoints = [];

//         for (let i = 0; i < points.length - 1; i++) {
//             const p1 = points[i];
//             const p2 = points[i + 1];
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

//     const removeIconCustomArea2 = (indexRemover) => {
//         setPointsMore(prev => {
//             const updated = prev.filter((_, index) => index !== indexRemover);
//             if (updated.length < 2) {
//                 setOffsetPolygon([]);
//             }
//             return updated;
//         });
//     };
//     // PolyLine








//     // Drawer Extra Data
//     const [extraListData, setExtraListData] = useState(false);
//     const [extraAddData, setExtraAddData] = useState(false);
//     const [selectedInput, setSelectedInput] = useState("input");
//     const [selectedInputEdit, setSelectedInputEdit] = useState("");
//     const [editExtraDataList, setEditExtraDataList] = useState({});

//     const showExtraDrawer = () => {
//         setExtraListData(true);
//     };
//     const closeExtraDrawer = () => {
//         setExtraListData(false);
//     };
//     const showAddExtraDrawer = () => {
//         setExtraAddData(true);
//     };
//     const closeAddExtraDrawer = () => {
//         setExtraAddData(false);
//     };
//     const [extraDataState, setExtraDataState] = useState({
//         name: '',
//         description: null,
//         value: { type: '', value: '' }
//     });
//     const items = [
//         {
//             label: (
//                 <div onClick={() => {
//                     setSelectedInput("input")
//                     setExtraDataState(prev => ({
//                         ...prev,
//                         value: { type: '', value: '' }
//                     }));
//                 }}>
//                     Input
//                 </div>
//             ),
//             key: '0',
//         },
//         {
//             label: (
//                 <div onClick={() => {
//                     setSelectedInput("boolean")
//                     setExtraDataState(prev => ({
//                         ...prev,
//                         value: { type: 'boolean', value: true }
//                     }));
//                 }} >
//                     Boolean
//                 </div>
//             ),
//             key: '1',
//         },
//         {
//             label: (
//                 <div onClick={() => {
//                     setSelectedInput("date")
//                     setExtraDataState(prev => ({
//                         ...prev,
//                         value: { type: '', value: '' }
//                     }));
//                 }}>
//                     Date
//                 </div>
//             ),
//             key: '2',
//         },
//         {
//             label: (
//                 <div onClick={() => {
//                     setSelectedInput("color")
//                     setExtraDataState(prev => ({
//                         ...prev,
//                         value: { type: '', value: '' }
//                     }));
//                 }}>
//                     Color
//                 </div>
//             ),
//             key: '3',
//         },
//     ];
//     const [extraDataList, setExtraDataList] = useState(JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}").extraData || []);
//     const itemsEdit = [
//         {
//             label: (
//                 <div onClick={() => {
//                     setSelectedInputEdit("input")
//                     setEditExtraDataList(prev => ({
//                         ...prev,
//                         value: { type: '', value: '' }
//                     }));
//                 }}>
//                     Input
//                 </div>
//             ),
//             key: '0',
//         },
//         {
//             label: (
//                 <div onClick={() => {
//                     setSelectedInputEdit("boolean")
//                     setEditExtraDataList(prev => ({
//                         ...prev,
//                         value: { type: 'boolean', value: true }
//                     }));
//                 }} >
//                     Boolean
//                 </div>
//             ),
//             key: '1',
//         },
//         {
//             label: (
//                 <div onClick={() => {
//                     setSelectedInputEdit("date")
//                     setEditExtraDataList(prev => ({
//                         ...prev,
//                         value: { type: '', value: '' }
//                     }));
//                 }}>
//                     Date
//                 </div>
//             ),
//             key: '2',
//         },
//         {
//             label: (
//                 <div onClick={() => {
//                     setSelectedInputEdit("color")
//                     setEditExtraDataList(prev => ({
//                         ...prev,
//                         value: { type: '', value: '' }
//                     }));
//                 }}>
//                     Color
//                 </div>
//             ),
//             key: '3',
//         },
//     ];
//     const handleAddExtraData = () => {
//         if (!extraDataState?.name || extraDataState?.value?.value === "") {
//             messageApi.destroy()
//             messageApi.open({
//                 type: "error",
//                 content: "Please fill required fields",
//             });
//             return;
//         }
//         else {
//             setExtraDataList(prev => [...prev, extraDataState]);
//             if (extraDataState.value.type == "boolean") {
//                 setExtraDataState({
//                     name: '',
//                     description: '',
//                     value: { type: 'Boolean', value: true }
//                 });
//             }
//             else {
//                 setExtraDataState({
//                     name: '',
//                     description: '',
//                     value: { type: '', value: '' }
//                 });
//             }
//             const PrevJsonData = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}")
//             const UpdateJsonParr = { extraData: [...extraDataList, extraDataState], ...PrevJsonData }
//             localStorage.setItem("tMk+@!v2YCXzqLd79#PrA8E", JSON.stringify(UpdateJsonParr));
//         }
//     };
//     const handleUpdateExtraData = () => {
//         if (!editExtraDataList?.name || editExtraDataList?.value?.value === "") {
//             messageApi.destroy()
//             messageApi.open({
//                 type: "error",
//                 content: "Please fill required fields",
//             });
//             return;
//         }
//         else {
//             setExtraDataList(prevList => {
//                 const newList = prevList.map((item, index) =>
//                     index === editExtraDataList.id ? editExtraDataList : item
//                 );
//                 return newList;
//             });
//             const PrevJsonData = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}")
//             const UpdateJsonParr = PrevJsonData?.extraData.map((item, index) =>
//                 index === editExtraDataList.id ? editExtraDataList : item
//             );
//             const UpdateJsonParT = { ...PrevJsonData, extraData: UpdateJsonParr }
//             localStorage.setItem("tMk+@!v2YCXzqLd79#PrA8E", JSON.stringify(UpdateJsonParT));

//             if (editExtraDataList.value.type == "boolean") {
//                 setEditExtraDataList({
//                     name: null,
//                     description: null,
//                     value: { type: 'Boolean', value: true }
//                 });
//             }
//             else {
//                 setEditExtraDataList({
//                     name: null,
//                     description: null,
//                     value: { type: '', value: '' }
//                 });
//             }
//             return;
//         }
//     };
//     const handleRemoveExtraEntry = (indexToRemove) => {
//         if (indexToRemove === editExtraDataList?.id) {
//             if (editExtraDataList.value.type == "Boolean") {
//                 setEditExtraDataList({
//                     name: null,
//                     description: null,
//                     value: { type: 'Boolean', value: true }
//                 });
//                 setExtraDataList(prev => prev?.filter((_, index) => index !== indexToRemove));
//             }
//             else {
//                 setEditExtraDataList(prev => ({
//                     name: null,
//                     description: null,
//                     value: { type: '', value: '' }
//                 }));
//                 setExtraDataList(prev => prev?.filter((_, index) => index !== indexToRemove));
//             }
//         }
//         else {
//             setExtraDataList(prev => prev?.filter((_, index) => index !== indexToRemove));
//         }
//         const PrevJsonData = JSON.parse(localStorage.getItem("tMk+@!v2YCXzqLd79#PrA8E") || "{}")
//         const UpdateJsonParr = PrevJsonData?.extraData?.filter((_, index) => index !== indexToRemove)
//         const UpdateJsonParT = { ...PrevJsonData, extraData: UpdateJsonParr }
//         localStorage.setItem("tMk+@!v2YCXzqLd79#PrA8E", JSON.stringify(UpdateJsonParT));
//     };
//     // Drawer Extra Data




















//     const [addPhoto, setAddPhoto] = useState([]);
//     const [uploadDocument, setUploadDocument] = useState([]);
//     const [inspection, setInspectionDco] = useState([]);

//     const fileSetters = {
//         addPhoto: setAddPhoto,
//         uploadDocument: setUploadDocument,
//         inspection: setInspectionDco,
//     };

//     const createBeforeUploadHandler = (key) => (file) => {
//         const setter = fileSetters[key];
//         var insName;
//         if (key == "inspection") {
//             const renamedFile = new File([file], `ws${key}_${file.name}`, { type: file.type });
//             insName = renamedFile
//         }
//         if (setter) {
//             if (key == "inspection") {
//                 setter((prev) => Array.isArray(prev) ? [...prev, insName] : [insName]);
//             }
//             else {
//                 setter((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
//             }
//         } else {
//             console.warn(`Unknown file key: ${key}`);
//         }
//         return false;
//     };
//     const [CreateLoading, setCreateLoading] = useState(false)


//     function rgbaStringToPipe(value) {
//         if (typeof value !== "string") {
//             console.warn("Expected a string, but got:", value);
//             return null;
//         }

//         if (value.startsWith("rgba")) {
//             const matches = value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
//             if (matches) {
//                 const [, r, g, b, a] = matches;
//                 return `${r}|${g}|${b}|${a}`;
//             }
//         } else if (value.startsWith("rgb")) {
//             const matches = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
//             if (matches) {
//                 const [, r, g, b] = matches;
//                 return `${r}|${g}|${b}|1`;
//             }
//         }
//         return null;
//     }


//     const adddataWorkOrder = async (data) => {
//         const centerLNG = points.reduce(
//             (acc, point) => {
//                 acc.lat += point.lat;
//                 acc.lng += point.lng;
//                 return acc;
//             },
//             { lat: 0, lng: 0 }
//         );
//         const totalPoints = points.length;
//         centerLNG.lat /= totalPoints;
//         centerLNG.lng /= totalPoints;


//         const centerLNGMore = pointsMore.reduce(
//             (acc, point) => {
//                 acc.lat += point.lat;
//                 acc.lng += point.lng;
//                 return acc;
//             },
//             { lat: 0, lng: 0 }
//         );
//         const totalPointsMore = pointsMore.length;
//         centerLNGMore.lat /= totalPointsMore;
//         centerLNGMore.lng /= totalPointsMore;

//         const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
//         const dateNow = new Date().toISOString();


//         const totalItems = [
//             ...uploadDocument,
//             ...addPhoto,
//             ...inspection
//         ].length;
//         const {
//             notificationTimeAndDate: rawNotificationTimeAndDate,
//         } = data;
//         const notificationTimeAndDate = dayjs(rawNotificationTimeAndDate).format('YYYY-MM-DD HH:mm:ss')
//         const yearDate = dayjs(data?.date).format('YYYY-MM-DD')
//         const notificationTime = dayjs(rawNotificationTimeAndDate);
//         const rawPreNotification = data?.preNotificationTimeAndDate;
//         const preNotificationNumber = Number(rawPreNotification);
//         const preNotificationOffset = !preNotificationNumber || isNaN(preNotificationNumber) ? 5 : preNotificationNumber;
//         const preNotificationTime = notificationTime.subtract(preNotificationOffset, 'minute');
//         const preNotificationTimeFormatted = preNotificationTime.format('YYYY-MM-DD HH:mm:ss');

//         const fileArray1 = [...inspection].map(file => ({
//             fileName: file.name,
//             size: file.size,
//             contentType: file.type,
//             key: "inspection"
//         }))
//         const fileArray2 = [...uploadDocument, ...addPhoto].map(file => ({
//             fileName: file.name,
//             size: file.size,
//             contentType: file.type,
//         }))

//         const fileArray = [...fileArray1, ...fileArray2]

//         const meta = JSON.stringify({
//             id: "",
//             type: "asset",
//             title: data?.assetType ?? "",
//         });

//         let polygon = {};
//         if (selectedTab === 1) {
//             // Circle
//             const locations =
//                 actualCenter == null
//                     ? [[location.lat?.toString(), location.lng?.toString()]]
//                     : [[actualCenter.lat?.toString(), actualCenter.lng?.toString()]];

//             polygon = {
//                 type: "Circle",
//                 safetyZone: safetyOffset || 0.0,
//                 altitude: Number(altitude) || 0.0,
//                 radius: parentRadius || 0.0,
//                 locations,
//                 meta,
//                 latitude: location.lat,
//                 longitude: location.lng,
//             };
//         }
//         else if (selectedTab === 2) {
//             // Polygon
//             const locations = points.map(loc => [
//                 loc.lat.toString(),
//                 loc.lng.toString(),
//             ]);

//             polygon = {
//                 type: "Polygon",
//                 safetyZone: padding || 0.0,
//                 altitude: Number(altitude) || 0.0,
//                 radius: parentRadius || 0.0,
//                 locations,
//                 meta,
//                 latitude: centerLNG.lat,
//                 longitude: centerLNG.lng,
//             };
//         }
//         else if (selectedTab === 3) {
//             // Polyline
//             const locations = pointsMore.map(loc => [
//                 loc.lat.toString(),
//                 loc.lng.toString(),
//             ]);

//             polygon = {
//                 type: "Polyline",
//                 safetyZone: safetyOffsetMore || 0.0,
//                 altitude: Number(altitude) || 0.0,
//                 radius: parentRadius || 0.0,
//                 locations,
//                 meta,
//                 latitude: centerLNGMore.lat,
//                 longitude: centerLNGMore.lng,
//             };
//         }

//         if (
//             selectedTab !== undefined &&
//             points.length > 2 ||
//             pointsMore.length > 2 ||
//             circleRef.current !== null
//         ) {
//             setCreateLoading(true)
//             const AwsUpload = await AWSUploadModule({ messageApi, fileArray, actualFile: [...uploadDocument, ...addPhoto, ...inspection], moduleName: "asset", setCreateLoading })
//             const payload = {
//                 assetType: data?.assetType ?? "",
//                 department: data?.department ?? "",
//                 year: yearDate,
//                 model: data?.model ?? "",
//                 worksiteId: currentWorkSite,

//                 elevationLevels: Array.isArray(data?.elevationlevel)
//                     ? data.elevationlevel
//                     : [],

//                 extraFields: JSON.stringify(extraDataList.length > 0
//                     ? extraDataList.map(item => ({
//                         name: item.name,
//                         description: item.description,
//                         value:
//                             item.value.type === "date"
//                                 ? dayjs(item.value.value).format("YYYY-MM-DD")
//                                 : item.value.type === "color"
//                                     ? rgbaStringToPipe(item.value.value)
//                                     : item.value.value,
//                         type: item.value.type,
//                         isRequired: false,
//                     }))
//                     : []),

//                 files: !AwsUpload ? [] : AwsUpload,

//                 workOrders: JSON.stringify(Array.isArray(data?.linkedWorkOrder)
//                     ? data.linkedWorkOrder
//                     : []),

//                 reminder_time:
//                     preNotificationTimeFormatted === "Invalid Date" ||
//                         notificationTimeAndDate === "Invalid Date"
//                         ? ""
//                         : preNotificationTimeFormatted,

//                 estimated_time:
//                     notificationTimeAndDate === "Invalid Date"
//                         ? ""
//                         : notificationTimeAndDate,
//             };
//             const payloadNew = {
//                 ...payload,
//                 polygon: polygon ? JSON.stringify(polygon) : "{}",
//             };
//             try {
//                 const controller = new AbortController();
//                 const timeout = setTimeout(() => {
//                     controller.abort();
//                 }, 10000000);
//                 const options = {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "authorization": `Bearer ${token}`,
//                     },
//                     body: JSON.stringify(payloadNew),
//                     signal: controller.signal,
//                 };
//                 let response;
//                 if ([...uploadDocument, ...addPhoto, ...inspection].length > 0) {
//                     if (AwsUpload) {
//                         response = await fetch(`${baseUrl}/assets`, options);
//                     }
//                 }
//                 else {
//                     response = await fetch(`${baseUrl}/assets`, options);
//                 }
//                 if (response.status == 403) {
//                     const res = await response.json();
//                     if ("roleUpdated" in res) {
//                         localStorage.clear()
//                         window.location.reload();
//                     }
//                     else {
//                         clearTimeout(timeout);
//                         setCreateLoading(false)
//                         messageApi.open({
//                             type: "info",
//                             content: "Payment expired",
//                         });
//                     }
//                 }
//                 if (response.status == 200 || response.status == 201) {
//                     clearTimeout(timeout);
//                     messageApi.open({
//                         type: "success",
//                         content: "Asset created successfully.",
//                     });
//                     setCreateLoading(false)
//                     navigate('/assets/my-assets')
//                 }
//                 if (response.status == 500) {
//                     clearTimeout(timeout);
//                     setCreateLoading(false)
//                     messageApi.open({
//                         type: "error",
//                         content: "Something went wrong",
//                     });
//                 }
//                 if (response.status == 507) {
//                     clearTimeout(timeout);
//                     setCreateLoading(false)
//                     messageApi.open({
//                         type: "error",
//                         content: "Storage limit exceeded",
//                     });
//                 }
//                 if (response.status == 400) {
//                     clearTimeout(timeout);
//                     setCreateLoading(false)
//                     messageApi.open({
//                         type: "error",
//                         content: "Something went wrong",
//                     });
//                 }
//                 clearTimeout(timeout);
//                 setCreateLoading(false)
//             } catch (err) {
//                 clearTimeout(timeout);
//                 setCreateLoading(false)
//                 console.error("Error submitting:", err);
//             }
//         } else {
//             if (selectedTab === undefined || selectedTab === 0) {
//                 messageApi.destroy()
//                 messageApi.open({
//                     type: "error",
//                     content: "Please choose area in map",
//                 });
//             } else if (points.length <= 2 || pointsMore.length <= 2) {
//                 messageApi.destroy()
//                 messageApi.open({
//                     type: "error",
//                     content: "Please select minimum 3 points",
//                 });
//             }
//         }
//     }



//     const SaveFormDataTemp = async (data) => {
//         const centerLNG = points.reduce(
//             (acc, point) => {
//                 acc.lat += point.lat;
//                 acc.lng += point.lng;
//                 return acc;
//             },
//             { lat: 0, lng: 0 }
//         );
//         const totalPoints = points.length;
//         centerLNG.lat /= totalPoints;
//         centerLNG.lng /= totalPoints;

//         const centerLNGMore = pointsMore.reduce(
//             (acc, point) => {
//                 acc.lat += point.lat;
//                 acc.lng += point.lng;
//                 return acc;
//             },
//             { lat: 0, lng: 0 }
//         );
//         const totalPointsMore = pointsMore.length;
//         centerLNGMore.lat /= totalPointsMore;
//         centerLNGMore.lng /= totalPointsMore;
//         const formData = new FormData();

//         const metaString = JSON.stringify({
//             id: "",
//             type: "asset",
//             title: "",
//         });
//         if (selectedTab == 0) {
//             const CircleData = {
//                 type: "Circle",
//                 locations: actualCenter == null
//                     ? [
//                         [
//                             location.lat?.toString(),
//                             location.lng?.toString(),
//                         ]
//                     ]
//                     : [
//                         [
//                             actualCenter?.lat?.toString(),
//                             actualCenter?.lng?.toString(),
//                         ]
//                     ],
//                 safetyZone: safetyOffset,
//                 altitude: Number(altitude),
//                 radius: parentRadius,
//                 meta: metaString,
//             };
//             formData.append(
//                 "polygon",
//                 JSON.stringify({
//                     safetyZone: CircleData.safetyZone || 0.0,
//                     altitude: CircleData.altitude || 0.0,
//                     radius: CircleData.radius || 0.0,
//                     locations: CircleData.locations.length > 0
//                         ? CircleData.locations
//                         : [],
//                     type: "CircleBooo",
//                     meta: CircleData.meta || "{}",
//                     latitude: location.lat,
//                     longitude: location.lng,
//                 })
//             );
//         }
//         if (selectedTab == 1) {
//             const CircleData = {
//                 type: "Circle",
//                 locations: actualCenter == null
//                     ? [
//                         [
//                             location.lat?.toString(),
//                             location.lng?.toString(),
//                         ]
//                     ]
//                     : [
//                         [
//                             actualCenter?.lat?.toString(),
//                             actualCenter?.lng?.toString(),
//                         ]
//                     ],
//                 safetyZone: safetyOffset,
//                 altitude: Number(altitude),
//                 radius: parentRadius,
//                 meta: metaString,
//             };
//             formData.append(
//                 "polygon",
//                 JSON.stringify({
//                     safetyZone: CircleData.safetyZone || 0.0,
//                     altitude: CircleData.altitude || 0.0,
//                     radius: CircleData.radius || 0.0,
//                     locations: CircleData.locations.length > 0
//                         ? CircleData.locations
//                         : [],
//                     type: "Circle",
//                     meta: CircleData.meta || "{}",
//                     latitude: location.lat,
//                     longitude: location.lng,
//                 })
//             );
//         }
//         else if (selectedTab == 2) {
//             const CircleData = {
//                 type: "Polygon",
//                 locations: actualCenter == null
//                     ? points.map(location => [
//                         location.lat.toString(),
//                         location.lng.toString(),
//                     ])
//                     : [],
//                 safetyZone: padding,
//                 altitude: Number(altitude),
//                 radius: parentRadius,
//                 meta: metaString,
//             };
//             formData.append(
//                 "polygon",
//                 JSON.stringify({
//                     safetyZone: CircleData.safetyZone || 0.0,
//                     altitude: CircleData.altitude || 0.0,
//                     radius: CircleData.radius || 0.0,
//                     locations: CircleData.locations.length > 0
//                         ? CircleData.locations
//                         : [],
//                     type: CircleData.type,
//                     meta: CircleData.meta || "{}",
//                     latitude: centerLNG.lat,
//                     longitude: centerLNG.lng,
//                 })
//             );

//         }
//         else if (selectedTab == 3) {
//             const CircleData = {
//                 type: "Polyline",
//                 locations: actualCenter == null
//                     ? pointsMore.map(location => [
//                         location.lat.toString(),
//                         location.lng.toString(),
//                     ])
//                     : [],
//                 safetyZone: safetyOffsetMore,
//                 altitude: Number(altitude),
//                 radius: parentRadius,
//                 meta: metaString,
//             };
//             formData.append(
//                 "polygon",
//                 JSON.stringify({
//                     safetyZone: CircleData.safetyZone || 0.0,
//                     altitude: CircleData.altitude || 0.0,
//                     radius: CircleData.radius || 0.0,
//                     locations: CircleData.locations.length > 0
//                         ? CircleData.locations
//                         : [],
//                     type: CircleData.type,
//                     meta: CircleData.meta || "{}",
//                     latitude: centerLNGMore.lat,
//                     longitude: centerLNGMore.lng,
//                 })
//             );
//         }
//         else null
//         const responce = saveFormDataToLocalStorage(formData)
//         if (responce) {
//             navigate('/workorder/create?refer=asset')
//         }
//     }

//     function generateUniqueID() {
//         return `form_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
//     }

//     function formDataToJson(formData) {
//         const obj = {};
//         for (const [key, value] of formData.entries()) {
//             if (obj[key]) {
//                 if (Array.isArray(obj[key])) {
//                     obj[key].push(value);
//                 } else {
//                     obj[key] = [obj[key], value];
//                 }
//             } else {
//                 obj[key] = value;
//             }
//         }
//         return obj;
//     }

//     function saveFormDataToLocalStorage(form) {
//         const uniqueID = generateUniqueID();
//         form.append('_id', uniqueID);
//         form.append('createAt', new Date().toISOString());
//         const jsonData = formDataToJson(form);
//         localStorage.setItem('#qz+M8t^d@LACY9PkE1X7vr', JSON.stringify(jsonData));
//         return true
//     }

//     const [value1, setValue1] = useState(null);
//     const locationDataFunc = (ee) => {
//         setValue1(ee)
//         geocodeByAddress(ee?.label)
//             .then(results => getLatLng(results[0]))
//             .then(({ lat, lng }) =>
//                 setLocation({
//                     lat: lat,
//                     lng: lng,
//                 })
//             );
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
//     const selectedTabRef = useRef(selectedTab);

//     useEffect(() => {
//         selectedTabRef.current = selectedTab;
//     }, [selectedTab]);

//     const drawCircleWorkSite = (loc, radius, safetyZone2) => {
//         const worksiteParent = new window.google.maps.Circle({
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

//         worksiteParent.addListener('click', (e) => {
//             if (selectedTabRef.current === 2) {
//                 handleMapClick(e);
//             } else if (selectedTabRef.current === 3) {
//                 handleMapClickMore(e);
//             }
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
//         return worksiteParent;
//     };


//     const [workSiteMarker, setWorkSiteMarker] = useState(null)
//     const [pointsWorkSite, setPointsWorkSite] = useState([]);
//     const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);



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


//     const blockedKeys = [
//         "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "}", "[", "]",
//         "|", "\\", ":", ";", "\"", "'", "<", ">", ",", ".", "?", "/", "~", "`",
//         "e", "E", "+", "-", ".",
//     ];





//     const handleKeyDown = (e) => {
//         const allowedKeys = [
//             "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Home", "End"
//         ];

//         if (
//             !/^[0-9]$/.test(e.key) && // not a digit
//             !allowedKeys.includes(e.key)
//         ) {
//             e.preventDefault();
//         }
//     };



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
//                         <h1>Create Asset</h1>
//                         <div>
//                             <button style={{ cursor: "pointer" }} disabled={CreateLoading} onClick={handleSubmit(adddataWorkOrder)}>{CreateLoading ? "Adding Asset..." : "Add Asset"}</button>
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
//                                             disabled={CreateLoading || AssetsReducer?.assetTypeLoading}
//                                             placeholder="Select Asset"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.assetType?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={[...newAssetType, ...assetTypeData]}
//                                             filterOption={(input, option) =>
//                                                 (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                                             }
//                                             onSearch={(e) => setGetSearchAssetType(e)}
//                                             searchValue={getSeachAssetType}
//                                             notFoundContent={
//                                                 <>
//                                                     {getSeachAssetType &&
//                                                         <div className={Style.AddNewContentInDepart}>
//                                                             <p style={{ whiteSpace: 'nowrap', width: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSeachAssetType}</p>
//                                                             <button className={Style.AddNewContentInDepartBtn} onClick={CreatesetNewAssetTypeEx}>{
//                                                                 AssetsReducer?.createDepartmentLoading ?
//                                                                     <Spin /> :
//                                                                     "Create"}</button>
//                                                         </div>}
//                                                 </>
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
//                                             disabled={CreateLoading || AssetsReducer?.departmentLoading}
//                                             placeholder="Select Department"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.department?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={[...newDepartment, ...depatmentData]}
//                                             filterOption={(input, option) =>
//                                                 (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                                             }
//                                             onSearch={(e) => setGetSearchDepartment(e)}
//                                             searchValue={getSeachDepartment}
//                                             notFoundContent={
//                                                 <>
//                                                     {getSeachDepartment &&
//                                                         <div className={Style.AddNewContentInDepart}>
//                                                             <p style={{ whiteSpace: 'nowrap', width: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSeachDepartment}</p>
//                                                             <button className={Style.AddNewContentInDepartBtn} onClick={CreateDepartmentEx}>{
//                                                                 AssetsReducer?.createDepartmentLoading ?
//                                                                     <Spin /> :
//                                                                     "Create"}</button>
//                                                         </div>}
//                                                 </>
//                                             }
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
//                                             disabled={CreateLoading}
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
//                                         if (WorkOrderData.length <= 0) return (
//                                             <Popconfirm
//                                                 title="Save Form Data"
//                                                 description="Do you want to save this form data?"
//                                                 okText="Yes"
//                                                 cancelText="No"
//                                                 onConfirm={SaveFormDataTemp}
//                                                 onCancel={() => {
//                                                     localStorage.removeItem("#qz+M8t^d@LACY9PkE1X7vr")
//                                                     localStorage.removeItem("tMk+@!v2YCXzqLd79#PrA8E")
//                                                     navigate('/workorder/create?refer=asset')
//                                                 }}
//                                             >
//                                                 <button type='button' className={`${Style.NoFoundWorkOrder} ant-input`} disabled={CreateLoading}>Create work order</button>
//                                             </Popconfirm>
//                                         )
//                                         return (
//                                             <Select
//                                                 getPopupContainer={(triggerNode) => triggerNode.parentElement}
//                                                 mode="multiple"
//                                                 loading={PoiReducer?.workOrderLoading}
//                                                 disabled={PoiReducer?.workOrderLoading || CreateLoading}
//                                                 placeholder="Select Linked work order"
//                                                 onChange={onChange}
//                                                 value={value == "" ? null : value}
//                                                 filterOption={(input, option) =>
//                                                     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                                                 }
//                                                 status={errors?.linkedWorkOrder?.message !== undefined ? 'error' : ''}
//                                                 style={{ marginTop: 3, width: "100%", height: 45 }}
//                                                 options={WorkOrderData}
//                                                 dropdownRender={menu => (
//                                                     <>
//                                                         {menu}
//                                                         <Divider style={{ margin: '8px 0' }} />
//                                                         <div
//                                                             style={{
//                                                                 padding: '8px',
//                                                                 cursor: 'pointer',
//                                                                 color: '#1890ff',
//                                                                 textAlign: 'center'
//                                                             }}
//                                                             onMouseDown={e => e.preventDefault()}
//                                                         >
//                                                             <Popconfirm
//                                                                 title="Save Form Data"
//                                                                 description="Do you want to save this form data?"
//                                                                 okText="Yes"
//                                                                 cancelText="No"
//                                                                 onConfirm={SaveFormDataTemp}
//                                                                 onCancel={() => {
//                                                                     localStorage.removeItem("#qz+M8t^d@LACY9PkE1X7vr")
//                                                                     localStorage.removeItem("tMk+@!v2YCXzqLd79#PrA8E")
//                                                                     navigate('/workorder/create?refer=asset')
//                                                                 }}
//                                                             >
//                                                                 <div>
//                                                                     Create work order
//                                                                 </div>
//                                                             </Popconfirm>
//                                                         </div>
//                                                     </>
//                                                 )}
//                                             />)
//                                     }}
//                                     name="linkedWorkOrder"
//                                 />
//                             </div>
//                         </div>


//                         <div className={Style.FeildRow}>
//                             <div className={Style.FeildColLeft}>
//                                 <label>Model</label>
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
//                                             disabled={CreateLoading || AssetsReducer?.modelLoading}
//                                             placeholder="Select Model"
//                                             onChange={onChange}
//                                             value={value == "" ? null : value}
//                                             status={errors?.model?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={[...newModel, ...modelData]}
//                                             filterOption={(input, option) =>
//                                                 (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                                             }
//                                             onSearch={(e) => setGetSearchModel(e)}
//                                             searchValue={getSeachModel}
//                                             notFoundContent={
//                                                 <>
//                                                     {getSeachModel &&
//                                                         <div className={Style.AddNewContentInDepart}>
//                                                             <p style={{ whiteSpace: 'nowrap', width: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSeachModel}</p>
//                                                             <button className={Style.AddNewContentInDepartBtn} onClick={CreateModelEx}>{
//                                                                 AssetsReducer?.createDepartmentLoading ?
//                                                                     <Spin /> :
//                                                                     "Create"}</button>
//                                                         </div>}
//                                                 </>
//                                             }
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
//                                             <DatePicker inputReadOnly disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs.utc(value).local() : null} status={errors?.date?.message !== undefined ? 'error' : ''} placeholder='Select Date' style={{ height: 45 }} />
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
//                                     <div>
//                                         <button disabled={CreateLoading}>Add</button>
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
//                                             <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs.utc(value).local() : null} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45 }} />
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
//                                 {editExtraDataList?.name !== undefined && editExtraDataList?.name !== null ?
//                                     <>
//                                         <div style={{ paddingTop: 10 }}>
//                                             <label>Name <span style={{ color: 'red' }}>*</span></label>
//                                             <Input value={editExtraDataList?.name} onChange={(e) => setEditExtraDataList(prev => ({ ...prev, name: e.target.value }))} placeholder='Name here' style={{ height: 45, marginTop: 3 }} />
//                                         </div>
//                                         <div style={{ paddingTop: 15 }}>
//                                             <label>Description</label>
//                                             <Input.TextArea onFocus={() => {
//                                                 document.body.style.overflow = "hidden";
//                                             }}
//                                                 onBlur={() => {
//                                                     document.body.style.overflow = "auto";
//                                                 }} value={editExtraDataList.description} onChange={(e) => setEditExtraDataList(prev => ({ ...prev, description: e.target.value }))} rows={6} placeholder='Description here' style={{ marginTop: 3 }} />
//                                         </div>
//                                         <div style={{ paddingTop: 15, display: 'flex', alignItems: 'flex-end', }}>
//                                             <div style={{ width: '88%', display: 'inline-grid' }}>
//                                                 {selectedInputEdit === "input" && (
//                                                     <>
//                                                         <label>Value <span style={{ color: 'red' }}>*</span></label>
//                                                         <Input
//                                                             value={editExtraDataList?.value?.value}
//                                                             onChange={(e) =>
//                                                                 setEditExtraDataList(prev => ({
//                                                                     ...prev,
//                                                                     value: { type: "input", value: e.target.value }
//                                                                 }))
//                                                             }
//                                                             placeholder='Value here'
//                                                             style={{ height: 45, marginTop: 3 }}
//                                                         />
//                                                     </>
//                                                 )}
//                                                 {selectedInputEdit === "boolean" && (
//                                                     <div style={{ display: 'flex', height: 45, alignItems: 'center', width: 30 }}>
//                                                         <label>Boolean</label>
//                                                         <Switch
//                                                             checked={editExtraDataList?.value?.value}
//                                                             onChange={(checked) =>
//                                                                 setEditExtraDataList(prev => ({
//                                                                     ...prev,
//                                                                     value: { type: "boolean", value: checked }
//                                                                 }))
//                                                             }
//                                                             style={{ marginLeft: 5 }}
//                                                         />
//                                                     </div>
//                                                 )}

//                                                 {selectedInputEdit === "date" && (
//                                                     <>
//                                                         <label>Value <span style={{ color: 'red' }}>*</span></label>
//                                                         <DatePicker inputReadOnly
//                                                             value={editExtraDataList?.value?.value}
//                                                             minDate={dayjs(formattedDate, dateFormat2)}
//                                                             onChange={(date) =>
//                                                                 setEditExtraDataList(prev => ({
//                                                                     ...prev,
//                                                                     value: { type: "date", value: date }
//                                                                 }))
//                                                             }
//                                                             placeholder='Select Date'
//                                                             style={{ height: 45, marginTop: 3 }}
//                                                         />
//                                                     </>
//                                                 )}

//                                                 {selectedInputEdit === "color" && (
//                                                     <>
//                                                         <label>Value <span style={{ color: 'red' }}>*</span></label>
//                                                         <ColorPicker
//                                                             value={editExtraDataList?.value?.value}
//                                                             onChange={(color) =>
//                                                                 setEditExtraDataList(prev => ({
//                                                                     ...prev,
//                                                                     value: { type: "color", value: color.toRgbString() }
//                                                                 }))
//                                                             }
//                                                             format='rgb'
//                                                             size="small"
//                                                             showText
//                                                             style={{ height: 45, marginTop: 3 }}
//                                                         />
//                                                     </>
//                                                 )}
//                                             </div>
//                                             <div style={{ width: "12%", height: width > 1500 ? 45 : 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
//                                                 <Dropdown trigger={['click']} menu={{ items: itemsEdit }}>
//                                                     <IoSettingsOutline size={22} color='black' />
//                                                 </Dropdown>
//                                             </div>
//                                         </div>
//                                     </>
//                                     :
//                                     <>
//                                         <div style={{ paddingTop: 10 }}>
//                                             <label>Name <span style={{ color: 'red' }}>*</span></label>
//                                             <Input value={extraDataState.name} onChange={(e) => setExtraDataState(prev => ({ ...prev, name: e.target.value }))} placeholder='Name here' style={{ height: 45, marginTop: 3 }} />
//                                         </div>
//                                         <div style={{ paddingTop: 15 }}>
//                                             <label>Description</label>
//                                             <Input.TextArea onFocus={() => {
//                                                 document.body.style.overflow = "hidden";
//                                             }}
//                                                 onBlur={() => {
//                                                     document.body.style.overflow = "auto";
//                                                 }} value={extraDataState.description}
//                                                 onChange={(e) => setExtraDataState(prev => ({ ...prev, description: e.target.value }))} rows={6} placeholder='Description here' style={{ marginTop: 3 }} />
//                                         </div>

//                                         <div style={{ paddingTop: 15, display: 'flex', alignItems: 'flex-end', }}>
//                                             <div style={{ width: '88%', display: 'inline-grid' }}>
//                                                 {selectedInput === "input" && (
//                                                     <>
//                                                         <label>Value <span style={{ color: 'red' }}>*</span></label>
//                                                         <Input
//                                                             value={extraDataState.value.value}
//                                                             onChange={(e) =>
//                                                                 setExtraDataState(prev => ({
//                                                                     ...prev,
//                                                                     value: { type: "input", value: e.target.value }
//                                                                 }))
//                                                             }
//                                                             placeholder='Value here'
//                                                             style={{ height: 45, marginTop: 3 }}
//                                                         />
//                                                     </>
//                                                 )}
//                                                 {selectedInput === "boolean" && (
//                                                     <div style={{ display: 'flex', height: 45, alignItems: 'center' }}>
//                                                         <label>Boolean</label>
//                                                         <Switch
//                                                             checked={extraDataState.value.value}
//                                                             onChange={(checked) =>
//                                                                 setExtraDataState(prev => ({
//                                                                     ...prev,
//                                                                     value: { type: "boolean", value: checked }
//                                                                 }))
//                                                             }
//                                                             style={{ marginLeft: 5, width: 30 }}
//                                                         />
//                                                     </div>
//                                                 )}

//                                                 {selectedInput === "date" && (
//                                                     <>
//                                                         <label>Value <span style={{ color: 'red' }}>*</span></label>
//                                                         <DatePicker inputReadOnly
//                                                             value={extraDataState.value.value}
//                                                             minDate={dayjs(formattedDate, dateFormat2)}
//                                                             onChange={(date) =>
//                                                                 setExtraDataState(prev => ({
//                                                                     ...prev,
//                                                                     value: { type: "date", value: date }
//                                                                 }))
//                                                             }
//                                                             placeholder='Select Date'
//                                                             style={{ height: 45, marginTop: 3 }}
//                                                         />
//                                                     </>
//                                                 )}

//                                                 {selectedInput === "color" && (
//                                                     <>
//                                                         <label>Value <span style={{ color: 'red' }}>*</span></label>
//                                                         <ColorPicker
//                                                             value={extraDataState.value.value}
//                                                             onChange={(color) =>
//                                                                 setExtraDataState(prev => ({
//                                                                     ...prev,
//                                                                     value: { type: "color", value: color.toRgbString() }
//                                                                 }))
//                                                             }
//                                                             defaultValue="#1677ff"
//                                                             format='rgb'
//                                                             size="small"
//                                                             showText
//                                                             style={{ height: 45, marginTop: 3 }}
//                                                         />
//                                                     </>
//                                                 )}
//                                             </div>
//                                             <div style={{ width: "12%", height: width > 1500 ? 45 : 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
//                                                 <Dropdown trigger={['click']} menu={{ items }}>
//                                                     <IoSettingsOutline size={22} color='black' />
//                                                 </Dropdown>
//                                             </div>
//                                         </div>
//                                     </>
//                                 }
//                                 <div style={{ width: "100%", paddingTop: 20, marginBottom: 20 }}>
//                                     <button onClick={editExtraDataList?.name !== undefined && editExtraDataList?.name !== null ? handleUpdateExtraData : handleAddExtraData} className={Style.AddWorkBtn}>{editExtraDataList?.name !== undefined && editExtraDataList?.name !== null ? "Update" : "Add"} Data</button>
//                                 </div>

//                                 {extraDataList?.length > 0 ? extraDataList.map((data, index) => {
//                                     return (
//                                         <Dropdown placement='bottomLeft' trigger={['click']} menu={{
//                                             items: [
//                                                 {
//                                                     key: '4',
//                                                     label: (
//                                                         <div onClick={() => handleRemoveExtraEntry(index)} style={{ display: 'flex', alignItems: 'center' }}>
//                                                             <MdOutlineDeleteOutline size={22} color='red' />
//                                                             <p style={{ margin: "0px 0px 0px 2px", }}>Delete</p>
//                                                         </div>
//                                                     ),
//                                                 },
//                                                 {
//                                                     key: '24',
//                                                     label: (
//                                                         <div onClick={() => {
//                                                             setEditExtraDataList({ ...data, id: index })
//                                                             setSelectedInputEdit(data?.value?.type)
//                                                         }} style={{ display: 'flex', alignItems: 'center' }}>
//                                                             <MdOutlineModeEditOutline size={22} />
//                                                             <p style={{ margin: "0px 0px 0px 2px", }}>Edit</p>
//                                                         </div>
//                                                     ),
//                                                 },
//                                             ],
//                                         }}>
//                                             <div key={index} className={Style.MainListingHourWork} style={{ marginTop: 10 }}>
//                                                 <div className={Style.HoursWorkListTop}>
//                                                     <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//                                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 }}>
//                                                             <label style={{ fontWeight: '500' }}>{data.name}</label>
//                                                         </div>
//                                                         {data?.value?.type == "input" ?
//                                                             <Input disabled={true} contentEditable={false} value={data?.value?.value.toString()} style={{ height: 45, marginTop: 3 }} />
//                                                             : data?.value?.type == "boolean" ?
//                                                                 <Switch
//                                                                     checked={data?.value?.value}
//                                                                     style={{ marginLeft: 5, width: 30 }}
//                                                                 />
//                                                                 : data?.value?.type == "date" ?
//                                                                     <DatePicker inputReadOnly
//                                                                         disabled={true}
//                                                                         value={data?.value?.value}
//                                                                         style={{ height: 45, marginTop: 3 }}
//                                                                         contentEditable={false}
//                                                                     /> : data?.value?.type == "color" ?
//                                                                         <ColorPicker
//                                                                             disabled={true}
//                                                                             format='rgb'
//                                                                             value={data?.value?.value}
//                                                                             showText
//                                                                             style={{ height: 45, marginTop: 3 }}
//                                                                         /> : ""
//                                                         }
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                     <p style={{ marginBottom: 0, marginTop: 10, fontSize: 14, color: '#898989' }}>{data?.description}</p>
//                                                 </div>
//                                             </div>
//                                         </Dropdown>
//                                     );
//                                 }) : ""}
//                             </Drawer>
//                             {/* extra Data drawer */}
//                         </div>
//                         <div className={Style.FeildRow} style={{ alignItems: 'flex-start' }}>
//                             <div className={Style.FeildColRight}>
//                                 <label>Pre-Notification Time (In min) <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <InputNumber max={999} maxLength={3} disabled={CreateLoading} min={5} onChange={onChange} value={value} status={errors?.preNotificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Enter Pre-Notification Time' style={{ height: 45, marginTop: 3, width: '100%', display: 'flex', alignItems: 'center' }} />
//                                     )}
//                                     name="preNotificationTimeAndDate"
//                                 />
//                             </div>
//                         </div>
//                         <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start' }}>
//                             <div className={Style.FeildColLeft}>
//                                 <label style={{ marginBottom: 10 }}>Add Photos <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Upload onRemove={(e) => setAddPhoto(prev =>
//                                     prev.filter(file => file.uid !== e.uid)
//                                 )} accept={".png,.jpg,.jpeg,.svg"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('addPhoto')}>
//                                     <Button icon={<UploadOutlined />}>Click to Upload</Button>
//                                 </Upload>
//                             </div>
//                             <div className={Style.FeildColLeft}>
//                                 <label style={{ marginBottom: 10 }}>Upload Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Upload onRemove={(e) => setUploadDocument(prev =>
//                                     prev.filter(file => file.uid !== e.uid)
//                                 )} accept={".pdf"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('uploadDocument')}>
//                                     <Button icon={<UploadOutlined />}>Click to Upload</Button>
//                                 </Upload>
//                             </div>

//                             <div className={Style.FeildColLeft}>
//                                 <label style={{ marginBottom: 10 }}>Inspection Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Upload onRemove={(e) => setInspectionDco(prev =>
//                                     prev.filter(file => file.uid !== e.uid)
//                                 )} accept={".pdf"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('inspection')}>
//                                     <Button icon={<UploadOutlined />}>Click to Upload</Button>
//                                 </Upload>
//                             </div>
//                         </div>
//                     </div >
//                     <div className={Style.MapSide}>
//                         {isLoaded ? (
//                             <>
//                                 <GoogleMapCreate
//                                     locationCurrent={locationCurrent}
//                                     center={location}
//                                     onMapLoad={onMapLoad}
//                                     onClick={selectedTab === 2 ? handleMapClick : selectedTab === 3 ? handleMapClickMore : null}
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
//                                     altitude={altitude}
//                                     setAltitude={setAltitude}
//                                     drawCircle={drawCircle}
//                                     drawCustomArea={drawCustomArea}
//                                     drawPolyLine={drawPolyLine}
//                                     removeIconCustomArea={removeIconCustomArea}
//                                     removeIconCustomArea2={removeIconCustomArea2}
//                                     handleOffsetChange={handleOffsetChange}
//                                     handleRecenter={handleRecenter}
//                                     locationToggle={locationToggle}
//                                     requestLocationAgain={requestLocationAgain}
//                                     value1={value1}
//                                     locationDataFunc={locationDataFunc}
//                                     getSafetyZonePath={getSafetyZonePath}
//                                     handlePolygonClick={handlePolygonClick}
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
// )(ProjectScreenCreate);









































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
        if (editId) {
            localStorage.removeItem(localStoreKey);
            GetAssetsByID(editId)
            GetAllWorkOrderFilterLink(editId, "Alert", editId)
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
            setCounter(prev => prev + 1)
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

            const fileArray1 = [...(allFormDataFine?.inspection || [])].map(file => ({
                fileName: file.name,
                size: file.size,
                contentType: file.type,
                key: "inspection"
            }))
            const fileArray2 = [...(allFormDataFine?.uploadDocument || []), ...(allFormDataFine?.addPhoto || [])].map(file => ({
                fileName: file.name,
                size: file.size,
                contentType: file.type,
            }))

            const fileArray = [...(fileArray1 || []), ...(fileArray2 || [])]
            if (editId) {
                if (fileArray) {
                    console.log("OK")
                }
            }

            try {
                setCreateLoading(true)
                const AwsUpload = await AWSUploadModule({ messageApi, fileArray, actualFile: [...(allFormDataFine?.addPhoto || []), ...(allFormDataFine?.uploadDocument || []), ...(allFormDataFine?.inspection || [])], moduleName: 'asset' })
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
                                    : item.value.type === "color"
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
                        navigate('/workorder/create?refer=alert')
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
                                navigate('/workorder/create?refer=alert')
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
    const [polylineWidth, setPolylineWidth] = useState(1)
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
            console.log(getValuesOfForm,'asdasd0as0da0sda0sd0as0')
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
            setExtraDataList(() => {
                const updatedList = [...formattedData];
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
                                                                        navigate('/workorder/create?refer=alert')
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
