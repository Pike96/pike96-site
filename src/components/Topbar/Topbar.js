import React from 'react';
import styles from './Topbar.module.scss';
import { useSiteMetadata } from '../../hooks';
import { getRandomItemFromStrArray } from '../../utils';

const Topbar = () => {
  const { keywords } = useSiteMetadata();

  return (
    <div className={styles['topbar']}>
      <div className={styles['topbar__keyword']}>
        &lt;pike96&gt;
        <span className={styles['topbar__keyword-inner']}>
          {getRandomItemFromStrArray(keywords)}
        </span>
        &lt;/pike96&gt;
      </div>
    </div>
  );
};

export default Topbar;