// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { Circle, GoogleMap, InfoWindow, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import Style from './googleMap.module.css';
// import Loader from '../loader';
// import { IoEarthOutline, IoMoveSharp } from "react-icons/io5";
// import PolygonIcon from '../../assets/icons/mapIcon/PolygonIcon.png'
// import centerIcon from '../../assets/centerIcon.png'
// import { forwardRef, useImperativeHandle } from 'react';
// import WorkSiteIcon from "../../assets/marker_worksites.png";
// import { TbCurrentLocation } from "react-icons/tb";
// import alertsImage1 from "../../assets/alerts1.png";
// import alertsImage2 from "../../assets/alerts2.png";
// import alertsImage3 from "../../assets/alerts3.png";
// import alertsImage4 from "../../assets/alerts4.png";


// const MapWidget = forwardRef(({
//   mapContainerStyle = { width: '100%', height: '100%' },
//   zoom = 14.5,
//   mapOptions = {},
//   mapKey = 0,
//   value1,
//   setValue1,
//   currectType,
//   centerWorkSite,
//   // CustomArea
//   polygonSafetyZone = 0,
//   // CustomArea





//   // polyline
//   polylineSafetyZone = 0,
//   polylineWidth = 0,
//   setPointsPolyLine,
//   pointsPolyLine,
//   setBandPolygon,
//   bandPolygon,
//   safetyZonePolyLine,
//   setSafetyZonePolyLine,
//   // polyline


//   // Circle
//   circleWidth = 100,
//   circleSafetyZone = 0,
//   mapRefParent,
//   childCircleRef,
//   circleRef,
//   setCircleCenter,
//   circleCenter,
//   // Circle

//   // worksite CustomArea
//   customAreaPoint,
//   polygonPoint,
//   setPolygonPoint,
//   // worksite CustomArea

//   // worksite polyline
//   polylinePoint,
//   // worksite polyline

//   childRefParent,

//   // worksiteLoader
//   workSiteLoader,
//   loadingTitle,
//   loadingPara,
//   loadingMapData,
//   // worksiteLoader
//   isRead = false,
//   isAlert = false,
//   alertType,
//   counter
// }) => {

//   const [ismoveAblePoly, setIsmoveAblePoly] = useState(false)


//   const [center, setCenter] = useState(JSON.parse(localStorage.getItem("cLocation")) || {});
//   const mapRef = useRef(null)


//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
//   });
//   const onMapLoad = useCallback((map) => {
//     mapRef.current = map;
//     mapRefParent.current = map
//   }, []);

//   const getLatLng = (e) => {
//     if (!e) return { lat: null, lng: null };
//     if (typeof e.latLng?.lat === "function") {
//       return { lat: e.latLng.lat(), lng: e.latLng.lng() };
//     }
//     if (e.lat && e.lng) return { lat: e.lat, lng: e.lng };
//     return { lat: null, lng: null };
//   };




//   // CustomArea
//   const getSafetyZonePath = () => {
//     const centerSafey = {
//       lat: polygonPoint.reduce((sum, p) => sum + p.lat, 0) / polygonPoint.length,
//       lng: polygonPoint.reduce((sum, p) => sum + p.lng, 0) / polygonPoint.length,
//     };
//     const padded = polygonPoint.map((pt) => offsetPoint(pt, centerSafey, polygonSafetyZone));
//     return [...padded, padded[0]];
//   };
//   const offsetPoint = (point, centerSafey, offsetMeters) => {
//     const R = 6378137;
//     const dLat = point.lat - centerSafey.lat;
//     const dLng = point.lng - centerSafey.lng;
//     const len = Math.sqrt(dLat * dLat + dLng * dLng);
//     const scale = (len + offsetMeters / R * (180 / Math.PI)) / len;
//     return {
//       lat: centerSafey.lat + dLat * scale,
//       lng: centerSafey.lng + dLng * scale,
//     };
//   };

//   const addPolygonPoint = useCallback((e) => {
//     const { lat, lng } = getLatLng(e);
//     if (lat == null || lng == null) return;
//     setPolygonPoint(prev => [...prev, { lat, lng }]);
//   }, []);

//   const getCenter = (points) => {
//     const lat =
//       points.reduce((sum, p) => sum + p.lat, 0) / points.length;
//     const lng =
//       points.reduce((sum, p) => sum + p.lng, 0) / points.length;
//     return { lat, lng };
//   };

//   const movePolygonToCenter = (points, newCenter) => {
//     const currentCenter = getCenter(points);
//     const latDiff = newCenter.lat - currentCenter.lat;
//     const lngDiff = newCenter.lng - currentCenter.lng;
//     return points.map((p) => ({
//       lat: p.lat + latDiff,
//       lng: p.lng + lngDiff,
//     }));
//   };

//   const changePolygonPoint = useCallback((e) => {
//     const { lat, lng } = getLatLng(e);
//     if (lat == null || lng == null) return;
//     const newCenter = {
//       lat: lat,
//       lng: lng,
//     };
//     const updated = movePolygonToCenter(polygonPoint, newCenter);
//     setPolygonPoint(updated);
//   }, [polygonPoint]);

//   const removeCustomPoint = (indexRemover) => {
//     setPolygonPoint(prev => prev?.filter((_, index) => index !== indexRemover));
//   }
//   // CustomArea






//   // polyline
//   const getCenter2 = (points) => {
//     const lat =
//       points.reduce((sum, p) => sum + p.lat, 0) / points.length;
//     const lng =
//       points.reduce((sum, p) => sum + p.lng, 0) / points.length;
//     return { lat, lng };
//   };

//   const movePolyLineToCenter = (points, newCenter) => {
//     const currentCenter = getCenter2(points);
//     const latDiff = newCenter.lat - currentCenter.lat;
//     const lngDiff = newCenter.lng - currentCenter.lng;
//     return points.map((p) => ({
//       lat: p.lat + latDiff,
//       lng: p.lng + lngDiff,
//     }));
//   };

//   const changePolyLinePoint = useCallback((e) => {
//     const { lat, lng } = getLatLng(e);
//     if (lat == null || lng == null) return;
//     const newCenter = {
//       lat: lat,
//       lng: lng,
//     };
//     const updated = movePolygonToCenter(pointsPolyLine, newCenter);
//     setPointsPolyLine(updated);
//   }, [pointsPolyLine]);

//   const addPolyLine = useCallback((e) => {
//     const { lat, lng } = getLatLng(e);
//     if (lat == null || lng == null) return;
//     setPointsPolyLine(prev => [...prev, { lat, lng }]);
//   }, []);

//   const computeTaperedBand = (points, width) => {
//     if (!points?.length || points.length < 2 || !width) return [];

//     const validPoints = points
//       .map((point) => ({
//         lat: Number(point?.lat),
//         lng: Number(point?.lng),
//       }))
//       .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));

//     if (validPoints.length < 2) return [];

//     const originLat = validPoints.reduce((sum, point) => sum + point.lat, 0) / validPoints.length;
//     const originLng = validPoints.reduce((sum, point) => sum + point.lng, 0) / validPoints.length;
//     const metersPerLat = 111320;
//     const metersPerLng = 111320 * Math.cos((originLat * Math.PI) / 180);

//     const toXY = (point) => ({
//       x: (point.lng - originLng) * metersPerLng,
//       y: (point.lat - originLat) * metersPerLat,
//     });

//     const toLatLng = (point) => ({
//       lat: originLat + point.y / metersPerLat,
//       lng: originLng + point.x / metersPerLng,
//     });

