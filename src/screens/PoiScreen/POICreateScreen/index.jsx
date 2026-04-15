// import { useCallback, useEffect, useRef, useState } from 'react'
// import Style from './workorderCreateScreen.module.css'
// import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider } from 'antd'
// import * as POIAction from '../../../../store/actions/Poi/index';
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


// const POIScreenCreate = ({ PoiReducer, GetAllWorkOrderUnLink }) => {
//     dayjs.extend(customParseFormat);
//     const dateFormat2 = 'YYYY-MM-DD';
//     const now = new Date(Date.now());
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     const formattedDate = `${year}-${month}-${day}`;
//     const [messageApi, contextHolder] = message.useMessage();
//     const navigate = useNavigate();
//     const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
//     useEffect(() => {
//         GetAllWorkOrderUnLink(currentWorkSite)
//     }, [])


//     const [isDraft, setIsDraft] = useState(false);
//     const schema = yup.object().shape({
//         title: yup.string().required(),
//         description: yup.string().notRequired(),
//         threatLevel: yup.string().required(),
//         elevationLevel: yup.array().min(1),
//         linkedWorkOrder: yup.array().notRequired(),
//         notificationTimeAndDate: yup.string().notRequired(),
//         preNotificationTimeAndDate: yup.string().notRequired(),
//         notificationTitle: yup.string().max(70, "Maximum 70 charectores are allowed").notRequired(),
//         notificationBody: yup.string().max(150, "Maximum 150 charectores are allowed").notRequired(),
//     });

//     const schemaNotRequired = yup.object().shape({
//         title: yup.string().notRequired(),
//         description: yup.string().notRequired(),
//         threatLevel: yup.string().notRequired(),
//         elevationLevel: yup.array().notRequired(),
//         linkedWorkOrder: yup.array().notRequired(),
//         notificationTimeAndDate: yup.string().notRequired(),
//         preNotificationTimeAndDate: yup.string().notRequired(),
//         notificationTitle: yup.string().max(70, "Maximum 70 charectores are allowed").notRequired(),
//         notificationBody: yup.string().max(150, "Maximum 150 charectores are allowed").notRequired(),
//     });
//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         reset,
//         getValues,
//         setValue
//     } = useForm({
//         resolver: yupResolver(isDraft ? schemaNotRequired : schema),
//         defaultValues: {
//             title: '',
//             description: '',
//             threatLevel: '',
//             elevationLevel: [],
//             linkedWorkOrder: [],
//             notificationTimeAndDate: '',
//             preNotificationTimeAndDate: '',
//             notificationTitle: '',
//             notificationBody: '',
//         },
//     });

//     const getCurrentDate = () => {
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         return `${year}/${month}/${day}`;
//     };

//     const WorkOrderData = PoiReducer?.workOrderUnData?.map(data => {
//         return { value: data._id, label: data?.title }
//     })

//     const threatLevelOption = [
//         { label: "No Risk", value: "No Threat" },
//         { label: "Lowest Risk", value: "Lowest" },
//         { label: "Moderate Risk", value: "Moderate" },
//         { label: "High Risk", value: "High" },
//         { label: "Extreme Risk", value: "Extreme" }
//     ]
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
//         console.log(e, 'asldalksdl')
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





//     // Drawer Personanal
//     const [listDrawer, setlistDrawer] = useState(false);
//     const [addDrawer, setAddDrawer] = useState(false);
//     const [listEditDrawer, setlistEditDrawer] = useState({});


//     const showDrawer = () => {
//         setlistDrawer(true);
//     };
//     const closeDrawer = () => {
//         setlistDrawer(false);
//     };
//     const showAddDrawer = () => {
//         setAddDrawer(true);
//     };
//     const closeAddDrawer = () => {
//         setAddDrawer(false);
//     };
//     const [personanalData, setPersonanalData] = useState({
//         name: '',
//         date: null,
//         no_of_hours: ''
//     });
//     const [entries, setEntries] = useState([]);
//     const [personanalDataArray, setPersonanalDataArray] = useState([]);
//     const handleAddMore = () => {
//         if (personanalData.date && personanalData.no_of_hours) {
//             setEntries(prev => [...prev, {
//                 date: personanalData.date,
//                 no_of_hours: personanalData.no_of_hours
//             }]);
//             setPersonanalData(prev => ({
//                 ...prev,
//                 date: null,
//                 no_of_hours: ''
//             }));
//         } else {
//             messageApi.open({
//                 type: "error",
//                 content: "Please provide both date and hours",
//             });
//         }
//     };
//     const handleAddData = () => {
//         if (personanalData.name && entries.length > 0) {
//             setPersonanalDataArray(prev => [
//                 ...prev,
//                 { name: personanalData.name, date_and_hours: entries }
//             ]);

//             // Reset all fields
//             setPersonanalData({ name: '', date: null, no_of_hours: '' });
//             setEntries([]);
//         } else {
//             messageApi.open({
//                 type: "error",
//                 content: "Please fill in name and add at least one record",
//             });
//         }
//     };
//     const handleRemoveEntry = (indexToRemove) => {
//         setEntries(prev => prev.filter((_, index) => index !== indexToRemove));
//     };
//     const handleRemoveMainEntry = (indexToRemove) => {
//         setPersonanalDataArray(prev => prev.filter((_, index) => index !== indexToRemove));
//     };




//     const [personanalSData, setPersonanalSData] = useState({
//         date: '',
//         no_of_hours: ''
//     });


//     const handleRemoveSEntry = (indexToRemove) => {
//         setlistEditDrawer(prev => ({
//             ...prev,
//             date_and_hours: prev.date_and_hours.filter((_, index) => index !== indexToRemove)
//         }));
//     };

//     const handleSAddData = () => {
//         if (personanalSData.date && personanalSData?.no_of_hours) {
//             setlistEditDrawer(prev => ({
//                 ...prev,
//                 date_and_hours: [
//                     ...(prev.date_and_hours || []),
//                     personanalSData
//                 ]
//             }));
//             setPersonanalSData({
//                 date: '',
//                 no_of_hours: ''
//             })
//         } else {
//             messageApi.open({
//                 type: "error",
//                 content: "Please fill in date and hours",
//             });
//         }
//     };
//     const handleUpdateHours = () => {
//         if (!listEditDrawer?.name || listEditDrawer?.date_and_hours?.length <= 0) {
//             messageApi.destroy()
//             messageApi.open({
//                 type: "error",
//                 content: "Please fill required fields",
//             });
//             return;
//         }
//         else {
//             setPersonanalDataArray(prevList => {
//                 const newList = prevList.map((item, index) =>
//                     index === listEditDrawer.id ? listEditDrawer : item
//                 );
//                 return newList;
//             });
//             setlistEditDrawer({})
//             return;
//         }
//     };
//     // Drawer Personanal









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

//     const [extraDataList, setExtraDataList] = useState([]);

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
//     };
//     // Drawer Extra Data
















//     const [emailCTC, setEmailCTC] = useState("")
//     const [listemailCTC, setListEmailCTC] = useState([])
//     const AddEmailExtra = () => {
//         let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//         if (emailCTC === "") {
//             messageApi.destroy()
//             messageApi.open({
//                 type: "error",
//                 content: "Please enter email.",
//             });
//         } else if (!regEmail.test(emailCTC)) {
//             messageApi.destroy()
//             messageApi.open({
//                 type: "error",
//                 content: "Please enter correct email.",
//             });
//         } else {
//             setListEmailCTC(prev => [...prev, emailCTC]);
//             setEmailCTC('');
//         }
//     }

