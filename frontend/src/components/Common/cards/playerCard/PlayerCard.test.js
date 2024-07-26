import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerCard from './PlayerCard';
import "@testing-library/jest-dom";
describe('PlayerCard Component', () => {
  const mockPlayer = {
    playerName: 'Johnwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    lastName: 'Doe',
    playerId: '12345',
    contactNumber: '1234567890',
    image: 'player.jpg',
  };
  const mockPlayer1 = {
    playerName: 'John',
    lastName: 'Doee',
    playerId: '123456',
    contactNumber: '1234511890',
    image: 'player.jpg',
  };
  test('renders player details correctly', () => {
    render(<PlayerCard {...mockPlayer} />);

    
    const playerId = screen.getByText('Player ID: 12345');
    expect(playerId).toBeInTheDocument();

    const contactNumber = screen.getByText('Contact Number: 1234567890');
    expect(contactNumber).toBeInTheDocument();
  });
  test('renders player details correctly with short name', () => {
    render(<PlayerCard {...mockPlayer1} />);

    
    const playerId = screen.getByText('Player ID: 123456');
    expect(playerId).toBeInTheDocument();

    const contactNumber = screen.getByText('Contact Number: 1234511890');
    expect(contactNumber).toBeInTheDocument();
  });

  test('displays full name in tooltip on name click', async () => {
    render(<PlayerCard {...mockPlayer1} />);

    const fullName = screen.queryAllByText('John Doee');
     fireEvent.click(fullName[0]); 
     
      const tooltip = screen.getAllByText('John Doee');
      
      await expect(tooltip[0]).toBeInTheDocument();
  });
});
