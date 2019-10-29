import React, { useEffect } from 'react';
import styles from './Topbar.module.scss';

const Topbar = () => (
  <div className={styles['topbar']}>
    <div className={styles['topbar__keyword']}>
      &lt;pike96&gt;Mandolin&lt;/pike96&gt;
    </div>
  </div>
);

export default Topbar;