import { Outlet } from "react-router";
import Style from './layout.module.css'
import { Col, Row } from 'antd';
import loginLayoutBg from '../assets/images/loginLayoutBg.png'
import loginLayoutBg2 from '../assets/images/loginLayoutBg2.png'
import loginLayoutLogo from '../assets/images/loginLayoutLogo.png'
import { useNavigate } from "react-router";



const AuthLayout = () => {
    const navigate = useNavigate()

    return (
        <>
            <div className={Style.Container}>
                <Row style={{ height: '100%' }}>
                    <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24}>
                        <div className={Style.LogoController}>
                            <img className={Style.LayoutLogo} src={loginLayoutLogo} />
                            <Outlet />
                            <div className={Style.ContactInfo}>
                                <div onClick={() => navigate('/terms-and-condition')}>
                                    <h6>Terms of Use</h6>
                                </div>
                                <div onClick={() => navigate('/privacy-policy')}>
                                    <h6>Privacy Policy</h6>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xxl={16} xl={16} lg={12} md={12} sm={0} xs={0}>
                        <div className={Style.LayoutSideContainer}>
                            <div className={Style.LayoutHeadingArea}>
                                <h2>Simplifying Safety Across Every Site</h2>
                                <h6>WorkSafe helps you manage worksites, teams, and safety risks — all<br /> in one secure platform.</h6>
                            </div>
                            <div style={{ backgroundImage: `url(${loginLayoutBg}), url(${loginLayoutBg2})` }} className={Style.SVGContainer}></div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default AuthLayout;