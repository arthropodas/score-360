import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CenteredTabs from './HeaderTab';
import '@testing-library/jest-dom';



describe('CenteredTabs component', () => {
  it('renders tabs with correct labels', () => {
    const tabLabels = ['Tab 1', 'Tab 2', 'Tab 3'];
    const { getByText } = render(<CenteredTabs tabLabels={tabLabels} />);
    
    tabLabels.forEach(label => {
      const tabElement = getByText(label);
      expect(tabElement).toBeInTheDocument();
    });
  });

  it('calls onTabClick handler when a tab is clicked', () => {
    const tabLabels = ['Tab 1', 'Tab 2', 'Tab 3'];
    const onTabClickMock = jest.fn();
    const { getByText } = render(<CenteredTabs tabLabels={tabLabels} onTabClick={onTabClickMock} />);
    
    fireEvent.click(getByText('Tab 2'));
    
    expect(onTabClickMock).toHaveBeenCalled();
  });

 
});
