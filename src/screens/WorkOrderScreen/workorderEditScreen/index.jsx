import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './workorderEditScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, ConfigProvider } from 'antd'
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import Autocomplete from "react-google-autocomplete";
import { Circle, GoogleMap, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineModeEditOutline, MdOutlinePolyline } from "react-icons/md";
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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import WorkSiteIcon from "../../../assets/marker_worksites.png";
import myLocationMarker from "../../../assets/myLocationMarker.png";




const WorkorderEditScreen = ({ WorkOrderReducer, GetWorkSite, GetCompanyUser, WorkOrderGetById, GetAdminWorkSite }) => {
    const current_Id = localStorage.getItem('Xy9#qLT7pw!5kD+M3/=8&v==')
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    dayjs.extend(customParseFormat);
    const dateFormat = 'YYYY-MM-DD hh:mm A';
    const dateFormat2 = 'YYYY-MM-DD';
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [messageApi, contextHolder] = message.useMessage();
    const [safetyOffset, setSafetyOffset] = useState(0);
    const [parentRadius, setParentRadius] = useState(100);
    const [mapKey, setMapKey] = useState(0)
    const [altitude, setAltitude] = useState(0);
    const navigate = useNavigate()
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const [location, setLocation] = useState(null);




















    const [HwarrantyDocumentation, setHwarrantyDocumentation] = useState()
    const [HphotosOrVideos, setHphotosOrVideos] = useState()
    const [HsafetyDocumentation, setHSafetyDocumentation] = useState()
    const [HJSADocumentation, setHJSADocumentation] = useState()



    const [selectedTab, setSelectedTab] = useState();
    const { workOrderGetByIDData } = WorkOrderReducer

    const Role_ID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')

    useEffect(() => {
        WorkOrderGetById(current_Id)
        if (Role_ID == '6768f37ff2ef345b103370df') {
            GetAdminWorkSite()
        }
        else {
            GetWorkSite()
        }
        GetCompanyUser()
    }, [])



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
        reset(
            {
                Title: workOrderGetByIDData.title,
                Worksite: workOrderGetByIDData?.WorkSite,
                Priority: workOrderGetByIDData?.priority,
                HotWork: workOrderGetByIDData?.hot_work == false ? "No" : "Yes",
                EntryRequirment: workOrderGetByIDData?.entry_requirements !== "undefined" ? workOrderGetByIDData?.entry_requirements : '',
                Workrequested: workOrderGetByIDData?.work_requested !== "undefined" ? workOrderGetByIDData?.work_requested : '',
                partsordered: workOrderGetByIDData?.mopo !== "undefined" ? workOrderGetByIDData?.mopo : '',
                ChargeableProfitCenter: workOrderGetByIDData?.cpc,
                ...(workOrderGetByIDData?.requested_date && {
                    CreationDate: dayjs(workOrderGetByIDData.requested_date).local(),
                }),
                ...(workOrderGetByIDData?.daa && {
                    DateAccessAvailable: dayjs(workOrderGetByIDData.daa).local(),
                }),
                ...(workOrderGetByIDData?.cdr && {
                    CompletionDate: dayjs(workOrderGetByIDData.cdr).local(),
                }),
                Location: workOrderGetByIDData?.cpc_location !== "undefined" ? workOrderGetByIDData?.cpc_location : '',
                AssignTo: workOrderGetByIDData?.last_assigned_by,
                isJsa: workOrderGetByIDData?.isJSA == 'false' ? false : true
            }
        )
        setIsExcel(workOrderGetByIDData?.isExcel == "true" ? true : false)
        const firstLocation = workOrderGetByIDData?.polygon?.locations?.[0];
        const transformedArray = workOrderGetByIDData?.extraFields?.map(item => {
            const { type, value, ...rest } = item;
            let rgbaString = '';
            if (type == "color") {
                const [r, g, b, a] = value?.split('|').map(Number);
                rgbaString = `rgba(${r}, ${g}, ${b}, ${a})`;
            }
            const newValue = type === "date" ? dayjs(value).local() : type === "color" ? rgbaString : value;
            return {
                ...rest,
                value: {
                    type,
                    value: newValue
                }
            };
        });


        setExtraDataList(transformedArray || []);

        const dataPersonanal = JSON.parse(workOrderGetByIDData?.add_hours_worked ? workOrderGetByIDData?.add_hours_worked : null);
        const transformedDataPersonal = dataPersonanal?.map(item => ({
            ...item,
            date_and_hours: item.date_and_hours.map(entry => ({
                ...entry,
                date: dayjs(entry.date).local()
            }))
        }));
        setPersonanalDataArray(transformedDataPersonal == null ? [] : transformedDataPersonal)
        const dataCompyToEmail = JSON.parse(workOrderGetByIDData?.email_copy_to ? workOrderGetByIDData?.email_copy_to : null);
        setListEmailCTC(dataCompyToEmail == null ? [] : dataCompyToEmail)
        setHwarrantyDocumentation(workOrderGetByIDData?.warrantyDocumentation?.length > 0 ? true : false)
        setHphotosOrVideos(workOrderGetByIDData?.photosOrVideos?.length > 0 ? true : false)
        setHSafetyDocumentation(workOrderGetByIDData?.safetyDocumentation?.length > 0 ? true : false)
        setHJSADocumentation(workOrderGetByIDData?.jsaDocumentation?.length > 0 ? true : false)
        setParentRadius(workOrderGetByIDData?.polygon?.radius)
        setSafetyOffset(workOrderGetByIDData?.polygon?.safetyZone)
        if (workOrderGetByIDData?.polygon?.type == "Circle") {
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
                drawCircle({
                    lat: Number(firstLocation[0]),
                    lng: Number(firstLocation[1]),
                })
                drawWithRadiusBounds(firstLocation, workOrderGetByIDData?.polygon?.radius)
            }, 1000);
            return () => {
                clearTimeout(killtime)
            }
        }
        if (workOrderGetByIDData?.polygon?.type === "Polygon") {
            setPoints(
                workOrderGetByIDData?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setPadding(workOrderGetByIDData?.polygon?.safetyZone)
            setAltitude(workOrderGetByIDData?.polygon?.altitude)
            drawPolyLinePolyGoneBond(workOrderGetByIDData?.polygon?.locations)
            const killtime = setTimeout(() => {
                setSelectedTab(2)
            }, 1000);
            return () => {
                clearTimeout(killtime)
            }
        }
        else if (workOrderGetByIDData?.polygon?.type === "Polyline") {
            setPointsMore(
                workOrderGetByIDData?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setSafetyOffsetMore(workOrderGetByIDData?.polygon?.safetyZone)
            setAltitude(workOrderGetByIDData?.polygon?.altitude)
            drawPolyLinePolyGoneBond(workOrderGetByIDData?.polygon?.locations)
            const killtime = setTimeout(() => {
                setSelectedTab(3)
            }, 1000);
            return () => {
                clearTimeout(killtime)
            }
        }
        return () => {
            setPoints([]);
            setExtraDataList([]);
            setPersonanalDataArray([]);
            setPointsMore([]);
            setSafetyOffset();
            setParentRadius();
            setSafetyOffsetMore(0)
            setOffsetPolygon([])
        }
    }, [workOrderGetByIDData])




































    const schema = yup.object().shape({
        Worksite: yup.string().required(),
        Title: yup.string().required(),
        CreationDate: yup.string().required(),
        Priority: yup.string().required(),
        AssignTo: yup.string().required(),
        DateAccessAvailable: yup.string().notRequired(),
        ChargeableProfitCenter: yup.string().required(),
        CompletionDate: yup.string().notRequired(),
        Location: yup.string().notRequired(),
        HotWork: yup.string().notRequired(),
        EntryRequirment: yup.string().notRequired(),
        partsordered: yup.string().notRequired(),
        Workrequested: yup.string().notRequired(),
        isJsa: yup.boolean().notRequired()

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
            Worksite: '',
            Title: '',
            CreationDate: '',
            Priority: '',
            AssignTo: '',
            DateAccessAvailable: "",
            ChargeableProfitCenter: "",
            CompletionDate: "",
            Location: "",
            HotWork: "",
            EntryRequirment: "",
            partsordered: "",
            Workrequested: "",
            isJsa: false,
        },
    });

    const WorkSiteData = WorkOrderReducer?.workSiteData?.map(data => {
        return { value: data._id, label: data?.title }
    })
    const ComapnyUserData = WorkOrderReducer?.companyUserData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
    })

    const PriorityData = [
        { value: "Immediate", label: "Immediate" },
        { value: "High", label: "High" },
        { value: "Standard", label: "Standard" }
    ]
    const CpcOption = [
        { value: "Environment", label: "Environment" },
        { value: "Maintenance", label: "Maintenance" },
        { value: "Operation", label: "Operation" },
        { value: "Capital", label: "Capital" },
    ]
    const BooleanOpiton = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ]





    const [error, setError] = useState(null);
    const [locationToggle, setLocationToggle] = useState(false);


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
    const [points, setPoints] = useState([]);
    const [pointsMore, setPointsMore] = useState([]);
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
                        value: { type: 'Boolean', value: true }
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
                        value: { type: 'Boolean', value: true }
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
            if (editExtraDataList.value.type == "boolean") {
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



    const [isExcel, setIsExcel] = useState(false)

    const isSendExcel = checked => {
        setIsExcel(checked)
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


    const [deleteWarrenty, setDeleteWarrenty] = useState([])
    const [deletePhoto, setDeletePhoto] = useState([])
    const [deleteSafety, setDeleteSafety] = useState([])
    const [deleteJsa, setDeleteJsa] = useState([])

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
        return null; // invalid format
    }
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
            ...safetyDocumentation,
            ...photosOrVideos,
        ].length;


        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const {
            CompletionDate: rawCompletion,
            CreationDate: rawCreation,
            DateAccessAvailable: rawAccess
        } = data;
        const CompletionDate = dayjs(rawCompletion).format('YYYY-MM-DD HH:mm:ss');
        const CreationDate = dayjs(rawCreation).format('YYYY-MM-DD HH:mm:ss');
        const DateAccessAvailable = dayjs(rawAccess).format('YYYY-MM-DD HH:mm:ss');
        const formData = new FormData();
        formData.append("workorderId", current_Id);
        formData.append("worksiteId", data?.Worksite);
        formData.append("worksite_name", WorkOrderReducer?.workSiteData?.find(data1 => data1._id == data?.Worksite).title ? WorkOrderReducer?.workSiteData?.find(data1 => data1._id == data?.Worksite).title : "");
        formData.append("requested_date", rawCreation !== undefined ? CreationDate : "");
        formData.append("cpc", data?.ChargeableProfitCenter);
        formData.append("cpc_location", data?.Location);
        formData.append("daa", rawAccess !== undefined && rawAccess !== null ? DateAccessAvailable : "");
        formData.append("email_bool", "true");
        formData.append("hot_work", data?.HotWork == "Yes" ? "true" : "false");
        formData.append("entry_requirements", data?.EntryRequirment);
        formData.append("none", "false");
        formData.append("cdr", rawCompletion !== undefined && rawCompletion !== null ? CompletionDate : "");
        formData.append("priority", data?.Priority);
        formData.append("isExcel", isExcel == false ? "false" : "true");
        formData.append("work_requested", data?.Workrequested);
        formData.append("isJSA", data?.isJsa);
        if (personanalDataArray.length > 0) {
            const converted = personanalDataArray.map((item) => ({
                id: generateBase64UrlId(),
                name: item.name,
                date_and_hours: item.date_and_hours.map((r) => ({
                    date: dayjs(r.date).format('YYYY-MM-DD'),
                    no_of_hours: r.no_of_hours.toString(),
                })),
            }));
            formData.append("add_hours_worked", JSON.stringify(converted));
        }
        else {
            formData.append("add_hours_worked", "[]");
        }
        formData.append("mopo", data?.partsordered);
        formData.append("mopo_date", "");

        if (photosOrVideos.length > 0) {
            photosOrVideos.forEach((file) => {
                formData.append("photosOrVideos", file);
            });
        }
        if (safetyDocumentation.length > 0) {
            safetyDocumentation.forEach((file) => {
                formData.append("safetyDocumentation", file);
            });
        }
        if (warrantyDocumentation.length > 0) {
            warrantyDocumentation.forEach((file) => {
                formData.append("warrantyDocumentation", file);
            });
        }
        if (HphotosOrVideos) {
            formData.append("photosOrVideoIds", JSON.stringify(workOrderGetByIDData?.photosOrVideos?.filter(data => !deletePhoto.includes(data?._id)).map(data => { return data._id })))
        }
        if (HsafetyDocumentation) {
            formData.append("safetyDocumentationIds", JSON.stringify(workOrderGetByIDData?.safetyDocumentation?.filter(data => !deleteSafety.includes(data?._id)).map(data => { return data._id })));
        }
        if (HwarrantyDocumentation) {
            formData.append("warrantyDocumentationIds", JSON.stringify(workOrderGetByIDData?.warrantyDocumentation?.filter(data => !deleteWarrenty.includes(data?._id)).map(data => { return data._id })));
        }
        if (HJSADocumentation) {
            formData.append("jsaDocumentationIds", JSON.stringify(workOrderGetByIDData?.jsaDocumentation?.filter(data => !deleteJsa.includes(data?._id)).map(data => { return data._id })));
        }

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
        formData.append("requested_by", data?.AssignTo);
        formData.append("completed_date", workOrderGetByIDData?.completed_date !== undefined ? workOrderGetByIDData?.completed_date : "");
        formData.append("send_to", "");
        formData.append("notification_description", "");
        formData.append("notification_title", "");
        formData.append("title", data?.Title);
        formData.append("email_copy_to", JSON.stringify(listemailCTC));
        const metaString = JSON.stringify({
            id: workOrderGetByIDData?._id,
            type: "workorder",
            title: data?.Title,
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
        if (
            selectedTab !== undefined &&
            points.length > 2 ||
            pointsMore.length > 2 ||
            circleRef.current !== null

        ) {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, 1000000);
            try {
                setCreateLoading(true)
                const options = {
                    method: "PATCH",
                    headers: {
                        "authorization": `Bearer ${token}`,
                    },
                    body: formData,
                    signal: controller.signal,
                };
                const response = await fetch(`${baseUrl}/workorder`, options);
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
                        content: "Work order created successfully.",
                    });
                    setCreateLoading(false)
                    navigate('/workorder/my-work-site')
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
                        content: "Storage limit exceeded.",
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


    const totalAllHours = personanalDataArray?.reduce((total, data) => {
        return total + data?.date_and_hours?.reduce((acc, record) => acc + Number(record.no_of_hours || 0), 0);
    }, 0);


    const [address, setAddress] = useState('');
    const [latLng, setLatLng] = useState(null);




    const [lcChanged, setLcChanged] = useState(false)
    const [LocChanged, setLocChanged] = useState(null)


    const handlePlaceSelected = (place) => {
        setLcChanged(true)
        if (place.formatted_address) {
            setAddress(place.formatted_address);
        }
        if (place.geometry) {
            const location = place.geometry.location;
            setLocChanged({
                lat: location.lat(),
                lng: location.lng(),
            })
        } else {
            console.error('Error: Place geometry not available');
        }
    };

    const [value1, setValue1] = useState(null);
    const locationDataFunc = (ee) => {
        setLcChanged(true)
        setValue1(ee)
        geocodeByAddress(ee?.label)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) =>
                setLocChanged({
                    lat: lat,
                    lng: lng,
                })
            );
    }






























































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
        const polygons = WorkOrderReducer?.workSiteData.find(data => data._id == currentWorkSite)?.polygon;
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
    }, [WorkOrderReducer?.workSiteData])


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
                setLocationToggle(true)
                setLocationCurrent({
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
                        <h1>Edit Work Order</h1>
                        <button disabled={CreateLoading || selectedTab == undefined} style={{ cursor: selectedTab == undefined ? "no-drop" : 'pointer' }} onClick={handleSubmit(adddataWorkOrder)}>{CreateLoading ? "Saving work order..." : "Save work order"}</button>
                    </div>
                    <div className={Style.ActionHeader}></div>
                </div>
                <div className={Style.TableSection}>
                    <div className={Style.FeildSide}>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Worksite</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}

                                                placeholder="Select Worksite"
                                                loading={WorkOrderReducer?.workSiteLoading}
                                                disabled={true}
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.Worksite?.message !== undefined ? 'error' : ''}
                                                style={{ marginTop: 3, width: "100%", height: 45 }}
                                                options={WorkSiteData}
                                            />
                                        )
                                    }}
                                    name="Worksite"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Title</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input disabled={CreateLoading} onChange={onChange} value={value} status={errors?.Title?.message !== undefined ? 'error' : ''} placeholder='Enter Title' style={{ height: 45, marginTop: 3 }} />
                                    )}
                                    name="Title"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Creation Date</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <DatePicker inputReadOnly disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat)} onChange={onChange} value={value} status={errors?.CreationDate?.message !== undefined ? 'error' : ''} placeholder='Select Creation Date' style={{ height: 45, marginTop: 3 }} />
                                        )
                                    }}
                                    name="CreationDate"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Priority</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            disabled={CreateLoading}
                                            placeholder="Select Priority"
                                            onChange={onChange}
                                            value={value == "" ? null : value}
                                            status={errors?.Priority?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={PriorityData}
                                        />)}
                                    name="Priority"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Assign To</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                placeholder="Select User"
                                                loading={WorkOrderReducer?.companyUserLoading}
                                                disabled={WorkOrderReducer?.companyUserLoading || CreateLoading}
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.AssignTo?.message !== undefined ? 'error' : ''}
                                                style={{ marginTop: 3, width: "100%", height: 45 }}
                                                options={ComapnyUserData}
                                            />)
                                    }}
                                    name="AssignTo"
                                />
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Date Access Available</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat)} onChange={onChange} value={value} status={errors?.DateAccessAvailable?.message !== undefined ? 'error' : ''} placeholder='Select Date Access Available' style={{ height: 45, marginTop: 3 }} />
                                    )}
                                    name="DateAccessAvailable"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
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
                                                placeholder="Select Chargeable Profit Center"
                                                onChange={onChange}
                                                value={value == "" ? null : value}
                                                status={errors?.ChargeableProfitCenter?.message !== undefined ? 'error' : ''}
                                                style={{ marginTop: 3, width: "100%", height: 45 }}
                                                options={CpcOption}
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
                                        <DatePicker inputReadOnly showTime={{ format: 'hh:mm A', use12Hours: true }} disabled={CreateLoading} minDate={dayjs(formattedDate, dateFormat)} onChange={onChange} value={value} status={errors?.CompletionDate?.message !== undefined ? 'error' : ''} placeholder='Select Completion Date Requirement' style={{ height: 45, marginTop: 3 }} />
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
                                <label>Personanel <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <div className={Style.AddExtraDataFeild} onClick={showAddDrawer}>
                                    <div>
                                        <p>Hours Worked<span> {`(${personanalDataArray.length})`}</span></p>
                                    </div>
                                    <div>
                                        <button disabled={CreateLoading} >Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Add Extra Data <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <div className={Style.AddExtraDataFeild} onClick={showAddExtraDrawer}>
                                    <div >
                                        <p>Extra Data<span> ({extraDataList.length})</span></p>
                                    </div>
                                    <div>
                                        <button disabled={CreateLoading}>Add</button>
                                    </div>
                                </div>
                            </div>
                            <div className={Style.FeildColRight}>
                                <label>Material or Parts Ordered <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Input disabled={CreateLoading} onChange={onChange} value={value} status={errors?.partsordered?.message !== undefined ? 'error' : ''} placeholder='Enter Material or Parts Ordered' style={{ height: 45, marginTop: 3 }} />
                                        )
                                    }}
                                    name="partsordered"
                                />
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
                                                        <DatePicker inputReadOnly disabled={true} minDate={dayjs(formattedDate, dateFormat2)} value={record.date ? dayjs(record.date, 'YYYY-MM-DD') : null} format={dateFormat2} placeholder='Date here' style={{ height: 45, marginTop: 3 }} />
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
                                                            value={editExtraDataList?.value?.value ? dayjs(editExtraDataList?.value?.value, 'YYYY-MM-DD') : null}
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
                                                            size="small"
                                                            format='rgb'
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
                                                            value={extraDataState?.value?.value ? dayjs(extraDataState?.value?.value, 'YYYY-MM-DD') : null}
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
                                                            size="small"
                                                            format='rgb'
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
                                                            <Input disabled={true} value={data?.value?.value} style={{ height: 45, marginTop: 3 }} />
                                                            : data?.value?.type == "boolean" ?
                                                                <Switch
                                                                    checked={data?.value?.value}
                                                                    style={{ marginLeft: 5, width: 30 }}
                                                                />
                                                                : data?.value?.type == "date" ?
                                                                    <DatePicker inputReadOnly
                                                                        disabled={true}
                                                                        value={data?.value?.value ? dayjs(data?.value?.value, 'YYYY-MM-DD') : null}
                                                                        style={{ height: 45, marginTop: 3 }}
                                                                        contentEditable={false}
                                                                    /> : data?.value?.type == "color" ?
                                                                        <ColorPicker
                                                                            format='rgb'
                                                                            disabled={true}
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
                                <label>Work requested <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
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
                                                }} disabled={CreateLoading} rows={6} onChange={onChange} value={value} status={errors?.Workrequested?.message !== undefined ? 'error' : ''} placeholder='Enter Work requested' style={{ marginTop: 3 }} />

                                        )
                                    }}
                                    name="Workrequested"
                                />
                            </div>
                        </div>


                        <div className={Style.FeildRow} style={{ alignItems: 'flex-start' }}>
                            <div className={Style.FeildColRight}>
                                <label>JSA (Job Safety Analysis) <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <div>
                                                <Switch style={{ width: 50 }} onChange={onChange} disabled={CreateLoading} value={value} />
                                            </div>
                                        )
                                    }}
                                    name="isJsa"
                                />
                            </div>
                        </div>
                        <div className={Style.FeildRow} style={{ display: 'block', alignItems: 'flex-start' }}>

                            <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                                <label style={{ marginBottom: 10 }}>Warranty Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setWarrantyDocumentation(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} accept={".pdf"} multiple={true} disabled={CreateLoading} beforeUpload={handleBeforeUpload1}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.warrantyDocumentation?.length > 0 ? workOrderGetByIDData?.warrantyDocumentation.filter(data => !deleteWarrenty.includes(data?._id)).map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                                                <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                    {data?.fileName}
                                                </a>
                                                <div onClick={() => setDeleteWarrenty(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>

                                        )
                                    }) : ""}
                                </div>
                            </div>

                            <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                                <label style={{ marginBottom: 10 }}>Add Photo <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) => setPhotosOrVideos(prev =>
                                    prev.filter(file => file.uid !== e.uid)
                                )} multiple={true} accept={".png,.jpg,.jpeg"} disabled={CreateLoading} beforeUpload={handleBeforeUpload2}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.photosOrVideos?.length > 0 ? workOrderGetByIDData?.photosOrVideos.filter(data => !deletePhoto.includes(data?._id)).map(data => {
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




                            <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                                <label style={{ marginBottom: 10 }}>Safety Document <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Upload onRemove={(e) =>
                                    setSafetyDocumentation(prev =>
                                        prev.filter(file => file.uid !== e.uid)
                                    )
                                } accept={".pdf"} multiple={true} disabled={CreateLoading} beforeUpload={handleBeforeUpload3}>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>

                                <div style={{ marginTop: 10 }}>
                                    {workOrderGetByIDData?.safetyDocumentation?.length > 0 ? workOrderGetByIDData?.safetyDocumentation.filter(data => !deleteSafety.includes(data?._id)).map(data => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>

                                                <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                    {data?.fileName}
                                                </a>
                                                <div onClick={() => setDeleteSafety(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                    <AiOutlineDelete size={22} color='red' />
                                                </div>
                                            </div>
                                        )
                                    }) : ""}
                                </div>
                            </div>

                            {workOrderGetByIDData?.jsaDocumentation?.length > 0 &&
                                <div className={Style.FeildColRight} style={{ paddingInline: 0 }}>
                                    <label style={{ marginBottom: 10 }}>JSA (Job Safety Analysis) Document</label>
                                    <div >
                                        {workOrderGetByIDData?.jsaDocumentation?.length > 0 ? workOrderGetByIDData?.jsaDocumentation.filter(data => !deleteJsa.includes(data?._id)).map(data => {
                                            return (
                                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>

                                                    <a target='_blank' href={data?.url} style={{ marginLeft: 5, marginRight: 5, width: '100%', fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                        {data?.fileName}
                                                    </a>
                                                    {/* <div onClick={() => setDeleteJsa(prev => [...prev, data?._id])} style={{ cursor: 'pointer' }}>
                                                        <AiOutlineDelete size={22} color='red' />
                                                    </div> */}
                                                </div>
                                            )
                                        }) : ""}
                                    </div>
                                </div>
                            }
                        </div>
                        <div style={{ paddingTop: 20, display: 'flex', alignItems: 'flex-end' }} className={Style.FeildRow}>
                            <div>
                                <label style={{ marginBottom: 10 }}>Email copy to external contact <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Input disabled={CreateLoading} value={emailCTC} onChange={(e) => setEmailCTC(e.target.value)} type='email' placeholder='Enter Email copy to external contact' style={{ height: 45, marginTop: 3 }} />
                                    <button onClick={AddEmailExtra} className={Style.AddEmailBtn}>Add</button>
                                </div>
                            </div>

                        </div>
                        {listemailCTC.length > 0 &&
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Switch defaultChecked={isExcel} onChange={isSendExcel} />
                                    <label style={{ marginLeft: 4 }}>Send excel file with pdf</label>
                                </div>
                            </div>
                        }
                        {listemailCTC?.map((data, index) =>
                            <div style={{ paddingTop: 10, display: 'flex', alignItems: 'center' }} className={Style.FeildRow}>
                                <div>
                                    <Tooltip title={data}>
                                        <p style={{ margin: 0 }}>{data}</p>
                                    </Tooltip>
                                </div>
                                <button disabled={CreateLoading} onClick={() => DeleteEmailExtra(index)} className={Style.DeleteEmailBtn}>
                                    <AiOutlineDelete size={22} color='red' />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={Style.MapSide}>
                        {isLoaded ? (
                            <>
                                <GoogleMap
                                    key={mapKey}
                                    mapContainerStyle={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    onClick={selectedTab == 2 ? handleMapClick : selectedTab == 3 ? handleMapClickMore : null}
                                    center={lcChanged ? LocChanged : location}
                                    zoom={14.5}
                                    onLoad={onMapLoad}
                                    options={{ mapTypeId: "satellite", cameraControl: false, clickableIcons: false, streetViewControl: false, cameraControlOptions: false, fullscreenControl: false, fullscreenControlOptions: false }}
                                >
                                    {points.length >= 1 && (
                                        <>
                                            {/* Main triangle */}
                                            <Polygon
                                                path={[...points, points[0]]}
                                                options={{
                                                    fillColor: '#fe541e',
                                                    fillOpacity: 0.4,
                                                    strokeColor: '#fe541e',
                                                    strokeOpacity: 1,
                                                    strokeWeight: 2,
                                                }}
                                            />
                                            {/* Safety zone */}
                                            <Polygon
                                                path={getSafetyZonePath()}
                                                options={{
                                                    fillColor: '#90caf9',
                                                    fillOpacity: 0.2,
                                                    strokeColor: '#1e88e5',
                                                    strokeOpacity: 0.7,
                                                    strokeWeight: 2,
                                                }}
                                            />
                                        </>
                                    )}
                                    {points.map((point, index) => (
                                        <Marker
                                            key={index}
                                            position={point}
                                            onClick={() => removeIconCustomArea(index)}
                                            icon={{
                                                url: 'https://img.icons8.com/color/48/give-way.png',
                                                scaledSize: new window.google.maps.Size(40, 40),
                                            }}
                                        />
                                    ))}


                                    {/* Location Marker */}
                                    {locationCurrent &&
                                        <Marker
                                            icon={{
                                                url: myLocationMarker,
                                                scaledSize: new window.google.maps.Size(40, 50),
                                            }}
                                            position={locationCurrent} />
                                    }
                                    {/*Location Marker */}



                                    {/* CircleWorksite Marker */}
                                    {workSiteMarker &&
                                        <Marker
                                            onClick={selectedTab == 1 ? handlePolygonClick : selectedTab == 2 ? handleMapClick : selectedTab == 3 ? handleMapClickMore : null}
                                            icon={{
                                                url: WorkSiteIcon,
                                                scaledSize: new window.google.maps.Size(80, 80),
                                            }}
                                            position={workSiteMarker} />
                                    }
                                    {/* CircleWorksite Marker */}




                                    {/* PolyGonWorksite */}
                                    {pointsWorkSite.length >= 1 && (
                                        <>
                                            <Polygon
                                                onClick={selectedTab == 1 ? handlePolygonClick : selectedTab == 2 ? handleMapClick : selectedTab == 3 ? handleMapClickMore : null}
                                                path={[...pointsWorkSite, pointsWorkSite[0]]}
                                                options={{
                                                    fillColor: '#0d1e4b',
                                                    fillOpacity: 0.4,
                                                    strokeColor: '#050c1f',
                                                    strokeOpacity: 1,
                                                    strokeWeight: 2,
                                                }}
                                            />
                                        </>
                                    )}
                                    {/* PolyGonWorksite */}


                                    {/* PolyLineWorksite */}
                                    {pointsMoreWorkSite.length >= 2 && (
                                        <Polyline
                                            path={pointsMoreWorkSite}
                                            onClick={selectedTab == 1 ? handlePolygonClick : selectedTab == 2 ? handleMapClick : selectedTab == 3 ? handleMapClickMore : null}
                                            options={{
                                                strokeColor: '#050c1f',
                                                strokeOpacity: 1,
                                                strokeWeight: 2,
                                            }}
                                        />
                                    )}
                                    {/* PolyLineWorksite */}




                                    {/* Render Polyline */}
                                    {pointsMore.length >= 2 && (
                                        <Polyline
                                            path={pointsMore}
                                            options={{
                                                strokeColor: '#fe541e',
                                                strokeOpacity: 1,
                                                strokeWeight: 2,
                                            }}
                                        />
                                    )}

                                    {/* Render Safety Zone (around polyline) */}
                                    {offsetPolygon.length >= 3 && (
                                        <Polygon
                                            path={offsetPolygon}
                                            options={{
                                                fillColor: '#90caf9',
                                                fillOpacity: 0.3,
                                                strokeColor: '#1e88e5',
                                                strokeOpacity: 0.7,
                                                strokeWeight: 2,
                                            }}
                                        />
                                    )}


                                    {pointsMore.map((point, index) => (
                                        <Marker
                                            key={index}
                                            position={point}
                                            onClick={() => removeIconCustomArea2(index)}
                                            icon={{
                                                url: 'https://img.icons8.com/color/48/give-way.png',
                                                scaledSize: new window.google.maps.Size(40, 40),
                                            }}
                                        />
                                    ))}


                                    {circleRef.current !== null ?
                                        <div className={Style.PolyCardSetting}>
                                            <Popover content={() => (
                                                <div>
                                                    <div>
                                                        <label>Safety Zone</label>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="350"
                                                            step="10"
                                                            value={safetyOffset}
                                                            onChange={handleOffsetChange}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>Elevation</label>
                                                        <input
                                                            type="range"
                                                            min="-3500"
                                                            max="3500"
                                                            step="10"
                                                            value={altitude}
                                                            onChange={(e) => setAltitude(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )} placement="left">
                                                <div className={Style.PolyDot}>
                                                    <IoSettingsOutline size={20} color='black' />
                                                </div>
                                            </Popover>
                                        </div>
                                        : points.length > 0 ?
                                            <div className={Style.PolyCardSetting}>
                                                <Popover content={() => (
                                                    <div>
                                                        <div>
                                                            <label>Safety Zone</label>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="350"
                                                                step="10"
                                                                value={padding}
                                                                onChange={(e) => setPadding(Number(e.target.value))}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>Elevation</label>
                                                            <input
                                                                type="range"
                                                                min="-3500"
                                                                max="3500"
                                                                step="10"
                                                                value={altitude}
                                                                onChange={(e) => setAltitude(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                )} placement="left">
                                                    <div className={Style.PolyDot}>
                                                        <IoSettingsOutline size={20} color='black' />
                                                    </div>
                                                </Popover>
                                            </div>
                                            : pointsMore.length > 0 ?
                                                <div className={Style.PolyCardSetting}>
                                                    <Popover content={() => (
                                                        <div>
                                                            <div>
                                                                <label>Safety Zone</label>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="350"
                                                                    step="10"
                                                                    value={safetyOffsetMore}
                                                                    onChange={(e) => setSafetyOffsetMore(Number(e.target.value))}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Elevation</label>
                                                                <input
                                                                    type="range"
                                                                    min="-3500"
                                                                    max="3500"
                                                                    step="10"
                                                                    value={altitude}
                                                                    onChange={(e) => setAltitude(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )} placement="left">
                                                        <div className={Style.PolyDot}>
                                                            <IoSettingsOutline size={20} color='black' />
                                                        </div>
                                                    </Popover>
                                                </div>
                                                : ""}

                                    <div className={Style.PolyCard}>
                                        <Tooltip title="Circle" placement="leftTop">
                                            <div onClick={circleRef.current == null ? drawCircle : null} className={selectedTab == 1 ? Style.PolyDotSelect : Style.PolyDot}>
                                                <FaRegCircle size={20} color='black' />
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="Custom area" placement="leftTop">
                                            <div onClick={drawCustomArea} className={selectedTab == 2 ? Style.PolyDotSelect : Style.PolyDot}>
                                                <AiOutlineEdit size={20} color='black' />
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="Polyline" placement="leftTop">
                                            <div onClick={drawPolyLine} className={selectedTab == 3 ? Style.PolyDotSelect : Style.PolyDot}>
                                                <MdOutlinePolyline size={20} color='black' />
                                            </div>
                                        </Tooltip>
                                    </div>

                                    <div className={Style.PolyCenter}>
                                        <Tooltip title="Move to current location" placement="leftTop">
                                            <div onClick={handleRecenter} className={Style.PolyDot}>
                                                <MdOutlineLocationSearching size={20} color='black' />
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className={Style.PolySearch}>
                                        {/* <Autocomplete
                                            apiKey="AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY"
                                            onPlaceSelected={handlePlaceSelected}
                                            options={{
                                                types: ['address'],
                                                componentRestrictions: { country: "us" },
                                            }}
                                            placeholder="Search Places ..."
                                            className="location-search-input"
                                        /> */}
                                        <GooglePlacesAutocomplete
                                            apiKey="AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY"
                                            autocompletionRequest={{
                                                componentRestrictions: {
                                                    country: ['us'],
                                                }
                                            }}
                                            selectProps={{
                                                value1,
                                                placeholder: "Search location...",
                                                onChange: (e) => locationDataFunc(e),
                                            }}
                                            debounce={400}
                                            minLengthAutocomplete={2} />

                                    </div>
                                </GoogleMap>
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

function mapStateToProps({ WorkOrderReducer }) {
    return { WorkOrderReducer };
}
export default connect(mapStateToProps, WorkOrderAction)(WorkorderEditScreen);



