import { useEffect, useState } from 'react'
import Style from './ProjectScreen.module.css'
import { Dropdown, message, Space, Table, Tag } from 'antd'
import * as ProjectAction from '../../../../store/actions/Project/index';
import { connect, useDispatch } from 'react-redux';
import { MdOutlineSettings } from 'react-icons/md';
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import ReactTimeAgo from 'react-time-ago';
import { IoCheckmark, IoClose, IoEyeOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useNavigate, useOutletContext } from 'react-router';
import { TASK_CLEAR_EXPIRED } from '../../../../store/actions/types';


function MyChat({ ProjectReducer, GetProjects, ArchiveProject }) {
    const [messageApi, contextHolder] = message.useMessage();

    
    return (
        <>
            {contextHolder}
            <div className={Style.TableSection}>
                <div className={Style.ChatListing}></div>
            </div>
        </>
    )
}

function mapStateToProps({ ProjectReducer }) {
    return { ProjectReducer };
}
export default connect(mapStateToProps, ProjectAction)(MyChat);
