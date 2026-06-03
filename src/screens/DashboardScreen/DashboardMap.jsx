// import { Circle, GoogleMap, InfoWindow, Marker, MarkerClustererF, MarkerF, Polygon, PolygonF, Polyline, useJsApiLoader } from "@react-google-maps/api";
// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import myLocationMarker from "../../assets/centerIcon.png";
// import alertsImage1 from "../../assets/alerts1.png";
// import alertsImage2 from "../../assets/alerts2.png";
// import alertsImage3 from "../../assets/alerts3.png";
// import alertsImage4 from "../../assets/alerts4.png";
// import POISImage from "../../assets/POIS.png";
// import assetsImage from "../../assets/assets.png";
// import projectsImage from "../../assets/projects.png";
// import workordersImage from "../../assets/workorders.png";
// import WorkSiteIcon from "../../assets/marker_worksites.png";
// import Style from './DashboardScreen.module.css'
// import { baseUrl } from '../../../store/config.json'
// import { Checkbox, Col, Drawer, Input, Modal, Progress, Row, Select, Space, Spin, Tag, Tooltip } from "antd";
// import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
// import { MdOutlineLocationSearching } from "react-icons/md";
// import { MdKeyboardArrowRight } from "react-icons/md";
// import Cluster_Icon from "../../assets/Cluster_Icon.png"
// import ReactTimeAgo from "react-time-ago";
// import workSiteCenter from '../../assets/workSiteCenter.svg'

// // import workorderIcon from "../../assets/workOrder.png";
// // import projectIcon from "../../assets/project.png";
// // import assetsIcon from "../../assets/asset.png";
// // import poiIcon from "../../assets/poi.png";
// import alerttIcon1 from "../../assets/alert.png";
// import alerttIcon2 from "../../assets/network.png";
// import alerttIcon3 from "../../assets/communication.png";
// import alerttIcon4 from "../../assets/security.png";

// import workorderIcon1 from "../../assets/icons/screens/workorder.svg";
// import projectIcon1 from "../../assets/icons/screens/project.svg";
// import assetsIcon1 from "../../assets/icons/screens/asset.svg";
// import poiIcon1 from "../../assets/icons/screens/poi.svg";
// // import alerttIcon1 from "../../assets/icons/screens/alert.svg";




// import DashboardIcon1 from '../../assets/icons/mapIcon/map1.png'
// import DashboardIcon2 from '../../assets/icons/mapIcon/map2.png'
// import DashboardIcon3 from '../../assets/icons/mapIcon/map3.png'
// import DashboardIcon4 from '../../assets/icons/mapIcon/map4.png'
// import DashboardIcon5 from '../../assets/icons/mapIcon/map5.png'
// import DashboardIcon6 from '../../assets/icons/mapIcon/map6.png'
// import DashboardIcon7 from '../../assets/icons/mapIcon/map7.png'
// import DashboardIcon8 from '../../assets/icons/mapIcon/map8.png'
// import DashboardIcon9 from '../../assets/icons/mapIcon/map9.png'
// import DashboardIcon10 from '../../assets/icons/mapIcon/map10.png'




// import evacuationIcon from '../../assets/evacuation.png'
// import { RiFullscreenFill } from "react-icons/ri";
// import { BsFullscreenExit } from "react-icons/bs";
// import { MdFilterList } from "react-icons/md";
// import AddDataSelect from "../../component/addDataSelect";
// import * as yup from 'yup';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';


// const DashboardMap = ({ LoadMapData, setWholeMapDataLoader, wholeMapDataLoader, MusterByIdMap, WorkSiteGetByIdMap, AssetsReducer, setFullScreen, fullScreen, progress, loadingTitle, loadingPara, isLoadingData, GetMusterStation, WorksiteReducer, WorkPOIGetByIdMap, GetAlertsByIDMap, GetAssetsByIDMap, WorkOrderGetByIdMap, GetProjectByIDMap, messageApi, MapData, PoiReducer, viewWorkOrder, viewAlerts, viewPOIs, viewAssets, viewProject, viewMuster, viewWorkSite }) => {
//     const [filterValueMap, setFilterValueMap] = useState([])

//     const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
//     const mapRef = useRef()
//     const [error, setError] = useState()
//     const [locationCurrent, setLocationCurrent] = useState(null);
//     const [searchLocation, setSearchLocation] = useState(null);
//     const [locationToggle, setLocationToggle] = useState(false);
//     const circleRefM = useRef(null);

//     useEffect(() => {
//         if (workSite) {
//             GetMusterStation(workSite)
//         }
//     }, [])


//     const { musterStation } = WorksiteReducer


//     // Muster Station


//     // PolyLineComplete
//     const [safetyOffsetM, setSafetyOffsetM] = useState([]);
//     const [offsetPolygonM, setOffsetPolygonM] = useState([]);
//     const [polyLineNameM, setPolyLineNameM] = useState([]);
//     const [polyLineMCenter, setPolyLineMCenter] = useState([]);

//     const [pointsMoreM, setPointsMoreM] = useState([]);

//     function computeOffsetPolyline(points, offsetDistance) {
//         const offsetLeftPoints = [];
//         const offsetRightPoints = [];

//         for (let i = 0; i < points.length - 1; i++) {
//             const p1 = points[i];
//             const p2 = points[i + 1];

//             const dx = p2.lng - p1.lng;
//             const dy = p2.lat - p1.lat;
//             const length = Math.sqrt(dx * dx + dy * dy);

//             if (length === 0) continue;

//             const ux = dx / length;
//             const uy = dy / length;

//             // Perpendicular unit vector
//             const px = -uy;
//             const py = ux;

//             // Convert meters → degrees
//             const metersPerDegreeLat = 111_320;
//             const metersPerDegreeLng = 111_320 * Math.cos((p1.lat * Math.PI) / 180);

//             const offsetLat = (py * offsetDistance) / metersPerDegreeLat;
//             const offsetLng = (px * offsetDistance) / metersPerDegreeLng;

//             const offsetLeftP1 = { lat: p1.lat + offsetLat, lng: p1.lng + offsetLng };
//             const offsetLeftP2 = { lat: p2.lat + offsetLat, lng: p2.lng + offsetLng };
//             const offsetRightP1 = { lat: p1.lat - offsetLat, lng: p1.lng - offsetLng };
//             const offsetRightP2 = { lat: p2.lat - offsetLat, lng: p2.lng - offsetLng };

//             offsetLeftPoints.push(offsetLeftP1, offsetLeftP2);
//             offsetRightPoints.push(offsetRightP1, offsetRightP2);
//         }

//         return { offsetLeftPoints, offsetRightPoints };
//     }

//     useEffect(() => {
//         if (pointsMoreM && pointsMoreM.length > 0) {
//             const newOffsetPolygons = pointsMoreM.map((polyline, i) => {
//                 if (!polyline || polyline.length < 2) return [];
//                 const offsetDistance = safetyOffsetM?.[i] ?? 0;
//                 const { offsetLeftPoints, offsetRightPoints } = computeOffsetPolyline(
//                     polyline,
//                     offsetDistance
//                 );
//                 return [...offsetLeftPoints, ...offsetRightPoints.reverse()];
//             });
//             setOffsetPolygonM(newOffsetPolygons);
//         } else {
//             setOffsetPolygonM([]);
//         }
//     }, [pointsMoreM, safetyOffsetM]);
//     // PolyLineComplete



//     // PolygonComplete
//     const [paddingM, setPaddingM] = useState([]);
//     const [polyGoneNameM, setPolyGoneNameM] = useState([]);
//     const [pointsM, setPointsM] = useState([]);
//     const [polyGoneMCenter, setPolyGoneMCenter] = useState([]);
//     const getSafetyZonePathM = (polygonPoints, offsetMeters) => {
//         if (!polygonPoints?.length) return [];

//         const center = {
//             lat: polygonPoints?.reduce((sum, p) => sum + p.lat, 0) / polygonPoints?.length,
//             lng: polygonPoints?.reduce((sum, p) => sum + p.lng, 0) / polygonPoints?.length,
//         };

//         const padded = polygonPoints?.map((pt) => offsetPointM(pt, center, offsetMeters));
//         return [...padded, padded[0]];
//     };

//     const offsetPointM = (point, center, offsetMeters) => {
//         const R = 6378137;
//         const dLat = point.lat - center.lat;
//         const dLng = point.lng - center.lng;
//         const latInRad = (center.lat * Math.PI) / 180;
//         const dX = (dLng * Math.PI / 180) * R * Math.cos(latInRad);
//         const dY = (dLat * Math.PI / 180) * R;
//         const len = Math.sqrt(dX * dX + dY * dY);
//         if (len === 0) return point;
//         const scale = (len + offsetMeters) / len;
//         const newLat = center.lat + (dY * scale / R) * (180 / Math.PI);
//         const newLng = center.lng + (dX * scale / (R * Math.cos(latInRad))) * (180 / Math.PI);
//         return { lat: newLat, lng: newLng };
//     };
//     // PolygonComplete



//     // Muster Station



//     const IsPromExp = localStorage.getItem('expireUser')

//     useEffect(() => {
//         const shouldMap = workSite && !IsPromExp && Array.isArray(musterStation);
//         const NewPayload = shouldMap
//             ? musterStation.map(dataKK => ({
//                 title: dataKK?.title || "",
//                 polygon: JSON.stringify(dataKK?.polygon || []),
//                 id: dataKK?._id || null,
//             }))
//             : [];
//         // Muster Station
//         if (!NewPayload || !Array.isArray(NewPayload)) return;
//         const parsedPolygons = NewPayload
//             .map((data) => {
//                 try {
//                     return (JSON.parse(data?.polygon) || {});
//                 } catch {
//                     return null;
//                 }
//             })
//             .filter(Boolean);
//         const polygonData = parsedPolygons.filter((p) => p?.type === "Polygon");
//         const polylineData = parsedPolygons.filter((p) => p?.type === "Polyline");
//         const circleData = parsedPolygons.filter((p) => p?.type === "Circle");
//         if (polygonData?.length > 0) {
//             setPointsM(
//                 polygonData.map((poly) =>
//                     poly?.locations?.map(([lat, lng]) => ({
//                         lat: parseFloat(lat),
//                         lng: parseFloat(lng),
//                     }))
//                 )
//             );
//             setPaddingM(polygonData?.map((poly) => poly?.safetyZone || 0));
//             setPolyGoneNameM(polygonData.map((line) => JSON.parse(line?.meta).title || ""))
//             setPolyGoneMCenter(
//                 polygonData.map((line) => ({
//                     lng: line?.longitude,
//                     lat: line?.latitude,
//                 }))
//             )
//         }
//         if (polylineData.length > 0) {
//             setPointsMoreM(
//                 polylineData.map((line) =>
//                     line?.locations?.map(([lat, lng]) => ({
//                         lat: parseFloat(lat),
//                         lng: parseFloat(lng),
//                     }))
//                 )
//             );
//             setSafetyOffsetM(polylineData.map((line) => line?.safetyZone || 0));
//             setPolyLineNameM(polylineData.map((line) => JSON.parse(line?.meta).title || ""))
//             setPolyLineMCenter(
//                 polylineData.map((line) => ({
//                     lng: line?.longitude,
//                     lat: line?.latitude,
//                 }))
//             )
//         }
//         return () => {
//             setPointsM([]);
//             setPointsMoreM([]);
//             setPaddingM([]);
//             setPolyGoneNameM([]);
//             setOffsetPolygonM([]);
//         }
//     }, [musterStation])


//     const drawMusterCircle = (a, b, c, index1, circle2, CenterIcon) => {
//         const parent = new window.google.maps.Circle({
//             map: mapRef.current,
//             center: a,
//             radius: b,
//             strokeWeight: 0,
//             fillColor: '#548F1C',
//             fillOpacity: 0.6,
//             draggable: false,
//             editable: false,
//             zIndex: 999,
//             clickable: true,
//         });

//         // Optional extra icon (CenterIcon)
//         new window.google.maps.Marker({
//             position: CenterIcon,
//             map: mapRef.current,
//             icon: {
//                 url: evacuationIcon,
//                 scaledSize: new window.google.maps.Size(68, 80),
//             },
//         });

//         // InfoWindow positioned directly above marker
//         const infoWindow = new window.google.maps.InfoWindow({
//             content: `
//       <div style="
//         padding: 8px;
//         font-size: 13px;
//         display: flex;
//         align-items: center;
//         justify-content: space-between;
//       ">
//         <p style="margin: 0;">${circle2[index1]}</p>
//       </div>
//     `,
//             disableAutoPan: true,
//             headerDisabled: true,
//             pixelOffset: new window.google.maps.Size(0, 10), // move window above marker
//         });

//         circleRefM.current = parent;
//     };































//     const [currentPole, setCurrentPole] = useState()

//     useEffect(() => {
//         if (!navigator.geolocation) {
//             setError('Geolocation is not supported by your browser.');
//             return;
//         }
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const alreadyGranted = localStorage.getItem("locationAllowed");
//                 if (!alreadyGranted) {
//                     showReloadMessage();
//                     localStorage.setItem("locationAllowed", "true");
//                 }
//                 setLocationToggle(true)
//                 setLocationCurrent({
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 });
//                 setSearchLocation({
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 });
//             },
//             (error) => {
//                 if (error.code === error.PERMISSION_DENIED) {
//                     localStorage.removeItem("locationAllowed");
//                 }
//             }
//         );
//     }, []);

//     function showReloadMessage() {
//         messageApi.destroy();
//         messageApi.open({
//             type: "warning",
//             content: (
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                     <p style={{ margin: 0 }}>Location services are now enabled. Reload the page for the best experience.</p>
//                     <button
//                         style={{
//                             background: "#1677ff",
//                             color: "#fff",
//                             border: "none",
//                             padding: "4px 10px",
//                             borderRadius: "4px",
//                             cursor: "pointer",
//                             width: "fit-content",
//                             marginLeft: 10,
//                         }}
//                         onClick={() => ReloadForLocation()}
//                     >
//                         Reload
//                     </button>
//                 </div>
//             ),
//         });
//     }

//     const ReloadForLocation = () => {
//         localStorage.setItem("Mz2^bLH9pt64fS*X7!n3wQ==", true)
//         window.location.reload()
//     }


//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
//     });
//     var StyleLocation = { width: '100%', height: fullScreen ? "100%" : 500, overflow: 'hidden', borderRadius: 8 }

//     const [workSiteDetailDr, setWorkSiteDetailDr] = useState(false);
//     const showDrawerDr = () => {
//         setWorkSiteDetailDr(true);
//     };
//     const onCloseDr = () => {
//         setWorkSiteDetailDr(false);
//     };





//     // worksite
//     const drawCircleWorkSite = (loc, radius, safetyZone2) => {
//         const circle = new window.google.maps.Circle({
//             map: mapRef.current,
//             center: loc,
//             radius: radius,
//             strokeWeight: 0,
//             fillColor: '#0d1e4b',
//             fillOpacity: 0.4,
//             draggable: false,
//             editable: false,
//         });
//         return circle;
//     };


//     const [workSiteMarker, setWorkSiteMarker] = useState(null)
//     const [workSiteMarkerName, setWorkSiteMarkerName] = useState(null)
//     const [pointsWorkSite, setPointsWorkSite] = useState([]);
//     const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);
//     const [worksiteLoading, setWorksiteLoading] = useState([]);


