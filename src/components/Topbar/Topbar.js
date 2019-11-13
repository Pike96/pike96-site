import React from 'react';
import { Link } from 'gatsby';
import styles from './Topbar.module.scss';
import { useSiteMetadata } from '../../hooks';
import { getRandomItemFromStrArray } from '../../utils';

type Props = {
  postTitle?: string,
};

const Topbar = ({ postTitle }: Props) => {
  const { keywords } = useSiteMetadata();

  return (
    <div className={styles['topbar']}>
      {/* Post title in post pages, keyword in other pages. */}
      {postTitle
        ? <div className={styles['topbar__keyword--in-post']}>
          {postTitle}
          </div>
        : <div className={styles['topbar__keyword']}>
            &lt;pike96&gt;
            <span className={styles['topbar__keyword-inner']}>
              {getRandomItemFromStrArray(keywords)}
            </span>
            &lt;/pike96&gt;
          </div>
      }

      {/* Home button only in post pages. */}
      {postTitle && <Link className={styles['topbar__home-button']} to="/">Home Page</Link>}
    </div>
  );
};

export default Topbar;