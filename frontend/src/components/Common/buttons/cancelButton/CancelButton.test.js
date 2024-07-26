import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CancelButton from './CancelButton';
import '@testing-library/jest-dom';

describe('CancelButton', () => {
  test('renders button with correct props', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <CancelButton
        name="Cancel"
        title="Cancel"
        disabled={false}
        onClick={onClick}
        datatestid="cancel-button"
      />
    );
    const button = getByTestId('cancel-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Cancel');
    expect(button).toHaveAttribute('title', 'Cancel');
    expect(button).not.toBeDisabled();
  });

  test('calls onClick function when clicked', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <CancelButton
        name="Cancel"
        title="Cancel"
        disabled={false}
        onClick={onClick}
        datatestid="cancel-button"
      />
    );
    const button = getByTestId('cancel-button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
