import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Style from './extraData.module.css'
import { Button, DatePicker, Drawer, Dropdown, Empty, Input, InputNumber, message, Popover, Select, Switch, Spin, Table, Tooltip, ColorPicker, Descriptions, Upload, Steps, Slider, Row, Col, Modal } from 'antd'
import * as WorkOrderAction from '../../../store/actions/WorkOrder/index';
import { connect } from 'react-redux';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from 'react-router';
import { Circle, GoogleMap, Marker, Polygon, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { FaRegCircle } from "react-icons/fa";
import Autocomplete from "react-google-autocomplete";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { MdOutlineEdit, MdOutlinePolyline } from "react-icons/md";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoTriangle } from "react-icons/io5";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { FlagFilled, UploadOutlined } from '@ant-design/icons';
import { baseUrl } from '../../../store/config.json';
import { MdOutlineLocationSearching } from "react-icons/md";
import { MdOutlineModeEditOutline } from "react-icons/md";
import myLocationMarker from "../../assets/myLocationMarker.png";
import GoogleMapCreate from '../../component/googleMap';
import MapWidget from '../../component/mapComponent/index'
import rightIcon from '../../assets/icons/screenIcon/indicate-right.png'
import calendarDatePicker from '../../assets/calendarDatePicker.png'
import deletePersonalIcon from '../../assets/deletePersonalIcon.png'
import moreIcon from '../../assets/more-Icon.png'
import blueCalender from '../../assets/blueCalender.png'
import blueClock from '../../assets/blueClock.png'
import editIcon from '../../assets/editIcon.png'
import blueDoc from '../../assets/blue-Doc.png'
import redDoc from '../../assets/red-Doc.png'
import removeIcon from '../../assets/removeIcon.png'
import galleryAdd from '../../assets/gallery-add.png'
import redGallery from '../../assets/red-gallery.png'
import searchNormal from '../../assets/search-normal.png'


import { IoChevronDownOutline } from "react-icons/io5";
import { MdOutlineChevronRight } from "react-icons/md";

import { FiInfo } from "react-icons/fi";

import { createStyles } from 'antd-style';
const { Dragger } = Upload;




