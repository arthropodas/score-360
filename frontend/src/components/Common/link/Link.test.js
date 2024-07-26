import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import "@testing-library/jest-dom";
import { HoverLink } from './Link';

describe('HoverLink component', () => {
  test('renders with correct link destination', () => {
    const destination = '/example';
    const { getByText } = render(
      <Router>
        <HoverLink to={destination}>Link Text</HoverLink>
      </Router>
    );
    const linkElement = getByText('Link Text');
    expect(linkElement).toHaveAttribute('href', destination);
  });

  // Add more test cases as needed
});
