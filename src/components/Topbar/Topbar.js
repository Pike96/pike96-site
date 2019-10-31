import React from 'react';
import { Link } from 'gatsby';
import styles from './Topbar.module.scss';
import { useSiteMetadata } from '../../hooks';
import { getRandomItemFromStrArray } from '../../utils';

type Props = {
  inPost?: boolean,
};

const Topbar = ({ inPost }: Props) => {
  const { keywords } = useSiteMetadata();

  return (
    <div className={styles['topbar']}>
      <div className={styles[`topbar__keyword${inPost ? '--in-post' : ''}`]}>
        &lt;pike96&gt;
        <span className={styles['topbar__keyword-inner']}>
            {getRandomItemFromStrArray(keywords)}
          </span>
        &lt;/pike96&gt;
      </div>
      { inPost === true
        && <Link className={styles['topbar__home-button']} to="/">Home Page</Link>
      }
    </div>
  );
};

export default Topbar;