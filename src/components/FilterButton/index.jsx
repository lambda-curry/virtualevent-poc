import React from "react";
import styles from "./index.module.scss";

const FilterButton = ({ open, onClick }) => {
  const getLabel = () => {
    if (!open) {
      return (
        <>
          <i className="fa fa-filter" />
          Filters
        </>
      );
    } else {
      return <i className="fa fa-arrow-left" />;
    }
  };
  return (
    <button
      className={`${styles.filterButton} ${open ? styles.open : ""}`}
      onClick={onClick}
    >
      {getLabel()}
    </button>
  );
};

export default FilterButton;
