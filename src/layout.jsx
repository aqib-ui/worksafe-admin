import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Style from './layout.module.css';
import SideBar from "./component/sideBar";
import Header from "./component/header";
import { message } from "antd";
import { connect } from "react-redux";
import * as ProjectAction from '../store/actions/Project/index';

function Layout({ MessageReducer }) {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (MessageReducer?.content !== "") {
      messageApi.open({
        type: MessageReducer.messageType || 'info',
        content: MessageReducer.content,
        duration: 3,
      });
    }
  }, [MessageReducer, messageApi]);

  return (
    <>
      {contextHolder}
      <div className={Style.MainContainer}>
        <Header />
        <div className={Style.MainBody}>
          <SideBar />
          <div className={Style.Content}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

function mapStateToProps({ MessageReducer }) {
  return { MessageReducer };
}

export default connect(mapStateToProps, ProjectAction)(Layout);
