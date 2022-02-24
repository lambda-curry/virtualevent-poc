import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const PosterHeaderFilter = ({ changeHeaderFilter }) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOption, setDropdownOption] = useState({});

  const selectOption = (option) => {
    setDropdownOption(option);
    setDropdownOpen(false);
    changeHeaderFilter(dropdownOption.value)
  }

  const dropdownOptions = [
    { value: 'page_random', label: 'Random' },
    { value: 'custom_order', label: 'Poster Number' },
  ]

  return (
    <div className={styles.posterHeaderFilter}>
      <button onClick={() => changeHeaderFilter('my_votes')}>
        <i className='fa fa-heart-o'/>
        My votes
      </button>
      {/* <button>
        <i className='fa fa-share' />
        Share
      </button> */}
      <div className={styles.dropdown}>
        <span onClick={() => setDropdownOpen(!dropdownOpen)}>
          Order by {dropdownOption.label}
          <i className='fa fa-caret-down' />
        </span>
        {dropdownOpen &&
          <div className={styles.dropdownOptions}>
            {dropdownOptions.map((e, index) => {
              return (
                <span onClick={() => selectOption(e)} key={index}>{e.label}</span>
              )
            })}
          </div>
        }
      </div>
    </div>
  );
};

PosterHeaderFilter.propTypes = {
  changeHeaderFilter: PropTypes.func.isRequired
};

export default PosterHeaderFilter;