//     const DeleteEmailExtra = (indexRemover) => {
//         setListEmailCTC(prev => prev?.filter((_, index) => index !== indexRemover));
//     }


//     const [photosOrVideos, setPhotosOrVideos] = useState([])
//     const [safetyDocumentation, setSafetyDocumentation] = useState([])
//     const [warrantyDocumentation, setWarrantyDocumentation] = useState([])
//     const handleBeforeUpload1 = (file) => {
//         setWarrantyDocumentation((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
//         return false;
//     };
//     const handleBeforeUpload2 = (file) => {
//         setPhotosOrVideos((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
//         return false;
//     };
//     const handleBeforeUpload3 = (file) => {
//         setSafetyDocumentation((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
//         return false;
//     };


//     function generateBase64UrlId(byteLength = 64) {
//         const bytes = new Uint8Array(byteLength);
//         crypto.getRandomValues(bytes);
//         return btoa(String.fromCharCode(...bytes))
//             .replace(/\+/g, '-')
//             .replace(/\//g, '_')
//             .replace(/=+$/, '');
//     }
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

//     const [isExcel, setIsExcel] = useState(false)
//     const isSendExcel = checked => {
//         setIsExcel(checked)
//     };

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


//         const totalItems = [
//             ...warrantyDocumentation,
//             ...photosOrVideos,
//         ].length;


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
//         if (isDraft) {
//             const formData = new FormData();
//             formData.append("title", data?.title);
//             formData.append("description", data?.description);
//             formData.append("riskLevel", data?.threatLevel);
//             formData.append("worksiteId", currentWorkSite);
//             if (extraDataList.length > 0) {
//                 const convertedArray = extraDataList.map(item => ({
//                     name: item.name,
//                     description: item.description,
//                     value: item.value.type === 'date'
//                         ? dayjs(item.value.value).format('YYYY-MM-DD')
//                         : item.value.type === 'color' ? rgbaStringToPipe(item.value.value) : item.value.value,
//                     type: item.value.type,
//                     isRequired: false,
//                 }));
//                 formData.append("extraFields", JSON.stringify(convertedArray));
//             }
//             formData.append('elevationLevels', JSON.stringify(data?.elevationLevel));
//             const metaString = JSON.stringify({
//                 id: "",
//                 type: "report",
//                 title: data?.title,
//             });
//             if (selectedTab == 0) {
//                 const CircleData = {
//                     type: "Circle",
//                     locations: actualCenter == null
//                         ? [
//                             [
//                                 location.lat?.toString(),
//                                 location.lng?.toString(),
//                             ]
//                         ]
//                         : [
//                             [
//                                 actualCenter?.lat?.toString(),
//                                 actualCenter?.lng?.toString(),
//                             ]
//                         ],
//                     safetyZone: safetyOffset,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: "CircleBooo",
//                         meta: CircleData.meta || "{}",
//                         latitude: location.lat,
//                         longitude: location.lng,
//                     })
//                 );
//             }
//             if (selectedTab == 1) {
//                 const CircleData = {
//                     type: "Circle",
//                     locations: actualCenter == null
//                         ? [
//                             [
//                                 location.lat?.toString(),
//                                 location.lng?.toString(),
//                             ]
//                         ]
//                         : [
//                             [
//                                 actualCenter?.lat?.toString(),
//                                 actualCenter?.lng?.toString(),
//                             ]
//                         ],
//                     safetyZone: safetyOffset,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: "Circle",
//                         meta: CircleData.meta || "{}",
//                         latitude: location.lat,
//                         longitude: location.lng,
//                     })
//                 );
//             }
//             else if (selectedTab == 2) {
//                 const CircleData = {
//                     type: "Polygon",
//                     locations: actualCenter == null
//                         ? points.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ])
//                         : [],
//                     safetyZone: padding,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: CircleData.type,
//                         meta: CircleData.meta || "{}",
//                         latitude: centerLNG.lat,
//                         longitude: centerLNG.lng,
//                     })
//                 );
//             }
//             else if (selectedTab == 3) {
//                 const CircleData = {
//                     type: "Polyline",
//                     locations: actualCenter == null
//                         ? pointsMore.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ])
//                         : [],
//                     safetyZone: safetyOffsetMore,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: CircleData.type,
//                         meta: CircleData.meta || "{}",
//                         latitude: centerLNGMore.lat,
//                         longitude: centerLNGMore.lng,
//                     })
//                 );
//             }
//             else null
//             if (totalItems > 10) {
//                 messageApi.open({
//                     type: "error",
//                     content: "Maximum 10 files are allowed.",
//                 });
//             }
//             else {
//                 const responce = saveFormDataToLocalStorage(formData)
//                 if (responce) {
//                     messageApi.open({
//                         type: "success",
//                         content: "POI draft successfully.",
//                     });
//                     setCreateLoading(false)
//                     setTimeout(() => {
//                         navigate('/POI/Poi')
//                     }, 2000);
//                 }
//             }
//         }
//         else {
//             const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
//             const {
//                 notificationTimeAndDate: rawNotificationTimeAndDate,
//             } = data;
//             const notificationTimeAndDate = dayjs(rawNotificationTimeAndDate).format('YYYY-MM-DD HH:mm:ss')
//             const notificationTime = dayjs(rawNotificationTimeAndDate);
//             const rawPreNotification = data?.preNotificationTimeAndDate;
//             const preNotificationNumber = Number(rawPreNotification);
//             const preNotificationOffset =
//                 !preNotificationNumber || isNaN(preNotificationNumber) ? 5 : preNotificationNumber;
//             const preNotificationTime = notificationTime.subtract(preNotificationOffset, 'minute');
//             const preNotificationTimeFormatted = preNotificationTime.format('YYYY-MM-DD HH:mm:ss');


//             const formData = new FormData();
//             formData.append("title", data?.title);
//             formData.append("description", data?.description);
//             formData.append("riskLevel", data?.threatLevel);
//             formData.append("worksiteId", currentWorkSite);
//             if (extraDataList.length > 0) {
//                 const convertedArray = extraDataList.map(item => ({
//                     name: item.name,
//                     description: item.description,
//                     value: item.value.type === 'date'
//                         ? dayjs(item.value.value).format('YYYY-MM-DD')
//                         : item.value.type === 'color' ? rgbaStringToPipe(item.value.value) : item.value.value,
//                     type: item.value.type,
//                     isRequired: false,
//                 }));
//                 formData.append("extraFields", JSON.stringify(convertedArray));
//             }
//             formData.append("reminder_time", preNotificationTimeFormatted == "Invalid Date" ? "" : notificationTimeAndDate == "Invalid Date" ? "" : preNotificationTimeFormatted);
//             formData.append("estimated_time", notificationTimeAndDate == "Invalid Date" ? "" : notificationTimeAndDate);
//             formData.append("notification_title", data?.notificationTitle);
//             formData.append("notification_description", data?.notificationBody);
//             data?.elevationLevel.forEach(level => {
//                 formData.append('elevationLevels', level);
//             });
//             formData.append('workOrders', JSON.stringify(data?.linkedWorkOrder));
//             [...warrantyDocumentation, ...photosOrVideos].forEach(file => {
//                 formData.append('files', file, file.name);
//             });
//             const metaString = JSON.stringify({
//                 id: "",
//                 type: "report",
//                 title: data?.title,
//             });
//             if (selectedTab == 1) {
//                 const CircleData = {
//                     type: "Circle",
//                     locations: actualCenter == null
//                         ? [
//                             [
//                                 location.lat?.toString(),
//                                 location.lng?.toString(),
//                             ]
//                         ]
//                         : [
//                             [
//                                 actualCenter?.lat?.toString(),
//                                 actualCenter?.lng?.toString(),
//                             ]
//                         ],
//                     safetyZone: safetyOffset,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: "Circle",
//                         meta: CircleData.meta || "{}",
//                         latitude: location.lat,
//                         longitude: location.lng,
//                     })
//                 );
//             }
//             else if (selectedTab == 2) {
//                 const CircleData = {
//                     type: "Polygon",
//                     locations: actualCenter == null
//                         ? points.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ])
//                         : points.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ]),
//                     safetyZone: padding,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: CircleData.type,
//                         meta: CircleData.meta || "{}",
//                         latitude: centerLNG.lat,
//                         longitude: centerLNG.lng,
//                     })
//                 );

