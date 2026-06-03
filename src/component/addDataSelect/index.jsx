import React, { useState } from "react";
import Style from "./addDataSelect.module.css";
import { FaChevronDown } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { Skeleton, Spin } from "antd";

const AddDataSelect = ({ disable = false, adding = true, name, loading, setValue, value, optionData = [], addNewValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [valuetoAdd, setValuetoAdd] = useState("");

    const SelectValue = (value) => {
        setIsOpen(false)
        setValue(value)
    }
    return (
        <div className={Style.wrapper}>
            <div
                style={{ cursor: disable ? 'no-drop' : 'pointer', background: disable ? 'rgba(0,0,0,0.04)' : 'white', borderColor: disable ? "#d9d9d9" : "rgba(233, 237, 238, 1)" }}
                onClick={() => setIsOpen(!isOpen)}
                className={Style.AddDataSelectWrap}
            >
                <p style={{ color: disable ? 'rgba(0,0,0,0.25)' : "" }} className={isOpen || value ? Style.SelectOn : Style.SelectOff}>
                    {isOpen ? value ? value : "Select Type" : value ? value : `Select ${name == "assetType" ? "asset type" : name} `}
                </p>

                <FaChevronDown
                    className={`${Style.icon} ${isOpen ? Style.rotate : ""}`}
                    fontSize={18}
                />
            </div>

            <div className={`${Style.ListingItem} ${isOpen ? adding ? Style.open : Style.open2 : ""}`}>
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
                {adding &&
                    <div className={`${isOpen ? Style.optionAdding : ""}`}>
                        <input maxLength={50} onChange={(e) => setValuetoAdd(e.target.value)} value={valuetoAdd} className={Style.optionAddingInput} placeholder={`Add ${name}`} />
                        <button onClick={() => {
                            addNewValue(valuetoAdd)
                            setValuetoAdd("")
                            setValue(valuetoAdd)
                            setIsOpen(false)
                        }} className={Style.optionAddingButton}>Add</button>
                    </div>
                }
            </div>
        </div>
    );
};

export default AddDataSelect;
