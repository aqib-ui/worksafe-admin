import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './MusterStationEditScreen.module.css'
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
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { baseUrl } from '../../../../store/config.json';
import WorkSiteIcon from "../../../assets/marker_worksites.png";
import myLocationMarker from "../../../assets/myLocationMarker.png";
import GoogleMapCreate from '../../../component/googleMap';
import utc from 'dayjs/plugin/utc';
import { useLocation } from "react-router-dom";
import evacuationIcon from '../../../assets/evacuation.png'


const MusterStationCreateScreen = ({ GetWorkSite, GetRoles, WorksiteReducer, GetManagerInWorksite, GetTeamInWorksite, TeamReducer, AlertsReducer, PoiReducer, GetAllWorkOrderUnLink, InserTeamUserV2 }) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const schema = yup.object().shape({
        title: yup.string().max(250).required(),
    });
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const queryId = queryParams.get("id");
    const currentWorksiteLoaded = localStorage.getItem("Bm_8Xr#Q+21fGt!zY@Hj6Lp")


    useEffect(() => {
        getDataMuster()
    }, [])









































    // Muster Station
    // PolyLineComplete
    const circleRefM = useRef(null);
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
    const [paddingMAll, setPaddingMAll] = useState([]);
    const [polyGoneNameMAll, setPolyGoneNameMAll] = useState([]);
    const [pointsMAll, setPointsMAll] = useState([]);
    const [polyGoneMCenterAll, setPolyGoneMCenterAll] = useState([]);



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
        getDataMusterAll()
    }, [])

    const [currectMusterAll, setCurrectMusterAll] = useState(null)
    function getDataMusterAll() {
        const savedForms = JSON.parse(localStorage.getItem('gT4#nL!8vQ@2zR*e6^hP+M==')) || [];
        setCurrectMusterAll(savedForms)
    }



    const drawWithRadiusBounds = (firstLocation, radius) => {
        console.log(firstLocation, radius, 'asd0987654')
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
        if (!currectMusterAll || !Array.isArray(currectMusterAll)) return;
        const parsedPolygons = currectMusterAll
            .map((data) => {
                try {
                    return { ...(JSON.parse(data?.polygon || "{}")), title: data?.title };
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        const polygonData = parsedPolygons.filter((p) => p?.type === "Polygon");
        const circleData = parsedPolygons.filter((p) => p?.type === "Circle");

        const PolygonParsed = polygonData?.find(data => JSON.parse(data?.meta)?.id == queryId)
        const circleDataParsed = circleData?.find(data => JSON.parse(data?.meta)?.id == queryId)


        // console.log(PolygonParsed, circleDataParsed, 'asd98765tyui')
        if (polygonData?.length > 0) {
            setPointsMAll(
                polygonData.filter(data => data?._id !== PolygonParsed?._id).map((poly) =>
                    poly?.locations?.map(([lat, lng]) => ({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    }))
                )
            );
            setPaddingMAll(polygonData?.map((poly) => poly?.safetyZone || 0));
            setPolyGoneNameMAll(polygonData.map((line) => line?.title || ""))
            setPolyGoneMCenterAll(
                polygonData.map((line) => ({
                    lng: line?.longitude,
                    lat: line?.latitude,
                }))
            )
            const killtime = setTimeout(() => {
                drawPolyLinePolyGoneBond(PolygonParsed?.locations)
            }, 2000);
            return () => {
                clearTimeout(killtime)
            }
        }
        if (circleData?.length > 0) {
            const timers = circleData.filter(data => data?._id !== circleDataParsed?._id).map((data, index) => {
                const killtime = setTimeout(() => {
                    drawMusterCircleAll(
                        {
                            lat: Number(data?.locations?.[0]?.[0]),
                            lng: Number(data?.locations?.[0]?.[1]),
                        },
                        data?.radius,
                        data?.safetyZone,
                        index,
                        circleData.map((line) => line?.title || ""),
                    );
                    drawWithRadiusBounds(circleDataParsed?.locations[0], circleDataParsed?.radius)
                }, 2000 * (index + 1));
                return killtime;
            });
            return () => {
                timers.forEach(clearTimeout);
            };
        }
        return () => {
            setPointsMAll([]);
            setPaddingMAll([]);
            setPolyGoneNameMAll([]);
        };
    }, [currectMusterAll]);




    const drawMusterCircleAll = (a, b, c, index1, circle2, CenterIcon) => {
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
        circleRefM.current = parent;
    };



    // SEEEEE ALL MUSTER STATIONS




































    const [currectMuster, setCurrectMuster] = useState(null)

    function getDataMuster() {
        const savedForms = JSON.parse(localStorage.getItem('gT4#nL!8vQ@2zR*e6^hP+M==')) || [];
        const updatedForms = savedForms.find(form => form.id == queryId);
        setCurrectMuster(updatedForms)
    }





    useEffect(() => {
        if (queryId) {
            const polyGonParse = JSON.parse(currectMuster?.polygon || null)
            reset(
                {
                    title: currectMuster?.title,
                }
            )
            const firstLocation = polyGonParse?.locations?.[0];

            setParentRadius(polyGonParse?.radius == 0 ? 100 : polyGonParse?.radius)
            setSafetyOffset(polyGonParse?.safetyZone)
            if (polyGonParse?.type == "Circle") {
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
                    }, polyGonParse?.radius, polyGonParse?.safetyZone)
                    drawWithRadiusBounds(firstLocation, polyGonParse?.radius)
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
                const killtime = setTimeout(() => {
                    drawPolyLinePolyGoneBond(polyGonParse?.locations)
                }, 2000);
                return () => {
                    clearTimeout(killtime)
                }
            }
            else if (polyGonParse?.type === "Polyline") {
                setSelectedTab(3)
                setPointsMore(
                    polyGonParse?.locations?.map(([lat, lng]) => ({
                        lat: Number(lat),
                        lng: Number(lng),
                    })) || []
                );
                const killtime = setTimeout(() => {
                    drawPolyLinePolyGoneBond(polyGonParse?.locations)
                }, 2000);
                return () => {
                    clearTimeout(killtime)
                }
            }
            return () => {
                setPoints([]);
                setLocation(null);
                setPointsMore([]);
                setSafetyOffset(0);
                setParentRadius(100);
                setSafetyOffsetMore(0)
                setOffsetPolygon([])
            }
        }
    }, [currectMuster])


    const drawCircleForSee = (a, b, c) => {
        setPoints([])
        setPointsMore([])
        setSelectedTab(1)
        const parent = new window.google.maps.Circle({
            map: mapRef.current,
            center: a,
            radius: b,
            strokeColor: '#115638',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#548F1C',
            fillOpacity: 0.35,
            draggable: true,
            editable: true,
            zIndex: 999,
        });
        parent.addListener('center_changed', () => {
            const newCenter = parent.getCenter();
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
    };


    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
        },
    });






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
        mapRef.current.panTo(new window.google.maps.LatLng(location?.lat, location?.lng));
        setParentRadius(100)
        setSafetyOffset(0)
        setPoints([])
        setPointsMore([])
        setSelectedTab(1)
        const parent = new window.google.maps.Circle({
            map: mapRef.current,
            center: location,
            radius: parentRadius,
            strokeColor: '#115638',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#548F1C',
            fillOpacity: 0.35,
            draggable: true,
            editable: true,
            zIndex: 999,
        });
        parent.addListener('center_changed', () => {
            const newCenter = parent.getCenter();
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

        circleRef.current = parent;
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
        setPadding(0)
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
        setSafetyOffsetMore(0)
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
            type: "muster station",
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
                title: data?.title
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
                title: data?.title
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
                title: data?.title
            };
        }
        const payload = {
            title: data?.title || "",
            polygon: JSON.stringify(polygon),
            worksiteId: currentWorksiteLoaded,
            musterId: queryId,
        };
        if (
            selectedTab !== undefined &&
            (points.length > 2 || pointsMore.length > 2 || circleRef.current !== null)
        ) {
            const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
            const controller = new AbortController();
            const timeoutRequest = setTimeout(() => controller.abort(), 10000000);
            setCreateLoading(true);
            const response = await fetch(`${baseUrl}/muster`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });

            if (response.status === 200 || response.status === 201) {
                GetWorkSite()
                clearTimeout(timeoutRequest);
                messageApi.open({
                    type: "success",
                    content: "Muster station saves successfully",
                });
                setCreateLoading(false);
                window.location.href = "/worksite/read"
            }
            else {
                clearTimeout(timeoutRequest);
                messageApi.destroy()
                messageApi.open({
                    type: "error",
                    content: "Someting went wrong.",
                });
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
        const polygons = PoiReducer?.workSiteData.find(data => data._id == currentWorksiteLoaded)?.polygon;
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


    return (

        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <h1>Edit Muster Station</h1>

                        <div>
                            <button
                                style={{ cursor: "pointer" }}
                                disabled={CreateLoading}
                                onClick={handleSubmit(adddataWorkOrder)}
                            >
                                {CreateLoading ? "Saving Muster Station..." : "Save Muster Station"}
                            </button>
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
                                    isMusterMap={true}

                                    // Muster Station
                                    // polygon
                                    paddingM={paddingMAll}
                                    pointsM={pointsMAll}
                                    getSafetyZonePathM={getSafetyZonePathM}
                                    polyGoneNameM={polyGoneNameMAll}
                                    polyGoneMCenter={polyGoneMCenterAll}
                                    handlePolygonClick={handlePolygonClick}
                                // polygon
                                // Muster Station
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
)(MusterStationCreateScreen);