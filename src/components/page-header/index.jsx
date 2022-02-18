import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const PageHeader = ({ title, subtitle, backgroundImage}) => (
  <section className={styles.pageHeader}>
    <div className={styles.titles}>
      <h1>{ title }</h1>
      <h2>{ subtitle }</h2>
    </div>
    { backgroundImage &&
    <img src={ backgroundImage }/>
    }
  </section>
);

export default PageHeader;