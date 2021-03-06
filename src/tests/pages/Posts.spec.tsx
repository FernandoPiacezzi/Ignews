import { render, screen} from '@testing-library/react'
import React from 'react';
import {stripe} from '../../services/stripe';
import { mocked } from 'ts-jest/utils';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic'


const posts = [
  {slug: 'my-new-post', title: 'My new post', excerpt: 'Post excerpt', updatedAt: 'March 10th'}
]

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('renders correctly', () => {
    render(
      <Posts posts={posts} />
  )
  
  expect(screen.getByText('My new post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                {type: 'heading', text: 'My new post'}
              ],
              content: [
                {type: 'paragraph', text: 'Post expect'}
              ],
            },
            last_publication_date: '04-01-2021',
          }
        ]
      })
    } as any)


    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: { 
          posts: [{
            slug: 'my-new-post',
            title: 'My new post',
            excerpt: 'Post expect',
            updatedAt: '01 de abril de 2021'
          }]
        }
      })
    )
  })
})