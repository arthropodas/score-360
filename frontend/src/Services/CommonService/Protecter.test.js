import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Protected from './Protecter';
import "@testing-library/jest-dom";

// Mocking the localStorage getItem method
const mockLocalStorage = {
  getItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Protected component', () => {
  test('renders the provided component if user is authenticated', () => {
    // Set login status to emulate authenticated user
    mockLocalStorage.getItem.mockReturnValueOnce('authToken');

    // Define a mocked component
    const MockedComponent = () => <div data-testid="mocked-component">Mocked Component</div>;

    // Render the Protected component with the mocked component inside
    render(
      <BrowserRouter>
        <Protected Comp={MockedComponent} />
      </BrowserRouter>
    );

    // Assert that the mocked component is rendered
    expect(screen.getByTestId('mocked-component')).toBeInTheDocument();
  });

  test('redirects to login page if user is not authenticated', () => {
    // Set login status to emulate unauthenticated user
    mockLocalStorage.getItem.mockReturnValueOnce(null);

    // Define a mocked component
    const MockedComponent = () => <div data-testid="mocked-component">Mocked Component</div>;

    // Render the Protected component with the mocked component inside
    render(
      <BrowserRouter>
        <Protected Comp={MockedComponent} />
      </BrowserRouter>
    );

    // Assert that the user is redirected to the login page
    expect(window.location.pathname).toBe('/login');
  });
});
