import React from "react";

const ColumnSortIcon = ({ sortBy, sortDirection, setSortBy, setSortDirection }) => {
    return <i onClick={() => {
        const newSortDirection = sortDirection === "ASC" ? "DESC" : "ASC";
        setSortBy(sortBy);
        setSortDirection(newSortDirection);
    }} class={sortDirection === "ASC" ? "bi bi-sort-up" : "bi bi-sort-down"} style={{ color: "gray", cursor: "pointer", fontSize: "1.5rem", paddingLeft: "5px" }}></i>;
}

export default ColumnSortIcon;