//     const drawWithRadiusBounds = (firstLocation, radius) => {
//         const lat = Number(firstLocation[0]);
//         const lng = Number(firstLocation[1]);
//         const deltaLat = radius / 111320;
//         const deltaLng = radius / (111320 * Math.cos(lat * (Math.PI / 180)));
//         const center = new window.google.maps.LatLng(lat, lng);
//         const bounds = new window.google.maps.LatLngBounds();
//         bounds.extend(new window.google.maps.LatLng(lat + deltaLat, lng + deltaLng));
//         bounds.extend(new window.google.maps.LatLng(lat - deltaLat, lng - deltaLng));
//         mapRef?.current?.fitBounds(bounds);
//     };

//     const drawPolyLinePolyGoneBond = (coords) => {
//         const latLngs = coords?.map(([lat, lng]) =>
//             new window.google.maps.LatLng(Number(lat), Number(lng))
//         );
//         const bounds = new window.google.maps.LatLngBounds();
//         latLngs.forEach((p) => bounds.extend(p));
//         mapRef?.current?.fitBounds(bounds);
//     }

//     useEffect(() => {
//         setWorksiteLoading(true)
//         const polygons = PoiReducer?.workSiteData.find(data => data._id == workSite)?.polygon;
//         if (polygons?.locations.length > 0) {
//             const firstLocation = polygons?.locations?.[0];
//             if (polygons?.type == "Circle") {
//                 const killtime = setTimeout(() => {
//                     drawCircleWorkSite({
//                         lat: Number(firstLocation[0]),
//                         lng: Number(firstLocation[1]),
//                     }, polygons.radius, polygons?.safetyZone)
//                     setWorkSiteMarker({
//                         lat: Number(firstLocation[0]),
//                         lng: Number(firstLocation[1]),
//                     });
//                     setWorkSiteMarkerName(PoiReducer?.workSiteData.find(data => data._id == workSite)?.title ?? "")
//                     drawWithRadiusBounds(firstLocation, polygons.radius)
//                     setWorksiteLoading(false)
//                 }, 1000);
//                 setWorksiteLoading(false)
//                 return () => {
//                     clearTimeout(killtime)
//                 }
//             }
//             if (polygons?.type == "Polygon") {
//                 setPointsWorkSite(
//                     polygons?.locations?.map(([lat, lng]) => ({
//                         lat: Number(lat),
//                         lng: Number(lng),
//                     })) || []
//                 );
//                 drawPolyLinePolyGoneBond(polygons?.locations)
//                 let sumLat = 0;
//                 let sumLng = 0;
//                 const count = polygons?.locations.length;
//                 polygons?.locations.forEach(([latStr, lngStr]) => {
//                     sumLat += Number(latStr);
//                     sumLng += Number(lngStr);
//                 });
//                 const centerLat = sumLat / count;
//                 const centerLng = sumLng / count;
//                 setWorkSiteMarker({
//                     lat: Number(centerLat),
//                     lng: Number(centerLng),
//                 });
//                 setWorkSiteMarkerName(PoiReducer?.workSiteData.find(data => data._id == workSite)?.title ?? "")
//                 setWorksiteLoading(false)
//             }
//             if (polygons?.type == "Polyline") {
//                 setPointsMoreWorkSite(
//                     polygons?.locations?.map(([lat, lng]) => ({
//                         lat: Number(lat),
//                         lng: Number(lng),
//                     })) || []
//                 );
//                 drawPolyLinePolyGoneBond(polygons?.locations)
//                 let sumLat = 0;
//                 let sumLng = 0;
//                 const count = polygons?.locations.length;
//                 polygons?.locations.forEach(([latStr, lngStr]) => {
//                     sumLat += Number(latStr);
//                     sumLng += Number(lngStr);
//                 });
//                 const centerLat = sumLat / count;
//                 const centerLng = sumLng / count;
//                 setWorkSiteMarker({
//                     lat: Number(centerLat),
//                     lng: Number(centerLng),
//                 });
//                 setWorkSiteMarkerName(PoiReducer?.workSiteData.find(data => data._id == workSite)?.title ?? "")
//                 setWorksiteLoading(false)
//             }
//         }
//         setWorksiteLoading(false)
//     }, [PoiReducer?.workSiteData])


//     const [value1, setValue1] = useState(null);
//     const locationDataFunc = (ee) => {
//         setValue1(ee)
//         geocodeByAddress(ee?.label)
//             .then(results => getLatLng(results[0]))
//             .then(({ lat, lng }) => {
//                 setSearchLocation({
//                     lat: lat,
//                     lng: lng,
//                 })
//             }
//             );
//         if (mapRef.current) {
//             mapRef.current.setZoom(18);
//         }
//     }


//     function requestLocationAgain() {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 // console.log("Location success:", position);
//             },
//             (error) => {
//                 if (error.code === error.PERMISSION_DENIED) {
//                     messageApi.destroy();
//                     messageApi.open({
//                         type: "error",
//                         content: "You need to enable location access in your browser settings.",
//                     });
//                 }
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0
//             }
//         );
//     }

//     const handleCenterWorksite = () => {
//         if (mapRef.current) {
//             mapRef.current.panTo(new window.google.maps.LatLng(workSiteMarker.lat, workSiteMarker.lng));
//             mapRef.current.setZoom(18);
//             setValue1(null)
//             setSearchLocation(null)
//         }
//     }


