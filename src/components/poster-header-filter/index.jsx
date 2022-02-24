import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const PosterHeaderFilter = ({ changeHeaderFilter }) => {

    const [myVotes, setMyVotes] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOption, setDropdownOption] = useState({ value: 'page_random', label: 'Random' },);

    useEffect(() => {
        changeHeaderFilter(dropdownOption.value)
    }, [dropdownOption])

    useEffect(() => {
        changeHeaderFilter(myVotes ? 'my_votes' : null)
    }, [myVotes])

    const selectOption = (option) => {
        setDropdownOption(option);
        setDropdownOpen(false);
    }

    const myVotesChange = () => {
        setMyVotes(!myVotes);
    }

    const dropdownOptions = [
        { value: 'page_random', label: 'Random' },
        { value: 'custom_order_asc', icon: 'fa-arrow-up', label: 'Poster Number' },
        { value: 'custom_order_desc', icon: 'fa-arrow-down', label: 'Poster Number' },
    ]

    return (
        <div className={styles.posterHeaderFilter}>
            <button onClick={() => myVotesChange()}>
                <i className={`fa ${myVotes ? 'fa-heart' : 'fa-heart-o'}`} />
                My votes
            </button>
            {/* <button>
        <i className='fa fa-share' />
        Share
      </button> */}
            <div className={styles.dropdown}>
        <span onClick={() => setDropdownOpen(!dropdownOpen)}>
          Order by {dropdownOption.label} {dropdownOption.icon ? <i style={{ marginLeft: 5 }} className={`fa ${dropdownOption.icon}`} /> : null}
            <i className='fa fa-caret-down' />
        </span>
                {dropdownOpen &&
                <div className={styles.dropdownOptions}>
                    {dropdownOptions.map((e, index) => {
                        return (
                            <span onClick={() => selectOption(e)} key={index}>{e.label} {e.icon && <i className={`fa ${e.icon}`} />}</span>
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