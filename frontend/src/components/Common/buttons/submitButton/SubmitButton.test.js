import React from 'react';
import { render } from '@testing-library/react';
import SubmitButton from './SubmitButton';
import "@testing-library/jest-dom";
describe('SubmitButton', () => {
  test('renders button with correct name', () => {
    const { getByText } = render(<SubmitButton name="Submit" />);
    expect(getByText('Submit')).toBeInTheDocument();
  });

  test('disables button when disabled prop is true', () => {
    const { getByTestId } = render(<SubmitButton name="Submit" datatestid="submit-button" disabled />);
    expect(getByTestId('submit-button')).toBeDisabled();
  });
});
