import { useEffect, useRef, useState } from 'react'
import Style from './DashboardScreen.module.css'
import { Col, Empty, message, Modal, Row, Select, Skeleton } from 'antd'
import * as AlertAction from '../../../store/actions/Alerts/index';
import * as POIAction from '../../../store/actions/Poi/index';
import * as AssetsAction from '../../../store/actions/Assets/index';
import * as ProjectAction from '../../../store/actions/Project/index';
import * as WorkOrderAction from '../../../store/actions/WorkOrder/index';
import * as WorkSiteAction from '../../../store/actions/Worksite/index';
import { connect, useDispatch } from 'react-redux';
import DashboardIcon from '../../assets/dashboard/people.png'
import { IoIosArrowRoundUp } from "react-icons/io";
import DashboardMap from './DashboardMap';
import ReactTimeAgo from 'react-time-ago';
import { useNavigate } from 'react-router';
import { baseUrl } from '../../../store/config.json'
import { TASK_CLEAR_EXPIRED } from '../../../store/actions/types';
import ImageBanner from '../../assets/image20.png'
import calendarImage from '../../assets/calendar.png'
import locationImage from '../../assets/location.png'
import locationImage2 from '../../assets/image21.png'
import locationImage19 from '../../assets/image19.png'

import blueIcon1 from '../../assets/calendarBlue.png'
import blueIcon2 from '../../assets/locationBlue.png'
import blueIcon3 from '../../assets/mapBlue.png'
import Stacked2Image from '../../assets/Stacked2.png'


import AlertBlue from '../../assets/alertBlue.png'
import CategoryBlue from '../../assets/categoryBlue.png'
import ElevationBlue from '../../assets/elevationBlue.png'
import MapBlue from '../../assets/mapBlue.png'


import Dashboard1 from '../../assets/dashboard-1.png'
import Dashboard2 from '../../assets/dashboard-2.png'
import Dashboard3 from '../../assets/dashboard-3.png'
import Dashboard4 from '../../assets/dashboard-4.png'
import Dashboard5 from '../../assets/dashboard-5.png'
import Dashboard6 from '../../assets/dashboard-6.png'
import Dashboard7 from '../../assets/dashboard-7.png'
import Dashboard8 from '../../assets/dashboard-8.png'
import { GoArrowRight } from "react-icons/go";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from 'chart.js';
import {
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { fa, tr } from '@faker-js/faker';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);