//             }
//             else if (selectedTab == 3) {
//                 const CircleData = {
//                     type: "Polyline",
//                     locations: actualCenter == null
//                         ? pointsMore.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ])
//                         : pointsMore.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ]),
//                     safetyZone: safetyOffsetMore,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: CircleData.type,
//                         meta: CircleData.meta || "{}",
//                         latitude: centerLNGMore.lat,
//                         longitude: centerLNGMore.lng,
//                     })
//                 );
//             }
//             else null
//             if (
//                 selectedTab !== undefined &&
//                 points.length > 2 ||
//                 pointsMore.length > 2 ||
//                 circleRef.current !== null
//             ) {
//                 if (totalItems > 10) {
//                     messageApi.open({
//                         type: "error",
//                         content: "Maximum 10 files are allowed.",
//                     });
//                 }
//                 else {
//                     try {
//                         const controller = new AbortController();
//                         const timeout = setTimeout(() => {
//                             controller.abort();
//                         }, 1000000);
//                         setCreateLoading(true)
//                         const options = {
//                             method: "POST",
//                             headers: {
//                                 "authorization": `Bearer ${token}`,
//                             },
//                             body: formData,
//                             signal: controller.signal,
//                         };
//                         const response = await fetch(`${baseUrl}/suggestions`, options);
//                         if (response.status == 403) {
//                             const res = await response.json();
//                             if ("roleUpdated" in res) {
//                                 localStorage.clear()
//                                 window.location.reload();
//                             }
//                             else {
//                                 clearTimeout(timeout);
//                                 setCreateLoading(false)
//                                 messageApi.open({
//                                     type: "info",
//                                     content: "Payment expired",
//                                 });
//                             }
//                         }
//                         if (response.status == 200 || response.status == 201) {
//                             clearTimeout(timeout);
//                             messageApi.open({
//                                 type: "success",
//                                 content: "POI created successfully.",
//                             });
//                             setCreateLoading(false)
//                             navigate('/POI/Poi')
//                         }
//                         if (response.status == 500) {
//                             clearTimeout(timeout);
//                             setCreateLoading(false)
//                             messageApi.open({
//                                 type: "error",
//                                 content: "Something went wrong",
//                             });
//                         }
//                         if (response.status == 507) {
//                             clearTimeout(timeout);
//                             setCreateLoading(false)
//                             messageApi.open({
//                                 type: "error",
//                                 content: "Storage limit exceeded",
//                             });
//                         }
//                         if (response.status == 400) {
//                             clearTimeout(timeout);
//                             setCreateLoading(false)
//                             messageApi.open({
//                                 type: "error",
//                                 content: "Something went wrong",
//                             });
//                         }
//                         clearTimeout(timeout);
//                         setCreateLoading(false)
//                     } catch (err) {
//                         clearTimeout(timeout);
//                         setCreateLoading(false)
//                         console.error("Error submitting:", err);
//                     }
//                 }
//             } else {
//                 if (selectedTab === undefined || selectedTab === 0) {
//                     messageApi.destroy()
//                     messageApi.open({
//                         type: "error",
//                         content: "Please choose area in map",
//                     });
//                 } else if (points.length <= 2 || pointsMore.length <= 2) {
//                     messageApi.destroy()
//                     messageApi.open({
//                         type: "error",
//                         content: "Please select minimum 3 points",
//                     });
//                 }
//             }
//         }
//     }


//     const adddataWorkWorkDraft = async (data) => {
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

//         const totalItems = [
//             ...warrantyDocumentation,
//             ...photosOrVideos,
//         ].length;

//         if (isDraft) {
//             const formData = new FormData();
//             formData.append("title", data?.title);
//             formData.append("description", data?.description);
//             formData.append("riskLevel", data?.threatLevel);
//             formData.append("worksiteId", currentWorkSite);
//             if (extraDataList.length > 0) {
//                 const convertedArray = extraDataList.map(item => ({
//                     name: item.name,
//                     description: item.description,
//                     value: item.value.type === 'date'
//                         ? dayjs(item.value.value).format('YYYY-MM-DD')
//                         : item.value.type === 'color' ? rgbaStringToPipe(item.value.value) : item.value.value,
//                     type: item.value.type,
//                     isRequired: false,
//                 }));
//                 formData.append("extraFields", JSON.stringify(convertedArray));
//             }
//             formData.append('elevationLevels', JSON.stringify(data?.elevationLevel));
//             const metaString = JSON.stringify({
//                 id: "",
//                 type: "report",
//                 title: data?.title,
//             });
//             if (selectedTab == 0) {
//                 const CircleData = {
//                     type: "Circle",
//                     locations: actualCenter == null
//                         ? [
//                             [
//                                 location.lat?.toString(),
//                                 location.lng?.toString(),
//                             ]
//                         ]
//                         : [
//                             [
//                                 actualCenter?.lat?.toString(),
//                                 actualCenter?.lng?.toString(),
//                             ]
//                         ],
//                     safetyZone: safetyOffset,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: "CircleBooo",
//                         meta: CircleData.meta || "{}",
//                         latitude: location.lat,
//                         longitude: location.lng,
//                     })
//                 );
//             }
//             if (selectedTab == 1) {
//                 const CircleData = {
//                     type: "Circle",
//                     locations: actualCenter == null
//                         ? [
//                             [
//                                 location.lat?.toString(),
//                                 location.lng?.toString(),
//                             ]
//                         ]
//                         : [
//                             [
//                                 actualCenter?.lat?.toString(),
//                                 actualCenter?.lng?.toString(),
//                             ]
//                         ],
//                     safetyZone: safetyOffset,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: "Circle",
//                         meta: CircleData.meta || "{}",
//                         latitude: location.lat,
//                         longitude: location.lng,
//                     })
//                 );
//             }
//             else if (selectedTab == 2) {
//                 const CircleData = {
//                     type: "Polygon",
//                     locations: actualCenter == null
//                         ? points.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ])
//                         : [],
//                     safetyZone: padding,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: CircleData.type,
//                         meta: CircleData.meta || "{}",
//                         latitude: centerLNG.lat,
//                         longitude: centerLNG.lng,
//                     })
//                 );

