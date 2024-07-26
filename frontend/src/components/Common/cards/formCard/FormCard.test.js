import React from 'react';
import { render } from '@testing-library/react';
import FormCard from './FormCard';
import "@testing-library/jest-dom";

describe('FormCard', () => {
  test('renders children correctly', () => {
    const { getByText } = render(
      <FormCard>
        <div>Hello, World!</div>
      </FormCard>
    );
    expect(getByText('Hello, World!')).toBeInTheDocument();
  });

  test('renders with specified width', () => {
    const { container } = render(<FormCard width="300px" />);
    const card = container.firstChild;
    expect(card).toHaveStyle('width: 300px');
  });

  test('renders with specified margin', () => {
    const { container } = render(<FormCard margin="20px" />);
    const card = container.firstChild;
    expect(card).toHaveStyle('margin: 20px');
  });

  
});
