import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Solr Book Search header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Solr Book Search/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders search bar', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search for books, authors, or genres/i);
  expect(searchInput).toBeInTheDocument();
});

test('renders search button', () => {
  render(<App />);
  const searchButton = screen.getByRole('button', { name: /search/i });
  expect(searchButton).toBeInTheDocument();
});