//             }
//             else if (selectedTab == 3) {
//                 const CircleData = {
//                     type: "Polyline",
//                     locations: actualCenter == null
//                         ? pointsMore.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ])
//                         : [],
//                     safetyZone: safetyOffsetMore,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: CircleData.type,
//                         meta: CircleData.meta || "{}",
//                         latitude: centerLNGMore.lat,
//                         longitude: centerLNGMore.lng,
//                     })
//                 );
//             }
//             else null
//             if (totalItems > 10) {
//                 messageApi.open({
//                     type: "error",
//                     content: "Maximum 10 files are allowed.",
//                 });
//             }
//             else {
//                 const responce = saveFormDataToLocalStorage(formData)
//                 if (responce) {
//                     messageApi.open({
//                         type: "success",
//                         content: "POI draft successfully.",
//                     });
//                     setCreateLoading(false)
//                     setTimeout(() => {
//                         navigate('/workorder/create?refer=draftPOI')
//                     }, 2000);
//                 }
//             }
//         }
//         else {
//             const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
//             const {
//                 notificationTimeAndDate: rawNotificationTimeAndDate,
//             } = data;
//             const notificationTimeAndDate = dayjs(rawNotificationTimeAndDate).format('YYYY-MM-DD HH:mm:ss')
//             const notificationTime = dayjs(rawNotificationTimeAndDate);


//             const rawPreNotification = data?.preNotificationTimeAndDate;
//             const preNotificationNumber = Number(rawPreNotification);
//             const preNotificationOffset =
//                 !preNotificationNumber || isNaN(preNotificationNumber) ? 5 : preNotificationNumber;
//             const preNotificationTime = notificationTime.subtract(preNotificationOffset, 'minute');
//             const preNotificationTimeFormatted = preNotificationTime.format('YYYY-MM-DD HH:mm:ss');

//             const formData = new FormData();
//             formData.append("title", data?.title);
//             formData.append("description", data?.description);
//             formData.append("riskLevel", data?.threatLevel);
//             formData.append("worksiteId", currentWorkSite);
//             if (extraDataList.length > 0) {
//                 const convertedArray = extraDataList.map(item => ({
//                     name: item.name,
//                     description: item.description,
//                     value: item.value.type === 'date'
//                         ? dayjs(item.value.value).format('YYYY-MM-DD')
//                         : item.value.type === 'color' ? rgbaStringToPipe(item.value.value) : item.value.value,
//                     type: item.value.type,
//                     isRequired: false,
//                 }));
//                 formData.append("extraFields", JSON.stringify(convertedArray));
//             }
//             formData.append("reminder_time", preNotificationTimeFormatted == "Invalid Date" ? "" : notificationTimeAndDate == "Invalid Date" ? "" : preNotificationTimeFormatted);
//             formData.append("estimated_time", notificationTimeAndDate == "Invalid Date" ? "" : notificationTimeAndDate);
//             formData.append("notification_title", data?.notificationTitle);
//             formData.append("notification_description", data?.notificationBody);
//             data?.elevationLevel.forEach(level => {
//                 formData.append('elevationLevels', level);
//             });
//             formData.append('workOrders', JSON.stringify(data?.linkedWorkOrder));
//             [...warrantyDocumentation, ...photosOrVideos].forEach(file => {
//                 formData.append('files', file, file.name);
//             });
//             const metaString = JSON.stringify({
//                 id: "",
//                 type: "report",
//                 title: data?.title,
//             });
//             if (selectedTab == 1) {
//                 const CircleData = {
//                     type: "Circle",
//                     locations: actualCenter == null
//                         ? [
//                             [
//                                 location.lat?.toString(),
//                                 location.lng?.toString(),
//                             ]
//                         ]
//                         : [
//                             [
//                                 actualCenter?.lat?.toString(),
//                                 actualCenter?.lng?.toString(),
//                             ]
//                         ],
//                     safetyZone: safetyOffset,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: "Circle",
//                         meta: CircleData.meta || "{}",
//                         latitude: location.lat,
//                         longitude: location.lng,
//                     })
//                 );
//             }
//             else if (selectedTab == 2) {
//                 const CircleData = {
//                     type: "Polygon",
//                     locations: actualCenter == null
//                         ? points.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ])
//                         : points.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ]),
//                     safetyZone: padding,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: CircleData.type,
//                         meta: CircleData.meta || "{}",
//                         latitude: centerLNG.lat,
//                         longitude: centerLNG.lng,
//                     })
//                 );

//             }
//             else if (selectedTab == 3) {
//                 const CircleData = {
//                     type: "Polyline",
//                     locations: actualCenter == null
//                         ? pointsMore.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ])
//                         : pointsMore.map(location => [
//                             location.lat.toString(),
//                             location.lng.toString(),
//                         ]),
//                     safetyZone: safetyOffsetMore,
//                     altitude: Number(altitude),
//                     radius: parentRadius,
//                     meta: metaString,
//                 };
//                 formData.append(
//                     "polygon",
//                     JSON.stringify({
//                         safetyZone: CircleData.safetyZone || 0.0,
//                         altitude: CircleData.altitude || 0.0,
//                         radius: CircleData.radius || 0.0,
//                         locations: CircleData.locations.length > 0
//                             ? CircleData.locations
//                             : [],
//                         type: CircleData.type,
//                         meta: CircleData.meta || "{}",
//                         latitude: centerLNGMore.lat,
//                         longitude: centerLNGMore.lng,
//                     })
//                 );
//             }
//             else null
//             if (
//                 selectedTab !== undefined &&
//                 points.length > 2 ||
//                 pointsMore.length > 2 ||
//                 circleRef.current !== null
//             ) {
//                 if (totalItems > 10) {
//                     messageApi.open({
//                         type: "error",
//                         content: "Maximum 10 files are allowed.",
//                     });
//                 }
//                 else {
//                     try {
//                         const controller = new AbortController();
//                         const timeout = setTimeout(() => {
//                             controller.abort();
//                         }, 1000000);
//                         setCreateLoading(true)
//                         const options = {
//                             method: "POST",
//                             headers: {
//                                 "authorization": `Bearer ${token}`,
//                             },
//                             body: formData,
//                             signal: controller.signal,
//                         };
//                         const response = await fetch(`${baseUrl}/suggestions`, options);
//                         if (response.status == 403) {
//                             const res = await response.json();
//                             if ("roleUpdated" in res) {
//                                 localStorage.clear()
//                                 window.location.reload();
//                             }
//                             else {
//                                 clearTimeout(timeout);
//                                 setCreateLoading(false)
//                                 messageApi.open({
//                                     type: "info",
//                                     content: "Payment expired",
//                                 });
//                             }
//                         }
//                         if (response.status == 200 || response.status == 201) {
//                             clearTimeout(timeout);
//                             messageApi.open({
//                                 type: "success",
//                                 content: "POI created successfully.",
//                             });
//                             setCreateLoading(false)
//                             navigate('/POI/Poi')
//                         }
//                         if (response.status == 500) {
//                             clearTimeout(timeout);
//                             setCreateLoading(false)
//                             messageApi.open({
//                                 type: "error",
//                                 content: "Something went wrong",
//                             });
//                         }
//                         if (response.status == 507) {
//                             clearTimeout(timeout);
//                             setCreateLoading(false)
//                             messageApi.open({
//                                 type: "error",
//                                 content: "Storage limit exceeded",
//                             });
//                         }
//                         if (response.status == 400) {
//                             clearTimeout(timeout);
//                             setCreateLoading(false)
//                             messageApi.open({
//                                 type: "error",
//                                 content: "Something went wrong",
//                             });
//                         }
//                         clearTimeout(timeout);
//                         setCreateLoading(false)
//                     } catch (err) {
//                         clearTimeout(timeout);
//                         setCreateLoading(false)
//                         console.error("Error submitting:", err);
//                     }
//                 }
//             } else {
//                 if (selectedTab === undefined || selectedTab === 0) {
//                     messageApi.destroy()
//                     messageApi.open({
//                         type: "error",
//                         content: "Please choose area in map",
//                     });
//                 } else if (points.length <= 2 || pointsMore.length <= 2) {
//                     messageApi.destroy()
//                     messageApi.open({
//                         type: "error",
//                         content: "Please select minimum 3 points",
//                     });
//                 }
//             }
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
//         localStorage.setItem('Zk2@pHL5uy!6mW+L9/=2&y==', uniqueID)
//         form.append('createAt', new Date().toISOString());
//         const jsonData = formDataToJson(form);
//         const savedForms = JSON.parse(localStorage.getItem('myFormData')) || [];
//         savedForms.push(jsonData);
//         localStorage.setItem('myFormData', JSON.stringify(savedForms));
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
//                         <h1>Create POI</h1>
//                         <div>
//                             <Popconfirm
//                                 title="Add to draft"
//                                 description="Are you sure you want to add this POI to draft?"
//                                 okText="Yes"
//                                 cancelText="No"
//                                 placement="bottomRight"
//                                 onConfirm={() => {
//                                     handleSubmit(adddataWorkOrder)();
//                                 }}
//                                 onCancel={() => {
//                                     setIsDraft(false);
//                                 }}
//                                 onOpenChange={(e) => setIsDraft(e)}
//                             >
//                                 <button style={{ marginRight: 5 }} onClick={() => setIsDraft(true)} disabled={CreateLoading}>{"Save Draft"}</button>
//                             </Popconfirm>


