'use strict';

module.exports = {
  site: {
    siteMetadata: {
      url: 'http://localhost',
      title: 'Test title',
      subtitle: 'Test subtitle',
      copyright: 'Test copyright',
      disqusShortname: '',
      postsPerPage: 4,
      menu: [
        {
          label: 'Test label 1',
          path: '/test/1/'
        },
        {
          label: 'Test label 2',
          path: '/test/2/'
        },
        {
          label: 'Test label 3',
          path: '/test/3/'
        }
      ],
      author: {
        name: 'Test name',
        photo: '/test.jpg',
        bio: 'Test bio',
        contacts: {
          email: '#',
          telegram: '#',
          twitter: '#',
          github: '#',
          rss: '#',
          vkontakte: '#'
        }
      },
      keywords: [
        'Test keyword 1.',
        'Test keyword 2.',
        'Test keyword 3.'
      ],
      sentence: [
        'Test sentence 1.',
        'Test sentence 2.',
        'Test sentence 3.'
      ]
    }
  }
};