//     const projected = validPoints.map(toXY);
//     const segments = [];

//     for (let i = 0; i < projected.length - 1; i++) {
//       const start = projected[i];
//       const end = projected[i + 1];
//       const dx = end.x - start.x;
//       const dy = end.y - start.y;
//       const length = Math.hypot(dx, dy);

//       if (!length) {
//         segments.push(null);
//         continue;
//       }

//       const ux = dx / length;
//       const uy = dy / length;

//       segments.push({
//         normal: { x: -uy, y: ux },
//       });
//     }

//     const getPointWidth = (index) => {
//       if (projected.length === 2) return width;
//       // even indices (0, 2, 4…) → full width; odd indices (1, 3, 5…) → sharp tip
//       return index % 2 === 0 ? width : 0;
//     };

//     const getFallbackNormal = (index) => {
//       for (let i = index; i < segments.length; i++) {
//         if (segments[i]) return segments[i].normal;
//       }

//       for (let i = index - 1; i >= 0; i--) {
//         if (segments[i]) return segments[i].normal;
//       }

//       return { x: 0, y: 0 };
//     };

//     const getJoinNormal = (index) => {
//       const prev = index > 0 ? segments[index - 1] : null;
//       const next = index < segments.length ? segments[index] : null;

//       if (!prev) return next?.normal ?? getFallbackNormal(index);
//       if (!next) return prev.normal;

//       const mx = prev.normal.x + next.normal.x;
//       const my = prev.normal.y + next.normal.y;
//       const mLength = Math.hypot(mx, my);

//       if (mLength < 0.000001) return next.normal;

//       const miter = {
//         x: mx / mLength,
//         y: my / mLength,
//       };
//       const scale = 1 / Math.max(0.25, Math.abs(miter.x * next.normal.x + miter.y * next.normal.y));

//       return {
//         x: miter.x * scale,
//         y: miter.y * scale,
//       };
//     };

//     const left = [];
//     const right = [];

//     projected.forEach((point, index) => {
//       const pointWidth = getPointWidth(index);

//       if (pointWidth <= 0) {
//         left.push(toLatLng(point));
//         right.push(toLatLng(point));
//         return;
//       }

//       const normal = getJoinNormal(index);
//       const offset = {
//         x: normal.x * pointWidth,
//         y: normal.y * pointWidth,
//       };

//       left.push(toLatLng({ x: point.x + offset.x, y: point.y + offset.y }));
//       right.push(toLatLng({ x: point.x - offset.x, y: point.y - offset.y }));
//     });

//     return [...left, ...right.reverse()];
//   };


//   // const computeTaperedBand = (points, width) => {
//   //   const left = [];
//   //   const right = [];

//   //   for (let i = 0; i < points.length - 1; i++) {
//   //     const p1 = points[i];
//   //     const p2 = points[i + 1];

//   //     const dx = p2.lng - p1.lng;
//   //     const dy = p2.lat - p1.lat;
//   //     const length = Math.sqrt(dx * dx + dy * dy);
//   //     if (!length) continue;

//   //     const ux = dx / length;
//   //     const uy = dy / length;

//   //     const px = -uy;
//   //     const py = ux;

//   //     const metersPerLat = 111320;
//   //     const metersPerLng = 111320 * Math.cos((p1.lat * Math.PI) / 180);

//   //     // 👇 taper logic
//   //     let scaleStart = 1;
//   //     let scaleEnd = 1;

//   //     // first segment → taper start
//   //     if (i === 0 && points.length > 2) {
//   //       scaleStart = 0; // sharp start
//   //     }

//   //     // last segment → taper end
//   //     if (i === points.length - 2 && points.length > 2) {
//   //       scaleEnd = 0; // sharp end
//   //     }

//   //     const dLatStart = (py * width * scaleStart) / metersPerLat;
//   //     const dLngStart = (px * width * scaleStart) / metersPerLng;

//   //     const dLatEnd = (py * width * scaleEnd) / metersPerLat;
//   //     const dLngEnd = (px * width * scaleEnd) / metersPerLng;

//   //     left.push({
//   //       lat: p1.lat + dLatStart,
//   //       lng: p1.lng + dLngStart,
//   //     });

//   //     left.push({
//   //       lat: p2.lat + dLatEnd,
//   //       lng: p2.lng + dLngEnd,
//   //     });

//   //     right.push({
//   //       lat: p1.lat - dLatStart,
//   //       lng: p1.lng - dLngStart,
//   //     });

//   //     right.push({
//   //       lat: p2.lat - dLatEnd,
//   //       lng: p2.lng - dLngEnd,
//   //     });
//   //   }

//   //   return [...left, ...right.reverse()];
//   // };


//   // const computeTaperedBand = (points, width) => {
//   //   const left = [];
//   //   const right = [];

//   //   const n = points.length;

//   //   for (let i = 0; i < n - 1; i++) {
//   //     const p1 = points[i];
//   //     const p2 = points[i + 1];

//   //     const dx = p2.lng - p1.lng;
//   //     const dy = p2.lat - p1.lat;
//   //     const length = Math.sqrt(dx * dx + dy * dy);
//   //     if (!length) continue;

//   //     const ux = dx / length;
//   //     const uy = dy / length;

//   //     const px = -uy;
//   //     const py = ux;

//   //     const metersPerLat = 111320;
//   //     const metersPerLng = 111320 * Math.cos((p1.lat * Math.PI) / 180);

//   //     let scaleStart = 1;
//   //     let scaleEnd = 1;

//   //     if (n > 2) {
//   //       if (i === 1) {
//   //         scaleStart = 0;
//   //       }

//   //       if (i === n - 3) {
//   //         scaleEnd = 0;
//   //       }
//   //     }

//   //     const dLatStart = (py * width * scaleStart) / metersPerLat;
//   //     const dLngStart = (px * width * scaleStart) / metersPerLng;

//   //     const dLatEnd = (py * width * scaleEnd) / metersPerLat;
//   //     const dLngEnd = (px * width * scaleEnd) / metersPerLng;

//   //     left.push({
//   //       lat: p1.lat + dLatStart,
//   //       lng: p1.lng + dLngStart,
//   //     });

//   //     left.push({
//   //       lat: p2.lat + dLatEnd,
//   //       lng: p2.lng + dLngEnd,
//   //     });

//   //     right.push({
//   //       lat: p1.lat - dLatStart,
//   //       lng: p1.lng - dLngStart,
//   //     });

//   //     right.push({
//   //       lat: p2.lat - dLatEnd,
//   //       lng: p2.lng - dLngEnd,
//   //     });
//   //   }

//   //   return [...left, ...right.reverse()];
//   // };

//   // useEffect(() => {
//   //   if (pointsPolyLine?.length >= 2) {
//   //     const band = computeTaperedBand(pointsPolyLine, polylineWidth);
//   //     setBandPolygon(band);

//   //     const safety = computeTaperedBand(
//   //       pointsPolyLine,
//   //       polylineWidth + polylineSafetyZone
//   //     );
//   //     setSafetyZonePolyLine(safety);
//   //   } else {
//   //     setBandPolygon([]);
//   //     setSafetyZonePolyLine([]);
//   //   }
//   // }, [pointsPolyLine, polylineWidth, polylineSafetyZone]);


//   useEffect(() => {
//     if (pointsPolyLine?.length >= 2) {
//       const band = computeTaperedBand(pointsPolyLine, polylineWidth);
//       setBandPolygon(band);
//       const safety = computeTaperedBand(pointsPolyLine, polylineWidth + polylineSafetyZone);
//       setSafetyZonePolyLine(safety);
//     } else {
//       setBandPolygon([]);
//       setSafetyZonePolyLine([]);
//     }
//   }, [pointsPolyLine, polylineWidth, polylineSafetyZone]);