//                             <button style={{ cursor: CreateLoading || isDraft ? "no-drop" : "pointer" }} disabled={CreateLoading || isDraft} onClick={() => {
//                                 setIsDraft(false);
//                                 handleSubmit(adddataWorkOrder)();
//                             }}>{CreateLoading ? "Adding POI..." : "Add POI"}</button>

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
//                                         <Input disabled={CreateLoading} onChange={onChange} value={value} status={errors?.title?.message !== undefined ? 'error' : ''} placeholder='Enter Title' style={{ height: 45, marginTop: 3 }} />
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
//                                             disabled={CreateLoading}
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
//                                             status={errors?.elevationLevel?.message !== undefined ? 'error' : ''}
//                                             style={{ marginTop: 3, width: "100%", height: 45 }}
//                                             options={elevationLevelOption}
//                                         />)}
//                                     name="elevationLevel"
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
//                                                 title="Save Draft"
//                                                 description="Do you want to save this POI as a draft?"
//                                                 okText="Yes"
//                                                 cancelText="No"
//                                                 onConfirm={handleSubmit(adddataWorkWorkDraft)}
//                                                 onCancel={() => {
//                                                     setIsDraft(false);
//                                                     navigate('/workorder/create?refer=createPOI')
//                                                 }
//                                                 }
//                                                 onOpenChange={(e) => setIsDraft(e)}
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
//                                                                 title="Add to draft"
//                                                                 description="Are you sure you want to add this POI to draft?"
//                                                                 okText="Yes"
//                                                                 cancelText="No"
//                                                                 onConfirm={() => {
//                                                                     handleSubmit(adddataWorkWorkDraft)();
//                                                                 }}
//                                                                 onCancel={() => {
//                                                                     setIsDraft(false);
//                                                                     navigate('/workorder/create?refer=createPOI')
//                                                                 }}
//                                                                 onOpenChange={(e) => setIsDraft(e)}
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
//                                 <label>Notification Title <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => {
//                                         return (
//                                             <Input maxLength={70} disabled={CreateLoading} onChange={onChange} value={value} status={errors?.notificationTitle?.message !== undefined ? 'error' : ''} placeholder='Enter Notification Title' style={{ height: 45, marginTop: 3 }} />
//                                         )
//                                     }}
//                                     name="notificationTitle"
//                                 />
//                             </div>
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
//                                         <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45, marginTop: 3 }} />
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
//                                             <Input.TextArea
//                                                 onFocus={() => {
//                                                     document.body.style.overflow = "hidden";
//                                                 }}
//                                                 onBlur={() => {
//                                                     document.body.style.overflow = "auto";
//                                                 }}
//                                                 value={editExtraDataList.description} onChange={(e) => setEditExtraDataList(prev => ({ ...prev, description: e.target.value }))} rows={6} placeholder='Description here' style={{ marginTop: 3 }} />
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
//                                                 }}

//                                                 value={extraDataState.description}
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
//                                                 }} disabled={CreateLoading} rows={6} onChange={onChange} value={value} status={errors?.description?.message !== undefined ? 'error' : ''} placeholder='Enter Description' style={{ marginTop: 3 }} />

//                                         )
//                                     }}
//                                     name="description"
//                                 />
//                             </div>
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
//                                                 }} maxLength={150} disabled={CreateLoading} rows={6} onChange={onChange} value={value} status={errors?.notificationBody?.message !== undefined ? 'error' : ''} placeholder='Enter Notification Body' style={{ marginTop: 3 }} />
//                                         )
//                                     }}
//                                     name="notificationBody"
//                                 />
//                             </div>
//                         </div>
//                         <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start' }}>
//                             <div className={Style.FeildColLeft}>
//                                 <label style={{ marginBottom: 10 }}>Upload Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Upload onRemove={(e) => setWarrantyDocumentation(prev =>
//                                     prev.filter(file => file.uid !== e.uid)
//                                 )} accept={".pdf"} multiple={true} disabled={CreateLoading} beforeUpload={handleBeforeUpload1}>
//                                     <Button icon={<UploadOutlined />}>Click to Upload</Button>
//                                 </Upload>
//                             </div>
//                             <div className={Style.FeildColLeft}>
//                                 <label style={{ marginBottom: 10 }}>Upload Photo <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
//                                 <Upload onRemove={(e) => setPhotosOrVideos(prev =>
//                                     prev.filter(file => file.uid !== e.uid)
//                                 )} multiple={true} accept={".png,.jpg,.jpeg,.svg"} disabled={CreateLoading} beforeUpload={handleBeforeUpload2}>
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

// function mapStateToProps({ PoiReducer }) {
//     return { PoiReducer };
// }
// export default connect(mapStateToProps, POIAction)(POIScreenCreate);







import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Style from './workorderCreateScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Steps, Slider, Row, Col, Modal, Popconfirm, Divider } from 'antd'
import * as POIAction from '../../../../store/actions/Poi/index';
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
import { AWSUploadModule } from '../../../component/AWSUploadModule';
import { deleteWarrantyFile, getWarrantyFiles, saveWarrantyFile } from '../../../component/indexDB';
const { Dragger } = Upload;



