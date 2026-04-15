import React, { useState } from "react";
import Style from "./addDataSelect.module.css";
import { FaChevronDown } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { Skeleton, Spin } from "antd";

const AddDataSelect = ({ name, loading, setValue, value, optionData = [], addNewValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [valuetoAdd, setValuetoAdd] = useState("");

    const SelectValue = (value) => {
        setIsOpen(false)
        setValue(value)
    }
    return (
        <div className={Style.wrapper}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={Style.AddDataSelectWrap}
            >
                <p className={isOpen || value ? Style.SelectOn : Style.SelectOff}>
                    {isOpen ? value ? value : "Select Type" : value ? value : `Select ${name}`}
                </p>

                <FaChevronDown
                    className={`${Style.icon} ${isOpen ? Style.rotate : ""}`}
                    fontSize={18}
                />
            </div>

            <div className={`${Style.ListingItem} ${isOpen ? Style.open : ""}`}>
                {loading ?
                    <>
                        <div className={Style?.option}>
                            <Spin />
                        </div>
                    </>
                    :
                    <>
                        {optionData?.map(data => (
                            <div onClick={() => SelectValue(data?.value)} className={value == data?.value ? Style.optionSelected : Style.option}>
                                {data?.label}
                                {value == data?.value &&
                                    <FaCheck size={18} color="#25292A" />
                                }
                            </div>
                        ))}
                    </>
                }
                <div className={`${isOpen ? Style.optionAdding : ""}`}>
                    <input onChange={(e) => setValuetoAdd(e.target.value)} value={valuetoAdd} className={Style.optionAddingInput} placeholder={`Add ${name}`} />
                    <button onClick={() => {
                        addNewValue(valuetoAdd)
                        setValuetoAdd("")
                        setValue(valuetoAdd)
                        setIsOpen(false)
                    }} className={Style.optionAddingButton}>Add</button>
                </div>
            </div>
        </div>
    );
};

export default AddDataSelect;
