// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import styles from './Author.module.scss';

type Props = {
  author: {
    bio: string,
  }
};

const Author = ({ author }: Props) => (
  <div className={styles['author']}>
    <Link to="/">
      <div className={styles['author__typewriter']}>
        <div className={styles['author__typewriter-static']}>&#60;&#169;</div>
        <div className={styles['author__typewriter-dynamic']}>
          <div className={styles['author__typewriter-dynamic-text']}>ike|`</div>
        </div>
        <div className={styles['author__typewriter-static']}>&#62;</div>
      </div>
    </Link>

    <p className={styles['author__subtitle']}>{author.bio}</p>
  </div>
);

export default Author;
