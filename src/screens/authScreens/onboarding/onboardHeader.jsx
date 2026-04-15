import React from "react";
import Style from './onboard.module.css'
import backBtn from '../../../assets/icons/screens/backBtn.png'
import loginLayoutLogo from '../../../assets/images/loginLayoutLogo.png'

const OnBoardHeader = ({ count, totalSteps }) => {
    const progressWidth = `${(count / totalSteps) * 100}%`;
    return (
        <>
            <div className={Style.mainContainer}>
                <div className={Style.TopFiller}>
                    <div style={{ width: progressWidth, transition: 'width 0.3s ease' }} className={Style.Fillter}></div>
                </div>
                <div className={Style.headerMain}>
                    <div className={Style.backBtnSide}>
                        <img src={backBtn} />
                        <p>Step {count} of {totalSteps}</p>
                    </div>
                    <div className={Style.logoSide}>
                        <img src={loginLayoutLogo}/>
                    </div>

                    <div className={Style.backBtnSide2}>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default OnBoardHeader;