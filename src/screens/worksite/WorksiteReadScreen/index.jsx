import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './WorksiteReadScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Popconfirm, Divider, Checkbox, Tag, Tabs, Typography } from 'antd'
import * as AlertAction from '../../../../store/actions/Alerts/index';
import * as POIAction from '../../../../store/actions/Poi/index';
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import * as WorkSiteAction from '../../../../store/actions/Worksite/index';
import * as TeamAction from '../../../../store/actions/Teams/index';

import { connect, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { Circle, GoogleMap, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { FaRegCircle } from "react-icons/fa";
import Autocomplete from "react-google-autocomplete";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { MdOutlineClose, MdOutlineEdit, MdOutlinePolyline } from "react-icons/md";
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
import { TASK_GET_POI_COMPLETE } from '../../../../store/actions/types';
import evacuationIcon from '../../../assets/evacuation.png'


const WorksiteScreenRead = ({ GetMusterStation, GetAlerts, GetPOIWorksite, PoiReducer, GetWorkSiteByID, GetManagerInWorksite, GetTeamInWorksite, GetRoles, TeamReducer, WorksiteReducer, AlertsReducer }) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const dispatch = useDispatch()
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [messageApi, contextHolder] = message.useMessage();
    const [getSeach, setGetSearch] = useState('')
    const navigate = useNavigate();
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const currentWorksiteLoaded = localStorage.getItem("Bm_8Xr#Q+21fGt!zY@Hj6Lp")
    const currentUser = localStorage.getItem("zP!4vBN#tw69gV+%2/+1/w==")
    const [selectedContractorIds, setSelectedContractorIds] = useState([]);
    const [safetyOffsetMore, setSafetyOffsetMore] = useState(0);
    const [offsetPolygon, setOffsetPolygon] = useState([]);
    const [padding, setPadding] = useState(0);
    const [extraDataList, setExtraDataList] = useState([]);


    const [pagePending, setPagePending] = useState(1)
    const [pageReview, setPageReview] = useState(1)
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const [isNextPOI, setIsNextPOI] = useState(true)





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
            lat: polygonPoints.reduce((sum, p) => sum + p.lat, 0) / polygonPoints.length,
            lng: polygonPoints.reduce((sum, p) => sum + p.lng, 0) / polygonPoints.length,
        };

        const padded = polygonPoints.map((pt) => offsetPointM(pt, center, offsetMeters));
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















    const [pageAlerts, setPageAlerts] = useState(1)
    const [isNextAlerts, setIsNextAlerts] = useState(true)

    const initPending = async (pageProp) => {
        const totalLegngth = await GetPOIWorksite(workSite, pageProp, "PENDING")
        if (totalLegngth < 30) {
            setIsNextPOI(false)
        }
        else {
            setIsNextPOI(true)
        }
    }



    const initAlerts = async (pageProp) => {
        const totalLegngth = await GetAlerts(workSite, pageProp, "")
        if (totalLegngth < 30) {
            setIsNextAlerts(false)
        }
        else {
            setIsNextAlerts(true)
        }
    }


    const initReviewed = async (pageProp) => {
        const totalLegngth = await GetPOIWorksite(workSite, pageProp, "REVIEWED")
        if (totalLegngth < 30) {
            setIsNextPOI(false)
        }
        else {
            setIsNextPOI(true)
        }
    }
    const PoiSortedData = [...PoiReducer?.poiData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const AlertSortedData = [...AlertsReducer?.alertData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    useEffect(() => {
        GetWorkSiteByID(currentWorksiteLoaded)
        GetManagerInWorksite()
        GetTeamInWorksite(currentWorkSite, 1)
        GetRoles()
        GetMusterStation(currentWorksiteLoaded)
    }, [])

    const { worksiteDetail, musterStation, musterStationLoading } = WorksiteReducer

    const worksiteManagerData = WorksiteReducer?.managerData?.map(data => {
        return { value: data?._id, label: `${data?.firstName} ${data?.lastName}` }
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


    const [musterStorage, setMusterStorage] = useState();

    useEffect(() => {
        const key = 'gT4#nL!8vQ@2zR*e6^hP+M==';
        const NewPayload = Array.isArray(musterStation)
            ? musterStation.map((dataKK) => ({
                title: dataKK?.title || "",
                polygon: JSON.stringify(dataKK?.polygon || []),
                id: dataKK?._id || null,
            }))
            : [];

        localStorage.setItem(key, JSON.stringify(NewPayload));
        setMusterStorage(NewPayload);
    }, [musterStation])


    const [mapKey, setMapKey] = useState(0);







    useEffect(() => {
        const NewPayload = Array.isArray(musterStation)
            ? musterStation.map((dataKK) => ({
                title: dataKK?.title || "",
                polygon: JSON.stringify(dataKK?.polygon || []),
                id: dataKK?._id || null,
            }))
            : [];
        // Muster Station
        if (!NewPayload || !Array.isArray(NewPayload)) return;
        const parsedPolygons = NewPayload
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
            setPolyGoneNameM(polygonData.map((line) => JSON.parse(line?.meta).title || ""))
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
            setPolyLineNameM(polylineData.map((line) => JSON.parse(line?.meta).title || ""))
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
                        circleData.map((line) => JSON.parse(line?.meta).title || "")
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
        }
    }, [musterStation, mapKey])



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
        setParentRadius(worksiteDetail?._doc?.polygon?.radius)
        setSafetyOffset(worksiteDetail?._doc?.polygon?.safetyZone)
        setSelectedContractorIds(worksiteDetail?._doc?.contractorContact ?? [])
        reset(
            {
                title: worksiteDetail?._doc?.title,
                worksiteManager: worksiteDetail?._doc?.manager?._id,
                workSiteTeam: worksiteDetail?._doc?.teams?.map(data => data?._id),
                speedLimit: worksiteDetail?._doc?.speedLimit?.toString(),
                description: worksiteDetail?._doc?.description
            }
        )
        const firstLocation = worksiteDetail?._doc?.polygon?.locations?.[0];
        const transformedArray = worksiteDetail?._doc?.checklist?.map(item => ({
            description: item || '',
        }));
        setExtraDataList(transformedArray || []);
        if (worksiteDetail?._doc?.polygon?.type == "Circle") {
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
                }, worksiteDetail?._doc?.polygon?.radius, worksiteDetail?._doc?.polygon?.safetyZone)
                drawWithRadiusBounds(firstLocation, worksiteDetail?._doc?.polygon?.radius)
            }, 1000);
            return () => {
                clearTimeout(killtime)
            }
        }
        if (worksiteDetail?._doc?.polygon?.type === "Polygon") {
            setSelectedTab(2)
            setPoints(
                worksiteDetail?._doc?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setPadding(worksiteDetail?._doc?.polygon?.safetyZone)
            drawPolyLinePolyGoneBond(worksiteDetail?._doc?.polygon?.locations)
        }
        if (worksiteDetail?._doc?.polygon?.type === "Polyline") {
            setSelectedTab(3)
            setPointsMore(
                worksiteDetail?._doc?.polygon?.locations?.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                })) || []
            );
            setSafetyOffsetMore(worksiteDetail?._doc?.polygon?.safetyZone)
            drawPolyLinePolyGoneBond(worksiteDetail?._doc?.polygon?.locations)
        }
        return () => {
            setPoints([]);
            setExtraDataList([]);
            setPointsMore([]);
            setSafetyOffset();
            setParentRadius();
            setSafetyOffsetMore(0)
            setOffsetPolygon([])
            setPaddingM([]);
            setPolyGoneNameM([]);
            setOffsetPolygonM([]);
        }
    }, [worksiteDetail, musterStation])










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
            draggable: false,
            editable: false,
            clickable: false
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




    const drawMusterCircle = (a, b, c, index1, circle2, CenterIcon) => {
        // Draw the main circle
        const parent = new window.google.maps.Circle({
            map: mapRef.current,
            center: a,
            radius: b,
            strokeColor: '#115638',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#548F1C',
            fillOpacity: 0.35,
            zIndex: 999,
            draggable: false,
            editable: false,
            clickable: true,
        });

        // Marker at the circle center
        const centerMarker = new window.google.maps.Marker({
            position: a,
            map: mapRef.current,
            icon: {
                url: evacuationIcon,
                scaledSize: new window.google.maps.Size(68, 80),
            },
        });

        // Marker at the secondary CenterIcon location
        new window.google.maps.Marker({
            position: CenterIcon,
            map: mapRef.current,
            icon: {
                url: evacuationIcon,
                scaledSize: new window.google.maps.Size(68, 80),
            },
        });

        // Info window content
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

        // Hover events — show above marker
        const showInfo = () => {
            infoWindow.open({
                map: mapRef.current,
                anchor: centerMarker, // attach directly to center marker
            });
        };

        const hideInfo = () => infoWindow.close();

        centerMarker.addListener('click', showInfo);
        centerMarker.addListener('mouseout', hideInfo);

        // Store reference
        circleRef.current = parent;
    };






















































    const schema = yup.object().shape({
        title: yup.string().required(),
        worksiteManager: yup.string().required(),
        workSiteTeam: yup.array().required(),
        speedLimit: yup.string().notRequired(),
        description: yup.string().notRequired(),
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
            title: "",
            worksiteManager: "",
            workSiteTeam: [],
            speedLimit: "",
            description: "",
        },
    });


    // const getCurrentDate = () => {
    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = String(now.getMonth() + 1).padStart(2, '0');
    //     const day = String(now.getDate()).padStart(2, '0');
    //     return `${year}/${month}/${day}`;
    // };


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
            setActualCenter(newCenter)
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





    // Drawer Extra Data
    const [extraDataState, setExtraDataState] = useState({ description: "" });
    const [editExtraData, setEditExtraData] = useState({ id: null, description: "" });

    const [extraAddData, setExtraAddData] = useState(false);
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
    };

    const handleRemoveExtraEntry = (indexToRemove) => {
        const filteredList = extraDataList.filter((_, index) => index !== indexToRemove);
        setExtraDataList(filteredList);
        if (editExtraData.id === indexToRemove) {
            setEditExtraData({ id: null, description: "" });
        }
    };
    // Drawer Extra Data






    const [POIlisting, setPOIlisting] = useState(false);
    const showPOIlisting = () => {
        setPOIlisting(true)
        initPending(pagePending)
    };
    const closePOIlisting = () => setPOIlisting(false);




    const [Alertslisting, setAlertslisting] = useState(false);
    const showAlertslisting = () => {
        setAlertslisting(true)
        initAlerts(pageAlerts)
    };
    const closeAlertslisting = () => setAlertslisting(false);




    const editPOI = (eId) => {
        localStorage.setItem("La7#tMV1jx!4oC+R8/=3&b==", eId)
        window.location.reload()
        window.location.href = '/POI/edit';
    }
    const viewPOI = (eId) => {
        localStorage.setItem("Zk2@pHL5uy!6mW+L9/=2&y==", eId)
        window.location.reload()
        window.location.href = '/POI/read';
    }


    const viewAlert = (eId) => {
        localStorage.setItem("Pf_!9DqZ@+76MaL#CYxv3tr", eId)
        window.location.reload()
        window.location.href = '/alerts/read';
    }




    const [approveLoading, setApproveLoading] = useState(false)
    const [approveId, setApproveId] = useState()
    const approvePOI = async (id) => {
        setApproveLoading(true)
        setApproveId(id)
        const url = `/suggestions/${id}/approve`;
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const options = {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
        };
        const response = await fetch(`${baseUrl}${url}`, options);
        if (response.status == 200 || response.status == 201) {
            dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
            setPagePending(1)
            setPageReview(1)
            setIsNextPOI(true)
            setPageAlerts(1)
            setIsNextAlerts(true)
            setApproveLoading(false)
            messageApi.destroy()
            messageApi.open({
                type: "success",
                content: "POI Approved",
            });
            initPending(1)
        }
        else {
            setApproveLoading(false)
            messageApi.destroy()
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
    }



    // Muster Station
    const [musterStationDrawer, setMusterStationDrawer] = useState(false);
    const showMusterStationDrawer = () => setMusterStationDrawer(true);
    const closeMusterStationDrawer = () => setMusterStationDrawer(false);
    // Muster Station




    const resetMap = () => setMapKey(prev => prev + 1);

    async function removeMusterById(idToRemove) {
        setConfirmLoading(true);
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const controller = new AbortController();
        const timeoutRequest = setTimeout(() => controller.abort(), 10000000);
        const response = await fetch(`${baseUrl}/muster/${idToRemove}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        });
        if (response.status === 200 || response.status === 201) {
            clearTimeout(timeoutRequest);
            GetMusterStation(currentWorksiteLoaded)
            const savedForms = JSON.parse(localStorage.getItem('gT4#nL!8vQ@2zR*e6^hP+M==')) || [];
            const updatedForms = savedForms.filter(form => form.id !== idToRemove);
            localStorage.setItem('gT4#nL!8vQ@2zR*e6^hP+M==', JSON.stringify(updatedForms));
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
            setDeletePop(false);
            setConfirmLoading(false);
            setMusterStationDrawer(false)
            messageApi.destroy()
            messageApi.open({
                type: "success",
                content: "Muster station deleted successfully.",
            });
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
                resetMap()
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
                resetMap()
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
                        resetMap()
                    }, 2000 * (index + 1));
                    return killtime;
                });
                return () => {
                    timers.forEach(clearTimeout);
                };
            }

        }
        else {
            setDeletePop(false);
            setConfirmLoading(false);
            setMusterStationDrawer(false)
            clearTimeout(timeoutRequest);
            messageApi.destroy()
            messageApi.open({
                type: "error",
                content: "Someting went wrong.",
            });
        }
    }



    const [openPopId, setOpenPopId] = useState(null);
    const [deletePop, setDeletePop] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const showDeletePopconfirm = (data) => {
        setOpenPopId(data)
        setDeletePop(true);
    };
    return (

        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>View Worksite</h1>
                        <div>
                        </div>
                    </div>
                    <div className={Style.ActionHeader}></div>
                </div>
                <div className={Style.TableSection}>
                    <div className={Style.FeildSide}>


                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColRight}>
                                <div onClick={showPOIlisting} className={Style.POITag}>POIs</div>


                                {/* POIs drawer */}
                                <Drawer
                                    maskClosable={false}
                                    getContainer={document.body}
                                    afterOpenChange={(visible) => {
                                        document.body.style.overflow = visible ? "hidden" : "auto";
                                    }}
                                    title={"POIs"}
                                    placement="right"
                                    onClose={closePOIlisting}
                                    open={POIlisting}
                                    key="right"
                                    className='New-POI-Drawer'
                                >
                                    <Tabs
                                        centered={true}
                                        defaultActiveKey="1"
                                        onChange={(e) => {
                                            dispatch({ type: TASK_GET_POI_COMPLETE, loading: false, payload: [] });
                                            setPagePending(1)
                                            setPageReview(1)
                                            if (e == "1") {
                                                initPending(1)
                                            }
                                            else if (e == "2") {
                                                initReviewed(1)
                                            }
                                        }}
                                        items={[
                                            {
                                                label: 'Pending Review',
                                                key: '1',
                                                children: <>
                                                    {PoiReducer?.poiLoading ?
                                                        <div className={Style.SpinnerDiv}>
                                                            <Spin />
                                                        </div>
                                                        :
                                                        <>
                                                            <div style={{ textAlign: "center", padding: "0px 0px 20px 0px" }}>
                                                                {Array.isArray(PoiSortedData) && PoiSortedData.length > 0 ? PoiSortedData.map(poiData =>
                                                                    <div className={Style.POITagInner}>
                                                                        <div onClick={() => viewPOI(poiData?._id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                                                            <p>{poiData.title}</p>
                                                                            <Tag color={poiData?.riskLevel == "Moderate" ? "orange" : poiData?.riskLevel == "No Threat" ? "green" : poiData?.riskLevel == "High" ? 'red' : poiData?.riskLevel == "Lowest" ? 'yellow' : null}>
                                                                                {poiData?.riskLevel === "No Threat" ? "No Risk" : poiData?.riskLevel === "Lowest" ? "Lowest Risk" : poiData?.riskLevel === "Moderate" ? "Moderate Risk" : poiData?.riskLevel === "High" ? "High Risk" : poiData?.riskLevel === "Extreme" ? "Extreme Risk" : poiData?.riskLevel}
                                                                            </Tag>
                                                                        </div>

                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <Tooltip title="Edit POI">
                                                                                <button disabled={approveLoading} onClick={() => editPOI(poiData?._id)}>
                                                                                    <MdOutlineModeEditOutline size={18} />
                                                                                </button>
                                                                            </Tooltip>

                                                                            <Tooltip title="Approve">
                                                                                <button disabled={approveLoading} onClick={() => approvePOI(poiData?._id)} style={{ marginLeft: 5 }}>
                                                                                    {poiData?._id == approveId && approveLoading ?
                                                                                        <Spin />
                                                                                        :
                                                                                        <FaCheck color={!approveLoading && 'green'} size={18} />
                                                                                    }
                                                                                </button>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </div>
                                                                ) : ""}
                                                            </div>
                                                            <>
                                                                {PoiReducer?.poiData.length > 0 && !PoiReducer?.poiLoading &&
                                                                    <>
                                                                        {isNextPOI &&
                                                                            <div style={{ textAlign: "center", padding: "0px 0px 20px 0px" }}>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        initPending(pagePending + 1)
                                                                                        setPagePending(prev => prev + 1)
                                                                                    }
                                                                                    }
                                                                                    disabled={PoiReducer?.poiLoading}
                                                                                    style={{
                                                                                        border: "1px solid #1890ff",
                                                                                        background: "#1890ff",
                                                                                        color: "white",
                                                                                        padding: "6px 16px",
                                                                                        borderRadius: "4px",
                                                                                        cursor: PoiReducer?.poiLoading ? "not-allowed" : "pointer",
                                                                                    }}
                                                                                >
                                                                                    {PoiReducer?.poiLoading ? "Loading..." : "Load More"}
                                                                                </button>
                                                                            </div>
                                                                        }
                                                                    </>
                                                                }
                                                            </>
                                                        </>
                                                    }
                                                </>,
                                            },
                                            {
                                                label: 'Reviewed',
                                                key: '2',
                                                children: <>
                                                    {PoiReducer?.poiLoading ?
                                                        <div className={Style.SpinnerDiv}>
                                                            <Spin />
                                                        </div>
                                                        :
                                                        <>
                                                            <div style={{ textAlign: "center", padding: "0px 0px 20px 0px" }}>
                                                                {Array.isArray(PoiSortedData) && PoiSortedData.length > 0 ? PoiSortedData.map(poiData =>
                                                                    <div className={Style.POITagInner}>
                                                                        <div onClick={() => viewPOI(poiData?._id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                                                            <p>{poiData.title}</p>
                                                                            <Tag color={poiData?.riskLevel == "Moderate" ? "orange" : poiData?.riskLevel == "No Threat" ? "green" : poiData?.riskLevel == "High" ? 'red' : poiData?.riskLevel == "Lowest" ? 'yellow' : null}>
                                                                                {poiData?.riskLevel === "No Threat" ? "No Risk" : poiData?.riskLevel === "Lowest" ? "Lowest Risk" : poiData?.riskLevel === "Moderate" ? "Moderate Risk" : poiData?.riskLevel === "High" ? "High Risk" : poiData?.riskLevel === "Extreme" ? "Extreme Risk" : poiData?.riskLevel}
                                                                            </Tag>
                                                                        </div>
                                                                    </div>
                                                                ) : ""}
                                                            </div>
                                                            <>
                                                                {PoiReducer?.poiData.length > 0 && !PoiReducer?.poiLoading &&
                                                                    <>
                                                                        {isNextPOI &&
                                                                            <div style={{ textAlign: "center", padding: "0px 0px 20px 0px" }}>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        initReviewed(pageReview + 1)
                                                                                        setPageReview(prev => prev + 1)
                                                                                    }
                                                                                    }
                                                                                    disabled={PoiReducer?.poiLoading}
                                                                                    style={{
                                                                                        border: "1px solid #1890ff",
                                                                                        background: "#1890ff",
                                                                                        color: "white",
                                                                                        padding: "6px 16px",
                                                                                        borderRadius: "4px",
                                                                                        cursor: PoiReducer?.poiLoading ? "not-allowed" : "pointer",
                                                                                    }}
                                                                                >
                                                                                    {PoiReducer?.poiLoading ? "Loading..." : "Load More"}
                                                                                </button>
                                                                            </div>
                                                                        }
                                                                    </>
                                                                }
                                                            </>
                                                        </>
                                                    }
                                                </>,
                                            },
                                        ]}
                                    />
                                </Drawer>
                            </div>
                            <div className={Style.FeildColRight}>
                                <div onClick={showAlertslisting} className={Style.ALERTTag}>Alerts</div>


                                {/* Alerts drawer */}
                                <Drawer
                                    maskClosable={false}
                                    getContainer={document.body}
                                    afterOpenChange={(visible) => {
                                        document.body.style.overflow = visible ? "hidden" : "auto";
                                    }}
                                    title={"Alerts"}
                                    placement="right"
                                    onClose={closeAlertslisting}
                                    open={Alertslisting}
                                    key="right"
                                    className='New-POI-Drawer'
                                >
                                    <>
                                        {AlertsReducer?.alertLoading ?
                                            <div className={Style.SpinnerDiv}>
                                                <Spin />
                                            </div>
                                            :
                                            <>
                                                <div style={{ textAlign: "center", padding: "0px 0px 20px 0px" }}>
                                                    {Array.isArray(AlertSortedData) && AlertSortedData.length > 0 ? AlertSortedData.map(alertData =>
                                                        <div className={Style.POITagInner}>
                                                            <div onClick={() => viewAlert(alertData?._id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                                                <p>{alertData.title}</p>
                                                                <Tag color={alertData?.riskLevel == "Moderate" ? "orange" : alertData?.riskLevel == "No Threat" ? "green" : alertData?.riskLevel == "High" ? 'red' : alertData?.riskLevel == "Lowest" ? 'yellow' : null}>
                                                                    {alertData?.riskLevel === "No Threat" ? "No Risk" : alertData?.riskLevel === "Lowest" ? "Lowest Risk" : alertData?.riskLevel === "Moderate" ? "Moderate Risk" : alertData?.riskLevel === "High" ? "High Risk" : alertData?.riskLevel === "Extreme" ? "Extreme Risk" : alertData?.riskLevel}
                                                                </Tag>
                                                            </div>
                                                        </div>
                                                    ) : ""}
                                                </div>
                                                <>
                                                    {AlertsReducer?.alertData.length > 0 && !AlertsReducer?.alertLoading &&
                                                        <>
                                                            {isNextAlerts &&
                                                                <div style={{ textAlign: "center", padding: "0px 0px 20px 0px" }}>
                                                                    <button
                                                                        onClick={() => {
                                                                            initAlerts(pageAlerts + 1)
                                                                            setPageAlerts(prev => prev + 1)
                                                                        }
                                                                        }
                                                                        disabled={AlertsReducer?.alertLoading}
                                                                        style={{
                                                                            border: "1px solid #1890ff",
                                                                            background: "#1890ff",
                                                                            color: "white",
                                                                            padding: "6px 16px",
                                                                            borderRadius: "4px",
                                                                            cursor: AlertsReducer?.alertLoading ? "not-allowed" : "pointer",
                                                                        }}
                                                                    >
                                                                        {AlertsReducer?.alertLoading ? "Loading..." : "Load More"}
                                                                    </button>
                                                                </div>
                                                            }
                                                        </>
                                                    }
                                                </>
                                            </>
                                        }
                                    </>
                                </Drawer>
                            </div>
                        </div>


                        <div className={Style.FeildRow}>
                            <div className={Style.FeildColRight}>
                                <label>Title</label>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Input disabled={true} onChange={onChange} value={value} status={errors?.title?.message !== undefined ? 'error' : ''} placeholder='Enter Title' style={{ height: 45, marginTop: 3 }} />
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
                                            disabled={true}
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            placeholder="Select Worksite Manager"
                                            onChange={onChange}
                                            value={value == "" ? null : value}
                                            status={errors?.worksiteManager?.message !== undefined ? 'error' : ''}
                                            style={{ marginTop: 3, width: "100%", height: 45 }}
                                            options={worksiteManagerData}
                                            loading={WorksiteReducer?.managerLoading}
                                        />)}
                                    name="worksiteManager"
                                />
                            </div>
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
                                            disabled={true}
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
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
                                            disabled={true}
                                            type="text"
                                            inputMode="decimal"
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
                                            <Input.TextArea
                                                disabled={true}
                                                onFocus={() => {
                                                    document.body.style.overflow = "hidden";
                                                }}
                                                onBlur={() => {
                                                    document.body.style.overflow = "auto";
                                                }} rows={6} onChange={onChange} value={value} status={errors?.description?.message !== undefined ? 'error' : ''} placeholder='Enter Description' style={{ marginTop: 3 }} />

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
                                </div>
                            </div>


                            <div className={Style.FeildColRight}>
                                <label>Muster Station</label>
                                <div className={Style.AddExtraDataFeild} onClick={!musterStationLoading ? showMusterStationDrawer : null}>
                                    <div>
                                        {musterStationLoading ?
                                            <Spin />
                                            :
                                            <p>Muster <span> ({musterStation?.length || 0})</span></p>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* extra Data drawer */}
                            <Drawer
                                maskClosable={false}
                                getContainer={document.body}
                                afterOpenChange={(visible) => {
                                    document.body.style.overflow = visible ? "hidden" : "auto";
                                }}
                                title={editExtraData?.id !== null ? "Edit Worksite Notification" : "Worksite Notification"}
                                placement="right"
                                onClose={closeAddExtraDrawer}
                                open={extraAddData}
                                key="right"
                            >
                                {extraDataList?.length > 0 &&
                                    extraDataList.map((data, index) => (
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
                                    ))}
                            </Drawer>
                            {/* Extra Data Drawer */}


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
                                                    <button onClick={() => {
                                                        localStorage.removeItem("Gp5!zRN8wy@2bT+L4/3cK^=")
                                                        window.location.href = `/worksite/muster-station/view?id=${data?.id}`
                                                    }}><AiOutlineEdit /></button>
                                                    {musterStorage?.length > 1 &&
                                                        <Popconfirm
                                                            id={data?.id}
                                                            title="Delete this muster station"
                                                            description="Are you sure you want to permanently delete this muster station?"
                                                            open={deletePop && openPopId == data?.id}
                                                            onConfirm={() => removeMusterById(data?.id)}
                                                            okButtonProps={{ loading: confirmLoading }}
                                                            onCancel={() => setDeletePop(false)}
                                                        >
                                                            <button onClick={() => {
                                                                showDeletePopconfirm(data?.id)
                                                            }} style={{ marginLeft: 5 }}><MdOutlineClose /></button>
                                                        </Popconfirm>
                                                    }
                                                </div>
                                            </div>
                                        ) : ""}
                                        {musterStorage.length < 10 &&
                                            <button onClick={() => {
                                                localStorage.removeItem("Gp5!zRN8wy@2bT+L4/3cK^=")
                                                window.location.href = '/worksite/muster-station?fromView=true'
                                            }} className={Style.AddNewMuster}>Add New</button>
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
                                            <Button onClick={() => {
                                                localStorage.removeItem("Gp5!zRN8wy@2bT+L4/3cK^=")
                                                window.location.href = '/worksite/muster-station?fromView=true'
                                            }} type="primary">Create New</Button>
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
                                    polyLineMCenter={polyLineMCenter}
                                    isWorksiteCreate={true}
                                    // polyline
                                    mapKey={mapKey}
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

function mapStateToProps({ PoiReducer, AlertsReducer, WorkOrderReducer, WorksiteReducer, TeamReducer }) {
    return { PoiReducer, AlertsReducer, WorkOrderReducer, WorksiteReducer, TeamReducer };
}
export default connect(
    mapStateToProps,
    { ...AlertAction, ...POIAction, ...WorkOrderAction, ...WorkSiteAction, ...TeamAction }
)(WorksiteScreenRead);