const POIScreenCreate = ({ GetAllWorkOrderFilterLink, WorkPOIGetById, GetAllWorkOrderUnLink, PoiReducer, WorkOrderReducer, GetWorkSite, GetAdminWorkSite, WorkOrderGetById }) => {
    dayjs.extend(customParseFormat);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const Paramlocation = useLocation();
    const queryParams = new URLSearchParams(Paramlocation.search);
    const refer = queryParams.get('refer');
    const Role_ID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const localStoreKey = "A7@M!xK9P_2#RZ+vL8dQ*t=="
    const rawDrafts = localStorage.getItem(localStoreKey);
    const fineRawDrafts = JSON.parse(rawDrafts)
    const editId = queryParams.get('editId');


    useEffect(() => {
        GetAllWorkOrderUnLink(currentWorkSite)
        // storageCheck()
    }, [])


    // const storageCheck = async () => {
    //     if (navigator.storage?.estimate) {
    //         const { usage, quota } = await navigator.storage.estimate();
    //         console.log(`Using ${Math.round(usage / 1024 / 1024)} MB`);
    //         console.log(`Quota ${Math.round(quota / 1024 / 1024)} MB`);
    //     }
    // }

    const { POIGetByIDData, workOrderLinkData } = PoiReducer


    const ComapnyUserData = WorkOrderReducer?.companyUserData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
    })

    useEffect(() => {
        if (editId) {
            localStorage.removeItem(localStoreKey);
            WorkPOIGetById(editId)
            GetAllWorkOrderFilterLink(editId, "Suggestion", editId)
        }
    }, [editId]);
    // const { workOrderGetByIDData } = WorkOrderReducer;

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
        const allFormDataFine = { ...allFormData, ...stepThreeData }
        if (isDraft || isDraftWorkOrder) {
            const localStoreKeyDraft = "A7@MD!xKRP_2#RZ+AL8FT*t==2";
            const draftMediaKey = Date.now();
            try {
                const rawValue = localStorage.getItem(localStoreKey);
                if (!rawValue) return;
                const draftObject = JSON.parse(rawValue);
                const rawDrafts = localStorage.getItem(localStoreKeyDraft);
                let draftsArray = [];

                if (rawDrafts) {
                    const parsedDrafts = JSON.parse(rawDrafts);
                    draftsArray = Array.isArray(parsedDrafts) ? parsedDrafts : [];
                }
                const draftId = fineRawDrafts?._id || draftObject?._id || draftMediaKey;
                await Promise.all(
                    [
                        ...(allFormDataFine?.warrantyDocumentation || []),
                        ...(allFormDataFine?.safetyDocumentation || []),
                    ].map((file) => {
                        file?.originFileObj ?
                            saveWarrantyFile({
                                temp: 'false',
                                _id: draftId,
                                uid: file.uid,
                                name: file?.originFileObj.name,
                                size: file?.originFileObj.size,
                                type: file?.originFileObj.type,
                                lastModified: file?.originFileObj.lastModified,
                                file: file?.originFileObj,
                            })
                            :
                            saveWarrantyFile({
                                temp: 'false',
                                _id: draftId,
                                uid: file.uid,
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                lastModified: file.lastModified,
                                file,
                            })
                    }
                    )
                );
                const updatedDraft = {
                    ...draftObject,
                    workOrders: [],
                    extraData: [],
                    notificationBody: "",
                    notificationTitle: "",
                    preNotification: "",
                    NotificationDate: "",
                    _id: draftId,
                    draftedAt: new Date().toISOString(),
                };
                const existingDraftIndex = draftsArray.findIndex(
                    (item) => item?._id === draftId
                );
                if (existingDraftIndex !== -1) {
                    draftsArray[existingDraftIndex] = updatedDraft;
                } else {
                    draftsArray.push(updatedDraft);
                }
                localStorage.setItem(
                    localStoreKeyDraft,
                    JSON.stringify(draftsArray)
                );
                localStorage.removeItem(localStoreKey);
                messageApi.open({
                    type: "success",
                    content: fineRawDrafts?._id
                        ? "Draft updated successfully."
                        : "POI drafted successfully.",
                });
                closeDraft();
                setTimeout(() => {
                    localStorage.removeItem(localStoreKey);
                    if (isDraft) {
                        window.scrollTo({ top: 0, behavior: 'auto' });
                        navigate('/POI/Poi');
                    } else {
                        navigate('/workorder/create?refer=createPOI');
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
        else {
            const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
            const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
            setCounter(prev => prev + 1)
            if (stepThreeData) {
                const fileArray = [...allFormDataFine?.warrantyDocumentation, ...allFormDataFine?.safetyDocumentation].map(file => ({
                    fileName: file.name,
                    size: file.size,
                    contentType: file.type,
                }))
                const {
                    NotificationDate: rawNotificationTimeAndDate,
                } = allFormDataFine;
                // const notificationTimeAndDate = dayjs(rawNotificationTimeAndDate).format('YYYY-MM-DD HH:mm:ss')
                // const notificationTime = dayjs(rawNotificationTimeAndDate);
                const notificationTimeAndDate = dayjs(rawNotificationTimeAndDate == undefined ? "Invalid Date" : rawNotificationTimeAndDate).format('YYYY-MM-DD HH:mm:ss')
                const notificationTime = dayjs(rawNotificationTimeAndDate == undefined ? "Invalid Date" : rawNotificationTimeAndDate);
                const rawPreNotification = allFormDataFine?.preNotification;
                const preNotificationNumber = Number(rawPreNotification);
                const preNotificationOffset =
                    !preNotificationNumber || isNaN(preNotificationNumber) ? 5 : preNotificationNumber;
                const preNotificationTime = notificationTime.subtract(preNotificationOffset, 'minute');
                const preNotificationTimeFormatted = preNotificationTime.format('YYYY-MM-DD HH:mm:ss');
                const allWorkOrders = [...(PoiReducer?.workOrderLinkData || []), ...(PoiReducer?.workOrderUnData || [])];
                const workOrderIDs = allWorkOrders.filter(item =>
                    allFormDataFine?.workOrders?.includes(item._id)
                );
                const workOrderIDsAll = workOrderIDs.map(item => item._id);
                const removedWorkOrders = allWorkOrders.filter(item =>
                    !allFormDataFine?.workOrders?.includes(item._id)
                );
                const removedWorkOrderIDs = removedWorkOrders.map(item => item._id);
                setCreateLoading(true)
                const AwsUpload = await AWSUploadModule({ messageApi, fileArray, actualFile: [...allFormDataFine?.warrantyDocumentation, ...allFormDataFine?.safetyDocumentation], moduleName: "report", setCreateLoading })
                const payload = {
                    title: allFormDataFine?.Title,
                    description: allFormDataFine?.description,
                    riskLevel: allFormDataFine?.threatLevel,
                    worksiteId: currentWorkSite,
                    files: !AwsUpload ? [] : AwsUpload,
                    ...(editId && {
                        suggestionId: editId,
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
                    notification_title: allFormDataFine?.notificationTitle,
                    notification_description: allFormDataFine?.notificationBody,
                    elevationLevels: Array.isArray(allFormDataFine?.elevation)
                        ? [...allFormDataFine.elevation]
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
                try {
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
                            ...allFormDataFine?.safetyDocumentation,
                            ...allFormDataFine?.warrantyDocumentation,
                        ] ? { ...payload, filesId: JSON.stringify(POIGetByIDData?.files?.filter(data => !allFormDataFine?.deletePhoto.includes(data?._id)).map(data => { return data._id })) } : "" : payload),
                        signal: controller.signal,
                    };
                    // const response = await fetch(`${baseUrl}/suggestions`, options);
                    let response;
                    if ([...allFormDataFine?.warrantyDocumentation, ...allFormDataFine?.safetyDocumentation]?.length > 0) {
                        if (AwsUpload) {
                            response = await fetch(`${baseUrl}/suggestions`, options);
                        }
                    }
                    else {
                        response = await fetch(`${baseUrl}/suggestions`, options);
                    }
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
                            content: `POI has been ${editId ? "updated" : "created"}.`,
                        });
                        setCreateLoading(false)
                        setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'auto' });
                            navigate('/POI/Poi')
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
        }
    };




    const getStepThreeDataSaveData = async () => {
        if (isDraft || isDraftWorkOrder) {
            try {
                messageApi.open({
                    type: "success",
                    content: "POI Saved successfully.",
                });
                closeDraft()
                setTimeout(() => {
                    if (isDraft) {
                        navigate('/POI/Poi');
                    }
                    else {
                        navigate('/workorder/create?refer=createPOI')
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
            if (!fineRawDrafts?.isDraft) {
                localStorage.removeItem(localStoreKey);
                localStorage.removeItem("cLocation");
                localStorage.removeItem("sLocation");
            }
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



    const [confirmDelete, setConfirmDelete] = useState(false);
    const closeconfirmDelete = () => {
        setEditWorkOrder(false)
    }



    const DeleteFromDraft = () => {
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
        navigate('/POI/draft');
    };

    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <div className={Style.Allpath}>
                            <h6>POI</h6>
                            <img src={rightIcon} />
                            <h6 className={Style.activePage}>{editId ? "Edit" : "Create"} POI</h6>
                        </div>
                        <h3>{editId ? "Edit" : "Create"} POI</h3>
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
                                        title: 'POI Customization',
                                        disabled: true
                                    },
                                ]
                            }
                        />
                    </div>

                    {currentSteps === 0 && <BasicInformation PoiReducer={PoiReducer} counter={counter} workOrderGetByIDData={POIGetByIDData} editId={editId} isValidBtn={setIsFirstStepValid} WorkOrderReducer={WorkOrderReducer} messageApi={messageApi} basicInfoSectionRef={basicInfoSectionRef} ComapnyUserData={ComapnyUserData} WorkOrderReducerData={WorkOrderReducer?.workSiteData} />}
                    {currentSteps === 1 && <POICustomization fineEdit={fineRawDrafts?._id} isDraft={isDraftWorkOrder} setIsDraft={setIsDraftWorkOrder} getStepThreeData={getStepThreeData} workOrderLinkData={workOrderLinkData} PoiReducer={PoiReducer} counter={counter} workOrderGetByIDData={POIGetByIDData} editId={editId} messageApi={messageApi} taskAndLocationRef={taskAndLocationRef} createLoading={createLoading} />}
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
                                    {fineRawDrafts?.isDraft &&
                                        <button disabled={createLoading} className={createLoading ? Style.SubmitBtnDisable : Style.SubmitBtnSaveDelete} onClick={() => setConfirmDelete(true)}>{"Delete Draft"}</button>
                                    }
                                    {!editId &&
                                        <button disabled={createLoading} className={createLoading ? Style.SubmitBtnDisable : Style.SubmitBtnSave} onClick={() => setIsDraft(true)}>{"Save as Draft"}</button>
                                    }
                                    <button disabled={createLoading} className={createLoading ? Style.SubmitBtnDisable : Style.SubmitBtn} onClick={() => editId ? setEditWorkOrder(true) : getStepThreeData()}>{createLoading ? <Spin /> : editId ? "Update POI" : "Create"}</button>
                                </div>
                            </> :
                            ""
                    }
                </div>

                {/* confirm Edit */}
                <Modal
                    open={editWorkOrder}
                    onCancel={closeConfirm}
                    header={false}
                    maskClosable={!createLoading}
                    centered={true}
                    closeIcon={false}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button onClick={() => closeConfirm()} disabled={createLoading} style={{ cursor: createLoading ? 'no-drop' : 'pointer' }} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button style={{ background: createLoading ? 'var(--gray-60)' : 'var(--primary)' }} disabled={createLoading} onClick={() => { getStepThreeData() }} className={createLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>{`Update POI`}</button>
                        </div>
                    </>}

                >
                    <>
                        <h4 className={Style.AreYouSure}>Are you sure you want to update this POI?</h4>
                        <p className={Style.AreYouSurePara}>You're about to update this POI. Changes will be saved and visible to all relevant team members.</p>
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
                                localStorage.removeItem("A7@M!xK9P_2#RZ+vL8dQ*t==");
                                localStorage.removeItem("Q8@L!zM7B_1xP#t+6R9Dg*v==");
                                closeDraftWorkOrder()
                                navigate('/workorder/create?refer=createPOI')
                            }} className={Style.editPersonalModalFooterCancel}>Continue Without Saving</button>
                            <button style={{ background: createLoading ? 'var(--gray-60)' : 'var(--primary)' }} disabled={createLoading} onClick={() => { getStepThreeDataSaveData() }} className={createLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>{`Save POI`}</button>
                        </div>
                    </>}

                >
                    <>
                        <h4 className={Style.AreYouSure}>You want to save this POI?</h4>
                        <p className={Style.AreYouSurePara}>You're about to save this POI. Changes will be saved and visible to you in draft section.</p>
                    </>
                </Modal>
                {/* confirm from WorkOrder  Draft */}



                {/* confirm Draft */}
                <Modal
                    open={isDraft}
                    onCancel={closeDraft}
                    header={false}
                    centered={true}
                    closeIcon={false}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button onClick={() => closeDraft()} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button style={{ background: createLoading ? 'var(--gray-60)' : 'var(--primary)' }} disabled={createLoading} onClick={() => getStepThreeData()} className={createLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>{`Save POI`}</button>
                        </div>
                    </>}

                >
                    <>
                        <h4 className={Style.AreYouSure}>Are you sure you want to save this POI as draft?</h4>
                        <p className={Style.AreYouSurePara}>You're about to save this POI as draft. Changes will be saved and visible to you in draft section.</p>
                    </>
                </Modal>
                {/* confirm Draft */}



                {/* confirm delete */}
                <Modal
                    open={confirmDelete}
                    onCancel={closeconfirmDelete}
                    header={false}
                    centered={true}
                    closeIcon={false}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button onClick={() => setConfirmDelete(false)} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button disabled={PoiReducer.poiArchivedDeleteLoading} onClick={() => { DeleteFromDraft() }} className={PoiReducer.poiArchivedDeleteLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>Delete POI</button>
                        </div>
                    </>}

                >
                    <>
                        <h4 className={Style.AreYouSure}>Delete this POI from draft?</h4>
                        <p className={Style.AreYouSurePara}>You're about to delete this POI from draft. Changes will be saved and visible to you in draft section.</p>
                    </>
                </Modal>
                {/* confirm delete */}
            </div >
        </>
    )
}

