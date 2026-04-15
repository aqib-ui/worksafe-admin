import Style from './lockedContet.module.css'
import { CiLock } from "react-icons/ci";

const WorkOrderLayout = () => {
    return (
        <>
            <div className={Style.MainContainer}>
                <CiLock size={22}/>
                <p>This content is locked, you don't have a access for now</p>
            </div>
        </>
    )
}



export default WorkOrderLayout