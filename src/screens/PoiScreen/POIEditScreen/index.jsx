import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './workorderEditScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Divider } from 'antd'
import * as POIAction from '../../../../store/actions/Poi/index';
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
import { baseUrl } from '../../../../store/config.json';
import { MdOutlineLocationSearching } from "react-icons/md";
import { MdOutlineModeEditOutline } from "react-icons/md";
import WorkSiteIcon from "../../../assets/marker_worksites.png";
import myLocationMarker from "../../../assets/myLocationMarker.png";
import GoogleMapCreate from '../../../component/googleMap';


const POIScreenEdit = ({ PoiReducer, GetAllWorkOrderUnLink, WorkPOIGetById, GetAllWorkOrderFilterLink }) => {
    const current_Id = localStorage.getItem('La7#tMV1jx!4oC+R8/=3&b==')
    dayjs.extend(customParseFormat);
    const dateFormat2 = 'YYYY-MM-DD';
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const [deletePhoto, setDeletePhoto] = useState([])
    const [safetyOffset, setSafetyOffset] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [parentRadius, setParentRadius] = useState(100);
    const [points, setPoints] = useState([]);
    const [pointsMore, setPointsMore] = useState([]);
    const [selectedTab, setSelectedTab] = useState();
    const [actualCenter, setActualCenter] = useState()

    useEffect(() => {
        WorkPOIGetById(current_Id)
        GetAllWorkOrderFilterLink(current_Id, "Suggestion", currentWorkSite)
    }, [])


    const { POIGetByIDData, workOrderLinkData } = PoiReducer



    const drawWithRadiusBounds = (firstLocation, radius) => {
        const lat = Number(firstLocation[0]);
        const lng = Number(firstLocation[1]);
        const deltaLat = radius / 111320;
        const deltaLng = radius / (111320 * Math.cos(lat * (Math.PI / 180)));
        const center = new window.google.maps.LatLng(lat, lng);
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(lat + deltaLat, lng + deltaLng));
        bounds.extend(new window.google.maps.LatLng(lat - deltaLat, lng - deltaLng));
        mapRef.current.fitBounds(bounds);
    };

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
        setLocation(center);
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
        if (mapRef?.current) {
            mapRef.current.fitBounds(paddedBounds);
        }
    };




    useEffect(() => {
        const workOrderIDs = workOrderLinkData?.map(item => item?._id) || [];
        const preNotification = POIGetByIDData?.reminder_time
            ? dayjs(POIGetByIDData.reminder_time).local()
            : null;

        const notificationTime = POIGetByIDData?.estimated_time
            ? dayjs(POIGetByIDData.estimated_time).local()
            : null;
        const diffInMinutes = notificationTime?.diff(preNotification, 'minute');
        reset(
            {
                title: POIGetByIDData.title,
                description: POIGetByIDData?.description !== "undefined" && POIGetByIDData?.description !== "" ? POIGetByIDData?.description : '',
                threatLevel: POIGetByIDData?.riskLevel,
                elevationLevel: POIGetByIDData?.elevationLevels,
                linkedWorkOrder: workOrderIDs,
                ...(POIGetByIDData?.reminder_time && {
                    preNotificationTimeAndDate: diffInMinutes == 0 ? "" : diffInMinutes,
                }),
                ...(POIGetByIDData?.estimated_time && {
                    notificationTimeAndDate: dayjs(POIGetByIDData.estimated_time).local(),
                }),
                notificationBody: POIGetByIDData?.notification_description !== "undefined" && POIGetByIDData?.notification_description !== "" ? POIGetByIDData?.notification_description : '',
                notificationTitle: POIGetByIDData?.notification_title !== "undefined" && POIGetByIDData?.notification_title !== "" ? POIGetByIDData?.notification_title : '',
            }
        )
        const firstLocation = POIGetByIDData?.polygon?.locations?.[0];

        const transformedArray = POIGetByIDData?.extraFields?.map(item => {
            const { type, value, ...rest } = item;
            const newValue = type === "date" ? dayjs(value).local() : value;
            return {
                ...rest,
                value: {
                    type,
                    value: newValue
                }
            };
        });

        setExtraDataList(transformedArray || []);
        const dataPersonanal = JSON.parse(POIGetByIDData?.add_hours_worked ? POIGetByIDData?.add_hours_worked : null);
        const transformedDataPersonal = dataPersonanal?.map(item => ({
            ...item,
            date_and_hours: item.date_and_hours.map(entry => ({
                ...entry,
                date: dayjs(entry.date).local()
            }))
        }));
        setPersonanalDataArray(transformedDataPersonal == null ? [] : transformedDataPersonal)
        setParentRadius(POIGetByIDData?.polygon?.radius)
        setSafetyOffset(POIGetByIDData?.polygon?.safetyZone)
        if (POIGetByIDData?.polygon?.type == "Circle") {
            if (
                Array.isArray(firstLocation) &&
                firstLocation.length >= 2 &&
                !isNaN(firstLocation[0]) &&
                !isNaN(firstLocation[1])
            ) {
                setLocation({
                    lat: Number(firstLocation[0]),
                    lng: Number(firstLocation[1]),
                });
            }
            const killtime = setTimeout(() => {
                setSelectedTab(1)
                drawCircleForSee({
                    lat: Number(firstLocation[0]),
                    lng: Number(firstLocation[1]),
                }, POIGetByIDData?.polygon?.radius, POIGetByIDData?.polygon?.safetyZone)
                drawWithRadiusBounds(firstLocation, POIGetByIDData?.polygon?.radius)
            }, 2000);
            return () => {
                clearTimeout(killtime)
            }
        }
        else if (POIGetByIDData?.polygon?.type === "Polygon") {
            setSelectedTab(2)
            setPoints(
                POIGetByIDData?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setPadding(POIGetByIDData?.polygon?.safetyZone)
            drawPolyLinePolyGoneBond(POIGetByIDData?.polygon?.locations)
        }
        else if (POIGetByIDData?.polygon?.type === "Polyline") {
            setSelectedTab(3)
            setPointsMore(
                POIGetByIDData?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setSafetyOffsetMore(POIGetByIDData?.polygon?.safetyZone)
            drawPolyLinePolyGoneBond(POIGetByIDData?.polygon?.locations)
        }
        return () => {
            setPoints([]);
            setExtraDataList([]);
            setPersonanalDataArray([]);
            setLocation(null);
            setPointsMore([]);
            setSafetyOffset();
            setParentRadius();
            setSafetyOffsetMore(0)
            setOffsetPolygon([])
        }
    }, [POIGetByIDData, workOrderLinkData])

    useEffect(() => {
        GetAllWorkOrderUnLink(currentWorkSite)
    }, [])

    const schema = yup.object().shape({
        title: yup.string().required(),
        description: yup.string().notRequired(),
        threatLevel: yup.string().required(),
        elevationLevel: yup.array().min(1),
        linkedWorkOrder: yup.array().notRequired(),
        notificationTimeAndDate: yup.string().notRequired(),
        preNotificationTimeAndDate: yup.string().notRequired(),
        notificationTitle: yup.string().max(70, "Maximum 70 charectores are allowed").notRequired(),
        notificationBody: yup.string().max(150, "Maximum 150 charectores are allowed").notRequired(),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            threatLevel: '',
            elevationLevel: [],
            linkedWorkOrder: [],
            notificationTimeAndDate: '',
            preNotificationTimeAndDate: '',
            notificationTitle: '',
            notificationBody: '',
        },
    });

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const allWorkOrders = [...(PoiReducer?.workOrderLinkData || []), ...(PoiReducer?.workOrderUnData || [])];
    const WorkOrderData = allWorkOrders?.map(data => {
        return { value: data._id, label: data?.title }
    })

    const threatLevelOption = [
        { label: "No Risk", value: "No Threat" },
        { label: "Lowest Risk", value: "Lowest" },
        { label: "Moderate Risk", value: "Moderate" },
        { label: "High Risk", value: "High" },
        { label: "Extreme Risk", value: "Extreme" }
    ]
    const elevationLevelOption = [
        { value: "Below Ground", label: "Below Ground" },
        { value: "Ground Level", label: "Ground Level" },
        { value: "Overhead", label: "Overhead" },
    ]




    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [locationToggle, setLocationToggle] = useState(false);




    function requestLocationAgain() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // console.log("Location success:", position);
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    messageApi.destroy();
                    messageApi.open({
                        type: "error",
                        content: "You need to enable location access in your browser settings.",
                    });
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationToggle(true)
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                if (err.code === 1) {
                    setLocationToggle(false)
                    setError('Permission denied. Please allow location access in your browser settings.');
                } else if (err.code === 2) {
                    setLocationToggle(false)
                    setError('Location unavailable.');
                } else if (err.code === 3) {
                    setLocationToggle(false)
                    setError('Location request timed out.');
                } else {
                    setLocationToggle(false)
                    setError('An unknown error occurred.');
                }
                setLocationToggle(false)
                console.error('Geolocation error:', err);
            }
        );
    }, []);


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
    });

    const mapRef = useRef(null);
    const circleRef = useRef(null);
    const childCircleRef = useRef(null)
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);





    // circle 



    useEffect(() => {
        if (circleRef.current && childCircleRef.current) {
            childCircleRef.current.setRadius(parentRadius + safetyOffset);
        }
    }, [safetyOffset, parentRadius]);
    const handleOffsetChange = (e) => {
        const newOffset = Number(e.target.value);
        setSafetyOffset(newOffset);
    };



    const drawCircleForSee = (a, b, c) => {
        setPoints([])
        setPointsMore([])
        setSelectedTab(1)
        const parent = new window.google.maps.Circle({
            map: mapRef.current,
            center: a,
            radius: b,
            strokeColor: '#fe541e',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#fe541e',
            fillOpacity: 0.35,
            draggable: true,
            editable: true,
        });
        const child = new window.google.maps.Circle({
            map: mapRef.current,
            center: a,
            radius: b + c,
            strokeColor: '#1e88e5',
            strokeOpacity: 0.7,
            strokeWeight: 2,
            fillColor: '#90caf9',
            fillOpacity: 0.3,
            clickable: false,
        });
        parent.addListener('center_changed', () => {
            const newCenter = parent.getCenter();
            child.setCenter(newCenter);
            const newCenterString = {
                lat: newCenter.lat(),
                lng: newCenter.lng()
            };
            setActualCenter(newCenterString);
        });
        mapRef.current.addListener("click", (e) => {
            const newCenter = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            setActualCenter(newCenter);
            if (circleRef.current) {
                circleRef.current.setCenter(newCenter);
            }
            if (childCircleRef.current) {
                childCircleRef.current.setCenter(newCenter);
            }
        });
        parent.addListener('radius_changed', () => {
            const newRadius = parent.getRadius();
            setParentRadius(newRadius);
        });
        circleRef.current = parent;
        childCircleRef.current = child;
    };


    const drawCircle = () => {
        setPoints([])
        setPointsMore([])
        setSelectedTab(1)
        const parent = new window.google.maps.Circle({
            map: mapRef.current,
            center: location,
            radius: parentRadius,
            strokeColor: '#fe541e',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#fe541e',
            fillOpacity: 0.35,
            draggable: true,
            editable: true,
        });
        const child = new window.google.maps.Circle({
            map: mapRef.current,
            center: location,
            radius: parentRadius + safetyOffset,
            strokeColor: '#1e88e5',
            strokeOpacity: 0.7,
            strokeWeight: 2,
            fillColor: '#90caf9',
            fillOpacity: 0.3,
            clickable: false,
        });
        parent.addListener('center_changed', () => {
            const newCenter = parent.getCenter();
            child.setCenter(newCenter);
            const newCenterString = {
                lat: newCenter.lat(),
                lng: newCenter.lng()
            };
            setActualCenter(newCenterString);
        });
        mapRef.current.addListener("click", (e) => {
            const newCenter = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            setActualCenter(newCenter);
            if (circleRef.current) {
                circleRef.current.setCenter(newCenter);
            }
            if (childCircleRef.current) {
                childCircleRef.current.setCenter(newCenter);
            }
        });
        parent.addListener('radius_changed', () => {
            const newRadius = parent.getRadius();
            setParentRadius(newRadius);
        });
        circleRef.current = parent;
        childCircleRef.current = child;
    };

    const handlePolygonClick = (e) => {
        const newCenter = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };
        setActualCenter(newCenter);
        if (circleRef.current) {
            circleRef.current.setCenter(newCenter);
        }
        if (childCircleRef.current) {
            childCircleRef.current.setCenter(newCenter);
        }
    };
    // circle 




    // polygon 
    const [padding, setPadding] = useState(0);
    const getSafetyZonePath = () => {
        // if (points.length < 3) return [];
        const center = {
            lat: points.reduce((sum, p) => sum + p.lat, 0) / points.length,
            lng: points.reduce((sum, p) => sum + p.lng, 0) / points.length,
        };
        const padded = points.map((pt) => offsetPoint(pt, center, padding));
        return [...padded, padded[0]];
    };
    const offsetPoint = (point, center, offsetMeters) => {
        const R = 6378137;
        const dLat = point.lat - center.lat;
        const dLng = point.lng - center.lng;
        const len = Math.sqrt(dLat * dLat + dLng * dLng);
        const scale = (len + offsetMeters / R * (180 / Math.PI)) / len;
        return {
            lat: center.lat + dLat * scale,
            lng: center.lng + dLng * scale,
        };
    };
    const handleMapClick = useCallback((e) => {
        // if (points.length < 3) {
        const newPoint = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };
        setPoints((prev) => [...prev, newPoint]);
        // }
    }, [points]);

    const removeIconCustomArea = (indexRemover) => {
        setPoints(prev => prev?.filter((_, index) => index !== indexRemover));
    }
    const drawCustomArea = () => {
        setSelectedTab(2)
        setPointsMore([])
        circleRef.current.setMap(null);
        circleRef.current = null;
        childCircleRef.current.setMap(null);
        childCircleRef.current = null;
    }
    // polygon 











    // PolyLine
    const [safetyOffsetMore, setSafetyOffsetMore] = useState(0);
    const [offsetPolygon, setOffsetPolygon] = useState([]);
    const drawPolyLine = () => {
        setSelectedTab(3)
        setPoints([])
        circleRef.current.setMap(null);
        circleRef.current = null;
        childCircleRef.current.setMap(null);
        childCircleRef.current = null;
    }
    const handleMapClickMore = useCallback((e) => {
        setPoints([])
        const newPoint = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };
        setPointsMore((prev) => [...prev, newPoint]);
    }, []);
    function computeOffsetPolyline(points, offsetDistance) {
        const offsetLeftPoints = [];
        const offsetRightPoints = [];

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const dx = p2.lng - p1.lng;
            const dy = p2.lat - p1.lat;
            const length = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / length;
            const uy = dy / length;
            const px = -uy;
            const py = ux;
            const metersPerDegreeLat = 111320;
            const metersPerDegreeLng = 111320 * Math.cos((p1.lat * Math.PI) / 180);
            const offsetLat = (py * offsetDistance) / metersPerDegreeLat;
            const offsetLng = (px * offsetDistance) / metersPerDegreeLng;
            const offsetLeftP1 = { lat: p1.lat + offsetLat, lng: p1.lng + offsetLng };
            const offsetLeftP2 = { lat: p2.lat + offsetLat, lng: p2.lng + offsetLng };
            const offsetRightP1 = { lat: p1.lat - offsetLat, lng: p1.lng - offsetLng };
            const offsetRightP2 = { lat: p2.lat - offsetLat, lng: p2.lng - offsetLng };
            offsetLeftPoints.push(offsetLeftP1, offsetLeftP2);
            offsetRightPoints.push(offsetRightP1, offsetRightP2);
        }

        return { offsetLeftPoints, offsetRightPoints };
    }
    useEffect(() => {
        if (pointsMore.length >= 2) {
            const { offsetLeftPoints, offsetRightPoints } = computeOffsetPolyline(pointsMore, safetyOffsetMore);
            const safetyZonePath = [...offsetLeftPoints, ...offsetRightPoints.reverse()];
            setOffsetPolygon(safetyZonePath);
        } else {
            setOffsetPolygon([]);
        }
    }, [pointsMore, safetyOffsetMore]);

    const removeIconCustomArea2 = (indexRemover) => {
        setPointsMore(prev => {
            const updated = prev.filter((_, index) => index !== indexRemover);
            if (updated.length < 2) {
                setOffsetPolygon([]);
            }
            return updated;
        });
    };
    // PolyLine





    // Drawer Personanal
    const [listDrawer, setlistDrawer] = useState(false);
    const [addDrawer, setAddDrawer] = useState(false);
    const [listEditDrawer, setlistEditDrawer] = useState({});


    const showDrawer = () => {
        setlistDrawer(true);
    };
    const closeDrawer = () => {
        setlistDrawer(false);
    };
    const showAddDrawer = () => {
        setAddDrawer(true);
    };
    const closeAddDrawer = () => {
        setAddDrawer(false);
    };
    const [personanalData, setPersonanalData] = useState({
        name: '',
        date: null,
        no_of_hours: ''
    });
    const [entries, setEntries] = useState([]);
    const [personanalDataArray, setPersonanalDataArray] = useState([]);
    const handleAddMore = () => {
        if (personanalData.date && personanalData.no_of_hours) {
            setEntries(prev => [...prev, {
                date: personanalData.date,
                no_of_hours: personanalData.no_of_hours
            }]);
            setPersonanalData(prev => ({
                ...prev,
                date: null,
                no_of_hours: ''
            }));
        } else {
            messageApi.open({
                type: "error",
                content: "Please provide both date and hours",
            });
        }
    };
    const handleAddData = () => {
        if (personanalData.name && entries.length > 0) {
            setPersonanalDataArray(prev => [
                ...prev,
                { name: personanalData.name, date_and_hours: entries }
            ]);

            // Reset all fields
            setPersonanalData({ name: '', date: null, no_of_hours: '' });
            setEntries([]);
        } else {
            messageApi.open({
                type: "error",
                content: "Please fill in name and add at least one record",
            });
        }
    };
    const handleRemoveEntry = (indexToRemove) => {
        setEntries(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    const handleRemoveMainEntry = (indexToRemove) => {
        setPersonanalDataArray(prev => prev.filter((_, index) => index !== indexToRemove));
    };




    const [personanalSData, setPersonanalSData] = useState({
        date: '',
        no_of_hours: ''
    });


    const handleRemoveSEntry = (indexToRemove) => {
        setlistEditDrawer(prev => ({
            ...prev,
            date_and_hours: prev.date_and_hours.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSAddData = () => {
        if (personanalSData.date && personanalSData?.no_of_hours) {
            setlistEditDrawer(prev => ({
                ...prev,
                date_and_hours: [
                    ...(prev.date_and_hours || []),
                    personanalSData
                ]
            }));
            setPersonanalSData({
                date: '',
                no_of_hours: ''
            })
        } else {
            messageApi.open({
                type: "error",
                content: "Please fill in date and hours",
            });
        }
    };
    const handleUpdateHours = () => {
        if (!listEditDrawer?.name || listEditDrawer?.date_and_hours?.length <= 0) {
            messageApi.destroy()
            messageApi.open({
                type: "error",
                content: "Please fill required fields",
            });
            return;
        }
        else {
            setPersonanalDataArray(prevList => {
                const newList = prevList.map((item, index) =>
                    index === listEditDrawer.id ? listEditDrawer : item
                );
                return newList;
            });
            setlistEditDrawer({})
            return;
        }
    };
    // Drawer Personanal









    // Drawer Extra Data
    const [extraListData, setExtraListData] = useState(false);
    const [extraAddData, setExtraAddData] = useState(false);
    const [selectedInput, setSelectedInput] = useState("input");
    const [selectedInputEdit, setSelectedInputEdit] = useState("");
    const [editExtraDataList, setEditExtraDataList] = useState({});

    const showExtraDrawer = () => {
        setExtraListData(true);
    };
    const closeExtraDrawer = () => {
        setExtraListData(false);
    };
    const showAddExtraDrawer = () => {
        setExtraAddData(true);
    };
    const closeAddExtraDrawer = () => {
        setExtraAddData(false);
    };
    const [extraDataState, setExtraDataState] = useState({
        name: '',
        description: null,
        value: { type: '', value: '' }
    });
    const items = [
        {
            label: (
                <div onClick={() => {
                    setSelectedInput("input")
                    setExtraDataState(prev => ({
                        ...prev,
                        value: { type: '', value: '' }
                    }));
                }}>
                    Input
                </div>
            ),
            key: '0',
        },
        {
            label: (
                <div onClick={() => {
                    setSelectedInput("boolean")
                    setExtraDataState(prev => ({
                        ...prev,
                        value: { type: 'boolean', value: true }
                    }));
                }} >
                    Boolean
                </div>
            ),
            key: '1',
        },
        {
            label: (
                <div onClick={() => {
                    setSelectedInput("date")
                    setExtraDataState(prev => ({
                        ...prev,
                        value: { type: '', value: '' }
                    }));
                }}>
                    Date
                </div>
            ),
            key: '2',
        },
        {
            label: (
                <div onClick={() => {
                    setSelectedInput("color")
                    setExtraDataState(prev => ({
                        ...prev,
                        value: { type: '', value: '' }
                    }));
                }}>
                    Color
                </div>
            ),
            key: '3',
        },
    ];

    const [extraDataList, setExtraDataList] = useState([]);

    const itemsEdit = [
        {
            label: (
                <div onClick={() => {
                    setSelectedInputEdit("input")
                    setEditExtraDataList(prev => ({
                        ...prev,
                        value: { type: '', value: '' }
                    }));
                }}>
                    Input
                </div>
            ),
            key: '0',
        },
        {
            label: (
                <div onClick={() => {
                    setSelectedInputEdit("boolean")
                    setEditExtraDataList(prev => ({
                        ...prev,
                        value: { type: 'boolean', value: true }
                    }));
                }} >
                    Boolean
                </div>
            ),
            key: '1',
        },
        {
            label: (
                <div onClick={() => {
                    setSelectedInputEdit("date")
                    setEditExtraDataList(prev => ({
                        ...prev,
                        value: { type: '', value: '' }
                    }));
                }}>
                    Date
                </div>
            ),
            key: '2',
        },
        {
            label: (
                <div onClick={() => {
                    setSelectedInputEdit("color")
                    setEditExtraDataList(prev => ({
                        ...prev,
                        value: { type: '', value: '' }
                    }));
                }}>
                    Color
                </div>
            ),
            key: '3',
        },
    ];
    const handleAddExtraData = () => {
        if (!extraDataState?.name || extraDataState?.value?.value === "") {
            messageApi.destroy()
            messageApi.open({
                type: "error",
                content: "Please fill required fields",
            });
            return;
        }
        else {
            setExtraDataList(prev => [...prev, extraDataState]);
            if (extraDataState.value.type == "boolean") {
                setExtraDataState({
                    name: '',
                    description: '',
                    value: { type: 'Boolean', value: true }
                });
            }
            else {
                setExtraDataState({
                    name: '',
                    description: '',
                    value: { type: '', value: '' }
                });
            }
        }
    };
    const handleUpdateExtraData = () => {
        if (!editExtraDataList?.name || editExtraDataList?.value?.value === "") {
            messageApi.destroy()
            messageApi.open({
                type: "error",
                content: "Please fill required fields",
            });
            return;
        }
        else {
            setExtraDataList(prevList => {
                const newList = prevList.map((item, index) =>
                    index === editExtraDataList.id ? editExtraDataList : item
                );
                return newList;
            });
            if (editExtraDataList.value.type == "boolean") {
                setEditExtraDataList({
                    name: null,
                    description: null,
                    value: { type: 'Boolean', value: true }
                });
            }
            else {
                setEditExtraDataList({
                    name: null,
                    description: null,
                    value: { type: '', value: '' }
                });
            }
            return;
        }
    };
    const handleRemoveExtraEntry = (indexToRemove) => {
        if (indexToRemove === editExtraDataList?.id) {
            if (editExtraDataList.value.type == "Boolean") {
                setEditExtraDataList({
                    name: null,
                    description: null,
                    value: { type: 'Boolean', value: true }
                });
                setExtraDataList(prev => prev?.filter((_, index) => index !== indexToRemove));
            }
            else {
                setEditExtraDataList(prev => ({
                    name: null,
                    description: null,
                    value: { type: '', value: '' }
                }));
                setExtraDataList(prev => prev?.filter((_, index) => index !== indexToRemove));
            }
        }
        else {
            setExtraDataList(prev => prev?.filter((_, index) => index !== indexToRemove));
        }
    };
    // Drawer Extra Data
















    const [emailCTC, setEmailCTC] = useState("")
    const [listemailCTC, setListEmailCTC] = useState([])
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


    const [photosOrVideos, setPhotosOrVideos] = useState([])
    const [safetyDocumentation, setSafetyDocumentation] = useState([])
    const [warrantyDocumentation, setWarrantyDocumentation] = useState([])
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


    function generateBase64UrlId(byteLength = 64) {
        const bytes = new Uint8Array(byteLength);
        crypto.getRandomValues(bytes);
        return btoa(String.fromCharCode(...bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
    const [CreateLoading, setCreateLoading] = useState(false)





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

    const [isExcel, setIsExcel] = useState(false)
    const isSendExcel = checked => {
        setIsExcel(checked)
    };

    const adddataWorkOrder = async (data) => {

        const centerLNG = points.reduce(
            (acc, point) => {
                acc.lat += point.lat;
                acc.lng += point.lng;
                return acc;
            },
            { lat: 0, lng: 0 }
        );
        const totalPoints = points.length;
        centerLNG.lat /= totalPoints;
        centerLNG.lng /= totalPoints;





        const centerLNGMore = pointsMore.reduce(
            (acc, point) => {
                acc.lat += point.lat;
                acc.lng += point.lng;
                return acc;
            },
            { lat: 0, lng: 0 }
        );
        const totalPointsMore = pointsMore.length;
        centerLNGMore.lat /= totalPointsMore;
        centerLNGMore.lng /= totalPointsMore;

        const totalItems = [
            ...warrantyDocumentation,
            ...photosOrVideos,
        ].length;

        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const {
            notificationTimeAndDate: rawNotificationTimeAndDate,
        } = data;

        const notificationTimeAndDate = dayjs(rawNotificationTimeAndDate == undefined ? "Invalid Date" : rawNotificationTimeAndDate).format('YYYY-MM-DD HH:mm:ss')
        const notificationTime = dayjs(rawNotificationTimeAndDate == undefined ? "Invalid Date" : rawNotificationTimeAndDate);
        const rawPreNotification = data?.preNotificationTimeAndDate;
        const preNotificationNumber = Number(rawPreNotification);
        const preNotificationOffset =
            !preNotificationNumber || isNaN(preNotificationNumber) ? 5 : preNotificationNumber; 
        const preNotificationTime = notificationTime.subtract(preNotificationOffset, 'minute');
        const preNotificationTimeFormatted = preNotificationTime.format('YYYY-MM-DD HH:mm:ss');

        const allWorkOrders = [...(PoiReducer?.workOrderLinkData || []), ...(PoiReducer?.workOrderUnData || [])];
        const workOrderIDs = allWorkOrders.filter(item =>
            data?.linkedWorkOrder.includes(item._id)
        );
        const workOrderIDsAll = workOrderIDs.map(item => item._id);
        const removedWorkOrders = allWorkOrders.filter(item =>
            !data?.linkedWorkOrder.includes(item._id)
        );
        const removedWorkOrderIDs = removedWorkOrders.map(item => item._id);
        const formData = new FormData();
        formData.append("title", data?.title);
        formData.append("suggestionId", current_Id);
        formData.append("description", data?.description);
        formData.append("riskLevel", data?.threatLevel);
        formData.append("worksiteId", currentWorkSite);
        formData.append('workOrders', JSON.stringify(workOrderIDsAll));
        formData.append('removeWorkOrders', JSON.stringify(removedWorkOrderIDs));
        if (extraDataList.length > 0) {
            const convertedArray = extraDataList.map(item => ({
                name: item.name,
                description: item.description,
                value: item.value.type === 'date'
                    ? dayjs(item.value.value).format('YYYY-MM-DD')
                    : item.value.type === 'color' ? rgbaStringToPipe(item.value.value) : item.value.value,
                type: item.value.type,
                isRequired: false,
            }));
            formData.append("extraFields", JSON.stringify(convertedArray));
        }
        formData.append("reminder_time", preNotificationTimeFormatted == "Invalid Date" ? "" : notificationTimeAndDate == "Invalid Date" ? "" : preNotificationTimeFormatted);
        formData.append("estimated_time", notificationTimeAndDate == "Invalid Date" ? "" : notificationTimeAndDate);
        formData.append("notification_title", data?.notificationTitle);

        formData.append("notification_description", data?.notificationBody);
        data?.elevationLevel.forEach(level => {
            formData.append('elevationLevels', level);
        });

        [...warrantyDocumentation, ...photosOrVideos].forEach(file => {
            formData.append('files', file, file.name);
        });
        formData.append("filesId", JSON.stringify(POIGetByIDData?.files?.filter(data => !deletePhoto.includes(data?._id)).map(data => { return data._id })))
        const metaString = JSON.stringify({
            id: POIGetByIDData?._id,
            type: "report",
            title: data?.title,
        });
        if (selectedTab == 1) {
            const CircleData = {
                type: "Circle",
                locations: actualCenter == null
                    ? [
                        [
                            location.lat?.toString(),
                            location.lng?.toString(),
                        ]
                    ]
                    : [
                        [
                            actualCenter?.lat?.toString(),
                            actualCenter?.lng?.toString(),
                        ]
                    ],
                safetyZone: safetyOffset,
                altitude: Number(altitude),
                radius: parentRadius,
                meta: metaString,
            };
            formData.append(
                "polygon",
                JSON.stringify({
                    safetyZone: CircleData.safetyZone || 0.0,
                    altitude: CircleData.altitude || 0.0,
                    radius: CircleData.radius || 0.0,
                    locations: CircleData.locations.length > 0
                        ? CircleData.locations
                        : [],
                    type: "Circle",
                    meta: CircleData.meta || "{}",
                    latitude: location.lat,
                    longitude: location.lng,
                })
            );
        }
        else if (selectedTab == 2) {
            const CircleData = {
                type: "Polygon",
                locations: actualCenter == null
                    ? points.map(location => [
                        location.lat.toString(),
                        location.lng.toString(),
                    ])
                    : points.map(location => [
                        location.lat.toString(),
                        location.lng.toString(),
                    ]),
                safetyZone: padding,
                altitude: Number(altitude),
                radius: parentRadius,
                meta: metaString,
            };
            formData.append(
                "polygon",
                JSON.stringify({
                    safetyZone: CircleData.safetyZone || 0.0,
                    altitude: CircleData.altitude || 0.0,
                    radius: CircleData.radius || 0.0,
                    locations: CircleData.locations.length > 0
                        ? CircleData.locations
                        : [],
                    type: CircleData.type,
                    meta: CircleData.meta || "{}",
                    latitude: centerLNG.lat,
                    longitude: centerLNG.lng,
                })
            );

        }
        else if (selectedTab == 3) {
            const CircleData = {
                type: "Polyline",
                locations: actualCenter == null
                    ? pointsMore.map(location => [
                        location.lat.toString(),
                        location.lng.toString(),
                    ])
                    : pointsMore.map(location => [
                        location.lat.toString(),
                        location.lng.toString(),
                    ]),
                safetyZone: safetyOffsetMore,
                altitude: Number(altitude),
                radius: parentRadius,
                meta: metaString,
            };
            formData.append(
                "polygon",
                JSON.stringify({
                    safetyZone: CircleData.safetyZone || 0.0,
                    altitude: CircleData.altitude || 0.0,
                    radius: CircleData.radius || 0.0,
                    locations: CircleData.locations.length > 0
                        ? CircleData.locations
                        : [],
                    type: CircleData.type,
                    meta: CircleData.meta || "{}",
                    latitude: centerLNGMore.lat,
                    longitude: centerLNGMore.lng,
                })
            );
        }
        else null
        if (
            selectedTab !== undefined &&
            points.length > 2 ||
            pointsMore.length > 2 ||
            circleRef.current !== null
        ) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => {
                    controller.abort();
                }, 1000000);
                setCreateLoading(true)
                const options = {
                    method: "PATCH",
                    headers: {
                        "authorization": `Bearer ${token}`,
                    },
                    body: formData,
                    signal: controller.signal,
                };
                const response = await fetch(`${baseUrl}/suggestions`, options);
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
                    messageApi.open({
                        type: "success",
                        content: "POI created successfully.",
                    });
                    setCreateLoading(false)
                    navigate('/POI/Poi')
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
            if (selectedTab === undefined || selectedTab === 0) {
                messageApi.destroy()
                messageApi.open({
                    type: "error",
                    content: "Please choose area in map",
                });
            } else if (points.length <= 2 || pointsMore.length <= 2) {
                messageApi.destroy()
                messageApi.open({
                    type: "error",
                    content: "Please select minimum 3 points",
                });
            }
        }
    }


    const [value1, setValue1] = useState(null);
    const locationDataFunc = (ee) => {
        setValue1(ee)
        geocodeByAddress(ee?.label)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) =>
                setLocation({
                    lat: lat,
                    lng: lng,
                })
            );
    }

    const [locationCurrent, setLocationCurrent] = useState(null);
    const handleRecenter = () => {
        if (mapRef.current) {
            mapRef.current.panTo(new window.google.maps.LatLng(locationCurrent?.lat, locationCurrent?.lng));
            mapRef.current.setZoom(14.5);
        }
    };


    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationCurrent({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                if (err.code === 1) {
                    setError('Permission denied. Please allow location access in your browser settings.');
                } else if (err.code === 2) {
                    setError('Location unavailable.');
                } else if (err.code === 3) {
                    setError('Location request timed out.');
                } else {
                    setError('An unknown error occurred.');
                }
                console.error('Geolocation error:', err);
            }
        );
    }, []);








    const selectedTabRef = useRef(selectedTab);

    useEffect(() => {
        selectedTabRef.current = selectedTab;
    }, [selectedTab]);

    const drawCircleWorkSite = (loc, radius, safetyZone2) => {
        const worksiteParent = new window.google.maps.Circle({
            map: mapRef.current,
            center: loc,
            radius: radius,
            strokeColor: '#050c1f',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0d1e4b',
            fillOpacity: 0.35,
            draggable: false,
            editable: false,
        });

        worksiteParent.addListener('click', (e) => {
            if (selectedTabRef.current === 2) {
                handleMapClick(e);
            } else if (selectedTabRef.current === 3) {
                handleMapClickMore(e);
            }
            const newCenter = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            setActualCenter(newCenter);
            if (circleRef.current) {
                circleRef.current.setCenter(newCenter);
            }
            if (childCircleRef.current) {
                childCircleRef.current.setCenter(newCenter);
            }
        });

        return worksiteParent;
    };


    const [workSiteMarker, setWorkSiteMarker] = useState(null)
    const [pointsWorkSite, setPointsWorkSite] = useState([]);
    const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);


    useEffect(() => {
        const polygons = PoiReducer?.workSiteData.find(data => data._id == currentWorkSite)?.polygon;
        const firstLocation = polygons?.locations?.[0];
        if (polygons?.type == "Circle") {
            const killtime = setTimeout(() => {
                drawCircleWorkSite({
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
    }, [PoiReducer?.workSiteData])




    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (

        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>Edit POI</h1>
                        <button disabled={CreateLoading} onClick={handleSubmit(adddataWorkOrder)}>{CreateLoading ? "Saving POI..." : "Save POI"}</button>
                    </div>
                    <div className={Style.ActionHeader}></div>
                </div>
                <div className={Style.TableSection}>
                    <div className={Style.FeildSide}>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColRight}>
                                <label>Title</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input disabled={CreateLoading} onChange={onChange} value={value} status={errors?.title?.message !== undefined ? 'error' : ''} placeholder='Enter Title' style={{ height: 45, marginTop: 3 }} />
                                    )}
                                    name="title"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Threat Level</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            disabled={CreateLoading}
                                            placeholder="Select Threat Level"
                                            onChange={onChange}
                                            value={value == "" ? null : value}
                                            status={errors?.threatLevel?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={threatLevelOption}
                                        />)}
                                    name="threatLevel"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Elevation Level</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            mode="multiple"
                                            disabled={CreateLoading}
                                            placeholder="Select Elevation Level"
                                            onChange={onChange}
                                            value={value == "" ? null : value}
                                            status={errors?.elevationLevel?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={elevationLevelOption}
                                        />)}
                                    name="elevationLevel"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Linked work order <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        if (WorkOrderData.length <= 0 && value.length <= 0) return (
                                            <button type='button' className={`${Style.NoFoundWorkOrder} ant-input`} disabled={CreateLoading} onClick={() => navigate('/workorder/create?refer=editPOI')}>Create work order</button>
                                        )
                                        return (
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                mode="multiple"
                                                loading={PoiReducer?.workOrderLoading}
                                                disabled={PoiReducer?.workOrderLoading || CreateLoading}
                                                placeholder="Select Linked work order"
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.linkedWorkOrder?.message !== undefined ? 'error' : ''}
                                                style={{ marginTop: 3, width: "100%", height: 45 }}
                                                options={WorkOrderData}
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
                                                            onClick={() => navigate('/workorder/create?refer=editPOI')}
                                                        >
                                                            Create work order
                                                        </div>
                                                    </>
                                                )}
                                            />)
                                    }}
                                    name="linkedWorkOrder"
                                />
                            </div>
                        </div>

                        {/*<div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Chargeable Profit Center</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Select
       getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                disabled={CreateLoading}
                                                placeholder="Select Chargeable Profit"
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.ChargeableProfitCenter?.message !== undefined ? 'error' : ''}
                                                style={{ marginTop: 3, width: "100%", height: 45 }}
                                            // options={CpcOption}
                                            />)
                                    }}
                                    name="ChargeableProfitCenter"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Completion Date Requirement</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value} status={errors?.CompletionDate?.message !== undefined ? 'error' : ''} placeholder='Select Completion Date Requirement' style={{ height: 45, marginTop: 3 }} />
                                    )}
                                    name="CompletionDate"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Location <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Input disabled={CreateLoading} onChange={onChange} value={value} status={errors?.Location?.message !== undefined ? 'error' : ''} placeholder='Enter Location' style={{ height: 45, marginTop: 3 }} />
                                        )
                                    }}
                                    name="Location"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Hot Work <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Select
       getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                disabled={CreateLoading}
                                                placeholder="Select Hot Work"
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.HotWork?.message !== undefined ? 'error' : ''}
                                                style={{ marginTop: 3, width: "100%", height: 45 }}
                                                options={BooleanOpiton}
                                            />)
                                    }}
                                    name="HotWork"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Entry Requirment <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Input disabled={CreateLoading} onChange={onChange} value={value} status={errors?.EntryRequirment?.message !== undefined ? 'error' : ''} placeholder='Enter Entry Requirment' style={{ height: 45, marginTop: 3 }} />

                                        )
                                    }}
                                    name="EntryRequirment"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Personanal <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <div className={Style.AddExtraDataFeild} onClick={showAddDrawer}>
                                    <div>
                                        <p>Hours Worked<span> {`(${personanalDataArray.length})`}</span></p>
                                    </div>
                                    <div>
                                        <button>Add</button>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Notification Title <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Input maxLength={70} disabled={CreateLoading} onChange={onChange} value={value} status={errors?.notificationTitle?.message !== undefined ? 'error' : ''} placeholder='Enter Notification Title' style={{ height: 45, marginTop: 3 }} />
                                        )
                                    }}
                                    name="notificationTitle"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Pre-Notification Time (In min) <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <InputNumber max={999} maxLength={3} disabled={CreateLoading} min={5} onChange={onChange} value={value} status={errors?.preNotificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Enter Pre-Notification Time' style={{ height: 45, marginTop: 3, width: '100%', display: 'flex', alignItems: 'center' }} />
                                    )}
                                    name="preNotificationTimeAndDate"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Add Extra Data <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <div className={Style.AddExtraDataFeild} onClick={showAddExtraDrawer}>
                                    <div>
                                        <p>Extra Data<span> ({extraDataList.length})</span></p>
                                    </div>
                                    <div>
                                        <button disabled={CreateLoading}>Add</button>
                                    </div>
                                </div>
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Notification Date & Time <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45, marginTop: 3 }} />
                                    )}
                                    name="notificationTimeAndDate"
                                />
                            </div>
                            {/* extra Data drawer */}
                            <Drawer
                                title="Add Extra Data"
                                placement={'right'}
                                onClose={closeAddExtraDrawer}
                                open={extraAddData}
                                key={'right'}
                                maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                            >
                                {editExtraDataList?.name !== undefined && editExtraDataList?.name !== null ?
                                    <>
                                        <div style={{ paddingTop: 10 }}>
                                            <label>Name <span style={{ color: 'red' }}>*</span></label>
                                            <Input value={editExtraDataList?.name} onChange={(e) => setEditExtraDataList(prev => ({ ...prev, name: e.target.value }))} placeholder='Name here' style={{ height: 45, marginTop: 3 }} />
                                        </div>
                                        <div style={{ paddingTop: 15 }}>
                                            <label>Description</label>
                                            <Input.TextArea onFocus={() => {
                                                document.body.style.overflow = "hidden";
                                            }}
                                                onBlur={() => {
                                                    document.body.style.overflow = "auto";
                                                }} value={editExtraDataList.description} onChange={(e) => setEditExtraDataList(prev => ({ ...prev, description: e.target.value }))} rows={6} placeholder='Description here' style={{ marginTop: 3 }} />
                                        </div>
                                        <div style={{ paddingTop: 15, display: 'flex', alignItems: 'flex-end', }}>
                                            <div style={{ width: '88%', display: 'inline-grid' }}>
                                                {selectedInputEdit === "input" && (
                                                    <>
                                                        <label>Value <span style={{ color: 'red' }}>*</span></label>
                                                        <Input
                                                            value={editExtraDataList?.value?.value}
                                                            onChange={(e) =>
                                                                setEditExtraDataList(prev => ({
                                                                    ...prev,
                                                                    value: { type: "input", value: e.target.value }
                                                                }))
                                                            }
                                                            placeholder='Value here'
                                                            style={{ height: 45, marginTop: 3 }}
                                                        />
                                                    </>
                                                )}
                                                {selectedInputEdit === "boolean" && (
                                                    <div style={{ display: 'flex', height: 45, alignItems: 'center', width: 30 }}>
                                                        <label>Boolean</label>
                                                        <Switch
                                                            checked={editExtraDataList?.value?.value}
                                                            onChange={(checked) =>
                                                                setEditExtraDataList(prev => ({
                                                                    ...prev,
                                                                    value: { type: "boolean", value: checked }
                                                                }))
                                                            }
                                                            style={{ marginLeft: 5 }}
                                                        />
                                                    </div>
                                                )}

                                                {selectedInputEdit === "date" && (
                                                    <>
                                                        <label>Value <span style={{ color: 'red' }}>*</span></label>
                                                        <DatePicker inputReadOnly
                                                            value={editExtraDataList?.value?.value}
                                                            minDate={dayjs(formattedDate, dateFormat2)}
                                                            onChange={(date) =>
                                                                setEditExtraDataList(prev => ({
                                                                    ...prev,
                                                                    value: { type: "date", value: date }
                                                                }))
                                                            }
                                                            placeholder='Select Date'
                                                            style={{ height: 45, marginTop: 3 }}
                                                        />
                                                    </>
                                                )}

                                                {selectedInputEdit === "color" && (
                                                    <>
                                                        <label>Value <span style={{ color: 'red' }}>*</span></label>
                                                        <ColorPicker
                                                            value={editExtraDataList?.value?.value}
                                                            onChange={(color) =>
                                                                setEditExtraDataList(prev => ({
                                                                    ...prev,
                                                                    value: { type: "color", value: color.toRgbString() }
                                                                }))
                                                            }
                                                            format='rgb'
                                                            size="small"
                                                            showText
                                                            style={{ height: 45, marginTop: 3 }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                            <div style={{ width: "12%", height: width > 1500 ? 45 : 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <Dropdown trigger={['click']} menu={{ items: itemsEdit }}>
                                                    <IoSettingsOutline size={22} color='black' />
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div style={{ paddingTop: 10 }}>
                                            <label>Name <span style={{ color: 'red' }}>*</span></label>
                                            <Input value={extraDataState.name} onChange={(e) => setExtraDataState(prev => ({ ...prev, name: e.target.value }))} placeholder='Name here' style={{ height: 45, marginTop: 3 }} />
                                        </div>
                                        <div style={{ paddingTop: 15 }}>
                                            <label>Description</label>
                                            <Input.TextArea onFocus={() => {
                                                document.body.style.overflow = "hidden";
                                            }}
                                                onBlur={() => {
                                                    document.body.style.overflow = "auto";
                                                }} value={extraDataState.description}
                                                onChange={(e) => setExtraDataState(prev => ({ ...prev, description: e.target.value }))} rows={6} placeholder='Description here' style={{ marginTop: 3 }} />
                                        </div>

                                        <div style={{ paddingTop: 15, display: 'flex', alignItems: 'flex-end', }}>
                                            <div style={{ width: '88%', display: 'inline-grid' }}>
                                                {selectedInput === "input" && (
                                                    <>
                                                        <label>Value <span style={{ color: 'red' }}>*</span></label>
                                                        <Input
                                                            value={extraDataState.value.value}
                                                            onChange={(e) =>
                                                                setExtraDataState(prev => ({
                                                                    ...prev,
                                                                    value: { type: "input", value: e.target.value }
                                                                }))
                                                            }
                                                            placeholder='Value here'
                                                            style={{ height: 45, marginTop: 3 }}
                                                        />
                                                    </>
                                                )}
                                                {selectedInput === "boolean" && (
                                                    <div style={{ display: 'flex', height: 45, alignItems: 'center' }}>
                                                        <label>Boolean</label>
                                                        <Switch
                                                            checked={extraDataState.value.value}
                                                            onChange={(checked) =>
                                                                setExtraDataState(prev => ({
                                                                    ...prev,
                                                                    value: { type: "boolean", value: checked }
                                                                }))
                                                            }
                                                            style={{ marginLeft: 5, width: 30 }}
                                                        />
                                                    </div>
                                                )}

                                                {selectedInput === "date" && (
                                                    <>
                                                        <label>Value <span style={{ color: 'red' }}>*</span></label>
                                                        <DatePicker inputReadOnly
                                                            value={extraDataState.value.value}
                                                            minDate={dayjs(formattedDate, dateFormat2)}
                                                            onChange={(date) =>
                                                                setExtraDataState(prev => ({
                                                                    ...prev,
                                                                    value: { type: "date", value: date }
                                                                }))
                                                            }
                                                            placeholder='Select Date'
                                                            style={{ height: 45, marginTop: 3 }}
                                                        />
                                                    </>
                                                )}

                                                {selectedInput === "color" && (
                                                    <>
                                                        <label>Value <span style={{ color: 'red' }}>*</span></label>
                                                        <ColorPicker
                                                            value={extraDataState.value.value}
                                                            onChange={(color) =>
                                                                setExtraDataState(prev => ({
                                                                    ...prev,
                                                                    value: { type: "color", value: color.toRgbString() }
                                                                }))
                                                            }
                                                            defaultValue="#1677ff"
                                                            format='rgb'
                                                            size="small"
                                                            showText
                                                            style={{ height: 45, marginTop: 3 }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                            <div style={{ width: "12%", height: width > 1500 ? 45 : 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <Dropdown trigger={['click']} menu={{ items }}>
                                                    <IoSettingsOutline size={22} color='black' />
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </>
                                }
                                <div style={{ width: "100%", paddingTop: 20, marginBottom: 20 }}>
                                    <button onClick={editExtraDataList?.name !== undefined && editExtraDataList?.name !== null ? handleUpdateExtraData : handleAddExtraData} className={Style.AddWorkBtn}>{editExtraDataList?.name !== undefined && editExtraDataList?.name !== null ? "Update" : "Add"} Data</button>
                                </div>


                                {extraDataList?.length > 0 ? extraDataList.map((data, index) => {
                                    return (
                                        <Dropdown placement='bottomLeft' trigger={['click']} menu={{
                                            items: [
                                                {
                                                    key: '4',
                                                    label: (
                                                        <div onClick={() => handleRemoveExtraEntry(index)} style={{ display: 'flex', alignItems: 'center' }}>
                                                            <MdOutlineDeleteOutline size={22} color='red' />
                                                            <p style={{ margin: "0px 0px 0px 2px", }}>Delete</p>
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    key: '24',
                                                    label: (
                                                        <div onClick={() => {
                                                            setEditExtraDataList({ ...data, id: index })
                                                            setSelectedInputEdit(data?.value?.type)
                                                        }} style={{ display: 'flex', alignItems: 'center' }}>
                                                            <MdOutlineModeEditOutline size={22} />
                                                            <p style={{ margin: "0px 0px 0px 2px", }}>Edit</p>
                                                        </div>
                                                    ),
                                                },
                                            ],
                                        }}>
                                            <div key={index} className={Style.MainListingHourWork} style={{ marginTop: 10 }}>
                                                <div className={Style.HoursWorkListTop}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 }}>
                                                            <label style={{ fontWeight: '500' }}>{data.name}</label>
                                                        </div>
                                                        {data?.value?.type == "input" ?
                                                            <Input disabled={true} contentEditable={false} value={data?.value?.value.toString()} style={{ height: 45, marginTop: 3 }} />
                                                            : data?.value?.type == "boolean" ?
                                                                <Switch
                                                                    checked={data?.value?.value}
                                                                    style={{ marginLeft: 5, width: 30 }}
                                                                />
                                                                : data?.value?.type == "date" ?
                                                                    <DatePicker inputReadOnly
                                                                        disabled={true}
                                                                        value={data?.value?.value}
                                                                        style={{ height: 45, marginTop: 3 }}
                                                                        contentEditable={false}
                                                                    /> : data?.value?.type == "color" ?
                                                                        <ColorPicker
                                                                            disabled={true}
                                                                            format='rgb'
                                                                            value={data?.value?.value}
                                                                            showText
                                                                            style={{ height: 45, marginTop: 3 }}
                                                                        /> : ""
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    <p style={{ marginBottom: 0, marginTop: 10, fontSize: 14, color: '#898989' }}>{data?.description}</p>
                                                </div>
                                            </div>
                                        </Dropdown>
                                    );
                                }) : ""}
                            </Drawer>
                            {/* extra Data drawer */}
                        </div>
                        <div className={Style.FeildRow} style={{ alignItems: 'flex-start' }}>
                            <div className={Style.FeildColRight} style={{ width: '100%' }}>
                                <label>Description <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Input.TextArea onFocus={() => {
                                                document.body.style.overflow = "hidden";
                                            }}
                                                onBlur={() => {
                                                    document.body.style.overflow = "auto";
                                                }} disabled={CreateLoading} rows={6} onChange={onChange} value={value} status={errors?.description?.message !== undefined ? 'error' : ''} placeholder='Enter Description' style={{ marginTop: 3 }} />

                                        )
                                    }}
                                    name="description"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow} style={{ alignItems: 'flex-start' }}>
                            <div className={Style.FeildColRight} style={{ width: '100%' }}>
                                <label>Notification Body <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Input.TextArea onFocus={() => {
                                                document.body.style.overflow = "hidden";
                                            }}
                                                onBlur={() => {
                                                    document.body.style.overflow = "auto";
                                                }} maxLength={150} disabled={CreateLoading} rows={6} onChange={onChange} value={value} status={errors?.notificationBody?.message !== undefined ? 'error' : ''} placeholder='Enter Notification Body' style={{ marginTop: 3 }} />
                                        )
                                    }}
                                    name="notificationBody"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start' }}>
                            <div className={Style.FeildColLeft}>
                                {/* <label style={{ marginBottom: 10 }}>Upload Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setWarrantyDocumentation(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} accept={".pdf"} multiple={true} disabled={CreateLoading} beforeUpload={handleBeforeUpload1}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload> */}


                                <label style={{ marginBottom: 10 }}>Upload Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setWarrantyDocumentation(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} accept={".pdf"} multiple={true} disabled={CreateLoading} beforeUpload={handleBeforeUpload1}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                <div style={{ marginTop: 10 }}>
                                    {POIGetByIDData?.files?.length > 0 ? POIGetByIDData?.files.filter(data => !deletePhoto.includes(data?._id) &&
                                        ['pdf'].includes(data?.fileName?.split('.').pop()?.toLowerCase())).map(data => {
                                            return (
                                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                                                    <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                        {data?.fileName}
                                                    </a>
                                                    <div onClick={() => setDeletePhoto(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                        <AiOutlineDelete size={22} color='red' />
                                                    </div>
                                                </div>

                                            )
                                        }) : ""}
                                </div>
                            </div>
                            <div className={Style.FeildColLeft}>
                                {/* <label style={{ marginBottom: 10 }}>Upload Photo <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setPhotosOrVideos(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} multiple={true} accept={".png,.jpg,.jpeg,.svg"} disabled={CreateLoading} beforeUpload={handleBeforeUpload2}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload> */}


                                <label style={{ marginBottom: 10 }}>Upload Photo <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setPhotosOrVideos(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} multiple={true} accept={".png,.jpg,.jpeg"} disabled={CreateLoading} beforeUpload={handleBeforeUpload2}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                <div style={{ marginTop: 10 }}>
                                    {POIGetByIDData?.files?.length > 0 ? POIGetByIDData?.files.filter(file =>
                                        !deletePhoto.includes(file?._id) &&
                                        ['png', 'jpg', 'jpeg', 'svg'].includes(file?.fileName?.split('.').pop()?.toLowerCase())
                                    ).map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                                                <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                    {data?.fileName}
                                                </a>
                                                <div onClick={() => setDeletePhoto(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>
                                        )
                                    }) : ""}
                                </div>
                            </div>



                        </div>
                    </div >
                    <div className={Style.MapSide}>
                        {isLoaded ? (
                            <>
                                <GoogleMapCreate
                                    locationCurrent={locationCurrent}
                                    center={location}
                                    onMapLoad={onMapLoad}
                                    onClick={selectedTab === 2 ? handleMapClick : selectedTab === 3 ? handleMapClickMore : null}
                                    points={points}
                                    pointsMore={pointsMore}
                                    pointsWorkSite={pointsWorkSite}
                                    pointsMoreWorkSite={pointsMoreWorkSite}
                                    offsetPolygon={offsetPolygon}
                                    selectedTab={selectedTab}
                                    location={location}
                                    workSiteMarker={workSiteMarker}
                                    myLocationMarker={myLocationMarker}
                                    WorkSiteIcon={WorkSiteIcon}
                                    circleRef={circleRef}
                                    padding={padding}
                                    setPadding={setPadding}
                                    safetyOffset={safetyOffset}
                                    safetyOffsetMore={safetyOffsetMore}
                                    setSafetyOffsetMore={setSafetyOffsetMore}
                                    altitude={altitude}
                                    setAltitude={setAltitude}
                                    drawCircle={drawCircle}
                                    drawCustomArea={drawCustomArea}
                                    drawPolyLine={drawPolyLine}
                                    removeIconCustomArea={removeIconCustomArea}
                                    removeIconCustomArea2={removeIconCustomArea2}
                                    handleOffsetChange={handleOffsetChange}
                                    handleRecenter={handleRecenter}
                                    locationToggle={locationToggle}
                                    requestLocationAgain={requestLocationAgain}
                                    value1={value1}
                                    locationDataFunc={locationDataFunc}
                                    getSafetyZonePath={getSafetyZonePath}
                                    handlePolygonClick={handlePolygonClick}
                                />
                            </>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: "100%" }}>
                                <Spin size='default' />
                            </div>
                        )}
                    </div>
                </div >
            </div >
        </>
    )
}

function mapStateToProps({ PoiReducer }) {
    return { PoiReducer };
}
export default connect(mapStateToProps, POIAction)(POIScreenEdit);
