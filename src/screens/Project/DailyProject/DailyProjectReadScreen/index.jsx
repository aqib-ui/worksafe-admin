import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './DailyProjectReadScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider, Checkbox } from 'antd'
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


const ProjectScreenRead = ({ GetCompanyUser, WorkOrderReducer, ProjectReducer, PoiReducer, getDepartment, CreateDepartment, GetAllWorkOrderUnLink, getContractor, deleteContractor, addContractorAC, UpdateContractorAC, LoadDailyProjectDetail }) => {
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
    const currentWorkSite = localStorage.getItem('+AOQ^%^f0Gn4frTqztZadLrKg==')
    const currectDailyProject = localStorage.getItem('Cr2%gNW9ya@7mV$E4-+xTl==')
    const TIMEOUT = 1000000;




    const { dailyProjectDetailData } = ProjectReducer
    const { workOrderLinkData } = PoiReducer

    const [expandNMO, setExpandNMO] = useState(false);
    const [expandSC, setExpandSC] = useState(false);
    const [selectedContractorIds, setSelectedContractorIds] = useState([]);
    const [listemailCTC, setListEmailCTC] = useState([])



    const [personanalDataArray, setPersonanalDataArray] = useState([]);



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
                body: JSON.stringify({ keys: body }),
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
    const [document1, setDocument1] = useState([])
    const [document2, setDocument2] = useState([])
    const [document3, setDocument3] = useState([])
    const [document4, setDocument4] = useState([])
    const [document5, setDocument5] = useState([])
    const [document6, setDocument6] = useState([])

    const extractPaths = files =>
        files.map(file => new URL(file.url).pathname.replace(/^\/+/, ''));

    const alreadyRunRef = useRef(false);
    const [loadingDoc, setLoadingDoc] = useState(false);

    const loadData = async () => {
        if (dailyProjectDetailData?.length === 0) return;
        if (alreadyRunRef.current) return;

        alreadyRunRef.current = true;
        setLoadingDoc(true);

        const configs = [
            { key: 'documents', state: document1, setter: setDocument1 },
            { key: 'photosOrVideos', state: document2, setter: setDocument2 },
            { key: 'safetyDocumentation', state: document3, setter: setDocument3 },
            { key: 'warrantyDocumentation', state: document4, setter: setDocument4 },
            { key: 'otherDocumentation', state: document5, setter: setDocument5 },
            { key: 'jsaDocumentation', state: document6, setter: setDocument6 },
        ];
        const requests = configs.filter(({ key, state }) =>
            Array.isArray(dailyProjectDetailData[key]) &&
            dailyProjectDetailData[key].length > 0 &&
            state.length === 0
        ).map(async ({ key, setter }) => {
            const paths = extractPaths(dailyProjectDetailData[key]);
            const docs = await workOrderGetDoc(paths);
            setter(docs);
        });

        try {
            await Promise.all(requests);
        } finally {
            setLoadingDoc(false);
        }
    };





    const fileNameMap = new Map(
        [...(dailyProjectDetailData?.documents ?? []), ...(dailyProjectDetailData?.photosOrVideos ?? []), ...(dailyProjectDetailData?.safetyDocumentation ?? []), ...(dailyProjectDetailData?.warrantyDocumentation ?? []), ...(dailyProjectDetailData?.otherDocumentation ?? []), ...(dailyProjectDetailData?.jsaDocumentation ?? [])]?.map(file => [
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
        setExpandNMO(dailyProjectDetailData?.nmo_v_r_t ? true : false)
        setExpandSC(dailyProjectDetailData?.sc_notification?.length > 0 ? true : false)
        setParentRadius(location?.radius)
        setSafetyOffset(location?.safetyZone)
        setSelectedContractorIds(dailyProjectDetailData?.nmo_contractor ?? [])
        loadData()
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
            date_and_hours: item.date_and_hours?.map(entry => ({
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

            const killtime2 = setTimeout(() => {
                setSelectedTab(1)
            }, 4000);
            const killtime = setTimeout(() => {
                setSelectedTab(1)
                drawCircleForSee({
                    lat: Number(firstLocation[0]),
                    lng: Number(firstLocation[1]),
                }, location?.radius, location?.safetyZone)
                drawWithRadiusBounds(firstLocation, location?.radius)
            }, 1000);
            return () => {
                clearTimeout(killtime2)
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
            draggable: false,
            editable: false,
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
        getContractor(currentWorkSite)
        LoadDailyProjectDetail(currectDailyProject)
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
        incidentReview: yup.string().notRequired(),
        projectmanager: yup.string().required(),
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
                ? schema.required("Approvers is required")
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
        setValue,
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
            projectmanager: "",
            address: "",
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
            clickable: false
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
            draggable: false,
            editable: false,
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

    // PolyLine




    // Drawer Extra Data
    const [extraAddData, setExtraAddData] = useState(false);
    const showAddExtraDrawer = () => {
        setExtraAddData(true);
    };
    const closeAddExtraDrawer = () => {
        setExtraAddData(false);
    };
    const [extraDataList, setExtraDataList] = useState(JSON.parse(localStorage.getItem("Rd9!tMQ4vz#1gN*B6_+7@x==") || "{}").extraData || []);
    // Drawer Extra Data



















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
            clickable: false
        });
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
    const [addDrawer, setAddDrawer] = useState(false);
    const showAddDrawer = () => {
        setAddDrawer(true);
    };
    const closeAddDrawer = () => {
        setAddDrawer(false);
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

    const confirmTurnOff = () => {
        if (showConfirmFor === "NMO") setExpandNMO(false);
        if (showConfirmFor === "SC") setExpandSC(false);
        setShowConfirmFor(null);
    };

    const cancelTurnOff = () => {
        setShowConfirmFor(null);
    };

    const [CreateLoading, setCreateLoading] = useState(false)



    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    const ComapnyUserData = WorkOrderReducer?.companyUserData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
    })
    return (

        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>View Daily Project</h1>
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
                                <label>Address</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input disabled={true} onChange={onChange} value={value} status={errors?.address?.message !== undefined ? 'error' : ''} placeholder='Enter Address' style={{ height: 45, marginTop: 3 }} />
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
                                </div>
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Add Extra Data <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <div className={Style.AddExtraDataFeild} onClick={showAddExtraDrawer}>
                                    <div>
                                        <p>Extra Data<span> ({extraDataList.length})</span></p>
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
                                {personanalDataArray.length > 0 ? personanalDataArray?.map((data, index) => {
                                    const totalHours = data.date_and_hours?.reduce((acc, record) => acc + Number(record.no_of_hours || 0), 0);
                                    return (
                                        <div key={index} className={Style.MainListingHourWork} style={{ marginTop: 10 }}>
                                            <div className={Style.HoursWorkListTop}>
                                                <h6>{data.name}</h6>
                                            </div>

                                            {data.date_and_hours?.map((record, i) => (
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
                                    disabled={true}
                                >
                                    <Switch disabled={true} checked={expandNMO} onChange={(checked) => handleSwitchChange("NMO", checked)}
                                    />
                                </Popconfirm>
                            </div>

                        </div>
                        {expandNMO && <NearMissOCC isRead={true} selectedContractorIds={selectedContractorIds} setSelectedContractorIds={setSelectedContractorIds} control={control} errors={errors} WorkOrderReducer={WorkOrderReducer} CreateLoading={CreateLoading} messageApi={messageApi} UpdateContractorAC={UpdateContractorAC} addContractorAC={addContractorAC} ProjectReducer={ProjectReducer} />}
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
                                    disabled={true}
                                >
                                    <Switch
                                        disabled={true}
                                        checked={expandSC}
                                        onChange={(checked) => handleSwitchChange("SC", checked)}
                                    />
                                </Popconfirm>
                            </div>
                        </div>
                        {expandSC && <ScopeChange isRead={true} listemailCTC={listemailCTC} setListEmailCTC={setListEmailCTC} control={control} errors={errors} WorkOrderReducer={WorkOrderReducer} CreateLoading={CreateLoading} messageApi={messageApi} UpdateContractorAC={UpdateContractorAC} addContractorAC={addContractorAC} ProjectReducer={ProjectReducer} />}


                        {loadingDoc ?
                            <div style={{ paddingTop: 20 }}>
                                <Spin />
                            </div>
                            :
                            <>
                                {matchedFiles1?.length > 0 || matchedFiles2?.length > 0 || matchedFiles3?.length > 0 || matchedFiles4?.length > 0 || matchedFiles5?.length > 0 || matchedFiles6?.length > 0 ?
                                    <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start', margin: 0 }}>
                                        {matchedFiles1?.length > 0 ?
                                            <div className={Style.FeildColLeft} style={{ paddingInline: 0 }}>
                                                <label style={{ marginBottom: 10 }}>Upload Document</label>
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
                                                <label style={{ marginBottom: 10 }}>Add Photos</label>
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
                                                <label style={{ marginBottom: 10 }}>Confined Space Paperwork</label>
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
                                                <label style={{ marginBottom: 10 }}>JSA (Job Safety Analysis)</label>
                                                {matchedFiles6.map(data => {
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