function mapStateToProps({ WorkOrderReducer, PoiReducer }) {
    return { WorkOrderReducer, PoiReducer };
}
export default connect(mapStateToProps, POIAction)(POIScreenCreate);






// first Step complete
const BasicInformation = forwardRef(({ PoiReducer, counter, basicInfoSectionRef, ComapnyUserData, WorkOrderReducerData, messageApi, WorkOrderReducer, isValidBtn, editId, workOrderGetByIDData }) => {
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const localStoreKey = "A7@M!xK9P_2#RZ+vL8dQ*t=="

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
                    Title: workOrderGetByIDData.title,
                    threatLevel: workOrderGetByIDData?.riskLevel,
                }
            )
            setElevationSelector(() => {
                const prevJsonData = JSON.parse(localStorage.getItem(localStoreKey) || "{}");
                localStorage.setItem(
                    localStoreKey,
                    JSON.stringify({
                        ...prevJsonData,
                        elevation: workOrderGetByIDData.elevationLevels,
                    })
                );
                return workOrderGetByIDData.elevationLevels;
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
            const verifyMapTypeData = await verifyMapType(mapAllPoints, getValuesOfForm?.Title);
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

    const threatLevelOption = [
        { label: "No Risk", value: "No Threat" },
        { label: "Lowest Risk", value: "Lowest" },
        { label: "Moderate Risk", value: "Moderate" },
        { label: "High Risk", value: "High" },
        { label: "Extreme Risk", value: "Extreme" }
    ]

    const schema = yup.object().shape({
        Title: yup.string().required(),
        threatLevel: yup.string().required(),
    });
    const localData = JSON.parse(localStorage.getItem(localStoreKey) || "{}");
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
            threatLevel: '',
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
            type: "report",
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

    const isBelowGround = elevationSelector?.includes("Below Ground");
    const isGroundLevel = elevationSelector?.includes("Ground Level");
    const isOverhead = elevationSelector?.includes("Overhead");

    const isDisabled = workSiteLoader || loadingMapData;

    const editElevation = (e) => {
        const prevJsonData = JSON.parse(localStorage.getItem(localStoreKey) || "{}");
        const prevElevation = Array.isArray(prevJsonData.elevation)
            ? prevJsonData.elevation
            : [];
        const updatedElevation = prevElevation.includes(e)
            ? prevElevation.filter((item) => item !== e)
            : [...prevElevation, e];
        const updatedJson = {
            ...prevJsonData,
            elevation: updatedElevation,
        };
        localStorage.setItem(localStoreKey, JSON.stringify(updatedJson));
        setElevationSelector(updatedElevation);
    }


    return (
        <>
            <div className={Style.BasicContainer}>
                <Row gutter={[24, 10]} style={{ width: '100%' }}>
                    <Col xxl={10} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <Row align={'middle'} gutter={[16, 10]}>
                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Title <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input onChange={onChange} value={value} status={errors?.Title?.message !== undefined ? 'error' : ''} placeholder='Enter POI title' />
                                        )}
                                        name="Title"
                                    />
                                </div>
                            </Col>
                            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                                <div className={Style.FeildCol}>
                                    <label>Threat Level <span style={{ color: 'red' }}>*</span></label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                placeholder="Select threat level"
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.threatLevel?.message !== undefined ? 'error' : ''}
                                                options={threatLevelOption}
                                            />)}
                                        name="threatLevel"
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
const POICustomization = forwardRef(({ fineEdit, setIsDraft, isDraft, POIGetByIDData, workOrderLinkData, PoiReducer, counter, taskAndLocationRef, messageApi, editId, workOrderGetByIDData, createLoading }) => {
    const navigate = useNavigate();
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateFormat2 = 'YYYY-MM-DD';
    const localStoreKey = "A7@M!xK9P_2#RZ+vL8dQ*t=="

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
            notificationTitle: '',
            notificationBody: '',
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


    const [safetyDocumentation, setSafetyDocumentation] = useState([])
    const [warrantyDocumentation, setWarrantyDocumentation] = useState([])
    const [deletePhoto, setDeletePhoto] = useState([])


    const POICustomizationFinalData = async () => {
        try {
            const getValuesOfForm = getValues()
            return { ...getValuesOfForm, safetyDocumentation, warrantyDocumentation, extraDataList, deletePhoto };
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






    const handleBeforeUpload1 = async (file) => {
        setWarrantyDocumentation((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
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
    const handleBeforeUpload2 = async (file) => {
        setSafetyDocumentation((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
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

                    <Col span={24}>
                        <div className={Style.TaskFeild}>
                            <label>Description</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input.TextArea disabled={createLoading} rows={6} onChange={onChange} value={value} status={errors?.description?.message !== undefined ? 'error' : ''} placeholder='Write description' />
                                )}
                                name="description"
                            />
                        </div>
                    </Col>
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
                                                                        navigate('/workorder/create?refer=createPOI')
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
                                                        .filter(item => value.includes(item._id))
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
                                <ExtraData name={"POI"} createLoading={createLoading} extraDataList={extraDataList} setExtraDataList={setExtraDataList} localStoreKey={localStoreKey} messageApi={messageApi} />
                            </Col>
                        </Row>
                    </Col>
                    <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Notification Title</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input disabled={createLoading} onChange={onChange} value={value} status={errors?.notificationTitle?.message !== undefined ? 'error' : ''} placeholder='Enter notification title' />
                                )}
                                name="notificationTitle"
                            />
                        </div>
                    </Col>

                    <Col span={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Notification Body</label>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input.TextArea disabled={createLoading} rows={6} onChange={onChange} value={value} status={errors?.notificationBody?.message !== undefined ? 'error' : ''} placeholder='Write notification body' />
                                )}
                                name="notificationBody"
                            />
                        </div>
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
                                            <>
                                                <InputNumber disabled={createLoading} max={999} maxLength={3} min={5} onChange={onChange} value={value} status={errors?.preNotification?.message !== undefined ? 'error' : ''} placeholder='Enter Pre-Notification Time' />
                                                {/* <p>Hellp</p> */}
                                            </>
                                        )}
                                        name="preNotification"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>




                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Upload Documents</label>
                            <Dragger
                                fileList={warrantyDocumentation}
                                disabled={createLoading}
                                onRemove={async (file) => {
                                    setWarrantyDocumentation((prev) =>
                                        prev.filter((f) => f.uid !== file.uid)
                                    );
                                    await deleteWarrantyFile(file.uid);
                                }}
                                accept={".pdf"} multiple={true} beforeUpload={handleBeforeUpload1}
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
                                    {workOrderGetByIDData?.files?.length > 0 ? workOrderGetByIDData?.files.filter(data => !deletePhoto.includes(data?._id) &&
                                        ['pdf'].includes(data?.fileName?.split('.').pop()?.toLowerCase())).map((data, index) => {
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
                    <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                            <label>Upload Photos</label>
                            <Dragger
                                fileList={safetyDocumentation}
                                disabled={createLoading}
                                onRemove={async (file) => {
                                    setSafetyDocumentation((prev) =>
                                        prev.filter((f) => f.uid !== file.uid)
                                    );
                                    await deleteWarrantyFile(file.uid);
                                }}

                                accept={".png,.jpg,.jpeg"} multiple={true} beforeUpload={handleBeforeUpload2}
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
                                <p>Upload photos (JPG, PNG, JPEG, SVG)</p>
                            </Dragger>
                            {editId &&
                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.files?.length > 0 ? workOrderGetByIDData?.files.filter(data => !deletePhoto.includes(data?._id) &&
                                        ['png', 'jpg', 'jpeg', 'svg'].includes(data?.fileName?.split('.').pop()?.toLowerCase())
                                    ).map((data, index) => {
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
                </Row>
            </div>
        </>
    )
})
// second Step complete
