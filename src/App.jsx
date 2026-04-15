import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router'
import * as EvacuationAction from '../store/actions/Evacuate';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'
import AuthenticatedRoutes from './routes/AuthenticatedRoutes.jsx'
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes.jsx'
import AdminRoutes from './routes/adminRoutes.jsx'
import { connect, useDispatch } from 'react-redux';
import { baseUrl } from '../store/config.json'
import { TASK_LOAD_EVACUATE_COMPLETE } from '../store/actions/types.js';
import { useSelector } from 'react-redux';
import { Button, notification, Space } from 'antd';
import { LuCircleAlert } from 'react-icons/lu';



TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)




function App({ loadEvacuationData, GetEvacuate }) {
  const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
  const WorkSiteId = localStorage.getItem("+AOQ^%^f0Gn4frTqztZadLrKg==");
  const UserID = localStorage.getItem('0U7Qv$N3tw69gV+T2/~1/w==')
  const [notificationApi, notificationContextHolder] = notification.useNotification();


  const navigate = useNavigate();


  const openNotification = () => {
    notificationApi.open({
      message: 'Emergency Evacuation Created',
      description:
        'An emergency evacuation event has just been initiated. Please review the evacuation details and ensure all safety protocols are followed.',
      icon: <LuCircleAlert color="red" />,
      pauseOnHover: true,
      style: { width: 500, cursor: 'pointer' },
      placement: 'bottomRight',
      onClick: () => { navigate("/evacuate/list") }
    });
  };


  useEffect(() => {
    loadEvacuationData(openNotification)
    if (WorkSiteId) {
      GetEvacuate(WorkSiteId)
    }
    // const handleFocus = (e) => {
    //   if (e.target?.type === "text") {
    //     document.body.style.overflow = "hidden";
    //   }
    // };
    // const handleBlur = () => {
    //   document.body.style.overflow = "auto";
    // };

    // document.addEventListener("focusin", handleFocus);
    // document.addEventListener("focusout", handleBlur);

    // return () => {
    //   document.removeEventListener("focusin", handleFocus);
    //   document.removeEventListener("focusout", handleBlur);
    // };
  }, []);

  return (
    <>
      {notificationContextHolder}
      {(baseUrl.includes("staging") || baseUrl.includes("devtunnels")) && (
        <div
          style={{
            background: 'red',
            paddingInline: 20,
            paddingBlock: 5,
            border: "none",
            borderRadius: 20,
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 9999
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: 'white',
              fontWeight: 'bolder',
              margin: 0
            }}
          >
            {baseUrl.includes("staging")
              ? "Staging"
              : baseUrl.includes("devtunnels")
                ? "Tunnel"
                : ""}
            {" "}Mode
          </p>
        </div>
      )}

      {token !== null ? UserID == "6768f37ff2ef345b103370df" ? <AdminRoutes /> : <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </>
  )
}


function mapStateToProps({ EvacuateReducer }) {
  return { EvacuateReducer };
}
export default connect(mapStateToProps, EvacuationAction)(App);
