import { Tooltip } from 'antd';
import Style from './worksite.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { baseUrl } from '../../../../store/config.json'
import ListInputSearch from '../../../component/ListInputSearch';



const ProjectLayout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const [query, setQuery] = useState('')
    const removeTemp = () => {
        localStorage.removeItem('Wm8^pLC7ux$5kJ~E2-/3zq==')
        localStorage.removeItem('Rd9!tMQ4vz#1gN*B6_+7@x==')
        localStorage.removeItem('gT4#nL!8vQ@2zR*e6^hP+M==')
        localStorage.removeItem('rD@5!tF8q#Vx9$zN3LpK')
        localStorage.removeItem('Gp5!zRN8wy@2bT+L4/3cK^=')
    }
    return (
        <>
            <div className={Style.MainContainer}>
                <>
                    <div>
                        <div className={Style.SecondaryHeader}>
                            <h1>Worksite Management</h1>
                        </div>
                    </div>
                    <div className={Style.TabHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button style={location.pathname == "/worksite/my-worksite" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/worksite/my-worksite')}>Worksite</button>
                            <Tooltip title={"Create Worksite"}>
                                <button onClick={() => {
                                    removeTemp()
                                    navigate('/worksite/create')
                                }} style={location.pathname == "/worksite/create" ? { border: '1px solid #214CBC', color: "#214CBC" } : null}><FiPlus color='#214CBC' size={22} /></button>
                            </Tooltip>
                        </div>
                        {/* <div>
                            <ListInputSearch onChange={setQuery} value={query} placeholder="Search Worksite" debounceTime={500} />
                        </div> */}
                    </div>
                    <div className={Style.TableSectionLayout}>
                        <Outlet context={{ searchQuery: query }} />
                    </div>
                </>
            </div>
        </>
    )
}

export default ProjectLayout;