function DashboardScreen({ GetMusterStation, WorksiteReducer, WorkPOIGetByIdMap, GetAlertsByIDMap, GetAssetsByIDMap, WorkOrderGetByIdMap, GetProjectByIDMap, WorkOrderReducer, AlertsReducer, PoiReducer, AssetsReducer, ProjectReducer, GetAssets, GetProjects, GetAlerts, GetPOI, GetMyWorkOrder }) {
    const [messageApi, contextHolder] = message.useMessage();
    const workSite = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==")
    const { alertData, alertLoading } = AlertsReducer
    const { poiData, poiLoading } = PoiReducer
    const { AssetsData, AssetsLoading } = AssetsReducer
    const { projectData, projectLoading } = ProjectReducer
    const { myWorkOrderData, workOrderLoading } = WorkOrderReducer

    // const isLoadingData =
    //     alertLoading ||
    //     poiLoading ||
    //     AssetsLoading ||
    //     projectLoading ||
    //     workOrderLoading;

    const navigate = useNavigate();
    const dispatch = useDispatch()


    const [isLoadingData, setIsLoadingData] = useState(false)
    const [progress, setProgress] = useState(0);



    const loadEssentialData = async () => {
        setIsLoadingData(true)
        setProgress(5);
        try {
            await GetAssets(workSite, 1, "");
            setProgress(30);

            await GetProjects(workSite, 1, "");
            setProgress(55);

            await GetAlerts(workSite, 1, "");
            setProgress(70);

            await GetPOI(workSite, 1, "");
            setProgress(85);

            await GetMyWorkOrder(workSite, 1, "");
            setProgress(100);

            setTimeout(() => {
                setIsLoadingData(false)
                setProgress(0)
            }, 800);
        } catch (error) {
            console.error("Something went wrong");
            setProgress(0);
        }
    };








    useEffect(() => {
        if (workSite !== null) {
            loadEssentialData()
            LoadMapData()
        }

        if (PoiReducer.poiExpiredError) {
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
        if (AlertsReducer.projectExpiredError) {
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
        if (AssetsReducer.projectExpiredError) {
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
        if (ProjectReducer.projectExpiredError) {
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
    }, [])




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
    const [wholeMapData, setWholeMapData] = useState()

    const LoadMapData = async () => {
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
        };
        const response = await fetch(`${baseUrl}/polygons/worksite/${workSite}`, options);
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            setWholeMapData(res)
        }
    }




    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const weekday = date.toLocaleString("en-US", { weekday: "long" });
    const formatted = `${day} ${month}, ${weekday}`;

    const hour = date.getHours();
    let greeting = "";

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening";
    } else {
        greeting = "Good Night";
    }
    const [searchLocationModal, setsearchLocationModal] = useState(false);
    const showLocationModal = () => {
        setsearchLocationModal(true);
    };
    const handleLocationCancel = () => {
        setsearchLocationModal(false);
    };

    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);







    const [wholeDashboardDataApi, setWholeDashboardDataApi] = useState()
    const [wholeDashboardDataApiLoader, setWholeDashboardDataApiLoader] = useState()
    const [filterSectionState, setFilterSectionState] = useState({
        statsFilter: "yearly",
        workOrderFilter: "yearly",
        threatFilter: "yearly",
        assetFilter: "yearly",
        projectFilter: "yearly",
        alertTypeFilter: "yearly",
        createdByMe: true,
        requestedByMe: false,
    });

    useEffect(() => {
        if (workSite !== null) {
            LoadDashboardData()
        }
    }, [filterSectionState])

    const LoadDashboardData = async () => {
        setWholeDashboardDataApiLoader(true)
        const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                worksiteId: workSite,
                ...filterSectionState
            })
        };
        const response = await fetch(`${baseUrl}/global-search/dashboard`, options);
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            setWholeDashboardDataApi(res)
            setWholeDashboardDataApiLoader(false)
        }
        setWholeDashboardDataApiLoader(false)
    }

    const threatLevelOptionSelect = [
        { label: "Last 7 Days", value: "weekly" },
        { label: "Last Month", value: "monthly" },
        { label: "Last Year", value: "yearly" },
    ]

    const AssignSelectOption = [
        { label: "Created by Me", value: true },
        { label: "Requested by Me", value: false }
    ];


    const renderPercentage = (value = 0) => {
        const percentage = Number(value);
        const isPositive = percentage > 0;
        const isNegative = percentage < 0;

        const color = isPositive
            ? "var(--green-70)"
            : isNegative
                ? "var(--red-70)"
                : "var(--gray-70)";

        const rotation = isNegative ? "rotate(180deg)" : "rotate(0deg)";

        return (
            <div className={Style.GoArrowRightSection}>
                {percentage !== 0 && (
                    <IoIosArrowRoundUp
                        size={26}
                        color={color}
                        style={{ transform: rotation }}
                    />
                )}

                <p style={{ color }}>
                    {isPositive}
                    {percentage}%
                </p>
            </div>
        );
    };



    // Workorder Distribution Map Data
    const options = {
        responsive: true,
        scales: {
            x: {
                border: { display: false },
                grid: { display: false },
            },
            y: {
                border: { display: false },
                grid: {
                    color: '#E9EDEE',
                    lineWidth: 2,
                    drawOnChartArea: true,
                    tickBorderDash: [6, 6],
                    drawOnChartArea: true
                },
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            title: {
                display: false,
            },
        },
    };

    const yearLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const sevenDaysLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const lastWeekLabels = ['First Week', 'Second Week', 'Third Week', 'Fourth Week'];

    const data = {
        labels: filterSectionState?.workOrderFilter == "yearly" ? yearLabels : filterSectionState?.workOrderFilter == "monthly" ? lastWeekLabels : filterSectionState?.workOrderFilter == "weekly" ? sevenDaysLabels : "",
        datasets: [
            {
                label: 'Approved',
                data: filterSectionState?.workOrderFilter == "yearly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[5]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[6]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[7]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[8]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[9]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[10]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[11]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[12]?.approved ?? 0,
                ] : filterSectionState?.workOrderFilter == "monthly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.approved ?? 0,
                ] : filterSectionState?.workOrderFilter == "weekly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[5]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[6]?.approved ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[7]?.approved ?? 0,
                ] : [],
                backgroundColor: '#214CBC',
                categoryPercentage: 0.4,
                barPercentage: 0.8,
                borderRadius: 2,
            },
            {
                label: 'Pending',
                data: filterSectionState?.workOrderFilter == "yearly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[5]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[6]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[7]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[8]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[9]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[10]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[11]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[12]?.pending ?? 0,
                ] : filterSectionState?.workOrderFilter == "monthly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.pending ?? 0,
                ] : filterSectionState?.workOrderFilter == "weekly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[5]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[6]?.pending ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[7]?.pending ?? 0,
                ] : [],
                backgroundColor: '#F1C34D',
                categoryPercentage: 0.4,
                barPercentage: 0.8,
                borderRadius: 2,
            },
            {
                label: 'Declined',
                data: filterSectionState?.workOrderFilter == "yearly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[5]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[6]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[7]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[8]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[9]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[10]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[11]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[12]?.declined ?? 0,
                ] : filterSectionState?.workOrderFilter == "monthly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.declined ?? 0,
                ] : filterSectionState?.workOrderFilter == "weekly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[5]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[6]?.declined ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[7]?.declined ?? 0,
                ] : [],
                backgroundColor: '#F14D4D',
                categoryPercentage: 0.4,
                barPercentage: 0.8,
                borderRadius: 2,
            },
            {
                label: 'Completed',
                data: filterSectionState?.workOrderFilter == "yearly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[5]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[6]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[7]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[8]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[9]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[10]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[11]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[12]?.completed ?? 0,
                ] : filterSectionState?.workOrderFilter == "monthly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.completed ?? 0,
                ] : filterSectionState?.workOrderFilter == "weekly" ? [
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[1]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[2]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[3]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[4]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[5]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[6]?.completed ?? 0,
                    wholeDashboardDataApi?.graphs?.workOrderDistribution?.[7]?.completed ?? 0,
                ] : [],
                backgroundColor: '#21AB70',
                categoryPercentage: 0.4,
                barPercentage: 0.8,
                borderRadius: 2,
            },
        ],
    };
    // Workorder Distribution Map Data




    // POIs by Threat Level
    const threatLevelData = {
        labels: ['Lowest Risk', 'No Risk', 'Moderate Risk', 'Extreme Risk', 'High Risk'],
        datasets: [
            {
                data: [
                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "Lowest")?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "No Threat")?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "Moderate")?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "Extreme")?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "High")?.total ?? 0,
                ],
                backgroundColor: [
                    'rgba(28, 143, 93, 1)',
                    'rgba(98, 109, 111, 1)',
                    'rgba(241, 195, 77, 1)',
                    'rgba(121, 39, 39, 1)',
                    'rgba(241, 77, 77, 1)',
                ],
                borderColor: [
                    'white',
                    'white',
                    'white',
                    'white',
                    'white',
                ],
                borderWidth: 1,
                cutout: '75%',
            },
        ],
    };
    const threatLevelOption = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
            }
        },
        plugins: {
            legend: {
                position: 'right',
                display: false,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 10,
                    display: false,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(0);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };
    const threatLevelTotalSum = wholeDashboardDataApi?.graphs?.threatLevels.reduce((sum, item) => sum + item.total, 0);

    const threatLevelUpdatedData = wholeDashboardDataApi?.graphs?.threatLevels.map(item => ({
        ...item,
        percentage: Number(((item.total / threatLevelTotalSum) * 100).toFixed(1))
    }));
    const centerTextPlugin1 = {
        id: 'centerText',
        afterDraw(chart) {
            const { ctx, chartArea, data } = chart;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            ctx.save();
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            ctx.font = '18px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('Total POIs', centerX, centerY - 8);



            ctx.font = 'bold 42px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#1a1e2b';
            ctx.textBaseline = 'top';
            ctx.fillText(wholeDashboardDataApi?.stats?.pois?.total?.toString(), centerX, centerY + 4);
            ctx.restore();
        },
    };
    // POIs by Threat Level



    // Alerts by Type
    const typeData = {
        labels: ['Lowest Risk', 'No Risk', 'Moderate Risk', 'Extreme Risk', 'High Risk'],
        datasets: [
            {
                data: [
                    // wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "WEATHER")?.total ?? 0,
                    // wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "HAZARD")?.total ?? 0,
                    // wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "SECURITY")?.total ?? 0,
                    // wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "COMMUNICATION")?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "Lowest")?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "No Threat")?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "Moderate")?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "Extreme")?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "High")?.total ?? 0,
                ],
                backgroundColor: [
                    'rgba(28, 143, 93, 1)',
                    'rgba(241, 77, 77, 1)',
                    'rgba(4, 79, 96, 1)',
                    'rgba(241, 195, 77, 1)',
                ],
                borderColor: [
                    'white',
                    'white',
                    'white',
                    'white',
                ],
                borderWidth: 1,
                cutout: '75%',
            },
        ],
    };
    const typeOption = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
            }
        },
        plugins: {
            legend: {
                position: 'right',
                display: false,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 10,
                    display: false,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(0);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };
    const alertTypesTotalSum = wholeDashboardDataApi?.graphs?.alertTypes.reduce((sum, item) => sum + item.total, 0);
    const alertTypesUpdatedData = wholeDashboardDataApi?.graphs?.alertTypes.map(item => ({
        ...item,
        percentage: Number(((item.total / alertTypesTotalSum) * 100).toFixed(1))
    }));
    const centerTextPlugin2 = {
        id: 'centerText',
        afterDraw(chart) {
            const { ctx, chartArea, data } = chart;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            ctx.save();
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            ctx.font = '18px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('Total Alerts', centerX, centerY - 8);



            ctx.font = 'bold 42px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#1a1e2b';
            ctx.textBaseline = 'top';
            ctx.fillText(wholeDashboardDataApi?.stats?.alerts?.total?.toString(), centerX, centerY + 4);
            ctx.restore();
        },
    };
    // Alerts by Type






    // Assets by Elevation Level
    const filterTypes = ["Below Ground", "Ground Level", "Overhead"];
    const assetElevationData = {
        labels: filterTypes,
        datasets: [
            {
                data: [
                    wholeDashboardDataApi?.graphs?.assetElevation
                        ?.find(data => data?._id?.includes("Below Ground"))?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.assetElevation
                        ?.find(data => data?._id?.includes("Ground Level"))?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.assetElevation
                        ?.find(data => data?._id?.includes("Overhead"))?.total ?? 0,
                ],
                backgroundColor: [
                    'rgba(241, 77, 77, 1)',
                    'rgba(28, 143, 93, 1)',
                    'rgba(241, 195, 77, 1)',
                ],
                borderColor: [
                    'white',
                    'white',
                    'white',
                    'white',
                ],
                borderWidth: 1,
                cutout: '75%',
            },
        ],
    };
    const assetElevationOption = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
            }
        },
        plugins: {
            legend: {
                position: 'right',
                display: false,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 10,
                    display: false,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(0);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };
    const resultWithTotalsAssets = filterTypes.map(type => ({
        type,
        total: wholeDashboardDataApi?.graphs?.assetElevation.reduce((sum, item) => {
            return item._id.includes(type) ? sum + item.total : sum;
        }, 0)
    }));
    const grandTotalAssets = resultWithTotalsAssets.reduce(
        (sum, item) => sum + item.total,
        0
    );
    const finalResultAssets = resultWithTotalsAssets.map(item => ({
        ...item,
        percentage: grandTotalAssets === 0
            ? 0
            : Number(((item.total / grandTotalAssets) * 100).toFixed(1))
    }));
    const centerTextPlugin3 = {
        id: 'centerText',
        afterDraw(chart) {
            const { ctx, chartArea, data } = chart;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            ctx.save();
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            ctx.font = '18px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('Total Assets', centerX, centerY - 8);



            ctx.font = 'bold 42px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#1a1e2b';
            ctx.textBaseline = 'top';
            ctx.fillText(wholeDashboardDataApi?.stats?.assets?.total?.toString(), centerX, centerY + 4);
            ctx.restore();
        },
    };
    // Assets by Elevation Level









    // Project by Elevation Level
    const projectElevationData = {
        labels: filterTypes,
        datasets: [
            {
                data: [
                    wholeDashboardDataApi?.graphs?.projectElevation
                        ?.find(data => data?._id?.includes("Below Ground"))?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.projectElevation
                        ?.find(data => data?._id?.includes("Ground Level"))?.total ?? 0,
                    wholeDashboardDataApi?.graphs?.projectElevation
                        ?.find(data => data?._id?.includes("Overhead"))?.total ?? 0,
                ],
                backgroundColor: [
                    'rgba(241, 77, 77, 1)',
                    'rgba(28, 143, 93, 1)',
                    'rgba(241, 195, 77, 1)',
                ],
                borderColor: [
                    'white',
                    'white',
                    'white',
                    'white',
                ],
                borderWidth: 1,
                cutout: '75%',
            },
        ],
    };
    const projectElevationOption = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
            }
        },
        plugins: {
            legend: {
                position: 'right',
                display: false,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 10,
                    display: false,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(0);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };
    const resultWithTotals = filterTypes.map(type => ({
        type,
        total: wholeDashboardDataApi?.graphs?.projectElevation.reduce((sum, item) => {
            return item._id.includes(type) ? sum + item.total : sum;
        }, 0)
    }));
    const grandTotalProject = resultWithTotals.reduce(
        (sum, item) => sum + item.total,
        0
    );
    const finalResultProject = resultWithTotals.map(item => ({
        ...item,
        percentage: grandTotalProject === 0
            ? 0
            : Number(((item.total / grandTotalProject) * 100).toFixed(1))
    }));
    const centerTextPlugin4 = {
        id: 'centerText',
        afterDraw(chart) {
            const { ctx, chartArea, data } = chart;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            ctx.save();
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            ctx.font = '18px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('Total Projects', centerX, centerY - 8);



            ctx.font = 'bold 42px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#1a1e2b';
            ctx.textBaseline = 'top';
            ctx.fillText(wholeDashboardDataApi?.stats?.projects?.total?.toString(), centerX, centerY + 4);
            ctx.restore();
        },
    };
    // Project by Elevation Level





    return (

        <>
            {contextHolder}
            <div className={Style.MainContainer}>

                <div className={Style.SectionTopDropDown}>
                    <div className={Style.SecondaryHeader}>
                        <p>{formatted}</p>
                        <h1>
                            {greeting},{" "}
                            {localStorage.getItem("Lp3@vBN9tw69gV*R2/+1?w==") || ""}
                        </h1>
                    </div>

                    <Select
                        getPopupContainer={(triggerNode) => triggerNode.parentElement}
                        style={{ height: 42, width: 200 }}
                        placeholder="Select Duration"
                        value={filterSectionState?.statsFilter}
                        options={threatLevelOptionSelect}
                        disabled={!workSite}
                        onChange={(e) => setFilterSectionState(prev => ({ ...prev, statsFilter: e }))}
                    />
                </div>

                <div className={Style.DashBoardBody}>
                    <Row gutter={[{ xs: 16, sm: 16, md: 16, lg: 16 }, { xs: 16, sm: 16, md: 16, lg: 16 }]}>
                        <Col className="gutter-row" lg={6} md={12} sm={24} xs={24}>
                            {wholeDashboardDataApiLoader ?
                                <div className={Style.SkeltonLoader}>
                                    <Skeleton active />
                                </div>
                                :
                                <div className={Style.DashBoardCol}>
                                    <div className={Style.Dashbaord_Top_Icon}>
                                        <div className={Style.Icon_Inner}>
                                            <img src={Dashboard1} />
                                        </div>

                                        <div className={Style.GoArrowRightSection}>
                                            {renderPercentage(wholeDashboardDataApi?.stats?.teams?.percentage)}
                                        </div>
                                    </div>
                                    <div className={Style.mainContentBody}>
                                        <h1>{wholeDashboardDataApi?.stats?.teams?.total ?? 0}</h1>
                                        <h2>No of Teams</h2>
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col className="gutter-row" lg={6} md={12} sm={24} xs={24}>
                            {wholeDashboardDataApiLoader ?
                                <div className={Style.SkeltonLoader}>
                                    <Skeleton active />
                                </div>
                                :
                                <div className={Style.DashBoardCol}>
                                    <div className={Style.Dashbaord_Top_Icon}>
                                        <div className={Style.Icon_Inner}>
                                            <img src={Dashboard2} />
                                        </div>

                                        <div className={Style.GoArrowRightSection}>
                                            {renderPercentage(wholeDashboardDataApi?.stats?.workorders?.percentage)}
                                        </div>
                                    </div>
                                    <div className={Style.mainContentBody}>
                                        <h1>{wholeDashboardDataApi?.stats?.workorders?.total ?? 0}</h1>
                                        <h2>No of Work Orders</h2>
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col className="gutter-row" lg={6} md={12} sm={24} xs={24}>
                            {wholeDashboardDataApiLoader ?
                                <div className={Style.SkeltonLoader}>
                                    <Skeleton active />
                                </div>
                                :
                                <div className={Style.DashBoardCol}>
                                    <div className={Style.Dashbaord_Top_Icon}>
                                        <div className={Style.Icon_Inner}>
                                            <img src={Dashboard3} />
                                        </div>


                                        <div className={Style.GoArrowRightSection}>
                                            {renderPercentage(wholeDashboardDataApi?.stats?.pois?.percentage)}
                                        </div>
                                    </div>
                                    <div className={Style.mainContentBody}>
                                        <h1>{wholeDashboardDataApi?.stats?.pois?.total ?? 0}</h1>
                                        <h2>No of POIs</h2>
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col className="gutter-row" lg={6} md={12} sm={24} xs={24}>
                            {wholeDashboardDataApiLoader ?
                                <div className={Style.SkeltonLoader}>
                                    <Skeleton active />
                                </div>
                                :
                                <div className={Style.DashBoardCol}>
                                    <div className={Style.Dashbaord_Top_Icon}>
                                        <div className={Style.Icon_Inner}>
                                            <img src={Dashboard4} />
                                        </div>


                                        <div className={Style.GoArrowRightSection}>
                                            {renderPercentage(wholeDashboardDataApi?.stats?.alerts?.percentage)}
                                        </div>
                                    </div>
                                    <div className={Style.mainContentBody}>
                                        <h1>{wholeDashboardDataApi?.stats?.alerts?.total ?? 0}</h1>
                                        <h2>No of Alerts</h2>
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col className="gutter-row" lg={6} md={12} sm={24} xs={24}>
                            {wholeDashboardDataApiLoader ?
                                <div className={Style.SkeltonLoader}>
                                    <Skeleton active />
                                </div>
                                :
                                <div className={Style.DashBoardCol}>
                                    <div className={Style.Dashbaord_Top_Icon}>
                                        <div className={Style.Icon_Inner}>
                                            <img src={Dashboard5} />
                                        </div>


                                        <div className={Style.GoArrowRightSection}>
                                            {renderPercentage(wholeDashboardDataApi?.stats?.assets?.percentage)}
                                        </div>
                                    </div>
                                    <div className={Style.mainContentBody}>
                                        <h1>{wholeDashboardDataApi?.stats?.assets?.total ?? 0}</h1>
                                        <h2>No of Assets</h2>
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col className="gutter-row" lg={6} md={12} sm={24} xs={24}>
                            {wholeDashboardDataApiLoader ?
                                <div className={Style.SkeltonLoader}>
                                    <Skeleton active />
                                </div>
                                :
                                <div className={Style.DashBoardCol}>
                                    <div className={Style.Dashbaord_Top_Icon}>
                                        <div className={Style.Icon_Inner}>
                                            <img src={Dashboard6} />
                                        </div>


                                        <div className={Style.GoArrowRightSection}>
                                            {renderPercentage(wholeDashboardDataApi?.stats?.projects?.percentage)}
                                        </div>
                                    </div>
                                    <div className={Style.mainContentBody}>
                                        <h1>{wholeDashboardDataApi?.stats?.projects?.total ?? 0}</h1>
                                        <h2>No of Projects</h2>
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col className="gutter-row" lg={6} md={12} sm={24} xs={24}>
                            {wholeDashboardDataApiLoader ?
                                <div className={Style.SkeltonLoader}>
                                    <Skeleton active />
                                </div>
                                :
                                <div className={Style.DashBoardCol}>
                                    <div className={Style.Dashbaord_Top_Icon}>
                                        <div className={Style.Icon_Inner}>
                                            <img src={Dashboard7} />
                                        </div>


                                        <div className={Style.GoArrowRightSection}>
                                            {renderPercentage(wholeDashboardDataApi?.stats?.users?.percentage)}
                                        </div>
                                    </div>
                                    <div className={Style.mainContentBody}>
                                        <h1>{wholeDashboardDataApi?.stats?.users?.total ?? 0}</h1>
                                        <h2>No of Users</h2>
                                    </div>
                                </div>
                            }
                        </Col>

                        <Col className="gutter-row" lg={24} md={24} sm={24} xs={24}>
                            <DashboardMap progress={progress} loadingPara={"Please wait while we securely load map information. This may take a moment."} loadingTitle={"Fetching Worksite Data."} isLoadingData={isLoadingData} GetMusterStation={GetMusterStation} WorksiteReducer={WorksiteReducer} WorkOrderReducer={WorkOrderReducer} AlertsReducer={AlertsReducer} AssetsReducer={AssetsReducer} ProjectReducer={ProjectReducer} WorkPOIGetByIdMap={WorkPOIGetByIdMap} GetAlertsByIDMap={GetAlertsByIDMap} GetAssetsByIDMap={GetAssetsByIDMap} WorkOrderGetByIdMap={WorkOrderGetByIdMap} GetProjectByIDMap={GetProjectByIDMap} alertData={alertData} poiData={poiData} AssetsData={AssetsData} projectData={projectData} myWorkOrderData={myWorkOrderData} messageApi={messageApi} viewWorkOrder={viewWorkOrder} viewAlerts={viewAlerts} viewPOIs={viewPOIs} viewAssets={viewAssets} viewProject={viewProject} MapData={wholeMapData} PoiReducer={PoiReducer} />
                        </Col>

                        <Col className="gutter-row" lg={24} md={24} sm={24} xs={24}>
                            <div className={Style.BarStyleChart}>
                                <div className={Style.BarFilterSide}>
                                    <h2>Work Order Distribution</h2>
                                    <div className={Style.FilterFile}>
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            style={{ height: 42, width: 200 }}
                                            placeholder="Created by"
                                            options={AssignSelectOption}
                                            onChange={(value) =>
                                                setFilterSectionState((prev) => ({
                                                    ...prev,
                                                    createdByMe: value,
                                                    requestedByMe: !value,
                                                }))
                                            }
                                            value={filterSectionState?.createdByMe}
                                            disabled={!workSite}
                                        />
                                        <span className={Style.SpaceSpan}>
                                            <Select
                                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                                style={{ height: 42, width: 200 }}
                                                placeholder="Select Duration"
                                                options={threatLevelOptionSelect}
                                                onChange={(e) => setFilterSectionState(prev => ({ ...prev, workOrderFilter: e }))}
                                                value={filterSectionState?.workOrderFilter}
                                                disabled={!workSite}
                                            />
                                        </span>
                                    </div>
                                </div>
                                <Bar options={options} data={data} />
                            </div>
                        </Col>









                        <Col className="gutter-row" lg={12} md={12} sm={24} xs={24}>
                            <div className={Style.BarStyleChart21}>
                                <div className={Style.BarFilterSide}>
                                    <h2>POIs by Threat Level</h2>
                                    <div className={Style.FilterFile}>
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            style={{ height: 42, width: 200 }}
                                            placeholder="Select Duration"
                                            options={threatLevelOptionSelect}
                                            onChange={(e) => setFilterSectionState(prev => ({ ...prev, threatFilter: e }))}
                                            value={filterSectionState?.threatFilter}
                                            disabled={!workSite}
                                        />
                                    </div>
                                </div>
                                {[
                                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "Lowest")?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "No Threat")?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "Moderate")?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "Extreme")?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.threatLevels?.find(data => data?._id == "High")?.total ?? 0,
                                ]?.every(value => value === 0) ?
                                    <div className={Style.DoughnutWrapLoad}>
                                        <img src={MapBlue} />
                                        <h4>Add your first Point of Interest to monitor zones and assess safety threat levels.</h4>
                                    </div>
                                    :
                                    <div className={Style.DoughnutWrap}>
                                        <div style={{ height: "300px" }}>
                                            <Doughnut
                                                data={threatLevelData}
                                                options={threatLevelOption}
                                                plugins={[centerTextPlugin1]}
                                            />
                                        </div>
                                        <div className={Style.DoughNutRightWrap}>
                                            {threatLevelUpdatedData?.map((data, index) =>
                                                <div style={{ padding: index == 0 && 0 }} className={Style.rowNewMap}>
                                                    <div className={Style.rowFlex}>
                                                        <div style={{ background: data._id == "Lowest" ? "rgba(28, 143, 93, 1)" : data._id == "No Threat" ? "rgba(98, 109, 111, 1)" : data._id == "Moderate" ? "rgba(241, 195, 77, 1)" : data._id == "Extreme" ? "rgba(121, 39, 39, 1)" : data._id == "High" ? "rgba(241, 77, 77, 1)" : "" }} className={Style.ColoredIcon}></div>
                                                        <p>{data._id == "Lowest" ? "Lowest Risk" : data._id == "No Threat" ? "No Risk" : data._id == "Moderate" ? "Moderate Risk" : data._id == "Extreme" ? "Extreme Risk" : data._id == "High" ? "High Risk" : ""}</p>
                                                    </div>
                                                    <p>{data?.total}({data.percentage}%)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                }
                            </div>
                        </Col>

                        <Col className="gutter-row" lg={12} md={12} sm={24} xs={24}>
                            <div className={Style.BarStyleChart21}>
                                <div className={Style.BarFilterSide}>
                                    <h2>Alerts by Threat Level</h2>
                                    <div className={Style.FilterFile}>
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            style={{ height: 42, width: 200 }}
                                            placeholder="Select Duration"
                                            options={threatLevelOptionSelect}
                                            onChange={(e) => setFilterSectionState(prev => ({ ...prev, alertTypeFilter: e }))}
                                            value={filterSectionState?.alertTypeFilter}
                                            disabled={!workSite}
                                        />
                                    </div>
                                </div>
                                {[
                                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "Lowest")?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "No Threat")?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "Moderate")?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "Extreme")?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.alertTypes?.find(data => data?._id == "High")?.total ?? 0,
                                ]?.every(value => value === 0) ?
                                    <div className={Style.DoughnutWrapLoad}>
                                        <img src={AlertBlue} />
                                        <h4>Once alerts are triggered on your site, you’ll see them categorized here by type.</h4>
                                    </div>
                                    :
                                    <div className={Style.DoughnutWrap}>
                                        <div style={{ height: "300px" }}>
                                            <Doughnut
                                                data={typeData}
                                                options={typeOption}
                                                plugins={[centerTextPlugin2]}
                                            />
                                        </div>
                                        <div className={Style.DoughNutRightWrap}>
                                            {alertTypesUpdatedData?.map((data, index) =>
                                                <div style={{ padding: index == 0 && 0 }} className={Style.rowNewMap}>
                                                    <div className={Style.rowFlex}>
                                                        <div style={{ background: data._id == "Lowest" ? "rgba(28, 143, 93, 1)" : data._id == "No Threat" ? "rgba(98, 109, 111, 1)" : data._id == "Moderate" ? "rgba(241, 195, 77, 1)" : data._id == "Extreme" ? "rgba(121, 39, 39, 1)" : data._id == "High" ? "rgba(241, 77, 77, 1)" : "" }} className={Style.ColoredIcon}></div>
                                                        <p>{data._id == "Lowest" ? "Lowest Risk" : data._id == "No Threat" ? "No Risk" : data._id == "Moderate" ? "Moderate Risk" : data._id == "Extreme" ? "Extreme Risk" : data._id == "High" ? "High Risk" : ""}</p>
                                                    </div>
                                                    <p>{data?.total}({data.percentage}%)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                }
                            </div>
                        </Col>

                        <Col className="gutter-row" lg={12} md={12} sm={24} xs={24}>
                            <div className={Style.BarStyleChart21}>
                                <div className={Style.BarFilterSide}>
                                    <h2>Assets by Elevation Level</h2>
                                    <div className={Style.FilterFile}>
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            style={{ height: 42, width: 200 }}
                                            placeholder="Select Duration"
                                            options={threatLevelOptionSelect}
                                            onChange={(e) => setFilterSectionState(prev => ({ ...prev, assetFilter: e }))}
                                            value={filterSectionState?.assetFilter}
                                            disabled={!workSite}
                                        />
                                    </div>
                                </div>
                                {[
                                    wholeDashboardDataApi?.graphs?.assetElevation
                                        ?.find(data => data?._id?.includes("Below Ground"))?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.assetElevation
                                        ?.find(data => data?._id?.includes("Ground Level"))?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.assetElevation
                                        ?.find(data => data?._id?.includes("Overhead"))?.total ?? 0,
                                ]?.every(value => value === 0) ?
                                    <div className={Style.DoughnutWrapLoad}>
                                        <img src={ElevationBlue} />
                                        <h4>Add assets to track their elevation level and manage safety measures accordingly.</h4>
                                    </div>
                                    :
                                    <div className={Style.DoughnutWrap}>
                                        <div style={{ height: "300px" }}>
                                            <Doughnut
                                                data={assetElevationData}
                                                options={assetElevationOption}
                                                plugins={[centerTextPlugin3]}
                                            />
                                        </div>
                                        <div className={Style.DoughNutRightWrap}>
                                            {finalResultAssets?.map((data, index) =>
                                                <div style={{ padding: index == 0 && 0 }} className={Style.rowNewMap}>
                                                    <div className={Style.rowFlex}>
                                                        <div style={{ background: data.type == "Below Ground" ? "rgba(241, 77, 77, 1)" : data.type == "Ground Level" ? "rgba(28, 143, 93, 1)" : data.type == "Overhead" ? "rgba(241, 195, 77, 1)" : "" }} className={Style.ColoredIcon}></div>
                                                        <p>{data.type == "Below Ground" ? "Below Ground" : data.type == "Ground Level" ? "Ground Level" : data.type == "Overhead" ? "Overhead" : ""}</p>
                                                    </div>
                                                    <p>{data?.total}({data.percentage}%)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                }
                            </div>
                        </Col>

                        <Col className="gutter-row" lg={12} md={12} sm={24} xs={24}>
                            <div className={Style.BarStyleChart21}>
                                <div className={Style.BarFilterSide}>
                                    <h2>Projects by Elevation Level</h2>
                                    <div className={Style.FilterFile}>
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                            style={{ height: 42, width: 200 }}
                                            placeholder="Select Duration"
                                            options={threatLevelOptionSelect}
                                            onChange={(e) => setFilterSectionState(prev => ({ ...prev, projectFilter: e }))}
                                            value={filterSectionState?.projectFilter}
                                            disabled={!workSite}
                                        />
                                    </div>
                                </div>
                                {[
                                    wholeDashboardDataApi?.graphs?.projectElevation
                                        ?.find(data => data?._id?.includes("Below Ground"))?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.projectElevation
                                        ?.find(data => data?._id?.includes("Ground Level"))?.total ?? 0,
                                    wholeDashboardDataApi?.graphs?.projectElevation
                                        ?.find(data => data?._id?.includes("Overhead"))?.total ?? 0,
                                ]?.every(value => value === 0) ?
                                    <div className={Style.DoughnutWrapLoad}>
                                        <img src={CategoryBlue} />
                                        <h4>Start tracking your projects by elevation to improve site planning and visibility.</h4>
                                    </div>
                                    :
                                    <div className={Style.DoughnutWrap}>
                                        <div style={{ height: "300px" }}>
                                            <Doughnut
                                                data={projectElevationData}
                                                options={projectElevationOption}
                                                plugins={[centerTextPlugin4]}
                                            />
                                        </div>
                                        <div className={Style.DoughNutRightWrap}>
                                            {finalResultProject?.map((data, index) =>
                                                <div style={{ padding: index == 0 && 0 }} className={Style.rowNewMap}>
                                                    <div className={Style.rowFlex}>
                                                        <div style={{ background: data.type == "Below Ground" ? "rgba(241, 77, 77, 1)" : data.type == "Ground Level" ? "rgba(28, 143, 93, 1)" : data.type == "Overhead" ? "rgba(241, 195, 77, 1)" : "" }} className={Style.ColoredIcon}></div>
                                                        <p>{data.type == "Below Ground" ? "Below Ground" : data.type == "Ground Level" ? "Ground Level" : data.type == "Overhead" ? "Overhead" : ""}</p>
                                                    </div>
                                                    <p>{data?.total}({data.percentage}%)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>




            <Modal
                closable={false}
                open={searchLocationModal}
                onCancel={handleLocationCancel}
                footer={() => { <></> }}
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
                className="no-padding-modal"
                style={{ top: width < 660 && 0 }}
            >
                <div
                    style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        fontFamily: "Arial, sans-serif",
                        backgroundColor: "#fff",
                        margin: "0px 0px"
                    }}
                >
                    {/* Banner Image */}
                    <div
                        style={{
                            height: "300px",
                            backgroundImage:
                                `url(${locationImage2})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    />

                    {/* Content */}
                    <div style={{ padding: "20px" }}>
                        {/* Logo + Heading */}
                        <div style={{ marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                <img
                                    src={locationImage19}
                                    alt="NSC Logo"
                                    style={{ height: "47px", marginBottom: "10px" }}
                                />
                                <img
                                    src={Stacked2Image}
                                    alt="NSC Logo"
                                    style={{ height: "47px", marginBottom: "10px", marginLeft: 10 }}
                                />


                            </div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#25292A",
                                    lineHeight: "1.4"
                                }}
                            >
                                WorkSafe 3 day Free Trial — Showcased at NSC 2025
                            </h2>
                        </div>

                        <p
                            style={{
                                fontSize: "14px",
                                color: "#51595A",
                                lineHeight: "1.6",
                                margin: "10px 0 20px 0"
                            }}
                        >
                            As part of our presence at the NSC 2025 Safety Congress & Expo, you now
                            have full 3 day trial access to WorkSafe’s safety and worksite
                            management tools.
                        </p>

                        <div style={{ marginBottom: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img style={{ height: 20, width: 20 }} src={blueIcon1} />
                                <p style={{ marginBottom: 0, marginTop: 0, marginLeft: "5px", fontSize: "14px", color: "#25292A" }}>15 to 17 September</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", marginTop: 7 }}>
                                <img style={{ height: 20, width: 20 }} src={blueIcon2} />
                                <p style={{ marginBottom: 0, marginTop: 0, marginLeft: "5px", fontSize: "14px", color: "#25292A" }}>Denver, CO</p>
                            </div>
                            <a href={"https://congress.nsc.org/NSC2025/Public/eventmap.aspx?EventId=41&MapItBoothID=202578&MapItBooth=935&MapID=50"} target='_blank' style={{ display: "flex", alignItems: "center", marginTop: 7 }}>
                                <img style={{ height: 20, width: 20 }} src={blueIcon3} />
                                <p style={{ marginBottom: 0, marginTop: 0, marginLeft: "5px", fontSize: "14px", color: "#25292A", textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Booth #935</p>
                            </a>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => {
                                handleLocationCancel()
                                localStorage.setItem("IsPromote", "true")
                            }}
                            style={{
                                width: "100%",
                                backgroundColor: "#214CBC",
                                color: "#fff",
                                fontSize: "16px",
                                fontWeight: "600",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            Start free trial
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

function mapStateToProps({ AlertsReducer, PoiReducer, AssetsReducer, ProjectReducer, WorkOrderReducer, WorksiteReducer }) {
    return { AlertsReducer, PoiReducer, AssetsReducer, ProjectReducer, WorkOrderReducer, WorksiteReducer };
}
export default connect(mapStateToProps, {
    ...AlertAction,
    ...POIAction,
    ...AssetsAction,
    ...ProjectAction,
    ...WorkOrderAction,
    ...WorkSiteAction
})(DashboardScreen);