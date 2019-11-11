// @flow strict
import React from 'react';
import Author from './Author';
import Comments from './Comments';
import Content from './Content';
import styles from './Post.module.scss';
import type { Node } from '../../types';

type Props = {
  post: Node
};

const Post = ({ post }: Props) => {
  const { html } = post;
  const { slug } = post.fields;
  const { title } = post.frontmatter;

  return (
    <div className={styles['post']}>
      <div className={styles['post__content']}>
        <Content body={html} title={title} fields={post.fields} frontmatter={post.frontmatter} />
      </div>

      <div className={styles['post__footer']}>
        <Author />
      </div>

      <div className={styles['post__comments']}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
