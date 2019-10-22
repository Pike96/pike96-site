// @flow strict
import React from 'react';
import { getContactHref, getRandomItemFromStrArray } from '../../../utils';
import styles from './Author.module.scss';
import { useSiteMetadata } from '../../../hooks';

const Author = () => {
  const { author, sentences } = useSiteMetadata();

  return (
    <div className={styles['author']}>
      <p className={styles['author__bio']}>
        <span className={styles['author__bio-sentence']}>
          {getRandomItemFromStrArray(sentences)}
        </span>
        <a
          className={styles['author__bio-twitter']}
          href={getContactHref('facebook', author.contacts.facebook)}
          rel="noopener noreferrer"
          target="_blank"
        >
          Ping <strong>{author.name}</strong> on Facebook
        </a>
      </p>
    </div>
  );
};

export default Author;
