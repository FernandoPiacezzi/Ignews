import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { Async } from '.'

test('it renders correctly', async () => {
  render(<Async />)

  screen.logTestingPlaygroundURL() // -> playground para melhor escrita de testes!


  expect(screen.getByText('Hello world')).toBeInTheDocument();
  // expect(await screen.findByText('Button')).toBeInTheDocument(); -> teste async

  // await waitForElementToBeRemoved(screen.queryByText('Button')) -> testar remove async

  await waitFor(() => {
    return expect(screen.getByText('Button')).toBeInTheDocument() // -> test async
  })
})