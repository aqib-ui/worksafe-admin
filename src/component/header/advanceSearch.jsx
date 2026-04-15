import { Modal, Button, Carousel, Tag, Empty, Drawer, Checkbox, DatePicker, Slider, Tooltip, Spin, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Style from './header.module.css'
import { baseUrl } from '../../../store/config.json'
import ReactTimeAgo from "react-time-ago";
import { MdFilterList, MdOutlineLocationSearching } from "react-icons/md";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import myLocationMarker from "../../assets/myLocationMarker.png";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import bodyScrollLock from '../../scrollLock'




const AdvanceSearch = ({ advanceModalSearchModal, handleCancel }) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const WorkSite = localStorage.getItem('+AOQ^%^f0Gn4frTqztZadLrKg==')

    const [allResult, setAllResult] = useState()

    const totalCount =
        (allResult?.pois?.length ?? 0) +
        (allResult?.alerts?.length ?? 0) +
        (allResult?.projects?.length ?? 0) +
        (allResult?.workorders?.length ?? 0) +
        (allResult?.assets?.length ?? 0);
    const [allComp, setAllComp] = useState([{ id: totalCount ?? 0, value: "All" }, { id: allResult?.pois?.length ?? 0, value: "POIs" }, { id: allResult?.alerts?.length ?? 0, value: "Alerts" }, { id: allResult?.projects?.length ?? 0, value: "Projects" }, { id: allResult?.workorders?.length ?? 0, value: "Work Orders" }, { id: allResult?.assets?.length ?? 0, value: "Assets" }])
    const [seletctedComp, setSelectedComp] = useState("All")


    const [latestTab, setLatestTab] = useState([])
    const [radius, setRadius] = useState(1)
    const [searchValue, setSearchValue] = useState("")
    const [page, setPage] = useState(1)




    useEffect(() => {
        if (WorkSite !== null) {
            LoadSearch({ Query: searchValue })
        }
    }, [page])

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [allModuleList, setAllModuleList] = useState(['ALERTS', 'POIS', 'ASSETS', 'PROJECTS', 'WORKORDERS']);
    const [polygonType, setPolygonType] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null)
    const [searchLocation, setSearchLocation] = useState(null);
    const [isCreatedByMe, setIsCreatedByMe] = useState(false);
    const [searchGlobeLoad, setSearchGlobeLoad] = useState(false)
    const [pagination, setPagination] = useState()

    const LoadSearch = async ({ Query }) => {
        setSearchGlobeLoad(true)

        const bodyData = {
            modules: allModuleList || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            lat: selectedPosition?.lat || undefined,
            long: selectedPosition?.lng || undefined,
            radius: radius || undefined,
            query: Query || "",
            page: page || undefined,
            from_dashboard: false,
            created_by_me: isCreatedByMe || undefined,
            polygon_type: polygonType || undefined
        };

        const body = JSON.stringify(
            Object.fromEntries(Object.entries(bodyData).filter(([_, v]) => v !== undefined))
        );

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
            body: body
        };

        const response = await fetch(`${baseUrl}/global-search`, options);
        if (response.status == 200 || response.status == 201) {
            const res = await response.json();
            const totalCount2 =
                (res?.pois?.length ?? 0) +
                (res?.alerts?.length ?? 0) +
                (res?.projects?.length ?? 0) +
                (res?.workorders?.length ?? 0) +
                (res?.assets?.length ?? 0);
            setAllComp([{ id: totalCount2 ?? 0, value: "All" }, { id: res?.pois?.length ?? 0, value: "POIs" }, { id: res?.alerts?.length ?? 0, value: "Alerts" }, { id: res?.projects?.length ?? 0, value: "Projects" }, { id: res?.workorders?.length ?? 0, value: "Work Orders" }, { id: res?.assets?.length ?? 0, value: "Assets" }])
            setAllResult(res)
            setPagination(res.pagination)
            setLatestTab(seletctedComp == "All" ? [...res?.pois, ...res?.alerts, ...res?.projects, ...res?.workorders, ...res?.assets] : seletctedComp == "POIs" ? res.pois : seletctedComp == "Alerts" ? res?.alerts : seletctedComp == "Projects" ? res.projects : seletctedComp == "Work Orders" ? res.workorders : seletctedComp == "Assets" ? res.assets : [])
            setSearchGlobeLoad(false)
        }
        else if (response.status == 401) {
            localStorage.clear()
            window.location.reload();
            setSearchGlobeLoad(false)
        }
        else if (response.status == 403) {
            const res = await response.json();
            setSearchGlobeLoad(false)
            if ("roleUpdated" in res) {
                localStorage.clear()
                window.location.reload();
            }
            else {
                messageApi.destroy();
                messageApi.open({
                    type: "info",
                    content: "Payment expired",
                });
            }
        }
        else if (response.status == 404) {
            setSearchGlobeLoad(false)
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong",
            });
        }

    }

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const StyleLocation = { width: '100%', height: 200 }
    const StyleLocation2 = { width: "100%", height: 500 }



    useEffect(() => {
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
            },
        );

    }, []);


    const mapRef1 = useRef()

    const onMapLoad1 = useCallback((map) => {
        mapRef1.current = map;
    }, []);


    const mapRef2 = useRef()

    const onMapLoad2 = useCallback((map) => {
        mapRef2.current = map;
    }, []);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
    });





    const AddModuleInSpace = (UpperParams) => {
        setAllModuleList((prev) => {
            if (prev.includes(UpperParams)) {
                return prev.filter(item => item !== UpperParams);
            } else {
                return [...prev, UpperParams];
            }
        });
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

    const [searchLocationModal, setsearchLocationModal] = useState(false);
    const showLocationModal = () => {
        setsearchLocationModal(true);
    };
    const handleLocationCancel = () => {
        setsearchLocationModal(false);
    };




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




    const ResetMapLocation = () => {
        setSelectedPosition(null)
        setRadius(1)
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
            },
        );
    }

    const ResetDate = () => {
        setEndDate(null)
        setStartDate(null)
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
                    mapRef1.current.setZoom(14.5);
                    mapRef2.current.panTo(new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    mapRef2.current.setZoom(14.5);
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

    const searchTimeout = useRef(null);
    const searchWithQuery = (e) => {
        setSearchValue(e)
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            LoadSearch({ Query: e });
        }, 1000);
    }

    const checkPage = () => {
        if (pagination?.hasAlerts || pagination?.hasAssets || pagination?.hasPOI || pagination?.hasProjects || pagination?.hasWorkorders) {
            return false
        }
        else return true
    }


    const viewAlerts = (eId) => {
        localStorage.setItem("Pf_!9DqZ@+76MaL#CYxv3tr", eId)
        window.location.reload()
        window.location.href = '/alerts/read';
    }

    const viewPOIs = (eId) => {
        localStorage.setItem("Zk2@pHL5uy!6mW+L9/=2&y==", eId)
        window.location.reload()
        window.location.href = '/POI/read';
    }

    const viewAssets = (eId) => {
        localStorage.setItem("Wl2^gTP7ys&1aN$E5-/9hu==", eId)
        window.location.reload()
        window.location.href = '/assets/read';
    }
    const viewProject = (eId) => {
        localStorage.setItem("Nq5#eKY6uw^2hX$A8_/4jt==", eId)
        window.location.reload()
        window.location.href = '/project/read';
    }
    const viewWorkOrder = (eId) => {
        localStorage.setItem("Xy9#qLT7pw!5kD+M3/=8&v==", eId)
        window.location.reload()
        window.location.href = '/workorder/read';
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Global Search"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={advanceModalSearchModal}
                onCancel={handleCancel}
                width={width < 1000 ? "100%" : width < 1550 ? "100%" : "40%"}
                centered={width < 1000 ? false : width < 1550 ? true : true}
                style={{ top: width < 1000 ? 10 : width < 1550 ? 0 : 0 }}
                footer={() => { <></> }}
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
            >
                <div className={Style.HeaderSearch}>
                    <input type="text" onChange={(e) => searchWithQuery(e.target.value)} placeholder="What are you looking for?" />
                    <button onClick={showDrawer}>
                        <MdFilterList size={20} color="white" />
                    </button>
                </div>
                <div className={Style.CategoryTags}>
                    {allComp.map(data => {
                        return (
                            <div onClick={() => {
                                if (searchGlobeLoad) {
                                    return null
                                }
                                else {
                                    setSelectedComp(data.value)
                                    setLatestTab(data?.value == "All" ? [...allResult.pois, ...allResult?.alerts, ...allResult.projects, ...allResult.workorders, ...allResult.assets] : data?.value == "POIs" ? allResult.pois : data?.value == "Alerts" ? allResult?.alerts : data?.value == "Projects" ? allResult.projects : data?.value == "Work Orders" ? allResult.workorders : data?.value == "Assets" ? allResult.assets : [])
                                }
                            }} className={seletctedComp == data?.value ? Style.CategoryTagsChipsSelected : Style.CategoryTagsChips}>
                                <h6>
                                    {data.value} <span>({data.id})</span>
                                </h6>
                            </div>
                        )
                    }
                    )}
                </div>

                <div className={Style.ScrollOPS}>
                    {searchGlobeLoad ?
                        <div style={{ width: '100%', height: 500, display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                            <Spin />
                        </div>
                        :
                        <>
                            {Array.isArray(latestTab) && latestTab.length > 0 ? (
                                latestTab.map((item, index) => (
                                    seletctedComp == "All" ?
                                        <div className={Style.PosterMane} onClick={() => item.type === "asset" ? viewAssets(item?._id) : item.type == "project" ? viewProject(item._id) : item.type == "workorder" ? viewWorkOrder(item?._id) : item.type == "poi" ? viewPOIs(item?._id) : item.type == "alert" ? viewAlerts(item?._id) : null}>
                                            <div >
                                                {item.type === "asset" ?
                                                    <h6>{item?.assetType?.name}</h6>
                                                    :
                                                    <h6>{item?.title}</h6>
                                                }

                                                {item.type === "project" || item.type === "asset" ?
                                                    <>
                                                        {Array.isArray(item?.elevationLevels) && item?.elevationLevels?.length > 0 ? (
                                                            item?.elevationLevels.map((item, index) => (
                                                                <Tag color={"green"}>
                                                                    {item}
                                                                </Tag>
                                                            ))) : ""}
                                                    </>
                                                    : item.type === "workorder" ?
                                                        <Tag color={"orange"}>
                                                            {item?.priority}
                                                        </Tag>
                                                        :
                                                        <Tag color={item?.riskLevel == "Moderate" ? "orange" : item?.riskLevel == "No Threat" ? "green" : item?.riskLevel == "High" ? 'red' : item?.riskLevel == "Lowest" ? 'yellow' : null}>
                                                            {item?.riskLevel === "No Threat" ? "No Risk" : item?.riskLevel === "Lowest" ? "Lowest Risk" : item?.riskLevel === "Moderate" ? "Moderate Risk" : item?.riskLevel === "High" ? "High Risk" : item?.riskLevel === "Extreme" ? "Extreme Risk" : item?.riskLevel}
                                                        </Tag>
                                                }
                                            </div>
                                            <p>
                                                <ReactTimeAgo date={item?.createdAt} locale="en-US" />
                                            </p>
                                        </div>
                                        :
                                        <div className={Style.PosterMane} onClick={() => seletctedComp === "Assets" ? viewAssets(item?._id) : seletctedComp == "Projects" ? viewProject(item._id) : seletctedComp == "Work Orders" ? viewWorkOrder(item?._id) : seletctedComp == "POIs" ? viewPOIs(item?._id) : seletctedComp == "Alerts" ? viewAlerts(item?._id) : null}>
                                            <div >
                                                {seletctedComp === "Assets" ?
                                                    <h6>{item?.assetType?.name}</h6>
                                                    :
                                                    <h6>{item?.title}</h6>
                                                }

                                                {seletctedComp === "Projects" || seletctedComp === "Assets" ?
                                                    <>
                                                        {Array.isArray(item?.elevationLevels) && item?.elevationLevels?.length > 0 ? (
                                                            item?.elevationLevels.map((item, index) => (
                                                                <Tag color={"green"}>
                                                                    {item}
                                                                </Tag>
                                                            ))) : ""}
                                                    </>
                                                    : seletctedComp === "Work Orders" ?
                                                        <>
                                                            <p style={{ marginBottom: 5, color: "#214CBC" }}>{item.moduleType ? item.moduleType : "Unlinked"}</p>
                                                            <Tag color={"orange"}>
                                                                {item?.priority}
                                                            </Tag>
                                                        </>
                                                        :
                                                        <Tag color={item?.riskLevel == "Moderate" ? "orange" : item?.riskLevel == "No Threat" ? "green" : item?.riskLevel == "High" ? 'red' : item?.riskLevel == "Lowest" ? 'yellow' : null}>
                                                            {item?.riskLevel === "No Threat" ? "No Risk" : item?.riskLevel === "Lowest" ? "Lowest Risk" : item?.riskLevel === "Moderate" ? "Moderate Risk" : item?.riskLevel === "High" ? "High Risk" : item?.riskLevel === "Extreme" ? "Extreme Risk" : item?.riskLevel}
                                                        </Tag>
                                                }
                                            </div>
                                            <p>
                                                <ReactTimeAgo date={item?.createdAt} locale="en-US" />
                                            </p>
                                        </div>
                                ))
                            ) :
                                <div style={{ paddingTop: 50 }}>
                                    <Empty description={"No result found"} />
                                </div>
                            }
                        </>
                    }
                </div>
                <div className={Style.PaginationQuery}>
                    <button style={{ cursor: page <= 1 ? "no-drop" : "pointer" }} onClick={() => setPage(page <= 1 ? 1 : page - 1)}><MdKeyboardArrowLeft size={25} /></button>
                    <div className={Style.OnPageCC}>{page}</div>
                    <button style={{ cursor: checkPage() ? "no-drop" : "pointer" }} disabled={checkPage()} onClick={() => setPage(page + 1)}><MdOutlineKeyboardArrowRight size={25} /></button>
                </div>
            </Modal>


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
                title="Add Filters"
                placement={"right"}
                onClose={onClose}
                open={open}
                
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
            >
                <div className={Style.FilterBoxes}>
                    <h4>Add Module</h4>
                    <div>
                        <Checkbox defaultChecked={true} onClick={() => AddModuleInSpace("WORKORDERS")}>Work Orders</Checkbox>
                        <Checkbox defaultChecked={true} onClick={() => AddModuleInSpace("POIS")}>POIs</Checkbox>
                        <Checkbox defaultChecked={true} onClick={() => AddModuleInSpace("ASSETS")}>Assets</Checkbox>
                        <Checkbox defaultChecked={true} onClick={() => AddModuleInSpace("ALERTS")}>Alerts</Checkbox>
                        <Checkbox defaultChecked={true} onClick={() => AddModuleInSpace("PROJECTS")}>Projects</Checkbox>
                    </div>
                </div>
                <div className={Style.FilterBoxes}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4>Select Date Range</h4>
                        <h4 onClick={ResetDate} style={{ color: 'red', cursor: 'pointer' }}>Reset</h4>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 3 }}>
                                <label>Start Date</label>
                                <DatePicker
                                    inputReadOnly
                                    value={startDate ? dayjs(startDate) : null}
                                    onChange={(date) => {
                                        if (date) {
                                            const formatted = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS");
                                            setStartDate(formatted);
                                            if (endDate && dayjs(endDate).isBefore(date, "day")) {
                                                setEndDate(null);
                                            }
                                        } else {
                                            setStartDate(null);
                                        }
                                    }}
                                    disabledDate={(current) =>
                                        endDate ? current && current.isAfter(dayjs(endDate), "day") : false
                                    }
                                    style={{ height: 45, marginTop: 3 }}
                                />


                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingLeft: 3 }}>
                                <label>End Date</label>

                                <DatePicker
                                    inputReadOnly
                                    value={endDate ? dayjs(endDate) : null}
                                    onChange={(date) => {
                                        if (date) {
                                            const formatted = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS");
                                            setEndDate(formatted);
                                            if (startDate && dayjs(date).isBefore(startDate, "day")) {
                                                setEndDate(null);
                                            }
                                        } else {
                                            setEndDate(null);
                                        }
                                    }}
                                    disabledDate={(current) =>
                                        startDate ? current && current.isBefore(dayjs(startDate), "day") : false
                                    }
                                    style={{ height: 45, marginTop: 3 }}
                                />

                            </div>
                        </div>
                    </div>
                </div>



                <div className={Style.FilterBoxes}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4>Select Location</h4>
                        <h4 onClick={ResetMapLocation} style={{ color: 'red', cursor: 'pointer' }}>Reset</h4>
                    </div>
                    <div>
                        {isLoaded &&
                            <GoogleMap
                                mapContainerStyle={StyleLocation}
                                center={searchLocation}
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


                <div className={Style.FilterBoxes}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4>Select Location Type</h4>
                        <h4 onClick={() => {
                            setPolygonType([])
                        }} style={{ color: 'red', cursor: 'pointer' }}>Reset</h4>
                    </div>
                    <div>
                        <Checkbox onClick={() => AddTypeKey("Polyline")} checked={polygonType.includes('Polyline') ? true : false} defaultChecked={false}>Polyline</Checkbox>
                        <Checkbox onClick={() => AddTypeKey("Circle")} checked={polygonType.includes('Circle') ? true : false} defaultChecked={false}>Circle</Checkbox>
                        <Checkbox onClick={() => AddTypeKey("Polygon")} checked={polygonType.includes('Polygon') ? true : false} defaultChecked={false}>Polygon</Checkbox>
                    </div>
                </div>


                <div className={Style.FilterBoxes}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4>Filter All Created By Me</h4>
                        <Checkbox defaultChecked={false} checked={isCreatedByMe} onChange={(e) => setIsCreatedByMe(e.target.checked)} ></Checkbox>
                    </div>
                </div>

                <div style={{ paddingBottom: 20 }} className={Style.FilterBoxes}>
                    <button onClick={() => {
                        onClose()
                        LoadSearch({ Query: searchValue })
                        setSelectedComp(seletctedComp)
                    }}>Apply Filter</button>
                </div>
            </Drawer>
        </>
    )
}

export default AdvanceSearch;