//   const removePoyLine = (indexRemover) => {
//     setPointsPolyLine(prev => {
//       const updated = prev.filter((_, index) => index !== indexRemover);
//       if (updated.length < 2) {
//         setSafetyZonePolyLine([]);
//       }
//       return updated;
//     });
//   };
//   // polyline




//   // circle 
//   useEffect(() => {
//     if (!circleRef.current || !childCircleRef.current) return;
//     circleRef.current?.setRadius(circleWidth);
//     childCircleRef.current?.setRadius(circleWidth + circleSafetyZone);
//   }, [circleWidth, circleSafetyZone]);

//   const currentCenterOfCircle = useMemo(() => {
//     if (!circleRef.current) return null;

//     const c = circleRef.current?.getCenter();
//     if (!c) return null;

//     return {
//       lat: c.lat(),
//       lng: c.lng(),
//     };
//   }, [circleWidth, circleSafetyZone]);





//   const drawCircle = useCallback(() => {
//     if (!mapRef.current || !center) return;
//     var effectiveCenter
//     if (value1) {
//       effectiveCenter = value1 ?? currentCenterOfCircle ?? center;
//     }
//     else {
//       effectiveCenter = currentCenterOfCircle ?? center ?? value1;
//     }
//     if (!isAlert) {
//       setCircleCenter(effectiveCenter);
//     }
//     if (circleRef.current) {
//       window.google.maps.event.clearInstanceListeners(circleRef.current);
//       circleRef.current.setMap(null);
//       circleRef.current = null;
//     }

//     if (childCircleRef.current) {
//       childCircleRef.current.setMap(null);
//       childCircleRef.current = null;
//     }

//     const parent = new window.google.maps.Circle({
//       map: mapRef.current,
//       center: isAlert ? circleCenter ? circleCenter : effectiveCenter : effectiveCenter,
//       radius: circleWidth,
//       fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "rgb(18, 145, 84)" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
//       strokeColor: alertType == "HAZARD" ? "rgb(210, 25, 41)" : alertType == "WEATHER" ? "rgb(14, 73, 84)" : alertType == "COMMUNICATION" ? "rgb(196, 146, 56)" : alertType == "SECURITY" ? "rgb(1, 100, 131)" : '#ff3030',
//       fillOpacity: 0.2,
//       strokeOpacity: 0.6,
//       strokeWeight: 0,
//       draggable: isRead ? false : true,
//       editable: false,
//       zIndex: 999,
//     });

//     const child = new window.google.maps.Circle({
//       map: mapRef.current,
//       center: isAlert ? circleCenter ? circleCenter : effectiveCenter : effectiveCenter,
//       radius: circleWidth + circleSafetyZone,
//       strokeOpacity: 0,
//       strokeWeight: 0,
//       fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "rgb(18, 145, 84)" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
//       fillOpacity: 0.2,
//       clickable: false,
//       zIndex: 10
//     });

//     parent.addListener('center_changed', () => {
//       const newCenter = parent?.getCenter();
//       child.setCenter(parent?.getCenter());
//       const newCenterString = {
//         lat: newCenter.lat(),
//         lng: newCenter.lng()
//       };
//       setCircleCenter(newCenterString);
//     });


//     parent.addListener('radius_changed', () => {
//       child.setRadius(parent.getRadius() + circleSafetyZone);
//     });

//     circleRef.current = parent;
//     childCircleRef.current = child;
//   }, [currectType, mapRef, circleWidth, circleSafetyZone, currentCenterOfCircle, alertType]);


//   const resetCircle = useCallback(() => {
//     if (circleRef.current) {
//       circleRef.current.setMap(null);
//       circleRef.current = null;
//     }
//     if (childCircleRef.current) {
//       childCircleRef.current.setMap(null);
//       childCircleRef.current = null;
//     }
//   }, []);
//   // circle 






//   // location finder
//   const handleRecenter = () => {
//     if (mapRef.current) {
//       mapRef.current.panTo(new window.google.maps.LatLng(center?.lat, center?.lng));
//       mapRef.current.setZoom(18);
//     }
//   };
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by your browser.');
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         localStorage.setItem("cLocation", JSON.stringify({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         }))
//         setCenter({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       (err) => {
//         if (err.code === 1) {
//           setError('Permission denied. Please allow location access in your browser settings.');
//         } else if (err.code === 2) {
//           setError('Location unavailable.');
//         } else if (err.code === 3) {
//           setError('Location request timed out.');
//         } else {
//           setError('An unknown error occurred.');
//         }
//         setLocationToggle(false)
//         console.error('Geolocation error:', err);
//       }
//     );
//   }, []);
//   // location finder



//   useEffect(() => {
//     setIsmoveAblePoly(false)
//   }, [currectType])




//   const VerifyMapShape = useCallback(() => {
//     if (currectType === 0) return 2;
//     if (currectType === 1) return (pointsPolyLine?.length >= 2 ? 1 : 3);
//     if (currectType === 2) return (circleRef.current ? 1 : 2);
//     if (currectType === 3) return (polygonPoint?.length >= 3 ? 1 : 4);
//     return 2;
//   }, [currectType, pointsPolyLine, polygonPoint]);





//   // WorksiteCircle
//   const worksiteParentRef = useRef(null);
//   const [coun, setCoun] = useState(0)
//   const drawCircleWorkSite = (loc, radius) => {
//     // clean old circle if needed
//     if (worksiteParentRef.current) {
//       window.google.maps.event.clearInstanceListeners(
//         worksiteParentRef.current
//       );
//       worksiteParentRef.current.setMap(null);
//     }
//     const circle = new window.google.maps.Circle({
//       map: mapRef.current,
//       center: loc,
//       radius,
//       strokeWeight: 0,
//       fillColor: '#0d1e4b',
//       fillOpacity: 0.2,
//       draggable: false,
//       editable: false,
//     });
//     worksiteParentRef.current = circle;
//     setCoun(prev => prev + 1)
//   };



//   useEffect(() => {
//     if (!worksiteParentRef.current) return;

//     const circle = worksiteParentRef.current;

//     const listener = circle.addListener('click', (e) => {
//       const { lat, lng } = getLatLng(e);
//       if (lat == null) return;
//       if (!isRead) {
//         if (currectType === 1) {
//           addPolyLine({ lat, lng });
//         } else if (currectType === 2) {
//           circleRef.current?.setCenter({ lat, lng });
//           childCircleRef.current?.setCenter({ lat, lng });
//           setCircleCenter({ lat, lng })
//         } else if (currectType === 3) {
//           addPolygonPoint({ lat, lng });
//         }
//       }
//     });

//     return () => {
//       window.google.maps.event.removeListener(listener);
//     };
//   }, [
//     currectType,
//     addPolyLine,
//     addPolygonPoint,
//     coun
//   ]);
//   // WorksiteCircle


//   const getMarkerPosition = (locations) => {
//     if (!locations) return { lat: 0, lng: 0 };
//     if (locations.length <= 0) return { lat: 0, lng: 0 };

//     // Case: Polygon (array of arrays)
//     if (Array.isArray(locations[0])) {
//       return {
//         lat: Number(locations[0][0]),
//         lng: Number(locations[0][1]),
//       };
//     }

