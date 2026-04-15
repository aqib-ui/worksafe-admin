

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
  Polygon,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Style from "./Evacuate.module.css";
import { baseUrl } from "../../../store/config.json";
import io from "socket.io-client";
import * as WorkOrderAction from "../../../store/actions/WorkOrder/index";
import * as WorkSiteAction from '../../../store/actions/Worksite/index';
import { connect, useDispatch, useSelector } from "react-redux";
import WorkSiteIcon from "../../assets/marker_worksites.png";
import userLocation from "../../assets/userLocation.png";
import evacuationIcon from '../../assets/evacuation.png'
import CallIcon from '../../assets/call.png'
import SmSIcon from '../../assets/sms.png'
import { Carousel, Popconfirm, Spin, Tag } from "antd";
import { a } from "@react-spring/web";
import { TASK_LOAD_EVACUATE_COMPLETE } from "../../../store/actions/types";
import { useNavigate } from "react-router";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "16px",
};

function RealTimeEvacuationMap({ GetWorkSiteByID, GetMusterStation, WorkOrderReducer, WorksiteReducer }) {
  const [allMemberEv, setAllMemberEv] = useState([]);
  const [directionsList, setDirectionsList] = useState([]);
  const { worksiteDetail, musterStation, musterStationLoading } = WorksiteReducer
  const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==");
  const currentEvacuation = localStorage.getItem("SSEq5#KJ&QYG^2hY&*&X$A8_/aA^y8==");
  const isResolved = localStorage.getItem("$%^YHAS5(UA*&TSDY&&X$A8_/aA^IUY8==");

  const circleRef = useRef(null);

  useEffect(() => {
    GetMusterStation(currentWorkSite)
    GetWorkSiteByID(currentWorkSite)
  }, [])




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
  const [musterStorage, setMusterStorage] = useState();
  useEffect(() => {
    const NewPayload = Array.isArray(musterStation)
      ? musterStation.map((dataKK) => ({
        title: dataKK?.title || "",
        polygon: JSON.stringify(dataKK?.polygon || []),
        id: dataKK?._id || null,
      }))
      : [];
    setMusterStorage(NewPayload);
  }, [musterStation])


  useEffect(() => {
    const NewPayload = Array.isArray(musterStation)
      ? musterStation.map((dataKK) => ({
        title: dataKK?.title || "",
        polygon: JSON.stringify(dataKK?.polygon || []),
        id: dataKK?._id || null,
      }))
      : [];
    if (!NewPayload || !Array.isArray(NewPayload)) return;
    const parsedPolygons = NewPayload
      .map((data) => {
        try {
          return { ...(JSON.parse(data?.polygon || "{}")), _id: data?.id };
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


  const drawMusterCircle = (a, b, c, index1, circle2) => {
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
      zIndex: 999,
    });

    // Hidden marker (used only as an anchor for InfoWindow)
    const anchorMarker = new window.google.maps.Marker({
      position: a,
      map: mapRef.current,
      visible: false, // invisible but used for anchoring
    });

    // Info window styled nicely
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
      headerDisabled: true,
      disableAutoPan: true,
      pixelOffset: new window.google.maps.Size(0, 10),
    });

    // Hover events
    const showInfo = () => {
      infoWindow.open({
        map: mapRef.current,
        anchor: anchorMarker, // opens directly above circle center
      });
    };

    const hideInfo = () => infoWindow.close();

    parent.addListener('click', showInfo);
    parent.addListener('mouseout', hideInfo);

    circleRef.current = parent;
  };


  // Muster Station
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const directionsRef = useRef({});

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY",
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    // setTimeout(() => {
    //   const projection = map.getProjection();
    //   if (!projection) return;
    //   const currentCenter = map.getCenter();
    //   const zoom = map.getZoom();
    //   const scale = Math.pow(2, zoom);
    //   const worldCenter = projection.fromLatLngToPoint(currentCenter);
    //   const offsetX = (window.innerWidth * 0.04) / scale;
    //   const newCenter = projection.fromPointToLatLng(
    //     new window.google.maps.Point(worldCenter.x - offsetX, worldCenter.y)
    //   );
    //   map.setCenter(newCenter);
    // }, 500);
  }, []);


  const [memderLoading, setMemberLoading] = useState(false)

  useEffect(() => {
    if (!isLoaded) return;
    setMemberLoading(true)

    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const socket = io(`${baseUrl}/chat`, {
      transports: ["websocket"],
      query: { authorization: `Bearer ${token}` },
    });

    socket.on("connect", () => {
      socket.emit("getEvacuationMembers", {
        evacuationId: currentEvacuation,
      });

      socket.on("getMember", (data) => {
        const members = data?.evacuationMembers?.map((m) => ({
          name: `${m?.member_id?.firstName} ${m?.member_id?.lastName}`,
          _id: m?.member_id?._id,
          MemberID: m._id,
          currectLocation: {
            lat: m?.member_id?.currentLatitude,
            lng: m?.member_id?.currentLongitude,
          },
          email: m?.member_id?.email,
          cell: m?.member_id?.cell,
          musterStation: m?.evacuationStatus == "arrived" ? "" : m?.muster_id ? m?.muster_id : "",
          status: m?.evacuationStatus,
          role: m?.member_id?.role_id?.roleName,
          type: m?.type,
        }));
        setAllMemberEv(members || []);
        setMemberLoading(false);
      });

    });


    socket.on("getUser", (updatedMember) => {
      const id = updatedMember?.user?.[0]?._id;
      const marker = markersRef.current[id];
      if (!marker) return;

      const newPos = {
        lat: updatedMember?.user[0].currentLatitude,
        lng: updatedMember?.user[0].currentLongitude,
      };

      marker.setPosition(newPos);

      if (workSiteMarker) {
        const service = new window.google.maps.DirectionsService();
        service.route(
          {
            origin: newPos,
            destination: workSiteMarker,
            travelMode: window.google.maps.TravelMode.WALKING,
          },
          (result, status) => {
            if (status === "OK") {
              directionsRef.current[id] = result;
              setDirectionsList(Object.values(directionsRef.current));
            }
          }
        );
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [isLoaded, currentEvacuation]);








  useEffect(() => {
    if (!allMemberEv?.length || !window.google || !musterStorage?.length) return;

    const service = new window.google.maps.DirectionsService();

    const requests = allMemberEv
      .filter(member => member?.musterStation)
      .map(member => {
        const muster = musterStorage.find(m => m?.id === member?.musterStation);
        if (!muster) return null;

        let coords;
        try {
          const polygon = JSON.parse(muster.polygon);
          coords = { lat: polygon.latitude, lng: polygon.longitude };
        } catch (err) {
          return null;
        }

        return new Promise((resolve) => {
          service.route(
            {
              origin: member.currectLocation,
              destination: coords,
              travelMode: google.maps.TravelMode.WALKING,
            },
            (result, status) => {
              if (status === "OK") {
                const enrichedResult = {
                  id: member._id,
                  musterStation: member.musterStation,
                  directions: result,
                };

                directionsRef.current[member._id] = enrichedResult;
                resolve(enrichedResult);
              } else {
                console.warn("Directions failed:", status);
                resolve(null);
              }
            }
          );
        });
      })
      .filter(Boolean);

    Promise.allSettled(requests).then(() => {
      const dirs = Object.values(directionsRef.current);
      setDirectionsList(dirs);
    });

  }, [allMemberEv, musterStorage]);






  const [hoverInfo, setHoverInfo] = useState({
    position: null,
    index: null,
    type: null,
  });

  const [activeMarker, setActiveMarker] = useState()

  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
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





  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google) return;

    setTimeout(() => {
      const projection = map.getProjection();
      if (!projection) return;

      const bounds = map.getBounds();
      if (!bounds) return;

      const center = map.getCenter();
      const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
      const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
      const scale = Math.pow(2, map.getZoom());

      const centerPoint = projection.fromLatLngToPoint(center);

      const offsetX = (topRight.x - bottomLeft.x) * 0.2;
      const newCenter = projection.fromPointToLatLng({
        x: centerPoint.x - offsetX,
        y: centerPoint.y,
      });

      map.panTo(newCenter);
    }, 300);
  }, [isLoaded, allMemberEv]);








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
    });

    return worksiteParent;
  };


  const [workSiteMarker, setWorkSiteMarker] = useState(null)
  const [pointsWorkSite, setPointsWorkSite] = useState([]);
  const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);


  useEffect(() => {
    const firstLocation = worksiteDetail?._doc?.polygon?.locations?.[0];
    if (firstLocation) {
      setLocation({
        lat: Number(firstLocation[0]),
        lng: Number(firstLocation[1]),
      })
    }
    if (worksiteDetail?._doc?.polygon?.type == "Circle") {
      const killtime = setTimeout(() => {
        drawCircleWorkSite({
          lat: Number(firstLocation[0]),
          lng: Number(firstLocation[1]),
        }, worksiteDetail?._doc?.polygon.radius, worksiteDetail?._doc?.polygon?.safetyZone)
        setWorkSiteMarker({
          lat: Number(firstLocation[0]),
          lng: Number(firstLocation[1]),
        });
      }, 1000);
      return () => {
        clearTimeout(killtime)
      }
    }
    if (worksiteDetail?._doc?.polygon?.type == "Polygon") {
      setPointsWorkSite(
        worksiteDetail?._doc?.polygon?.locations?.map(([lat, lng]) => ({
          lat: Number(lat),
          lng: Number(lng),
        })) || []
      );
      let sumLat = 0;
      let sumLng = 0;
      const count = worksiteDetail?._doc?.polygon?.locations.length;
      worksiteDetail?._doc?.polygon?.locations.forEach(([latStr, lngStr]) => {
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
    if (worksiteDetail?._doc?.polygon?.type == "Polyline") {
      setPointsMoreWorkSite(
        worksiteDetail?._doc?.polygon?.locations?.map(([lat, lng]) => ({
          lat: Number(lat),
          lng: Number(lng),
        })) || []
      );
      let sumLat = 0;
      let sumLng = 0;
      const count = worksiteDetail?._doc?.polygon?.locations.length;
      worksiteDetail?._doc?.polygon?.locations.forEach(([latStr, lngStr]) => {
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
  }, [worksiteDetail?._doc])



  const [filterStates, setFilterState] = useState("")


  const dispatch = useDispatch()
  const navigate = useNavigate();

  const prevEvacuationData = useSelector(
    (state) => state.EvacuateReducer.EvacauteData || []
  );


  const statusChanged = () => {
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const socket = io(`${baseUrl}/chat`, {
      transports: ["websocket"],
      query: { authorization: `Bearer ${token}` },
    });
    socket.on("connect", () => {
      socket.emit("updateEvacuationResolvedStatus", {
        evacuationId: currentEvacuation,
        isResolved: true,
        worksiteId: currentWorkSite,
      });
    });
    navigate("/evacuate/list")
    dispatch({
      type: TASK_LOAD_EVACUATE_COMPLETE,
      loading: false,
      payload: [
        ...prevEvacuationData.map((data) =>
          data._id === currentEvacuation ? { ...data, isResolved: true } : data
        ),
      ],
    });
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,        // desktop default
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };



  if (!isLoaded) return <div>Loading Map...</div>;
  return (
    <div className={Style.Container}>
      <div className={Style.FloaterBubble}>
        <div className={Style.FloaterContainer}>
          <div className={Style.FloatingFilter}>
            <div onClick={() => setFilterState("")} style={{ background: filterStates == "" && "#214CBC", color: filterStates == "" && "white" }} className={Style.FloadIcon}>
              All
            </div>
            <div onClick={() => setFilterState("indanger")} style={{ background: filterStates == "indanger" && "#214CBC", color: filterStates == "indanger" && "white" }} className={Style.FloadIcon}>
              In Danger
            </div>
            <div onClick={() => setFilterState("arrived")} style={{ background: filterStates == "arrived" && "#214CBC", color: filterStates == "arrived" && "white" }} className={Style.FloadIcon}>
              Arrived
            </div>
            <div onClick={() => setFilterState("acknowledged")} style={{ background: filterStates == "acknowledged" && "#214CBC", color: filterStates == "acknowledged" && "white" }} className={Style.FloadIcon}>
              Acknowledged
            </div>
            <div onClick={() => setFilterState("noresponse")} style={{ background: filterStates == "noresponse" && "#214CBC", color: filterStates == "noresponse" && "white" }} className={Style.FloadIcon}>
              No Response
            </div>
          </div>
          {memderLoading == true ?
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin />
            </div>
            :
            <>
              {(() => {
                const filteredMembers = allMemberEv?.filter((data) => {
                  if (!data?.status) return false;

                  if (filterStates === "") {
                    return (
                      data?.status === "arrived" ||
                      data?.status === "acknowledged" ||
                      data?.status === "indanger"
                    );
                  }

                  return data?.status === filterStates;
                });

                if (!filteredMembers || filteredMembers.length === 0) {
                  return (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px 0",
                        color: "#9d9d9d",
                        fontSize: "14px",
                      }}
                    >
                      No evacuation members found
                    </div>
                  );
                }

                return filteredMembers.map((member) => {
                  const directionEntry = directionsList?.find(
                    (dir) => dir?.id === member?._id
                  );
                  const leg = directionEntry?.directions?.routes?.[0]?.legs?.[0];
                  const distanceMeters = leg?.distance?.value;
                  const duration = leg?.duration?.text;
                  const distanceMiles = distanceMeters
                    ? (distanceMeters / 1609.34).toFixed(2)
                    : null;

                  return (
                    <div key={member?._id}>
                      <div
                        onClick={() => {
                          setActiveMarker(member?._id);
                          setLocation(member?.currectLocation);
                        }}
                        className={Style.RunDpList}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className={Style.DPState}>
                            {member?.name?.split("")[0]}
                          </div>
                          <div style={{ marginLeft: 6 }}>
                            <p style={{ marginBlock: 0 }}>{member?.name}</p>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: 5,
                              }}
                            >
                              <Tag
                                color={
                                  member?.status === "noresponse"
                                    ? "#c4c1c1"
                                    : member?.status === "arrived"
                                      ? "green"
                                      : member?.status === "indanger"
                                        ? "red"
                                        : member?.status === "acknowledged"
                                          ? "yellow"
                                          : null
                                }
                              >
                                {member?.status === "noresponse"
                                  ? "No Response"
                                  : member?.status === "arrived"
                                    ? "Arrived"
                                    : member?.status === "indanger"
                                      ? "In Danger"
                                      : member?.status === "acknowledged"
                                        ? "Acknowledged"
                                        : null}
                              </Tag>


                              {isResolved == "false" &&
                                <>
                                  {distanceMiles && (
                                    <Tag color="blue">{distanceMiles} miles</Tag>
                                  )}
                                </>
                              }

                              {distanceMiles && (
                                <Tag
                                  style={{
                                    maxWidth: "100px",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                  }}
                                  color="#3e765d"
                                >
                                  {musterStation
                                    ?.filter(
                                      (ms) => ms?._id === member?.musterStation
                                    )
                                    .map((ms) => (
                                      <span key={ms._id}>{ms.title}</span>
                                    ))}
                                </Tag>
                              )}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                paddingTop: 5,
                              }}
                            >
                              <p
                                style={{
                                  marginBottom: 0,
                                  marginTop: 0,
                                  marginRight: 5,
                                }}
                              >
                                {member?.role}
                              </p>
                              {member?.type !== null && (
                                <Tag color="red">{member?.type}</Tag>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            marginTop: 0,
                            width: 300,
                          }}
                        >
                          {member?.cell && (
                            <p
                              style={{
                                marginBottom: 0,
                                marginTop: 5,
                                marginRight: 5,
                                color: "#9d9d9d",
                                width: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <img src={CallIcon} alt="" />
                              {member?.cell}
                            </p>
                          )}

                          <p
                            style={{
                              marginBottom: 0,
                              marginTop: 5,
                              color: "#9d9d9d",
                              width: 300,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <img src={SmSIcon} alt="" />
                            {member?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </>
          }
        </div>
      </div>

      {
        isResolved == "false" &&
        <>
          <div className={Style.FloatResolver}>
            <Popconfirm
              title="Resolve this Evacuation"
              description="Do you want to resolve this evacuation?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => { statusChanged() }}
            >
              <button>Resolve</button>
            </Popconfirm>
          </div>
        </>
      }


      {
        memderLoading == true ?
          <div className={Style.bottomScroll}>
            <Carousel dots={false} arrows={false} centerPadding={"50px"}>
              <div className={Style.RunDpList21}>
                <Spin />
              </div>
            </Carousel>
          </div>
          :
          <>
            <div className={Style.bottomScroll}>
              <Carousel {...settings}>
                {allMemberEv?.map(member => {
                  const directionEntry = directionsList?.find(dir => dir?.id === member?._id);
                  const leg = directionEntry?.directions?.routes?.[0]?.legs?.[0];
                  const distanceMeters = leg?.distance?.value;
                  const duration = leg?.duration?.text;
                  const distanceMiles = distanceMeters ? (distanceMeters / 1609.34).toFixed(2) : null;

                  return (
                    <div className="slide" key={member?._id}>
                      <div
                        onClick={() => {
                          setActiveMarker(member?._id);
                          setLocation(member?.currectLocation);
                        }}
                        className={Style.RunDpList}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className={Style.DPState}>
                            {member?.name?.split("")[0]}
                          </div>
                          <div style={{ marginLeft: 6 }}>
                            <p style={{ marginBlock: 0 }}>{member?.name}</p>
                            <div style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
                              <Tag
                                color={
                                  member?.status === "noresponse"
                                    ? "orange"
                                    : member?.status === "arrived"
                                      ? "green"
                                      : member?.status === "indanger"
                                        ? "red"
                                        : member?.status === "acknowledged"
                                          ? "yellow"
                                          : null
                                }
                              >
                                {member?.status}
                              </Tag>

                              <>
                                {isResolved == "false" &&
                                  <>
                                    {distanceMiles && (
                                      <Tag color="blue">
                                        {distanceMiles} miles
                                      </Tag>
                                    )}
                                  </>
                                }
                              </>


                              {distanceMiles && (
                                <Tag style={{ maxWidth: '100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} color="#3e765d">
                                  {musterStation
                                    ?.filter(ms => ms?._id === member?.musterStation)
                                    .map(ms => (
                                      <span key={ms._id}>{ms.title}</span>
                                    ))}
                                </Tag>
                              )}
                            </div>
                            <div>
                              <p style={{ marginBottom: 0, marginTop: 5 }}>{member?.role}</p>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            marginTop: 5,
                            width: 300,
                          }}
                        >
                          {member?.cell && (
                            <p
                              style={{
                                marginBottom: 0,
                                marginTop: 5,
                                marginRight: 5,
                                color: "#9d9d9d",
                                width: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <img src={CallIcon} />
                              {member?.cell}
                            </p>
                          )}

                          <p
                            style={{
                              marginBottom: 0,
                              marginTop: 5,
                              color: "#9d9d9d",
                              width: 300,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <img src={SmSIcon} />
                            {member?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </>
      }


      <GoogleMap
        options={{
          mapTypeId: "satellite",
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          gestureHandling: "greedy",
          disableDefaultUI: false,
          clickableIcons: true,
          keyboardShortcuts: false,
          draggable: true,
          panControl: false,
          zoomControl: false,
          scrollwheel: true,
          restriction: null,
          cameraControl: false
        }}
        onLoad={onMapLoad}
        center={location}
        onClick={() => setActiveMarker(null)}
        zoom={14}
        mapContainerStyle={containerStyle}
      // onMouseOut={}
      // onMouseOut={() => setActiveMarker(null)}
      >

        {allMemberEv.map((m) => (
          <Marker
            key={m._id}
            position={m.currectLocation}
            icon={{
              url: userLocation,
              scaledSize: new window.google.maps.Size(60, 70),
            }}
            onMouseOver={() => setActiveMarker(m._id)}
            onMouseOut={() => setActiveMarker(null)}
            onLoad={(marker) => {
              markersRef.current[m._id] = marker;
            }}
          >
            {activeMarker === m._id && (
              <InfoWindow
                position={m.currectLocation}
                onCloseClick={() => setActiveMarker(null)}
                options={{
                  headerDisabled: true
                }}
              >
                <div>
                  <div className={Style.RunDpList2}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className={Style.DPState}>
                        {m?.name?.split("")[0]}
                      </div>
                      <div style={{ marginLeft: 6 }}>
                        <p style={{ marginBlock: 0, }}>{m?.name}</p>
                        <Tag color={m?.status == "noresponse" ? "orange" : m?.status == "arrived" ? "green" : m?.status == "indanger" ? 'red' : m?.status == "acknowledged" ? 'yellow' : null}>
                          {m?.status}
                        </Tag>
                      </div>
                    </div>

                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
        {/* All routes */}
        {/* Work Site Polygon */}
        {pointsWorkSite.length >= 1 && (
          <Polygon
            path={[...pointsWorkSite, pointsWorkSite[0]]}
            options={{
              fillColor: '#0d1e4b',
              fillOpacity: 0.4,
              strokeColor: '#050c1f',
              strokeOpacity: 1,
              strokeWeight: 2,
              zIndex: 100
            }}
          />
        )}
        {pointsMoreWorkSite.length >= 2 && (
          <Polyline
            path={pointsMoreWorkSite}
            options={{
              strokeColor: '#050c1f',
              strokeOpacity: 1,
              strokeWeight: 2,
              zIndex: 100
            }}
          />
        )}


        {workSiteMarker && (
          <Marker
            position={workSiteMarker}
            icon={{
              url: WorkSiteIcon,
              scaledSize: new window.google.maps.Size(80, 80),
            }}
          />
        )}


        {isResolved == "false" &&
          <>
            {directionsList.map((dir) => {
              return (
                <React.Fragment key={`${dir.id}-${dir.id === activeMarker}`}>
                  <DirectionsRenderer
                    directions={dir.directions}
                    options={{
                      suppressMarkers: true,
                      polylineOptions: {
                        strokeColor: dir.id === activeMarker ? "#cf1322" : "#214cbc",
                        strokeOpacity: 0.9,
                        strokeWeight: 5,
                        zIndex: dir.id === activeMarker ? 999 : 100
                      },
                    }}
                  />
                </React.Fragment>
              );
            })}
          </>
        }








        {/* Muster Station Polygon */}
        {pointsM?.map((polygonPoints = [], index) => {
          const padding = paddingM[index] || 0.5;
          const LineMCenter = polyGoneMCenter[index]
          const nameNewPolygon = polyGoneNameM[index];
          const safetyZone = getSafetyZonePathM(polygonPoints, padding);

          const isHovered = hoverInfo.index === index && hoverInfo.type === "polygon";

          return (
            <React.Fragment key={`polygon-${index}`}>
              <Polygon
                path={[...polygonPoints, polygonPoints[0]]}
                options={{
                  fillColor: "#548F1C",
                  fillOpacity: 0.4,
                  strokeColor: "#115638",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  zIndex: 999
                }}
                onClick={(e) =>
                  setHoverInfo({ position: e.latLng, index, type: "polygon" })
                }
                onMouseOut={() =>
                  setHoverInfo({ position: null, index: null, type: null })
                }
              />

              {isHovered && hoverInfo.position && (
                <InfoWindow position={hoverInfo.position} options={{ headerDisabled: true }}>
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


        {/* Muster Station polyLine */}
        <>
          {pointsMoreM?.map((polyline, index) => {
            const nameNewPolyline = polyLineNameM[index];
            const NewLineMCenter = polyLineMCenter[index];

            const isHovered = hoverInfo.index === index && hoverInfo.type === "polyline";
            return (
              <React.Fragment key={`polyline-${index}`}>
                {polyline.length >= 2 && (
                  <Polyline
                    path={polyline}
                    options={{
                      strokeColor: "#115638",
                      strokeOpacity: 1,
                      strokeWeight: 2,
                      zIndex: 999
                    }}
                    onClick={(e) =>
                      setHoverInfo({ position: e.latLng, index, type: "polyline" })
                    }
                    onMouseOut={() =>
                      setHoverInfo({ position: null, index: null, type: null })
                    }
                  />
                )}

                {isHovered && hoverInfo.position && (
                  <InfoWindow position={hoverInfo.position} options={{ headerDisabled: true }}>
                    <div
                      style={{
                        padding: "4px 8px",
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p className={Style.TootTopName}>{nameNewPolyline}</p>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            );
          })}
        </>
        {/* Muster Station polyLine */}

        {!locationToggle && (
          <div className={Style.OverMapFalse}>
            <p>Permission denied. Please allow location access in your browser or device settings.</p>
          </div>
        )}
      </GoogleMap>
    </div >
  );
}

function mapStateToProps({ WorkOrderReducer, WorksiteReducer }) {
  return { WorkOrderReducer, WorksiteReducer };
}
export default connect(
  mapStateToProps,
  { ...WorkSiteAction, ...WorkOrderAction, }
)(RealTimeEvacuationMap);