//     const handleRecenter = () => {
//         if (!navigator.geolocation) {
//             setError('Geolocation is not supported by your browser.');
//             return;
//         }
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 if (mapRef.current) {
//                     mapRef.current.panTo(new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude));
//                     mapRef.current.setZoom(18);
//                     setValue1(null)
//                     setSearchLocation(null)
//                 }
//             },
//             (err) => {
//                 if (err.code === 2) {
//                     setError('Location unavailable.');
//                 } else if (err.code === 3) {
//                     setError('Location request timed out.');
//                 } else {
//                     setError('An unknown error occurred.');
//                 }
//                 console.error('Geolocation error:', err);
//             }
//         );

//     };


//     const [workSiteMainData, setWorkSiteMainData] = useState()
//     const LoadWorkSiteData = async () => {
//         const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
//         const options = {
//             method: 'GET',
//             headers: {
//                 "Content-Type": "application/json",
//                 "authorization": `Bearer ${token}`,
//             },
//         };
//         const response = await fetch(`${baseUrl}/worksites/get-by-id/${workSite}`, options);
//         const res = await response.json();
//         if (response.status === 200 || response.status === 201) {
//             setWorkSiteMainData(res?._doc)
//         }
//     }



//     const [workName, setWorkName] = useState("")

//     useEffect(() => {
//         const init = async () => {
//             if (workSite) {
//                 await LoadWorkSiteData()
//                 await loadWo()
//             }
//         }
//         init()
//     }, [workSite])



//     const loadWo = async () => {
//         const result = await WorkSiteGetByIdMap(workSite)
//         setWorkName(result?._doc?.title || "")
//     }

//     const [selectedPoint, setSelectedPoint] = useState()
//     const [selectedId, setSelectedId] = useState()
//     const [searchLocationModal, setsearchLocationModal] = useState(false);
//     const [loadDetails, setLoadDetails] = useState(false);




//     const showLocationModal = async (classN, ID) => {
//         setsearchLocationModal(true);
//         setLoadDetails(true)
//         if (classN == "POI") {
//             const result = await WorkPOIGetByIdMap(ID)
//             setCurrentPole(result)
//             setSelectedId(ID)
//             setSelectedPoint("POI")
//         }
//         else if (classN == "Alert") {
//             const result = await GetAlertsByIDMap(ID)
//             setCurrentPole(result)
//             setSelectedId(ID)
//             setSelectedPoint("Alert")
//         }
//         else if (classN == "Asset") {
//             const result = await GetAssetsByIDMap(ID)
//             setCurrentPole(result)
//             setSelectedId(ID)
//             setSelectedPoint("Asset")
//         }
//         else if (classN == "Project") {
//             const result = await GetProjectByIDMap(ID)
//             setCurrentPole(result)
//             setSelectedId(ID)
//             setSelectedPoint("Project")
//         }
//         else if (classN == "WorkOrder") {
//             const result = await WorkOrderGetByIdMap(ID)
//             setCurrentPole(result)
//             setSelectedId(ID)
//             setSelectedPoint("WorkOrder")
//         }
//         else if (classN == "WorkSite") {
//             const result = await WorkSiteGetByIdMap(ID)
//             setCurrentPole(result?._doc)
//             setSelectedId(ID)
//             setSelectedPoint("WorkSite")
//         }
//         else if (classN == "Muster") {
//             const result = await MusterByIdMap(ID)
//             setCurrentPole(result)
//             setSelectedId(ID)
//             setSelectedPoint("Muster")
//         }
//         setLoadDetails(false)
//     };




//     const handleLocationCancel = () => {
//         setsearchLocationModal(false);
//     };


//     const [clusterListData, setClusterListData] = useState([])
//     const [clusterListPopup, setClusterListPopup] = useState(false)
//     const closeClusterModal = () => {
//         setClusterListPopup(false)
//     }


//     const getPolygonCenter = (polygon) => {
//         if (!polygon) return null;

//         if (polygon.latitude && polygon.longitude) {
//             return { lat: Number(polygon.latitude), lng: Number(polygon.longitude) };
//         }

//         if (Array.isArray(polygon) && Array.isArray(polygon[0])) {
//             const lat = polygon.reduce((sum, p) => sum + p[1], 0) / polygon.length;
//             const lng = polygon.reduce((sum, p) => sum + p[0], 0) / polygon.length;
//             return { lat: Number(lat), lng: Number(lng) };
//         }

//         if (Array.isArray(polygon) && polygon[0]?.lat !== undefined) {
//             const lat = polygon.reduce((sum, p) => sum + p.lat, 0) / polygon.length;
//             const lng = polygon.reduce((sum, p) => sum + p.lng, 0) / polygon.length;
//             return { lat: Number(lat), lng: Number(lng) };
//         }

//         return null;
//     };



//     const optionsFilter = [
//         {
//             label: 'Assets',
//             value: "Asset",
//         },
//         {
//             label: 'Alerts',
//             value: "Alert",
//         },
//         {
//             label: 'POIs',
//             value: "POI",
//         },
//         {
//             label: 'Projects',
//             value: "Project",
//         },
//         {
//             label: 'Work Orders',
//             value: "WorkOrder",
//         },
//     ]



//     const allowedTypes = new Set([
//         "Muster",
//         "WorkSite",
//         ...(filterValueMap || [])
//     ]);


//     const items = useMemo(() => {
//         const allPolygons = [
//             {
//                 center: workSiteMarker,
//                 type: "WorkSite",
//                 icon: WorkSiteIcon,
//                 title: workSiteMarkerName,
//                 _id: workSite
//             },
//             ...(!IsPromExp
//                 ? [
//                     ...(musterStation || []).map(item => ({
//                         ...item,
//                         type: "Muster",
//                         center: getPolygonCenter(item.polygon),
//                         icon: evacuationIcon,
//                     })),
//                     ...(MapData?.assetsPolygons || []).map(item => ({
//                         ...item,
//                         type: "Asset",
//                         center: getPolygonCenter(item.polygon),
//                         icon: assetsImage,
//                     })),
//                     ...(MapData?.alertsPolygons || []).map(item => ({
//                         ...item,
//                         type: "Alert",
//                         center: getPolygonCenter(item.polygon),
//                         icon:
//                             item?.alertType === "HAZARD"
//                                 ? alertsImage1
//                                 : item?.alertType === "WEATHER"
//                                     ? alertsImage2
//                                     : item?.alertType === "COMMUNICATION"
//                                         ? alertsImage4
//                                         : item?.alertType === "SECURITY"
//                                             ? alertsImage3
//                                             : null,
//                         childType: item?.alertType,
//                     })),
//                     ...(MapData?.reportsPolygons || []).map(item => ({
//                         ...item,
//                         type: "POI",
//                         center: getPolygonCenter(item.polygon),
//                         icon: POISImage,
//                     })),
//                     ...(MapData?.projectPolygons || []).map(item => ({
//                         ...item,
//                         type: "Project",
//                         center: getPolygonCenter(item.polygon),
//                         icon: projectsImage,
//                     })),
//                     ...(MapData?.workordersPolygons || []).map(item => ({
//                         ...item,
//                         type: "WorkOrder",
//                         center: getPolygonCenter(item.polygon),
//                         icon: workordersImage,
//                     })),
//                 ]
//                 : []),
//         ];

//         return allPolygons.filter(({ center, type }) => {
//             return (
//                 center &&
//                 Number.isFinite(center.lat) &&
//                 Number.isFinite(center.lng) &&
//                 (
//                     !filterValueMap ||
//                     filterValueMap.length === 0 ||
//                     allowedTypes.has(type)
//                 )
//             );
//         });
//     }, [MapData, workSiteMarker, filterValueMap, IsPromExp]);




//     useEffect(() => {
//         const key = 'gT4#nL!8vQ@2zR*e6^hP+M==';
//         const NewPayload = Array.isArray(musterStation)
//             ? musterStation.map((dataKK) => ({
//                 title: dataKK?.title || "",
//                 polygon: JSON.stringify(dataKK?.polygon || []),
//                 id: dataKK?._id || null,
//             }))
//             : [];

//         localStorage.setItem(key, JSON.stringify(NewPayload));
//     }, [musterStation])



//     const onMapLoad = useCallback((map) => {
//         if (!map || !window.google?.maps) return;

//         mapRef.current = map;

//         if (!Array.isArray(items) || items.length === 0) return;

//         const bounds = new window.google.maps.LatLngBounds();
//         let hasValidPoint = false;

//         items.forEach((item) => {
//             const lat = Number(item?.center?.lat);
//             const lng = Number(item?.center?.lng);

//             if (
//                 Number.isFinite(lat) &&
//                 Number.isFinite(lng)
//             ) {
//                 bounds.extend({ lat, lng });
//                 hasValidPoint = true;
//             }
//         });

//         if (hasValidPoint) {
//             try {
//                 map.fitBounds(bounds);
//             } catch (e) {
//                 console.error("fitBounds failed:", e);
//             }
//         }
//     }, [items]);


//     const AllIcon = {
//         POI: poiIcon1,
//         Alert: currentPole?.alertType == "HAZARD" ? alerttIcon1 : currentPole?.alertType == "WEATHER" ? alerttIcon2 : currentPole?.alertType == "COMMUNICATION" ? alerttIcon3 : currentPole?.alertType == "SECURITY" ? alerttIcon4 : null,
//         Asset: assetsIcon1,
//         Project: projectIcon1,
//         WorkOrder: workorderIcon1,
//     };




//     const AllIconCenter = {
//         POI: DashboardIcon7,
//         Alert: currentPole?.alertType == "HAZARD" ? DashboardIcon1 : currentPole?.alertType == "WEATHER" ? DashboardIcon4 : currentPole?.alertType == "COMMUNICATION" ? DashboardIcon6 : currentPole?.alertType == "SECURITY" ? DashboardIcon9 : null,
//         Asset: DashboardIcon2,
//         Project: DashboardIcon8,
//         WorkOrder: DashboardIcon5,
//         WorkSite: DashboardIcon3,
//         Muster: DashboardIcon10
//     };


//     const [activeMarker, setActiveMarker] = useState(null);
//     const markerRefs = useRef({});

//     const handleMouseOver = (id) => setActiveMarker(id);
//     const handleMouseOut = () => setActiveMarker(null);

//     const getMarkerPosition = (locations) => {
//         if (!locations) return null;

//         let lat, lng;

//         if (Array.isArray(locations[0])) {
//             lat = Number(locations[0][0]);
//             lng = Number(locations[0][1]);
//         } else {
//             lat = Number(locations[0]);
//             lng = Number(locations[1]);
//         }
//         if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
//             console.warn("Invalid coordinates detected:", locations);
//             return null;
//         }

//         return { lat, lng };
//     };




























































//     // PolygonComplete
//     const [paddingP, setPaddingP] = useState([]);
//     const [polyGoneNameP, setPolyGoneNameP] = useState([]);
//     const [pointsP, setPointsP] = useState([]);
//     const [polyGoneMCenterP, setPolyGoneMCenterP] = useState([]);



//     const getSafetyZonePathP = (polygonPoints, offsetMeters) => {
//         if (!polygonPoints?.length) return [];

//         const center = {
//             lat: polygonPoints?.reduce((sum, p) => sum + p.lat, 0) / polygonPoints?.length,
//             lng: polygonPoints?.reduce((sum, p) => sum + p.lng, 0) / polygonPoints?.length,
//         };

//         const padded = polygonPoints?.map((pt) => offsetPointP(pt, center, offsetMeters));
//         return [...padded, padded[0]];
//     };

//     const offsetPointP = (point, center, offsetMeters) => {
//         const R = 6378137;
//         const dLat = point.lat - center.lat;
//         const dLng = point.lng - center.lng;
//         const latInRad = (center.lat * Math.PI) / 180;
//         const dX = (dLng * Math.PI / 180) * R * Math.cos(latInRad);
//         const dY = (dLat * Math.PI / 180) * R;
//         const len = Math.sqrt(dX * dX + dY * dY);
//         if (len === 0) return point;
//         const scale = (len + offsetMeters) / len;
//         const newLat = center.lat + (dY * scale / R) * (180 / Math.PI);
//         const newLng = center.lng + (dX * scale / (R * Math.cos(latInRad))) * (180 / Math.PI);
//         return { lat: newLat, lng: newLng };
//     };
//     // PolygonComplete







//     // polylineComplete
//     const [pointsPolyLine, setPointsPolyLine] = useState([]);
//     const [bandPolygon, setBandPolygon] = useState([]);
//     const [polylineWidth, setPolylineWidth] = useState(1)
//     const [polylineSafety, setPolylineSafety] = useState(0)
//     const [polylineElevation, setPolylineElevation] = useState(0)
//     const [safetyZonePolyLine, setSafetyZonePolyLine] = useState([]);
//     const [polylineList, setPolylineList] = useState([])





//     // polyline
//     const getCenter2 = (points) => {
//         const lat =
//             points.reduce((sum, p) => sum + p.lat, 0) / points.length;
//         const lng =
//             points.reduce((sum, p) => sum + p.lng, 0) / points.length;
//         return { lat, lng };
//     };
//     const movePolyLineToCenter = (points, newCenter) => {
//         const currentCenter = getCenter2(points);
//         const latDiff = newCenter.lat - currentCenter.lat;
//         const lngDiff = newCenter.lng - currentCenter.lng;
//         return points.map((p) => ({
//             lat: p.lat + latDiff,
//             lng: p.lng + lngDiff,
//         }));
//     };
//     const changePolyLinePoint = useCallback((e) => {
//         const { lat, lng } = getLatLng(e);
//         if (lat == null || lng == null) return;
//         const newCenter = {
//             lat: lat,
//             lng: lng,
//         };
//         const updated = movePolygonToCenter(pointsPolyLine, newCenter);
//         setPointsPolyLine(updated);
//     }, [pointsPolyLine]);
//     const addPolyLine = useCallback((e) => {
//         const { lat, lng } = getLatLng(e);
//         if (lat == null || lng == null) return;
//         setPointsPolyLine(prev => [...prev, { lat, lng }]);
//     }, []);
//     const computeOffset = (pointsPolyLine, dist) => {
//         const left = [];
//         const right = [];

//         for (let i = 0; i < pointsPolyLine?.length - 1; i++) {
//             const p1 = pointsPolyLine[i];
//             const p2 = pointsPolyLine[i + 1];
//             const dx = p2.lng - p1.lng;
//             const dy = p2.lat - p1.lat;
//             const length = Math.sqrt(dx * dx + dy * dy);
//             const ux = dx / length;
//             const uy = dy / length;
//             const px = -uy;
//             const py = ux;

//             const metersPerLat = 111320;
//             const metersPerLng = 111320 * Math.cos((p1.lat * Math.PI) / 180);

//             const dLat = (py * dist) / metersPerLat;
//             const dLng = (px * dist) / metersPerLng;

//             left.push({ lat: p1.lat + dLat, lng: p1.lng + dLng });
//             left.push({ lat: p2.lat + dLat, lng: p2.lng + dLng });

//             right.push({ lat: p1.lat - dLat, lng: p1.lng - dLng });
//             right.push({ lat: p2.lat - dLat, lng: p2.lng - dLng });
//         }

//         return { left, right };
//     };

//     useEffect(() => {
//         if (pointsPolyLine?.length >= 2) {
//             const { left, right } = computeOffset(pointsPolyLine, polylineWidth);
//             const band = [...left, ...right.reverse()];
//             setBandPolygon(band);
//             const { left: sLeft, right: sRight } = computeOffset(
//                 pointsPolyLine,
//                 polylineWidth + polylineSafety
//             );
//             const safety = [...sLeft, ...sRight.reverse()];
//             setSafetyZonePolyLine(safety);
//         } else {
//             setBandPolygon([]);
//             setSafetyZonePolyLine([]);
//         }
//     }, [pointsPolyLine, polylineWidth, polylineSafety]);

//     const removePoyLine = (indexRemover) => {
//         setPointsPolyLine(prev => {
//             const updated = prev.filter((_, index) => index !== indexRemover);
//             if (updated.length < 2) {
//                 setSafetyZonePolyLine([]);
//             }
//             return updated;
//         });
//     };
//     // polyline
//     // polylineComplete




//     const [drawCircleState, setDrawCircleState] = useState([])

//     useEffect(() => {
//         const NewPayload = Array.isArray(items)
//             ? items.map((dataKK) => ({
//                 title: "",
//                 polygon: { ...dataKK?.polygon, mainType: dataKK?.alertType, polyType: dataKK?.type, cId: dataKK?._id },
//                 id: dataKK?._id,
//             }))
//             : [];
//         if (!NewPayload || !Array.isArray(NewPayload)) return;
//         const parsedPolygons = NewPayload
//             .map((data) => {
//                 try {
//                     return (data?.polygon || {});
//                 } catch {
//                     return null;
//                 }
//             })
//             .filter(Boolean);
//         const circleData = parsedPolygons.filter((p) => p?.type === "Circle");
//         const polygonData = parsedPolygons.filter((p) => p?.type === "Polygon");
//         const polylineData = parsedPolygons.filter((p) => p?.type === "Polyline");
//         if (circleData?.length > 0) {
//             const formattedCircle = circleData?.map((data, index) => {
//                 return {
//                     center: {
//                         lat: Number(data?.locations?.[0]?.[0]),
//                         lng: Number(data?.locations?.[0]?.[1]),
//                     },
//                     radius: data?.radius,
//                     safetyZone: data?.safetyZone,
//                     mainType: data?.mainType,
//                     index: index,
//                     cId: data?.cId,
//                     polyType: data?.polyType,
//                     title: circleData.map((line) => JSON.parse(line?.meta).title || "")
//                 };
//             });
//             setDrawCircleState(formattedCircle)
//         }
//         else {
//             setDrawCircleState([])
//         }
//         if (polygonData?.length > 0) {
//             setPointsP(
//                 polygonData.map((poly) => ({
//                     safetyZone: poly.safetyZone,
//                     type: poly?.mainType,
//                     cId: poly?.cId,
//                     polyType: poly?.polyType,
//                     points: poly?.locations?.map(([lat, lng]) => ({
//                         lat: parseFloat(lat),
//                         lng: parseFloat(lng),
//                     })),
//                 }))
//             );
//             setPaddingP(polygonData?.map((poly) => poly?.safetyZone || 0));
//             setPolyGoneNameP(polygonData.map((line) => JSON.parse(line?.meta).title || ""))
//             setPolyGoneMCenterP(
//                 polygonData.map((line) => ({
//                     lng: line?.longitude,
//                     lat: line?.latitude,
//                 }))
//             )
//         }
//         else {
//             setPointsP([])
//         }
//         if (polylineData.length > 0) {
//             const formattedPolylines = polylineData.map((item) => {
//                 const points = item.locations.map(([lat, lng]) => ({
//                     lat: Number(lat),
//                     lng: Number(lng),
//                 }));
//                 const { left, right } = computeOffset(points, item?.radius);
//                 const band = [...left, ...right.reverse()];
//                 const { left: sLeft, right: sRight } = computeOffset(points, item?.radius + item?.safetyZone);
//                 const safety = [...sLeft, ...sRight.reverse()];
//                 return {
//                     id: item._id,
//                     cId: item?.cId,
//                     elevation: Number(item.altitude || 0),
//                     type: item?.polyType,
//                     mainType: item?.mainType,
//                     band,
//                     safetyZone: safety,
//                     points,
//                 };
//             });
//             setPolylineList(formattedPolylines);
//         }
//         else {
//             setPolylineList([])
//         }

//         return () => {
//             setPointsP([]);
//             setPointsMoreM([]);
//             setPaddingP([]);
//             setPolyGoneNameP([]);
//             setOffsetPolygonM([]);
//         }
//     }, [items, MapData, workSiteMarker, filterValueMap, IsPromExp])














//     const circleRefs = useRef([]);
//     const circleChiledRefs = useRef([]);


//     useEffect(() => {
//         circleRefs.current.forEach(c => c.setMap(null));
//         circleRefs.current = [];
//         circleChiledRefs.current.forEach(c => c.setMap(null));
//         circleChiledRefs.current = [];
//         const filtered = drawCircleState?.filter(data =>
//             !filterValueMap || filterValueMap.length === 0 ||
//             data?.polyType === "Muster" || data?.polyType === "WorkSite" ||
//             filterValueMap.includes(data?.polyType)
//         )
//         filtered?.forEach(poly => {
//             const circle = new google.maps.Circle({
//                 map: mapRef.current,
//                 center: poly.center,
//                 radius: poly.radius,
//                 strokeOpacity: 0.8,
//                 strokeWeight: 0,
//                 fillColor:
//                     poly.polyType === "WorkOrder" ? "#52524b" :
//                         poly.polyType === "POI" ? "#214CBC" :
//                             poly.polyType === "Asset" ? "#082625" :
//                                 poly.polyType === "Project" ? "#09482A" :
//                                     poly.polyType === "Muster" ? "#548F1C" :
//                                         poly.polyType === "Alert" ? poly?.mainType == "HAZARD" ? "#D32029" : poly?.mainType == "WEATHER" ? "#129154" : poly?.mainType == "COMMUNICATION" ? "#F4B740" : poly?.mainType == "SECURITY" ? "#016483" : "#ff3030" :
//                                             "#ff3030",
//                 fillOpacity: poly.polyType === "Muster" ? 0.4 : 0.2,
//                 zIndex: 100,
//                 clickable: true,
//             });
//             const circleChild = new google.maps.Circle({
//                 map: mapRef.current,
//                 center: poly.center,
//                 radius: poly.radius + poly.safetyZone,
//                 strokeOpacity: 0.8,
//                 strokeWeight: 0,
//                 fillColor:
//                     poly.polyType === "WorkOrder" ? "#52524b" :
//                         poly.polyType === "POI" ? "#214CBC" :
//                             poly.polyType === "Asset" ? "#082625" :
//                                 poly.polyType === "Project" ? "#09482A" :
//                                     poly.polyType === "Muster" ? "#548F1C" :
//                                         poly.polyType === "Alert" ? poly?.mainType == "HAZARD" ? "#D32029" : poly?.mainType == "WEATHER" ? "#129154" : poly?.mainType == "COMMUNICATION" ? "#F4B740" : poly?.mainType == "SECURITY" ? "#016483" : "#ff3030" :
//                                             "#ff3030",
//                 fillOpacity: poly?.polyType === "Muster" ? 0 : 0.2,
//                 zIndex: 100,
//                 clickable: true,
//             });
//             circleChild.addListener("click", (event) => {
//                 showLocationModal(poly?.polyType, poly?.cId)
//             });
//             circleRefs.current.push(circle);
//             circleChiledRefs.current.push(circleChild);
//         });
//     }, [drawCircleState, filterValueMap]);


//     const [assetsFilter, setAssteFilter] = useState(false);
//     const onShowAssetsDrawer = () => {
//         setAssteFilter(true);
//     };
//     const onCloseAssetsDrawer = () => {
//         setAssteFilter(false);
//     };





//     // department
//     const [newDepartment, setNewDepartment] = useState([]);
//     const depatmentData = AssetsReducer?.departmentData?.map(data => ({
//         value: data.name,
//         label: data.name,
//     }));
//     const CreateDepartmentEx = async (valueToAdd) => {
//         const trimmedSearch = valueToAdd?.trim();
//         if (!trimmedSearch) return;
//         setNewDepartment(prev => [
//             { value: trimmedSearch, label: trimmedSearch },
//             ...prev,
//         ]);
//     };



//     // Model
//     const [newModel, setNewModel] = useState([]);
//     const modelData = AssetsReducer?.modelData?.map(data => ({
//         value: data.name,
//         label: data.name,
//     }));
//     const CreateModelEx = async (valueToAdd) => {
//         const trimmedSearch = valueToAdd?.trim();
//         if (!trimmedSearch) return;
//         setNewModel(prev => [
//             { value: trimmedSearch, label: trimmedSearch },
//             ...prev,
//         ]);
//     };



//     // Asset Type
//     const [newAssetType, setNewAssetType] = useState([]);
//     const assetTypeData = AssetsReducer?.assetTypeData?.map(data => ({
//         value: data.name,
//         label: data.name,
//     }));
//     const CreatesetNewAssetTypeEx = async (valueToAdd) => {
//         const trimmedSearch = valueToAdd?.trim();
//         if (!trimmedSearch) return;
//         setNewAssetType(prev => [
//             { value: trimmedSearch, label: trimmedSearch },
//             ...prev,
//         ]);
//     };


//     const schema = yup.object().shape({
//         assetType: yup.string().notRequired(),
//         department: yup.string().notRequired(),
//         model: yup.string().notRequired(),
//     });
//     const {
//         control,
//         handleSubmit,
//         formState: { errors, isSubmitting, isValid },
//         getValues,
//         watch,
//         reset,
//         resetField
//     } = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: {
//             assetType: '',
//             department: '',
//             model: '',
//         },
//     });



//     const [polygonType, setPolygonType] = useState([]);
//     const AddTypeKey = (UpperParams) => {
//         setPolygonType((prev) => {
//             if (prev.includes(UpperParams)) {
//                 return prev.filter(item => item !== UpperParams);
//             } else {
//                 return [...prev, UpperParams];
//             }
//         });
//     };

//     const markerDataMap = useRef(new Map());

//     const [isMobile, setIsMobile] = useState(window.innerWidth <= 1500);

//     useEffect(() => {
//         const handleResize = () => setIsMobile(window.innerWidth <= 1500);
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     const customStyles = {
//         control: (base) => ({
//             ...base,
//             minHeight: isMobile ? "40px" : "48px",
//             height: isMobile ? "40px" : "48px",
//             borderRadius: '8px'
//         }),
//         valueContainer: (base) => ({
//             ...base,
//             height: isMobile ? "40px" : "48px",
//             padding: isMobile ? "0 6px" : "0 8px",
//             borderRadius: '8px'
//         }),
//         indicatorsContainer: (base) => ({
//             ...base,
//             height: isMobile ? "40px" : "48px",
//             borderRadius: '8px'
//         }),
//     };


//     const RemoveAssetFilter = () => {
//         reset()
//         setPolygonType([])
//         setExtraDataState({
//             name: '',
//             type: '',
//         })
//         handleSubmit(submitParam)()
//         onCloseAssetsDrawer()
//     }




//     // Extra Data


//     const [extraDataState, setExtraDataState] = useState({
//         name: '',
//         type: '',
//     });







//     const getAssetParams = (data) => {
//         const params = new URLSearchParams();
//         if (data?.name) {
//             params.append("extraFieldName", data?.name.toLowerCase());
//         }
//         if (data?.type) {
//             params.append("extraFieldType", data?.type.toLowerCase());
//         }
//         if (data?.polygonType?.length) {
//             data?.polygonType.forEach((e) => {
//                 params.append(
//                     "polygon_type[]", (e || "").replace(/\b\w/g, (c) => c.toUpperCase())
//                 );
//             });
//         }
//         if (data?.department) {
//             params.append("departmentName", data?.department.toLowerCase());
//         }
//         if (data?.assetType) {
//             params.append("title", data?.assetType?.toLowerCase());
//         }
//         if (data?.model) {
//             params.append("modelName", data?.model.toLowerCase());
//         }

//         return params.toString();
//     };



//     const submitParam = async (data) => {
//         setWholeMapDataLoader(true)
//         const mergedData = { ...data, ...extraDataState, ...{ polygonType: polygonType } }
//         const retu = await getAssetParams(mergedData)
//         LoadMapData(retu, onCloseAssetsDrawer)
//     }



//     return (
//         <>
//             <Modal
//                 title={`Area Summary (${clusterListData?.length || 0})`}
//                 closable={true}
//                 open={clusterListPopup}
//                 onCancel={closeClusterModal}
//                 footer={() => { <></> }}
//                 maskClosable={true}
//                 getContainer={document.body}
//                 afterOpenChange={(visible) => {
//                     document.body.style.overflow = visible ? "hidden" : "auto";
//                 }}
//                 destroyOnClose
//             >
//                 <div className={Style.ControllerContainer}>
//                     {Array.isArray(clusterListData) && clusterListData.length > 0 ? clusterListData.map(data => {
//                         return (
//                             <div style={{ width: "100%", paddingTop: 15 }}>
//                                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                                     <div style={{ marginLeft: 10, width: "100%" }}>
//                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "100%" }}>
//                                             <div>
//                                                 {data?.type == "WorkSite" ?
//                                                     <p style={{ margin: 0, fontSize: 16, fontWeight: 600, width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{data?.title}</p>
//                                                     :
//                                                     <p style={{ margin: 0, fontSize: 16, fontWeight: 600, width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{JSON.parse(data?.polygon?.meta || "{}")?.title}</p>
//                                                 }
//                                                 <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#919191', width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{data?.type}</p>
//                                             </div>
//                                             <div onClick={() => data?.type == "Asset" ? viewAssets(data?._id) : data?.type == "Alert" ? viewAlerts(data?._id) : data?.type == "POI" ? viewPOIs(data?._id) : data?.type == "WorkOrder" ? viewWorkOrder(data?._id) : data?.type == "Project" ? viewProject(data?._id) : data?.type == "Muster" ? viewMuster(data?._id) : data?.type == "WorkSite" ? viewWorkSite() : null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#214CBC', cursor: 'pointer' }}>View Detail <MdKeyboardArrowRight color="#214CBC" size={20} /></div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )
//                     }) : ""}
//                 </div>
//             </Modal>

//             <Modal
//                 title={!loadDetails && selectedPoint}
//                 closable={true}
//                 open={searchLocationModal}
//                 onCancel={handleLocationCancel}
//                 footer={() => { <></> }}
//                 maskClosable={true}
//                 getContainer={document.body}
//                 afterOpenChange={(visible) => {
//                     document.body.style.overflow = visible ? "hidden" : "auto";
//                 }}
//             >
//                 {loadDetails ?
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: 30, width: '100%' }}>
//                         <Spin />
//                     </div>
//                     :
//                     <div style={{ width: "100%", paddingTop: 15 }}>
//                         <div className={Style.NameContainer}>
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                                 <div className={Style.ContainIcon}>
//                                     <img src={AllIconCenter[selectedPoint]} alt="Icon" />
//                                 </div>
//                                 <div>
//                                     {selectedPoint === "Asset" ?
//                                         <p style={{ margin: 0, fontSize: 18, fontWeight: 600, width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentPole?.assetType?.name}</p>
//                                         :
//                                         <p style={{ margin: 0, fontSize: 18, fontWeight: 600, width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentPole?.title}</p>
//                                     }
//                                     <ReactTimeAgo date={currentPole?.createdAt} locale="en-US" />
//                                 </div>
//                             </div>
//                             <div >
//                                 {selectedPoint === "Project" || selectedPoint === "Asset" ?
//                                     <>
//                                         {Array.isArray(currentPole?.elevationLevels) && currentPole?.elevationLevels?.length > 0 ? (
//                                             currentPole?.elevationLevels.map((item, index) => (
//                                                 <Tag color={"green"}>
//                                                     {item}
//                                                 </Tag>
//                                             ))) : ""}
//                                     </>
//                                     : selectedPoint === "WorkOrder" ?
//                                         <>
//                                             <Tag color={"orange"}>
//                                                 {currentPole?.priority}
//                                             </Tag>
//                                         </>
//                                         :
//                                         <Tag style={{ color: currentPole?.riskLevel == "No Threat" ? "#666d80" : currentPole?.riskLevel == "Lowest" ? "#17736E" : currentPole?.riskLevel == "Moderate" ? '#926E26' : currentPole?.riskLevel == "High" ? '#D32029' : currentPole?.riskLevel == "Extreme" ? '#7F1319' : null }} color={currentPole?.riskLevel == "No Threat" ? "rgba(102, 109, 128,0.1)" : currentPole?.riskLevel == "Lowest" ? "rgba(23, 115, 110,0.1)" : currentPole?.riskLevel == "Moderate" ? 'rgba(146, 110, 38,0.1)' : currentPole?.riskLevel == "High" ? 'rgba(211, 32, 41,0.1)' : currentPole?.riskLevel == "Extreme" ? 'rgba(127, 19, 25,0.1)' : null}>
//                                             {currentPole?.riskLevel === "No Threat" ? "No Risk" : currentPole?.riskLevel === "Lowest" ? "Lowest Risk" : currentPole?.riskLevel === "Moderate" ? "Moderate Risk" : currentPole?.riskLevel === "High" ? "High Risk" : currentPole?.riskLevel === "Extreme" ? "Extreme Risk" : currentPole?.riskLevel}
//                                         </Tag>
//                                 }
//                             </div>
//                         </div>
//                         {!Array.isArray(currentPole?.teams) &&
//                             <div className={Style.NameContainer}>
//                                 <h3 style={{ marginBottom: 0, marginTop: 25 }}>Worksite:</h3>
//                                 <p style={{ marginBottom: 0, marginTop: 25 }}>{workName}</p>
//                             </div>
//                         }
//                         <div className={Style.NameContainer}>
//                             <h3 style={{ margin: 0, marginTop: Array.isArray(currentPole?.teams) ? 25 : 5 }}>Elevation:</h3>
//                             <p style={{ margin: 0, marginTop: 5 }}>{currentPole?.polygon?.altitude} m</p>
//                         </div>
//                         <div className={Style.NameContainer}>
//                             <h3 style={{ margin: 0, marginTop: 5 }}>Area:</h3>
//                             <p style={{ margin: 0, marginTop: 5 }}>{Math.round(Number(currentPole?.polygon?.radius || 0))} m</p>
//                         </div>
//                         <div style={{ marginTop: 20 }} className={Style.NameContainer}>
//                             <div onClick={() => selectedPoint == "Asset" ? viewAssets(selectedId) : selectedPoint == "Alert" ? viewAlerts(selectedId) : selectedPoint == "POI" ? viewPOIs(selectedId) : selectedPoint == "WorkOrder" ? viewWorkOrder(selectedId) : selectedPoint == "Project" ? viewProject(selectedId) : selectedPoint == "Muster" ? viewMuster(selectedId) : selectedPoint == "WorkSite" ? viewWorkSite() : null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#214CBC', cursor: 'pointer' }}>View Detail <MdKeyboardArrowRight color="#214CBC" size={20} /></div>
//                         </div>
//                     </div>}
//             </Modal>