//     // Case: Single coordinate
//     return {
//       lat: Number(locations[0]),
//       lng: Number(locations[1]),
//     };
//   };
//   const returnPoints = () => {
//     const stored = JSON.parse(
//       localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}"
//     );
//     const mapData = stored?.mapData;
//     const position = getMarkerPosition(mapData?.locations);
//     if (currectType == 1) {
//       return {
//         points: pointsPolyLine,
//         safetyZonePolyLinePoints: safetyZonePolyLine,
//         type: 1
//       }
//     }
//     else if (currectType == 2) {
//       return {
//         points: position.lat == 0 ? {
//           lat: circleRef.current?.center?.lat(),
//           lng: circleRef.current?.center?.lng(),
//         }
//           : position,
//         type: 2
//       }
//     }
//     else if (currectType == 3) {
//       return {
//         points: polygonPoint,
//         type: 3
//       }
//     }
//   }

//   useEffect(() => {
//     if (currectType === 2) {
//       drawCircle();
//     } else {
//       resetCircle();
//     }
//   }, [currectType, drawCircle, resetCircle]);







//   // all extarnal function
//   useImperativeHandle(childRefParent, () => ({
//     drawCircle,
//     drawCircleWorkSite,
//     resetCircle,
//     VerifyMapShape,
//     returnPoints
//   }));
//   // all extarnal function


//   const [centerShape, setCenterShape] = useState()

//   const getPolygonCenter = (points) => {
//     if (!points || points.length === 0) {
//       return { lat: 0, lng: 0 };
//     }
//     const total = points.reduce(
//       (acc, point) => {
//         acc.lat += Number(point.lat);
//         acc.lng += Number(point.lng);
//         return acc;
//       },
//       { lat: 0, lng: 0 }
//     );

//     return {
//       lat: total.lat / points.length,
//       lng: total.lng / points.length,
//     };
//   };


//   const getAllAlertCenter = () => {
//     setCenterShape()
//     if (currectType === 1) {
//       if (pointsPolyLine?.length) {
//         const center = getPolygonCenter(pointsPolyLine);
//         setCenterShape(center);
//       }
//     };
//     if (currectType === 3) {
//       if (polygonPoint?.length) {
//         const center = getPolygonCenter(polygonPoint);
//         setCenterShape(center);
//       }
//     };
//   }




//   useEffect(() => {
//     getAllAlertCenter()
//   }, [currectType, pointsPolyLine, polygonPoint])


//   return (
//     <>
//       {!isLoaded ?
//         <div className={Style.loadingContainer}>
//           <Loader stroke={4} speed={0.8} color="#000000ff" />
//         </div>
//         :
//         <>
//           {!center ?
//             <div className={Style.noLocationContainer}>
//               <IoEarthOutline size={58} color='rgba(33, 76, 188, 1)' />
//               <h2>Location Not found</h2>
//               <h6>We can’t access your location. Enable it in your browser settings to continue.</h6>
//               {/* <button>go to setting</button> */}
//             </div>
//             :
//             <GoogleMap
//               mapContainerStyle={mapContainerStyle}
//               center={value1 ?? center}
//               zoom={zoom}
//               onLoad={onMapLoad}
//               onClick={(e) => {
//                 if (!isRead) {
//                   if (currectType === 1) ismoveAblePoly ? changePolyLinePoint(e) : addPolyLine(e);
//                   else if (currectType === 2) {
//                     const { lat, lng } = getLatLng(e);
//                     if (lat == null) return;
//                     if (circleRef.current) {
//                       circleRef.current.setCenter({ lat, lng });
//                       setCircleCenter({ lat, lng })
//                     }
//                     if (childCircleRef.current) childCircleRef.current.setCenter({ lat, lng });
//                   }
//                   else if (currectType === 3) ismoveAblePoly ? changePolygonPoint(e) : addPolygonPoint(e);
//                 }
//               }
//               }
//               options={{
//                 cameraControl: false,
//                 clickableIcons: false,
//                 streetViewControl: false,
//                 fullscreenControl: false,
//                 mapTypeId: "satellite",
//                 mapTypeControl: false,
//                 zoom: false,
//                 tilt: 0,
//                 rotateControl: false,
//                 isFractionalZoomEnabled: false,
//                 zoomControlOptions: false,
//                 scaleControl: false,
//                 gestureHandling: "greedy",
//                 rotateControlOptions: false,
//                 heading: 0,
//                 tiltInteractionEnabled: false,
//                 zoomControl: true,
//                 ...mapOptions,
//               }}
//             >
//               {workSiteLoader || loadingMapData ?
//                 <div className={Style.NoWorksiteContainer}>
//                   <h2>{loadingTitle ?? "Loading"}</h2>
//                   <h6>{loadingPara ?? "Loading please wait."}</h6>
//                 </div>
//                 :
//                 <>
//                   {/* CustomArea */}
//                   {polygonPoint.length >= 1 && (
//                     <>
//                       <Polygon
//                         path={[...polygonPoint, polygonPoint[0]]}
//                         options={{
//                           zIndex: 999,
//                           fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
//                           fillOpacity: 0.2,
//                           strokeOpacity: 0,
//                         }}
//                       />
//                       <Polygon
//                         path={getSafetyZonePath()}
//                         options={{
//                           zIndex: 999,
//                           fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
//                           fillOpacity: 0.2,
//                           strokeWeight: 0,
//                         }}
//                       />
//                     </>
//                   )}
//                   {polygonPoint.map((point, index) => (
//                     <Marker
//                       key={`custom-${index}`}
//                       position={point}
//                       onClick={() => !isRead && !ismoveAblePoly && removeCustomPoint(index)}
//                       zIndex={100}
//                       icon={{
//                         url: PolygonIcon,
//                         scaledSize: new window.google.maps.Size(18, 18),
//                       }}
//                     />
//                   ))}
//                   {/* CustomArea */}



//                   {/* Polyline */}
//                   {pointsPolyLine?.map((point, index) => (
//                     <Marker
//                       key={`custom-${index}`}
//                       position={point}
//                       onClick={() => !isRead && !ismoveAblePoly && removePoyLine(index)}
//                       icon={{
//                         url: PolygonIcon,
//                         scaledSize: new window.google.maps.Size(18, 18),
//                       }}
//                     />
//                   ))}
//                   {pointsPolyLine?.length > 1 && (
//                     <Polyline path={pointsPolyLine} options={{ strokeColor: "transparent" }} />
//                   )}
//                   {safetyZonePolyLine.length > 0 && (
//                     <Polygon
//                       path={safetyZonePolyLine}
//                       options={{
//                         zIndex: 999,
//                         fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
//                         fillOpacity: 0.2,
//                         strokeWeight: 0,
//                       }}
//                     />
//                   )}
//                   {bandPolygon.length > 0 && (
//                     <Polygon
//                       path={bandPolygon}
//                       options={{
//                         zIndex: 999,
//                         fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
//                         fillOpacity: 0.2,
//                         strokeWeight: 0,
//                       }}
//                     />
//                   )}
//                   {/* Polyline */}



//                   {/*Worksite Center Icon */}
//                   <Marker
//                     key={`custom2`}
//                     position={centerWorkSite}
//                     icon={{
//                       url: WorkSiteIcon,
//                       scaledSize: new window.google.maps.Size(48, 48),
//                     }}
//                     onClick={(e) => {
//                       if (!isRead) {
//                         const { lat, lng } = getLatLng(e);
//                         if (lat == null) return;
//                         if (currectType === 1) {
//                           addPolyLine({ lat, lng });
//                         } else if (currectType === 2) {
//                           circleRef.current?.setCenter({ lat, lng });
//                           childCircleRef.current?.setCenter({ lat, lng });
//                         } else if (currectType === 3) {
//                           addPolygonPoint({ lat, lng });
//                         }
//                       }
//                     }}
//                   />
//                   {/*Worksite Center Icon */}







