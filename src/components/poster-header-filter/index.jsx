import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';
import {getShareLink} from "../../actions/schedule-actions";
import ShareModal from './share-modal';

const DROPDOWN_OPTIONS = [
  { value: 'random', label: 'Random' },
  { value: 'custom_order_asc', icon: 'fa-arrow-up', label: 'Poster Number' },
  { value: 'custom_order_desc', icon: 'fa-arrow-down', label: 'Poster Number' },
];
const DUMMY_RANDOM_OPTION = { value: null, label: 'Random' };

const PosterHeaderFilter = ({ changeHeaderFilter, pageFilters }) => {
  const [myVotes, setMyVotes] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // initial applied filter is a dummy one (value null)
  // we sort random on reducer
  // applying real random filter as default, due to onload data refresh, causes re random on posters data change
  // TODO: fix: if you re apply random while data is refreshing, poster cards will reshuffle
  const [dropdownOption, setDropdownOption] = useState(DUMMY_RANDOM_OPTION);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    changeHeaderFilter(myVotes ? 'my_votes' : dropdownOption.value);
  }, [myVotes, dropdownOption]);

  const selectOption = (option) => {
    setDropdownOption(option);
    setDropdownOpen(false);
  };

  const toggleShareModal = (show) => {
    const link = getShareLink(pageFilters);
    setShareLink(link);
    setShowShareModal(show)
  };

  return (
    <div className={styles.posterHeaderFilter}>
      <button onClick={() => setMyVotes(!myVotes)}>
        <i className={`fa ${myVotes ? 'fa-heart' : 'fa-heart-o'}`} />
        My votes
      </button>

      <button onClick={() => toggleShareModal(true)}>
        <i className='fa fa-share' />
        Share
      </button>

      <div className={styles.dropdown}>
        <span onClick={() => setDropdownOpen(!dropdownOpen)}>
          Order by {dropdownOption.label} {dropdownOption.icon ? <i style={{ marginLeft: 5 }} className={`fa ${dropdownOption.icon}`} /> : null}
          <i className='fa fa-caret-down' />
        </span>
        {dropdownOpen &&
          <div className={styles.dropdownOptions}>
            {DROPDOWN_OPTIONS.map((e, index) => {
              return (<span onClick={() => selectOption(e)} key={index}>{e.label} {e.icon && <i className={`fa ${e.icon}`} />}</span>)
            })}
          </div>
        }
      </div>
      <ShareModal
        onHide={() => toggleShareModal(false)}
        show={showShareModal}
        title="Sharable link to this poster grid view"
        text="Anyone with this link will see the current filtered poster grid view"
        link={shareLink}
      />
    </div>
  );
};

PosterHeaderFilter.propTypes = {
  changeHeaderFilter: PropTypes.func.isRequired
};

export default PosterHeaderFilter;