//             <Drawer
//                 title={workSiteMainData?.title}
//                 onClose={onCloseDr}
//                 open={workSiteDetailDr}
//                 height={'100%'}
//                 maskClosable={false}
//                 getContainer={document.body}
//                 afterOpenChange={(visible) => {
//                     document.body.style.overflow = visible ? "hidden" : "auto";
//                 }}
//             >
//                 {workSiteMainData?.description &&
//                     <>
//                         <h4 style={{ marginBottom: 0 }}>Description</h4>
//                         <p style={{ marginTop: 5 }}>{workSiteMainData?.description}</p>
//                     </>
//                 }

//                 {workSiteMainData?.teams?.length > 0 &&
//                     <>
//                         <h4 style={{ marginBottom: 0 }}>Teams</h4>
//                         <Space size="middle">
//                             <div className={Style.MemContainer}>
//                                 <>
//                                     {workSiteMainData?.teams?.slice(0, 3).map((member, index) => {
//                                         const initials = `${member?.title?.[0] || ""}`;
//                                         const classNames = [Style.FirstMemCont, Style.SecondMemCont, Style.ThirdMemCont];
//                                         return (
//                                             <Tooltip key={index} title={`${member?.title || ""}`}>
//                                                 <div key={index} className={classNames[index]}>
//                                                     <p>{initials}</p>
//                                                 </div>
//                                             </Tooltip>
//                                         );
//                                     })}
//                                 </>
//                                 {workSiteMainData?.teams?.length > 3 && (
//                                     <p className={Style.paraMore}>{`+${workSiteMainData?.teams?.length - 3}`}</p>
//                                 )}
//                             </div>
//                         </Space>
//                     </>
//                 }

//                 {workSiteMainData?.manager && (
//                     <>
//                         <h4 style={{ marginBottom: 0 }}>Manager</h4>
//                         <Space size="middle">
//                             <div className={Style.MemContainer}>
//                                 <Tooltip title={`${workSiteMainData?.manager?.firstName || ""} ${workSiteMainData?.manager?.lastName || ""}`}>
//                                     <div className={Style.FirstMemCont}>
//                                         <p>{workSiteMainData?.manager?.firstName?.[0] || ""}{workSiteMainData?.manager?.lastName?.[0] || ""}</p>
//                                     </div>
//                                 </Tooltip>
//                             </div>
//                         </Space>
//                     </>
//                 )}

//             </Drawer>

//             <Drawer
//                 title={"Asstes Filter"}
//                 onClose={onCloseAssetsDrawer}
//                 open={assetsFilter}
//                 height={'100%'}
//                 maskClosable={false}
//                 getContainer={document.body}
//                 afterOpenChange={(visible) => {
//                     document.body.style.overflow = visible ? "hidden" : "auto";
//                 }}
//             >
//                 <>
//                     <Row>
//                         <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
//                             <div className={Style.FeildCol}>
//                                 <div className={Style.ResetterIcon}>
//                                     <label>Assets type</label>
//                                     <label
//                                         onClick={() => resetField("assetType")}
//                                         className={Style.ResetButton}>Reset</label>
//                                 </div>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <>
//                                             <AddDataSelect adding={false} name={"assetType"} loading={AssetsReducer?.assetTypeLoading} disable={wholeMapDataLoader} addNewValue={CreatesetNewAssetTypeEx} setValue={onChange} value={value} optionData={assetTypeData} />
//                                         </>
//                                     )}
//                                     name="assetType"
//                                 />
//                             </div>
//                         </Col>
//                         <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
//                             <div className={Style.FeildCol}>
//                                 <label>Department</label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <>
//                                             <AddDataSelect adding={false} name={"department"} loading={AssetsReducer?.departmentLoading} disable={wholeMapDataLoader} addNewValue={CreateDepartmentEx} setValue={onChange} value={value} optionData={depatmentData} />
//                                         </>
//                                     )}
//                                     name="department"
//                                 />
//                             </div>
//                         </Col>
//                         <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
//                             <div className={Style.FeildCol}>
//                                 <label>Model</label>
//                                 <Controller
//                                     control={control}
//                                     rules={{
//                                         required: true,
//                                     }}
//                                     render={({ field: { onChange, value } }) => (
//                                         <>
//                                             <AddDataSelect adding={false} name={"model"} loading={AssetsReducer?.modelLoading} disable={wholeMapDataLoader} addNewValue={CreateModelEx} setValue={onChange} value={value} optionData={modelData} />
//                                         </>
//                                     )}
//                                     name="model"
//                                 />
//                             </div>
//                         </Col>

//                         <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
//                             <div className={Style.FeildCol}>
//                                 <div>
//                                     <div className={Style.ResetterIcon}>
//                                         <label>Extra Data</label>
//                                         <label
//                                             onClick={() => wholeMapDataLoader ? null : setExtraDataState({
//                                                 name: '',
//                                                 type: '',
//                                             })}
//                                             className={Style.ResetButton}>Reset</label>
//                                     </div>
//                                     <Input value={extraDataState.name} disabled={wholeMapDataLoader} onChange={(e) => setExtraDataState(prev => ({ type: e.target.value == "" ? "" : prev.type == "" ? "Input" : prev.type, name: e.target.value }))} placeholder='Enter name' />
//                                 </div>
//                                 <div style={{ marginTop: 16 }}>
//                                     <label>Value Type</label>
//                                     <div className={Style.ValueTypeWrapper}>
//                                         <div onClick={() => wholeMapDataLoader ? null : setExtraDataState(prev => ({ ...prev, type: "Input" }))} className={extraDataState.type == "Input" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Input</div>
//                                         <div onClick={() => wholeMapDataLoader ? null : setExtraDataState(prev => ({ ...prev, type: "Boolean" }))} className={extraDataState.type == "Boolean" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Boolean</div>
//                                         <div onClick={() => wholeMapDataLoader ? null : setExtraDataState(prev => ({ ...prev, type: "Date" }))} className={extraDataState.type == "Date" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Date</div>
//                                         <div onClick={() => wholeMapDataLoader ? null : setExtraDataState(prev => ({ ...prev, type: "Color" }))} className={extraDataState.type == "Color" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Color</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Col>

