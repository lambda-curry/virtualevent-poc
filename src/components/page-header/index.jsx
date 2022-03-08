import React from 'react';

import styles from './index.module.scss';

const PageHeader = ({ title, subtitle, backgroundImage}) => (
  <section className={styles.pageHeader}>
    <div className={styles.titles}>
      <h1>{ title }</h1>
      <span>{ subtitle }</span>
    </div>
    { backgroundImage &&
    <img src={ backgroundImage }/>
    }
  </section>
);

export default PageHeader;