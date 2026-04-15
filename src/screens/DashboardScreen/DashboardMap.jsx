import { GoogleMap, InfoWindow, Marker, MarkerClustererF, MarkerF, Polygon, PolygonF, Polyline, useJsApiLoader } from "@react-google-maps/api";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import myLocationMarker from "../../assets/centerIcon.png";
import alertsImage1 from "../../assets/alerts1.png";
import alertsImage2 from "../../assets/alerts2.png";
import alertsImage3 from "../../assets/alerts3.png";
import alertsImage4 from "../../assets/alerts4.png";
import POISImage from "../../assets/POIS.png";
import assetsImage from "../../assets/assets.png";
import projectsImage from "../../assets/projects.png";
import workordersImage from "../../assets/workorders.png";
import WorkSiteIcon from "../../assets/marker_worksites.png";
import Style from './DashboardScreen.module.css'
import { baseUrl } from '../../../store/config.json'
import { Drawer, Modal, Progress, Space, Spin, Tag, Tooltip } from "antd";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { MdOutlineLocationSearching } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import Cluster_Icon from "../../assets/Cluster_Icon.png"
import ReactTimeAgo from "react-time-ago";
import workSiteCenter from '../../assets/workSiteCenter.svg'
import workorderIcon from "../../assets/workOrder.png";
import projectIcon from "../../assets/project.png";
import assetsIcon from "../../assets/asset.png";
import poiIcon from "../../assets/poi.png";
import alerttIcon1 from "../../assets/alert.png";
import alerttIcon2 from "../../assets/network.png";
import alerttIcon3 from "../../assets/communication.png";
import alerttIcon4 from "../../assets/security.png";
import evacuationIcon from '../../assets/evacuation.png'