//                         <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
//                             <div className={Style.FeildCol} style={{ marginTop: 16 }}>
//                                 <div className={Style.ResetterIcon}>
//                                     <label>Select location type</label>
//                                     <label onClick={() => wholeMapDataLoader ? null : setPolygonType([])} className={Style.ResetButton}>Reset</label>
//                                 </div>
//                                 <div>
//                                     <Checkbox disabled={wholeMapDataLoader} onClick={() => AddTypeKey("Polyline")} checked={polygonType.includes('Polyline') ? true : false} defaultChecked={false}>Polyline</Checkbox>
//                                     <Checkbox disabled={wholeMapDataLoader} onClick={() => AddTypeKey("Circle")} checked={polygonType.includes('Circle') ? true : false} defaultChecked={false}>Circle</Checkbox>
//                                     <Checkbox disabled={wholeMapDataLoader} onClick={() => AddTypeKey("Polygon")} checked={polygonType.includes('Polygon') ? true : false} defaultChecked={false}>Polygon</Checkbox>
//                                 </div>
//                             </div>

//                         </Col>


//                         <Col style={{ marginTop: 20 }} xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
//                             <button onClick={handleSubmit(submitParam)} disabled={wholeMapDataLoader} style={{ opacity: wholeMapDataLoader ? 0.4 : 1, cursor: wholeMapDataLoader ? 'no-drop' : 'pointer' }} className={Style.ApplyBtn}>Apply</button>
//                         </Col>
//                         <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
//                             <button onClick={() => RemoveAssetFilter()} disabled={wholeMapDataLoader} style={{ opacity: wholeMapDataLoader ? 0.4 : 1, cursor: wholeMapDataLoader ? 'no-drop' : 'pointer' }} className={Style.CancelBtn}>Remove all filter</button>
//                         </Col>
//                     </Row>

//                 </>
//             </Drawer>

//             {isLoaded ?
//                 <GoogleMap
//                     ref={mapRef}
//                     mapContainerStyle={StyleLocation}
//                     center={searchLocation}
//                     onLoad={onMapLoad}
//                     zoom={12}
//                     options={{
//                         keyboardShortcuts: false,
//                         minZoom: 2,
//                         mapTypeControl: false,
//                         mapTypeId: "satellite",
//                         cameraControl: false,
//                         clickableIcons: false,
//                         streetViewControl: false,
//                         fullscreenControl: false,
//                         tilt: false,
//                         tiltInteractionEnabled: false
//                     }}
//                 >

//                     {isLoadingData || worksiteLoading ?
//                         <div className={Style.NoWorksiteContainer}>
//                             <h2>{loadingTitle ?? "Loading"}</h2>
//                             <h6>{loadingPara ?? "Loading please wait."}</h6>
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                                 <div className={Style.LoadingSlide}>
//                                     <div style={{ width: `${progress}%` }} className={Style.loadinInSlide}></div>
//                                 </div>
//                             </div>
//                         </div>
//                         :
//                         <>
//                             <MarkerClustererF
//                                 onLoad={(marker) => {
//                                     markerDataMap.current.set(marker, items);
//                                 }}
//                                 onUnmount={(marker) => {
//                                     markerDataMap.current.delete(marker);
//                                 }}
//                                 minimumClusterSize={2}
//                                 onClick={(cluster) => {
//                                     const markers = cluster?.getMarkers?.() || [];
//                                     const clusterItems = markers
//                                         .map(marker => marker?.customData)
//                                         .filter(Boolean);

//                                     if (!clusterItems.length) return;
//                                     setClusterListData(clusterItems);
//                                     setClusterListPopup(true);
//                                 }}
//                                 options={{
//                                     maxZoom: 18,
//                                     zoomOnClick: false,
//                                     styles: [
//                                         {
//                                             url: Cluster_Icon,
//                                             height: 40,
//                                             width: 40,
//                                             textColor: "white",
//                                             textSize: 10,
//                                             zIndex: 9999,
//                                         },
//                                         {
//                                             url: Cluster_Icon,
//                                             height: 50,
//                                             width: 50,
//                                             textColor: "white",
//                                             textSize: 12,
//                                             zIndex: 9999
//                                         },
//                                         {
//                                             url: Cluster_Icon,
//                                             height: 60,
//                                             width: 60,
//                                             textColor: "white",
//                                             textSize: 14,
//                                             zIndex: 9999
//                                         },
//                                         {
//                                             url: Cluster_Icon,
//                                             height: 70,
//                                             width: 70,
//                                             textColor: "white",
//                                             textSize: 16,
//                                             zIndex: 9999
//                                         },
//                                         {
//                                             url: Cluster_Icon,
//                                             height: 80,
//                                             width: 80,
//                                             textColor: "white",
//                                             textSize: 18,
//                                             zIndex: 9999
//                                         },
//                                     ],
//                                 }}>
//                                 {(clusterer) =>
//                                     items?.map((item, i) => {
//                                         return (
//                                             <React.Fragment key={i}>
//                                                 <>
//                                                     <MarkerF
//                                                         key={item?._id}
//                                                         position={item?.center}
//                                                         clusterer={clusterer}
//                                                         icon={{
//                                                             url: item.icon,
//                                                             ...(window.google && {
//                                                                 scaledSize: new window.google.maps.Size(item?.type == "Muster" ? 68 : 60, item?.type == "Muster" ? 80 : 60),
//                                                             }),
//                                                         }}
//                                                         zIndex={(window.google?.maps?.Marker?.MAX_ZINDEX || 1000) + 1}
//                                                         onLoad={(marker) => {
//                                                             marker.customData = item;
//                                                         }}
//                                                         onClick={() => showLocationModal(item.type, item?._id)}
//                                                     />
//                                                 </>
//                                             </React.Fragment>
//                                         );
//                                     })
//                                 }
//                             </MarkerClustererF>


//                             {/* Polygon */}
//                             {pointsP?.map((polygonPoints = [], index) => {
//                                 return (
//                                     <React.Fragment key={`polygon-${index}`}>
//                                         {polygonPoints?.type ?
//                                             <Polygon
//                                                 path={[...polygonPoints?.points, polygonPoints?.points[0]]}
//                                                 options={{
//                                                     fillColor: polygonPoints?.type == "HAZARD" ? "#D32029" : polygonPoints?.type == "WEATHER" ? "#129154" : polygonPoints?.type == "COMMUNICATION" ? "#F4B740" : polygonPoints?.type == "SECURITY" ? "#016483" : "#ff3030",
//                                                     fillOpacity: 0.5,
//                                                     strokeWeight: 0,
//                                                     zIndex: 999
//                                                 }}
//                                                 onClick={() => showLocationModal(polygonPoints?.polyType, polygonPoints?.cId)}
//                                             />
//                                             :
//                                             <Polygon
//                                                 path={[...polygonPoints?.points, polygonPoints?.points[0]]}
//                                                 options={{
//                                                     fillColor: polygonPoints?.polyType == "WorkOrder" ? "#52524b" : polygonPoints?.polyType == "POI" ? "#214CBC" : polygonPoints?.polyType == "Asset" ? "#082625" : polygonPoints?.polyType == "Project" ? "#09482A" : polygonPoints?.polyType == "Muster" ? "#548F1C" : "#ff3030",
//                                                     fillOpacity: 0.5,
//                                                     strokeWeight: 0,
//                                                     zIndex: 999
//                                                 }}
//                                                 onClick={() => showLocationModal(polygonPoints?.polyType, polygonPoints?.cId)}
//                                             />
//                                         }

//                                         {polygonPoints?.type ?
//                                             <Polygon
//                                                 path={getSafetyZonePathP(polygonPoints?.points, polygonPoints?.safetyZone)}
//                                                 options={{
//                                                     zIndex: 999,
//                                                     fillColor: polygonPoints?.type == "HAZARD" ? "#D32029" : polygonPoints?.type == "WEATHER" ? "#129154" : polygonPoints?.type == "COMMUNICATION" ? "#F4B740" : polygonPoints?.type == "SECURITY" ? "#016483" : "#ff3030",
//                                                     fillOpacity: 0.2,
//                                                     strokeWeight: 0,
//                                                 }}
//                                                 onClick={() => showLocationModal(polygonPoints?.polyType, polygonPoints?.cId)}
//                                             />
//                                             :
//                                             <Polygon
//                                                 path={getSafetyZonePathP(polygonPoints?.points, polygonPoints?.safetyZone)}
//                                                 options={{
//                                                     zIndex: 999,
//                                                     fillColor: polygonPoints?.polyType == "WorkOrder" ? "#52524b" : polygonPoints?.polyType == "POI" ? "#214CBC" : polygonPoints?.polyType == "Asset" ? "#082625" : polygonPoints?.polyType == "Project" ? "#09482A" : polygonPoints?.polyType == "Muster" ? "#548F1C" : "#ff3030",
//                                                     fillOpacity: 0.2,
//                                                     strokeWeight: 0,
//                                                 }}
//                                                 onClick={() => showLocationModal(polygonPoints?.polyType, polygonPoints?.cId)}
//                                             />
//                                         }
//                                     </React.Fragment>
//                                 );
//                             })}
//                             {/* Polygon */}



//                             {/* Polyline */}
//                             {polylineList?.map((poly, polyIndex) => {
//                                 return (
//                                     <React.Fragment key={poly.id}>
//                                         {poly?.mainType ?
//                                             <>
//                                                 {poly?.safetyZone.length > 0 && (
//                                                     <Polygon
//                                                         path={poly?.safetyZone}
//                                                         options={{
//                                                             zIndex: 999,
//                                                             fillColor: poly?.mainType == "HAZARD" ? "#D32029" : poly?.mainType == "WEATHER" ? "#129154" : poly?.mainType == "COMMUNICATION" ? "#F4B740" : poly?.mainType == "SECURITY" ? "#016483" : "#ff3030",
//                                                             fillOpacity: 0.2,
//                                                             strokeWeight: 0,
//                                                         }}
//                                                         onClick={() => showLocationModal(poly?.type, poly?.cId)}
//                                                     />
//                                                 )}
//                                             </>
//                                             :
//                                             <>
//                                                 {poly?.safetyZone.length > 0 && (
//                                                     <Polygon
//                                                         path={poly?.safetyZone}
//                                                         options={{
//                                                             zIndex: 999,
//                                                             fillColor: poly?.type == "WorkOrder" ? "#52524b" : poly?.type == "POI" ? "#214CBC" : poly?.type == "Asset" ? "#082625" : poly?.type == "Project" ? "#09482A" : "#ff3030",
//                                                             fillOpacity: 0.2,
//                                                             strokeWeight: 0,
//                                                         }}
//                                                         onClick={() => showLocationModal(poly?.type, poly?.cId)}
//                                                     />
//                                                 )}
//                                             </>
//                                         }
//                                         {poly?.mainType ?
//                                             <>
//                                                 {poly?.band.length > 0 && (
//                                                     <Polygon
//                                                         path={poly?.band}
//                                                         options={{
//                                                             zIndex: 999,
//                                                             fillColor: poly?.mainType == "HAZARD" ? "#D32029" : poly?.mainType == "WEATHER" ? "#129154" : poly?.mainType == "COMMUNICATION" ? "#F4B740" : poly?.mainType == "SECURITY" ? "#016483" : "#ff3030",
//                                                             fillOpacity: 0.5,
//                                                             strokeWeight: 0,
//                                                         }}
//                                                         onClick={() => showLocationModal(poly?.type, poly?.cId)}
//                                                     />
//                                                 )}
//                                             </>
//                                             :
//                                             <>
//                                                 {poly?.band.length > 0 && (
//                                                     <Polygon
//                                                         path={poly?.band}
//                                                         options={{
//                                                             zIndex: 999,
//                                                             fillColor: poly?.type == "WorkOrder" ? "#52524b" : poly?.type == "POI" ? "#214CBC" : poly?.type == "Asset" ? "#082625" : poly?.type == "Project" ? "#09482A" : "#ff3030",
//                                                             fillOpacity: 0.5,
//                                                             strokeWeight: 0,
//                                                         }}
//                                                         onClick={() => showLocationModal(poly?.type, poly?.cId)}
//                                                     />
//                                                 )}
//                                             </>
//                                         }
//                                     </React.Fragment>
//                                 )
//                             })}
//                             {/* Polyline */}




//                             {!locationToggle && (
//                                 <div className={Style.OverMapFalse}>
//                                     <p>Permission denied. Please allow location access in your browser or device settings.</p>
//                                 </div>
//                             )}

//                             {/* Recenter Button */}
//                             {workSiteMarker &&
//                                 <div className={Style.PolyCenter3}>
//                                     <Tooltip title="Move to worksite" placement="leftTop">
//                                         <div onClick={!locationToggle ? requestLocationAgain : handleCenterWorksite} className={Style.PolyDot1}>
//                                             <img src={workSiteCenter} />
//                                         </div>
//                                     </Tooltip>
//                                 </div>
//                             }

//                             <div className={Style.PolyCenter1}>
//                                 <Tooltip title="Move to current location" placement="leftTop">
//                                     <div onClick={!locationToggle ? requestLocationAgain : handleRecenter} className={Style.PolyDot}>
//                                         <MdOutlineLocationSearching size={20} color="#666d80" />
//                                     </div>
//                                 </Tooltip>
//                             </div>
//                             <div className={Style.PolyCenter}>
//                                 <Tooltip title={fullScreen ? "Exit full screen" : "Full screen"} placement="leftTop">
//                                     <div onClick={() => setFullScreen(!fullScreen)} className={Style.PolyDot}>
//                                         {!fullScreen ?
//                                             <RiFullscreenFill size={20} color="#666d80" />
//                                             :
//                                             <BsFullscreenExit size={20} color="#666d80" />
//                                         }
//                                     </div>
//                                 </Tooltip>
//                             </div>



//                             {/* Work Site Polygon */}
//                             {pointsWorkSite.length >= 1 && (
//                                 <Polygon
//                                     onClick={showDrawerDr}
//                                     path={[...pointsWorkSite, pointsWorkSite[0]]}
//                                     options={{
//                                         fillColor: '#0d1e4b',
//                                         fillOpacity: 0.4,
//                                         strokeWeight: 0,
//                                         zIndex: 10
//                                     }}
//                                 />
//                             )}

//                             {/* Work Site Polyline */}
//                             {pointsMoreWorkSite.length >= 2 && (
//                                 <Polyline
//                                     path={pointsMoreWorkSite}
//                                     onClick={showDrawerDr}
//                                     options={{
//                                         strokeColor: '#070F26',
//                                         strokeOpacity: 1,
//                                         strokeWeight: 1,
//                                         zIndex: 10
//                                     }}
//                                 />
//                             )}

