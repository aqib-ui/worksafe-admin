// import { Tooltip } from 'antd';
// import Style from './AssetsScreen.module.css'
// import { Outlet, useLocation, useNavigate } from 'react-router';
// import { FiPlus } from "react-icons/fi";
// import { useEffect, useState } from 'react';
// import { baseUrl } from '../../../../store/config.json'
// import ListInputSearch from '../../../component/ListInputSearch';



// const AssetsLayout = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
//     const [query, setQuery] = useState('')
//     const removeTemp = () => {
//         localStorage.removeItem('#qz+M8t^d@LACY9PkE1X7vr')
//         localStorage.removeItem('tMk+@!v2YCXzqLd79#PrA8E')
//     }
//     return (
//         <>
//             <div className={Style.MainContainer}>
//                 <>
//                     <div>
//                         <div className={Style.SecondaryHeader}>
//                             <h1>Assets Management</h1>
//                         </div>
//                     </div>
//                     <div className={Style.TabHeader}>
//                         <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
//                             <button style={location.pathname == "/assets/my-assets" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/assets/my-assets')}>Assets</button>
//                             <button style={location.pathname == "/assets/archived" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/assets/archived')}>Archived</button>
//                             <Tooltip title={"Create assets"}>
//                                 <button onClick={() => {
//                                     removeTemp()
//                                     navigate('/assets/create')
//                                 }} style={location.pathname == "/assets/create" ? { border: '1px solid #214CBC', color: "#214CBC" } : null}><FiPlus color='#214CBC' size={22} /></button>
//                             </Tooltip>
//                         </div>
//                         <div>
//                             <ListInputSearch onChange={setQuery} value={query} placeholder="Search Assets" debounceTime={500} />
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

// export default AssetsLayout;



import { Tooltip } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';
import ListInputSearch from '../../../component/ListInputSearch';
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect } from 'react-redux';
import { deleteWarrantyFile, getWarrantyFiles } from '../../../component/indexDB';
import Style from './AssetsScreen.module.css'



const AssetsLayout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const [query, setQuery] = useState('')
    useEffect(() => {
        localStorage.removeItem("Q9#M@xA!K7P_2LZ+vR8d*t==");
        localStorage.removeItem("cLocation");
        localStorage.removeItem("sLocation");
        getWarrantyFiles().then((saved) => {
            let Newsaved = saved.filter(data => data.temp == "true")
            Newsaved?.map(data => deleteWarrantyFile(data?.uid))
        });
        const loadWorkSite = localStorage.getItem('+AOQ^%^f0Gn4frTqztZadLrKg==')
        if (!loadWorkSite) {
            navigate('/')
        }
    }, [])
    return (
        <>
            <div className={Style.MainContainer}>
                <>
                    <div>
                        <div className={Style.SecondaryHeader}>
                            <h1>Assets</h1>
                        </div>
                    </div>
                    <div className={Style.TabHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button className={Style.TabBtn} style={location.pathname == "/assets/my-assets" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/assets/my-assets')}>Assets</button>
                            <button className={Style.TabBtn} style={location.pathname == "/assets/archived" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/assets/archived')}>Archived</button>
                        </div>
                        <div>
                            <button className={Style.NewBtn} onClick={() => navigate('/assets/create')}>Create Assets</button>
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


export default AssetsLayout;
