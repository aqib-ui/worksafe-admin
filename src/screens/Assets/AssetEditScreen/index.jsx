import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './AssetsEditScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider, Checkbox } from 'antd'
import * as AssetsAction from '../../../../store/actions/Assets/index';
import * as POIAction from '../../../../store/actions/Poi/index';
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
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
import { RxAvatar } from "react-icons/rx";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import utc from 'dayjs/plugin/utc';
import { AWSUploadModule } from '../../../component/AWSUploadModule';


const ProjectScreenEdit = ({ GetCompanyUser, WorkOrderReducer, AssetsReducer, PoiReducer, getDepartment, getAssetType, GetAllWorkOrderUnLink, getModel, deleteContractor, addContractorAC, UpdateContractorAC, GetAssetsByID, GetAllWorkOrderFilterLink }) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const dateFormat2 = 'YYYY-MM-DD';
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [messageApi, contextHolder] = message.useMessage();
    const [getSeachDepartment, setGetSearchDepartment] = useState('')
    const [getSeachModel, setGetSearchModel] = useState('')
    const [getSeachAssetType, setGetSearchAssetType] = useState('')
    const navigate = useNavigate();
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const currentAsset = localStorage.getItem("Zr8!pMD3vx#9cL@B7*+6nf==")
    const currentUser = localStorage.getItem("zP!4vBN#tw69gV+%2/+1/w==")
    const [selectedContractorIds, setSelectedContractorIds] = useState([]);


    const selectRef = useRef(null);


    const { assetDetail } = AssetsReducer
    const { workOrderLinkData } = PoiReducer




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
        const preNotification = assetDetail?.reminder_time
            ? dayjs(assetDetail.reminder_time).local()
            : null;

        const notificationTime = assetDetail?.estimated_time
            ? dayjs(assetDetail.estimated_time).local()
            : null;
        const diffInMinutes = notificationTime?.diff(preNotification, 'minute');

        setHAddPhoto(assetDetail?.files?.filter(file => /\.(jpg|jpeg|png)$/i.test(file?.fileName) && !file?.fileName?.toLowerCase().includes("wsinspection")).length > 0 ? true : false)
        setHUploadDocument(assetDetail?.files?.filter(file => /\.(pdf)$/i.test(file?.fileName) && !file?.fileName?.toLowerCase().includes("wsinspection")).length > 0 ? true : false)
        setHinspection(assetDetail?.files?.filter(file => file?.fileName?.toLowerCase().includes("wsinspection")).length > 0 ? true : false)
        setParentRadius(assetDetail?.polygon?.radius)
        setSafetyOffset(assetDetail?.polygon?.safetyZone)
        setSelectedContractorIds(assetDetail?.contractorContact ?? [])
        reset(
            {
                assetType: assetDetail?.assetType?.name,
                department: assetDetail?.department?.name,
                elevationlevel: assetDetail?.elevationLevels,
                linkedWorkOrder: workOrderIDs,
                model: assetDetail?.model?.name,
                date: assetDetail?.year,
                ...(assetDetail?.reminder_time && {
                    preNotificationTimeAndDate: diffInMinutes == 0 ? "" : diffInMinutes,
                }),
                ...(assetDetail?.estimated_time && {
                    notificationTimeAndDate: dayjs(assetDetail.estimated_time).local(),
                }),
            }
        )
        const firstLocation = assetDetail?.polygon?.locations?.[0];

        const transformedArray = assetDetail?.extraFields?.map(item => {
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
        if (assetDetail?.polygon?.type == "Circle") {
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
            const killtime2 = setTimeout(() => {
                setSelectedTab(1)
            }, 4000);
            const killtime = setTimeout(() => {
                setSelectedTab(1)
                drawCircleForSee({
                    lat: Number(firstLocation[0]),
                    lng: Number(firstLocation[1]),
                }, assetDetail?.polygon?.radius, assetDetail?.polygon?.safetyZone)
                drawWithRadiusBounds(firstLocation, assetDetail?.polygon?.radius)
            }, 1000);
            return () => {
                clearTimeout(killtime2)
                clearTimeout(killtime)
            }
        }
        else if (assetDetail?.polygon?.type === "Polygon") {
            setSelectedTab(2)
            setPoints(
                assetDetail?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setPadding(assetDetail?.polygon?.safetyZone)
            drawPolyLinePolyGoneBond(assetDetail?.polygon?.locations)
        }
        else if (assetDetail?.polygon?.type === "Polyline") {
            setSelectedTab(3)
            setPointsMore(
                assetDetail?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setSafetyOffsetMore(assetDetail?.polygon?.safetyZone)
            drawPolyLinePolyGoneBond(assetDetail?.polygon?.locations)
        }
        return () => {
            setPoints([]);
            setExtraDataList([]);
            setLocation(null);
            setPointsMore([]);
            setSafetyOffset();
            setParentRadius();
            setSafetyOffsetMore(0)
            setOffsetPolygon([])
        }
    }, [assetDetail, workOrderLinkData])







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








    useEffect(() => {
        getDepartment(currentWorkSite)
        GetAllWorkOrderUnLink(currentWorkSite)
        GetAssetsByID(currentAsset)
        GetAllWorkOrderFilterLink(currentAsset, "Asset", currentWorkSite)
        getModel()
        getAssetType()
    }, [])

    useEffect(() => {
        if (AssetsReducer?.createDepartmentComplete) {
            getDepartment(currentWorkSite)
        }
    }, [AssetsReducer?.createDepartmentComplete])

    const [nowDeleteContractor, setNowDeleteContractor] = useState()
    const DeleteContractor = (_ID) => {
        deleteContractor(_ID);
        setNowDeleteContractor(_ID)
    };








    const localData = JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}");

    const schema = yup.object().shape({
        assetType: yup.string().required(),
        department: yup.string().required(),
        elevationlevel: yup.array().min(1),
        linkedWorkOrder: yup.array().notRequired(),
        model: yup.string().required().min(1),
        date: yup.string().required(),
        preNotificationTimeAndDate: yup.string().notRequired(),
        notificationTimeAndDate: yup.string().notRequired(),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            assetType: "",
            department: "",
            elevationlevel: [],
            linkedWorkOrder: [],
            model: "",
            date: "",
            preNotificationTimeAndDate: "",
            notificationTimeAndDate: "",
            ...localData,
        },
    });




    const [newDepartment, setNewDepartment] = useState([]);
    const depatmentData = AssetsReducer?.departmentData?.map(data => ({
        value: data.name,
        label: data.name,
    }));

    const CreateDepartmentEx = async () => {
        const trimmedSearch = getSeachDepartment?.trim();
        if (!trimmedSearch) return;
        setNewDepartment(prev => [
            ...prev,
            { value: trimmedSearch, label: trimmedSearch },
        ]);
        setValue("department", trimmedSearch, {
            shouldValidate: true,
            shouldDirty: true,
        })
        selectRef.current.blur()
    };


    // Model
    const [newModel, setNewModel] = useState([]);
    const modelData = AssetsReducer?.modelData?.map(data => ({
        value: data.name,
        label: data.name,
    }));



    const CreateModelEx = async () => {
        const trimmedSearch = getSeachModel?.trim();
        if (!trimmedSearch) return;
        setNewModel(prev => [
            ...prev,
            { value: trimmedSearch, label: trimmedSearch },
        ]);
        setValue("model", trimmedSearch, {
            shouldValidate: true,
            shouldDirty: true,
        })
    };



    // Asset Type
    const [newAssetType, setNewAssetType] = useState([]);
    const assetTypeData = AssetsReducer?.assetTypeData?.map(data => ({
        value: data.name,
        label: data.name,
    }));
    const CreatesetNewAssetTypeEx = async () => {
        const trimmedSearch = getSeachAssetType?.trim();
        if (!trimmedSearch) return;
        setNewAssetType(prev => [
            ...prev,
            { value: trimmedSearch, label: trimmedSearch },
        ]);
        setValue("assetType", trimmedSearch, {
            shouldValidate: true,
            shouldDirty: true,
        })
    };


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























































    const [isDraft, setIsDraft] = useState(false);



    // const getCurrentDate = () => {
    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = String(now.getMonth() + 1).padStart(2, '0');
    //     const day = String(now.getDate()).padStart(2, '0');
    //     return `${year}/${month}/${day}`;
    // };

    const allWorkOrders = [...(PoiReducer?.workOrderLinkData || []), ...(PoiReducer?.workOrderUnData || [])];
    const WorkOrderData = allWorkOrders?.map(data => {
        return { value: data._id, label: data?.title }
    })
    const ComapnyUserData = WorkOrderReducer?.companyUserData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
    })
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
    const [safetyOffset, setSafetyOffset] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [parentRadius, setParentRadius] = useState(100);
    const [points, setPoints] = useState([]);
    const [pointsMore, setPointsMore] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [actualCenter, setActualCenter] = useState()


    useEffect(() => {
        if (circleRef.current && childCircleRef.current) {
            childCircleRef.current.setRadius(parentRadius + safetyOffset);
        }
    }, [safetyOffset, parentRadius]);
    const handleOffsetChange = (e) => {
        const newOffset = Number(e.target.value);
        setSafetyOffset(newOffset);
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





    // Contractor Data
    const [addContractor, setAddContractor] = useState(false);
    const [viewContractor, setViewContractor] = useState(false);
    const [contractorData, setContractorData] = useState({});
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
    // Contractor Data






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
















    const [HaddPhoto, setHAddPhoto] = useState();
    const [HuploadDocument, setHUploadDocument] = useState();
    const [Hinspection, setHinspection] = useState();

    const [addPhoto, setAddPhoto] = useState([]);
    const [uploadDocument, setUploadDocument] = useState([]);
    const [inspection, setInspectionDco] = useState([]);

    const [deleteAddPhoto, setDeleteAddPhoto] = useState([])
    const [deleteUploadDocument, setDeleteUploadDocument] = useState([])
    const [deleteInspectionDocument, setDeleteInspectionDocument] = useState([])


    const fileSetters = {
        addPhoto: setAddPhoto,
        uploadDocument: setUploadDocument,
        inspection: setInspectionDco,
    };

    const createBeforeUploadHandler = (key) => (file) => {
        const setter = fileSetters[key];
        const renamedFile = new File([file], `ws${key}_${file.name}`, { type: file.type });
        if (setter) {
            setter((prev) => Array.isArray(prev) ? [...prev, renamedFile] : [renamedFile]);
        } else {
            console.warn(`Unknown file key: ${key}`);
        }
        return false;
    };
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

    const deletedIds = [...deleteAddPhoto, ...deleteUploadDocument, ...deleteInspectionDocument];

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

        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const dateNow = new Date().toISOString();


        const totalItems = [
            ...uploadDocument,
            ...addPhoto,
            ...inspection,
        ].length;
        const {
            notificationTimeAndDate: rawNotificationTimeAndDate,
        } = data;
        const notificationTimeAndDate = dayjs(rawNotificationTimeAndDate).format('YYYY-MM-DD HH:mm:ss')
        const yearDate = dayjs(data?.date).format('YYYY-MM-DD')
        const notificationTime = dayjs(rawNotificationTimeAndDate);
        const rawPreNotification = data?.preNotificationTimeAndDate;
        const preNotificationNumber = Number(rawPreNotification);
        const preNotificationOffset = !preNotificationNumber || isNaN(preNotificationNumber) ? 5 : preNotificationNumber;
        const preNotificationTime = notificationTime.subtract(preNotificationOffset, 'minute');
        const preNotificationTimeFormatted = preNotificationTime.format('YYYY-MM-DD HH:mm:ss');


        const fileArray1 = [...inspection].map(file => ({
            fileName: file.name,
            size: file.size,
            contentType: file.type,
            key: "inspection"
        }))
        const fileArray2 = [...uploadDocument, ...addPhoto].map(file => ({
            fileName: file.name,
            size: file.size,
            contentType: file.type,
        }))

        const fileArray = [...fileArray1, ...fileArray2]

        const meta = JSON.stringify({
            id: "",
            type: "asset",
            title: data?.assetType ?? "",
        });

        let polygon1 = {};
        if (selectedTab === 1) {
            polygon1.polygon = {
                type: "Circle",
                safetyZone: safetyOffset || 0.0,
                altitude: Number(altitude) || 0.0,
                radius: parentRadius || 0.0,
                locations: [
                    [
                        (actualCenter?.lat ?? location.lat)?.toString(),
                        (actualCenter?.lng ?? location.lng)?.toString(),
                    ],
                ],
                meta: meta,
                latitude: location.lat,
                longitude: location.lng,
            };
        }
        else if (selectedTab === 2) {
            polygon1.polygon = {
                type: "Polygon",
                safetyZone: padding || 0.0,
                altitude: Number(altitude) || 0.0,
                radius: parentRadius || 0.0,
                locations: points.map(p => [
                    p.lat.toString(),
                    p.lng.toString(),
                ]),
                meta: meta,
                latitude: centerLNG.lat,
                longitude: centerLNG.lng,
            };
        }
        else if (selectedTab === 3) {
            polygon1.polygon = {
                type: "Polyline",
                safetyZone: safetyOffsetMore || 0.0,
                altitude: Number(altitude) || 0.0,
                radius: parentRadius || 0.0,
                locations: pointsMore.map(p => [
                    p.lat.toString(),
                    p.lng.toString(),
                ]),
                meta: meta,
                latitude: centerLNGMore.lat,
                longitude: centerLNGMore.lng,
            };
        }
        if (
            selectedTab !== undefined &&
            points.length > 2 ||
            pointsMore.length > 2 ||
            circleRef.current !== null
        ) {
            setCreateLoading(true)
            const AwsUpload = await AWSUploadModule({ messageApi, fileArray, actualFile: [...uploadDocument, ...addPhoto, ...inspection], moduleName: "asset", setCreateLoading })
            const payload = {
                assetType: data?.assetType ?? "",
                department: data?.department ?? "",
                year: yearDate,
                model: data?.model ?? "",
                worksiteId: currentWorkSite,
                assetId: currentAsset,
                files: AwsUpload,
                elevationLevels: data?.elevationlevel ?? [],
                filesId: "",
                estimated_time:
                    notificationTimeAndDate === "Invalid Date"
                        ? ""
                        : notificationTimeAndDate,

                reminder_time:
                    notificationTimeAndDate === "Invalid Date"
                        ? ""
                        : preNotificationTimeFormatted === "Invalid Date"
                            ? ""
                            : preNotificationTimeFormatted,
            };

            payload.extraFields = JSON.stringify(extraDataList.length > 0
                ? extraDataList.map(item => ({
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
                }))
                : []);


            payload.filesId =
                JSON.stringify(assetDetail?.files
                    ?.filter(f => !deletedIds.includes(f?._id))
                    .map(f => f._id) || [])

            const allWorkOrders = [
                ...(PoiReducer?.workOrderLinkData || []),
                ...(PoiReducer?.workOrderUnData || []),
            ];

            payload.workOrders = JSON.stringify(allWorkOrders
                .filter(item => data?.linkedWorkOrder.includes(item._id))
                .map(item => item._id));

            payload.removeWorkOrders = JSON.stringify(allWorkOrders
                .filter(item => !data?.linkedWorkOrder.includes(item._id))
                .map(item => item._id));

            const payloadNew = {
                ...payload,
                polygon: polygon1?.polygon ? JSON.stringify(polygon1?.polygon) : "{}",
            };
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => {
                    controller.abort();
                }, 10000000);
                const options = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(payloadNew),
                    signal: controller.signal,
                };
                let response;

                if ([...uploadDocument, ...addPhoto, ...inspection].length > 0) {
                    if (AwsUpload) {
                        response = await fetch(`${baseUrl}/assets`, options);
                    }
                }
                else {
                    response = await fetch(`${baseUrl}/assets`, options);
                } if (response.status == 403) {
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
                        content: "Asset created successfully.",
                    });
                    setCreateLoading(false)
                    navigate('/assets/my-assets')
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
                clearTimeout(timeout);
                setCreateLoading(false)
            } catch (err) {
                clearTimeout(timeout);
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

    function generateUniqueID() {
        return `form_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    function formDataToJson(formData) {
        const obj = {};
        for (const [key, value] of formData.entries()) {
            if (obj[key]) {
                if (Array.isArray(obj[key])) {
                    obj[key].push(value);
                } else {
                    obj[key] = [obj[key], value];
                }
            } else {
                obj[key] = value;
            }
        }
        return obj;
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











    // worksite
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




    const blockedKeys = [
        "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "}", "[", "]",
        "|", "\\", ":", ";", "\"", "'", "<", ">", ",", ".", "?", "/", "~", "`",
        "e", "E", "+", "-", ".",
    ];

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
                        <h1>Edit Asset</h1>
                        <div>
                            <button style={{ cursor: "pointer" }} disabled={CreateLoading} onClick={handleSubmit(adddataWorkOrder)}>{CreateLoading ? "Saving Asset..." : "Save Asset"}</button>
                        </div>
                    </div>
                    <div className={Style.ActionHeader}></div>
                </div>
                <div className={Style.TableSection}>
                    <div className={Style.FeildSide}>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColRight}>
                                <label>Asset Type</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            showSearch={true}
                                            loading={AssetsReducer?.assetTypeLoading}
                                            disabled={CreateLoading || AssetsReducer?.assetTypeLoading}
                                            placeholder="Select Asset"
                                            onChange={onChange}
                                            value={value == "" ? null : value}
                                            status={errors?.assetType?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={[...newAssetType, ...assetTypeData]}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            onSearch={(e) => setGetSearchAssetType(e)}
                                            searchValue={getSeachAssetType}
                                            notFoundContent={
                                                <>
                                                    {getSeachAssetType &&
                                                        <div className={Style.AddNewContentInDepart}>
                                                            <p style={{ whiteSpace: 'nowrap', width: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSeachAssetType}</p>
                                                            <button className={Style.AddNewContentInDepartBtn} onClick={CreatesetNewAssetTypeEx}>{
                                                                AssetsReducer?.createDepartmentLoading ?
                                                                    <Spin /> :
                                                                    "Create"}</button>
                                                        </div>}
                                                </>
                                            }
                                        />
                                    )}
                                    name="assetType"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Department</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            ref={selectRef}
                                            showSearch={true}
                                            loading={AssetsReducer?.departmentLoading}
                                            disabled={CreateLoading || AssetsReducer?.departmentLoading}
                                            placeholder="Select Department"
                                            onChange={onChange}
                                            value={value == "" ? null : value}
                                            status={errors?.department?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={[...newDepartment, ...depatmentData]}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            onSearch={(e) => setGetSearchDepartment(e)}
                                            searchValue={getSeachDepartment}
                                            notFoundContent={
                                                <>
                                                    {getSeachDepartment &&
                                                        <div className={Style.AddNewContentInDepart}>
                                                            <p style={{ whiteSpace: 'nowrap', width: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSeachDepartment}</p>
                                                            <button className={Style.AddNewContentInDepartBtn} onClick={CreateDepartmentEx}>{
                                                                AssetsReducer?.createDepartmentLoading ?
                                                                    <Spin /> :
                                                                    "Create"}</button>
                                                        </div>}
                                                </>
                                            }
                                        />
                                    )}
                                    name="department"
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
                                            status={errors?.elevationlevel?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={elevationLevelOption}
                                        />)}
                                    name="elevationlevel"
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
                                        if (WorkOrderData.length <= 0) return (
                                            <button onClick={() => navigate('/workorder/create?refer=editAsset')} type='button' className={`${Style.NoFoundWorkOrder} ant-input`} disabled={CreateLoading}>Create work order</button>
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
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
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
                                                        >
                                                            <div onClick={() => navigate('/workorder/create?refer=editAsset')}>
                                                                Create work order
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            />)
                                    }}
                                    name="linkedWorkOrder"
                                />
                            </div>
                        </div>


                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Model</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            showSearch={true}
                                            loading={AssetsReducer?.modelLoading}
                                            disabled={CreateLoading || AssetsReducer?.modelLoading}
                                            placeholder="Select Model"
                                            onChange={onChange}
                                            value={value == "" ? null : value}
                                            status={errors?.model?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={[...newModel, ...modelData]}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            onSearch={(e) => setGetSearchModel(e)}
                                            searchValue={getSeachModel}
                                            notFoundContent={
                                                <>
                                                    {getSeachModel &&
                                                        <div className={Style.AddNewContentInDepart}>
                                                            <p style={{ whiteSpace: 'nowrap', width: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSeachModel}</p>
                                                            <button className={Style.AddNewContentInDepartBtn} onClick={CreateModelEx}>{
                                                                AssetsReducer?.createDepartmentLoading ?
                                                                    <Spin /> :
                                                                    "Create"}</button>
                                                        </div>}
                                                </>
                                            }
                                        />
                                    )}
                                    name="model"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Date</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <DatePicker inputReadOnly disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs.utc(value).local() : null} status={errors?.date?.message !== undefined ? 'error' : ''} placeholder='Select Date' style={{ height: 45 }} />
                                        </>
                                    )}
                                    name="date"
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
                                        <>
                                            <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs.utc(value).local() : null} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45 }} />
                                        </>
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
                        <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start' }}>
                            <div className={Style.FeildColLeft}>
                                <label style={{ marginBottom: 10 }}>Add Photo <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setAddPhoto(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} accept={".png,.jpg,.jpeg"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('addPhoto')}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                <div style={{ marginTop: 10 }}>
                                    {assetDetail?.files?.length > 0 ? assetDetail?.files.filter(file => !deleteAddPhoto.includes(file?._id) && /\.(jpg|jpeg|png)$/i.test(file?.fileName) && !file?.fileName?.toLowerCase().includes("wsinspection")).map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                                                <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                    {data?.fileName}
                                                </a>
                                                <div onClick={() => setDeleteAddPhoto(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>

                                        )
                                    }) : ""}
                                </div>
                            </div>


                            <div className={Style.FeildColLeft}>
                                <label style={{ marginBottom: 10 }}>Upload Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setUploadDocument(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} accept={".pdf"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('uploadDocument')}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                <div style={{ marginTop: 10 }}>
                                    {assetDetail?.files?.length > 0 ? assetDetail?.files.filter(file => !deleteUploadDocument.includes(file?._id) && /\.(pdf)$/i.test(file?.fileName) && !file?.fileName?.toLowerCase().includes("wsinspection")).map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                                                <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                    {data?.fileName}
                                                </a>
                                                <div onClick={() => setDeleteUploadDocument(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>

                                        )
                                    }) : ""}
                                </div>
                            </div>
                            <div className={Style.FeildColLeft}>
                                <label style={{ marginBottom: 10 }}>Inspection Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setInspectionDco(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} accept={".pdf"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('inspection')}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                <div style={{ marginTop: 10 }}>
                                    {assetDetail?.files?.length > 0 ? assetDetail?.files.filter(file => !deleteInspectionDocument.includes(file?._id) && file?.fileName?.toLowerCase().includes("wsinspection")).map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                                                <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                    {data?.fileName}
                                                </a>
                                                <div onClick={() => setDeleteInspectionDocument(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
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

function mapStateToProps({ PoiReducer, AssetsReducer, WorkOrderReducer }) {
    return { PoiReducer, AssetsReducer, WorkOrderReducer };
}
export default connect(
    mapStateToProps,
    { ...AssetsAction, ...POIAction, ...WorkOrderAction }
)(ProjectScreenEdit);