//                             <div className={Style.searchLocationInput}>
//                                 <GooglePlacesAutocomplete
//                                     apiKey="AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY"
//                                     autocompletionRequest={{
//                                         componentRestrictions: {
//                                             country: ['us'],
//                                         },
//                                     }}
//                                     selectProps={{
//                                         className: "NewSearchInputMapaa",
//                                         placeholder: 'Search Location',
//                                         onChange: locationDataFunc,
//                                         isClearable: true,
//                                         value: value1,
//                                         styles: customStyles
//                                     }}
//                                     debounce={400}
//                                     minLengthAutocomplete={2}
//                                 />
//                                 <Select
//                                     mode="multiple"
//                                     allowClear
//                                     style={{ maxWidth: "50%", marginLeft: 10 }}
//                                     placeholder="Please select"
//                                     onChange={setFilterValueMap}
//                                     options={optionsFilter}
//                                     showSearch={false}
//                                 />
//                                 {workSiteMarker &&
//                                     <div onClick={onShowAssetsDrawer} className={Style.AssetsFilterIcon}>
//                                         <MdFilterList size={24} color="#797979" />
//                                     </div>
//                                 }
//                             </div>
//                             <Marker
//                                 position={locationCurrent}
//                                 icon={{
//                                     url: myLocationMarker,
//                                     scaledSize: new window.google.maps.Size(40, 48),
//                                 }}
//                                 zIndex={10}
//                             />
//                         </>
//                     }
//                 </GoogleMap>
//                 :
//                 <div style={{ minHeight: "300px", width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <Spin></Spin>
//                 </div>
//             }

//         </>
//     )
// }


// export default DashboardMap 
































































































import { Circle, GoogleMap, InfoWindow, Marker, MarkerClustererF, MarkerF, Polygon, PolygonF, Polyline, useJsApiLoader } from "@react-google-maps/api";
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
import { Checkbox, Col, Drawer, Input, Modal, Progress, Row, Select, Space, Spin, Tag, Tooltip } from "antd";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { MdOutlineLocationSearching } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import Cluster_Icon from "../../assets/Cluster_Icon.png"
import ReactTimeAgo from "react-time-ago";
import workSiteCenter from '../../assets/workSiteCenter.svg'

// import workorderIcon from "../../assets/workOrder.png";
// import projectIcon from "../../assets/project.png";
// import assetsIcon from "../../assets/asset.png";
// import poiIcon from "../../assets/poi.png";
import alerttIcon1 from "../../assets/alert.png";
import alerttIcon2 from "../../assets/network.png";
import alerttIcon3 from "../../assets/communication.png";
import alerttIcon4 from "../../assets/security.png";

import workorderIcon1 from "../../assets/icons/screens/workorder.svg";
import projectIcon1 from "../../assets/icons/screens/project.svg";
import assetsIcon1 from "../../assets/icons/screens/asset.svg";
import poiIcon1 from "../../assets/icons/screens/poi.svg";
// import alerttIcon1 from "../../assets/icons/screens/alert.svg";




import DashboardIcon1 from '../../assets/icons/mapIcon/map1.png'
import DashboardIcon2 from '../../assets/icons/mapIcon/map2.png'
import DashboardIcon3 from '../../assets/icons/mapIcon/map3.png'
import DashboardIcon4 from '../../assets/icons/mapIcon/map4.png'
import DashboardIcon5 from '../../assets/icons/mapIcon/map5.png'
import DashboardIcon6 from '../../assets/icons/mapIcon/map6.png'
import DashboardIcon7 from '../../assets/icons/mapIcon/map7.png'
import DashboardIcon8 from '../../assets/icons/mapIcon/map8.png'
import DashboardIcon9 from '../../assets/icons/mapIcon/map9.png'
import DashboardIcon10 from '../../assets/icons/mapIcon/map10.png'




import evacuationIcon from '../../assets/evacuation.png'
import { RiFullscreenFill } from "react-icons/ri";
import { BsFullscreenExit } from "react-icons/bs";
import { MdFilterList } from "react-icons/md";
import AddDataSelect from "../../component/addDataSelect";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';


