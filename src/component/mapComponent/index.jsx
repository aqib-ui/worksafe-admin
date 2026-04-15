import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Circle, GoogleMap, InfoWindow, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import Style from './googleMap.module.css';
import Loader from '../loader';
import { IoEarthOutline } from "react-icons/io5";
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
  alertType
}) => {

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
  const removeCustomPoint = (indexRemover) => {
    setPolygonPoint(prev => prev?.filter((_, index) => index !== indexRemover));
  }
  // CustomArea










  // polyline
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
        polylineWidth + polylineSafetyZone
      );
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
      fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "rgb(18, 145, 84)" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "rgb(31, 88, 234)",
      strokeColor: alertType == "HAZARD" ? "rgb(210, 25, 41)" : alertType == "WEATHER" ? "rgb(14, 73, 84)" : alertType == "COMMUNICATION" ? "rgb(196, 146, 56)" : alertType == "SECURITY" ? "rgb(1, 100, 131)" : 'rgb(31, 88, 234)',
      fillOpacity: 0.6,
      strokeOpacity: 0.6,
      strokeWeight: 2,
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
      fillColor: 'rgb(33, 171, 112)',
      fillOpacity: 0.6,
      clickable: false,
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






  const VerifyMapShape = useCallback(() => {
    if (currectType === 0) return 2;
    if (currectType === 1) return (pointsPolyLine?.length >= 2 ? 1 : 3);
    if (currectType === 2) return (circleRef.current ? 1 : 2);
    if (currectType === 3) return (polygonPoint?.length >= 3 ? 1 : 4);
    return 2;
  }, [currectType, pointsPolyLine, polygonPoint]);





  // WorksiteCircle
  const worksiteParentRef = useRef(null);
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
      strokeColor: '#050c1f',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#0d1e4b',
      fillOpacity: 0.35,
      draggable: false,
      editable: false,
    });

    worksiteParentRef.current = circle;
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
                  if (currectType === 1) addPolyLine(e);
                  else if (currectType === 2) {
                    const { lat, lng } = getLatLng(e);
                    if (lat == null) return;
                    if (circleRef.current) {
                      circleRef.current.setCenter({ lat, lng });
                      setCircleCenter({ lat, lng })
                    }
                    if (childCircleRef.current) childCircleRef.current.setCenter({ lat, lng });
                  }
                  else if (currectType === 3) addPolygonPoint(e);
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
                          fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "rgb(31, 88, 234)",
                          strokeColor: alertType == "HAZARD" ? "rgb(210, 25, 41)" : alertType == "WEATHER" ? "rgb(14, 73, 84)" : alertType == "COMMUNICATION" ? "rgb(196, 146, 56)" : alertType == "SECURITY" ? "rgb(1, 100, 131)" : 'rgb(31, 88, 234)',
                          fillOpacity: 0.6,
                          strokeOpacity: 0.6,
                        }}
                      />
                      <Polygon
                        path={getSafetyZonePath()}
                        options={{
                          zIndex: 999,
                          fillColor: 'rgb(33, 171, 112)',
                          fillOpacity: 0.3,
                          strokeColor: 'rgb(33, 171, 112)',
                          strokeOpacity: 0.3,
                          strokeWeight: 0,
                        }}
                      />
                    </>
                  )}
                  {polygonPoint.map((point, index) => (
                    <Marker
                      key={`custom-${index}`}
                      position={point}
                      onClick={() => !isRead && removeCustomPoint(index)}
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
                      onClick={() => !isRead && removePoyLine(index)}
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
                        fillColor: 'rgb(33, 171, 112)',
                        fillOpacity: 0.3,
                        strokeColor: 'rgb(33, 171, 112)',
                        strokeOpacity: 0.3,
                        strokeWeight: 0,
                      }}
                    />
                  )}
                  {bandPolygon.length > 0 && (
                    <Polygon
                      path={bandPolygon}
                      options={{
                        zIndex: 999,
                        fillColor: alertType == "HAZARD" ? "#D32029" : alertType == "WEATHER" ? "#129154" : alertType == "COMMUNICATION" ? "#F4B740" : alertType == "SECURITY" ? "#016483" : "rgb(31, 88, 234)",
                        strokeColor: alertType == "HAZARD" ? "rgb(210, 25, 41)" : alertType == "WEATHER" ? "rgb(14, 73, 84)" : alertType == "COMMUNICATION" ? "rgb(196, 146, 56)" : alertType == "SECURITY" ? "rgb(1, 100, 131)" : 'rgb(31, 88, 234)',
                        fillOpacity: 0.6,
                        strokeOpacity: 0.6,
                        strokeWeight: 1,
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
                        scaledSize: new window.google.maps.Size(55, 65),
                      }}
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
                        fillColor: '#0d1e4b',
                        fillOpacity: 0.4,
                        strokeColor: '#050c1f',
                        strokeOpacity: 1,
                        strokeWeight: 2,
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
                        strokeColor: '#050c1f',
                        strokeOpacity: 1,
                        strokeWeight: 2,
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
                      scaledSize: new window.google.maps.Size(20, 28),
                    }}
                  />
                  {/* Center Icon */}
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
