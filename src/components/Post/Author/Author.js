// @flow strict
import React from 'react';
import { getContactHref, getRandomItemFromArray } from '../../../utils';
import styles from './Author.module.scss';
import { useSiteMetadata } from '../../../hooks';

const Author = () => {
  const { author } = useSiteMetadata();
  const sentenceArr: Array<string> = [
    'Nothing is true, everything is permitted',
    'Stay angry, stay selfish',
    'Thus, when Heaven is about to confer a great office on any man, '
    + 'it first exercises his mind with suffering, and his sinews and bones with toil. '
    + 'It exposes his body to hunger, and subjects him to extreme poverty. '
    + 'It confounds his undertakings. '
    + 'By all these methods it stimulates his mind, hardens his nature, '
    + 'and supplies his incompetencies.'
  ];

  return (
    <div className={styles['author']}>
      <p className={styles['author__bio']}>
        <span className={styles['author__bio-sentence']}>
          {getRandomItemFromArray(sentenceArr)}
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
