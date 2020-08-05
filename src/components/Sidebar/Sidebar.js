// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import Author from './Author';
import Contacts from './Contacts';
import Copyright from './Copyright';
import Menu from './Menu';
import styles from './Sidebar.module.scss';
import { useSiteMetadata, useTagsList } from '../../hooks';

type Props = {
  isIndex?: boolean,
};

const Sidebar = ({ isIndex }: Props) => {
  const { author, copyright, menu } = useSiteMetadata();
  const tags = useTagsList();

  return (
    <div className={styles['sidebar']}>
      <div className={styles['sidebar__inner']}>
        <div className={styles['sidebar__inner-fixed']}>
          <Author author={author} isIndex={isIndex} />
          <Menu menu={menu} />
          <Contacts contacts={author.contacts} />
          <ul className={styles['sidebar__tags-list']}>
            {tags.map((tag) => (
              <li className={styles['sidebar__tags-list-item']} key={tag.fieldValue}>
                <Link
                  to={`/tag/${kebabCase(tag.fieldValue)}/`}
                  className={styles['sidebar__tags-list-item-link']}
                  activeClassName={styles['sidebar__tags-list-item-link--active']}
                >
                  {tag.fieldValue} ({tag.totalCount})
                </Link>
              </li>
            ))}
          </ul>
          <Copyright copyright={copyright} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
