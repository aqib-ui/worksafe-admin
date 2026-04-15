import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './DailyProjectEditScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider, Checkbox, Modal } from 'antd'
import * as ProjectAction from '../../../../../store/actions/Project/index';
import * as POIAction from '../../../../../store/actions/Poi/index';
import * as WorkOrderAction from '../../../../../store/actions/WorkOrder/index';
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
import { baseUrl } from '../../../../../store/config.json';
import { MdOutlineLocationSearching } from "react-icons/md";
import { MdOutlineModeEditOutline } from "react-icons/md";
import WorkSiteIcon from "../../../../assets/marker_worksites.png";
import myLocationMarker from "../../../../assets/myLocationMarker.png";
import GoogleMapCreate from '../../../../component/googleMap';
import { RxAvatar } from "react-icons/rx";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import utc from 'dayjs/plugin/utc';
import NearMissOCC from '../DailyProjectComp/NearMissOCC';
import ScopeChange from '../DailyProjectComp/ScopeChange';
import { AWSUploadModuleFilter } from '../../../../component/AWSUploadModule';


const ProjectScreenEdit = ({ LoadDailyProject, GetCompanyUser, WorkOrderReducer, ProjectReducer, PoiReducer, getDepartment, CreateDepartment, GetAllWorkOrderUnLink, getContractor, deleteContractor, addContractorAC, UpdateContractorAC, LoadDailyProjectDetail }) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);


    const handleUnauthorized = () => {
        localStorage.clear()
        window.location.reload();
    };


    const dateFormat2 = 'YYYY-MM-DD';
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [messageApi, contextHolder] = message.useMessage();
    const [getSeach, setGetSearch] = useState('')
    const navigate = useNavigate();
    const currentWorkSite = localStorage.getItem('+AOQ^%^f0Gn4frTqztZadLrKg==')
    const currentDailyProject = localStorage.getItem('Jt4^rLB6wi!1fK#M8*/vOz==')
    const currentParentProject = localStorage.getItem("Lp7%wDA2ty#6cU*Z5+_3ho==")


    const currectProject = localStorage.getItem('Sp6#nQD7vo$1gX@C8-/4lt==')
    const currectProjectObj = JSON.parse(currectProject);




    const { dailyProjectDetailData } = ProjectReducer
    const { workOrderLinkData } = PoiReducer

    const [expandNMO, setExpandNMO] = useState(false);
    const [expandSC, setExpandSC] = useState(false);
    const [selectedContractorIds, setSelectedContractorIds] = useState([]);
    const [listemailCTC, setListEmailCTC] = useState([])



    const [personanalDataArray, setPersonanalDataArray] = useState([]);














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
        let location = null;
        if (dailyProjectDetailData?.location) {
            location = JSON.parse(dailyProjectDetailData.location);
        }
        setHAddPhoto(dailyProjectDetailData?.photosOrVideos?.length > 0 ? true : false)
        setHUploadDocument(dailyProjectDetailData?.documents?.length > 0 ? true : false)
        setHSafetyDocument(dailyProjectDetailData?.safetyDocumentation?.length > 0 ? true : false)
        setHWarrantyDocument(dailyProjectDetailData?.warrantyDocumentation?.length > 0 ? true : false)
        setExpandNMO(dailyProjectDetailData?.nmo_v_r_t ? true : false)
        setExpandSC(dailyProjectDetailData?.sc_notification?.length > 0 ? true : false)
        setHJSA1(dailyProjectDetailData?.otherDocumentation)
        setHJSA2(dailyProjectDetailData?.jsaDocumentation)
        setParentRadius(location?.radius)
        setSafetyOffset(location?.safetyZone)
        setSelectedContractorIds(dailyProjectDetailData?.nmo_contractor ?? [])
        reset(
            {
                projectName: dailyProjectDetailData?.project_name || "",
                address: dailyProjectDetailData?.address || "",
                projectmanager: dailyProjectDetailData?.project_manager?._id || "",
                incidentReview: dailyProjectDetailData?.nmo_i_r || "",
                verballyReportedTo: dailyProjectDetailData?.nmo_v_r_t || "",
                whatHappend: dailyProjectDetailData?.nmo_r_c_a_w_h || "",
                whyDidItHappen: dailyProjectDetailData?.nmo_r_c_a_w_d_i_h || "",
                approvers: dailyProjectDetailData?.sc_notification,
                howToPR: dailyProjectDetailData?.nmo_r_c_a_h_t_p_r || "",
                descriptionOfChanges: dailyProjectDetailData?.sc_d_o_c || "",
                safetyCOC: dailyProjectDetailData?.sc_s_c_a_c || "",
                ...(dailyProjectDetailData?.nmo_v_r_t_date && {
                    reportedDate: dayjs(dailyProjectDetailData.nmo_v_r_t_date).local(),
                }),
                ...(dailyProjectDetailData?.sc_d_a && {
                    dateApproved: dayjs(dailyProjectDetailData.sc_d_a).local(),
                }),
                ...(dailyProjectDetailData?.sc_r_a_s && {
                    reminderDateandTime: dayjs(dailyProjectDetailData.sc_r_a_s).local(),
                }),
            }
        )
        setListEmailCTC(dailyProjectDetailData?.sc_approvals ? dailyProjectDetailData?.sc_approvals : null == null ? [] : dailyProjectDetailData?.sc_approvals ? dailyProjectDetailData?.sc_approvals : null)
        const dataPersonanal = JSON.parse(dailyProjectDetailData?.add_hours_worked ? dailyProjectDetailData?.add_hours_worked : null);
        const transformedDataPersonal = dataPersonanal?.map(item => ({
            ...item,
            date_and_hours: item.date_and_hours.map(entry => ({
                ...entry,
                date: dayjs(entry.date).local()
            }))
        }));
        setPersonanalDataArray(transformedDataPersonal == null ? [] : transformedDataPersonal)
        const firstLocation = location?.locations?.[0];

        const transformedArray = dailyProjectDetailData?.extraFields?.map(item => {
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
        if (location?.type == "Circle") {
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
                console.log(dailyProjectDetailData, "ADS)((")
                setSelectedTab(1)
                drawCircleForSee({
                    lat: Number(firstLocation[0]),
                    lng: Number(firstLocation[1]),
                }, location?.radius, location?.safetyZone)
                drawWithRadiusBounds(firstLocation, location?.radius)
            }, 2000);
            return () => {
                clearTimeout(killtime)
            }
        }
        else if (location?.type === "Polygon") {
            setSelectedTab(2)
            setPoints(
                location?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setPadding(location?.safetyZone)
            drawPolyLinePolyGoneBond(location?.locations)
        }
        else if (location?.type === "Polyline") {
            setSelectedTab(3)
            setPointsMore(
                location?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setSafetyOffsetMore(location?.safetyZone)
            drawPolyLinePolyGoneBond(location?.locations)
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
    }, [dailyProjectDetailData, workOrderLinkData])







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
            clickable: false
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
        getContractor(currentWorkSite)
        LoadDailyProjectDetail(currentDailyProject)
        GetCompanyUser()
    }, [])

    useEffect(() => {
        if (ProjectReducer?.createDepartmentComplete) {
            getDepartment(currentWorkSite)
            setGetSearch("")
        }
    }, [ProjectReducer?.createDepartmentComplete])


    const schema = yup.object().shape({
        projectName: yup.string().required(),
        address: yup.string().required(),
        projectmanager: yup.string().required(),
        incidentReview: yup.string().notRequired(),
        verballyReportedTo: yup.string().when([], (value, schema, options) => {
            return expandNMO
                ? schema.required("Verbally reported to is required")
                : schema.notRequired();
        }),
        reportedDate: yup.string().notRequired(),
        whatHappend: yup.string().notRequired(),
        whyDidItHappen: yup.string().notRequired(),
        howToPR: yup.string().notRequired(),
        descriptionOfChanges: yup.string().notRequired(),
        safetyCOC: yup.string().notRequired(),
        approvers: yup.array().when([], (value, schema, options) => {
            return expandSC
                ? schema.min(1, "Approvers is required")
                : schema.notRequired();
        }),
        dateApproved: yup.string().notRequired(),
        reminderDateandTime: yup.string().notRequired(),
    });



    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        resetField,
        reset
    } = useForm({
        resolver: yupResolver(schema, {
            context: {
                expandNMO,
                expandSC,
            },
        }),
        defaultValues: {
            projectName: "",
            address: "",
            projectmanager: "",
            incidentReview: "",
            verballyReportedTo: "",
            reportedDate: "",
            whatHappend: "",
            whyDidItHappen: "",
            howToPR: "",
            descriptionOfChanges: "",
            safetyCOC: "",
            approvers: [],
            dateApproved: "",
            reminderDateandTime: "",
        },
    });



    useEffect(() => {
        if (!messageApi) return;
        if (ProjectReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }

    }, [
        ProjectReducer.networkError,
        messageApi,
    ]);



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
    const [extraDataList, setExtraDataList] = useState(JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}").extraData || []);
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
            const PrevJsonData = JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}")
            const UpdateJsonParr = { extraData: [...extraDataList, extraDataState], ...PrevJsonData }
            localStorage.setItem("Rd9!tMQ4vz#1gN*B6_+7@x==", JSON.stringify(UpdateJsonParr));
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
            const PrevJsonData = JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}")
            const UpdateJsonParr = PrevJsonData?.extraData.map((item, index) =>
                index === editExtraDataList.id ? editExtraDataList : item
            );
            const UpdateJsonParT = { ...PrevJsonData, extraData: UpdateJsonParr }
            localStorage.setItem("Rd9!tMQ4vz#1gN*B6_+7@x==", JSON.stringify(UpdateJsonParT));

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
        const PrevJsonData = JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}")
        const UpdateJsonParr = PrevJsonData?.extraData?.filter((_, index) => index !== indexToRemove)
        const UpdateJsonParT = { ...PrevJsonData, extraData: UpdateJsonParr }
        localStorage.setItem("Rd9!tMQ4vz#1gN*B6_+7@x==", JSON.stringify(UpdateJsonParT));
    };
    // Drawer Extra Data














    const [HaddPhoto, setHAddPhoto] = useState();
    const [HuploadDocument, setHUploadDocument] = useState();
    const [HsafetyDocument, setHSafetyDocument] = useState();
    const [HwarrantyDocument, setHWarrantyDocument] = useState();
    const [HJSA1, setHJSA1] = useState([]);
    const [HJSA2, setHJSA2] = useState([]);





    const [addPhoto, setAddPhoto] = useState([]);
    const [uploadDocument, setUploadDocument] = useState([]);
    const [safetyDocument, setSafetyDocument] = useState([]);
    const [warrantyDocument, setWarrantyDocument] = useState([]);
    const [JSA1, setJSA1] = useState([]);
    const [JSA2, setJSA2] = useState([]);

    const [deleteAddPhoto, setDeleteAddPhoto] = useState([])
    const [deleteUploadDocument, setDeleteUploadDocument] = useState([])
    const [deleteSafetyDocument, setDeleteSafetyDocument] = useState([])
    const [deleteWarrantyDocument, setDeleteWarrantyDocument] = useState([])
    const [deleteJSA1, setDeleteJSA1] = useState([]);
    const [deleteJSA2, setDeleteJSA2] = useState([]);



    const fileSetters = {
        addPhoto: setAddPhoto,
        uploadDocument: setUploadDocument,
        safetyDocument: setSafetyDocument,
        warrantyDocument: setWarrantyDocument,
        JSA1: setJSA1,
        JSA2: setJSA2,
    };

    const createBeforeUploadHandler = (key) => (file) => {
        const setter = fileSetters[key];
        if (setter) {
            setter((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
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


    function generateBase64UrlId(byteLength = 64) {
        const bytes = new Uint8Array(byteLength);
        crypto.getRandomValues(bytes);
        return btoa(String.fromCharCode(...bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }


    const currentProjectManagerId = Array.isArray(currectProjectObj?.projectManager) && currectProjectObj.projectManager.length > 0
        ? currectProjectObj.projectManager[0]?._id ?? ""
        : "";



    const [isJSACompelete, setIsJSACompelete] = useState(false);
    const [isJSAOpened, setIsJSAOpened] = useState(false);
    const [formDataNew, setFormDataNew] = useState(null);
    useEffect(() => {
        if (isJSAOpened && formDataNew) {
            adddataWorkOrder(formDataNew);
        }
    }, [isJSAOpened, formDataNew]);

    const showJSAModal = () => {
        setIsJSACompelete(true);
    };
    const CancelJSAModal = () => {
        setIsJSACompelete(false);
        setIsJSAOpened(false)
    };
    const CancelJSAModalError = () => {
        setIsJSACompelete(false);
        setIsJSAOpened(false)
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

        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const dateNow = new Date().toISOString();
        const formData = new FormData();
        const totalItems = [
            ...uploadDocument,
            ...addPhoto,
            ...safetyDocument,
            ...warrantyDocument,
        ].length;
        const {
            dateApproved: rawDateApproved,
            reportedDate: rawReportedDate,
            reminderDateandTime: rawReminderDateandTime
        } = data;
        const dateApprovedRefine = dayjs(rawDateApproved == undefined ? "Invalid Date" : rawDateApproved).format('YYYY-MM-DD HH:mm:ss')
        const reportedDateRefine = dayjs(rawReportedDate == undefined ? "Invalid Date" : rawReportedDate).format('YYYY-MM-DD HH:mm:ss')
        const reminderDateandTimeRefine = dayjs(rawReminderDateandTime == undefined ? "Invalid Date" : rawReminderDateandTime).format('YYYY-MM-DD HH:mm:ss')


        function generateRandomId(length = 8) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let id = '';
            for (let i = 0; i < length; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return id;
        }


        const fileArray = [
            ...(uploadDocument || []).map((file, index) => ({
                fileName: `${generateRandomId()} ${file.name}`,
                contentType: file.type,
                size: file.size,
                source: "uploadDocument",
            })),
            ...(addPhoto || []).map((file, index) => ({
                fileName: `${generateRandomId()} ${file.name}`,
                contentType: file.type,
                size: file.size,
                source: "addPhoto",
            })),
            ...(safetyDocument || []).map((file, index) => ({
                fileName: `${generateRandomId()} ${file.name}`,
                contentType: file.type,
                size: file.size,
                source: "safetyDocument",
            })),
            ...(warrantyDocument || []).map((file, index) => ({
                fileName: `${generateRandomId()} ${file.name}`,
                contentType: file.type,
                size: file.size,
                source: "warrantyDocument",
            })),
            ...(JSA1 || []).map((file, index) => ({
                fileName: `${generateRandomId()} ${file.name}`,
                contentType: file.type,
                size: file.size,
                source: "JSA1",
            })),
            ...(JSA2 || []).map((file, index) => ({
                fileName: `${generateRandomId()} ${file.name}`,
                contentType: file.type,
                size: file.size,
                source: "JSA2",
            })),

        ];

        const actualFiles = [
            ...(uploadDocument || []).map(file => ({
                file,
                source: "uploadDocument",
            })),
            ...(addPhoto || []).map(file => ({
                file,
                source: "addPhoto",
            })),
            ...(safetyDocument || []).map(file => ({
                file,
                source: "safetyDocument",
            })),
            ...(warrantyDocument || []).map(file => ({
                file,
                source: "warrantyDocument",
            })),
            ...(JSA1 || []).map(file => ({
                file,
                source: "JSA1",
            })),
            ...(JSA2 || []).map(file => ({
                file,
                source: "JSA2",
            })),
        ];



        let polygon1 = {};

        const meta = JSON.stringify({
            id: currentDailyProject,
            type: "project",
            title: data?.projectName,
        });
        if (selectedTab === 1) {
            polygon1.polygon = {
                type: "Circle",
                safetyZone: safetyOffset || 0,
                altitude: Number(altitude) || 0,
                radius: parentRadius || 0,
                locations: [
                    [
                        (actualCenter?.lat ?? location.lat)?.toString(),
                        (actualCenter?.lng ?? location.lng)?.toString(),
                    ],
                ],
                meta,
                latitude: location.lat,
                longitude: location.lng,
            };
        }
        if (selectedTab === 2) {
            polygon1.polygon = {
                type: "Polygon",
                safetyZone: padding || 0,
                altitude: Number(altitude) || 0,
                radius: parentRadius || 0,
                locations: points.map(p => [
                    p.lat.toString(),
                    p.lng.toString(),
                ]),
                meta,
                latitude: centerLNG.lat,
                longitude: centerLNG.lng,
            };
        }
        if (selectedTab === 3) {
            polygon1.polygon = {
                type: "Polyline",
                safetyZone: safetyOffsetMore || 0,
                altitude: Number(altitude) || 0,
                radius: parentRadius || 0,
                locations: pointsMore.map(p => [
                    p.lat.toString(),
                    p.lng.toString(),
                ]),
                meta,
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

            if (expandNMO) {
                if (selectedContractorIds.length > 0) {
                    setCreateLoading(true)
                    const AwsUpload = await AWSUploadModuleFilter({
                        messageApi,
                        fileArray,
                        actualFile: actualFiles,
                        moduleName: "project",
                        setCreateLoading,
                    });
                    const filterBySource = source =>
                        AwsUpload?.filter(f => f.source === source);

                    const payload = {
                        project_name: data?.projectName || "",
                        address: data?.address || "",
                        project_manager: data?.projectmanager || "",
                        nmo_date: dateNow || "",
                        dailyProjectId: currentDailyProject || "",

                        extraFields:
                            JSON.stringify(extraDataList?.length > 0
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
                                : []),

                        nmo_i_r: data?.incidentReview || "",

                        date: dateNow || "",
                        sc_date: dateNow || "",

                        add_hours_worked:
                            JSON.stringify(personanalDataArray?.length > 0
                                ? personanalDataArray.map(item => ({
                                    id: generateBase64UrlId(),
                                    name: item.name,
                                    date_and_hours: item.date_and_hours.map(r => ({
                                        date: dayjs(r.date).format("YYYY-MM-DD"),
                                        no_of_hours: r.no_of_hours.toString(),
                                    })),
                                }))
                                : []),

                        documents: filterBySource("uploadDocument"),
                        photosOrVideos: filterBySource("addPhoto"),
                        safetyDocumentation: filterBySource("safetyDocument"),
                        warrantyDocumentation: filterBySource("warrantyDocument"),
                        otherDocumentation: filterBySource("JSA1"),
                        jsaDocumentation: filterBySource("JSA2"),

                        documentIds: JSON.stringify(HuploadDocument
                            ? dailyProjectDetailData?.documents
                                ?.filter(d => !deleteUploadDocument.includes(d?._id))
                                .map(d => d._id)
                            : []),

                        photosOrVideoIds: JSON.stringify(HaddPhoto
                            ? dailyProjectDetailData?.photosOrVideos
                                ?.filter(d => !deleteAddPhoto.includes(d?._id))
                                .map(d => d._id)
                            : []),

                        safetyDocumentationIds: JSON.stringify(HsafetyDocument
                            ? dailyProjectDetailData?.safetyDocumentation
                                ?.filter(d => !deleteSafetyDocument.includes(d?._id))
                                .map(d => d._id)
                            : []),

                        warrantyDocumentationIds: JSON.stringify(HwarrantyDocument
                            ? dailyProjectDetailData?.warrantyDocumentation
                                ?.filter(d => !deleteWarrantyDocument.includes(d?._id))
                                .map(d => d._id)
                            : []),
                        otherDocumentationIds: JSON.stringify(HJSA1
                            ? dailyProjectDetailData?.otherDocumentation
                                ?.filter(d => !deleteJSA1.includes(d?._id))
                                .map(d => d._id)
                            : []),

                        jsaDocumentationIds:
                            JSON.stringify(HJSA2
                                ? dailyProjectDetailData?.jsaDocumentation
                                    ?.filter(d => !deleteJSA2.includes(d?._id))
                                    .map(d => d._id)
                                : []),






                        nmo_v_r_t: data?.verballyReportedTo || "",

                        nmo_contractor: selectedContractorIds || [],

                        nmo_v_r_t_date:
                            reportedDateRefine === "Invalid Date" ? "" : reportedDateRefine,

                        nmo_r_c_a_w_h: data?.whatHappend || "",
                        nmo_r_c_a_w_d_i_h: data?.whyDidItHappen || "",
                        nmo_r_c_a_h_t_p_r: data?.howToPR || "",
                        nmo_r_c_a_r_t_r_s:
                            reportedDateRefine === "Invalid Date" ? "" : reportedDateRefine,

                        sc_d_o_c: data?.descriptionOfChanges || "",
                        sc_s_c_a_c: data?.safetyCOC || "",

                        sc_approvals: JSON.stringify(listemailCTC || []),
                        sc_notification: JSON.stringify(data?.approvers || []),

                        sc_d_a:
                            dateApprovedRefine === "Invalid Date" ? "" : dateApprovedRefine,

                        sc_r_a_s:
                            reminderDateandTimeRefine === "Invalid Date"
                                ? ""
                                : reminderDateandTimeRefine,

                        projectId: currectProjectObj?._id || "",
                    };

                    const payloadNew = {
                        ...payload,
                        location: polygon1.polygon ? JSON.stringify(polygon1.polygon) : "{}",
                    };

                    const controller = new AbortController();
                    const timeout = setTimeout(() => {
                        controller.abort();
                    }, 10000000);
                    if (isJSAOpened) {
                        try {
                            setCreateLoading(true);
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
                            if (actualFiles?.length > 0) {
                                if (AwsUpload) {
                                    response = await fetch(`${baseUrl}/dailyprojects`, options);
                                }
                            }
                            else {
                                response = await fetch(`${baseUrl}/dailyprojects`, options);
                            }
                            // const response = await fetch(`${baseUrl}/dailyprojects`, options);
                            const res = await response.json();
                            clearTimeout(timeout);
                            setCreateLoading(false);
                            if (response.status === 403) {
                                if ("roleUpdated" in res) {
                                    handleUnauthorized();
                                }
                                else {
                                    messageApi.open({
                                        type: "info",
                                        content: "Payment expired",
                                    });
                                }
                            } else if (response.status === 200 || response.status === 201) {
                                // LoadDailyProject(currentParentProject, 1, "")
                                messageApi.open({
                                    type: "success",
                                    content: "Project updated successfully.",
                                });
                                navigate("/project/daily-project");
                            } else if (response.status === 500) {
                                messageApi.open({
                                    type: "error",
                                    content: "Something went wrong",
                                });
                            } else if (response.status === 507) {
                                messageApi.open({
                                    type: "error",
                                    content: "Storage limit exceeded",
                                });
                            } else if (response.status === 400) {
                                messageApi.open({
                                    type: "error",
                                    content: "Something went wrong",
                                });
                            }

                        } catch (err) {
                            clearTimeout(timeout);
                            setCreateLoading(false);
                            console.error("Error submitting:", err);
                            messageApi.open({
                                type: "error",
                                content: "Network error or request aborted.",
                            });
                        }

                    }
                    else {
                        showJSAModal()
                    }
                } else {
                    messageApi.destroy();
                    messageApi.open({
                        type: "error",
                        content: "Please select a contractor",
                    });
                }
            }
            else {
                const controller = new AbortController();
                const timeout = setTimeout(() => {
                    controller.abort();
                }, 10000000);
                if (isJSAOpened) {
                    setCreateLoading(true)
                    const AwsUpload = await AWSUploadModuleFilter({
                        messageApi,
                        fileArray,
                        actualFile: actualFiles,
                        moduleName: "project",
                        setCreateLoading,
                    });
                    const filterBySource = source =>
                        AwsUpload?.filter(f => f.source === source);

                    const payload = {
                        project_name: data?.projectName || "",
                        address: data?.address || "",
                        project_manager: data?.projectmanager || "",
                        nmo_date: dateNow || "",
                        dailyProjectId: currentDailyProject || "",

                        extraFields:
                            JSON.stringify(extraDataList?.length > 0
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
                                : []),

                        nmo_i_r: data?.incidentReview || "",

                        date: dateNow || "",
                        sc_date: dateNow || "",

                        add_hours_worked:
                            JSON.stringify(personanalDataArray?.length > 0
                                ? personanalDataArray.map(item => ({
                                    id: generateBase64UrlId(),
                                    name: item.name,
                                    date_and_hours: item.date_and_hours.map(r => ({
                                        date: dayjs(r.date).format("YYYY-MM-DD"),
                                        no_of_hours: r.no_of_hours.toString(),
                                    })),
                                }))
                                : []),

                        documents: filterBySource("uploadDocument"),
                        photosOrVideos: filterBySource("addPhoto"),
                        safetyDocumentation: filterBySource("safetyDocument"),
                        warrantyDocumentation: filterBySource("warrantyDocument"),
                        otherDocumentation: filterBySource("JSA1"),
                        jsaDocumentation: filterBySource("JSA2"),

                        documentIds: JSON.stringify(HuploadDocument
                            ? dailyProjectDetailData?.documents
                                ?.filter(d => !deleteUploadDocument.includes(d?._id))
                                .map(d => d._id)
                            : []),

                        photosOrVideoIds: JSON.stringify(HaddPhoto
                            ? dailyProjectDetailData?.photosOrVideos
                                ?.filter(d => !deleteAddPhoto.includes(d?._id))
                                .map(d => d._id)
                            : []),

                        safetyDocumentationIds: JSON.stringify(HsafetyDocument
                            ? dailyProjectDetailData?.safetyDocumentation
                                ?.filter(d => !deleteSafetyDocument.includes(d?._id))
                                .map(d => d._id)
                            : []),

                        warrantyDocumentationIds: JSON.stringify(HwarrantyDocument
                            ? dailyProjectDetailData?.warrantyDocumentation
                                ?.filter(d => !deleteWarrantyDocument.includes(d?._id))
                                .map(d => d._id)
                            : []),

                        otherDocumentationIds: JSON.stringify(HJSA1
                            ? dailyProjectDetailData?.otherDocumentation
                                ?.filter(d => !deleteJSA1.includes(d?._id))
                                .map(d => d._id)
                            : []),

                        jsaDocumentationIds:
                            JSON.stringify(HJSA2
                                ? dailyProjectDetailData?.jsaDocumentation
                                    ?.filter(d => !deleteJSA2.includes(d?._id))
                                    .map(d => d._id)
                                : []),


                        nmo_v_r_t: data?.verballyReportedTo || "",

                        nmo_contractor: selectedContractorIds || [],

                        nmo_v_r_t_date:
                            reportedDateRefine === "Invalid Date" ? "" : reportedDateRefine,

                        nmo_r_c_a_w_h: data?.whatHappend || "",
                        nmo_r_c_a_w_d_i_h: data?.whyDidItHappen || "",
                        nmo_r_c_a_h_t_p_r: data?.howToPR || "",
                        nmo_r_c_a_r_t_r_s:
                            reportedDateRefine === "Invalid Date" ? "" : reportedDateRefine,

                        sc_d_o_c: data?.descriptionOfChanges || "",
                        sc_s_c_a_c: data?.safetyCOC || "",

                        sc_approvals: JSON.stringify(listemailCTC || []),
                        sc_notification: JSON.stringify(data?.approvers || []),

                        sc_d_a:
                            dateApprovedRefine === "Invalid Date" ? "" : dateApprovedRefine,

                        sc_r_a_s:
                            reminderDateandTimeRefine === "Invalid Date"
                                ? ""
                                : reminderDateandTimeRefine,

                        projectId: currectProjectObj?._id || "",
                    };

                    const payloadNew = {
                        ...payload,
                        location: polygon1.polygon ? JSON.stringify(polygon1.polygon) : "{}",
                    };

                    try {
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
                        if (actualFiles?.length > 0) {
                            if (AwsUpload) {
                                response = await fetch(`${baseUrl}/dailyprojects`, options);
                            }
                        }
                        else {
                            response = await fetch(`${baseUrl}/dailyprojects`, options);
                        }
                        // const response = await fetch(`${baseUrl}/dailyprojects`, options);
                        const res = await response.json();
                        clearTimeout(timeout);
                        setCreateLoading(false);

                        if (response.status === 403) {
                            if ("roleUpdated" in res) {
                                handleUnauthorized();
                            }
                            else {
                                messageApi.open({
                                    type: "info",
                                    content: "Payment expired",
                                });
                            }
                        } else if (response.status === 200 || response.status === 201) {
                            // LoadDailyProject(currentParentProject, 1, "")
                            messageApi.open({
                                type: "success",
                                content: "Project update successfully.",
                            });
                            navigate("/project/daily-project");
                        } else if (response.status === 500) {
                            messageApi.open({
                                type: "error",
                                content: "Something went wrong",
                            });
                        } else if (response.status === 507) {
                            messageApi.open({
                                type: "error",
                                content: "Storage limit exceeded",
                            });
                        } else if (response.status === 400) {
                            messageApi.open({
                                type: "error",
                                content: "Something went wrong",
                            });
                        }

                    } catch (err) {
                        clearTimeout(timeout);
                        setCreateLoading(false);
                        console.error("Error submitting:", err);
                        messageApi.open({
                            type: "error",
                            content: "Network error or request aborted.",
                        });
                    }
                }
                else {
                    showJSAModal()
                }
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





    const [showConfirmFor, setShowConfirmFor] = useState(null);

    const handleSwitchChange = (type, checked) => {
        if (checked) {
            type === "NMO" ? setExpandNMO(true) : setExpandSC(true);
        } else {
            setShowConfirmFor(type);
        }
    };

    const resetFields = (fields) => {
        fields.forEach((field) => {
            const arrayFields = ["approvers"];
            const defaultValue = arrayFields.includes(field) ? [] : "";
            resetField(field, { defaultValue });
        });
    };
    const confirmTurnOff = () => {
        if (showConfirmFor === "NMO") {
            setExpandNMO(false)
            setSelectedContractorIds([])
            resetFields([
                "incidentReview",
                "verballyReportedTo",
                "reportedDate",
                "whatHappend",
                "whyDidItHappen",
                "howToPR",
            ]);
        };
        if (showConfirmFor === "SC") {
            setExpandSC(false)
            setListEmailCTC([])
            resetFields([
                "descriptionOfChanges",
                "safetyCOC",
                "approvers",
                "dateApproved",
                "reminderDateandTime",
            ]);
        };
        setShowConfirmFor(null);
    };

    const cancelTurnOff = () => {
        setShowConfirmFor(null);
    };



    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    const ComapnyUserData = WorkOrderReducer?.companyUserData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
    })





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



    console.log(JSA1?.length, JSA2?.length, HJSA1?.length, HJSA2?.length, 'ASD((((')




    return (

        <>


            <Modal
                title="JSA (Job Safety Analysis)"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isJSACompelete}
                footer={() => <></>}
                onCancel={CancelJSAModal}
                onClose={CancelJSAModal}
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
            >
                <div className={Style.FeildColLeftMODAL}>
                    <label style={{ marginBottom: 10 }}>Confined Space Paperwork <span style={{ fontSize: 12, color: 'red' }}>(Required)</span></label>
                    <Upload onRemove={(e) => setJSA1(prev =>
                        prev.filter(file => file.uid !== e.uid)
                    )} accept={".pdf,.docx,.doc"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('JSA1')}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    <div style={{ marginTop: 10 }}>
                        {dailyProjectDetailData?.otherDocumentation?.length > 0 ? dailyProjectDetailData?.otherDocumentation?.filter(data => !deleteJSA1.includes(data?._id))?.map(data => {
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>

                                    <a onClick={async () => {
                                        const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                        if (AllowNewTab?.url) {
                                            window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                        }
                                    }} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                        {data?.fileName}
                                    </a>
                                    <div onClick={() => setDeleteJSA1(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                        <AiOutlineDelete size={22} color='red' />
                                    </div>
                                </div>
                            )
                        }) : ""}
                    </div>
                </div>
                <div className={Style.FeildColLeftMODAL}>
                    <label style={{ marginBottom: 10 }}>JSA (Job Safety Analysis) <span style={{ fontSize: 12, color: 'red' }}>(Required)</span></label>
                    <Upload onRemove={(e) => setJSA2(prev =>
                        prev.filter(file => file.uid !== e.uid)
                    )} accept={".pdf,.docx,.doc"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('JSA2')}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    <div style={{ marginTop: 10 }}>
                        {dailyProjectDetailData?.jsaDocumentation?.length > 0 ? dailyProjectDetailData?.jsaDocumentation?.filter(data => !deleteJSA2.includes(data?._id))?.map(data => {
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>

                                    <a onClick={async () => {
                                        const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                        if (AllowNewTab?.url) {
                                            window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                        }
                                    }} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                        {data?.fileName}
                                    </a>
                                    <div onClick={() => setDeleteJSA2(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                        <AiOutlineDelete size={22} color='red' />
                                    </div>
                                </div>
                            )
                        }) : ""}
                    </div>
                </div>
                {/* <div style={{ paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                    <button
                        style={{
                            cursor: CreateLoading || !((JSA1?.length && JSA2?.length) && (HJSA1?.length && HJSA2?.length)) ? "no-drop" : "pointer",
                            background: "#214CBC",
                            padding: "8px 25px",
                            color: "white",
                            border: "none",
                            borderRadius: "50px",
                        }}
                        disabled={CreateLoading || !((JSA1?.length && JSA2?.length) && (HJSA1?.length && HJSA2?.length))}
                        onClick={handleSubmit((data) => {
                            setFormDataNew(data);
                            setIsJSAOpened(true);
                        })}
                    >
                        {CreateLoading ? "Saving Daily Project..." : "Save Daily Project"}
                    </button>
                </div> */}

                <div style={{ paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                    <button
                        style={{
                            cursor: CreateLoading || !((JSA1?.length || HJSA1?.length) && (JSA2?.length || HJSA2?.length))
                                ? "no-drop"
                                : "pointer",
                            background: "#214CBC",
                            padding: "8px 25px",
                            color: "white",
                            border: "none",
                            borderRadius: "50px",
                        }}
                        disabled={CreateLoading || !((JSA1?.length || HJSA1?.length) && (JSA2?.length || HJSA2?.length))}
                        onClick={handleSubmit((data) => {
                            setFormDataNew(data);
                            setIsJSAOpened(true);
                        })}
                    >
                        {CreateLoading ? "Saving Daily Project..." : "Save Daily Project"}
                    </button>
                </div>
            </Modal>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>Edit Daily Project</h1>
                        <div>
                            <button style={{ cursor: "pointer" }} disabled={CreateLoading} onClick={handleSubmit(adddataWorkOrder)}>{CreateLoading ? "Saving Daily Project..." : "Save Daily Project"}</button>
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
                                        <Input disabled={CreateLoading} onChange={onChange} value={value} status={errors?.projectName?.message !== undefined ? 'error' : ''} placeholder='Enter Project Name' style={{ height: 45, marginTop: 3 }} />
                                    )}
                                    name="projectName"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Address</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input disabled={CreateLoading} onChange={onChange} value={value} status={errors?.address?.message !== undefined ? 'error' : ''} placeholder='Enter Address' style={{ height: 45, marginTop: 3 }} />
                                    )}
                                    name="address"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Personanel <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <div className={Style.AddExtraDataFeild} onClick={showAddDrawer}>
                                    <div>
                                        <p>Hours Worked<span> {`(${personanalDataArray.length})`}</span></p>
                                    </div>
                                    <div>
                                        <button>Add</button>
                                    </div>
                                </div>
                            </div>
                            <div className={Style.FeildColRight}>
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

                            {/* Personanal drawer */}
                            <Drawer
                                maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                                title="Add Hours Worked"
                                placement={'right'}
                                onClose={closeAddDrawer}
                                open={addDrawer}
                                key={'right'}
                            >

                                {listEditDrawer?.name !== undefined && listEditDrawer?.name !== null ?
                                    <>
                                        <div style={{ paddingTop: 10 }}>
                                            <label>Name</label>
                                            <Input value={listEditDrawer?.name} onChange={(e) => setlistEditDrawer(prev => ({ ...prev, name: e.target.value }))} placeholder='Name here' style={{ height: 45, marginTop: 3 }} />
                                        </div>
                                        {listEditDrawer?.date_and_hours.map((entry, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, flex: 1, paddingRight: 3 }}>
                                                    <label>Date</label>
                                                    <DatePicker inputReadOnly
                                                        value={entry.date ? dayjs(entry.date, 'YYYY-MM-DD') : null}
                                                        minDate={dayjs(formattedDate, dateFormat2)}
                                                        format={dateFormat2}
                                                        placeholder='Date here'
                                                        style={{ height: 45, marginTop: 3 }}
                                                        onChange={(date) => {
                                                            setlistEditDrawer(prev => ({
                                                                ...prev,
                                                                date_and_hours: prev.date_and_hours.map((item, idx) =>
                                                                    idx === i ? { ...item, date: date ? dayjs(date).format('YYYY-MM-DD') : null } : item
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, flex: 1, paddingLeft: 3 }}>
                                                    <label>No of hours</label>
                                                    <InputNumber
                                                        value={entry.no_of_hours}
                                                        keyboard={false}
                                                        max={999}
                                                        maxLength={3}
                                                        placeholder='Number of hours'
                                                        style={{ height: 45, marginTop: 3, width: '100%', display: 'flex', alignItems: 'center' }}
                                                        onChange={(value) => {
                                                            setlistEditDrawer(prev => ({
                                                                ...prev,
                                                                date_and_hours: prev.date_and_hours.map((item, idx) =>
                                                                    idx === i ? { ...item, no_of_hours: value } : item
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    onClick={() => handleRemoveSEntry(i)}
                                                    style={{ padding: 10, display: 'flex', alignItems: "center", justifyContent: 'center', cursor: 'pointer' }}
                                                >
                                                    <MdOutlineDeleteOutline size={22} color='red' />
                                                </div>
                                            </div>
                                        ))}

                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, flex: 1, paddingRight: 3 }}>
                                                <label>Date</label>
                                                <DatePicker inputReadOnly minDate={dayjs(formattedDate, dateFormat2)} value={personanalSData.date ? dayjs(personanalSData.date, 'YYYY-MM-DD') : null} onChange={(e) => setPersonanalSData(prev => ({ ...prev, date: e ? dayjs(e).format('YYYY-MM-DD') : null }))} format={dateFormat2} placeholder='Date here' style={{ height: 45, marginTop: 3 }} />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, flex: 1, paddingLeft: 3 }}>
                                                <label>No of hours</label>
                                                <InputNumber min={1} max={999}
                                                    maxLength={3} value={personanalSData.no_of_hours} onChange={(e) => setPersonanalSData(prev => ({ ...prev, no_of_hours: e }))} keyboard={false} placeholder='Number of hours' style={{ height: 45, marginTop: 3, width: '100%', display: 'flex', alignItems: 'center' }} />
                                            </div>
                                            <div onClick={() => handleSAddData()} style={{ padding: 10, display: 'flex', alignItems: "center", justifyContent: 'center', cursor: 'pointer' }}>
                                                <FaCheck size={22} color='green' />
                                            </div>
                                        </div>
                                        <div style={{ width: "100%", paddingTop: 20, }}>
                                            <button style={{ cursor: listEditDrawer?.date_and_hours?.length <= 0 ? 'no-drop' : 'pointer', opacity: listEditDrawer?.date_and_hours?.length <= 0 ? 0.4 : 1 }} disabled={listEditDrawer?.date_and_hours?.length <= 0 ? true : false} onClick={handleUpdateHours} className={Style.AddWorkBtn}>Update Work</button>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div style={{ paddingTop: 10 }}>
                                            <label>Name</label>
                                            <Input value={personanalData.name} onChange={(e) => setPersonanalData(prev => ({ ...prev, name: e.target.value }))} placeholder='Name here' style={{ height: 45, marginTop: 3 }} />
                                        </div>
                                        {entries.map((entry, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, flex: 1, paddingRight: 3 }}>
                                                    <label>Date</label>
                                                    <DatePicker inputReadOnly value={entry.date ? dayjs(entry.date, 'YYYY-MM-DD') : null} disabled={true} format={dateFormat2} placeholder='Date here' style={{ height: 45, marginTop: 3 }} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, flex: 1, paddingLeft: 3 }}>
                                                    <label>No of hours</label>
                                                    <InputNumber max={999}
                                                        maxLength={3} value={entry.no_of_hours} disabled={true} keyboard={false} placeholder='Number of hours' style={{ height: 45, marginTop: 3, width: '100%', display: 'flex', alignItems: 'center' }} />
                                                </div>
                                                <div onClick={() => handleRemoveEntry(i)} style={{ padding: 10, display: 'flex', alignItems: "center", justifyContent: 'center', cursor: 'pointer' }}>
                                                    <MdOutlineDeleteOutline size={22} color='red' />
                                                </div>
                                            </div>
                                        ))}
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, flex: 1, paddingRight: 3 }}>
                                                <label>Date</label>
                                                <DatePicker inputReadOnly minDate={dayjs(formattedDate, dateFormat2)} value={personanalData.date ? dayjs(personanalData.date, 'YYYY-MM-DD') : null} onChange={(e) => setPersonanalData(prev => ({ ...prev, date: e ? dayjs(e).format('YYYY-MM-DD') : null }))} format={dateFormat2} placeholder='Date here' style={{ height: 45, marginTop: 3 }} />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, flex: 1, paddingLeft: 3 }}>
                                                <label>No of hours</label>
                                                <InputNumber min={1} max={999}
                                                    maxLength={3} value={personanalData.no_of_hours} onChange={(e) => setPersonanalData(prev => ({ ...prev, no_of_hours: e }))} keyboard={false} placeholder='Number of hours' style={{ height: 45, marginTop: 3, width: '100%', display: 'flex', alignItems: 'center' }} />
                                            </div>
                                            <div onClick={() => handleAddMore()} style={{ padding: 10, display: 'flex', alignItems: "center", justifyContent: 'center', cursor: 'pointer' }}>
                                                <FaCheck size={22} color='green' />
                                            </div>
                                        </div>
                                        <div style={{ width: "100%", paddingTop: 20, }}>
                                            <button onClick={handleAddData} style={{ cursor: entries.length <= 0 ? 'no-drop' : 'pointer', opacity: entries.length <= 0 ? 0.4 : 1 }} disabled={entries.length <= 0 ? true : false} className={Style.AddWorkBtn}>Add Work</button>
                                        </div>
                                    </>
                                }
                                {personanalDataArray.length > 0 ? personanalDataArray.map((data, index) => {
                                    const totalHours = data.date_and_hours.reduce((acc, record) => acc + Number(record.no_of_hours || 0), 0);
                                    return (
                                        <Dropdown placement='bottomLeft' trigger={['click']} menu={{
                                            items: [
                                                {
                                                    key: '4',
                                                    label: (
                                                        <div onClick={() => handleRemoveMainEntry(index)} style={{ display: 'flex', alignItems: 'center' }}>
                                                            <MdOutlineDeleteOutline size={22} color='red' />
                                                            <p style={{ margin: "0px 0px 0px 2px", }}>Delete</p>
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    key: '24',
                                                    label: (
                                                        <div onClick={() => setlistEditDrawer({ ...data, id: index })} style={{ display: 'flex', alignItems: 'center' }}>
                                                            <MdOutlineModeEditOutline size={22} />
                                                            <p style={{ margin: "0px 0px 0px 2px", }}>Edit</p>
                                                        </div>
                                                    ),
                                                },
                                            ],
                                        }}>
                                            <div key={index} className={Style.MainListingHourWork} style={{ marginTop: 10 }}>
                                                <div className={Style.HoursWorkListTop}>
                                                    <h6>{data.name}</h6>
                                                </div>

                                                {data.date_and_hours.map((record, i) => (
                                                    <div key={i} className={Style.HoursWorkListBottom}>
                                                        <p>{new Date(record.date).toISOString().split('T')[0]}</p>
                                                        <p>{record.no_of_hours}</p>
                                                    </div>
                                                ))}
                                                <div className={Style.HoursWorkListBottom}>
                                                    <p></p>
                                                    <p>Total hours: {totalHours}</p>
                                                </div>
                                            </div>
                                        </Dropdown>
                                    )
                                }) : ""}
                            </Drawer>
                            {/* Personanal drawer */}

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
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColRight}>
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
                                                disabled={WorkOrderReducer?.companyUserLoading || CreateLoading}
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
                        </div>
                        <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start' }}>
                            <div className={Style.FeildColLeftSwitch}>
                                <label>Near Miss Occurrence</label>
                                <Popconfirm
                                    title="Are you sure?"
                                    description="Data will be lost, are you sure you want to close?"
                                    open={showConfirmFor === "NMO"}
                                    onConfirm={confirmTurnOff}
                                    onCancel={cancelTurnOff}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Switch checked={expandNMO} onChange={(checked) => handleSwitchChange("NMO", checked)}
                                    />
                                </Popconfirm>
                            </div>

                        </div>
                        {expandNMO && <NearMissOCC expandNMO={expandNMO} deleteContractor={deleteContractor} getContractor={getContractor} currentWorkSite={currentWorkSite} selectedContractorIds={selectedContractorIds} setSelectedContractorIds={setSelectedContractorIds} control={control} errors={errors} WorkOrderReducer={WorkOrderReducer} CreateLoading={CreateLoading} messageApi={messageApi} UpdateContractorAC={UpdateContractorAC} addContractorAC={addContractorAC} ProjectReducer={ProjectReducer} />}
                        <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start' }}>
                            <div className={Style.FeildColRightSwitch}>
                                <label>Scope Change</label>
                                <Popconfirm
                                    title="Are you sure?"
                                    description="Data will be lost, are you sure you want to close?"
                                    open={showConfirmFor === "SC"}
                                    onConfirm={confirmTurnOff}
                                    onCancel={cancelTurnOff}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Switch
                                        checked={expandSC}
                                        onChange={(checked) => handleSwitchChange("SC", checked)}
                                    />
                                </Popconfirm>                            </div>
                        </div>
                        {expandSC && <ScopeChange listemailCTC={listemailCTC} setListEmailCTC={setListEmailCTC} control={control} errors={errors} WorkOrderReducer={WorkOrderReducer} CreateLoading={CreateLoading} messageApi={messageApi} UpdateContractorAC={UpdateContractorAC} addContractorAC={addContractorAC} ProjectReducer={ProjectReducer} />}


                        <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start' }}>
                            <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                                <label style={{ marginBottom: 10 }}>Add Photos <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setAddPhoto(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} accept={".png,.jpg,.jpeg"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('addPhoto')}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                <div style={{ marginTop: 10 }}>
                                    {dailyProjectDetailData?.photosOrVideos?.length > 0 ? dailyProjectDetailData?.photosOrVideos?.filter(data => !deleteAddPhoto.includes(data?._id))?.map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                                                <a onClick={async () => {
                                                    const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                                    if (AllowNewTab?.url) {
                                                        window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                                    }
                                                }} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
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




                            <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                                <label style={{ marginBottom: 10 }}>Upload Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setUploadDocument(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} accept={".pdf,.docx,.doc"} multiple={true} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('uploadDocument')}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                <div style={{ marginTop: 10 }}>
                                    {dailyProjectDetailData?.documents?.length > 0 ? dailyProjectDetailData?.documents?.filter(data => !deleteUploadDocument.includes(data?._id))?.map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                                                <a onClick={async () => {
                                                    const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                                    if (AllowNewTab?.url) {
                                                        window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                                    }
                                                }} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
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




                            <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                                <label style={{ marginBottom: 10 }}>Safety Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setSafetyDocument(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} multiple={true} accept={".pdf,.docx,.doc"} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('safetyDocument')}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>

                                <div style={{ marginTop: 10 }}>
                                    {dailyProjectDetailData?.safetyDocumentation?.length > 0 ? dailyProjectDetailData?.safetyDocumentation?.filter(data => !deleteSafetyDocument.includes(data?._id))?.map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>

                                                <a onClick={async () => {
                                                    const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                                    if (AllowNewTab?.url) {
                                                        window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                                    }
                                                }} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                    {data?.fileName}
                                                </a>
                                                <div onClick={() => setDeleteSafetyDocument(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>
                                        )
                                    }) : ""}
                                </div>
                            </div>




                            <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                                <label style={{ marginBottom: 10 }}>Warranty Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setWarrantyDocument(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} multiple={true} accept={".pdf,.docx,.doc"} disabled={CreateLoading} beforeUpload={createBeforeUploadHandler('warrantyDocument')}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>

                                <div style={{ marginTop: 10 }}>
                                    {dailyProjectDetailData?.warrantyDocumentation?.length > 0 ? dailyProjectDetailData?.warrantyDocumentation?.filter(data => !deleteWarrantyDocument.includes(data?._id))?.map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>

                                                <a onClick={async () => {
                                                    const AllowNewTab = await WorkPOIGetByIdDoc(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                                    if (AllowNewTab?.url) {
                                                        window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                                    }
                                                }} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                    {data?.fileName}
                                                </a>
                                                <div onClick={() => setDeleteWarrantyDocument(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
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

function mapStateToProps({ PoiReducer, ProjectReducer, WorkOrderReducer }) {
    return { PoiReducer, ProjectReducer, WorkOrderReducer };
}
export default connect(
    mapStateToProps,
    { ...ProjectAction, ...POIAction, ...WorkOrderAction }
)(ProjectScreenEdit);