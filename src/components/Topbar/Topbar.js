import React from 'react';
import styles from './Topbar.module.scss';
import { useSiteMetadata } from '../../hooks';
import { getRandomItemFromStrArray } from '../../utils';

type Props = {
  hasSidebar?: boolean,
};

const Topbar = ({ hasSidebar }: Props) => {
  const { keywords } = useSiteMetadata();

  return (
    <div className={styles['topbar']}>
      { hasSidebar === true ? (
        // TODO: judge sidebar
        <div className={styles[`topbar__keyword${hasSidebar ? '-with-sidebar' : ''}`]}>
          &lt;pike96&gt;
          <span className={styles['topbar__keyword-inner']}>
            {getRandomItemFromStrArray(keywords)}
          </span>
          &lt;/pike96&gt;
        </div>
      ) : (
        <div className={styles['topbar__home-button']} />
      )}
    </div>
  );
};

export default Topbar;