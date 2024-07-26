import React from 'react';
import { render } from '@testing-library/react';
import CustomModal from './Modal';

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(() => true),
}));

describe('CustomModal', () => {
  it('renders correctly for small screens', () => {
    const handleClose = jest.fn();

    const { getByText } = render(
      <CustomModal open={true} handleClose={handleClose}>
        Test Content
      </CustomModal>
    );

    const modalContent = getByText('Test Content');
    expect(modalContent).not.toBeNull();
  });
});
