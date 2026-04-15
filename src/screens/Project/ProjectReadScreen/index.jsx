import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './ProjectReadScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider, Checkbox } from 'antd'
import * as ProjectAction from '../../../../store/actions/Project/index';
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


const ProjectScreenRead = ({ GetCompanyUser, WorkOrderReducer, ProjectReducer, PoiReducer, getDepartment, CreateDepartment, GetAllWorkOrderUnLink, getContractorId, deleteContractor, addContractorAC, UpdateContractorAC, GetProjectByID, GetAllWorkOrderFilterLink, LoadDailyProject }) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const dateFormat2 = 'YYYY-MM-DD';
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [messageApi, contextHolder] = message.useMessage();
    const [getSeach, setGetSearch] = useState('')
    const navigate = useNavigate();
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const currentProject = localStorage.getItem("Nq5#eKY6uw^2hX$A8_/4jt==")
    const currentUser = localStorage.getItem("zP!4vBN#tw69gV+%2/+1/w==")
    const [selectedContractorIds, setSelectedContractorIds] = useState([]);
    const [safetyOffsetMore, setSafetyOffsetMore] = useState(0);
    const [offsetPolygon, setOffsetPolygon] = useState([]);
    const [padding, setPadding] = useState(0);
    const TIMEOUT = 1000000;

    const selectRef = useRef(null);



    const workOrderGetDoc = async (body) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT);
        const url = `/assets/files/signed-urls`;
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        try {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({keys:body}),
                signal: controller.signal,
            };
            const response = await fetch(`${baseUrl}${url}`, options);
            const res = await response.json();
            if (response.status === 200 || response.status === 201) {
                return res || 0
            }
        } catch (error) {
            if (error.name === "AbortError") console.error("Request timed out");
        } finally {
            clearTimeout(timeout);
        }
    };


    const { projectDetail } = ProjectReducer
    const { workOrderLinkData } = PoiReducer


    const preNotificationOuter = projectDetail?.reminder_time
        ? dayjs(projectDetail.reminder_time).local()
        : null;
    const notificationTimeOuter = projectDetail?.estimated_time
        ? dayjs(projectDetail.estimated_time).local()
        : null;




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


    const [document1, setDocument1] = useState([])
    const [document2, setDocument2] = useState([])
    const [document3, setDocument3] = useState([])
    const [document4, setDocument4] = useState([])
    const [document5, setDocument5] = useState([])
    const [document6, setDocument6] = useState([])
    const [document7, setDocument7] = useState([])
    const [document8, setDocument8] = useState([])

    const extractPaths = files =>
        files.map(file => new URL(file.url).pathname.replace(/^\/+/, ''));

    const alreadyRunRef = useRef(false);
    const [loadingDoc, setLoadingDoc] = useState(false);

    const loadData = async () => {
        if (!projectDetail) return;
        if (alreadyRunRef.current) return;

        alreadyRunRef.current = true;
        setLoadingDoc(true);
        const configs = [
            { key: 'photosOrVideos', state: document1, setter: setDocument1 },
            { key: 'documents', state: document2, setter: setDocument2 },
            { key: 'safetyDocumentation', state: document3, setter: setDocument3 },
            { key: 'warrantyDocumentation', state: document4, setter: setDocument4 },
            { key: 'trainingDocuments', state: document5, setter: setDocument5 },
            { key: 'uploadpermits', state: document6, setter: setDocument6 },
            { key: 'otherDocumentation', state: document7, setter: setDocument7 },
            { key: 'jsaDocumentation', state: document8, setter: setDocument8 },
        ];

        const requests = configs
            .filter(({ key, state }) =>
                Array.isArray(projectDetail[key]) &&
                projectDetail[key].length > 0 &&
                state.length === 0
            )
            .map(async ({ key, setter }) => {
                const paths = extractPaths(projectDetail[key]);
                const docs = await workOrderGetDoc(paths);
                setter(docs);
            });

        try {
            await Promise.all(requests);
        } finally {
            setLoadingDoc(false);
        }
    };




    console.log(projectDetail,'ADS((((((&^')




    useEffect(() => {
        const workOrderIDs = workOrderLinkData?.map(item => item?.title) || [];
        const preNotification = projectDetail?.reminder_time
            ? dayjs(projectDetail.reminder_time).local()
            : null;

        const notificationTime = projectDetail?.estimated_time
            ? dayjs(projectDetail.estimated_time).local()
            : null;
        const diffInMinutes = notificationTime?.diff(preNotification, 'minute');
        setParentRadius(projectDetail?.polygon?.radius)
        setSafetyOffset(projectDetail?.polygon?.safetyZone)
        setSelectedContractorIds(projectDetail?.contractorContact ?? [])
        loadData()
        reset(
            {
                projectName: projectDetail?.title,
                department: projectDetail?.department?.name,
                elevationlevel: projectDetail?.elevationLevels,
                linkedWorkOrder: workOrderIDs,
                projectmanager: projectDetail?.projectManager?.map(data => data._id)?.[0],
                ...(projectDetail?.reminder_time && {
                    preNotificationTimeAndDate: diffInMinutes == 0 ? "" : diffInMinutes,
                }),
                ...(projectDetail?.estimated_time && {
                    notificationTimeAndDate: dayjs(projectDetail.estimated_time).local(),
                }),
            }
        )
        const firstLocation = projectDetail?.polygon?.locations?.[0];
        const transformedArray = projectDetail?.extraFields?.map(item => {
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
        if (projectDetail?.polygon?.type == "Circle") {
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
                }, projectDetail?.polygon?.radius, projectDetail?.polygon?.safetyZone)
                drawWithRadiusBounds(firstLocation, projectDetail?.polygon?.radius)
            }, 1000);
            return () => {
                clearTimeout(killtime2)
                clearTimeout(killtime)
            }
        }
        else if (projectDetail?.polygon?.type === "Polygon") {
            setSelectedTab(2)
            setPoints(
                projectDetail?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setPadding(projectDetail?.polygon?.safetyZone)
            drawPolyLinePolyGoneBond(projectDetail?.polygon?.locations)
        }
        else if (projectDetail?.polygon?.type === "Polyline") {
            setSelectedTab(3)
            setPointsMore(
                projectDetail?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setSafetyOffsetMore(projectDetail?.polygon?.safetyZone)
            drawPolyLinePolyGoneBond(projectDetail?.polygon?.locations)
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
    }, [projectDetail, workOrderLinkData])








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
            draggable: false,
            editable: false,
            clickable: false
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
            editable: false,
            draggable: false,
            clickable: false
        });
        parent.addListener('center_changed', () => {
            const newCenter = parent.getCenter();
            child.setCenter(newCenter);
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
        getContractorId(currentProject)
        GetCompanyUser()
        GetProjectByID(currentProject)
        LoadDailyProject(currentProject, 1, "")
        GetAllWorkOrderFilterLink(currentProject, "Project", currentWorkSite)
    }, [])

    useEffect(() => {
        if (ProjectReducer?.createDepartmentComplete) {
            getDepartment(currentWorkSite)
            setGetSearch("")
        }
    }, [ProjectReducer?.createDepartmentComplete])

    const DeleteContractor = (_ID) => {
        deleteContractor(_ID)
    }

    const depatmentData = ProjectReducer?.departmentData?.map(data => {
        return { value: data._id, label: data?.name }
    })

    const CreateDepartmentEx = async () => {
        CreateDepartment({
            name: getSeach,
            worksiteId: currentWorkSite
        })
        selectRef.current.blur()
    }

    useEffect(() => {
        if (!messageApi) return;
        if (ProjectReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (ProjectReducer.contractorDelete) {
            UpdateContractorDrawer('', {})
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Contractor delete successfully",
            });
            getContractorId(currentProject)
        }
        if (ProjectReducer.contractorAdd) {
            UpdateContractorDrawer('', {})
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: `Contractor ${isContractorNow == "Update" ? "Updated" : "Added"} successfully`,
            });
            getContractorId(currentProject)
            closeAddContractorDrawer()
        }
    }, [
        ProjectReducer.networkError,
        ProjectReducer.contractorAdd,
        ProjectReducer.contractorDelete,
        messageApi,
    ]);























































    const [isDraft, setIsDraft] = useState(false);
    const schema = yup.object().shape({
        projectName: yup.string().required(),
        department: yup.string().required(),
        elevationlevel: yup.array().required(),
        linkedWorkOrder: yup.array().notRequired(),
        projectmanager: yup.string().required(),
        preNotificationTimeAndDate: yup.string().notRequired(),
        notificationTimeAndDate: yup.string().notRequired(),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            projectName: "",
            department: "",
            elevationlevel: "",
            linkedWorkOrder: "",
            projectmanager: "",
            preNotificationTimeAndDate: "",
            notificationTimeAndDate: "",
        },
    });

  
    const WorkOrderData = PoiReducer?.workOrderData?.map(data => {
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
            draggable: false,
            editable: false,
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
    const getSafetyZonePath = () => {
        if (points.length < 3) return [];
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
        if (points.length < 3) {
            const newPoint = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            setPoints((prev) => [...prev, newPoint]);
        }
    }, [points]);











    // PolyLine

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
    function computeOffsetPolyline(points45, offsetDistance) {
        const offsetLeftPoints = [];
        const offsetRightPoints = [];
        for (let i = 0; i < points45.length - 1; i++) {
            const p1 = points45[i];
            const p2 = points45[i + 1];
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

    const closeAddContractorDrawer = () => {
        setAddContractor(false);
    };

    const addViewContractorDrawer = () => {
        setViewContractor(true);
    };
    const closeViewContractorDrawer = () => {
        setViewContractor(false);
    };

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
        if (!name || !address || !zipCode || !country || !email || !state || !phone || !orderPurchaseNumber) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "All fields are required.",
            });
            return false;
        }

        else if (!emailRegex.test(email)) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Invalid email format.",
            });
            return false;
        }
        else {
            if (isContractorNow == "Update") {
                UpdateContractorAC({ ...contractorData, contractorId: contractorData?._id })
            }
            else {
                addContractorAC(contractorData)
            }
        }
    };
    // Contractor Data






    // Drawer Extra Data
    const [extraAddData, setExtraAddData] = useState(false);
    const showAddExtraDrawer = () => {
        setExtraAddData(true);
    };
    const closeAddExtraDrawer = () => {
        setExtraAddData(false);
    };
    const [extraDataList, setExtraDataList] = useState([]);
    // Drawer Extra Data





    // Drawer Daily Project
    const [dailyProjectDrawer, setDailyProjectDrawer] = useState(false);
    const showDailyProjectDrawer = () => {
        setDailyProjectDrawer(true);
    };
    const closeDailyProjectDrawer = () => {
        setDailyProjectDrawer(false);
    };
    // Drawer Daily Project





















    // Contractor Data

    const addContractorDrawer = (StateHe, format) => {
        setIsContractorNow(StateHe)
        setContractorData(format)
        setAddContractor(true);
    };

    const OpenReadPromp = (State, format) => {
        closeViewContractorDrawer()
        addContractorDrawer(State, format)
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
    const drawCircleWorkSite = (loc, radius, safetyZone2) => {
        new window.google.maps.Circle({
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
    };


    const [workSiteMarker, setWorkSiteMarker] = useState(null)
    const [pointsWorkSite, setPointsWorkSite] = useState([]);
    const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);
    const [editExtraDataList, setEditExtraDataList] = useState({});


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



    const filteredContractors = ProjectReducer?.contractorData?.filter(
        (data) => selectedContractorIds?.includes(data._id)
    );


    const dailyProjectSection = () => {
        localStorage.setItem('Sp6#nQD7vo$1gX@C8-/4lt==', JSON.stringify(projectDetail))
        window.location.reload()
        window.location.href = '/project/daily-project';
    }



    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const fileNameMap = new Map(
        [...(projectDetail?.photosOrVideos ?? []),...(projectDetail?.documents ?? []),...(projectDetail?.safetyDocumentation ?? []), ...(projectDetail?.warrantyDocumentation ?? []), ...(projectDetail?.trainingDocuments ?? []), ...(projectDetail?.uploadpermits ?? []), ...(projectDetail?.otherDocumentation ?? []), ...(projectDetail?.jsaDocumentation ?? [])]?.map(file => [
            file.fileName,
            file,
        ]) || []
    );



    const matchedFiles1 =
        document1?.urls
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

    const matchedFiles2 =
        document2?.urls
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


    const matchedFiles3 =
        document3?.urls
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

    const matchedFiles4 =
        document4?.urls
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

    const matchedFiles5 =
        document5?.urls
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


    const matchedFiles6 =
        document6?.urls
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


    const matchedFiles7 =
        document7?.urls
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


    const matchedFiles8 =
        document8?.urls
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


    return (

        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>View Project</h1>
                        <div>
                        </div>
                    </div>
                    <div className={Style.ActionHeader}></div>
                </div>
                <div className={Style.TableSection}>
                    <div className={Style.FeildSide}>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColRight}>
                                <label>Project Name</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input disabled={true} onChange={onChange} value={value} status={errors?.projectName?.message !== undefined ? 'error' : ''} placeholder='Enter Project Name' style={{ height: 45, marginTop: 3 }} />
                                    )}
                                    name="projectName"
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
                                            loading={ProjectReducer?.departmentLoading}
                                            disabled={true}
                                            placeholder="Select Department"
                                            onChange={onChange}
                                            value={value == "" ? null : value}
                                            status={errors?.department?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={depatmentData}
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            onSearch={(e) => setGetSearch(e)}
                                            searchValue={getSeach}
                                            notFoundContent={
                                                <div className={Style.AddNewContentInDepart}>
                                                    <p style={{ whiteSpace: 'nowrap', width: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSeach}</p>
                                                    <button className={Style.AddNewContentInDepartBtn} onClick={CreateDepartmentEx}>{
                                                        ProjectReducer?.createDepartmentLoading ?
                                                            <Spin /> :
                                                            "Create"}</button>
                                                </div>
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
                                            disabled={true}
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
                                <label>Linked work order </label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                mode="multiple"
                                                loading={PoiReducer?.workOrderLoading}
                                                disabled={true}
                                                placeholder="Select Linked work order"
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                status={errors?.linkedWorkOrder?.message !== undefined ? 'error' : ''}
                                                style={{ marginTop: 3, width: "100%", height: 45 }}
                                                options={WorkOrderData}
                                            />)
                                    }}
                                    name="linkedWorkOrder"
                                />
                            </div>
                        </div>


                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Project Manager</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                placeholder="Select Project Manager"
                                                loading={WorkOrderReducer?.companyUserLoading}
                                                disabled={true}
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.projectmanager?.message !== undefined ? 'error' : ''}
                                                style={{ marginTop: 3, width: "100%", height: 45 }}
                                                options={ComapnyUserData}
                                            />)
                                    }}
                                    name="projectmanager"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Contractor</label>
                                <div className={Style.AddExtraDataFeild} >
                                    <div onClick={addViewContractorDrawer}>
                                        <p>Select Contractor<span> {`(${selectedContractorIds?.length})`}</span></p>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                            {/* Add Contractor drawer */}
                            <Drawer
                                maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                                title={<div className={Style.ViewHeaderConstructor}>{isContractorNow} Contractor</div>}
                                placement={'right'}
                                onClose={closeAddContractorDrawer}
                                open={addContractor}
                                key={'right'}
                            >

                                <div style={{ paddingTop: 10 }}>
                                    <label>Name <span style={{ color: 'red' }}>*</span></label>
                                    <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.name} onChange={(e) => setContractorData(prev => ({ ...prev, name: e.target.value }))} placeholder='Enter Name' style={{ height: 45, marginTop: 3 }} />
                                </div>

                                <div style={{ paddingTop: 10 }}>
                                    <label>Address <span style={{ color: 'red' }}>*</span></label>
                                    <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.address} onChange={(e) => setContractorData(prev => ({ ...prev, address: e.target.value }))} placeholder='Enter Address' style={{ height: 45, marginTop: 3 }} />
                                </div>

                                <div style={{ paddingTop: 10 }}>
                                    <label>Zip code <span style={{ color: 'red' }}>*</span></label>
                                    <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.zipCode} onChange={(e) => setContractorData(prev => ({ ...prev, zipCode: e.target.value }))} placeholder='Enter Zip Code' style={{ height: 45, marginTop: 3 }} />
                                </div>

                                <div style={{ paddingTop: 10 }}>
                                    <label>State <span style={{ color: 'red' }}>*</span></label>
                                    <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.state} onChange={(e) => setContractorData(prev => ({ ...prev, state: e.target.value }))} placeholder='Enter State' style={{ height: 45, marginTop: 3 }} />
                                </div>

                                <div style={{ paddingTop: 10 }}>
                                    <label>Country <span style={{ color: 'red' }}>*</span></label>
                                    <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.country} onChange={(e) => setContractorData(prev => ({ ...prev, country: e.target.value }))} placeholder='Enter Country' style={{ height: 45, marginTop: 3 }} />
                                </div>

                                <div style={{ paddingTop: 10 }}>
                                    <label>Phone <span style={{ color: 'red' }}>*</span></label>
                                    <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.phone} onChange={(e) => setContractorData(prev => ({ ...prev, phone: e.target.value }))} placeholder='Enter Phone' style={{ height: 45, marginTop: 3 }} />
                                </div>

                                <div style={{ paddingTop: 10 }}>
                                    <label>Email <span style={{ color: 'red' }}>*</span></label>
                                    <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.email} onChange={(e) => setContractorData(prev => ({ ...prev, email: e.target.value }))} placeholder='Enter Email' style={{ height: 45, marginTop: 3 }} />
                                </div>

                                <div style={{ paddingTop: 10 }}>
                                    <label>Other purchase number <span style={{ color: 'red' }}>*</span></label>
                                    <Input disabled={isContractorNow == "View" ? true : false} value={contractorData?.orderPurchaseNumber} onChange={(e) => setContractorData(prev => ({ ...prev, orderPurchaseNumber: e.target.value }))} placeholder='Enter Email' style={{ height: 45, marginTop: 3 }} />
                                </div>
                                {isContractorNow !== "View" &&
                                    <div style={{ width: "100%", paddingTop: 20, marginBottom: 20 }}>
                                        <button disabled={ProjectReducer?.contractorAddLoading} onClick={handleAddContractor} className={Style.AddWorkBtn}>{ProjectReducer?.contractorAddLoading ? "Loading..." : isContractorNow == "Update" ? "Update Contractor" : "Add Contractor"}</button>
                                    </div>
                                }
                            </Drawer>
                            {/* Add Contractor drawer */}

                            {/* View Contractor drawer */}
                            <Drawer
                                maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                                title="View Contractor"
                                placement={'right'}
                                onClose={closeViewContractorDrawer}
                                open={viewContractor}
                                key={'right'}
                            >

                                {filteredContractors !== undefined && filteredContractors !== null && filteredContractors !== "" && filteredContractors.length > 0 ? filteredContractors?.map((data, index) => (
                                    <div key={data.id || index} className={Style.ContractorViewContainer}>
                                        <div onClick={() => OpenReadPromp("View", data)} style={{ display: 'flex', alignItems: 'center', width: '90%' }}>
                                            <div className={Style.IconContractor}>
                                                <RxAvatar size={60} />
                                            </div>
                                            <div style={{ marginLeft: 5 }}>
                                                <h4>{data?.name}</h4>
                                                <p>{data?.phone}</p>
                                                {data.created_by !== currentUser &&
                                                    <p style={{ fontSize: 10, paddingInline: 10, paddingBlock: 1, border: "1px solid black", borderRadius: 10 }}>Create by Teammate</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <Checkbox
                                                checked={selectedContractorIds?.includes(data._id)}
                                                disabled={true}
                                                onChange={() => {
                                                    const isAlreadySelected = selectedContractorIds?.includes(data._id);
                                                    const newSelectedIds = isAlreadySelected
                                                        ? selectedContractorIds?.filter(id => id !== data._id)
                                                        : [...selectedContractorIds, data._id];

                                                    setSelectedContractorIds(newSelectedIds);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No contractor found" />}
                            </Drawer>
                            {/* View Contractor drawer */}
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Add Extra Data </label>
                                <div className={Style.AddExtraDataFeild} onClick={showAddExtraDrawer}>
                                    <div>
                                        <p>Extra Data<span> ({extraDataList.length})</span></p>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Notification Date & Time </label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={true} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={value ? dayjs.utc(value).local() : null} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45, marginTop: 3 }} />
                                        </>
                                    )}
                                    name="notificationTimeAndDate"
                                />
                            </div>
                            {/* extra Data drawer */}
                            <Drawer
                                maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                                title="Add Extra Data"
                                placement={'right'}
                                onClose={closeAddExtraDrawer}
                                open={extraAddData}
                                key={'right'}
                            >
                                {extraDataList?.length > 0 ? extraDataList.map((data, index) => {
                                    return (
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
                                    );
                                }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Extra Data found" />}
                            </Drawer>
                            {/* extra Data drawer */}
                        </div>
                        <div className={Style.FeildRow} style={{ alignItems: 'flex-start' }}>
                            {projectDetail?.estimated_time !== "" &&
                                <div className={Style.FeildColLeft}>
                                    <label>Reminder Date & Time </label>
                                    <Controller
                                        control={control}
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <DatePicker inputReadOnly disabled={true} showTime={{ format: 'hh:mm A', use12Hours: true }} minDate={dayjs(formattedDate, dateFormat2)} onChange={onChange} value={projectDetail?.reminder_time == "" ? "" : preNotificationOuter} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Notification Date & Time' style={{ height: 45, marginTop: 3 }} />
                                        )}
                                        name="reminderTime"
                                    />
                                </div>
                            }

                            <div className={Style.FeildColRight}>
                                <label>Date</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <DatePicker inputReadOnly disabled={true} onChange={onChange} value={dayjs.utc(projectDetail?.createdAt).local()} status={errors?.notificationTimeAndDate?.message !== undefined ? 'error' : ''} placeholder='Select Date' style={{ height: 45 }} />
                                        </>
                                    )}
                                    name="notificationTimeAndDate"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Daily Project </label>
                                <div className={Style.AddExtraDataFeild} onClick={() => ProjectReducer?.dailyProjectLoading ? null : dailyProjectSection()}>
                                    <div>
                                        <p>Daily Project
                                            {ProjectReducer?.dailyProjectLoading ?
                                                <span style={{ marginLeft: 3 }}>
                                                    <Spin />
                                                </span>
                                                :
                                                <><span style={{ marginLeft: 3 }}>({ProjectReducer?.dailyPro || 0})</span></>
                                            }
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {loadingDoc ?
                            <div style={{ paddingTop: 20 }}>
                                <Spin />
                            </div>
                            :
                            <>
                                {matchedFiles1?.length > 0 || matchedFiles2?.length > 0 || matchedFiles3?.length > 0 || matchedFiles4?.length > 0 || matchedFiles5?.length > 0 || matchedFiles6?.length > 0 || matchedFiles7?.length > 0 || matchedFiles8?.length > 0 ?
                                    <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start', margin: 0 }}>
                                        {matchedFiles1?.length > 0 ?
                                            <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
                                                <label style={{ marginBottom: 10 }}>Add Photos</label>
                                                {matchedFiles1.map(data => {
                                                    return (
                                                        <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                            : ""}
                                        {matchedFiles2?.length > 0 ?
                                            <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
                                                <label style={{ marginBottom: 10 }}>Upload Document</label>
                                                {matchedFiles2.map(data => {
                                                    return (
                                                        <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                            : ""}

                                        {matchedFiles3?.length > 0 ?
                                            <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
                                                <label style={{ marginBottom: 10 }}>Safety Document</label>
                                                {matchedFiles3.map(data => {
                                                    return (

                                                        <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                            : ""}



                                        {matchedFiles4?.length > 0 ?
                                            <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
                                                <label style={{ marginBottom: 10 }}>Warranty Document</label>
                                                {matchedFiles4.map(data => {
                                                    return (
                                                        <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                            : ""}
                                        {matchedFiles5?.length > 0 ?
                                            <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
                                                <label style={{ marginBottom: 10 }}>Training Document</label>
                                                {matchedFiles5.map(data => {
                                                    return (
                                                        <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                            : ""}

                                        {matchedFiles6?.length > 0 ?
                                            <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
                                                <label style={{ marginBottom: 10 }}>Upload Permit</label>
                                                {matchedFiles6.map(data => {
                                                    return (

                                                        <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                            : ""}

                                        {matchedFiles7?.length > 0 ?
                                            <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
                                                <label style={{ marginBottom: 10 }}>Confined Space Paperwork</label>
                                                {matchedFiles7.map(data => {
                                                    return (

                                                        <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                            : ""}
                                        {matchedFiles8?.length > 0 ?
                                            <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
                                                <label style={{ marginBottom: 10 }}>JSA (Job Safety Analysis)</label>
                                                {projectDetail?.jsaDocumentation.map(data => {
                                                    return (

                                                        <a target='_blank' href={data?.url} style={{ marginTop: 5, marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                            {data?.fileName}
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                            : ""}
                                    </div>
                                    : ""}
                            </>
                        }
                    </div >
                    <div className={Style.MapSide}>
                        {isLoaded ? (
                            <>
                                <GoogleMapCreate
                                    locationCurrent={locationCurrent}
                                    center={location}
                                    onMapLoad={onMapLoad}
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
                                    drawCircle={drawCircle}
                                    drawPolyLine={drawPolyLine}
                                    handleRecenter={handleRecenter}
                                    getSafetyZonePath={getSafetyZonePath}
                                    locationToggle={true}
                                    readMap={true}
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

function mapStateToProps({ PoiReducer, ProjectReducer, WorkOrderReducer }) {
    return { PoiReducer, ProjectReducer, WorkOrderReducer };
}
export default connect(
    mapStateToProps,
    { ...ProjectAction, ...POIAction, ...WorkOrderAction }
)(ProjectScreenRead);