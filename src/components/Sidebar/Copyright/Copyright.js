// @flow strict
import React from 'react';
import styles from './Copyright.module.scss';

type Props = {
  copyright: string
};

const Copyright = ({ copyright }: Props) => (
  <div className={styles['copyright']}>
    {copyright.split('\n').map((item, i) => {
      return <p>{item}</p>;
    })}
  </div>
);

export default Copyright;
