import { Tooltip } from 'antd';
import Style from './workOrderScreen.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { baseUrl } from '../../../../store/config.json'
import ListInputSearch from '../../../component/ListInputSearch';
import * as WorkOrderAction from '../../../../store/actions/WorkOrder/index';
import { connect } from 'react-redux';
import { deleteWarrantyFile, getWarrantyFiles } from '../../../component/indexDB';



const POILayout = ({ PermissionReducer }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");
    const [query, setQuery] = useState('')
    const AllContentPermission = PermissionReducer.allPermission?.data?.role_id?.permissions || []


    useEffect(() => {
        localStorage.removeItem("A7@M!xK9P_2#RZ+vL8dQ*t==");
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
                            <h1>POIs (Point of Interests)</h1>
                        </div>
                    </div>
                    {/* <div className={Style.TabHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button style={location.pathname == "/POI/Poi" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/POI/Poi')}>POIs</button>
                            <button style={location.pathname == "/POI/archived" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/POI/archived')}>Archived</button>
                            <button style={location.pathname == "/POI/draft" ? { border: '1px solid #214CBC', color: "#214CBC" } : null} onClick={() => navigate('/POI/draft')}>Drafts</button>
                            {AllContentPermission?.find(data => data?.module == "POIS")?.permissions?.create &&
                                <Tooltip title={"Create POI"}>
                                    <button onClick={() => navigate('/POI/create')} style={location.pathname == "/POI/create" ? { border: '1px solid #214CBC', color: "#214CBC" } : null}><FiPlus color='#214CBC' size={22} /></button>
                                </Tooltip>
                            }
                        </div>
                        {location.pathname == "/POI/draft" ? <></>
                            :
                            <div>
                                <ListInputSearch onChange={setQuery} value={query} placeholder="Search POI" debounceTime={500} />
                            </div>
                        }
                    </div> */}


                    <div className={Style.TabHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button className={Style.TabBtn} style={location.pathname == "/POI/Poi" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/POI/Poi')}>POIs</button>
                            <button className={Style.TabBtn} style={location.pathname == "/POI/draft" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/POI/draft')}>Draft</button>
                            <button className={Style.TabBtn} style={location.pathname == "/POI/archived" ? { borderBottom: '1px solid var(--blue-50)' } : null} onClick={() => navigate('/POI/archived')}>Archived</button>
                        </div>
                        <div>
                            <button className={Style.NewBtn} onClick={() => navigate('/POI/create')}>Create POI</button>
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



function mapStateToProps({ PermissionReducer }) {
    return { PermissionReducer };
}
export default connect(mapStateToProps, WorkOrderAction)(POILayout);
