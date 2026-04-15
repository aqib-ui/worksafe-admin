import { Tooltip } from 'antd';
import Style from './ProjectScreen.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { baseUrl } from '../../../../store/config.json'
import ListInputSearch from '../../../component/ListInputSearch';



const ChatLayout = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className={Style.MainContainer}>
                <div className={Style.TableSectionLayout}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default ChatLayout;