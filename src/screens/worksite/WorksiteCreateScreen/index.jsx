import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './WorksiteCreateScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider, Checkbox, Space, Typography } from 'antd'
import * as ProjectAction from '../../../../store/actions/Project/index';
import * as POIAction from '../../../../store/actions/Poi/index';
import * as TeamAction from '../../../../store/actions/Teams/index';
import * as WorkSiteAction from '../../../../store/actions/Worksite/index';
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { Circle, GoogleMap, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { FaCross, FaRegCircle } from "react-icons/fa";
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
import { MdOutlineClose } from "react-icons/md";
import evacuationIcon from '../../../assets/evacuation.png'


const WorksiteScreenCreate = ({ GetMusterStation, GetWorkSite, GetRoles, WorksiteReducer, GetManagerInWorksite, GetTeamInWorksite, TeamReducer, AlertsReducer, PoiReducer, GetAllWorkOrderUnLink, InserTeamUserV2 }) => {
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
    const mapRef = useRef(null);
    const circleRef = useRef(null);
    const childCircleRef = useRef(null)
    const [mapKey, setMapKey] = useState(0);

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


    useEffect(() => {
        const savedForms1 = JSON.parse(localStorage.getItem('Gp5!zRN8wy@2bT+L4/3cK^=')) || [];
        const polyGonParse = JSON.parse(savedForms1?.polygon || null)
        const firstLocation = polyGonParse?.locations?.[0];
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
        setParentRadius(polyGonParse?.radius ? polyGonParse?.radius : 100)
        setSafetyOffset(polyGonParse?.safetyZone ? polyGonParse?.safetyZone : 0)
        if (polyGonParse?.type == "Circle") {
            const newCenter = {
                lat: Number(firstLocation[0]),
                lng: Number(firstLocation[1])
            };
            const killtime = setTimeout(() => {
                setActualCenter(newCenter)
                setSelectedTab(1)
                drawCircleForSee({
                    lat: Number(firstLocation[0]),
                    lng: Number(firstLocation[1]),
                }, polyGonParse?.radius, polyGonParse?.safetyZone)
            }, 2000);
            return () => {
                clearTimeout(killtime)
            }
        }
        else if (polyGonParse?.type === "Polygon") {
            setSelectedTab(2)
            setPoints(
                polyGonParse?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setPadding(polyGonParse?.safetyZone)
        }
        else if (polyGonParse?.type === "Polyline") {
            setSelectedTab(3)
            setPointsMore(
                polyGonParse?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setSafetyOffsetMore(polyGonParse?.safetyZone)
        }
        return () => {
            setPoints([]);
            setPointsMore([]);
            setSafetyOffset();
            setParentRadius();
        }
    }, [mapKey])



    const drawCircleForSee = (a, b, c) => {
        setPoints([])
        setPointsMore([])
        setSelectedTab(1)
        const parent = new window.google.maps.Circle({
            map: mapRef.current,
            center: a,
            radius: b,
            strokeColor: '#050c1f',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0d1e4b',
            fillOpacity: 0.35,
            draggable: true,
            editable: true,
        });
        const child = new window.google.maps.Circle({
            map: mapRef.current,
            center: a,
            radius: b + c,
            strokeColor: '#050c1f',
            strokeOpacity: 0.7,
            strokeWeight: 2,
            fillColor: '#050c1f',
            fillOpacity: 0.3,
            clickable: false,
        });
        const newCenter = parent.getCenter();
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



    const circleRefM = useRef(null);
    const childCircleRefM = useRef(null)



    // Muster Station

    // PolyLineComplete
    const [safetyOffsetM, setSafetyOffsetM] = useState([]);
    const [offsetPolygonM, setOffsetPolygonM] = useState([]);
    const [polyLineNameM, setPolyLineNameM] = useState([]);
    const [polyLineMCenter, setPolyLineMCenter] = useState([]);



    const [pointsMoreM, setPointsMoreM] = useState([]);

    function computeOffsetPolyline(points, offsetDistance) {
        const offsetLeftPoints = [];
        const offsetRightPoints = [];

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];

            const dx = p2.lng - p1.lng;
            const dy = p2.lat - p1.lat;
            const length = Math.sqrt(dx * dx + dy * dy);

            if (length === 0) continue;

            const ux = dx / length;
            const uy = dy / length;

            // Perpendicular unit vector
            const px = -uy;
            const py = ux;

            // Convert meters → degrees
            const metersPerDegreeLat = 111_320;
            const metersPerDegreeLng = 111_320 * Math.cos((p1.lat * Math.PI) / 180);

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
        if (pointsMoreM && pointsMoreM.length > 0) {
            const newOffsetPolygons = pointsMoreM.map((polyline, i) => {
                if (!polyline || polyline.length < 2) return [];
                const offsetDistance = safetyOffsetM?.[i] ?? 0;
                const { offsetLeftPoints, offsetRightPoints } = computeOffsetPolyline(
                    polyline,
                    offsetDistance
                );
                return [...offsetLeftPoints, ...offsetRightPoints.reverse()];
            });
            setOffsetPolygonM(newOffsetPolygons);
        } else {
            setOffsetPolygonM([]);
        }
    }, [pointsMoreM, safetyOffsetM]);
    // PolyLineComplete



    // PolygonComplete
    const [paddingM, setPaddingM] = useState([]);
    const [polyGoneNameM, setPolyGoneNameM] = useState([]);
    const [pointsM, setPointsM] = useState([]);
    const [polyGoneMCenter, setPolyGoneMCenter] = useState([]);



    const getSafetyZonePathM = (polygonPoints, offsetMeters) => {
        if (!polygonPoints?.length) return [];

        const center = {
            lat: polygonPoints?.reduce((sum, p) => sum + p.lat, 0) / polygonPoints?.length,
            lng: polygonPoints?.reduce((sum, p) => sum + p.lng, 0) / polygonPoints?.length,
        };

        const padded = polygonPoints?.map((pt) => offsetPointM(pt, center, offsetMeters));
        return [...padded, padded[0]];
    };

    const offsetPointM = (point, center, offsetMeters) => {
        const R = 6378137;
        const dLat = point.lat - center.lat;
        const dLng = point.lng - center.lng;
        const latInRad = (center.lat * Math.PI) / 180;
        const dX = (dLng * Math.PI / 180) * R * Math.cos(latInRad);
        const dY = (dLat * Math.PI / 180) * R;
        const len = Math.sqrt(dX * dX + dY * dY);
        if (len === 0) return point;
        const scale = (len + offsetMeters) / len;
        const newLat = center.lat + (dY * scale / R) * (180 / Math.PI);
        const newLng = center.lng + (dX * scale / (R * Math.cos(latInRad))) * (180 / Math.PI);
        return { lat: newLat, lng: newLng };
    };
    // PolygonComplete
    // Muster Station




    useEffect(() => {
        GetManagerInWorksite()
        GetTeamInWorksite()
        GetRoles()
    }, [])


    useEffect(() => {
        if (!messageApi) return;
        if (TeamReducer.networkError) {
            messageApi.destroy();
            if (localStorage.getItem("expireUser") == "true") {
                messageApi.open({
                    type: "info",
                    content: "Payment Expired",
                });
            }
            else {
                const TimeClean = setTimeout(() => {
                    messageApi.open({
                        type: "error",
                        content: "Something went wrong, please try again",
                    });
                }, 1000);
                return () => {
                    clearTimeout(TimeClean)
                }
            }
        }
        if (TeamReducer.emailError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Email already exist, try other emails",
            });
        }
        if (TeamReducer.insetUserComplete) {
            CloseAddMemberDrawer()
            GetManagerInWorksite()
            messageApi.open({
                type: "success",
                content: "User successfully added",
            });
            const element = document.querySelector(`.ant-drawer-content-wrapper`);
            if (element) {
                element.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            };
        }

    }, [
        TeamReducer.networkError,
        TeamReducer.emailError,
        TeamReducer.insetUserComplete,
        messageApi,
    ]);






    const worksiteManagerData = WorksiteReducer?.managerData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
    })

    const RoleData = TeamReducer?.roleData?.filter(data => data?._id !== "6768f37ff2ef345b103370df" && data?._id !== "67178f602714c2b7a4d2b411" && data?._id !== "66d1603115bd5a0e63cb7cbd" && data?.priority >= localStorage.getItem('Zd9!u*K3tVp2^Ax7BQ+/==')).map(data => {
        return { value: data._id, label: data?.roleName }
    })

    const TeamData = WorksiteReducer?.teamData?.map((data, index) => {
        return {
            value: data?._id,
            label: (
                <div className={Style.MemContainer}>
                    <div className='twins-k2'>
                        {data?.title}
                    </div>
                </div>
            ),
        };
    });


    useEffect(() => {
        getDataMuster()
    }, [])

    const [musterPayload, setMusterPayload] = useState([])
    const [currectMuster, setCurrectMuster] = useState(null)
    function getDataMuster() {
        const savedForms = JSON.parse(localStorage.getItem('gT4#nL!8vQ@2zR*e6^hP+M==')) || [];
        setCurrectMuster(savedForms)
        setMusterPayload(
            savedForms?.map((data21) => ({
                musterTitle: data21?.title,
                musterPolygon: data21?.polygon,
            }))
        );
    }



    useEffect(() => {
        if (!currectMuster || !Array.isArray(currectMuster)) return;
        const parsedPolygons = currectMuster
            .map((data) => {
                try {
                    return (JSON.parse(data?.polygon) || {});
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        const polygonData = parsedPolygons.filter((p) => p?.type === "Polygon");
        const polylineData = parsedPolygons.filter((p) => p?.type === "Polyline");
        const circleData = parsedPolygons.filter((p) => p?.type === "Circle");

        if (polygonData?.length > 0) {
            setPointsM(
                polygonData.map((poly) =>
                    poly?.locations?.map(([lat, lng]) => ({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    }))
                )
            );
            setPaddingM(polygonData?.map((poly) => poly?.safetyZone || 0));
            setPolyGoneNameM(polygonData.map((line) => line?.title || ""))
            setPolyGoneMCenter(
                polygonData.map((line) => ({
                    lng: line?.longitude,
                    lat: line?.latitude,
                }))
            )
        }

        if (polylineData.length > 0) {
            setPointsMoreM(
                polylineData.map((line) =>
                    line?.locations?.map(([lat, lng]) => ({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    }))
                )
            );
            setSafetyOffsetM(polylineData.map((line) => line?.safetyZone || 0));
            setPolyLineNameM(polylineData.map((line) => line?.title || ""))
            setPolyLineMCenter(
                polylineData.map((line) => ({
                    lng: line?.longitude,
                    lat: line?.latitude,
                }))
            )
        }

        if (circleData?.length > 0) {
            const timers = circleData.map((data, index) => {
                const killtime = setTimeout(() => {
                    drawMusterCircle(
                        {
                            lat: Number(data?.locations?.[0]?.[0]),
                            lng: Number(data?.locations?.[0]?.[1]),
                        },
                        data?.radius,
                        data?.safetyZone,
                        index,
                        circleData.map((line) => line?.title || ""),
                        polylineData.map((line) => ({
                            lng: line?.longitude,
                            lat: line?.latitude,
                        }))
                    );
                }, 2000 * (index + 1));
                return killtime;
            });
            return () => {
                timers.forEach(clearTimeout);
            };
        }
        return () => {
            setPointsM([]);
            setPointsMoreM([]);
            setPaddingM([]);
            setPolyGoneNameM([]);
            setOffsetPolygonM([]);
        };
    }, [currectMuster]);




    const drawMusterCircle = (a, b, c, index1, circle2, CenterIcon) => {
        // Main Circle
        const parent = new window.google.maps.Circle({
            map: mapRef.current,
            center: a,
            radius: b,
            strokeColor: '#115638',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#548F1C',
            fillOpacity: 0.35,
            draggable: false,
            editable: false,
            clickable: true,
            zIndex: 999
        });

        // Marker at the center of the circle
        const centerMarker = new window.google.maps.Marker({
            position: a,
            map: mapRef.current,
            icon: {
                url: evacuationIcon,
                scaledSize: new window.google.maps.Size(68, 80),
            },
        });

        centerMarker.bindTo("position", parent, "center");

        // Optional marker at CenterIcon location
        new window.google.maps.Marker({
            position: CenterIcon,
            map: mapRef.current,
            icon: {
                url: evacuationIcon,
                scaledSize: new window.google.maps.Size(68, 80),
            },
        });

        const infoWindow = new window.google.maps.InfoWindow({
            content: `
      <div style="
        font-family: sans-serif;
        font-size: 13px;
        padding: 6px 8px;
        color: #333;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <strong>${circle2[index1]}</strong>
      </div>
    `,
            disableAutoPan: true,
            headerDisabled: true,
            pixelOffset: new window.google.maps.Size(0, 10),
        });

        const showInfo = () => {
            infoWindow.open({
                map: mapRef.current,
                anchor: centerMarker,
            });
        };

        const hideInfo = () => infoWindow.close();

        centerMarker.addListener("click", showInfo);
        centerMarker.addListener("mouseout", hideInfo);

        // Keep reference
        circleRefM.current = parent;
    };





    const localData = JSON.parse(localStorage.getItem("rD@5!tF8q#Vx9$zN3LpK") || "{}");
    useEffect(() => {
        GetAllWorkOrderUnLink(currentWorkSite)
    }, [])

    const schema = yup.object().shape({
        title: yup.string().max(250).required(),
        worksiteManager: yup.string().required(),
        workSiteTeam: yup.array().required(),
        speedLimit: yup.string().notRequired(),
        description: yup.string().max(250).notRequired(),
    });



    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
            worksiteManager: "",
            workSiteTeam: [],
            speedLimit: "24",
            description: "",
            ...localData
        },
    });
    useEffect(() => {
        const subscription = watch((value) => {
            const savedForms = JSON.parse(localStorage.getItem('rD@5!tF8q#Vx9$zN3LpK')) || [];
            const ParseDataBefore = { ...savedForms, ...value }
            localStorage.setItem("rD@5!tF8q#Vx9$zN3LpK", JSON.stringify(ParseDataBefore));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (!messageApi) return;
        if (AlertsReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
    }, [
        AlertsReducer.networkError,
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



    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
    });


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
            strokeColor: '#050c1f',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0d1e4b',
            fillOpacity: 0.35,
            draggable: true,
            editable: true,
        });
        const child = new window.google.maps.Circle({
            map: mapRef.current,
            center: location,
            radius: parentRadius + safetyOffset,
            strokeColor: '#050c1f',
            strokeOpacity: 0.7,
            strokeWeight: 2,
            fillColor: '#050c1f',
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
        setActualCenter()
        const newPoint = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };
        setPoints((prev) => [...prev, newPoint]);
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
        setActualCenter()
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
    const [extraAddData, setExtraAddData] = useState(false);
    const [extraDataState, setExtraDataState] = useState({ description: "" });
    const [extraDataList, setExtraDataList] = useState(JSON.parse(localStorage.getItem("rD@5!tF8q#Vx9$zN3LpK") || "{}").extraData || []);
    const [editExtraData, setEditExtraData] = useState({ id: null, description: "" });

    const showAddExtraDrawer = () => setExtraAddData(true);
    const closeAddExtraDrawer = () => setExtraAddData(false);


    const handleAddExtraData = () => {
        if (!extraDataState.description.trim()) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Please fill required fields",
            });
            return;
        }

        const newList = [...extraDataList, { description: extraDataState.description.trim() }];
        setExtraDataList(newList);
        setExtraDataState({ description: "" });

        const PrevJsonData = JSON.parse(localStorage.getItem("rD@5!tF8q#Vx9$zN3LpK") || "{}");
        const UpdateJsonParr = {
            ...PrevJsonData,
            extraData: [
                ...(PrevJsonData.extraData || []),
                { description: extraDataState.description.trim() },
            ],
        };
        localStorage.setItem("rD@5!tF8q#Vx9$zN3LpK", JSON.stringify(UpdateJsonParr));
    };

    const handleUpdateExtraData = () => {
        if (!editExtraData.description.trim()) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Please fill required fields",
            });
            return;
        }
        const updatedList = extraDataList.map((item, index) =>
            index === editExtraData.id ? { description: editExtraData.description.trim() } : item
        );
        setExtraDataList(updatedList);
        setEditExtraData({ id: null, description: "" });



        const PrevJsonData = JSON.parse(localStorage.getItem("rD@5!tF8q#Vx9$zN3LpK") || "{}");
        const updatedExtraData = (PrevJsonData?.extraData || []).map((item, index) =>
            index === editExtraData.id
                ? { description: editExtraData.description.trim() }
                : item
        );
        const UpdateJsonParT = {
            ...PrevJsonData,
            extraData: updatedExtraData,
        };
        localStorage.setItem("rD@5!tF8q#Vx9$zN3LpK", JSON.stringify(UpdateJsonParT));

    };

    const handleRemoveExtraEntry = (indexToRemove) => {
        const filteredList = extraDataList.filter((_, index) => index !== indexToRemove);
        setExtraDataList(filteredList);
        if (editExtraData.id === indexToRemove) {
            setEditExtraData({ id: null, description: "" });
        }

        const PrevJsonData = JSON.parse(localStorage.getItem("rD@5!tF8q#Vx9$zN3LpK") || "{}");
        const updatedExtraData = (PrevJsonData?.extraData || []).filter((_, index) => index !== indexToRemove);
        const updatedJson = {
            ...PrevJsonData,
            extraData: updatedExtraData,
        };
        localStorage.setItem("rD@5!tF8q#Vx9$zN3LpK", JSON.stringify(updatedJson));
    };

    // Drawer Extra Data





















    const [CreateLoading, setCreateLoading] = useState(false)
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

        const metaString = JSON.stringify({
            id: "",
            type: "worksite",
            title: data?.title,
        });

        let polygon = null;

        if (selectedTab === 1) {
            polygon = {
                safetyZone: safetyOffset || 0.0,
                altitude: Number(altitude) || 0.0,
                radius: parentRadius || 0.0,
                locations:
                    actualCenter == null
                        ? [[location.lat?.toString(), location.lng?.toString()]]
                        : [[actualCenter?.lat?.toString(), actualCenter?.lng?.toString()]],
                type: "Circle",
                meta: metaString,
                latitude: location.lat,
                longitude: location.lng,
            };
        } else if (selectedTab === 2) {
            polygon = {
                safetyZone: padding || 0.0,
                altitude: Number(altitude) || 0.0,
                radius: parentRadius || 0.0,
                locations:
                    actualCenter == null
                        ? points.map((loc) => [loc.lat.toString(), loc.lng.toString()])
                        : points.map((loc) => [loc.lat.toString(), loc.lng.toString()]),
                type: "Polygon",
                meta: metaString,
                latitude: centerLNG.lat,
                longitude: centerLNG.lng,
            };
        } else if (selectedTab === 3) {
            polygon = {
                safetyZone: safetyOffsetMore || 0.0,
                altitude: Number(altitude) || 0.0,
                radius: parentRadius || 0.0,
                locations:
                    actualCenter == null
                        ? pointsMore.map((loc) => [loc.lat.toString(), loc.lng.toString()])
                        : pointsMore.map((loc) => [loc.lat.toString(), loc.lng.toString()]),
                type: "Polyline",
                meta: metaString,
                latitude: centerLNGMore.lat,
                longitude: centerLNGMore.lng,
            };
        }


        const payload = {
            title: data?.title || "",
            description: data?.description || "",
            manager: data?.worksiteManager || "",
            teams: data?.workSiteTeam || "",
            checklist: extraDataList?.map((item) => item.description) || [],
            speedLimit: Number(data?.speedLimit) || 0,
            polygon: JSON.stringify(polygon),
            musterStations: musterPayload
        };
        if (
            selectedTab !== 0 && selectedTab !== undefined &&
            (points.length > 2 || pointsMore.length > 2 || circleRef.current !== null)
        ) {
            try {
                if (musterStorage?.length >= 1 && musterStorage.length <= 10) {
                    const controller = new AbortController();
                    const timeout = setTimeout(() => controller.abort(), 10000000);
                    setCreateLoading(true);

                    const response = await fetch(`${baseUrl}/worksites`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                        signal: controller.signal,
                    });

                    if (response.status === 403) {
                        const res = await response.json();
                        if ("roleUpdated" in res) {
                            localStorage.clear();
                            window.location.reload();
                        } else {
                            clearTimeout(timeout);
                            setCreateLoading(false);
                            messageApi.open({
                                type: "info",
                                content: "Payment expired",
                            });
                        }
                    }

                    if (response.status === 200 || response.status === 201) {
                        GetWorkSite()
                        clearTimeout(timeout);
                        messageApi.open({
                            type: "success",
                            content: "Worksite created successfully.",
                        });
                        setCreateLoading(false);
                        navigate("/worksite/my-worksite");
                    }

                    if ([400, 500, 507].includes(response.status)) {
                        clearTimeout(timeout);
                        setCreateLoading(false);
                        messageApi.open({
                            type: "error",
                            content:
                                response.status === 507
                                    ? "Storage limit exceeded"
                                    : "Something went wrong",
                        });
                    }
                    clearTimeout(timeout);
                    setCreateLoading(false);
                }
                else {
                    messageApi.destroy();
                    messageApi.open({
                        type: "error",
                        content: "Minimum 1 and maximum 10 muster station are allowed",
                    });
                }
            } catch (err) {
                setCreateLoading(false);
                console.error("Error submitting:", err);
            }
        } else {
            if (selectedTab === undefined || selectedTab === 0) {
                messageApi.destroy();
                messageApi.open({
                    type: "error",
                    content: "Please choose area in map",
                });
            } else if (points.length <= 2 || pointsMore.length <= 2) {
                messageApi.destroy();
                messageApi.open({
                    type: "error",
                    content: "Please select minimum 3 points",
                });
            }
        }

    }


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






    const schemaInvite = yup.object().shape({
        firstName: yup.string()
            .required("First name is required")
            .min(3, "First name must be at least 3 characters")
            .matches(/^[A-Za-z]+$/, "Only alphabets are allowed in first name"),
        lastName: yup.string().required("Last name is required")
            .min(3, "Last name must be at least 3 characters")
            .matches(/^[A-Za-z]+$/, "Only alphabets are allowed in last name"),

        email: yup.string()
            .required('Email is Required')
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,100}$/i, 'Invalid email address').lowercase(),

        position: yup.string()
            .required("Position is required")
            .min(3, "Position must be at least 3 characters")
            .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed in position"),

        phone: yup
            .string()
            .required("Phone is required")
            .matches(/^\+?[0-9]{10,15}$/, "Phone number must be 10–15 digits"),

        officePhone: yup.string()
            .required("Office phone is required")
            .matches(/^\+?[0-9]{10,15}$/, "Office phone must be 10–15 digits"),

        role: yup.string().required('User role is required'),
        manager: yup.string().required('Manager is required'),
    });
    const {
        control: control2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
        reset: reset2,
    } = useForm({
        resolver: yupResolver(schemaInvite),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            role: '',
            manager: 'Yes',
            position: '',
            phone: '',
            officePhone: '',

        },
    });




    const [addMemberDrawer, setAddMemberDrawer] = useState(false);

    const ShowAddMemberDrawer = () => {
        setAddMemberDrawer(true)
    }
    const CloseAddMemberDrawer = () => {
        reset2({
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            manager: "Yes",
            position: "",
            phone: "",
            officePhone: "",
        })
        setAddMemberDrawer(false)
    }



    const onSubmit = async data => {
        const Inserted = await InserTeamUserV2(data)
        setValue("worksiteManager", Inserted?._id);
    };


    // Muster Station
    const [musterStationDrawer, setMusterStationDrawer] = useState(false);
    const showMusterStationDrawer = () => setMusterStationDrawer(true);
    const closeMusterStationDrawer = () => setMusterStationDrawer(false);
    // Muster Station



    const resetMap = () => setMapKey(prev => prev + 1);

    // remove Muster Station
    function removeMusterById(idToRemove) {
        const savedForms = JSON.parse(localStorage.getItem('gT4#nL!8vQ@2zR*e6^hP+M==')) || [];
        const updatedForms = savedForms.filter(form => form.id !== idToRemove);
        localStorage.setItem('gT4#nL!8vQ@2zR*e6^hP+M==', JSON.stringify(updatedForms));
        getDataMuster()
        MusterLoadInit()

        if (!updatedForms || !Array.isArray(updatedForms)) return;
        const parsedPolygons = updatedForms
            .map((data) => {
                try {
                    return (JSON.parse(data?.polygon) || {});
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        const polygonData = parsedPolygons.filter((p) => p?.type === "Polygon");
        const polylineData = parsedPolygons.filter((p) => p?.type === "Polyline");
        const circleData = parsedPolygons.filter((p) => p?.type === "Circle");

        if (polygonData?.length >= 0) {
            setPointsM(
                polygonData.map((poly) =>
                    poly?.locations?.map(([lat, lng]) => ({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    }))
                )
            );
            setPaddingM(polygonData?.map((poly) => poly?.safetyZone || 0));
            setPolyGoneNameM(polygonData.map((line) => line?.title || ""))
        }

        if (polylineData.length >= 0) {
            setPointsMoreM(
                polylineData.map((line) =>
                    line?.locations?.map(([lat, lng]) => ({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    }))
                )
            );
            setSafetyOffsetM(polylineData.map((line) => line?.safetyZone || 0));
            setPolyLineNameM(polylineData.map((line) => line?.title || ""))
            if (polylineData.length >= 0) {
                resetMap()
            }

        }

        if (circleData?.length >= 0) {
            const timers = circleData.map((data, index) => {
                const killtime = setTimeout(() => {
                    drawMusterCircle(
                        {
                            lat: Number(data?.locations?.[0]?.[0]),
                            lng: Number(data?.locations?.[0]?.[1]),
                        },
                        data?.radius,
                        data?.safetyZone,
                        index,
                        circleData.map((line) => line?.title || "")
                    );
                }, 2000 * (index + 1));
                return killtime;
            });
            return () => {
                timers.forEach(clearTimeout);
            };
        }
    }
    // remove Muster Station


    // Load Muster Station
    const [musterStorage, setMusterStorage] = useState();
    const MusterLoadInit = () => {
        const key = 'gT4#nL!8vQ@2zR*e6^hP+M==';
        const musterStorageLocal = JSON.parse(localStorage.getItem(key)) || [];
        setMusterStorage(musterStorageLocal);
    }
    useEffect(() => {
        MusterLoadInit()
    }, []);
    // Load Muster Station



    const SaveFormDataTemp = async (data) => {
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
        const formData = new FormData();
        const metaString = JSON.stringify({
            id: "",
            type: "worksite",
            title: data?.projectName,
        });
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
        if (selectedTab == 0) {
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
                    type: "CircleBooo",
                    meta: CircleData.meta || "{}",
                    latitude: location.lat,
                    longitude: location.lng,
                })
            );
        }
        if (selectedTab == 1) {
            const metaString = JSON.stringify({
                id: "",
                type: "workorder",
                title: "",
            });
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
                    : [],
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
                    : [],
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
        const responce = saveFormDataToLocalStorage(formData)
        if (responce) {
            document.body.style.overflow = "auto";
            navigate('/worksite/muster-station')
        }
    }

    const SaveFormDataTempEdit = async (data) => {
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
        const formData = new FormData();
        const metaString = JSON.stringify({
            id: "",
            type: "worksite",
            title: "",
        });
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
        if (selectedTab == 0) {
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
                    type: "CircleBooo",
                    meta: CircleData.meta || "{}",
                    latitude: location.lat,
                    longitude: location.lng,
                })
            );
        }
        if (selectedTab == 1) {
            const metaString = JSON.stringify({
                id: "",
                type: "workorder",
                title: "",
            });
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
                    : [],
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
                    : [],
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
        const responce = saveFormDataToLocalStorage(formData)
        if (responce) {
            navigate(`/worksite/muster-station?id=${data}`)
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

    function saveFormDataToLocalStorage(form) {
        const uniqueID = generateUniqueID();
        form.append('_id', uniqueID);
        localStorage.setItem('Xr8@dQL4tz#9sJ*P2^mF=V!', uniqueID)
        form.append('createAt', new Date().toISOString());
        const jsonData = formDataToJson(form);
        localStorage.setItem('Gp5!zRN8wy@2bT+L4/3cK^=', JSON.stringify(jsonData));
        return true
    }

    return (

        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>Create Worksite</h1>
                        <div>
                            <button style={{ cursor: "pointer" }} disabled={CreateLoading} onClick={handleSubmit(adddataWorkOrder)}>{CreateLoading ? "Adding Worksite..." : "Add Worksite"}</button>
                        </div>
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
                                <label>Worksite Manager</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            disabled={WorksiteReducer?.managerLoading || CreateLoading || addMemberDrawer}
                                            placeholder="Select Worksite Manager"
                                            onChange={onChange}
                                            value={value == "" ? null : value}
                                            status={errors?.worksiteManager?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={worksiteManagerData}
                                            loading={WorksiteReducer?.managerLoading}
                                            dropdownRender={(menu) => (
                                                <>
                                                    {menu}
                                                    <div
                                                        style={{
                                                            padding: '8px',
                                                            cursor: 'pointer',
                                                            color: '#1890ff',
                                                            textAlign: 'center',
                                                            borderTop: '1px solid #f0f0f0',
                                                        }}
                                                        onClick={() => ShowAddMemberDrawer()}
                                                    >
                                                        Add Manager
                                                    </div>
                                                </>
                                            )}
                                        />)}
                                    name="worksiteManager"
                                />
                            </div>

                            <Drawer
                                maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                                title={`Invite User`}
                                placement={"right"}
                                onClose={CloseAddMemberDrawer}
                                open={addMemberDrawer}
                                footer={
                                    <div className={Style.FooterContainer}>
                                        <button onClick={CloseAddMemberDrawer}>Close</button>
                                        <button disabled={TeamReducer.userInsertLoading} style={TeamReducer.userInsertLoading ? { cursor: 'no-drop' } : { cursor: 'pointer' }} onClick={handleSubmit2(onSubmit)}>{TeamReducer.userInsertLoading ? "Adding..." : "Add user"}</button>
                                    </div>
                                }
                            >
                                <div>
                                    <div style={{ paddingTop: 10 }}>
                                        <label>First Name</label>
                                        <Controller
                                            control={control2}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Input disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} maxLength={20} status={errors2?.firstName?.message !== undefined ? 'error' : ''} placeholder='Enter first name' style={{ height: 45, marginTop: 3 }} />
                                            )}
                                            name="firstName"
                                        />
                                    </div>
                                    <div style={{ paddingTop: 10 }}>
                                        <label>Last Name</label>
                                        <Controller
                                            control={control2}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Input disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} maxLength={20} status={errors2?.lastName?.message !== undefined ? 'error' : ''} placeholder='Enter last name' style={{ height: 45, marginTop: 3 }} />
                                            )}
                                            name="lastName"
                                        />
                                    </div>
                                    <div style={{ paddingTop: 10 }}>
                                        <label>Email</label>
                                        <Controller
                                            control={control2}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Input disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} status={errors2?.email?.message !== undefined ? 'error' : ''} placeholder='Enter email' style={{ height: 45, marginTop: 3 }} />
                                            )}
                                            name="email"
                                        />
                                    </div>

                                    <div style={{ paddingTop: 10 }}>
                                        <label>Position</label>
                                        <Controller
                                            control={control2}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Input disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} status={errors2?.position?.message !== undefined ? 'error' : ''} placeholder='Enter position' style={{ height: 45, marginTop: 3 }} />
                                            )}
                                            name="position"
                                        />
                                    </div>



                                    <div style={{ paddingTop: 10 }}>
                                        <label>Phone</label>
                                        <Controller
                                            control={control2}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Input onKeyDown={(e) => {
                                                    if (["e", "E", "."].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }} type='number' disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} status={errors2?.phone?.message !== undefined ? 'error' : ''} placeholder='Enter phone' style={{ height: 45, marginTop: 3 }} />
                                            )}
                                            name="phone"
                                        />
                                    </div>


                                    <div style={{ paddingTop: 10 }}>
                                        <label>Office Phone</label>
                                        <Controller
                                            control={control2}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Input onKeyDown={(e) => {
                                                    if (["e", "E", "."].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }} type='number' count={{ show: false }} showCount={false} disabled={TeamReducer.userInsertLoading} onChange={onChange} value={value} status={errors2?.officePhone?.message !== undefined ? 'error' : ''} placeholder='Enter office phone' style={{ height: 45, marginTop: 3 }} />
                                            )}
                                            name="officePhone"
                                        />
                                    </div>
                                    <div style={{ paddingTop: 10 }}>
                                        <label>Role</label>
                                        <Controller
                                            control={control2}
                                            rules={{
                                                required: true,
                                            }}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                    placeholder="Select role"
                                                    loading={TeamReducer?.roleLoading}
                                                    disabled={TeamReducer?.roleLoading || TeamReducer.userInsertLoading}
                                                    onChange={onChange}
                                                    value={value == "" ? null : value}
                                                    status={errors2?.role?.message !== undefined ? 'error' : ''}
                                                    style={{ marginTop: 3, width: "100%", height: 45 }}
                                                    options={RoleData}

                                                />
                                            )}
                                            name="role"
                                        />
                                    </div>
                                </div>
                            </Drawer>
                        </div>
                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Worksite Team <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            disabled={WorksiteReducer?.teamLoading || CreateLoading || addMemberDrawer}
                                            placeholder="Select Worksite Team"
                                            onChange={onChange}
                                            mode="multiple"
                                            className='total-worksite-select'
                                            value={value == "" ? null : value}
                                            status={errors?.workSiteTeam?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={TeamData}
                                            loading={WorksiteReducer?.teamLoading}
                                        />)}
                                    name="workSiteTeam"
                                />
                            </div>


                            <div className={Style.FeildColRight}>
                                <label>Speed limit (Kmph) <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            type="text"
                                            inputMode="decimal"
                                            disabled={CreateLoading}
                                            value={value}
                                            placeholder="Enter speed limit"
                                            status={errors?.speedLimit?.message ? 'error' : ''}
                                            style={{ height: 45, marginTop: 3 }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^(?!\.)[0-9]*\.?[0-9]*$/.test(val)) {
                                                    onChange(val);
                                                }
                                            }}
                                        />
                                    )}
                                    name="speedLimit"
                                />
                            </div>
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
                                            <Input.TextArea maxLength={250} onFocus={() => {
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

                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColLeft}>
                                <label>Worksite Notification <span style={{ fontSize: 12, color: '#a1a1a1' }}>(optional)</span></label>
                                <div className={Style.AddExtraDataFeild} onClick={showAddExtraDrawer}>
                                    <div>
                                        <p>Notification <span> ({extraDataList?.length || 0})</span></p>
                                    </div>
                                    <div>
                                        <button disabled={CreateLoading}>Add</button>
                                    </div>
                                </div>
                            </div>



                            <div className={Style.FeildColRight}>
                                <label>Muster Station</label>
                                <div style={{
                                    opacity: selectedTab !== 0 && selectedTab !== undefined &&
                                        (points.length > 2 || pointsMore.length > 2 || circleRef.current !== null) ? 1 : 0.5, cursor: selectedTab !== 0 && selectedTab !== undefined &&
                                            (points.length > 2 || pointsMore.length > 2 || circleRef.current !== null) ? "pointer" : 'no-drop', zIndex: 999
                                }} className={Style.AddExtraDataFeild} onClick={selectedTab !== 0 && selectedTab !== undefined &&
                                    (points.length > 2 || pointsMore.length > 2 || circleRef.current !== null) ? showMusterStationDrawer : null}>
                                    <div>
                                        <p>Muster <span> ({musterStorage?.length || 0})</span></p>
                                    </div>
                                    {selectedTab !== 0 && selectedTab !== undefined &&
                                        (points.length > 2 || pointsMore.length > 2 || circleRef.current !== null) ?
                                        <>
                                            {musterStorage.length < 10 &&
                                                <div>
                                                    <button disabled={CreateLoading}>Add</button>
                                                </div>
                                            }
                                        </>
                                        : <></>}
                                </div>
                            </div>
                            {/* extra Data drawer */}
                            <Drawer
                                maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                                title={editExtraData?.id !== null ? "Edit Worksite Notification" : "Add Worksite Notification"}
                                placement="right"
                                onClose={closeAddExtraDrawer}
                                open={extraAddData}
                                key="right"
                            >
                                <div style={{ paddingTop: 15 }}>
                                    <label>Worksite Notification</label>
                                    <Input.TextArea
                                        maxLength={150}
                                        onFocus={() => (document.body.style.overflow = "hidden")}
                                        onBlur={() => (document.body.style.overflow = "auto")}
                                        value={
                                            editExtraData?.id !== null
                                                ? editExtraData.description
                                                : extraDataState.description
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (editExtraData?.id !== null) {
                                                setEditExtraData((prev) => ({ ...prev, description: value }));
                                            } else {
                                                setExtraDataState({ description: value });
                                            }
                                        }}
                                        rows={6}
                                        placeholder="Worksite Notification Here"
                                        style={{ marginTop: 3 }}
                                    />
                                </div>

                                <div style={{ width: "100%", paddingTop: 20, marginBottom: 20 }}>
                                    <button
                                        onClick={
                                            editExtraData?.id !== null
                                                ? handleUpdateExtraData
                                                : handleAddExtraData
                                        }
                                        className={Style.AddWorkBtn}
                                    >
                                        {editExtraData?.id !== null ? "Update" : "Add"} Notification
                                    </button>
                                </div>

                                {extraDataList?.length > 0 &&
                                    extraDataList.map((data, index) => (
                                        <Dropdown
                                            key={index}
                                            placement="bottomLeft"
                                            trigger={["click"]}
                                            menu={{
                                                items: [
                                                    {
                                                        key: "delete",
                                                        label: (
                                                            <div
                                                                onClick={() => handleRemoveExtraEntry(index)}
                                                                style={{ display: "flex", alignItems: "center" }}
                                                            >
                                                                <MdOutlineDeleteOutline size={22} color="red" />
                                                                <p style={{ margin: "0 0 0 5px" }}>Delete</p>
                                                            </div>
                                                        ),
                                                    },
                                                    {
                                                        key: "edit",
                                                        label: (
                                                            <div
                                                                onClick={() =>
                                                                    setEditExtraData({ id: index, description: data.description })
                                                                }
                                                                style={{ display: "flex", alignItems: "center" }}
                                                            >
                                                                <MdOutlineModeEditOutline size={22} />
                                                                <p style={{ margin: "0 0 0 5px" }}>Edit</p>
                                                            </div>
                                                        ),
                                                    },
                                                ],
                                            }}
                                        >
                                            <div className={Style.MainListingHourWork} style={{ marginTop: 10 }}>
                                                <div className={Style.HoursWorkListTop}>
                                                    <p
                                                        style={{
                                                            fontSize: 14,
                                                            marginBottom: 0,
                                                            marginTop: 0,
                                                            color: "#333",
                                                            wordBreak: "break-word",
                                                        }}
                                                    >
                                                        {data.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Dropdown>
                                    ))}
                            </Drawer>
                            {/* extra Data drawer */}




                            {/* Muster Station Drawer */}
                            <Drawer
                                maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                                title={"Muster Station"}
                                placement="right"
                                onClose={closeMusterStationDrawer}
                                open={musterStationDrawer}
                                key="right"
                            >
                                {musterStorage?.length > 0 ?
                                    <>
                                        {Array.isArray(musterStorage) && musterStorage?.length > 0 ? musterStorage.map(data =>
                                            <div className={Style.MusterFoldCard}>
                                                <p onClick={() => navigate(`/worksite/muster-station?id=${data?.id}&isRead=true`)}>{data?.title}</p>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <button onClick={() => SaveFormDataTempEdit(data?.id)}><AiOutlineEdit /></button>
                                                    {musterStorage?.length > 1 &&
                                                        <button onClick={() => removeMusterById(data?.id)} style={{ marginLeft: 5 }}><MdOutlineClose /></button>
                                                    }
                                                </div>
                                            </div>
                                        ) : ""}
                                        {musterStorage.length < 10 &&
                                            <button onClick={() => { SaveFormDataTemp() }} className={Style.AddNewMuster}>Add New</button>
                                        }
                                    </>
                                    :
                                    <div className={Style.MusterNotFind}>
                                        <Empty
                                            styles={{ image: { height: 60 } }}
                                            description={
                                                <Typography.Text>
                                                    No muster station found
                                                </Typography.Text>
                                            }
                                        >
                                            <Button onClick={() => { SaveFormDataTemp() }} type="primary">Create New</Button>
                                        </Empty>
                                    </div>
                                }

                            </Drawer>
                            {/* Muster Station Drawer */}
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
                                    // Muster Station
                                    // polygon
                                    paddingM={paddingM}
                                    pointsM={pointsM}
                                    getSafetyZonePathM={getSafetyZonePathM}
                                    polyGoneNameM={polyGoneNameM}
                                    polyGoneMCenter={polyGoneMCenter}
                                    // polygon
                                    // polyline
                                    pointsMoreM={pointsMoreM}
                                    safetyOffsetM={safetyOffsetM}
                                    offsetPolygonM={offsetPolygonM}
                                    polyLineNameM={polyLineNameM}
                                    mapKey={mapKey}
                                    circleRefM={circleRefM}
                                    polyLineMCenter={polyLineMCenter}
                                    isWorksiteCreate={true}
                                    handlePolygonClick={handlePolygonClick}
                                // polyline
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

function mapStateToProps({ PoiReducer, AlertsReducer, TeamReducer, WorksiteReducer }) {
    return { PoiReducer, AlertsReducer, TeamReducer, WorksiteReducer };
}
export default connect(
    mapStateToProps,
    { ...ProjectAction, ...POIAction, ...TeamAction, ...WorkSiteAction, ...WorkOrderAction }
)(WorksiteScreenCreate);