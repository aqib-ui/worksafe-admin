import { Tooltip } from 'antd';
import Style from './ProjectScreen.module.css'
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
    }
    return (
        <>
            <div className={Style.MainContainer}>
                <>
                    <div>
                        <div className={Style.SecondaryHeader}>
                            <h1>Project Management</h1>
                        </div>
                    </div>
                    <div className={Style.TabHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button style={location.pathname == "/project/my-project" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/project/my-project')}>Projects</button>
                            <button style={location.pathname == "/project/archived" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/project/archived')}>Archived</button>
                            <Tooltip title={"Create Project"}>
                                <button onClick={() => {
                                    removeTemp()
                                    navigate('/project/create')
                                }} style={location.pathname == "/project/create" ? { border: '1px solid #214CBC', color: "#214CBC" } : null}><FiPlus color='#214CBC' size={22} /></button>
                            </Tooltip>
                        </div>
                        <div>
                            <ListInputSearch onChange={setQuery} value={query} placeholder="Search Projects" debounceTime={500} />
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

export default ProjectLayout;