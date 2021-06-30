import { render, screen} from '@testing-library/react'
import React from 'react';
import {stripe} from '../../services/stripe';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic'
import { getSession } from 'next-auth/client';


const posts = {slug: 'my-new-post', title: 'My new post', content: '<p>Post content</p>', updatedAt: 'March 10th'}

jest.mock('next-auth/client')

jest.mock('../../services/prismic')

describe('Post page', () => {
  it('renders correctly', () => {
    render(
      <Post post={posts} />
  )
  
  expect(screen.getByText('My new post')).toBeInTheDocument()
  expect(screen.getByText('Post content')).toBeInTheDocument()
  })

  //
  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)
    
    getSessionMocked.mockResolvedValueOnce(null)
    

    
    const response = await getServerSideProps({params: {slug: 'my-new-post'}} as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    )
  })

  //
  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    const getSessionMocked = mocked(getSession)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {type: 'heading', text: 'My new post'}
          ],
          content: [
            {type: 'paragraph', text: 'Post content'}
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-subscription'
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: { 
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '01 de abril de 2021'
          }}
      })
    )


  })
})