//                   {/*Alert Circle Center Icon */}
//                   {alertType !== "" && isAlert &&
//                     <Marker
//                       key={`custom22`}
//                       position={circleRef?.current ? circleRef?.current?.getCenter() : centerShape}
//                       icon={{
//                         url: alertType === "HAZARD" ? alertsImage1 :
//                           alertType === "WEATHER" ? alertsImage2 :
//                             alertType === "COMMUNICATION" ? alertsImage4 :
//                               alertType === "SECURITY" ? alertsImage3 : null,
//                         scaledSize: new window.google.maps.Size(60, 60),
//                       }}
//                       zIndex={10}
//                     />
//                   }
//                   {/*Alert Circle Center Icon */}





//                   {/* Work Site Custom Area */}
//                   {customAreaPoint.length >= 1 && (
//                     <Polygon
//                       path={[...customAreaPoint, customAreaPoint[0]]}
//                       onClick={(e) => {
//                         if (!isRead) {
//                           const { lat, lng } = getLatLng(e);
//                           if (lat == null) return;
//                           if (currectType === 1) {
//                             addPolyLine({ lat, lng });
//                           } else if (currectType === 2) {
//                             circleRef.current?.setCenter({ lat, lng });
//                             childCircleRef.current?.setCenter({ lat, lng });
//                           } else if (currectType === 3) {
//                             addPolygonPoint({ lat, lng });
//                           }
//                         }
//                       }}
//                       options={{
//                         fillColor: '#070F26',
//                         fillOpacity: 0.5,
//                         strokeWeight: 0,
//                       }}
//                     />
//                   )}
//                   {/* Work Site Polygon */}


//                   {/* Work Site polyLine */}
//                   {polylinePoint.length >= 1 && (
//                     <Polyline
//                       onClick={(e) => {
//                         if (!isRead) {
//                           const { lat, lng } = getLatLng(e);
//                           if (lat == null) return;
//                           if (currectType === 1) {
//                             addPolyLine({ lat, lng });
//                           } else if (currectType === 2) {
//                             circleRef.current?.setCenter({ lat, lng });
//                             childCircleRef.current?.setCenter({ lat, lng });
//                           } else if (currectType === 3) {
//                             addPolygonPoint({ lat, lng });
//                           }
//                         }
//                       }}
//                       path={polylinePoint}
//                       options={{
//                         strokeColor: '#070F26',
//                         strokeOpacity: 1,
//                         strokeWeight: 1,
//                       }}
//                     />
//                   )}
//                   {/* Work Site polyLine */}


//                   {/* Center Icon */}
//                   <Marker
//                     key={`custom3`}
//                     position={center}
//                     icon={{
//                       url: centerIcon,
//                       scaledSize: new window.google.maps.Size(40, 48),
//                     }}
//                   />
//                   {/* Center Icon */}
//                 </>
//               }

//               {!isRead &&
//                 <>
//                   {(pointsPolyLine?.length >= 3 || polygonPoint?.length >= 3) && (
//                     <div
//                       onClick={() => setIsmoveAblePoly(!ismoveAblePoly)}
//                       className={Style.CenterChangeIcon2}
//                     >
//                       <IoMoveSharp size={22} color={ismoveAblePoly ? "#214cbc" : "#666"} />
//                     </div>
//                   )}
//                 </>
//               }

//               <div onClick={() => {
//                 setValue1(null)
//                 handleRecenter()
//                 localStorage.removeItem("sLocation")
//               }} className={Style.CenterChangeIcon}>
//                 <TbCurrentLocation size={22} color='#666' />
//               </div>
//             </GoogleMap >
//           }
//         </>
//       }
//     </>
//   );
// });

// export default MapWidget;







import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Circle, GoogleMap, InfoWindow, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import Style from './googleMap.module.css';
import Loader from '../loader';
import { IoEarthOutline, IoMoveSharp } from "react-icons/io5";
import PolygonIcon from '../../assets/icons/mapIcon/PolygonIcon.png'
import centerIcon from '../../assets/centerIcon.png'
import { forwardRef, useImperativeHandle } from 'react';
import WorkSiteIcon from "../../assets/marker_worksites.png";
import { TbCurrentLocation } from "react-icons/tb";
import alertsImage1 from "../../assets/alerts1.png";
import alertsImage2 from "../../assets/alerts2.png";
import alertsImage3 from "../../assets/alerts3.png";
import alertsImage4 from "../../assets/alerts4.png";


