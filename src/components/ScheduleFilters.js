import React, {useEffect, useState} from "react";
import { Helmet } from "react-helmet";
import Filters from "schedule-filter-widget/dist";

import "schedule-filter-widget/dist/index.css";

const ScheduleFilters = ({ className, ...rest}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(70);

  const handleScroll = () => {
    const position = window.pageYOffset;
    const header = document.querySelector('header')
    if(header){
      setHeaderHeight(header.clientHeight);
    }
    if(position < headerHeight) setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css"
        />
      </Helmet>
      <div className={className || "filter-container"} style={{ top: headerHeight - scrollPosition }}>
        <Filters title="Filter by" {...rest} />
      </div>
    </>
  );
};

export default ScheduleFilters;