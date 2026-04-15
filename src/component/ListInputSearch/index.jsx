import React, { useState, useEffect } from "react";
import Style from "./ListInputSearch.module.css";
import { VscSearch } from "react-icons/vsc";
import listSearch from '../../assets/list-search.png'

const ListInputSearch = ({ value, placeholder, onChange, debounceTime = 300 }) => {
    const [inputValue, setInputValue] = useState(value ?? "");

    useEffect(() => {
        const handler = setTimeout(() => {
            if (typeof onChange === "function") {
                onChange(inputValue);
            }
        }, debounceTime);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, debounceTime]);


    return (
        <div className={Style.InputContainer}>
            <div className={Style.SearchIconContain}>
                <img src={listSearch} alt="search-icon" />
            </div>
            <input
                type="text"
                name="ListSearch"
                id="ListSearch"
                className={Style.InputContain}
                placeholder={placeholder}
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
            />
        </div>
    );
};

export default ListInputSearch;