const ExtraDataModule = forwardRef(({ name,createLoading, extraDataList, setExtraDataList, localStoreKey, taskAndLocationRef, counter, workOrderGetByIDData, editId, messageApi }) => {
    const [addExtraDrawer, setAddExtraDrawer] = useState(false);
    const now = new Date(Date.now());
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateFormat2 = 'YYYY-MM-DD';
    const [deleteExtra, setDeleteExtra] = useState(false);
    const [editExtra, setEditExtra] = useState(false);
    const [deleteExtraId, setDeleteExtraId] = useState();

    const [extraDataState, setExtraDataState] = useState({
        name: '',
        description: null,
        type: 'Input',
        value: { type: '', value: '' }
    });
    const [extraDataEditState, setExtraDataEditState] = useState();
    const showAddExtraDrawer = () => {
        setAddExtraDrawer(true);
    };
    const closeAddExtraDrawer = () => {
        setAddExtraDrawer(false);
    };
    const deleteExtraList = (i) => {
        setExtraDataList(prev =>
            prev.filter((pr) => pr?.id !== i)
        );
        messageApi.open({
            type: "error",
            content: "Extra data has been deleted.",
        });
        setDeleteExtra(false)
        setDeleteExtraId()

        const PrevJsonData = JSON.parse(localStorage.getItem(localStoreKey) || "{}")
        const UpdateJsonParr = PrevJsonData?.extraData?.filter((locData) => locData?.id !== i)
        const UpdateJsonParT = { ...PrevJsonData, extraData: UpdateJsonParr }
        localStorage.setItem(localStoreKey, JSON.stringify(UpdateJsonParT));
    };
    const showExtraEditModal = (id) => {
        setEditExtra(true);
        setExtraDataEditState(
            extraDataList.find((pre) => pre?.id === id)
        );
    };
    const handleAddExtraData = () => {
        if (!extraDataState?.name || extraDataState?.value?.value === "") {
            messageApi.destroy()
            messageApi.open({
                type: "error",
                content: "Please fill required fields",
            });
            return;
        }
        else {
            setExtraDataList(prev => {
                const updatedList = [
                    ...prev,
                    { id: Date.now(), ...extraDataState },
                ];
                const prevJsonData = JSON.parse(
                    localStorage.getItem(localStoreKey) || "{}"
                );

                localStorage.setItem(
                    localStoreKey,
                    JSON.stringify({
                        ...prevJsonData,
                        extraData: updatedList,
                    })
                );

                return updatedList;
            });

            if (extraDataState.type === "Boolean") {
                setExtraDataState({
                    name: '',
                    description: '',
                    type: 'Boolean',
                    value: { type: 'Boolean', value: true },
                });
            } else {
                setExtraDataState({
                    name: '',
                    description: '',
                    type: 'Input',
                    value: { type: '', value: '' },
                });
            }
        }

    };
    const handleCloseExtra = () => {
        setAddExtraDrawer(false)
        setExtraDataState({
            name: '',
            description: null,
            type: 'Input',
            value: { type: '', value: '' }
        })
    }
    const getExtraDropdown = (id) => [
        {
            key: '1',
            label: (
                <div onClick={() => showExtraEditModal(id)} className={Style.DropdownOption}>
                    <img src={editIcon} style={{ height: 20 }} />
                    <p>
                        Edit
                    </p>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <>
                    <div onClick={() => {
                        setDeleteExtraId(id)
                        setDeleteExtra(true)
                    }} className={Style.DropdownOption}>
                        <img src={deletePersonalIcon} style={{ height: 20 }} />
                        <p>
                            Delete
                        </p>
                    </div>
                </>
            ),
        },
    ];
    const cancelEditExtraModal = () => {
        setEditExtra(false);
    };
    const handleSaveExtraEdit = (editIndex) => {
        const PrevJsonData = JSON.parse(localStorage.getItem(localStoreKey) || "{}")
        const UpdateJsonParr = PrevJsonData?.extraData?.map((item, index) =>
            item?.id === extraDataEditState.id ? extraDataEditState : item
        );
        const UpdateJsonParT = { ...PrevJsonData, extraData: UpdateJsonParr }
        localStorage.setItem(localStoreKey, JSON.stringify(UpdateJsonParT));
        setExtraDataList(prev =>
            prev.map((item) =>
                item?.id === editIndex ? extraDataEditState : item
            )
        );
        cancelEditExtraModal()
        messageApi.open({
            type: "success",
            content: "Extra data has been updated.",
        });
    };

    const hasInvalidExtraData = [
        extraDataState.name?.trim(),
        extraDataState.type,
        extraDataState.value?.type,
        extraDataState.value?.value
    ].some(v => v === '' || v === null || v === undefined);


    const hasInvalidExtraDataEdit = [
        extraDataEditState?.name?.trim(),
        extraDataEditState?.type,
        extraDataEditState?.value?.type,
        extraDataEditState?.value?.value
    ].some(v => v === '' || v === null || v === undefined);

    const cancelEditModal = () => {
        setEditExtra(false)
    }
    const [showExtraToolTip, setShowExtraToolTip] = useState(false);


    return (
        <>
            <div className={Style.TaskFeild} style={{ marginTop: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}>Extra Data
                    <div onMouseEnter={() => setShowExtraToolTip(true)} onMouseLeave={() => setShowExtraToolTip(false)} className={Style.FillPoint}>
                        <FiInfo size={20} style={{ marginLeft: 5 }} color='#214CBC' />
                        {showExtraToolTip && (
                            <div className={Style.tooltipBox} >
                                <p> Attach any additional notes or custom data relevant to<br /> the task.</p>
                            </div>
                        )}
                    </div>
                </label>
                <div onClick={createLoading ? null : showAddExtraDrawer} style={{ cursor: createLoading ? 'no-drop' : 'pointer', background: createLoading ? "#0000000a" : 'white' }} className={Style.AddExtraDataFeild}>
                    <div>
                        <p style={{ opacity: createLoading ? 0.3 : 1 }}>Add extra data<span> ({extraDataList?.length ?? 0})</span></p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MdOutlineChevronRight size={28} color='#626D6F' />
                    </div>
                </div>
            </div>








            {/* Extra Data */}
            <Drawer
                maskClosable={false}
                getContainer={document.body}
                afterOpenChange={(visible) => {
                    document.body.style.overflow = visible ? "hidden" : "auto";
                }}
                title="Add Extra Data"
                placement={'right'}
                styles={{ header: { padding: '17px 24px' }, body: { padding: '24px' } }}
                onClose={closeAddExtraDrawer}
                open={addExtraDrawer}
                width={486}
                key={'right'}
            >
                <div onFocus={() => { document.body.style.overflow = "hidden"; }}>
                    <div>
                        <label>Name <span style={{ color: 'red' }}>*</span></label>
                        <Input value={extraDataState.name} onChange={(e) => setExtraDataState(prev => ({ ...prev, name: e.target.value }))} placeholder='Enter name' />
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <label>Value Type <span style={{ color: 'red' }}>*</span></label>
                        <div className={Style.ValueTypeWrapper}>
                            <div onClick={() => setExtraDataState(prev => ({ ...prev, type: "Input", value: { type: "Input", value: "" } }))} className={extraDataState.type == "Input" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Input</div>
                            <div onClick={() => setExtraDataState(prev => ({ ...prev, type: "Boolean", value: { type: "Boolean", value: true } }))} className={extraDataState.type == "Boolean" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Boolean</div>
                            <div onClick={() => setExtraDataState(prev => ({ ...prev, type: "Date", value: { type: "Date", value: "" } }))} className={extraDataState.type == "Date" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Date</div>
                            <div onClick={() => setExtraDataState(prev => ({ ...prev, type: "Color", value: { type: "Color", value: "" } }))} className={extraDataState.type == "Color" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Color</div>
                        </div>
                    </div>

                    {extraDataState.type == "Input" ?
                        <div style={{ marginTop: 16 }}>
                            <label>Value <span style={{ color: 'red' }}>*</span></label>
                            <Input value={extraDataState.value.value}
                                onChange={(e) => setExtraDataState(prev => ({
                                    ...prev,
                                    value: { type: "Input", value: e.target.value }
                                }))}
                                placeholder='Enter value' />
                        </div>
                        : extraDataState.type == "Boolean" ?
                            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>{extraDataState.value.value ? "On" : "Off"}</label>
                                <Switch value={extraDataState.value.value} onChange={(e) => setExtraDataState(prev => ({
                                    ...prev,
                                    value: { type: "Boolean", value: e }
                                }))} />
                            </div>
                            : extraDataState.type == "Date" ?
                                <div style={{ marginTop: 16 }}>
                                    <label>Date <span style={{ color: 'red' }}>*</span></label>
                                    <DatePicker value={extraDataState.value.value ? dayjs(extraDataState.value.value) : null} suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />} onChange={(date) => {
                                        setExtraDataState(prev => ({
                                            ...prev,
                                            value: { type: 'Date', value: date ? dayjs(date).format('YYYY-MM-DD') : null }
                                        }));
                                    }} minDate={dayjs(formattedDate, dateFormat2)} placeholder='Select date' />
                                </div>
                                : extraDataState.type == "Color" ?
                                    <div style={{ marginTop: 16 }}>
                                        <label>Color <span style={{ color: 'red' }}>*</span></label>
                                        <ColorPicker value={extraDataState.value.value} onChange={(color) =>
                                            setExtraDataState(prev => ({
                                                ...prev,
                                                value: { type: "Color", value: color.toRgbString() }
                                            }))
                                        } style={{ marginTop: 8 }} />
                                    </div>
                                    : ""
                    }
                    <hr className={Style.HRHtm} />
                    <div style={{ marginTop: 16 }}>
                        <label>Description</label>
                        <Input.TextArea onFocus={() => { document.body.style.overflow = "hidden"; }} rows={4} style={{ padding: 16 }} value={extraDataState.description} onChange={(e) => setExtraDataState(prev => ({ ...prev, description: e.target.value }))} placeholder='Write description' />
                    </div>
                    <div style={{ marginTop: 16 }} className={Style.PersonalActionWrapper}>
                        <button onClick={handleCloseExtra} className={Style.cancelWorkBtn}>Cancel</button>
                        <button disabled={hasInvalidExtraData} className={hasInvalidExtraData ? Style.AddWorkBtnD : Style.AddWorkBtn} style={{ paddingInline: 30 }} onClick={handleAddExtraData}>Add</button>
                    </div>


                    {extraDataList?.length > 0 ? extraDataList?.map((data, index) => {
                        return (
                            <div key={index} className={Style.MainListingHourWork}>
                                <div className={Style.HoursWorkListTop}>
                                    {data?.type == "Input" ?
                                        <h6>{data?.value?.value}</h6>
                                        : data?.type == "Boolean" ?
                                            <div className={data?.value?.value ? Style.InputDesign : Style.FInputDesign}>
                                                <p>{data?.value?.value ? "On" : "Off"}</p>
                                                <Switch size='small' disabled={true} value={data?.value?.value} />
                                            </div>
                                            : data?.type == "Date" ?
                                                <h6>{data?.value?.value}</h6>
                                                : data?.type == "Color" ?
                                                    <ColorPicker value={data?.value?.value} disabled={false} style={{ marginTop: 8 }} />
                                                    : ""
                                    }
                                    <Dropdown trigger={['click']} menu={{ items: getExtraDropdown(data?.id) }} placement="bottomRight">
                                        <button><img src={moreIcon} style={{ height: "24px" }} /></button>
                                    </Dropdown>
                                </div>
                                <h6>{data?.name}</h6>
                                <p>{data?.description}</p>
                            </div>
                        )
                    }) : ""}
                </div>
            </Drawer>
            <Modal
                open={deleteExtra}
                onCancel={cancelEditModal}
                header={false}
                centered={true}
                closeIcon={false}
                footer={<>
                    <div className={Style.editPersonalModalFooter}>
                        <button onClick={() => setDeleteExtra(false)} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                        <button onClick={() => deleteExtraList(deleteExtraId)} className={Style.editPersonalModalFooterDelete}>Delete</button>
                    </div>
                </>}
            >
                <>
                    <h4 className={Style.AreYouSure}>Are you sure you want to delete this extra data?</h4>
                    <p className={Style.AreYouSurePara}>{`This will permanently remove this extra field and its value from the ${name}.`}</p>
                </>
            </Modal>
            <Modal
                title="Edit Extra Data"
                open={editExtra}
                onCancel={cancelEditExtraModal}
                footer={<>
                    <div className={Style.editPersonalModalFooter}>
                        <button onClick={cancelEditExtraModal} className={Style.editPersonalModalFooterCancel}>Cancel</button>
                        <button disabled={hasInvalidExtraDataEdit} onClick={() => handleSaveExtraEdit(extraDataEditState?.id)} className={hasInvalidExtraDataEdit ? Style.editPersonalModalFooterSaveD : Style.editPersonalModalFooterSave}>Save Changes</button>
                    </div>
                </>}
            >
                <>
                    <div>
                        <label>Name <span style={{ color: 'red' }}>*</span></label>
                        <Input value={extraDataEditState?.name} onChange={(e) => setExtraDataEditState(prev => ({ ...prev, name: e.target.value }))} placeholder='Enter name' />
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <label>Value Type <span style={{ color: 'red' }}>*</span></label>
                        <div className={Style.ValueTypeWrapper}>
                            <div onClick={() => setExtraDataEditState(prev => ({ ...prev, type: "Input", value: { type: "Input", value: "" } }))} className={extraDataEditState?.type == "Input" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Input</div>
                            <div onClick={() => setExtraDataEditState(prev => ({ ...prev, type: "Boolean", value: { type: "Boolean", value: true } }))} className={extraDataEditState?.type == "Boolean" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Boolean</div>
                            <div onClick={() => setExtraDataEditState(prev => ({ ...prev, type: "Date", value: { type: "Date", value: "" } }))} className={extraDataEditState?.type == "Date" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Date</div>
                            <div onClick={() => setExtraDataEditState(prev => ({ ...prev, type: "Color", value: { type: "Color", value: "" } }))} className={extraDataEditState?.type == "Color" ? Style.ValueTypeBlockSelect : Style.ValueTypeBlock}>Color</div>
                        </div>
                    </div>

                    {extraDataEditState?.type == "Input" ?
                        <div style={{ marginTop: 16 }}>
                            <label>Value <span style={{ color: 'red' }}>*</span></label>
                            <Input value={extraDataEditState?.value.value}
                                onChange={(e) => setExtraDataEditState(prev => ({
                                    ...prev,
                                    value: { type: "Input", value: e.target.value }
                                }))}
                                placeholder='Enter value' />
                        </div>
                        : extraDataEditState?.type == "Boolean" ?
                            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>{extraDataEditState?.value.value ? "On" : "Off"}</label>
                                <Switch value={extraDataEditState?.value.value} onChange={(e) => setExtraDataEditState(prev => ({
                                    ...prev,
                                    value: { type: "Boolean", value: e }
                                }))} />
                            </div>
                            : extraDataEditState?.type == "Date" ?
                                <div style={{ marginTop: 16 }}>
                                    <label>Date <span style={{ color: 'red' }}>*</span></label>
                                    <DatePicker value={extraDataEditState?.value.value ? dayjs(extraDataEditState?.value.value) : null} suffixIcon={<img src={calendarDatePicker} style={{ height: "24px" }} />} onChange={(date) => {
                                        setExtraDataEditState(prev => ({
                                            ...prev,
                                            value: { type: 'Date', value: date ? dayjs(date).format('YYYY-MM-DD') : null }
                                        }));
                                    }} minDate={dayjs(formattedDate, dateFormat2)} placeholder='Select date' />
                                </div>
                                : extraDataEditState?.type == "Color" ?
                                    <div style={{ marginTop: 16 }}>
                                        <label>Color <span style={{ color: 'red' }}>*</span></label>
                                        <ColorPicker value={extraDataEditState?.value.value} onChange={(color) =>
                                            setExtraDataEditState(prev => ({
                                                ...prev,
                                                value: { type: "Color", value: color.toRgbString() }
                                            }))
                                        } style={{ marginTop: 8 }} />
                                    </div>
                                    : ""
                    }
                    <hr className={Style.HRHtm} />
                    <div style={{ marginTop: 16 }}>
                        <label>Description</label>
                        <Input.TextArea rows={4} style={{ padding: 16 }} value={extraDataEditState?.description} onChange={(e) => setExtraDataEditState(prev => ({ ...prev, description: e.target.value }))} placeholder='Write description' />
                    </div>
                </>
            </Modal>
            {/* Extra Data */}
        </>
    )
})

export default ExtraDataModule;