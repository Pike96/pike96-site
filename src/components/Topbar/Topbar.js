import React from 'react';
import styles from './Topbar.module.scss';
import { useSiteMetadata } from '../../hooks';
import { getRandomItemFromStrArray } from '../../utils';

const Topbar = () => {
  const { keywords } = useSiteMetadata();

  return (
    <div className={styles['topbar']}>
      <div className={styles['topbar__keyword']}>
        &lt;pike96&gt;{getRandomItemFromStrArray(keywords)}&lt;/pike96&gt;
      </div>
    </div>
  );
};

export default Topbar;