const DashboardMap = ({ progress, loadingTitle, loadingPara, isLoadingData, GetMusterStation, WorksiteReducer, WorkPOIGetByIdMap, GetAlertsByIDMap, GetAssetsByIDMap, WorkOrderGetByIdMap, GetProjectByIDMap, messageApi, MapData, PoiReducer, viewWorkOrder, viewAlerts, viewPOIs, viewAssets, viewProject }) => {
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const mapRef = useRef()
    const [error, setError] = useState()
    const [locationCurrent, setLocationCurrent] = useState(null);
    const [searchLocation, setSearchLocation] = useState(null);
    const [locationToggle, setLocationToggle] = useState(false);
    const circleRefM = useRef(null);

    useEffect(() => {
        if (workSite) {
            GetMusterStation(workSite)
        }
    }, [])


    const { musterStation } = WorksiteReducer


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
    }, [musterStation])


    const drawMusterCircle = (a, b, c, index1, circle2, CenterIcon) => {
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
            zIndex: 999,
            clickable: true,
        });

        // Center Marker
        const centerMarker = new window.google.maps.Marker({
            position: a,
            map: mapRef.current,
            icon: {
                url: evacuationIcon,
                scaledSize: new window.google.maps.Size(68, 80),
            },
        });

        // Optional extra icon (CenterIcon)
        new window.google.maps.Marker({
            position: CenterIcon,
            map: mapRef.current,
            icon: {
                url: evacuationIcon,
                scaledSize: new window.google.maps.Size(68, 80),
            },
        });

        // InfoWindow positioned directly above marker
        const infoWindow = new window.google.maps.InfoWindow({
            content: `
      <div style="
        padding: 8px;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      ">
        <p style="margin: 0;">${circle2[index1]}</p>
      </div>
    `,
            disableAutoPan: true,
            headerDisabled: true,
            pixelOffset: new window.google.maps.Size(0, 10), // move window above marker
        });

        // Show/Hide logic
        const showInfo = () => {
            infoWindow.open({
                map: mapRef.current,
                anchor: centerMarker,
            });
        };

        const hideInfo = () => infoWindow.close();

        centerMarker.addListener('click', showInfo);
        centerMarker.addListener('mouseout', hideInfo);

        circleRefM.current = parent;
    };































    const [currentPole, setCurrentPole] = useState()

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const alreadyGranted = localStorage.getItem("locationAllowed");
                if (!alreadyGranted) {
                    showReloadMessage();
                    localStorage.setItem("locationAllowed", "true");
                }
                setLocationToggle(true)
                setLocationCurrent({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setSearchLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    // console.log("User denied location");
                    localStorage.removeItem("locationAllowed");
                }
            }
        );
    }, []);

    function showReloadMessage() {
        messageApi.destroy();
        messageApi.open({
            type: "warning",
            content: (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ margin: 0 }}>Location services are now enabled. Reload the page for the best experience.</p>
                    <button
                        style={{
                            background: "#1677ff",
                            color: "#fff",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            width: "fit-content",
                            marginLeft: 10,
                        }}
                        onClick={() => ReloadForLocation()}
                    >
                        Reload
                    </button>
                </div>
            ),
        });
    }

    const ReloadForLocation = () => {
        localStorage.setItem("Mz2^bLH9pt64fS*X7!n3wQ==", true)
        window.location.reload()
    }


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
    });
    var StyleLocation = { width: '100%', height: 500, overflow: 'hidden', borderRadius: 8 }

    const [workSiteDetailDr, setWorkSiteDetailDr] = useState(false);
    const showDrawerDr = () => {
        setWorkSiteDetailDr(true);
    };
    const onCloseDr = () => {
        setWorkSiteDetailDr(false);
    };





    // worksite
    const drawCircleWorkSite = (loc, radius, safetyZone2) => {
        const circle = new window.google.maps.Circle({
            map: mapRef.current,
            center: loc,
            radius: radius,
            strokeColor: '#050c1f',
            strokeWeight: 1,
            fillColor: '#0d1e4b',
            fillOpacity: 0.4,
            draggable: false,
            editable: false,
        });
        return circle;
    };


    const [workSiteMarker, setWorkSiteMarker] = useState(null)
    const [pointsWorkSite, setPointsWorkSite] = useState([]);
    const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);
    const [worksiteLoading, setWorksiteLoading] = useState([]);


    const drawWithRadiusBounds = (firstLocation, radius) => {
        const lat = Number(firstLocation[0]);
        const lng = Number(firstLocation[1]);
        const deltaLat = radius / 111320;
        const deltaLng = radius / (111320 * Math.cos(lat * (Math.PI / 180)));
        const center = new window.google.maps.LatLng(lat, lng);
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(lat + deltaLat, lng + deltaLng));
        bounds.extend(new window.google.maps.LatLng(lat - deltaLat, lng - deltaLng));
        mapRef?.current?.fitBounds(bounds);
    };

    const drawPolyLinePolyGoneBond = (coords) => {
        const latLngs = coords.map(([lat, lng]) =>
            new window.google.maps.LatLng(Number(lat), Number(lng))
        );
        const bounds = new window.google.maps.LatLngBounds();
        latLngs.forEach((p) => bounds.extend(p));
        mapRef?.current?.fitBounds(bounds);
    }

    useEffect(() => {
        setWorksiteLoading(true)
        const polygons = PoiReducer?.workSiteData.find(data => data._id == workSite)?.polygon;
        if (polygons?.locations.length > 0) {
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
                    drawWithRadiusBounds(firstLocation, polygons.radius)
                    setWorksiteLoading(false)
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
                drawPolyLinePolyGoneBond(polygons?.locations)
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
                setWorksiteLoading(false)
            }
            if (polygons?.type == "Polyline") {
                setPointsMoreWorkSite(
                    polygons?.locations?.map(([lat, lng]) => ({
                        lat: Number(lat),
                        lng: Number(lng),
                    })) || []
                );
                drawPolyLinePolyGoneBond(polygons?.locations)
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
                setWorksiteLoading(false)
            }
        }
        setWorksiteLoading(false)
    }, [PoiReducer?.workSiteData])


    const [value1, setValue1] = useState(null);
    const locationDataFunc = (ee) => {
        setValue1(ee)
        geocodeByAddress(ee?.label)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                setSearchLocation({
                    lat: lat,
                    lng: lng,
                })
            }
            );
    }


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

    const handleCenterWorksite = () => {
        if (mapRef.current) {
            mapRef.current.panTo(new window.google.maps.LatLng(workSiteMarker.lat, workSiteMarker.lng));
            mapRef.current.setZoom(16);
        }
    }


    const handleRecenter = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (mapRef.current) {
                    mapRef.current.panTo(new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    mapRef.current.setZoom(14.5);
                }
            },
            (err) => {
                if (err.code === 2) {
                    setError('Location unavailable.');
                } else if (err.code === 3) {
                    setError('Location request timed out.');
                } else {
                    setError('An unknown error occurred.');
                }
                console.error('Geolocation error:', err);
            }
        );

    };


    const [workSiteMainData, setWorkSiteMainData] = useState()
    const LoadWorkSiteData = async () => {
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
        };
        const response = await fetch(`${baseUrl}/worksites/get-by-id/${workSite}`, options);
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            setWorkSiteMainData(res?._doc)
        }
    }

    useEffect(() => {
        if (workSite) {
            LoadWorkSiteData()
        }
    }, [])


    const [selectedPoint, setSelectedPoint] = useState()
    const [selectedId, setSelectedId] = useState()
    const [searchLocationModal, setsearchLocationModal] = useState(false);
    const [loadDetails, setLoadDetails] = useState(false);




    const showLocationModal = async (classN, ID) => {
        setsearchLocationModal(true);
        setLoadDetails(true)
        if (classN == "POI") {
            const result = await WorkPOIGetByIdMap(ID)
            setCurrentPole(result)
            setSelectedId(ID)
            setSelectedPoint("POI")
        }
        else if (classN == "Alert") {
            const result = await GetAlertsByIDMap(ID)
            setCurrentPole(result)
            setSelectedId(ID)
            setSelectedPoint("Alert")
        }
        else if (classN == "Asset") {
            const result = await GetAssetsByIDMap(ID)
            setCurrentPole(result)
            setSelectedId(ID)
            setSelectedPoint("Asset")
        }
        else if (classN == "Project") {
            const result = await GetProjectByIDMap(ID)
            setCurrentPole(result)
            setSelectedId(ID)
            setSelectedPoint("Project")
        }
        else if (classN == "WorkOrder") {
            const result = await WorkOrderGetByIdMap(ID)
            setCurrentPole(result)
            setSelectedId(ID)
            setSelectedPoint("WorkOrder")
        }
        setLoadDetails(false)
    };




    const handleLocationCancel = () => {
        setsearchLocationModal(false);
    };


    const [clusterListData, setClusterListData] = useState([])
    const [clusterListPopup, setClusterListPopup] = useState(false)
    const closeClusterModal = () => {
        setClusterListPopup(false)
    }




    const getPolygonCenter = (polygon) => {
        if (!polygon) return null;

        if (polygon.latitude && polygon.longitude) {
            return { lat: Number(polygon.latitude), lng: Number(polygon.longitude) };
        }

        if (Array.isArray(polygon) && Array.isArray(polygon[0])) {
            const lat = polygon.reduce((sum, p) => sum + p[1], 0) / polygon.length;
            const lng = polygon.reduce((sum, p) => sum + p[0], 0) / polygon.length;
            return { lat: Number(lat), lng: Number(lng) };
        }

        if (Array.isArray(polygon) && polygon[0]?.lat !== undefined) {
            const lat = polygon.reduce((sum, p) => sum + p.lat, 0) / polygon.length;
            const lng = polygon.reduce((sum, p) => sum + p.lng, 0) / polygon.length;
            return { lat: Number(lat), lng: Number(lng) };
        }

        return null;
    };


    const items = useMemo(() => {
        const allPolygons = [
            ...(MapData?.reportsPolygons || []).map(item => ({
                ...item,
                type: "POI",
                center: getPolygonCenter(item.polygon),
                icon: POISImage,
            })),
            ...(MapData?.alertsPolygons || []).map(item => ({
                ...item,
                type: "Alert",
                center: getPolygonCenter(item.polygon),
                icon: item?.alertType === "HAZARD" ? alertsImage1 :
                    item?.alertType === "WEATHER" ? alertsImage2 :
                        item?.alertType === "COMMUNICATION" ? alertsImage4 :
                            item?.alertType === "SECURITY" ? alertsImage3 : null,
                childType: item?.alertType,
            })),
            ...(MapData?.assetsPolygons || []).map(item => ({
                ...item,
                type: "Asset",
                center: getPolygonCenter(item.polygon),
                icon: assetsImage,
            })),
            ...(MapData?.projectPolygons || []).map(item => ({
                ...item,
                type: "Project",
                center: getPolygonCenter(item.polygon),
                icon: projectsImage,
            })),
            ...(MapData?.workordersPolygons || []).map(item => ({
                ...item,
                type: "WorkOrder",
                center: getPolygonCenter(item.polygon),
                icon: workordersImage,
            })),
        ];

        // Filter out items with invalid center coordinates
        return allPolygons.filter(item => {
            const { center } = item;
            return center && Number.isFinite(center.lat) && Number.isFinite(center.lng);
        });
    }, [MapData]);



    const onMapLoad = useCallback((map) => {
        if (!map || !window.google?.maps) return;

        mapRef.current = map;

        if (!Array.isArray(items) || items.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        let hasValidPoint = false;

        items.forEach((item) => {
            const lat = Number(item?.center?.lat);
            const lng = Number(item?.center?.lng);

            if (
                Number.isFinite(lat) &&
                Number.isFinite(lng)
            ) {
                bounds.extend({ lat, lng });
                hasValidPoint = true;
            }
        });

        if (hasValidPoint) {
            try {
                map.fitBounds(bounds);
            } catch (e) {
                console.error("fitBounds failed:", e);
            }
        }
    }, [items]);



    const AllIcon = {
        POI: poiIcon,
        Alert: currentPole?.alertType == "HAZARD" ? alerttIcon1 : currentPole?.alertType == "WEATHER" ? alerttIcon2 : currentPole?.alertType == "COMMUNICATION" ? alerttIcon3 : currentPole?.alertType == "SECURITY" ? alerttIcon4 : null,
        Asset: assetsIcon,
        Project: projectIcon,
        WorkOrder: workorderIcon,
    };


    const [activeMarker, setActiveMarker] = useState(null);
    const markerRefs = useRef({});

    const handleMouseOver = (id) => setActiveMarker(id);
    const handleMouseOut = () => setActiveMarker(null);

    const getMarkerPosition = (locations) => {
        if (!locations) return null;

        let lat, lng;

        if (Array.isArray(locations[0])) {
            lat = Number(locations[0][0]);
            lng = Number(locations[0][1]);
        } else {
            lat = Number(locations[0]);
            lng = Number(locations[1]);
        }
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            console.warn("Invalid coordinates detected:", locations);
            return null;
        }

        return { lat, lng };
    };


    return (
        <>
            <Modal
                title={`Area Summary (${clusterListData?.length || 0})`}
                closable={true}
                open={clusterListPopup}
                onCancel={closeClusterModal}
                footer={() => { <></> }}
                maskClosable={true}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
                destroyOnClose
            >
                <div className={Style.ControllerContainer}>
                    {Array.isArray(clusterListData) && clusterListData.length > 0 ? clusterListData.map(data => {
                        console.log(JSON.parse(data?.polygon?.meta || "{}"),"ASD(*&^GGGASSA")
                        return (
                            <div style={{ width: "100%", paddingTop: 15 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginLeft: 10, width: "100%" }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "100%" }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>  {JSON.parse(data?.polygon?.meta || "{}")?.title}</p>
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#919191', width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{data?.type}</p>
                                            </div>
                                            <div onClick={() => data?.type == "Asset" ? viewAssets(data?._id) : data?.type == "Alert" ? viewAlerts(data?._id) : data?.type == "POI" ? viewPOIs(data?._id) : data?.type == "WorkOrder" ? viewWorkOrder(data?._id) : data?.type == "Project" ? viewProject(data?._id) : null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#214CBC', cursor: 'pointer' }}>View Detail <MdKeyboardArrowRight color="#214CBC" size={20} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : ""}
                </div>
            </Modal>



            <Modal
                title={!loadDetails && selectedPoint}
                closable={true}
                open={searchLocationModal}
                onCancel={handleLocationCancel}
                footer={() => { <></> }}
                maskClosable={true}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
            >
                {loadDetails ?
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: 30, width: '100%' }}>
                        <Spin />
                    </div> :
                    <div style={{ width: "100%", paddingTop: 15 }}>
                        <div className={Style.NameContainer}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={Style.ContainIcon}>
                                    <img src={AllIcon[selectedPoint]} alt="Icon" />
                                    {/* {AllIcon[selectedPoint]?.()} */}
                                </div>
                                <div>
                                    {selectedPoint === "Asset" ?
                                        <p style={{ margin: 0, fontSize: 18, fontWeight: 600, width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentPole?.assetType?.name}</p>
                                        :
                                        <p style={{ margin: 0, fontSize: 18, fontWeight: 600, width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentPole?.title}</p>
                                    }
                                    <ReactTimeAgo date={currentPole?.createdAt} locale="en-US" />
                                </div>
                            </div>
                            <div >
                                {selectedPoint === "Project" || selectedPoint === "Asset" ?
                                    <>
                                        {Array.isArray(currentPole?.elevationLevels) && currentPole?.elevationLevels?.length > 0 ? (
                                            currentPole?.elevationLevels.map((item, index) => (
                                                <Tag color={"green"}>
                                                    {item}
                                                </Tag>
                                            ))) : ""}
                                    </>
                                    : selectedPoint === "WorkOrder" ?
                                        <>
                                            <Tag color={"orange"}>
                                                {currentPole?.priority}
                                            </Tag>
                                        </>
                                        :
                                        <Tag color={currentPole?.riskLevel == "Moderate" ? "orange" : currentPole?.riskLevel == "No Threat" ? "green" : currentPole?.riskLevel == "High" ? 'red' : currentPole?.riskLevel == "Lowest" ? 'yellow' : null}>
                                            {currentPole?.riskLevel === "No Threat" ? "No Risk" : currentPole?.riskLevel === "Lowest" ? "Lowest Risk" : currentPole?.riskLevel === "Moderate" ? "Moderate Risk" : currentPole?.riskLevel === "High" ? "High Risk" : currentPole?.riskLevel === "Extreme" ? "Extreme Risk" : currentPole?.riskLevel}
                                        </Tag>
                                }
                            </div>
                        </div>
                        <div className={Style.NameContainer}>
                            <h3 style={{ marginBottom: 0, marginTop: 25 }}>Worksite:</h3>
                            <p style={{ marginBottom: 0, marginTop: 25 }}>{currentPole?.workSite?.title}</p>
                        </div>
                        <div className={Style.NameContainer}>
                            <h3 style={{ margin: 0, marginTop: 5 }}>Elevation:</h3>
                            <p style={{ margin: 0, marginTop: 5 }}>{currentPole?.polygon?.altitude} ft</p>
                        </div>
                        <div className={Style.NameContainer}>
                            <h3 style={{ margin: 0, marginTop: 5 }}>Area:</h3>
                            <p style={{ margin: 0, marginTop: 5 }}>{Math.round(Number(currentPole?.polygon?.radius || 0))} ft²</p>
                        </div>
                        <div style={{ marginTop: 20 }} className={Style.NameContainer}>
                            <div onClick={() => selectedPoint == "Asset" ? viewAssets(selectedId) : selectedPoint == "Alert" ? viewAlerts(selectedId) : selectedPoint == "POI" ? viewPOIs(selectedId) : selectedPoint == "WorkOrder" ? viewWorkOrder(selectedId) : selectedPoint == "Project" ? viewProject(selectedId) : null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#214CBC', cursor: 'pointer' }}>View Detail <MdKeyboardArrowRight color="#214CBC" size={20} /></div>
                        </div>
                    </div>}
            </Modal>


            <Drawer
                title={workSiteMainData?.title}
                onClose={onCloseDr}
                open={workSiteDetailDr}
                height={'100%'}
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
            >
                {workSiteMainData?.description &&
                    <>
                        <h4 style={{ marginBottom: 0 }}>Description</h4>
                        <p style={{ marginTop: 5 }}>{workSiteMainData?.description}</p>
                    </>
                }

                {workSiteMainData?.teams?.length > 0 &&
                    <>
                        <h4 style={{ marginBottom: 0 }}>Teams</h4>
                        <Space size="middle">
                            <div className={Style.MemContainer}>
                                <>
                                    {workSiteMainData?.teams?.slice(0, 3).map((member, index) => {
                                        const initials = `${member?.title?.[0] || ""}`;
                                        const classNames = [Style.FirstMemCont, Style.SecondMemCont, Style.ThirdMemCont];
                                        return (
                                            <Tooltip key={index} title={`${member?.title || ""}`}>
                                                <div key={index} className={classNames[index]}>
                                                    <p>{initials}</p>
                                                </div>
                                            </Tooltip>
                                        );
                                    })}
                                </>
                                {workSiteMainData?.teams?.length > 3 && (
                                    <p className={Style.paraMore}>{`+${workSiteMainData?.teams?.length - 3}`}</p>
                                )}
                            </div>
                        </Space>
                    </>
                }

                {workSiteMainData?.manager && (
                    <>
                        <h4 style={{ marginBottom: 0 }}>Manager</h4>
                        <Space size="middle">
                            <div className={Style.MemContainer}>
                                <Tooltip title={`${workSiteMainData?.manager?.firstName || ""} ${workSiteMainData?.manager?.lastName || ""}`}>
                                    <div className={Style.FirstMemCont}>
                                        <p>{workSiteMainData?.manager?.firstName?.[0] || ""}{workSiteMainData?.manager?.lastName?.[0] || ""}</p>
                                    </div>
                                </Tooltip>
                            </div>
                        </Space>
                    </>
                )}

            </Drawer>
            {isLoaded ?
                <GoogleMap
                    ref={mapRef}
                    mapContainerStyle={StyleLocation}
                    center={searchLocation}
                    onLoad={onMapLoad}
                    zoom={12}
                    options={{
                        minZoom: 2,
                        mapTypeControl: false,
                        mapTypeId: "satellite",
                        cameraControl: false,
                        clickableIcons: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                    }}
                >

                    {isLoadingData || worksiteLoading ?
                        <div className={Style.NoWorksiteContainer}>
                            <h2>{loadingTitle ?? "Loading"}</h2>
                            <h6>{loadingPara ?? "Loading please wait."}</h6>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={Style.LoadingSlide}>
                                    <div style={{ width: `${progress}%` }} className={Style.loadinInSlide}></div>
                                </div>
                                {/* <div className={Style.spinner}></div> */}
                            </div>
                        </div>
                        :
                        <>
                            <MarkerClustererF onClick={(cluster) => {
                                const markers = cluster?.getMarkers?.() || [];
                                const clusterItems = markers
                                    .map(marker => marker?.customData)
                                    .filter(Boolean);

                                if (!clusterItems.length) return;

                                setClusterListData(clusterItems);
                                setClusterListPopup(true);
                            }}
                                options={{
                                    maxZoom: 18,
                                    zoomOnClick: false,
                                    styles: [
                                        {
                                            url: Cluster_Icon,
                                            height: 40,
                                            width: 40,
                                            textColor: "white",
                                            textSize: 10,
                                            zIndex: 9999,
                                        },
                                        {
                                            url: Cluster_Icon,
                                            height: 50,
                                            width: 50,
                                            textColor: "white",
                                            textSize: 12,
                                            zIndex: 9999
                                        },
                                        {
                                            url: Cluster_Icon,
                                            height: 60,
                                            width: 60,
                                            textColor: "white",
                                            textSize: 14,
                                            zIndex: 9999
                                        },
                                        {
                                            url: Cluster_Icon,
                                            height: 70,
                                            width: 70,
                                            textColor: "white",
                                            textSize: 16,
                                            zIndex: 9999
                                        },
                                        {
                                            url: Cluster_Icon,
                                            height: 80,
                                            width: 80,
                                            textColor: "white",
                                            textSize: 18,
                                            zIndex: 9999
                                        },
                                    ],
                                }}>
                                {(clusterer) =>
                                    items.map((item, i) => {
                                        const position = getMarkerPosition(item?.polygon?.locations);
                                        if (!position) return null;
                                        return (
                                            <React.Fragment key={i}>
                                                <MarkerF
                                                    position={position}
                                                    clusterer={clusterer}
                                                    icon={{
                                                        url: item.icon,
                                                        ...(window.google && {
                                                            scaledSize: new window.google.maps.Size(68, 80),
                                                        }),
                                                    }}
                                                    zIndex={(window.google?.maps?.Marker?.MAX_ZINDEX || 1000) + 1}
                                                    onLoad={(marker) => {
                                                        marker.customData = item;
                                                    }}
                                                    onClick={() => showLocationModal(item.type, item?._id)}
                                                />
                                            </React.Fragment>
                                        );
                                    })
                                }

                            </MarkerClustererF>





                            {/* Muster Station Polygon */}
                            {pointsM?.map((polygonPoints = [], index) => {
                                const padding = paddingM[index] || 0.5;
                                const LineMCenter = polyGoneMCenter[index]
                                const nameNewPolygon = polyGoneNameM[index];

                                return (
                                    <React.Fragment key={`polygon-${index}`}>
                                        <Polygon
                                            path={[...polygonPoints, polygonPoints[0]]}
                                            options={{
                                                fillColor: "#548F1C",
                                                fillOpacity: 0.8,
                                                strokeColor: "#115638",
                                                strokeOpacity: 1,
                                                strokeWeight: 2,
                                                zIndex: 999
                                            }}
                                        />

                                        <Marker
                                            key={`poly-${index}`}
                                            position={LineMCenter}
                                            icon={{
                                                url: evacuationIcon,
                                                scaledSize: new window.google.maps.Size(68, 80),
                                            }}
                                            onClick={() => handleMouseOver(index)}
                                            onMouseOut={handleMouseOut}
                                            onLoad={(marker) => (markerRefs.current[index] = marker)}
                                            zIndex={100}
                                        />

                                        {activeMarker === index && markerRefs.current[index] && (
                                            <InfoWindow
                                                key={`info-${index}`}
                                                anchor={markerRefs.current[index]}
                                                options={{
                                                    headerDisabled: true,
                                                    pixelOffset: new window.google.maps.Size(0, 10),
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        padding: "4px 8px",
                                                        fontSize: 13,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <p className={Style.TootTopName}>{nameNewPolygon}</p>
                                                </div>
                                            </InfoWindow>
                                        )}

                                    </React.Fragment>
                                );
                            })}
                            {/* Muster Station Polygon */}







                            {!locationToggle && (
                                <div className={Style.OverMapFalse}>
                                    <p>Permission denied. Please allow location access in your browser or device settings.</p>
                                </div>
                            )}

                            {/* Recenter Button */}
                            {workSiteMarker &&
                                <div className={Style.PolyCenter1}>
                                    <Tooltip title="Move to worksite" placement="leftTop">
                                        <div onClick={!locationToggle ? requestLocationAgain : handleCenterWorksite} className={Style.PolyDot1}>
                                            <img src={workSiteCenter} />
                                        </div>
                                    </Tooltip>
                                </div>
                            }
                            <div className={Style.PolyCenter}>
                                <Tooltip title="Move to current location" placement="leftTop">
                                    <div onClick={!locationToggle ? requestLocationAgain : handleRecenter} className={Style.PolyDot}>
                                        <MdOutlineLocationSearching size={20} color="#666d80" />
                                    </div>
                                </Tooltip>
                            </div>


                            {/* Work Site Marker */}
                            {workSiteMarker && (
                                <Marker
                                    position={workSiteMarker}
                                    onClick={showDrawerDr}
                                    icon={{
                                        url: WorkSiteIcon,
                                        scaledSize: new window.google.maps.Size(80, 80),
                                    }}
                                    zIndex={10}
                                />
                            )}
                            {/* Work Site Polygon */}
                            {pointsWorkSite.length >= 1 && (
                                <Polygon
                                    onClick={showDrawerDr}
                                    path={[...pointsWorkSite, pointsWorkSite[0]]}
                                    options={{
                                        fillColor: '#0d1e4b',
                                        fillOpacity: 0.8,
                                        strokeColor: '#050c1f',
                                        strokeOpacity: 0,
                                        strokeWeight: 2,
                                        zIndex: 10
                                    }}
                                />
                            )}

                            {/* Work Site Polyline */}
                            {pointsMoreWorkSite.length >= 2 && (
                                <Polyline
                                    path={pointsMoreWorkSite}
                                    onClick={showDrawerDr}
                                    options={{
                                        strokeColor: '#050c1f',
                                        strokeOpacity: 0,
                                        strokeWeight: 2,
                                        zIndex: 10
                                    }}
                                />
                            )}
                            <Marker
                                position={locationCurrent}
                                icon={{
                                    url: myLocationMarker,
                                    scaledSize: new window.google.maps.Size(25, 35),
                                }}
                                zIndex={10}
                            />
                        </>
                    }
                </GoogleMap>
                :
                <div style={{ minHeight: "300px", width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin></Spin>
                </div>
            }

        </>
    )
}


export default DashboardMap 