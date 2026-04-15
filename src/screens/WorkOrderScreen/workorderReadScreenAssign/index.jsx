import { useCallback, useEffect, useRef, useState } from 'react'
import Style from './workorderReadScreen.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Space, ConfigProvider, Modal, Image, Skeleton } from 'antd'
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect, useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { Circle, GoogleMap, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { FaRegCircle } from "react-icons/fa";
import { MdOutlineChevronRight, MdOutlineLocationSearching, MdOutlineModeEditOutline, MdOutlinePolyline } from "react-icons/md";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoTriangle } from "react-icons/io5";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { UploadOutlined } from '@ant-design/icons';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import WorkSiteIcon from "../../../assets/marker_worksites.png";
import myLocationMarker from "../../../assets/myLocationMarker.png";
import rightIcon from '../../../assets/icons/screenIcon/indicate-right.png'
import polylineBlue from '../../../assets/polylineBlue.png'
import customAreaBlue from '../../../assets/customAreaBlue.png'
import circleBlue from '../../../assets/circleBlue.png'
import { IoClose } from "react-icons/io5";
import redDoc from '../../../assets/red-Doc.png'
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import moreIcon from '../../../assets/more-Icon.png'
import editIcon from '../../../assets/editIcon.png'
import deletePersonalIcon from '../../../assets/deletePersonalIcon.png'
import removeIcon from '../../../assets/removeIcon.png'
import Dragger from 'antd/es/upload/Dragger';
import blueDoc from '../../../assets/blue-Doc.png'
import calendarDatePicker from '../../../assets/calendarDatePicker.png'
import MapWidget from '../../../component/mapComponent';
import blueCalender from '../../../assets/blueCalender.png'
import blueClock from '../../../assets/blueClock.png'
import { useDownloadNotification } from '../../../provider/downloadProvider';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { TASK_LOAD_ARCHIVED_COMPLETE, TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, TASK_LOAD_MY_WORK_ORDER_COMPLETE } from '../../../../store/actions/types';
import linkBlue from '../../../assets/link-blue.png'
import { baseUrl } from '../../../../store/config.json'
import { AWSUploadModule } from '../../../component/AWSUploadModule';