const MapWidget = forwardRef(({
  mapContainerStyle = { width: '100%', height: '100%' },
  zoom = 14.5,
  mapOptions = {},
  mapKey = 0,
  value1,
  setValue1,
  currectType,
  centerWorkSite,
  // CustomArea
  polygonSafetyZone = 0,
  // CustomArea





  // polyline
  polylineSafetyZone = 0,
  polylineWidth = 0,
  setPointsPolyLine,
  pointsPolyLine,
  setBandPolygon,
  bandPolygon,
  safetyZonePolyLine,
  setSafetyZonePolyLine,
  // polyline


  // Circle
  circleWidth = 100,
  circleSafetyZone = 0,
  mapRefParent,
  childCircleRef,
  circleRef,
  setCircleCenter,
  circleCenter,
  // Circle

  // worksite CustomArea
  customAreaPoint,
  polygonPoint,
  setPolygonPoint,
  // worksite CustomArea

  // worksite polyline
  polylinePoint,
  // worksite polyline

  childRefParent,

  // worksiteLoader
  workSiteLoader,
  loadingTitle,
  loadingPara,
  loadingMapData,
  // worksiteLoader
  isRead = false,
  isAlert = false,
  alertType,
  counter
}) => {

  const [ismoveAblePoly, setIsmoveAblePoly] = useState(false)


  const [center, setCenter] = useState(JSON.parse(localStorage.getItem("cLocation")) || {});
  const mapRef = useRef(null)


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
  });
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    mapRefParent.current = map
  }, []);

  const getLatLng = (e) => {
    if (!e) return { lat: null, lng: null };
    if (typeof e.latLng?.lat === "function") {
      return { lat: e.latLng.lat(), lng: e.latLng.lng() };
    }
    if (e.lat && e.lng) return { lat: e.lat, lng: e.lng };
    return { lat: null, lng: null };
  };




  // CustomArea
  const getSafetyZonePath = () => {
    const centerSafey = {
      lat: polygonPoint.reduce((sum, p) => sum + p.lat, 0) / polygonPoint.length,
      lng: polygonPoint.reduce((sum, p) => sum + p.lng, 0) / polygonPoint.length,
    };
    const padded = polygonPoint.map((pt) => offsetPoint(pt, centerSafey, polygonSafetyZone));
    return [...padded, padded[0]];
  };
  const offsetPoint = (point, centerSafey, offsetMeters) => {
    const R = 6378137;
    const dLat = point.lat - centerSafey.lat;
    const dLng = point.lng - centerSafey.lng;
    const len = Math.sqrt(dLat * dLat + dLng * dLng);
    const scale = (len + offsetMeters / R * (180 / Math.PI)) / len;
    return {
      lat: centerSafey.lat + dLat * scale,
      lng: centerSafey.lng + dLng * scale,
    };
  };

  const addPolygonPoint = useCallback((e) => {
    const { lat, lng } = getLatLng(e);
    if (lat == null || lng == null) return;
    setPolygonPoint(prev => [...prev, { lat, lng }]);
  }, []);

  const getCenter = (points) => {
    const lat =
      points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const lng =
      points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    return { lat, lng };
  };

  const movePolygonToCenter = (points, newCenter) => {
    const currentCenter = getCenter(points);
    const latDiff = newCenter.lat - currentCenter.lat;
    const lngDiff = newCenter.lng - currentCenter.lng;
    return points.map((p) => ({
      lat: p.lat + latDiff,
      lng: p.lng + lngDiff,
    }));
  };

  const changePolygonPoint = useCallback((e) => {
    const { lat, lng } = getLatLng(e);
    if (lat == null || lng == null) return;
    const newCenter = {
      lat: lat,
      lng: lng,
    };
    const updated = movePolygonToCenter(polygonPoint, newCenter);
    setPolygonPoint(updated);
  }, [polygonPoint]);

  const removeCustomPoint = (indexRemover) => {
    setPolygonPoint(prev => prev?.filter((_, index) => index !== indexRemover));
  }
  // CustomArea






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


  // const computeTaperedBand = (points, width) => {
  //   const left = [];
  //   const right = [];

  //   for (let i = 0; i < points.length - 1; i++) {
  //     const p1 = points[i];
  //     const p2 = points[i + 1];

  //     const dx = p2.lng - p1.lng;
  //     const dy = p2.lat - p1.lat;
  //     const length = Math.sqrt(dx * dx + dy * dy);
  //     if (!length) continue;

  //     const ux = dx / length;
  //     const uy = dy / length;

  //     const px = -uy;
  //     const py = ux;

  //     const metersPerLat = 111320;
  //     const metersPerLng = 111320 * Math.cos((p1.lat * Math.PI) / 180);

  //     // 👇 taper logic
  //     let scaleStart = 1;
  //     let scaleEnd = 1;

  //     // first segment → taper start
  //     if (i === 0 && points.length > 2) {
  //       scaleStart = 0; // sharp start
  //     }

  //     // last segment → taper end
  //     if (i === points.length - 2 && points.length > 2) {
  //       scaleEnd = 0; // sharp end
  //     }

  //     const dLatStart = (py * width * scaleStart) / metersPerLat;
  //     const dLngStart = (px * width * scaleStart) / metersPerLng;

  //     const dLatEnd = (py * width * scaleEnd) / metersPerLat;
  //     const dLngEnd = (px * width * scaleEnd) / metersPerLng;

  //     left.push({
  //       lat: p1.lat + dLatStart,
  //       lng: p1.lng + dLngStart,
  //     });

  //     left.push({
  //       lat: p2.lat + dLatEnd,
  //       lng: p2.lng + dLngEnd,
  //     });

  //     right.push({
  //       lat: p1.lat - dLatStart,
  //       lng: p1.lng - dLngStart,
  //     });

  //     right.push({
  //       lat: p2.lat - dLatEnd,
  //       lng: p2.lng - dLngEnd,
  //     });
  //   }

  //   return [...left, ...right.reverse()];
  // };


  // const computeTaperedBand = (points, width) => {
  //   const left = [];
  //   const right = [];

  //   const n = points.length;

  //   for (let i = 0; i < n - 1; i++) {
  //     const p1 = points[i];
  //     const p2 = points[i + 1];

  //     const dx = p2.lng - p1.lng;
  //     const dy = p2.lat - p1.lat;
  //     const length = Math.sqrt(dx * dx + dy * dy);
  //     if (!length) continue;

  //     const ux = dx / length;
  //     const uy = dy / length;

  //     const px = -uy;
  //     const py = ux;

  //     const metersPerLat = 111320;
  //     const metersPerLng = 111320 * Math.cos((p1.lat * Math.PI) / 180);

  //     let scaleStart = 1;
  //     let scaleEnd = 1;

  //     if (n > 2) {
  //       if (i === 1) {
  //         scaleStart = 0;
  //       }

  //       if (i === n - 3) {
  //         scaleEnd = 0;
  //       }
  //     }

  //     const dLatStart = (py * width * scaleStart) / metersPerLat;
  //     const dLngStart = (px * width * scaleStart) / metersPerLng;

  //     const dLatEnd = (py * width * scaleEnd) / metersPerLat;
  //     const dLngEnd = (px * width * scaleEnd) / metersPerLng;

  //     left.push({
  //       lat: p1.lat + dLatStart,
  //       lng: p1.lng + dLngStart,
  //     });

  //     left.push({
  //       lat: p2.lat + dLatEnd,
  //       lng: p2.lng + dLngEnd,
  //     });

  //     right.push({
  //       lat: p1.lat - dLatStart,
  //       lng: p1.lng - dLngStart,
  //     });

  //     right.push({
  //       lat: p2.lat - dLatEnd,
  //       lng: p2.lng - dLngEnd,
  //     });
  //   }

  //   return [...left, ...right.reverse()];
  // };

  // useEffect(() => {
  //   if (pointsPolyLine?.length >= 2) {
  //     const band = computeTaperedBand(pointsPolyLine, polylineWidth);
  //     setBandPolygon(band);

  //     const safety = computeTaperedBand(
  //       pointsPolyLine,
  //       polylineWidth + polylineSafetyZone
  //     );
  //     setSafetyZonePolyLine(safety);
  //   } else {
  //     setBandPolygon([]);
  //     setSafetyZonePolyLine([]);
  //   }
  // }, [pointsPolyLine, polylineWidth, polylineSafetyZone]);


  useEffect(() => {
    if (pointsPolyLine?.length >= 2) {
      const { left, right } = computeOffset(pointsPolyLine, polylineWidth);
      const band = [...left, ...right.reverse()];
      setBandPolygon(band);
      const { left: sLeft, right: sRight } = computeOffset(pointsPolyLine, polylineWidth + polylineSafetyZone);
      const safety = [...sLeft, ...sRight.reverse()];
      setSafetyZonePolyLine(safety);
    } else {
      setBandPolygon([]);
      setSafetyZonePolyLine([]);
    }
  }, [pointsPolyLine, polylineWidth, polylineSafetyZone]);

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




  // circle 
  useEffect(() => {
    if (!circleRef.current || !childCircleRef.current) return;
    circleRef.current?.setRadius(circleWidth);
    childCircleRef.current?.setRadius(circleWidth + circleSafetyZone);
  }, [circleWidth, circleSafetyZone]);

  const currentCenterOfCircle = useMemo(() => {
    if (!circleRef.current) return null;

    const c = circleRef.current?.getCenter();
    if (!c) return null;

    return {
      lat: c.lat(),
      lng: c.lng(),
    };
  }, [circleWidth, circleSafetyZone]);





  const drawCircle = useCallback(() => {
    if (!mapRef.current || !center) return;
    var effectiveCenter
    if (value1) {
      effectiveCenter = value1 ?? currentCenterOfCircle ?? center;
    }
    else {
      effectiveCenter = currentCenterOfCircle ?? center ?? value1;
    }
    if (!isAlert) {
      setCircleCenter(effectiveCenter);
    }
    if (circleRef.current) {
      window.google.maps.event.clearInstanceListeners(circleRef.current);
      circleRef.current.setMap(null);
      circleRef.current = null;
    }

    if (childCircleRef.current) {
      childCircleRef.current.setMap(null);
      childCircleRef.current = null;
    }

    const parent = new window.google.maps.Circle({
      map: mapRef.current,
      center: isAlert ? circleCenter ? circleCenter : effectiveCenter : effectiveCenter,
      radius: circleWidth,
      fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "rgb(18, 145, 84)" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
      strokeColor: alertType == "HAZARD" ? "rgb(210, 25, 41)" : alertType == "WEATHER" ? "rgb(14, 73, 84)" : alertType == "COMMUNICATION" ? "rgb(196, 146, 56)" : alertType == "SECURITY" ? "rgb(1, 100, 131)" : '#ff3030',
      fillOpacity: 0.2,
      strokeOpacity: 0.6,
      strokeWeight: 0,
      draggable: isRead ? false : true,
      editable: false,
      zIndex: 999,
    });

    const child = new window.google.maps.Circle({
      map: mapRef.current,
      center: isAlert ? circleCenter ? circleCenter : effectiveCenter : effectiveCenter,
      radius: circleWidth + circleSafetyZone,
      strokeOpacity: 0,
      strokeWeight: 0,
      fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "rgb(18, 145, 84)" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
      fillOpacity: 0.2,
      clickable: false,
      zIndex: 10
    });

    parent.addListener('center_changed', () => {
      const newCenter = parent?.getCenter();
      child.setCenter(parent?.getCenter());
      const newCenterString = {
        lat: newCenter.lat(),
        lng: newCenter.lng()
      };
      setCircleCenter(newCenterString);
    });


    parent.addListener('radius_changed', () => {
      child.setRadius(parent.getRadius() + circleSafetyZone);
    });

    circleRef.current = parent;
    childCircleRef.current = child;
  }, [currectType, mapRef, circleWidth, circleSafetyZone, currentCenterOfCircle, alertType]);


  const resetCircle = useCallback(() => {
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
    if (childCircleRef.current) {
      childCircleRef.current.setMap(null);
      childCircleRef.current = null;
    }
  }, []);
  // circle 






  // location finder
  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.panTo(new window.google.maps.LatLng(center?.lat, center?.lng));
      mapRef.current.setZoom(18);
    }
  };
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem("cLocation", JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }))
        setCenter({
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
        setLocationToggle(false)
        console.error('Geolocation error:', err);
      }
    );
  }, []);
  // location finder



  useEffect(() => {
    setIsmoveAblePoly(false)
  }, [currectType])




  const VerifyMapShape = useCallback(() => {
    if (currectType === 0) return 2;
    if (currectType === 1) return (pointsPolyLine?.length >= 2 ? 1 : 3);
    if (currectType === 2) return (circleRef.current ? 1 : 2);
    if (currectType === 3) return (polygonPoint?.length >= 3 ? 1 : 4);
    return 2;
  }, [currectType, pointsPolyLine, polygonPoint]);





  // WorksiteCircle
  const worksiteParentRef = useRef(null);
  const [coun, setCoun] = useState(0)
  const drawCircleWorkSite = (loc, radius) => {
    // clean old circle if needed
    if (worksiteParentRef.current) {
      window.google.maps.event.clearInstanceListeners(
        worksiteParentRef.current
      );
      worksiteParentRef.current.setMap(null);
    }
    const circle = new window.google.maps.Circle({
      map: mapRef.current,
      center: loc,
      radius,
      strokeWeight: 0,
      fillColor: '#0d1e4b',
      fillOpacity: 0.2,
      draggable: false,
      editable: false,
    });
    worksiteParentRef.current = circle;
    setCoun(prev => prev + 1)
  };



  useEffect(() => {
    if (!worksiteParentRef.current) return;

    const circle = worksiteParentRef.current;

    const listener = circle.addListener('click', (e) => {
      const { lat, lng } = getLatLng(e);
      if (lat == null) return;
      if (!isRead) {
        if (currectType === 1) {
          addPolyLine({ lat, lng });
        } else if (currectType === 2) {
          circleRef.current?.setCenter({ lat, lng });
          childCircleRef.current?.setCenter({ lat, lng });
          setCircleCenter({ lat, lng })
        } else if (currectType === 3) {
          addPolygonPoint({ lat, lng });
        }
      }
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [
    currectType,
    addPolyLine,
    addPolygonPoint,
    coun
  ]);
  // WorksiteCircle


  const getMarkerPosition = (locations) => {
    if (!locations) return { lat: 0, lng: 0 };
    if (locations.length <= 0) return { lat: 0, lng: 0 };

    // Case: Polygon (array of arrays)
    if (Array.isArray(locations[0])) {
      return {
        lat: Number(locations[0][0]),
        lng: Number(locations[0][1]),
      };
    }

    // Case: Single coordinate
    return {
      lat: Number(locations[0]),
      lng: Number(locations[1]),
    };
  };
  const returnPoints = () => {
    const stored = JSON.parse(
      localStorage.getItem("Q8@L!zM7B_1xP#t+6R9Dg*v==") || "{}"
    );
    const mapData = stored?.mapData;
    const position = getMarkerPosition(mapData?.locations);
    if (currectType == 1) {
      return {
        points: pointsPolyLine,
        safetyZonePolyLinePoints: safetyZonePolyLine,
        type: 1
      }
    }
    else if (currectType == 2) {
      return {
        points: position.lat == 0 ? {
          lat: circleRef.current?.center?.lat(),
          lng: circleRef.current?.center?.lng(),
        }
          : position,
        type: 2
      }
    }
    else if (currectType == 3) {
      return {
        points: polygonPoint,
        type: 3
      }
    }
  }

  useEffect(() => {
    if (currectType === 2) {
      drawCircle();
    } else {
      resetCircle();
    }
  }, [currectType, drawCircle, resetCircle]);







  // all extarnal function
  useImperativeHandle(childRefParent, () => ({
    drawCircle,
    drawCircleWorkSite,
    resetCircle,
    VerifyMapShape,
    returnPoints
  }));
  // all extarnal function


  const [centerShape, setCenterShape] = useState()

  const getPolygonCenter = (points) => {
    if (!points || points.length === 0) {
      return { lat: 0, lng: 0 };
    }
    const total = points.reduce(
      (acc, point) => {
        acc.lat += Number(point.lat);
        acc.lng += Number(point.lng);
        return acc;
      },
      { lat: 0, lng: 0 }
    );

    return {
      lat: total.lat / points.length,
      lng: total.lng / points.length,
    };
  };


  const getAllAlertCenter = () => {
    setCenterShape()
    if (currectType === 1) {
      if (pointsPolyLine?.length) {
        const center = getPolygonCenter(pointsPolyLine);
        setCenterShape(center);
      }
    };
    if (currectType === 3) {
      if (polygonPoint?.length) {
        const center = getPolygonCenter(polygonPoint);
        setCenterShape(center);
      }
    };
  }




  useEffect(() => {
    getAllAlertCenter()
  }, [currectType, pointsPolyLine, polygonPoint])


  return (
    <>
      {!isLoaded ?
        <div className={Style.loadingContainer}>
          <Loader stroke={4} speed={0.8} color="#000000ff" />
        </div>
        :
        <>
          {!center ?
            <div className={Style.noLocationContainer}>
              <IoEarthOutline size={58} color='rgba(33, 76, 188, 1)' />
              <h2>Location Not found</h2>
              <h6>We can’t access your location. Enable it in your browser settings to continue.</h6>
              {/* <button>go to setting</button> */}
            </div>
            :
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={value1 ?? center}
              zoom={zoom}
              onLoad={onMapLoad}
              onClick={(e) => {
                if (!isRead) {
                  if (currectType === 1) ismoveAblePoly ? changePolyLinePoint(e) : addPolyLine(e);
                  else if (currectType === 2) {
                    const { lat, lng } = getLatLng(e);
                    if (lat == null) return;
                    if (circleRef.current) {
                      circleRef.current.setCenter({ lat, lng });
                      setCircleCenter({ lat, lng })
                    }
                    if (childCircleRef.current) childCircleRef.current.setCenter({ lat, lng });
                  }
                  else if (currectType === 3) ismoveAblePoly ? changePolygonPoint(e) : addPolygonPoint(e);
                }
              }
              }
              options={{
                cameraControl: false,
                clickableIcons: false,
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeId: "satellite",
                mapTypeControl: false,
                zoom: false,
                tilt: 0,
                rotateControl: false,
                isFractionalZoomEnabled: false,
                zoomControlOptions: false,
                scaleControl: false,
                gestureHandling: "greedy",
                rotateControlOptions: false,
                heading: 0,
                tiltInteractionEnabled: false,
                zoomControl: true,
                ...mapOptions,
              }}
            >
              {workSiteLoader || loadingMapData ?
                <div className={Style.NoWorksiteContainer}>
                  <h2>{loadingTitle ?? "Loading"}</h2>
                  <h6>{loadingPara ?? "Loading please wait."}</h6>
                </div>
                :
                <>
                  {/* CustomArea */}
                  {polygonPoint.length >= 1 && (
                    <>
                      <Polygon
                        path={[...polygonPoint, polygonPoint[0]]}
                        options={{
                          zIndex: 999,
                          fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
                          fillOpacity: 0.2,
                          strokeOpacity: 0,
                        }}
                      />
                      <Polygon
                        path={getSafetyZonePath()}
                        options={{
                          zIndex: 999,
                          fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
                          fillOpacity: 0.2,
                          strokeWeight: 0,
                        }}
                      />
                    </>
                  )}
                  {polygonPoint.map((point, index) => (
                    <Marker
                      key={`custom-${index}`}
                      position={point}
                      onClick={() => !isRead && !ismoveAblePoly && removeCustomPoint(index)}
                      zIndex={100}
                      icon={{
                        url: PolygonIcon,
                        scaledSize: new window.google.maps.Size(18, 18),
                      }}
                    />
                  ))}
                  {/* CustomArea */}



                  {/* Polyline */}
                  {pointsPolyLine?.map((point, index) => (
                    <Marker
                      key={`custom-${index}`}
                      position={point}
                      onClick={() => !isRead && !ismoveAblePoly && removePoyLine(index)}
                      icon={{
                        url: PolygonIcon,
                        scaledSize: new window.google.maps.Size(18, 18),
                      }}
                    />
                  ))}
                  {pointsPolyLine?.length > 1 && (
                    <Polyline path={pointsPolyLine} options={{ strokeColor: "transparent" }} />
                  )}
                  {safetyZonePolyLine.length > 0 && (
                    <Polygon
                      path={safetyZonePolyLine}
                      options={{
                        zIndex: 999,
                        fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
                        fillOpacity: 0.2,
                        strokeWeight: 0,
                      }}
                    />
                  )}
                  {bandPolygon.length > 0 && (
                    <Polygon
                      path={bandPolygon}
                      options={{
                        zIndex: 999,
                        fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "#ff3030",
                        fillOpacity: 0.2,
                        strokeWeight: 0,
                      }}
                    />
                  )}
                  {/* Polyline */}



                  {/*Worksite Center Icon */}
                  <Marker
                    key={`custom2`}
                    position={centerWorkSite}
                    icon={{
                      url: WorkSiteIcon,
                      scaledSize: new window.google.maps.Size(48, 48),
                    }}
                    onClick={(e) => {
                      if (!isRead) {
                        const { lat, lng } = getLatLng(e);
                        if (lat == null) return;
                        if (currectType === 1) {
                          addPolyLine({ lat, lng });
                        } else if (currectType === 2) {
                          circleRef.current?.setCenter({ lat, lng });
                          childCircleRef.current?.setCenter({ lat, lng });
                        } else if (currectType === 3) {
                          addPolygonPoint({ lat, lng });
                        }
                      }
                    }}
                  />
                  {/*Worksite Center Icon */}







                  {/*Alert Circle Center Icon */}
                  {alertType !== "" && isAlert &&
                    <Marker
                      key={`custom22`}
                      position={circleRef?.current ? circleRef?.current?.getCenter() : centerShape}
                      icon={{
                        url: alertType === "HAZARD" ? alertsImage1 :
                          alertType === "WEATHER" ? alertsImage2 :
                            alertType === "COMMUNICATION" ? alertsImage4 :
                              alertType === "SECURITY" ? alertsImage3 : null,
                        scaledSize: new window.google.maps.Size(60, 60),
                      }}
                      zIndex={10}
                    />
                  }
                  {/*Alert Circle Center Icon */}





                  {/* Work Site Custom Area */}
                  {customAreaPoint.length >= 1 && (
                    <Polygon
                      path={[...customAreaPoint, customAreaPoint[0]]}
                      onClick={(e) => {
                        if (!isRead) {
                          const { lat, lng } = getLatLng(e);
                          if (lat == null) return;
                          if (currectType === 1) {
                            addPolyLine({ lat, lng });
                          } else if (currectType === 2) {
                            circleRef.current?.setCenter({ lat, lng });
                            childCircleRef.current?.setCenter({ lat, lng });
                          } else if (currectType === 3) {
                            addPolygonPoint({ lat, lng });
                          }
                        }
                      }}
                      options={{
                        fillColor: '#070F26',
                        fillOpacity: 0.5,
                        strokeWeight: 0,
                      }}
                    />
                  )}
                  {/* Work Site Polygon */}


                  {/* Work Site polyLine */}
                  {polylinePoint.length >= 1 && (
                    <Polyline
                      onClick={(e) => {
                        if (!isRead) {
                          const { lat, lng } = getLatLng(e);
                          if (lat == null) return;
                          if (currectType === 1) {
                            addPolyLine({ lat, lng });
                          } else if (currectType === 2) {
                            circleRef.current?.setCenter({ lat, lng });
                            childCircleRef.current?.setCenter({ lat, lng });
                          } else if (currectType === 3) {
                            addPolygonPoint({ lat, lng });
                          }
                        }
                      }}
                      path={polylinePoint}
                      options={{
                        strokeColor: '#070F26',
                        strokeOpacity: 1,
                        strokeWeight: 1,
                      }}
                    />
                  )}
                  {/* Work Site polyLine */}


                  {/* Center Icon */}
                  <Marker
                    key={`custom3`}
                    position={center}
                    icon={{
                      url: centerIcon,
                      scaledSize: new window.google.maps.Size(40, 48),
                    }}
                  />
                  {/* Center Icon */}
                </>
              }

              {!isRead &&
                <>
                  {(pointsPolyLine?.length >= 3 || polygonPoint?.length >= 3) && (
                    <div
                      onClick={() => setIsmoveAblePoly(!ismoveAblePoly)}
                      className={Style.CenterChangeIcon2}
                    >
                      <IoMoveSharp size={22} color={ismoveAblePoly ? "#214cbc" : "#666"} />
                    </div>
                  )}
                </>
              }

              <div onClick={() => {
                setValue1(null)
                handleRecenter()
                localStorage.removeItem("sLocation")
              }} className={Style.CenterChangeIcon}>
                <TbCurrentLocation size={22} color='#666' />
              </div>
            </GoogleMap >
          }
        </>
      }
    </>
  );
});

export default MapWidget;