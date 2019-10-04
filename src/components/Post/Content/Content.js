// @flow strict
import React from 'react';
import styles from './Content.module.scss';
import Meta from '../Meta';
import Tags from '../Tags';
import type { Fields, FrontMatter } from '../../../types';

type Props = {
  body: string,
  title: string,
  fields: Fields,
  frontmatter: FrontMatter
};

const Content = ({
  body, title, fields, frontmatter
}: Props) => {
  const { tagSlugs } = fields;
  const { tags, date } = frontmatter;

  return (
    <div className={styles['content']}>
      <h1 className={styles['content__title']}>{title}</h1>
      {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
      <Meta date={date} />
      <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
};

export default Content;