const DashboardMap = ({ LoadMapData, setWholeMapDataLoader, wholeMapDataLoader, MusterByIdMap, WorkSiteGetByIdMap, AssetsReducer, setFullScreen, fullScreen, progress, loadingTitle, loadingPara, isLoadingData, GetMusterStation, WorksiteReducer, WorkPOIGetByIdMap, GetAlertsByIDMap, GetAssetsByIDMap, WorkOrderGetByIdMap, GetProjectByIDMap, messageApi, MapData, PoiReducer, viewWorkOrder, viewAlerts, viewPOIs, viewAssets, viewProject, viewMuster, viewWorkSite }) => {
    const [filterValueMap, setFilterValueMap] = useState([])

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



    const IsPromExp = localStorage.getItem('expireUser')

    useEffect(() => {
        const shouldMap = workSite && !IsPromExp && Array.isArray(musterStation);
        const NewPayload = shouldMap
            ? musterStation.map(dataKK => ({
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
            strokeWeight: 0,
            fillColor: '#548F1C',
            fillOpacity: 0.4,
            draggable: false,
            editable: false,
            zIndex: 999,
            clickable: true,
        });

        // Optional extra icon (CenterIcon)
        new window.google.maps.Marker({
            position: a,
            map: mapRef.current,
            icon: {
                url: evacuationIcon,
                scaledSize: new window.google.maps.Size(68, 80),
            },
        });

        // InfoWindow positioned directly above marker
        const infoWindow = new window.google.maps.InfoWindow({
            content: 
                `
                <div style="
                    padding: 8px;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                ">
                    <p style="margin: 0;">${circle2[index1]}</p>
                </div>
                `
            ,
            disableAutoPan: true,
            headerDisabled: true,
            pixelOffset: new window.google.maps.Size(0, 10), // move window above marker
        });

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
    var StyleLocation = { width: '100%', height: fullScreen ? "100%" : 500, overflow: 'hidden', borderRadius: 8 }

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
            strokeWeight: 0,
            fillColor: '#0d1e4b',
            fillOpacity: 0.4,
            draggable: false,
            editable: false,
        });
        return circle;
    };


    const [workSiteMarker, setWorkSiteMarker] = useState(null)
    const [workSiteMarkerName, setWorkSiteMarkerName] = useState(null)
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
        const latLngs = coords?.map(([lat, lng]) =>
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
                    setWorkSiteMarkerName(PoiReducer?.workSiteData.find(data => data._id == workSite)?.title ?? "")
                    drawWithRadiusBounds(firstLocation, polygons.radius)
                    setWorksiteLoading(false)
                }, 1000);
                setWorksiteLoading(false)
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
                setWorkSiteMarkerName(PoiReducer?.workSiteData.find(data => data._id == workSite)?.title ?? "")
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
                setWorkSiteMarkerName(PoiReducer?.workSiteData.find(data => data._id == workSite)?.title ?? "")
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
        if (mapRef.current) {
            mapRef.current.setZoom(18);
        }
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
            mapRef.current.setZoom(18);
            setValue1(null)
            setSearchLocation(null)
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
                    mapRef.current.setZoom(18);
                    setValue1(null)
                    setSearchLocation(null)
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



    const [workName, setWorkName] = useState("")

    useEffect(() => {
        const init = async () => {
            if (workSite) {
                await LoadWorkSiteData()
                await loadWo()
            }
        }
        init()
    }, [workSite])



    const loadWo = async () => {
        const result = await WorkSiteGetByIdMap(workSite)
        setWorkName(result?._doc?.title || "")
    }

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
        else if (classN == "WorkSite") {
            const result = await WorkSiteGetByIdMap(ID)
            setCurrentPole(result?._doc)
            setSelectedId(ID)
            setSelectedPoint("WorkSite")
        }
        else if (classN == "Muster") {
            const result = await MusterByIdMap(ID)
            setCurrentPole(result)
            setSelectedId(ID)
            setSelectedPoint("Muster")
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



    const optionsFilter = [
        {
            label: 'Assets',
            value: "Asset",
        },
        {
            label: 'Alerts',
            value: "Alert",
        },
        {
            label: 'POIs',
            value: "POI",
        },
        {
            label: 'Projects',
            value: "Project",
        },
        {
            label: 'Work Orders',
            value: "WorkOrder",
        },
    ]



    const allowedTypes = new Set([
        "Muster",
        "WorkSite",
        ...(filterValueMap || [])
    ]);


    const items = useMemo(() => {
        const allPolygons = [
            {
                center: workSiteMarker,
                type: "WorkSite",
                icon: WorkSiteIcon,
                title: workSiteMarkerName,
                _id: workSite
            },
            ...(!IsPromExp
                ? [
                    ...(musterStation || []).map(item => ({
                        ...item,
                        type: "Muster",
                        center: getPolygonCenter(item.polygon),
                        icon: evacuationIcon,
                    })),
                    ...(MapData?.assetsPolygons || []).map(item => ({
                        ...item,
                        type: "Asset",
                        center: getPolygonCenter(item.polygon),
                        icon: assetsImage,
                    })),
                    ...(MapData?.alertsPolygons || []).map(item => ({
                        ...item,
                        type: "Alert",
                        center: getPolygonCenter(item.polygon),
                        icon:
                            item?.alertType === "HAZARD"
                                ? alertsImage1
                                : item?.alertType === "WEATHER"
                                    ? alertsImage2
                                    : item?.alertType === "COMMUNICATION"
                                        ? alertsImage4
                                        : item?.alertType === "SECURITY"
                                            ? alertsImage3
                                            : null,
                        childType: item?.alertType,
                    })),
                    ...(MapData?.reportsPolygons || []).map(item => ({
                        ...item,
                        type: "POI",
                        center: getPolygonCenter(item.polygon),
                        icon: POISImage,
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
                ]
                : []),
        ];

        return allPolygons.filter(({ center, type }) => {
            return (
                center &&
                Number.isFinite(center.lat) &&
                Number.isFinite(center.lng) &&
                (
                    !filterValueMap ||
                    filterValueMap.length === 0 ||
                    allowedTypes.has(type)
                )
            );
        });
    }, [MapData, workSiteMarker, filterValueMap, IsPromExp]);




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
    }, [musterStation])



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
        POI: poiIcon1,
        Alert: currentPole?.alertType == "HAZARD" ? alerttIcon1 : currentPole?.alertType == "WEATHER" ? alerttIcon2 : currentPole?.alertType == "COMMUNICATION" ? alerttIcon3 : currentPole?.alertType == "SECURITY" ? alerttIcon4 : null,
        Asset: assetsIcon1,
        Project: projectIcon1,
        WorkOrder: workorderIcon1,
    };




    const AllIconCenter = {
        POI: DashboardIcon7,
        Alert: currentPole?.alertType == "HAZARD" ? DashboardIcon1 : currentPole?.alertType == "WEATHER" ? DashboardIcon4 : currentPole?.alertType == "COMMUNICATION" ? DashboardIcon6 : currentPole?.alertType == "SECURITY" ? DashboardIcon9 : null,
        Asset: DashboardIcon2,
        Project: DashboardIcon8,
        WorkOrder: DashboardIcon5,
        WorkSite: DashboardIcon3,
        Muster: DashboardIcon10
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




























































    // PolygonComplete
    const [paddingP, setPaddingP] = useState([]);
    const [polyGoneNameP, setPolyGoneNameP] = useState([]);
    const [pointsP, setPointsP] = useState([]);
    const [polyGoneMCenterP, setPolyGoneMCenterP] = useState([]);



    const getSafetyZonePathP = (polygonPoints, offsetMeters) => {
        if (!polygonPoints?.length) return [];

        const center = {
            lat: polygonPoints?.reduce((sum, p) => sum + p.lat, 0) / polygonPoints?.length,
            lng: polygonPoints?.reduce((sum, p) => sum + p.lng, 0) / polygonPoints?.length,
        };

        const padded = polygonPoints?.map((pt) => offsetPointP(pt, center, offsetMeters));
        return [...padded, padded[0]];
    };

    const offsetPointP = (point, center, offsetMeters) => {
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







    // polylineComplete
    const [pointsPolyLine, setPointsPolyLine] = useState([]);
    const [bandPolygon, setBandPolygon] = useState([]);
    const [polylineWidth, setPolylineWidth] = useState(1)
    const [polylineSafety, setPolylineSafety] = useState(0)
    const [polylineElevation, setPolylineElevation] = useState(0)
    const [safetyZonePolyLine, setSafetyZonePolyLine] = useState([]);
    const [polylineList, setPolylineList] = useState([])





    // polyline
    const getCenter2 = (points) => {
        const lat =
            points.reduce((sum, p) => sum + p.lat, 0) / points.length;
        const lng =
            points.reduce((sum, p) => sum + p.lng, 0) / points.length;
        return { lat, lng };
    };
    const movePolyLineToCenter = (points, newCenter) => {
        const currentCenter = getCenter2(points);
        const latDiff = newCenter.lat - currentCenter.lat;
        const lngDiff = newCenter.lng - currentCenter.lng;
        return points.map((p) => ({
            lat: p.lat + latDiff,
            lng: p.lng + lngDiff,
        }));
    };
    const changePolyLinePoint = useCallback((e) => {
        const { lat, lng } = getLatLng(e);
        if (lat == null || lng == null) return;
        const newCenter = {
            lat: lat,
            lng: lng,
        };
        const updated = movePolygonToCenter(pointsPolyLine, newCenter);
        setPointsPolyLine(updated);
    }, [pointsPolyLine]);
    const addPolyLine = useCallback((e) => {
        const { lat, lng } = getLatLng(e);
        if (lat == null || lng == null) return;
        setPointsPolyLine(prev => [...prev, { lat, lng }]);
    }, []);
    const computeOffset = (pointsPolyLine, dist) => {
        const left = [];
        const right = [];

        for (let i = 0; i < pointsPolyLine?.length - 1; i++) {
            const p1 = pointsPolyLine[i];
            const p2 = pointsPolyLine[i + 1];
            const dx = p2.lng - p1.lng;
            const dy = p2.lat - p1.lat;
            const length = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / length;
            const uy = dy / length;
            const px = -uy;
            const py = ux;

            const metersPerLat = 111320;
            const metersPerLng = 111320 * Math.cos((p1.lat * Math.PI) / 180);

            const dLat = (py * dist) / metersPerLat;
            const dLng = (px * dist) / metersPerLng;

            left.push({ lat: p1.lat + dLat, lng: p1.lng + dLng });
            left.push({ lat: p2.lat + dLat, lng: p2.lng + dLng });

            right.push({ lat: p1.lat - dLat, lng: p1.lng - dLng });
            right.push({ lat: p2.lat - dLat, lng: p2.lng - dLng });
        }

        return { left, right };
    };

    useEffect(() => {
        if (pointsPolyLine?.length >= 2) {
            const { left, right } = computeOffset(pointsPolyLine, polylineWidth);
            const band = [...left, ...right.reverse()];
            setBandPolygon(band);
            const { left: sLeft, right: sRight } = computeOffset(
                pointsPolyLine,
                polylineWidth + polylineSafety
            );
            const safety = [...sLeft, ...sRight.reverse()];
            setSafetyZonePolyLine(safety);
        } else {
            setBandPolygon([]);
            setSafetyZonePolyLine([]);
        }
    }, [pointsPolyLine, polylineWidth, polylineSafety]);

    const removePoyLine = (indexRemover) => {
        setPointsPolyLine(prev => {
            const updated = prev.filter((_, index) => index !== indexRemover);
            if (updated.length < 2) {
                setSafetyZonePolyLine([]);
            }
            return updated;
        });
    };
    // polyline
    // polylineComplete




    const [drawCircleState, setDrawCircleState] = useState([])

    useEffect(() => {
        const NewPayload = Array.isArray(items)
            ? items.map((dataKK) => ({
                title: "",
                polygon: { ...dataKK?.polygon, mainType: dataKK?.alertType, polyType: dataKK?.type, cId: dataKK?._id },
                id: dataKK?._id,
            }))
            : [];
        if (!NewPayload || !Array.isArray(NewPayload)) return;
        const parsedPolygons = NewPayload
            .map((data) => {
                try {
                    return (data?.polygon || {});
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
        const circleData = parsedPolygons.filter((p) => p?.type === "Circle");
        const polygonData = parsedPolygons.filter((p) => p?.type === "Polygon");
        const polylineData = parsedPolygons.filter((p) => p?.type === "Polyline");
        if (circleData?.length > 0) {
            const formattedCircle = circleData?.map((data, index) => {
                return {
                    center: {
                        lat: Number(data?.locations?.[0]?.[0]),
                        lng: Number(data?.locations?.[0]?.[1]),
                    },
                    radius: data?.radius,
                    safetyZone: data?.safetyZone,
                    mainType: data?.mainType,
                    index: index,
                    cId: data?.cId,
                    polyType: data?.polyType,
                    title: circleData.map((line) => JSON.parse(line?.meta).title || "")
                };
            });
            setDrawCircleState(formattedCircle)
        }
        else {
            setDrawCircleState([])
        }
        if (polygonData?.length > 0) {
            setPointsP(
                polygonData.map((poly) => ({
                    safetyZone: poly.safetyZone,
                    type: poly?.mainType,
                    cId: poly?.cId,
                    polyType: poly?.polyType,
                    points: poly?.locations?.map(([lat, lng]) => ({
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    })),
                }))
            );
            setPaddingP(polygonData?.map((poly) => poly?.safetyZone || 0));
            setPolyGoneNameP(polygonData.map((line) => JSON.parse(line?.meta).title || ""))
            setPolyGoneMCenterP(
                polygonData.map((line) => ({
                    lng: line?.longitude,
                    lat: line?.latitude,
                }))
            )
        }
        else {
            setPointsP([])
        }
        if (polylineData.length > 0) {
            const formattedPolylines = polylineData.map((item) => {
                const points = item.locations.map(([lat, lng]) => ({
                    lat: Number(lat),
                    lng: Number(lng),
                }));
                const { left, right } = computeOffset(points, item?.radius);
                const band = [...left, ...right.reverse()];
                const { left: sLeft, right: sRight } = computeOffset(points, item?.radius + item?.safetyZone);
                const safety = [...sLeft, ...sRight.reverse()];
                return {
                    id: item._id,
                    cId: item?.cId,
                    elevation: Number(item.altitude || 0),
                    type: item?.polyType,
                    mainType: item?.mainType,
                    band,
                    safetyZone: safety,
                    points,
                };
            });
            setPolylineList(formattedPolylines);
        }
        else {
            setPolylineList([])
        }

        return () => {
            setPointsP([]);
            setPointsMoreM([]);
            setPaddingP([]);
            setPolyGoneNameP([]);
            setOffsetPolygonM([]);
        }
    }, [items, MapData, workSiteMarker, filterValueMap, IsPromExp])














    const circleRefs = useRef([]);
    const circleChiledRefs = useRef([]);


    useEffect(() => {
        circleRefs.current.forEach(c => c.setMap(null));
        circleRefs.current = [];
        circleChiledRefs.current.forEach(c => c.setMap(null));
        circleChiledRefs.current = [];
        const filtered = drawCircleState?.filter(data =>
            !filterValueMap || filterValueMap.length === 0 || filterValueMap.includes(data?.polyType)
        )
        filtered?.forEach(poly => {
            const circle = new google.maps.Circle({
                map: mapRef.current,
                center: poly.center,
                radius: poly.radius,
                strokeOpacity: 0.8,
                strokeWeight: 0,
                fillColor:
                    poly.polyType === "WorkOrder" ? "#52524b" :
                        poly.polyType === "POI" ? "#214CBC" :
                            poly.polyType === "Asset" ? "#082625" :
                                poly.polyType === "Project" ? "#09482A" :
                                    poly.polyType === "Muster" ? "#548F1C" :
                                        poly.polyType === "Alert" ? poly?.mainType == "HAZARD" ? "#D32029" : poly?.mainType == "WEATHER" ? "#129154" : poly?.mainType == "COMMUNICATION" ? "#F4B740" : poly?.mainType == "SECURITY" ? "#016483" : "#ff3030" :
                                            "#ff3030",
                fillOpacity: poly?.polyType === "Muster" ? 0 : 0.2,
                zIndex: 100,
                clickable: true,
            });
            const circleChild = new google.maps.Circle({
                map: mapRef.current,
                center: poly.center,
                radius: poly.radius + poly.safetyZone,
                strokeOpacity: 0.8,
                strokeWeight: 0,
                fillColor:
                    poly.polyType === "WorkOrder" ? "#52524b" :
                        poly.polyType === "POI" ? "#214CBC" :
                            poly.polyType === "Asset" ? "#082625" :
                                poly.polyType === "Project" ? "#09482A" :
                                    poly.polyType === "Muster" ? "#548F1C" :
                                        poly.polyType === "Alert" ? poly?.mainType == "HAZARD" ? "#D32029" : poly?.mainType == "WEATHER" ? "#129154" : poly?.mainType == "COMMUNICATION" ? "#F4B740" : poly?.mainType == "SECURITY" ? "#016483" : "#ff3030" :
                                            "#ff3030",
                fillOpacity: poly?.polyType === "Muster" ? 0 : 0.2,
                zIndex: 100,
                clickable: true,
            });
            circleChild.addListener("click", (event) => {
                showLocationModal(poly?.polyType, poly?.cId)
            });
            circleRefs.current.push(circle);
            circleChiledRefs.current.push(circleChild);
        });
    }, [drawCircleState, filterValueMap]);


    const [assetsFilter, setAssteFilter] = useState(false);
    const onShowAssetsDrawer = useCallback(() => {
        setAssteFilter(true);
    }, []);
    const onCloseAssetsDrawer = useCallback(() => {
        setAssteFilter(false);
    }, []);





    // department
    const [newDepartment, setNewDepartment] = useState([]);
    const depatmentData = AssetsReducer?.departmentData?.map(data => ({
        value: data.name,
        label: data.name,
    }));
    const CreateDepartmentEx = async (valueToAdd) => {
        const trimmedSearch = valueToAdd?.trim();
        if (!trimmedSearch) return;
        setNewDepartment(prev => [
            { value: trimmedSearch, label: trimmedSearch },
            ...prev,
        ]);
    };



    // Model
    const [newModel, setNewModel] = useState([]);
    const modelData = AssetsReducer?.modelData?.map(data => ({
        value: data.name,
        label: data.name,
    }));
    const CreateModelEx = async (valueToAdd) => {
        const trimmedSearch = valueToAdd?.trim();
        if (!trimmedSearch) return;
        setNewModel(prev => [
            { value: trimmedSearch, label: trimmedSearch },
            ...prev,
        ]);
    };



    // Asset Type
    const [newAssetType, setNewAssetType] = useState([]);
    const assetTypeData = AssetsReducer?.assetTypeData?.map(data => ({
        value: data.name,
        label: data.name,
    }));
    const CreatesetNewAssetTypeEx = async (valueToAdd) => {
        const trimmedSearch = valueToAdd?.trim();
        if (!trimmedSearch) return;
        setNewAssetType(prev => [
            { value: trimmedSearch, label: trimmedSearch },
            ...prev,
        ]);
    };


    const schema = yup.object().shape({
        assetType: yup.string().notRequired(),
        department: yup.string().notRequired(),
        model: yup.string().notRequired(),
    });
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        getValues,
        watch,
        reset,
        resetField
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            assetType: '',
            department: '',
            model: '',
        },
    });



    const [polygonType, setPolygonType] = useState([]);
    const AddTypeKey = (UpperParams) => {
        setPolygonType((prev) => {
            if (prev.includes(UpperParams)) {
                return prev.filter(item => item !== UpperParams);
            } else {
                return [...prev, UpperParams];
            }
        });
    };

    const markerDataMap = useRef(new Map());

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1500);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const customStyles = {
        control: (base) => ({
            ...base,
            minHeight: isMobile ? "40px" : "48px",
            height: isMobile ? "40px" : "48px",
            borderRadius: '8px'
        }),
        valueContainer: (base) => ({
            ...base,
            height: isMobile ? "40px" : "48px",
            padding: isMobile ? "0 6px" : "0 8px",
            borderRadius: '8px'
        }),
        indicatorsContainer: (base) => ({
            ...base,
            height: isMobile ? "40px" : "48px",
            borderRadius: '8px'
        }),
    };


    const [submitAfterFilterReset, setSubmitAfterFilterReset] = useState(false);

    const RemoveAssetFilter = () => {
        reset()
        setPolygonType([])
        setExtraDataState({
            name: '',
            type: '',
        })
        setSubmitAfterFilterReset(true)
    }




    // Extra Data


    const [extraDataState, setExtraDataState] = useState({
        name: '',
        type: '',
    });







    const getAssetParams = useCallback((data) => {
        const params = new URLSearchParams();
        if (data?.name) {
            params.append("extraFieldName", data?.name.toLowerCase());
        }
        if (data?.type) {
            params.append("extraFieldType", data?.type.toLowerCase());
        }
        if (data?.polygonType?.length) {
            data?.polygonType.forEach((e) => {
                params.append(
                    "polygon_type[]", (e || "").replace(/\b\w/g, (c) => c.toUpperCase())
                );
            });
        }
        if (data?.department) {
            params.append("departmentName", data?.department.toLowerCase());
        }
        if (data?.assetType) {
            params.append("title", data?.assetType?.toLowerCase());
        }
        if (data?.model) {
            params.append("modelName", data?.model.toLowerCase());
        }

        return params.toString();
    }, []);



    const submitParam = useCallback(async (data) => {
        setWholeMapDataLoader(true)
        const mergedData = { ...data, ...extraDataState, ...{ polygonType: polygonType } }
        const retu = await getAssetParams(mergedData)
        LoadMapData(retu, onCloseAssetsDrawer)
        setAssteFilter(false)
        const drawerBody = document.querySelector(".ant-drawer-body");
        if (drawerBody) {
            drawerBody.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [LoadMapData, extraDataState, getAssetParams, onCloseAssetsDrawer, polygonType, setWholeMapDataLoader])

    useEffect(() => {
        if (!submitAfterFilterReset) return;

        handleSubmit(submitParam)()
        onCloseAssetsDrawer()
        setSubmitAfterFilterReset(false)
    }, [submitAfterFilterReset, handleSubmit, submitParam, onCloseAssetsDrawer])



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
                        return (
                            <div style={{ width: "100%", paddingTop: 15 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginLeft: 10, width: "100%" }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "100%" }}>
                                            <div>
                                                {data?.type == "WorkSite" ?
                                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 600, width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{data?.title}</p>
                                                    :
                                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 600, width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{JSON.parse(data?.polygon?.meta || "{}")?.title}</p>
                                                }
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#919191', width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{data?.type}</p>
                                            </div>
                                            <div onClick={() => data?.type == "Asset" ? viewAssets(data?._id) : data?.type == "Alert" ? viewAlerts(data?._id) : data?.type == "POI" ? viewPOIs(data?._id) : data?.type == "WorkOrder" ? viewWorkOrder(data?._id) : data?.type == "Project" ? viewProject(data?._id) : data?.type == "Muster" ? viewMuster(data?._id) : data?.type == "WorkSite" ? viewWorkSite() : null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#214CBC', cursor: 'pointer' }}>View Detail <MdKeyboardArrowRight color="#214CBC" size={20} /></div>
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
                    </div>
                    :
                    <div style={{ width: "100%", paddingTop: 15 }}>
                        <div className={Style.NameContainer}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={Style.ContainIcon}>
                                    <img src={AllIconCenter[selectedPoint]} alt="Icon" />
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
                                        <Tag style={{ color: currentPole?.riskLevel == "No Threat" ? "#666d80" : currentPole?.riskLevel == "Lowest" ? "#17736E" : currentPole?.riskLevel == "Moderate" ? '#926E26' : currentPole?.riskLevel == "High" ? '#D32029' : currentPole?.riskLevel == "Extreme" ? '#7F1319' : null }} color={currentPole?.riskLevel == "No Threat" ? "rgba(102, 109, 128,0.1)" : currentPole?.riskLevel == "Lowest" ? "rgba(23, 115, 110,0.1)" : currentPole?.riskLevel == "Moderate" ? 'rgba(146, 110, 38,0.1)' : currentPole?.riskLevel == "High" ? 'rgba(211, 32, 41,0.1)' : currentPole?.riskLevel == "Extreme" ? 'rgba(127, 19, 25,0.1)' : null}>
                                            {currentPole?.riskLevel === "No Threat" ? "No Risk" : currentPole?.riskLevel === "Lowest" ? "Lowest Risk" : currentPole?.riskLevel === "Moderate" ? "Moderate Risk" : currentPole?.riskLevel === "High" ? "High Risk" : currentPole?.riskLevel === "Extreme" ? "Extreme Risk" : currentPole?.riskLevel}
                                        </Tag>
                                }
                            </div>
                        </div>
                        {!Array.isArray(currentPole?.teams) &&
                            <div className={Style.NameContainer}>
                                <h3 style={{ marginBottom: 0, marginTop: 25 }}>Worksite:</h3>
                                <p style={{ marginBottom: 0, marginTop: 25 }}>{workName}</p>
                            </div>
                        }
                        <div className={Style.NameContainer}>
                            <h3 style={{ margin: 0, marginTop: Array.isArray(currentPole?.teams) ? 25 : 5 }}>Elevation:</h3>
                            <p style={{ margin: 0, marginTop: 5 }}>{currentPole?.polygon?.altitude} m</p>
                        </div>
                        <div className={Style.NameContainer}>
                            <h3 style={{ margin: 0, marginTop: 5 }}>Area:</h3>
                            <p style={{ margin: 0, marginTop: 5 }}>{Math.round(Number(currentPole?.polygon?.radius || 0))} m</p>
                        </div>
                        <div style={{ marginTop: 20 }} className={Style.NameContainer}>
                            <div onClick={() => selectedPoint == "Asset" ? viewAssets(selectedId) : selectedPoint == "Alert" ? viewAlerts(selectedId) : selectedPoint == "POI" ? viewPOIs(selectedId) : selectedPoint == "WorkOrder" ? viewWorkOrder(selectedId) : selectedPoint == "Project" ? viewProject(selectedId) : selectedPoint == "Muster" ? viewMuster(selectedId) : selectedPoint == "WorkSite" ? viewWorkSite() : null} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#214CBC', cursor: 'pointer' }}>View Detail <MdKeyboardArrowRight color="#214CBC" size={20} /></div>
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
                    const drawerBody = document.querySelector(".ant-drawer-body");
                    if (drawerBody) {
                        drawerBody.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                    }
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

            <Drawer
                title={"Asstes Filter"}
                onClose={onCloseAssetsDrawer}
                open={assetsFilter}
                height={'100%'}
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
            >
                <>
                    <Row>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <div className={Style.ResetterIcon}>
                                    <label>Assets type</label>
                                    <label
                                        onClick={() => resetField("assetType")}
                                        className={Style.ResetButton}>Reset</label>
                                </div>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <AddDataSelect adding={false} name={"assetType"} loading={AssetsReducer?.assetTypeLoading} disable={wholeMapDataLoader} addNewValue={CreatesetNewAssetTypeEx} setValue={onChange} value={value} optionData={assetTypeData} />
                                        </>
                                    )}
                                    name="assetType"
                                />
                            </div>
                        </Col>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <div className={Style.ResetterIcon}>
                                    <label>Department</label>
                                    <label
                                        onClick={() => resetField("department")}
                                        className={Style.ResetButton}>Reset</label>
                                </div>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <AddDataSelect adding={false} name={"department"} loading={AssetsReducer?.departmentLoading} disable={wholeMapDataLoader} addNewValue={CreateDepartmentEx} setValue={onChange} value={value} optionData={depatmentData} />
                                        </>
                                    )}
                                    name="department"
                                />
                            </div>
                        </Col>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <div className={Style.ResetterIcon}>
                                    <label>Model</label>
                                    <label
                                        onClick={() => resetField("model")}
                                        className={Style.ResetButton}>Reset</label>
                                </div>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <AddDataSelect adding={false} name={"model"} loading={AssetsReducer?.modelLoading} disable={wholeMapDataLoader} addNewValue={CreateModelEx} setValue={onChange} value={value} optionData={modelData} />
                                        </>
                                    )}
                                    name="model"
                                />
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <div>
                                    <div className={Style.ResetterIcon}>
                                        <label>Extra Data</label>
                                        <label
                                            onClick={() => wholeMapDataLoader ? null : setExtraDataState({
                                                name: '',
                                                type: '',
                                            })}
                                            className={Style.ResetButton}>Reset</label>
                                    </div>
                                    <Input value={extraDataState.name} disabled={wholeMapDataLoader} onChange={(e) => setExtraDataState(prev => ({ type: e.target.value == "" ? "" : prev.type == "" ? "Input" : prev.type, name: e.target.value }))} placeholder='Enter name' />
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <label>Value Type</label>
                                    <div className={Style.ValueTypeWrapper}>
                                        <div onClick={() => wholeMapDataLoader ? null : setExtraDataState(prev => ({ ...prev, type: "Input" }))} className={extraDataState.type == "Input" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Input</div>
                                        <div onClick={() => wholeMapDataLoader ? null : setExtraDataState(prev => ({ ...prev, type: "Boolean" }))} className={extraDataState.type == "Boolean" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Boolean</div>
                                        <div onClick={() => wholeMapDataLoader ? null : setExtraDataState(prev => ({ ...prev, type: "Date" }))} className={extraDataState.type == "Date" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Date</div>
                                        <div onClick={() => wholeMapDataLoader ? null : setExtraDataState(prev => ({ ...prev, type: "Color" }))} className={extraDataState.type == "Color" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Color</div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label>Select location type</label>
                                    <label onClick={() => wholeMapDataLoader ? null : setPolygonType([])} className={Style.ResetButton}>Reset</label>
                                </div>
                                <div>
                                    <Checkbox disabled={wholeMapDataLoader} onClick={() => AddTypeKey("Polygon")} checked={polygonType.includes('Polygon') ? true : false} defaultChecked={false}>Polygon</Checkbox>
                                    <Checkbox disabled={wholeMapDataLoader} onClick={() => AddTypeKey("Polyline")} checked={polygonType.includes('Polyline') ? true : false} defaultChecked={false}>Polyline</Checkbox>
                                    <Checkbox disabled={wholeMapDataLoader} onClick={() => AddTypeKey("Circle")} checked={polygonType.includes('Circle') ? true : false} defaultChecked={false}>Circle</Checkbox>
                                </div>
                            </div>

                        </Col>


                        <Col style={{ marginTop: 20 }} xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <button onClick={handleSubmit(submitParam)} disabled={wholeMapDataLoader} style={{ opacity: wholeMapDataLoader ? 0.4 : 1, cursor: wholeMapDataLoader ? 'no-drop' : 'pointer' }} className={Style.ApplyBtn}>Apply</button>
                        </Col>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <button onClick={() => RemoveAssetFilter()} disabled={wholeMapDataLoader} style={{ opacity: wholeMapDataLoader ? 0.4 : 1, cursor: wholeMapDataLoader ? 'no-drop' : 'pointer' }} className={Style.CancelBtn}>Remove all filter</button>
                        </Col>
                    </Row>

                </>
            </Drawer>

            {isLoaded ?
                <GoogleMap
                    ref={mapRef}
                    mapContainerStyle={StyleLocation}
                    center={searchLocation}
                    onLoad={onMapLoad}
                    zoom={12}
                    options={{
                        keyboardShortcuts: false,
                        minZoom: 2,
                        mapTypeControl: false,
                        mapTypeId: "satellite",
                        cameraControl: false,
                        clickableIcons: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        tilt: false,
                        tiltInteractionEnabled: false
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
                            </div>
                        </div>
                        :
                        <>
                            <MarkerClustererF
                                onLoad={(marker) => {
                                    markerDataMap.current.set(marker, items);
                                }}
                                onUnmount={(marker) => {
                                    markerDataMap.current.delete(marker);
                                }}
                                minimumClusterSize={2}
                                onClick={(cluster) => {
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
                                    items?.map((item, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <>
                                                    <MarkerF
                                                        key={item?._id}
                                                        position={item?.center}
                                                        clusterer={clusterer}
                                                        icon={{
                                                            url: item.icon,
                                                            ...(window.google && {
                                                                scaledSize: new window.google.maps.Size(item?.type == "Muster" ? 68 : 60, item?.type == "Muster" ? 80 : 60),
                                                            }),
                                                        }}
                                                        zIndex={(window.google?.maps?.Marker?.MAX_ZINDEX || 1000) + 1}
                                                        onLoad={(marker) => {
                                                            marker.customData = item;
                                                        }}
                                                        onClick={() => showLocationModal(item.type, item?._id)}
                                                    />
                                                </>
                                            </React.Fragment>
                                        );
                                    })
                                }
                            </MarkerClustererF>


                            {/* Polygon */}
                            {pointsP?.map((polygonPoints = [], index) => {
                                return (
                                    <React.Fragment key={`polygon-${index}`}>
                                        {polygonPoints?.type ?
                                            <Polygon
                                                path={[...polygonPoints?.points, polygonPoints?.points[0]]}
                                                options={{
                                                    fillColor: polygonPoints?.type == "HAZARD" ? "#D32029" : polygonPoints?.type == "WEATHER" ? "#129154" : polygonPoints?.type == "COMMUNICATION" ? "#F4B740" : polygonPoints?.type == "SECURITY" ? "#016483" : "#ff3030",
                                                    fillOpacity: 0.5,
                                                    strokeWeight: 0,
                                                    zIndex: 999
                                                }}
                                                onClick={() => showLocationModal(polygonPoints?.polyType, polygonPoints?.cId)}
                                            />
                                            :
                                            <Polygon
                                                path={[...polygonPoints?.points, polygonPoints?.points[0]]}
                                                options={{
                                                    fillColor: polygonPoints?.polyType == "WorkOrder" ? "#52524b" : polygonPoints?.polyType == "POI" ? "#214CBC" : polygonPoints?.polyType == "Asset" ? "#082625" : polygonPoints?.polyType == "Project" ? "#09482A" : polygonPoints?.polyType == "Muster" ? "#548F1C" : "#ff3030",
                                                    fillOpacity: 0.5,
                                                    strokeWeight: 0,
                                                    zIndex: 999
                                                }}
                                                onClick={() => showLocationModal(polygonPoints?.polyType, polygonPoints?.cId)}
                                            />
                                        }

                                        {polygonPoints?.type ?
                                            <Polygon
                                                path={getSafetyZonePathP(polygonPoints?.points, polygonPoints?.safetyZone)}
                                                options={{
                                                    zIndex: 999,
                                                    fillColor: polygonPoints?.type == "HAZARD" ? "#D32029" : polygonPoints?.type == "WEATHER" ? "#129154" : polygonPoints?.type == "COMMUNICATION" ? "#F4B740" : polygonPoints?.type == "SECURITY" ? "#016483" : "#ff3030",
                                                    fillOpacity: 0.2,
                                                    strokeWeight: 0,
                                                }}
                                                onClick={() => showLocationModal(polygonPoints?.polyType, polygonPoints?.cId)}
                                            />
                                            :
                                            <Polygon
                                                path={getSafetyZonePathP(polygonPoints?.points, polygonPoints?.safetyZone)}
                                                options={{
                                                    zIndex: 999,
                                                    fillColor: polygonPoints?.polyType == "WorkOrder" ? "#52524b" : polygonPoints?.polyType == "POI" ? "#214CBC" : polygonPoints?.polyType == "Asset" ? "#082625" : polygonPoints?.polyType == "Project" ? "#09482A" : polygonPoints?.polyType == "Muster" ? "#548F1C" : "#ff3030",
                                                    fillOpacity: 0.2,
                                                    strokeWeight: 0,
                                                }}
                                                onClick={() => showLocationModal(polygonPoints?.polyType, polygonPoints?.cId)}
                                            />
                                        }
                                    </React.Fragment>
                                );
                            })}
                            {/* Polygon */}



                            {/* Polyline */}
                            {polylineList?.map((poly, polyIndex) => {
                                return (
                                    <React.Fragment key={poly.id}>
                                        {poly?.mainType ?
                                            <>
                                                {poly?.safetyZone.length > 0 && (
                                                    <Polygon
                                                        path={poly?.safetyZone}
                                                        options={{
                                                            zIndex: 999,
                                                            fillColor: poly?.mainType == "HAZARD" ? "#D32029" : poly?.mainType == "WEATHER" ? "#129154" : poly?.mainType == "COMMUNICATION" ? "#F4B740" : poly?.mainType == "SECURITY" ? "#016483" : "#ff3030",
                                                            fillOpacity: 0.2,
                                                            strokeWeight: 0,
                                                        }}
                                                        onClick={() => showLocationModal(poly?.type, poly?.cId)}
                                                    />
                                                )}
                                            </>
                                            :
                                            <>
                                                {poly?.safetyZone.length > 0 && (
                                                    <Polygon
                                                        path={poly?.safetyZone}
                                                        options={{
                                                            zIndex: 999,
                                                            fillColor: poly?.type == "WorkOrder" ? "#52524b" : poly?.type == "POI" ? "#214CBC" : poly?.type == "Asset" ? "#082625" : poly?.type == "Project" ? "#09482A" : "#ff3030",
                                                            fillOpacity: 0.2,
                                                            strokeWeight: 0,
                                                        }}
                                                        onClick={() => showLocationModal(poly?.type, poly?.cId)}
                                                    />
                                                )}
                                            </>
                                        }
                                        {poly?.mainType ?
                                            <>
                                                {poly?.band.length > 0 && (
                                                    <Polygon
                                                        path={poly?.band}
                                                        options={{
                                                            zIndex: 999,
                                                            fillColor: poly?.mainType == "HAZARD" ? "#D32029" : poly?.mainType == "WEATHER" ? "#129154" : poly?.mainType == "COMMUNICATION" ? "#F4B740" : poly?.mainType == "SECURITY" ? "#016483" : "#ff3030",
                                                            fillOpacity: 0.5,
                                                            strokeWeight: 0,
                                                        }}
                                                        onClick={() => showLocationModal(poly?.type, poly?.cId)}
                                                    />
                                                )}
                                            </>
                                            :
                                            <>
                                                {poly?.band.length > 0 && (
                                                    <Polygon
                                                        path={poly?.band}
                                                        options={{
                                                            zIndex: 999,
                                                            fillColor: poly?.type == "WorkOrder" ? "#52524b" : poly?.type == "POI" ? "#214CBC" : poly?.type == "Asset" ? "#082625" : poly?.type == "Project" ? "#09482A" : "#ff3030",
                                                            fillOpacity: 0.5,
                                                            strokeWeight: 0,
                                                        }}
                                                        onClick={() => showLocationModal(poly?.type, poly?.cId)}
                                                    />
                                                )}
                                            </>
                                        }
                                    </React.Fragment>
                                )
                            })}
                            {/* Polyline */}




                            {!locationToggle && (
                                <div className={Style.OverMapFalse}>
                                    <p>Permission denied. Please allow location access in your browser or device settings.</p>
                                </div>
                            )}

                            {/* Recenter Button */}
                            {workSiteMarker &&
                                <div className={Style.PolyCenter3}>
                                    <Tooltip title="Move to worksite" placement="leftTop">
                                        <div onClick={!locationToggle ? requestLocationAgain : handleCenterWorksite} className={Style.PolyDot1}>
                                            <img src={workSiteCenter} />
                                        </div>
                                    </Tooltip>
                                </div>
                            }

                            <div className={Style.PolyCenter1}>
                                <Tooltip title="Move to current location" placement="leftTop">
                                    <div onClick={!locationToggle ? requestLocationAgain : handleRecenter} className={Style.PolyDot}>
                                        <MdOutlineLocationSearching size={20} color="#666d80" />
                                    </div>
                                </Tooltip>
                            </div>
                            <div className={Style.PolyCenter}>
                                <Tooltip title={fullScreen ? "Exit full screen" : "Full screen"} placement="leftTop">
                                    <div onClick={() => setFullScreen(!fullScreen)} className={Style.PolyDot}>
                                        {!fullScreen ?
                                            <RiFullscreenFill size={20} color="#666d80" />
                                            :
                                            <BsFullscreenExit size={20} color="#666d80" />
                                        }
                                    </div>
                                </Tooltip>
                            </div>



                            {/* Work Site Polygon */}
                            {pointsWorkSite.length >= 1 && (
                                <Polygon
                                    onClick={showDrawerDr}
                                    path={[...pointsWorkSite, pointsWorkSite[0]]}
                                    options={{
                                        fillColor: '#0d1e4b',
                                        fillOpacity: 0.4,
                                        strokeWeight: 0,
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
                                        strokeColor: '#070F26',
                                        strokeOpacity: 1,
                                        strokeWeight: 1,
                                        zIndex: 10
                                    }}
                                />
                            )}

                            <div className={Style.searchLocationInput}>
                                <GooglePlacesAutocomplete
                                    apiKey="AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY"
                                    autocompletionRequest={{
                                        componentRestrictions: {
                                            country: ['us'],
                                        },
                                    }}
                                    selectProps={{
                                        className: "NewSearchInputMapaa",
                                        placeholder: 'Search Location',
                                        onChange: locationDataFunc,
                                        isClearable: true,
                                        value: value1,
                                        styles: customStyles
                                    }}
                                    debounce={400}
                                    minLengthAutocomplete={2}
                                />
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ maxWidth: "50%", marginLeft: 10 }}
                                    placeholder="Please select"
                                    onChange={setFilterValueMap}
                                    options={optionsFilter}
                                    showSearch={false}
                                />
                                {/* {workSiteMarker && */}
                                <div onClick={onShowAssetsDrawer} className={Style.AssetsFilterIcon}>
                                    <MdFilterList size={24} color="#797979" />
                                </div>
                                {/* } */}
                            </div>
                            <Marker
                                position={locationCurrent}
                                icon={{
                                    url: myLocationMarker,
                                    scaledSize: new window.google.maps.Size(40, 48),
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
