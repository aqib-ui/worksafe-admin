// import { Tooltip } from 'antd';
// import Style from './AlertsScreen.module.css'
// import { Outlet, useLocation, useNavigate } from 'react-router';
// import { FiPlus } from "react-icons/fi";
// import { useEffect, useState } from 'react';
// import { baseUrl } from '../../../../store/config.json'
// import ListInputSearch from '../../../component/ListInputSearch';



// const AlertLayout = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
//     const [query, setQuery] = useState('')
//     const removeTemp = () => {
//         localStorage.removeItem('v@XZ+L4mA1#cK8^y6JtEdr9')
//         localStorage.removeItem('#B9wNc@z8P^mA27!q+JDkLrX')
//     }
//     return (
//         <>
//             <div className={Style.MainContainer}>
//                 <>
//                     <div>
//                         <div className={Style.SecondaryHeader}>
//                             <h1>Alert Management</h1>
//                         </div>
//                     </div>
//                     <div className={Style.TabHeader}>
//                         <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
//                             <button style={location.pathname == "/alerts/my-alerts" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/alerts/my-alerts')}>Alerts</button>
//                             <button style={location.pathname == "/alerts/archived" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/alerts/archived')}>Archived</button>
//                             <Tooltip title={"Create Alerts"}>
//                                 <button onClick={() => {
//                                     removeTemp()
//                                     navigate('/alerts/create')
//                                 }} style={location.pathname == "/alerts/create" ? { border: '1px solid #214CBC', color: "#214CBC" } : null}><FiPlus color='#214CBC' size={22} /></button>
//                             </Tooltip>
//                         </div>
//                         <div>
//                             <ListInputSearch onChange={setQuery} value={query} placeholder="Search Alerts" debounceTime={500} />
//                         </div>
//                     </div>
//                     <div className={Style.TableSectionLayout}>
//                         <Outlet context={{ searchQuery: query }} />
//                     </div>
//                 </>
//             </div>
//         </>
//     )
// }

// export default AlertLayout;




import { Tooltip } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';
import ListInputSearch from '../../../component/ListInputSearch';
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect } from 'react-redux';
import { deleteWarrantyFile, getWarrantyFiles } from '../../../component/indexDB';
import Style from './AlertsScreen.module.css'



const AlertLayout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const [query, setQuery] = useState('')
    const removeTemp = () => {
        localStorage.removeItem('v@XZ+L4mA1#cK8^y6JtEdr9')
        localStorage.removeItem('#B9wNc@z8P^mA27!q+JDkLrX')
    }

    useEffect(()=>{
        localStorage.removeItem("cLocation");
        localStorage.removeItem("sLocation");
        localStorage.removeItem("Q9#vL2@X!mT8_Pz7&KcR*w==")
    },[])
    return (
        <>
            <div className={Style.MainContainer}>
                <>
                    <div>
                        <div className={Style.SecondaryHeader}>
                            <h1>Alert Management</h1>
                        </div>
                    </div>
                    <div className={Style.TabHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button className={Style.TabBtn} style={location.pathname == "/alerts/my-alerts" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/alerts/my-alerts')}>Alerts</button>
                            <button className={Style.TabBtn} style={location.pathname == "/alerts/archived" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/alerts/archived')}>Archived</button>
                        </div>
                        <div>
                            <button className={Style.NewBtn} onClick={() => navigate('/alerts/create')}>Create Alert</button>
                        </div>
                    </div>
                    <div className={Style.TableSectionLayout}>
                        <Outlet context={{ searchQuery: query }} />
                    </div>
                </>
            </div>
        </>
    )
}


export default AlertLayout;