const WorkorderScreenReadAssign = ({ GetMyAssignedWorkOrder, GetMyWorkOrder, ArchiveWorkOrder, ApproveWorkOrder, DeclineWorkOrder, PermissionReducer, WorkOrderReducer, GetWorkSite, GetCompanyUser, WorkOrderGetById, GetAdminWorkSite, CompleteWorkOrder }) => {
    const current_Id = localStorage.getItem('Xy9#qLT7pw!5kD+M3/=8&v==')
    const currentWorkSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const dateFormat2 = 'YYYY-MM-DD';

    const AllContentPermission = PermissionReducer?.allPermission?.data?.role_id?.permissions || []

    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const dateFormat = 'YYYY-MM-DD hh:mm A';
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [messageApi, contextHolder] = message.useMessage();
    const Role_ID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')
    const [extraDataList, setExtraDataList] = useState([]);
    const [personanalDataList, setPersonanalDataList] = useState([]);

    const { workOrderGetByIDData, workSiteData, workOrderGetByIDDatLoading } = WorkOrderReducer


    const WorkPOIGetByIdDoc = async (body) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1000000);
        const url = `/assets/files/signed-urls`;
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        try {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ keys: body }),
                signal: controller.signal,
            };
            const response = await fetch(`${baseUrl}${url}`, options);
            const res = await response.json();
            if (response.status === 200 || response.status === 201) {
                return res || 0
            }
        } catch (error) {
            if (error.name === "AbortError") console.error("Request timed out");
        } finally {
            clearTimeout(timeout);
        }
    };


    const [document1, setDocument1] = useState([])
    const [document2, setDocument2] = useState([])
    const [document3, setDocument3] = useState([])
    const [document4, setDocument4] = useState([])

    const [docLoading, setDocLoading] = useState(false)
    useEffect(() => {
        let isMounted = true;
        let timeoutId;
        setDocLoading(true)
        const runEffect = async () => {
            if (!workOrderGetByIDData) return;
            if (
                Array.isArray(workOrderGetByIDData?.warrantyDocumentation) &&
                workOrderGetByIDData.warrantyDocumentation.length > 0 &&
                document1.length === 0
            ) {
                const filesWithPath = workOrderGetByIDData.warrantyDocumentation.map(
                    file => new URL(file.url).pathname.replace(/^\/+/, '')
                );
                const photoDoc = await WorkPOIGetByIdDoc(filesWithPath);
                if (isMounted) setDocument1(photoDoc);
            }
            if (
                Array.isArray(workOrderGetByIDData?.safetyDocumentation) &&
                workOrderGetByIDData.safetyDocumentation.length > 0 &&
                document2.length === 0
            ) {
                const filesWithPath = workOrderGetByIDData.safetyDocumentation.map(
                    file => new URL(file.url).pathname.replace(/^\/+/, '')
                );
                const photoDoc = await WorkPOIGetByIdDoc(filesWithPath);
                if (isMounted) setDocument2(photoDoc);
            }
            if (
                Array.isArray(workOrderGetByIDData?.photosOrVideos) &&
                workOrderGetByIDData.photosOrVideos.length > 0 &&
                document3.length === 0
            ) {
                const filesWithPath = workOrderGetByIDData.photosOrVideos.map(
                    file => new URL(file.url).pathname.replace(/^\/+/, '')
                );
                const photoDoc = await WorkPOIGetByIdDoc(filesWithPath);
                if (isMounted) setDocument3(photoDoc);
            }
            if (
                Array.isArray(workOrderGetByIDData?.jsaDocumentation) &&
                workOrderGetByIDData.jsaDocumentation.length > 0 &&
                document4.length === 0
            ) {
                const filesWithPath = workOrderGetByIDData.jsaDocumentation.map(
                    file => new URL(file.url).pathname.replace(/^\/+/, '')
                );
                const photoDoc = await WorkPOIGetByIdDoc(filesWithPath);
                if (isMounted) setDocument4(photoDoc);
            }
            setDocLoading(false)
        };
        runEffect();
        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [workOrderGetByIDData]);



    const fileNameMap = new Map(
        [...(workOrderGetByIDData?.photosOrVideos ?? []), ...(workOrderGetByIDData?.safetyDocumentation ?? []), ...(workOrderGetByIDData?.warrantyDocumentation ?? []), ...(workOrderGetByIDData?.jsaDocumentation ?? [])]?.map(file => [
            file.fileName,
            file,
        ]) || []
    );




    const matchedFiles1 =
        document1?.urls
            ?.map(item => {
                const decodedKey = decodeURIComponent(item.key);
                const matchedFile = [...fileNameMap.values()].find(file =>
                    decodedKey.endsWith(file.fileName)
                );
                return matchedFile
                    ? {
                        ...item,
                        fileName: matchedFile.fileName,
                        size: matchedFile.size,
                        mimeType: matchedFile.mimeType,
                    }
                    : null;
            })
            .filter(Boolean) || [];

    const matchedFiles2 =
        document2?.urls
            ?.map(item => {
                const decodedKey = decodeURIComponent(item.key);

                const matchedFile = [...fileNameMap.values()].find(file =>
                    decodedKey.endsWith(file.fileName)
                );

                return matchedFile
                    ? {
                        ...item,
                        fileName: matchedFile.fileName,
                        size: matchedFile.size,
                        mimeType: matchedFile.mimeType,
                    }
                    : null;
            })
            .filter(Boolean) || [];


    const matchedFiles3 =
        document3?.urls
            ?.map(item => {
                const decodedKey = decodeURIComponent(item.key);

                const matchedFile = [...fileNameMap.values()].find(file =>
                    decodedKey.endsWith(file.fileName)
                );

                return matchedFile
                    ? {
                        ...item,
                        fileName: matchedFile.fileName,
                        size: matchedFile.size,
                        mimeType: matchedFile.mimeType,
                    }
                    : null;
            })
            .filter(Boolean) || [];

    const matchedFiles4 =
        document4?.urls
            ?.map(item => {
                const decodedKey = decodeURIComponent(item.key);

                const matchedFile = [...fileNameMap.values()].find(file =>
                    decodedKey.endsWith(file.fileName)
                );

                return matchedFile
                    ? {
                        ...item,
                        fileName: matchedFile.fileName,
                        size: matchedFile.size,
                        mimeType: matchedFile.mimeType,
                    }
                    : null;
            })
            .filter(Boolean) || [];










    useEffect(() => {
        if (Role_ID == '6768f37ff2ef345b103370df') {
            GetAdminWorkSite()
        }
        else {
            GetWorkSite()
        }
        GetCompanyUser()
        WorkOrderGetById(current_Id)
    }, [])

    useEffect(() => {
        if (!messageApi) return;
        if (WorkOrderReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
    }, [
        WorkOrderReducer.networkError,
        messageApi,
    ]);



    const [addDrawer, setAddDrawer] = useState(false);

    const showAddDrawer = () => {
        setAddDrawer(true);
    };
    const closeAddDrawer = () => {
        setAddDrawer(false);
    };



    const [addExtraDrawer, setAddExtraDrawer] = useState(false);

    const showExtraDrawer = (e) => {

        setAddExtraDrawer(true);
    };
    const closeExtraDrawer = () => {
        setAddExtraDrawer(false);
    };

    const { downloadWorkOrderFile, fileLoader } = useDownloadNotification();


    const getDownloadDropdown = (id) => [
        {
            key: '2',
            label: (
                <>
                    <div style={{
                        opacity: fileLoader ? 0.3 : 1,
                        cursor: fileLoader ? "no-drop" : "pointer"
                    }} onClick={() => downloadWorkOrderFile(`/workorder/download-documents/${workOrderGetByIDData?._id}?format=pdf`, 'GET', 'pdf')} className={Style.DropdownOption2}>
                        <p>
                            Download PDF file
                        </p>
                    </div>
                </>
            ),
        },
        {
            key: '1',
            label: (
                <div style={{
                    opacity: fileLoader ? 0.3 : 1,
                    cursor: fileLoader ? "no-drop" : "pointer"
                }} onClick={() => downloadWorkOrderFile(`/workorder/download-documents/${workOrderGetByIDData?._id}?format=excel`, 'GET', 'excel')} className={Style.DropdownOption2}>
                    <p>
                        Download Excel file
                    </p>
                </div>
            ),
        },

    ];






    // map
    const [workSiteMarker, setWorkSiteMarker] = useState(null)
    const [pointsWorkSite, setPointsWorkSite] = useState([]);
    const [pointsMoreWorkSite, setPointsMoreWorkSite] = useState([]);








    useEffect(() => {
        setExtraDataList(workOrderGetByIDData?.extraFields ? workOrderGetByIDData?.extraFields : [])
        setPersonanalDataList(workOrderGetByIDData?.add_hours_worked ? JSON.parse(workOrderGetByIDData?.add_hours_worked) : [])
        const polygons = workSiteData?.find(data => data._id == currentWorkSite)?.polygon;

        const firstLocation = polygons?.locations?.[0];
        if (polygons?.type == "Circle") {
            const killtime = setTimeout(() => {
                childRefParent.current?.drawCircleWorkSite({
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
    }, [workSiteData])










    const [mapKey, setMapKey] = useState(0)
    const mapRefParent = useRef()


    const [selectedShape, setSelectShape] = useState(0);

    // polyline
    const [pointsPolyLine, setPointsPolyLine] = useState([]);
    const [bandPolygon, setBandPolygon] = useState([]);
    const [polylineWidth, setPolylineWidth] = useState(0)
    const [polylineSafety, setPolylineSafety] = useState(0)
    const [polylineElevation, setPolylineElevation] = useState(0)
    const [safetyZonePolyLine, setSafetyZonePolyLine] = useState([]);
    // polyline

    const [measureSetting, setMeasureSetting] = useState("m")
    const childRefParent = useRef();


    // circle
    const [circleRadius, setCircleRadius] = useState(100)
    const [circleSafety, setCircleSafety] = useState(0)
    const [circleElevation, setCircleElevation] = useState(0)
    const circleRef = useRef(null);
    const childCircleRef = useRef(null)
    const [circleCenter, setCircleCenter] = useState(null);
    // circle



    // custom area
    const [customAreaSafety, setCustomAreaSafety] = useState(0)
    const [customAreaElevation, setCustomAreaElevation] = useState(0)
    const [polygonPoint, setPolygonPoint] = useState([])
    // custom area


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBNcub-DQKtyV7GpWFt-B_sWS5VcFaYpaY',
    });






    // forCircle
    const drawWithRadiusBounds = (firstLocation, radius) => {
        const deltaLat = radius / 111320;
        const deltaLng = radius / (111320 * Math.cos(firstLocation?.lat * (Math.PI / 180)));
        const center = new window.google.maps.LatLng(firstLocation?.lat, firstLocation?.lng);
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(firstLocation?.lat + deltaLat, firstLocation?.lng + deltaLng));
        bounds.extend(new window.google.maps.LatLng(firstLocation?.lat - deltaLat, firstLocation?.lng - deltaLng));
        mapRefParent.current.fitBounds(bounds, {
            top: 50,
            bottom: 50,
            right: 50,
            left: window.innerWidth * 0.25,
        });
    };
    // forCircle


    // forPoints
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
        // setLocation(center);
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
        if (mapRefParent?.current) {
            mapRefParent.current.fitBounds(paddedBounds, {
                top: 50,
                bottom: 50,
                right: 50,
                left: window.innerWidth * 0.25,
            });
        }
    };
    // forPoints


    const dispatch = useDispatch()
    const navigate = useNavigate();
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")

    useEffect(() => {
        if (!messageApi) return;
        if (WorkOrderReducer.networkError) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "Something went wrong, please try again",
            });
        }
        if (WorkOrderReducer.workOrderOprationLoading) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Loading...",
            });
        }
        if (WorkOrderReducer.workOrderArchiveLoading) {
            messageApi.destroy();
            messageApi.open({
                type: "loading",
                content: "Loading...",
            });
        }
        if (WorkOrderReducer.workOrderIsArchived) {
            closeConfirm()
            messageApi.destroy();
            messageApi.open({
                type: "warning",
                content: "Work order moved to archive.",
            });
            setTimeout(() => {
                dispatch({ type: TASK_LOAD_MY_WORK_ORDER_COMPLETE, loading: true, payload: [] });
                dispatch({ type: TASK_LOAD_ASSIGEND_TO_ME_COMPLETE, loading: true, payload: [] });
                dispatch({ type: TASK_LOAD_ARCHIVED_COMPLETE, loading: true, payload: [] });
                window.location.href = '/workorder/assign-to-me';
            }, 2000);
        }
        if (WorkOrderReducer.workOrderIsApproved) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Work order approved",
            });
            window.location.href = '/workorder/assign-to-me';
        }
        if (WorkOrderReducer.workOrderIsDecline) {
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Work order decline",
            });
            window.location.href = '/workorder/assign-to-me';
        }
        if (WorkOrderReducer.workOrderIsCompleted) {
            cancelEditModal()
            messageApi.destroy();
            messageApi.open({
                type: "success",
                content: "Work order has been completed.",
            });
            setTimeout(() => {
                window.location.href = '/workorder/assign-to-me';
            }, 2000);
        }
        if (WorkOrderReducer.workOrderExpiredError) {
            messageApi.destroy();
            messageApi.open({
                type: "info",
                content: "Payment Expired",
            });
            const timeoutNavigate = setTimeout(() => {
                navigate('/')
            }, 1000);
            return () => {
                dispatch({ type: TASK_CLEAR_EXPIRED });
                clearTimeout(timeoutNavigate)
            }
        }
    }, [
        WorkOrderReducer.networkError,
        WorkOrderReducer.workOrderIsApproved,
        WorkOrderReducer.workOrderIsDecline,
        WorkOrderReducer.workOrderOprationLoading,
        WorkOrderReducer.workOrderArchiveLoading,
        WorkOrderReducer.workOrderIsArchived,
        WorkOrderReducer.workOrderExpiredError,
        WorkOrderReducer.workOrderIsCompleted,
        messageApi,
    ]);




    const getMarkerPosition = (locations) => {
        if (!locations) return { lat: 0, lng: 0 };
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



    const [mapLoader, setMapLoader] = useState(false)
    useEffect(() => {
        setMapLoader(true)
        const position = getMarkerPosition(workOrderGetByIDData?.polygon?.locations);
        if (workOrderGetByIDData?.polygon?.type == "Circle") {
            setSelectShape(2);
            setCircleRadius(Number(workOrderGetByIDData?.polygon?.radius.toFixed()))
            setCircleSafety(Number(workOrderGetByIDData?.polygon?.safetyZone.toFixed()))
            setCircleElevation(Number(workOrderGetByIDData?.polygon?.altitude.toFixed()))
            setTimeout(() => {
                childRefParent.current?.drawCircle();
                circleRef.current?.setCenter(position);
                childCircleRef.current?.setCenter(position);
                drawWithRadiusBounds(position, Number(workOrderGetByIDData?.polygon?.radius.toFixed()))
                setMapLoader(false)
            }, 2000);
        }
        else if (workOrderGetByIDData?.polygon?.type === "Polygon") {
            setSelectShape(3)
            const killtime = setTimeout(() => {
                setCustomAreaSafety(Number(workOrderGetByIDData?.polygon?.safetyZone.toFixed()))
                setCustomAreaElevation(Number(workOrderGetByIDData?.polygon?.altitude.toFixed()))
                drawPolyLinePolyGoneBond(workOrderGetByIDData?.polygon?.locations)
                setPolygonPoint(
                    workOrderGetByIDData?.polygon?.locations?.map(([lat, lng]) => ({
                        lat: Number(lat),
                        lng: Number(lng),
                    })) || []
                );
                setMapLoader(false)
            }, 1000);

            return () => {
                clearTimeout(killtime)
            }
        }
        else if (workOrderGetByIDData?.polygon?.type === "Polyline") {
            setSelectShape(1)
            const killtime = setTimeout(() => {
                setPolylineWidth(Number(workOrderGetByIDData?.polygon?.radius.toFixed()))
                setPolylineSafety(Number(workOrderGetByIDData?.polygon?.safetyZone.toFixed()))
                setPolylineElevation(Number(workOrderGetByIDData?.polygon?.altitude.toFixed()))
                drawPolyLinePolyGoneBond(workOrderGetByIDData?.polygon?.locations)
                setPointsPolyLine(
                    workOrderGetByIDData?.polygon?.locations?.map(([lat, lng]) => ({
                        lat: Number(lat),
                        lng: Number(lng),
                    })) || []
                );
                setMapLoader(false)
            }, 1000);
            return () => {
                clearTimeout(killtime)
            }
        }
    }, [workOrderGetByIDData])
    // map


    function convertBytes(bytes) {
        return {
            kb: +(bytes / 1024).toFixed(2),
            mb: +(bytes / (1024 * 1024)).toFixed(2),
            gb: +(bytes / (1024 * 1024 * 1024)).toFixed(4),
        };
    }


































    // complete workorder



    // Email add Workorder complete
    const [showAddEmail, setShowAddEmail] = useState(false);
    const [queueEmail, setQueueEmail] = useState("");
    const [actualEmail, setActualEmail] = useState([]);

    const openAddEmail = () => {
        setShowAddEmail(true)
    }
    const closeAddEmail = () => {
        setShowAddEmail(false)
    }
    // Email add Workorder complete





    const addActualEmail = () => {
        if (!queueEmail.trim()) {
            messageApi.open({
                type: "error",
                content: "Please enter a valid email.",
            });
            return;
        }

        setActualEmail(prev => {
            const updatedList = [...prev, queueEmail];
            return updatedList;
        });

        setQueueEmail("");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    const hasInvalidExtraData =
        !queueEmail?.trim() ||
        !emailRegex.test(queueEmail.trim());


    const deleteEmail = (index) => {
        setActualEmail(prev => prev.filter((item, index1) => index1 !== index));
        messageApi.open({
            type: "error",
            content: "Email has been deleted.",
        });
    };


    const [sendTo, setSendTo] = useState("Yes");
    const [jsaRequired, setJsaRequired] = useState(false)
    const [currentWorkOrder, setCurrentWorkOrder] = useState();


    const [deleteSafetyH, setDeleteSafetyH] = useState([])
    const [JSA2, setJSA2] = useState([]);


    const [isExcel, setIsExcel] = useState(false)
    const isSendExcel = checked => {
        setIsExcel(checked)
    };


    const [allJSA, setAllJSA] = useState([])
    const [HJSAOrVideos, setHJSAOrVideos] = useState()


    const getCurrentDate = () => {
        return dayjs(Date.now()).format('YYYY-MM-DD hh:mm A');
    };
    const [currentDate, setCurrentDate] = useState();


    const showEditModal = (id) => {
        setEditPersonalModal(true);
        setCurrentWorkOrder(id._id)
        setJsaRequired(id?.isJSA == "true" ? true : false)
        setHJSAOrVideos(id?.jsaDocumentation?.length > 0 ? true : false)
        setAllJSA(id?.jsaDocumentation)
        setActualEmail(JSON.parse(id?.email_copy_to_completed))
        setIsExcel(id?.isExcelCompleted == "true" ? true : false)
        setCurrentDate(id?.completed_date !== "" ? dayjs(id?.completed_date == null ? Date.now() : id?.completed_date).format('YYYY-MM-DD hh:mm A') : getCurrentDate())
        setSendTo(id?.send_to == "true" ? "Yes" : "No")
    };
    const [editPersonalModal, setEditPersonalModal] = useState(false);
    const cancelEditModal = () => {
        setEditPersonalModal(false);
    };

    const getCombinedDateTime = () => {
        if (currentDate) {
            const combined = dayjs(currentDate).format(dateFormat);
            return combined
        }
        return null;
    };


    const editWorkOrder = (eId) => {
        localStorage.setItem("Xy9#qLT7pw!5kD+M3/=8&v==", eId)
        window.location.reload()
        window.location.href = `/workorder/create?editId=${eId}`;
    }

    const [createLoading, setCreateLoading] = useState(false)



    const completeWO = async () => {
        const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const allValidEmails = actualEmail.every(item => item && regEmail.test(item));

        if (!allValidEmails) {
            messageApi.destroy();
            messageApi.open({
                type: "error",
                content: "One or more emails are invalid",
            });
            return;
        }

        const emailList = actualEmail.map(item => item);
        const fileArray = [...JSAOrVideos].map(file => ({
            fileName: file.name,
            size: file.size,
            contentType: file.type,
        }))
        const AwsUpload = await AWSUploadModule({ messageApi, fileArray, actualFile: [...JSAOrVideos], moduleName: "workorder", setCreateLoading })
        const payload = {
            workOrderId: currentWorkOrder,
            email_copy_to_completed: JSON.stringify(emailList),
            send_to: sendTo === "Yes" ? "true" : "false",
            completed_date: getCombinedDateTime(),
            isExcelCompleted: isExcel ? "true" : "false",
            jsaDocumentation: !AwsUpload ? [] : AwsUpload,
            jsaDocumentationIds: JSON.stringify(allJSA?.filter(data => !deleteJSA.includes(data?._id)).map(data => { return data._id }))
        }
        CompleteWorkOrder(payload);

        // if (HJSAOrVideos) {
        //     formData.append("jsaDocumentationIds", JSON.stringify(allJSA?.filter(data => !deleteJSA.includes(data?._id)).map(data => { return data._id })))
        // }
    };




    // complete workorder

    const UserID = localStorage.getItem('zP!4vBN#tw69gV+%2/+1/w==')


    const [deleteExtra, setDeleteExtra] = useState(false);
    const closeConfirm = () => {
        setDeleteExtra(false)
    }




    const [JSAOrVideos, setJSAOrVideos] = useState([])
    const [deleteJSA, setDeleteJSA] = useState([])
    const handleBeforeUpload3 = (file) => {
        setJSAOrVideos((prev) => Array.isArray(prev) ? [...prev, file] : [file]);
        return false;
    };




    const capitalizeWord = (word) =>
        typeof word === "string" && word.length > 0
            ? word[0].toUpperCase() + word.slice(1)
            : "";




    const canDelete = AllContentPermission?.find(
        (d) => d?.module === "WORKORDERS"
    )?.permissions?.delete;

    const canUpdate = AllContentPermission?.find(
        (d) => d?.module === "WORKORDERS"
    )?.permissions?.update;

    const menuItems = () => {
        if (workOrderGetByIDData?.isArchived) return [];
        if (workOrderGetByIDData?.requested_by?._id === UserID) {
            if (
                workOrderGetByIDData?.status === "pending" ||
                workOrderGetByIDData?.status === "declined"
            ) {
                return [
                    {
                        key: "complete",
                        label: "Complete",
                        icon: <FaCheck size={18} color="#1C8F5D" />,
                        onClick: () => showEditModal(workOrderGetByIDData),
                    },
                    {
                        key: "edit",
                        label: "Edit Work Order",
                        icon: <img src={editIcon} style={{ height: 18, opacity: workOrderGetByIDData?.requested_by_reassigned ? "0.3" : '1' }} />,
                        disabled: !canUpdate || workOrderGetByIDData?.requested_by_reassigned,
                        onClick: () => canUpdate && editWorkOrder(workOrderGetByIDData?._id),
                    },
                ];
            }
        }

        return [];
    };


    const shouldRenderDropdown =
        !workOrderGetByIDData?.isArchived &&
        !["completed", "approved"].includes(workOrderGetByIDData?.status);







    const WorkPOIGetByIdDoc1 = async (body) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1000000);
        const url = `/assets/files/signed-urls`;
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        try {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ keys: [body] }),
                signal: controller.signal,
            };
            const response = await fetch(`${baseUrl}${url}`, options);
            const res = await response.json();
            if (response.status === 200 || response.status === 201) {
                return res?.urls[0] || 0
            }
        } catch (error) {
            if (error.name === "AbortError") console.error("Request timed out");
        } finally {
            clearTimeout(timeout);
        }
    };
    return (
        <>
            {contextHolder}
            <div className={Style.MainContainer}>
                <div>
                    <div className={Style.SecondaryHeader}>
                        <div className={Style.Allpath}>
                            <h6>Work Orders</h6>
                            <img src={rightIcon} />
                            <h6 className={Style.activePage}>Work Order Detail</h6>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3>Work Order Detail</h3>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Dropdown trigger={['click']} disabled={fileLoader ? true : false} menu={{ items: getDownloadDropdown() }} placement="bottomRight">
                                    <button className={Style.DownloadBtn}>Download <IoIosArrowDown size={20} style={{ marginLeft: 5 }} color='white' /></button>
                                </Dropdown>
                                {shouldRenderDropdown && (
                                    < Dropdown trigger={['click']} menu={{ items: menuItems() }} placement="bottomRight">
                                        <span style={{ display: "flex", alignItems: 'center', justifyContent: 'center', width: 50 }}><img src={moreIcon} style={{ height: "24px" }} /></span>
                                    </Dropdown>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Style.Container}>
                    <div className={Style.FloaterBubble}>
                        <div className={Style.FloaterContainer}>
                            {workOrderGetByIDDatLoading ?
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", width: '100%' }}>
                                    <Spin />
                                </div>
                                :
                                <div className={Style.FloatingFilter}>
                                    {workOrderGetByIDData?.priority == "High" ?
                                        <div className={Style.signalTopHigh}>
                                            <p>{workOrderGetByIDData?.priority}</p>
                                        </div>
                                        : workOrderGetByIDData?.priority == "Immediate" ?
                                            <div className={Style.signalTopImmediate}>
                                                <p>{workOrderGetByIDData?.priority}</p>
                                            </div>
                                            : workOrderGetByIDData?.priority == "Standard" ?
                                                <div className={Style.signalTopStandard}>
                                                    <p>{workOrderGetByIDData?.priority}</p>
                                                </div>
                                                : ""}
                                    <div className={Style.basicInfoSec}>
                                        <h4>{workOrderGetByIDData?.title}</h4>


                                        {workOrderGetByIDData?.assignModule &&
                                            <>
                                                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
                                                    <img src={linkBlue} style={{ height: 20, marginRight: 4 }} />
                                                    <p style={{ fontSize: 14 }}>Linked Module</p>
                                                </div>
                                                <span style={{ fontSize: 14, color: "#626D6F" }}>{workOrderGetByIDData?.moduleType}</span>
                                            </>
                                        }
                                        <p style={{ fontSize: 14, marginTop: 12 }} className={Style.HeadingModal}>Assign to</p>
                                        <div className={Style.assigneCon}>
                                            <div className={Style.DpAssigne}>
                                                {`${workOrderGetByIDData?.requested_by?.firstName?.charAt(0) ?? ""} ${workOrderGetByIDData?.requested_by?.lastName?.charAt(0) ?? ""}`}
                                            </div>
                                            <div>
                                                <p>{`${workOrderGetByIDData?.requested_by?.firstName ?? ""} ${workOrderGetByIDData?.requested_by?.lastName ?? ""}`}</p>
                                                <h6 style={{ fontWeight: 400 }}>{workOrderGetByIDData?.created_by?.role_id?.roleName ?? ""}</h6>
                                            </div>
                                        </div>




                                        <div className={Style.TagOpration}>
                                            <p>{workOrderGetByIDData?.cpc}</p>
                                        </div>
                                        {workOrderGetByIDData?.polygon?.type == "Circle" ?
                                            <div className={Style.mapInfoTag}>
                                                <img src={circleBlue} /> <p>{workOrderGetByIDData?.polygon?.type}</p>
                                            </div>
                                            :
                                            workOrderGetByIDData?.polygon?.type == "Polygon" ?
                                                <div className={Style.mapInfoTag}>
                                                    <img src={customAreaBlue} /> <p>{"Custom Area"}</p>
                                                </div>
                                                :
                                                workOrderGetByIDData?.polygon?.type == "Polyline" ?
                                                    <div className={Style.mapInfoTag}>
                                                        <img src={polylineBlue} /> <p>{workOrderGetByIDData?.polygon?.type}</p>
                                                    </div>
                                                    : ""
                                        }

                                        <div className={Style.MapInfoAll}>
                                            {workOrderGetByIDData?.polygon?.type == "Polyline" ?
                                                <>
                                                    <div>
                                                        <h6>Width Stroke</h6>
                                                        <p>{workOrderGetByIDData?.polygon?.radius} m</p>
                                                    </div>
                                                    <span></span>
                                                </>
                                                : workOrderGetByIDData?.polygon?.type == "Circle" ?
                                                    <>
                                                        <div>
                                                            <h6>Radius</h6>
                                                            <p>{workOrderGetByIDData?.polygon?.radius} m</p>
                                                        </div>
                                                        <span></span>
                                                    </>
                                                    : ""}
                                            <div>
                                                <h6>Safety Zone</h6>
                                                <p>{workOrderGetByIDData?.polygon?.safetyZone} m</p>
                                            </div>
                                            <span></span>
                                            <div>
                                                <h6>Elevation</h6>
                                                <p>{workOrderGetByIDData?.polygon?.altitude} m</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={Style.secondSec}>
                                        <div className={Style.MapInfoAll} style={{ marginTop: 0, flexDirection: 'column', alignItems: 'start' }}>
                                            {workOrderGetByIDData?.daa !== "" &&
                                                <div style={{ marginTop: 10 }}>
                                                    <h6>Start Date & Time</h6>
                                                    {/* <p>{workOrderGetByIDData?.daa?.split(" ")[0] ?? ""}</p> */}
                                                    <p>{dayjs(workOrderGetByIDData?.daa).format('YYYY-MM-DD hh:mm A')}</p>
                                                </div>
                                            }
                                            {workOrderGetByIDData?.cdr !== "" &&
                                                <div style={{ marginTop: 16 }}>
                                                    <h6>Completion Date & Time</h6>
                                                    {/* <p>{workOrderGetByIDData?.cdr?.split(" ")[0] ?? ""}</p> */}
                                                    <p>{dayjs(workOrderGetByIDData?.cdr).format('YYYY-MM-DD hh:mm A')}</p>
                                                </div>
                                            }
                                            {workOrderGetByIDData?.completed_date !== "" &&
                                                <div style={{ marginTop: 16 }}>
                                                    <h6>Date Completed</h6>
                                                    {/* <p>{workOrderGetByIDData?.cdr?.split(" ")[0] ?? ""}</p> */}
                                                    <p>{dayjs(workOrderGetByIDData?.completed_date == "null" ? Date.now() : workOrderGetByIDData?.completed_date).format('YYYY-MM-DD hh:mm A')}</p>
                                                </div>
                                            }
                                            <div style={{ marginTop: 16 }}>
                                                <h6>Hot Work</h6>
                                                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                                    {workOrderGetByIDData?.hot_work ?
                                                        <FaCheck color='green' size={16} />
                                                        :
                                                        <IoClose color='red' size={16} />
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        {workOrderGetByIDData?.cpc_location ?
                                            <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                <div>
                                                    <h6>Specific Area</h6>
                                                    <p>{workOrderGetByIDData?.cpc_location}</p>
                                                </div>
                                            </div>
                                            : ""}


                                        {workOrderGetByIDData?.entry_requirements ?
                                            <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                <div>
                                                    <h6 style={{ width: "100%" }}>Entry Requirement</h6>
                                                    <p>{workOrderGetByIDData?.entry_requirements}</p>
                                                </div>
                                            </div>
                                            : ""}


                                        {workOrderGetByIDData?.mopo ?
                                            <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                <div>
                                                    <h6 style={{ width: "100%" }}>Material / Parts Ordered</h6>
                                                    <p>{workOrderGetByIDData?.mopo}</p>
                                                </div>
                                            </div>
                                            : ""}



                                        <div onClick={showAddDrawer} style={{ marginTop: 16 }}>
                                            <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                                                <div className={Style.AddExtraDataFeild}>
                                                    <div>
                                                        <p>personnel <span>({personanalDataList.length ?? 0})</span></p>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <MdOutlineChevronRight size={28} color='#626D6F' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div onClick={showExtraDrawer} style={{ marginTop: 16 }}>
                                            <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                                                <div className={Style.AddExtraDataFeild}>
                                                    <div>
                                                        <p>Extra data <span>({extraDataList?.length ?? 0})</span></p>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <MdOutlineChevronRight size={28} color='#626D6F' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ border: '0px solid transparent' }} className={Style.secondSec}>
                                        {workOrderGetByIDData?.work_requested ?
                                            <div className={Style.MapInfoAll}>
                                                <div>
                                                    <h6 style={{ width: "100%" }}>Work Requested</h6>
                                                    <p>{workOrderGetByIDData?.work_requested}</p>
                                                </div>
                                            </div>
                                            : ""
                                        }

                                        {JSON.parse(workOrderGetByIDData?.email_copy_to ?? "[]").length > 0 ?
                                            <>
                                                <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                        <h6>Emails</h6>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {workOrderGetByIDData?.isExcel !== "false" ?
                                                                <FaCheck color='green' size={14} />
                                                                :
                                                                <IoClose color='red' size={14} />
                                                            }
                                                            {/* <FaCheck size={14} color='#1C8F5D' /> */}
                                                            <p style={{ marginLeft: 5, marginBlock: 0 }}>send excel with pdf</p>
                                                        </div>
                                                    </div>
                                                    {/* <p>Harness required beyond level 2</p> */}
                                                </div>
                                                {JSON.parse(workOrderGetByIDData?.email_copy_to).map(data =>
                                                    <div className={Style.TagOpration} style={{ marginTop: 8 }}><p>{data}</p></div>
                                                )}
                                            </>
                                            : ""
                                        }



                                        <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                            <div>
                                                <h6 style={{ width: "100%" }}>Job Safety Analysis</h6>
                                                {workOrderGetByIDData?.isJSA !== "false" ?
                                                    <FaCheck color='green' size={16} />
                                                    :
                                                    <IoClose color='red' size={16} />
                                                }
                                            </div>
                                        </div>




                                        {JSON.parse(workOrderGetByIDData?.email_copy_to_completed ?? "[]").length > 0 ?
                                            <>
                                                <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                        <h6>Email copy to Complete</h6>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {workOrderGetByIDData?.isExcel !== "false" ?
                                                                <FaCheck color='green' size={14} />
                                                                :
                                                                <IoClose color='red' size={14} />
                                                            }
                                                            {/* <FaCheck size={14} color='#1C8F5D' /> */}
                                                            <p style={{ marginLeft: 5, marginBlock: 0 }}>Send excel with pdf</p>
                                                        </div>
                                                    </div>
                                                    {/* <p>Harness required beyond level 2</p> */}
                                                </div>
                                                {JSON.parse(workOrderGetByIDData?.email_copy_to_completed).map(data =>
                                                    <div className={Style.TagOpration} style={{ marginTop: 8 }}><p>{data}</p></div>
                                                )}
                                            </>
                                            : ""
                                        }


                                        {docLoading ?
                                            <>
                                                <Space>
                                                    <Skeleton.Avatar active shape={'circle'} />
                                                    <Skeleton.Input active size={'default'} />
                                                </Space>

                                                <Space style={{ marginTop: 10 }}>
                                                    <Skeleton.Avatar active shape={'circle'} />
                                                    <Skeleton.Input active size={'default'} />
                                                </Space>

                                                <Space style={{ marginTop: 10 }}>
                                                    <Skeleton.Avatar active shape={'circle'} />
                                                    <Skeleton.Input active size={'default'} />
                                                </Space>
                                                <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                    <div>
                                                        <h6 style={{ width: "100%" }}>Photos</h6>
                                                        <div className={Style.PhotoGrid}>
                                                            <Skeleton.Image active />
                                                            <Skeleton.Image active />
                                                            <Skeleton.Image active />
                                                            <Skeleton.Image active />
                                                            <Skeleton.Image active />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>

                                                {matchedFiles1?.length > 0 ?
                                                    <div style={{ marginTop: 16, flexDirection: 'column' }} className={Style.MapInfoAll}>
                                                        <h6 style={{ width: "100%" }}>Warranty Documents</h6>
                                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                            {matchedFiles1?.map((data, index) => (
                                                                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                                                                    <>
                                                                        <div className={Style.DocHear}>
                                                                            <img src={redDoc} style={{ height: 24 }} />
                                                                        </div>
                                                                        <div className={Style.DocData}>
                                                                            <a target='_blank' href={data?.url}>{data?.fileName}</a>
                                                                            <h6>{`${convertBytes(data?.size).mb} MB`}</h6>
                                                                        </div>
                                                                    </>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    : ""}



                                                {matchedFiles2?.length > 0 ?
                                                    <div style={{ marginTop: 16, flexDirection: 'column' }} className={Style.MapInfoAll}>
                                                        <h6 style={{ width: "100%" }}>Safety Guidelines</h6>
                                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                            {matchedFiles2?.map((data, index) => (
                                                                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                                                                    <>
                                                                        <div className={Style.DocHear}>
                                                                            <img src={redDoc} style={{ height: 24 }} />
                                                                        </div>
                                                                        <div className={Style.DocData}>
                                                                            <a target='_blank' href={data?.url}>{data?.fileName}</a>
                                                                            <h6>{`${convertBytes(data?.size).mb} MB`}</h6>
                                                                        </div>
                                                                    </>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    : ""}



                                                {matchedFiles4?.length > 0 ?
                                                    <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                        <div>
                                                            <h6 style={{ width: "100%" }}>JSA (Job Safety Analysis)</h6>
                                                            <div className={Style.PhotoGrid}>
                                                                {matchedFiles4?.map((data, index) => (
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                                                                        <>
                                                                            <div className={Style.DocHear}>
                                                                                <img src={redDoc} style={{ height: 24 }} />
                                                                            </div>
                                                                            <div className={Style.DocData}>
                                                                                <a target='_blank' href={data?.url}>{data?.fileName}</a>
                                                                                <h6>{`${convertBytes(data?.size).mb} MB`}</h6>
                                                                            </div>
                                                                        </>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ""}

                                                {matchedFiles3?.length > 0 ?
                                                    <div style={{ marginTop: 16 }} className={Style.MapInfoAll}>
                                                        <div>
                                                            <h6 style={{ width: "100%" }}>Photos</h6>
                                                            <div className={Style.PhotoGrid}>
                                                                {matchedFiles3?.map((data, index) => (
                                                                    <>
                                                                        <div key={index} className={Style.PhotoIn}>
                                                                            <Image
                                                                                height={86}
                                                                                alt="basic"
                                                                                src={data?.url}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ""}
                                            </>}
                                    </div>
                                </div>
                            }

                        </div>
                    </div>


                    {isLoaded ? (
                        <>
                            <MapWidget
                                currectType={selectedShape}
                                mapKey={mapKey}
                                childRefParent={childRefParent}
                                // polyLine
                                polylineSafetyZone={polylineSafety}
                                polylineWidth={polylineWidth}
                                pointsPolyLine={pointsPolyLine}
                                setPointsPolyLine={setPointsPolyLine}
                                setBandPolygon={setBandPolygon}
                                bandPolygon={bandPolygon}
                                setSafetyZonePolyLine={setSafetyZonePolyLine}
                                safetyZonePolyLine={safetyZonePolyLine}
                                // polyLine

                                // Circle
                                circleWidth={circleRadius}
                                circleSafetyZone={circleSafety}
                                mapRefParent={mapRefParent}
                                circleRef={circleRef}
                                setCircleCenter={setCircleCenter}
                                circleCenter={circleCenter}
                                childCircleRef={childCircleRef}
                                // Circle

                                // Custom Area
                                polygonSafetyZone={customAreaSafety}
                                setPolygonPoint={setPolygonPoint}
                                polygonPoint={polygonPoint}
                                // Custom Area


                                // center Worksite
                                centerWorkSite={workSiteMarker}
                                // center Worksite

                                // worksite CustomArea
                                customAreaPoint={pointsWorkSite}
                                // worksite CustomArea

                                // worksite polyline
                                polylinePoint={pointsMoreWorkSite}
                                // worksite polyline

                                // worksite Loader
                                workSiteLoader={mapLoader}
                                isRead={true}
                                loadingTitle={"Loading Work Order."}
                                loadingPara={"Loading your Work Order. Please wait a moment."}
                            // worksite Loader
                            />
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: "100%" }}>
                            <Spin size='default' />
                        </div>
                    )}
                </div >



                {/* Personanal drawer */}
                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title="Add Personnel (Hours Worked)"
                    placement={'right'}
                    styles={{ header: { padding: '17px 24px' }, body: { padding: '24px' } }}
                    onClose={closeAddDrawer}
                    open={addDrawer}
                    width={486}
                    key={'right'}
                >
                    {personanalDataList?.length > 0 ? personanalDataList?.map((data, index) => {
                        const totalHours = data.date_and_hours?.reduce((acc, record) => acc + Number(record.no_of_hours || 0), 0);
                        return (
                            <div key={index} className={Style.MainListingHourWork}>
                                <div className={Style.HoursWorkListTop}>
                                    <h6>{data.name}</h6>
                                </div>

                                {data?.date_and_hours?.map((record, i) => (
                                    <div key={i} className={Style.HoursWorkListBottom}>
                                        <img src={blueCalender} style={{ height: 20 }} /><p>{new Date(record.date).toISOString().split('T')[0]}</p>
                                        <img src={blueClock} style={{ height: 20, marginLeft: 10 }} /> <p>{record.no_of_hours} hour</p>
                                    </div>
                                ))}
                            </div>
                        )
                    }) :
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", width: '100%', flexDirection: 'column', textAlign: 'center' }}>
                            <img src={blueDoc} style={{ height: 72 }} />
                            <h5 style={{ fontSize: 20, fontWeight: 500, marginTop: 8 }}>No Personnel Hours Logged Yet</h5>
                            <p style={{ fontSize: 14, fontWeight: 400, color: "#51595A", marginTop: 8 }}>Once personnel begin logging time on this work order, their hours and dates will be shown here for easy tracking and reporting.</p>
                        </div>
                    }
                </Drawer>
                {/* Personanal drawer */}


                {/* Extra Data */}
                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title="Add Extra Data"
                    placement={'right'}
                    styles={{ header: { padding: '17px 24px' }, body: { padding: '24px' } }}
                    onClose={closeExtraDrawer}
                    open={addExtraDrawer}
                    width={486}
                    key={'right'}
                >
                    <>
                        {extraDataList?.length > 0 ? extraDataList?.map((data, index) => {
                            return (
                                <div key={index} className={Style.MainListingHourWork}>
                                    <div className={Style.HoursWorkListTop}>
                                        {capitalizeWord(data?.type) == "Input" ?
                                            <h6>{data?.value}</h6>
                                            : capitalizeWord(data?.type) == "Boolean" ?
                                                <div className={data?.value ? Style.InputDesign : Style.FInputDesign}>
                                                    <p>{data?.value ? "On" : "Off"}</p>
                                                    <Switch size='small' disabled={true} value={data?.value} />
                                                </div>
                                                : capitalizeWord(data?.type) == "Date" ?
                                                    <h6>{data?.value}</h6>
                                                    : capitalizeWord(data?.type) == "Color" ?
                                                        <ColorPicker value={data?.value} disabled={false} style={{ marginTop: 8 }} />
                                                        : ""
                                        }
                                    </div>
                                    <h6>{data?.name}</h6>
                                    <p>{data?.description}</p>
                                </div>
                            )
                        }) :
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", width: '100%', flexDirection: 'column', textAlign: 'center' }}>
                                <img src={blueDoc} style={{ height: 72 }} />
                                <h5 style={{ fontSize: 20, fontWeight: 500, marginTop: 8 }}>No Extra Data Added Yet</h5>
                                <p style={{ fontSize: 14, fontWeight: 400, color: "#51595A", marginTop: 8 }}>You haven’t added any extra details to this Work Order yet.</p>
                            </div>
                        }
                    </>
                </Drawer>
                {/* Extra Data */}

                {/* Add Email */}
                <Drawer
                    maskClosable={false}
                    getContainer={document.body}
                    afterOpenChange={(visible) => {
                        document.body.style.overflow = visible ? "hidden" : "auto";
                    }}
                    title="Add Emails"
                    placement={'right'}
                    styles={{ header: { padding: '17px 24px' }, body: { padding: '24px' } }}
                    onClose={closeAddEmail}
                    open={showAddEmail}
                    width={486}
                    key={'right'}
                >
                    <div>
                        <label>Email <span style={{ color: 'red' }}>*</span></label>
                        <Input value={queueEmail} onChange={(e) => setQueueEmail(e.target.value)} placeholder='Enter email' />
                    </div>

                    {actualEmail.length >= 1 &&
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                                <p>Send excel file with pdf</p>
                                <Switch defaultValue={isExcel} onChange={isSendExcel} />
                            </div>
                            <hr className={Style.HRHtm} />
                        </>
                    }
                    {actualEmail.map((data, index) =>
                        <div className={Style.ListIconType}>
                            <p>{data}</p>
                            <div onClick={() => deleteEmail(index)} className={Style.DeleteIcon}>
                                <img src={deletePersonalIcon} style={{ height: "24px" }} />
                            </div>
                        </div>
                    )}
                    <div className={Style.PersonalActionWrapper} style={{ marginTop: 16 }}>
                        <button onClick={() => {
                            setQueueEmail("")
                            closeAddEmail()
                        }} className={Style.cancelWorkBtn}>Cancel</button>
                        <button onClick={() => addActualEmail()} disabled={hasInvalidExtraData} className={hasInvalidExtraData ? Style.AddWorkBtnD : Style.AddWorkBtn}>Add</button>
                    </div>
                </Drawer>
                {/* Add Email */}

                {/* complete workorder */}
                <Modal
                    title="Complete Work Order"
                    open={editPersonalModal}
                    onCancel={cancelEditModal}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button onClick={cancelEditModal} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                            {/* <button  className={Style.editPersonalModalFooterSaveD}>Save Changes</button> */}
                            {jsaRequired ?
                                <button
                                    style={{
                                        cursor:
                                            WorkOrderReducer.workOrderCompleteLoading ||
                                                (!(JSAOrVideos?.length || allJSA.filter(data => !deleteJSA.includes(data?._id))?.length))
                                                ? "no-drop"
                                                : "pointer",
                                    }}
                                    className={WorkOrderReducer.workOrderCompleteLoading ||
                                        (!(JSAOrVideos?.length || allJSA.filter(data => !deleteJSA.includes(data?._id))?.length))
                                        ? Style.editPersonalModalFooterSaveD : Style.editPersonalModalFooterSave}
                                    disabled={
                                        WorkOrderReducer.workOrderCompleteLoading ||
                                        (!(JSAOrVideos?.length || allJSA.filter(data => !deleteJSA.includes(data?._id))?.length))
                                    }
                                    onClick={completeWO}
                                >
                                    {WorkOrderReducer.workOrderCompleteLoading ? "Saving..." : "Save changes"}
                                </button>
                                :
                                <button className={WorkOrderReducer.workOrderCompleteLoading ? Style.editPersonalModalFooterSaveD : Style.editPersonalModalFooterSave} disabled={WorkOrderReducer.workOrderCompleteLoading} onClick={completeWO}>{WorkOrderReducer.workOrderCompleteLoading ? "Saving..." : "Save changes"}</button>
                            }
                        </div>
                    </>}
                >
                    <p className={Style.HeadingModal}>Assigned by</p>
                    <div className={Style.assigneCon}>
                        <div className={Style.DpAssigne}>
                            {`${workOrderGetByIDData?.created_by?.firstName?.charAt(0) ?? ""} ${workOrderGetByIDData?.created_by?.lastName?.charAt(0) ?? ""}`}
                        </div>
                        <div>
                            <p>{`${workOrderGetByIDData?.created_by?.firstName ?? ""} ${workOrderGetByIDData?.created_by?.lastName ?? ""}`}</p>
                            <h6>{workOrderGetByIDData?.created_by?.role_id?.roleName ?? ""}</h6>
                        </div>
                    </div>
                    <hr className={Style.HRHtm} />

                    {jsaRequired &&
                        <>
                            <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                                <label>JSA (Job Safety Analysis) <span style={{ color: 'red' }}>*</span></label>
                                <Dragger
                                    onRemove={(e) => setJSAOrVideos(prev =>
                                        prev.filter(file => file.uid !== e.uid)
                                    )} accept={".pdf"} multiple={true} beforeUpload={handleBeforeUpload3}
                                    showUploadList={{
                                        extra: ({ size }) => (
                                            <span style={{ color: '#626D6F' }}>
                                                ({(size / 1024 / 1024).toFixed(2)} MB)
                                            </span>
                                        ),
                                        showDownloadIcon: true,
                                        removeIcon: <img src={removeIcon} style={{ height: 24 }} />,
                                    }}
                                    iconRender={() => (<img src={redDoc} style={{ height: 24 }} />)}>
                                    <img src={blueDoc} style={{ height: 32 }} />
                                    <p>Upload a PDF</p>
                                </Dragger>
                            </div>
                            <>
                                {allJSA.length > 0 ? allJSA.filter(data => !deleteJSA.includes(data?._id)).map(data => {
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, justifyContent: 'space-between' }}>
                                            <a onClick={async () => {
                                                const AllowNewTab = await WorkPOIGetByIdDoc1(new URL(data?.url).pathname.replace(/^\/+/, ''));
                                                if (AllowNewTab?.url) {
                                                    window.open(AllowNewTab.url, "_blank", "noopener,noreferrer");
                                                }
                                            }} style={{ marginLeft: 5, marginRight: 5, width: 300, fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                {data?.fileName}
                                            </a>
                                            <div onClick={() => setDeleteJSA(prev => [...prev, data?._id])} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                <AiOutlineDelete size={22} color='red' />
                                            </div>
                                        </div>
                                    )
                                }) : ""}
                            </>
                        </>
                    }


                    <div style={{ paddingTop: 15 }}>
                        <div className={Style.TaskFeild}>
                            <label>Completion Date & Time</label>
                            <DatePicker allowClear={false} onChange={(e) => setCurrentDate(e)} value={currentDate ? dayjs(currentDate) : dayjs(getCurrentDate(), dateFormat)} format={dateFormat} suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />} showTime={{ format: 'hh:mm A', use12Hours: true, showSecond: false, }} minDate={dayjs(formattedDate, dateFormat2)} placeholder='Select date & time' />
                        </div>
                    </div>

                    <div style={{ paddingTop: 15 }}>
                        <label>Send a copy to external contact(s)</label>
                        <div style={{ cursor: 'pointer', marginTop: 5 }} onClick={openAddEmail} className={Style.AddExtraDataFeild}>
                            <div>
                                <p style={{ color: '#626D6F' }}>Add emails <span>({actualEmail?.length ?? 0})</span></p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MdOutlineChevronRight size={28} color='#626D6F' />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16 }}>
                        <p>Send to Requestor</p>
                        <Switch value={sendTo == "Yes" ? true : false} onChange={(e) => setSendTo(e == false ? "No" : "Yes")} />
                    </div>
                </Modal>
                {/* complete workorder */}


                {/* confirm delete */}
                <Modal
                    open={deleteExtra}
                    onCancel={closeConfirm}
                    header={false}
                    centered={true}
                    closeIcon={false}
                    footer={<>
                        <div className={Style.editPersonalModalFooter}>
                            <button disabled={WorkOrderReducer.workOrderArchiveLoading} onClick={() => setDeleteExtra(false)} className={WorkOrderReducer.workOrderArchiveLoading ? Style.editPersonalModalFooterCancelD : Style.editPersonalModalFooterCancel}>Cancel</button>
                            <button disabled={WorkOrderReducer.workOrderArchiveLoading} onClick={() => { ArchiveWorkOrder(current_Id) }} className={WorkOrderReducer.workOrderArchiveLoading ? Style.editPersonalModalFooterDeleteD : Style.editPersonalModalFooterDelete}>Archive Work Order</button>
                        </div>
                    </>}

                >
                    <>
                        <h4 className={Style.AreYouSure}>Archive this Work Order?</h4>
                        <p className={Style.AreYouSurePara}>This work order will be permanently removed from your active list and moved to your archive.</p>

                    </>
                </Modal>
                {/* confirm delete */}

            </div >
        </>
    )
}

function mapStateToProps({ PermissionReducer, WorkOrderReducer }) {
    return { PermissionReducer, WorkOrderReducer };
}
export default connect(mapStateToProps, WorkOrderAction)(WorkorderScreenReadAssign);
