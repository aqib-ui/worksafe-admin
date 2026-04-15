import { Tooltip } from 'antd';
import Style from './EvacuateList.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { baseUrl } from '../../../../store/config.json'
import ListInputSearch from '../../../component/ListInputSearch';



const EvacuateLayout = () => {
    return (
        <>
            <div className={Style.MainContainer}>
                <>
                    <div>
                        <div className={Style.SecondaryHeader}>
                            <h1>Emergency Evacuation</h1>
                        </div>
                    </div>
                    <div className={Style.TabHeader}>
                        
                    </div>
                    <div className={Style.TableSectionLayout}>
                        <Outlet />
                    </div>
                </>
            </div>
        </>
    )
}

export default EvacuateLayout;