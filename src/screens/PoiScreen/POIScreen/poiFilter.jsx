import React, { useCallback, useEffect, useRef, useState } from "react";
import Style from "./workOrderScreen.module.css";
import { MdOutlineFilterList, MdOutlineLocationSearching } from "react-icons/md";
import { Checkbox, Col, DatePicker, Drawer, Input, Modal, Radio, Row, Slider, Tooltip } from "antd";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import myLocationMarker from "../../../assets/myLocationMarker.png";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from "react-redux";
import { TASK_GET_POI_ARCHIVED_COMPLETE, TASK_GET_POI_COMPLETE } from "../../../../store/actions/types";


const DEFAULT_EXTRA_DATA = { name: '', type: '' };


const PoiFilter = ({ setPage, setIsNext, loading, GetPOI, workSite, page, searchQuery, setParamsNew }) => {
    dayjs.extend(customParseFormat);
    const [polygonType, setPolygonType] = useState([]);
    const dispatch = useDispatch()
    const [assetsFilter, setAssteFilter] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null)
    const [sortBy, setSortBy] = useState('newest')
    const [searchLocation, setSearchLocation] = useState(null);

    const [radius, setRadius] = useState(1)
    const [searchValue, setSearchValue] = useState("")
    const [submitAfterClear, setSubmitAfterClear] = useState(false)
    const onShowAssetsDrawer = () => {
        setAssteFilter(true);
    };
    const onCloseAssetsDrawer = () => {
        const drawerBody = document.querySelector(".ant-drawer-body");
        if (drawerBody) {
            drawerBody.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
        setAssteFilter(false);
    };


    const RemoveAssetFilter = () => {
        if (loading) return;
        setThreatFilter([]);
        setElevationFilter([]);
        setPolygonType([]);
        setSortBy('newest');
        setRadius(1);
        setExtraDataState(DEFAULT_EXTRA_DATA);
        setSelectedPosition(null)
        setSearchLocation(null)
        setSearchValue("")
        setValue1(null)
        setSubmitAfterClear(true)
    }




    // Extra Data


    const [extraDataState, setExtraDataState] = useState(DEFAULT_EXTRA_DATA);









    const [threatFilter, setThreatFilter] = useState([]);
    const AddTypeKeyThreat = (UpperParams) => {
        setThreatFilter((prev) => {
            if (prev.includes(UpperParams)) {
                return prev.filter(item => item !== UpperParams);
            } else {
                return [...prev, UpperParams];
            }
        });
    };


    const [elevationFilter, setElevationFilter] = useState([]);
    const AddElevationTypeKey = (UpperParams) => {
        setElevationFilter((prev) => {
            if (prev.includes(UpperParams)) {
                return prev.filter(item => item !== UpperParams);
            } else {
                return [...prev, UpperParams];
            }
        });
    };







    const submitParam = async () => {
        const params = {
            sortBy,
            threatFilter,
            elevationFilter,
            extraData: extraDataState,
            location: selectedPosition ? { ...selectedPosition, radius } : null,
            polygonType,
        };
        dispatch({
            type: TASK_GET_POI_COMPLETE,
            loading: false,
            payload: [],
        });
        dispatch({
            type: TASK_GET_POI_ARCHIVED_COMPLETE,
            loading: false,
            payload: [],
        });
        setParamsNew(params)
        if (page == 1) {
            const totalLegngth = await GetPOI(workSite, 1, searchQuery, params, setIsNext)
        }
        const drawerBody = document.querySelector(".ant-drawer-body");
        if (drawerBody) {
            drawerBody.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
        setPage(1)
        setAssteFilter(false);
    }

    useEffect(() => {
        if (!submitAfterClear) return;
        setSubmitAfterClear(false);
        submitParam();
    }, [submitAfterClear, submitParam]);



    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
    });
    const StyleLocation = { width: '100%', height: 200 }
    const StyleLocation2 = { width: "100%", height: 500 }




    const mapRef1 = useRef()

    const onMapLoad1 = useCallback((map) => {
        mapRef1.current = map;
    }, []);


    const mapRef2 = useRef()

    const onMapLoad2 = useCallback((map) => {
        mapRef2.current = map;
    }, []);





    const [searchLocationModal, setsearchLocationModal] = useState(false);
    const showLocationModal = () => {
        setsearchLocationModal(true);
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setSearchLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setSelectedPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            },
        );
    };
    const handleLocationCancel = () => {
        setsearchLocationModal(false);
    };



    const [width, setWidth] = useState(window.innerWidth);


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





    const handleRecenter = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (mapRef1.current && mapRef2.current) {
                    mapRef1.current.panTo(new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    mapRef1.current.setZoom(18);
                    mapRef2.current.panTo(new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    mapRef2.current.setZoom(18);
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

    const AddTypeKey = (UpperParams) => {
        setPolygonType((prev) => {
            if (prev.includes(UpperParams)) {
                return prev.filter(item => item !== UpperParams);
            } else {
                return [...prev, UpperParams];
            }
        });
    };

    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateFormat2 = 'YYYY-MM-DD';
    return (
        <>

            <Modal
                title="Select Search"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={searchLocationModal}
                onCancel={handleLocationCancel}
                width={width < 1000 ? "100%" : width < 1550 ? "100%" : "35%"}
                centered={width < 1000 ? false : width < 1550 ? true : true}
                style={{ top: width < 1000 ? 10 : width < 1550 ? 0 : 0 }}
                footer={() => { <></> }}
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
            >
                <div className={Style.SearchLocationType}>
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
                            isClearable: true,
                        }}
                        debounce={400}
                        minLengthAutocomplete={2}
                    />
                </div>


                <div style={{ paddingTop: 20 }}>
                    {isLoaded &&
                        <GoogleMap
                            mapContainerStyle={StyleLocation2}
                            center={searchLocation}
                            onLoad={onMapLoad2}
                            onClick={(e) => {
                                setSearchLocation({
                                    lat: e.latLng.lat(),
                                    lng: e.latLng.lng()
                                });
                                setSelectedPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                            }}
                            zoom={12}
                            ref={mapRef2}
                            options={{
                                mapTypeId: "satellite",
                                mapTypeControl: false,
                                cameraControl: false,
                                clickableIcons: false,
                                streetViewControl: false,
                                fullscreenControl: false,

                            }}
                        >
                            <Marker
                                position={selectedPosition}
                                icon={{
                                    url: myLocationMarker,
                                    scaledSize: new window.google.maps.Size(40, 50),
                                }}
                            />
                            <div className={Style.PolyCenter}>
                                <Tooltip title="Move to current location" placement="leftTop">
                                    <div onClick={handleRecenter} className={Style.PolyDot}>
                                        <MdOutlineLocationSearching size={20} color="black" />
                                    </div>
                                </Tooltip>
                            </div>
                        </GoogleMap>
                    }
                </div>
            </Modal>

            <Drawer
                title={"Apply Filter"}
                onClose={onCloseAssetsDrawer}
                open={assetsFilter}
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
                <>
                    <Row>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Sort by</label>
                                </div>
                                <Radio.Group
                                    name="radiogroup"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    disabled={loading}
                                    options={[
                                        { value: 'newest', label: 'Newest first' },
                                        { value: 'recently_updated', label: 'Last updated' },
                                        { value: 'title_asc', label: 'Title Ascending' },
                                        { value: 'title_desc', label: 'Title Descending' },
                                        { value: 'threat_level', label: 'Threat Level (No to extreme)' },
                                        { value: 'threat_level_desc', label: 'Threat Level (Extreme to no)' },
                                        { value: 'elevation_level_asc', label: 'Elevation Level (Below to overhead)' },
                                        { value: 'elevation_level_desc', label: 'Elevation Level (Overhead to below)' },
                                    ]}
                                />
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Select Threat Level</label>
                                    <label onClick={() => loading ? null : setThreatFilter([])} className={Style.ResetButton}>Reset</label>
                                </div>
                                <div>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKeyThreat("No Threat")} checked={threatFilter.includes('No Threat') ? true : false} defaultChecked={false}>No Risk</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKeyThreat("Lowest")} checked={threatFilter.includes('Lowest') ? true : false} defaultChecked={false}>Lowest Risk</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKeyThreat("Moderate")} checked={threatFilter.includes('Moderate') ? true : false} defaultChecked={false}>Moderate Risk</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKeyThreat("High")} checked={threatFilter.includes('High') ? true : false} defaultChecked={false}>High Risk</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKeyThreat("Extreme")} checked={threatFilter.includes('Extreme') ? true : false} defaultChecked={false}>Extreme Risk</Checkbox>
                                </div>
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Select Elevation Level</label>
                                    <label onClick={() => loading ? null : setElevationFilter([])} className={Style.ResetButton}>Reset</label>
                                </div>
                                <div>
                                    <Checkbox disabled={loading} onClick={() => AddElevationTypeKey("Below Ground")} checked={elevationFilter.includes('Below Ground') ? true : false} defaultChecked={false}>Below ground</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddElevationTypeKey("Ground Level")} checked={elevationFilter.includes('Ground Level') ? true : false} defaultChecked={false}>Ground level</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddElevationTypeKey("Overhead")} checked={elevationFilter.includes('Overhead') ? true : false} defaultChecked={false}>Overhead</Checkbox>
                                </div>
                            </div>
                        </Col>


                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label className={Style.LabelFilter}>Select Location</label>
                                    <label className={Style.ResetButton} onClick={() => {
                                        setSearchLocation(null)
                                        setSelectedPosition(null)
                                        setRadius(1)
                                    }}>Reset</label>
                                </div>
                                <div>
                                    {isLoaded &&
                                        <GoogleMap
                                            mapContainerStyle={StyleLocation}
                                            center={searchLocation ? searchLocation : { lat: 39.8283, lng: -98.5795 }}
                                            onLoad={onMapLoad1}
                                            onClick={showLocationModal}
                                            zoom={12}
                                            ref={mapRef1}
                                            options={{
                                                mapTypeId: "satellite",
                                                mapTypeControl: false,
                                                cameraControl: false,
                                                clickableIcons: false,
                                                streetViewControl: false,
                                                fullscreenControl: false,

                                            }}
                                        >
                                            <Marker
                                                position={selectedPosition}
                                                icon={{
                                                    url: myLocationMarker,
                                                    scaledSize: new window.google.maps.Size(40, 50),
                                                }}
                                            />

                                        </GoogleMap>
                                    }
                                </div>
                                {selectedPosition &&
                                    <div style={{ paddingTop: 20 }}>
                                        <label>Set Radius</label>
                                        <Slider value={radius} min={1} max={1000} onChange={(e) => setRadius(e)} />
                                    </div>
                                }
                            </div>
                        </Col>


                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol}>
                                <div>
                                    <div className={Style.ResetterIcon}>
                                        <label>Extra Data</label>
                                        <label
                                            onClick={() => loading ? null : setExtraDataState({
                                                name: '',
                                                type: '',
                                            })}
                                            className={Style.ResetButton}>Reset</label>
                                    </div>
                                    <Input value={extraDataState.name} disabled={loading} onChange={(e) => setExtraDataState(prev => ({ type: e.target.value == "" ? "" : prev.type == "" ? "Input" : prev.type, name: e.target.value }))} placeholder='Enter name' />
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <label>Value Type</label>
                                    <div className={Style.ValueTypeWrapper}>
                                        <div onClick={() => loading ? null : setExtraDataState(prev => ({ ...prev, type: "Input" }))} className={extraDataState.type == "Input" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Input</div>
                                        <div onClick={() => loading ? null : setExtraDataState(prev => ({ ...prev, type: "Boolean" }))} className={extraDataState.type == "Boolean" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Boolean</div>
                                        <div onClick={() => loading ? null : setExtraDataState(prev => ({ ...prev, type: "Date" }))} className={extraDataState.type == "Date" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Date</div>
                                        <div onClick={() => loading ? null : setExtraDataState(prev => ({ ...prev, type: "Color" }))} className={extraDataState.type == "Color" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Color</div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.FeildCol} style={{ marginTop: 16 }}>
                                <div className={Style.ResetterIcon}>
                                    <label>Select location type</label>
                                    <label onClick={() => loading ? null : setPolygonType([])} className={Style.ResetButton}>Reset</label>
                                </div>
                                <div>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKey("Polygon")} checked={polygonType.includes('Polygon') ? true : false} defaultChecked={false}>Polygon</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKey("Polyline")} checked={polygonType.includes('Polyline') ? true : false} defaultChecked={false}>Polyline</Checkbox>
                                    <Checkbox disabled={loading} onClick={() => AddTypeKey("Circle")} checked={polygonType.includes('Circle') ? true : false} defaultChecked={false}>Circle</Checkbox>
                                </div>
                            </div>

                        </Col>

                        <Col style={{ marginTop: 20 }} xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <button onClick={() => submitParam()} disabled={loading} style={{ opacity: loading ? 0.4 : 1, cursor: loading ? 'no-drop' : 'pointer' }} className={Style.ApplyBtn}>Apply</button>
                        </Col>
                        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                            <button onClick={() => RemoveAssetFilter()} disabled={loading} style={{ opacity: loading ? 0.4 : 1, cursor: loading ? 'no-drop' : 'pointer' }} className={Style.CancelBtn}>Remove all filter</button>
                        </Col>
                    </Row>

                </>
            </Drawer>

            <button onClick={onShowAssetsDrawer} className={Style.filterMainBtn}>
                <MdOutlineFilterList size={24} color="white" />
            </button>
        </>
    )
}

export default PoiFilter;
