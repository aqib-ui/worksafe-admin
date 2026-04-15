import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, Polygon, Polyline } from '@react-google-maps/api';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Popover, Tooltip } from 'antd';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaRegCircle } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlinePolyline, MdOutlineLocationSearching } from 'react-icons/md';
import Style from './googleMap.module.css';
import GiveWayIcon from '../../assets/give-way-icon-red.png'
import GiveWayIconRed from '../../assets/give-way-icon-red.png'
import evacuationIcon from '../../assets/evacuation.png'

const GoogleMapCreate = ({
  mapContainerStyle = { width: '100%', height: '100%' },
  center,
  zoom = 14.5,
  onMapLoad,
  onClick,
  mapOptions = {},
  selectedTab,
  locationToggle,
  circleRef,
  location,
  workSiteMarker,
  points = [],
  pointsWorkSite = [],
  pointsMoreWorkSite = [],
  pointsMore = [],
  offsetPolygon = [],
  myLocationMarker,
  WorkSiteIcon,
  padding,
  setPadding,
  safetyOffset,
  safetyOffsetMore,
  handleOffsetChange,
  setSafetyOffsetMore,
  altitude,
  setAltitude,
  drawCircle,
  drawCustomArea,
  drawPolyLine,
  removeIconCustomArea,
  removeIconCustomArea2,
  handleRecenter,
  requestLocationAgain,
  value1,
  locationDataFunc,
  getSafetyZonePath,
  readMap = false,
  locationCurrent,
  rightPolygon,
  leftPolygon,
  setOffset,
  polygonRef,
  handlePolygonClick,

  // Muster Station
  pointsM,
  paddingM,
  getSafetyZonePathM,
  pointsMoreM = [],
  offsetPolygonM = [],
  polyGoneNameM,
  polyLineNameM,
  mapKey = 0,
  polyGoneMCenter,
  polyLineMCenter,
  isMusterMap,
  isWorksite,
  isWorksiteCreate,
}) => {


  const renderSettingsPopover = () => {
    const offsetValue = circleRef?.current ? safetyOffset : points.length > 0 ? padding : safetyOffsetMore;
    const onOffsetChange = (e) => {
      const value = Number(e.target.value);
      if (circleRef?.current) handleOffsetChange(e);
      else if (points.length > 0) setPadding(value);
      else setSafetyOffsetMore(value);
    };


    return (
      <Popover
        content={() => (
          <div>
            {!isWorksiteCreate &&
              <div>
                <label>Safety Zone</label>
                <input
                  type="range"
                  min="0"
                  max="350"
                  step="10"
                  value={offsetValue}
                  onChange={onOffsetChange}
                />
              </div>
            }
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
        )}
        placement="left"
      >
        <div className={Style.PolyDot}>
          <IoSettingsOutline size={20} color="black" />
        </div>
      </Popover>
    );
  };
  const [hoverInfo, setHoverInfo] = useState({
    position: null,
    index: null,
    type: null,
  });



  const [activeMarker, setActiveMarker] = useState(null);
  const markerRefs = useRef({});

  const handleMouseOver = (id) => setActiveMarker(id);
  const handleMouseOut = () => setActiveMarker(null);

  return (
    <GoogleMap
      key={mapKey}
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onLoad={onMapLoad}
      onClick={onClick}
      options={{
        mapTypeId: "satellite",
        cameraControl: false,
        clickableIcons: false,
        streetViewControl: false,
        fullscreenControl: false,
        ...mapOptions,
      }}
    >
      {/* Main Area Polygon */}
      {points.length >= 1 && (
        <>
          <Polygon
            path={[...points, points[0]]}
            options={{
              zIndex: isMusterMap ? 999 : 10,
              fillColor: isMusterMap ? '#548F1C' : isWorksiteCreate ? '#0d1e4b' : '#fe541e',
              fillOpacity: 0.4,
              strokeColor: isMusterMap ? '#115638' : isWorksiteCreate ? '#050c1f' : '#fe541e',
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
          />
          {!isMusterMap &&
            <Polygon
              path={getSafetyZonePath()}
              options={{
                zIndex: isMusterMap ? 999 : 10,
                fillColor: isWorksiteCreate ? '#373834ff' : '#90caf9',
                fillOpacity: 0.2,
                strokeColor: isWorksiteCreate ? '#050c1f' : '#1e88e5',
                strokeOpacity: 0.7,
                strokeWeight: 2,
              }}
            />
          }
        </>
      )}
      {points.map((point, index) => (
        <Marker
          key={`custom-${index}`}
          position={point}
          onClick={() => removeIconCustomArea(index)}
          icon={{
            url: isMusterMap ? GiveWayIcon : GiveWayIconRed,
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      ))}



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
                zIndex: 888
              }}
            />

            <Marker
              key={`poly-${index}`}
              position={LineMCenter}
              onClick={() => handleMouseOver(index)}
              onMouseOut={handleMouseOut}
              onLoad={(marker) => (markerRefs.current[index] = marker)} icon={{
                url: evacuationIcon,
                scaledSize: new window.google.maps.Size(68, 80),
              }}
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
                    zIndex: 888
                  }}
                  onMouseOver={(e) =>
                    setHoverInfo({ position: e.latLng, index, type: "polyline" })
                  }
                  onMouseOut={() =>
                    setHoverInfo({ position: null, index: null, type: null })
                  }
                />
              )}
              <Marker
                key={`poly-${index}`}
                position={NewLineMCenter}
                // onClick={() => removeIconCustomArea2(index)}
                icon={{
                  url: evacuationIcon,
                  scaledSize: new window.google.maps.Size(68, 80),
                }}
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
                    <p className={Style.TootTopName}>{nameNewPolyline}</p>
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          );
        })}
      </>
      {/* Muster Station polyLine */}













      {/* Custom Area Markers */}
      {/* User Location Marker */}
      {locationCurrent && (
        <Marker
          position={locationCurrent}
          icon={{
            url: myLocationMarker,
            scaledSize: new window.google.maps.Size(40, 50),
          }}
        />
      )}



      {/* Work Site*/}

      {/* Work Site Marker */}
      {workSiteMarker && (
        <Marker
          onClick={selectedTab == 1 ? handlePolygonClick : onClick}
          position={workSiteMarker}
          icon={{
            url: WorkSiteIcon,
            scaledSize: new window.google.maps.Size(80, 80),
          }}
        />
      )}

      {/* Work Site Polygon */}
      {pointsWorkSite.length >= 1 && (
        <Polygon
          onClick={selectedTab == 1 ? handlePolygonClick : onClick}
          path={[...pointsWorkSite, pointsWorkSite[0]]}
          options={{
            fillColor: '#0d1e4b',
            fillOpacity: 0.4,
            strokeColor: '#050c1f',
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      )}


      {/* Work Site Polyline */}
      {pointsMoreWorkSite.length >= 2 && (
        <Polyline
          onClick={selectedTab == 1 ? handlePolygonClick : onClick}
          path={pointsMoreWorkSite}
          options={{
            strokeColor: '#050c1f',
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      )}



      {/* Work Site*/}














      {/* Additional Polyline */}
      {pointsMore.length >= 2 && (
        <Polyline
          path={pointsMore}
          options={{
            strokeColor: isMusterMap ? '#115638' : isWorksiteCreate ? '#050c1f' : '#fe541e',
            strokeOpacity: 1,
            strokeWeight: 2,
            zIndex: 888
          }}
        />
      )}

      {/* Safety Zone Around Polyline */}
      {offsetPolygon.length >= 3 && !isMusterMap && (
        <Polygon
          path={offsetPolygon}
          options={{
            fillColor: isWorksiteCreate ? '#373834ff' : '#90caf9',
            fillOpacity: 0.3,
            strokeColor: isWorksiteCreate ? '#050c1f' : '#1e88e5',
            strokeOpacity: 0.7,
            strokeWeight: 2,
          }}
        />
      )}




      {/* Polyline Markers */}
      {pointsMore.map((point, index) => (
        <Marker
          key={`poly-${index}`}
          position={point}
          onClick={() => removeIconCustomArea2(index)}
          icon={{
            url: isMusterMap ? GiveWayIcon : GiveWayIconRed,
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      ))}










      {!readMap &&
        <>
          {/* Settings Popover */}
          {!isMusterMap &&
            <>
              {(circleRef?.current || points.length > 0 || pointsMore.length > 0) && (
                <div className={Style.PolyCardSetting}>
                  {renderSettingsPopover()}
                </div>
              )}
            </>
          }
          {/* Map Control Buttons */}
          <div className={Style.PolyCard}>
            <Tooltip title="Circle" placement="leftTop">
              <div
                onClick={!locationToggle ? requestLocationAgain : !circleRef?.current ? drawCircle : null}
                className={selectedTab === 1 ? Style.PolyDotSelect : Style.PolyDot}
              >
                <FaRegCircle size={20} color="black" />
              </div>
            </Tooltip>
            <Tooltip title="Custom area" placement="leftTop">
              <div
                onClick={!locationToggle ? requestLocationAgain : drawCustomArea}
                className={selectedTab === 2 ? Style.PolyDotSelect : Style.PolyDot}
              >
                <AiOutlineEdit size={20} color="black" />
              </div>
            </Tooltip>
            {!isMusterMap &&
              < Tooltip title="Polyline" placement="leftTop">
                <div
                  onClick={!locationToggle ? requestLocationAgain : drawPolyLine}
                  className={selectedTab === 3 ? Style.PolyDotSelect : Style.PolyDot}
                >
                  <MdOutlinePolyline size={20} color="black" />
                </div>
              </Tooltip>
            }
          </div>

          {/* Search Bar */}
          <div className={Style.PolySearch}>
            <GooglePlacesAutocomplete
              apiKey="AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY"
              autocompletionRequest={{
                componentRestrictions: {
                  country: ['us'],
                },
              }}
              selectProps={{
                value: value1,
                placeholder: 'Search location...',
                onChange: locationDataFunc,
              }}
              debounce={400}
              minLengthAutocomplete={2}
            />
          </div>

          {/* Location Permission Warning */}
          {!locationToggle && (
            <div className={Style.OverMapFalse}>
              <p>Permission denied. Please allow location access in your browser or device settings.</p>
            </div>
          )}
        </>
      }
      {/* Recenter Button */}
      <div className={Style.PolyCenter}>
        <Tooltip title="Move to current location" placement="leftTop">
          <div onClick={!locationToggle ? requestLocationAgain : handleRecenter} className={Style.PolyDot}>
            <MdOutlineLocationSearching size={20} color="black" />
          </div>
        </Tooltip>
      </div>
    </GoogleMap >
  );
};

export default GoogleMapCreate;
