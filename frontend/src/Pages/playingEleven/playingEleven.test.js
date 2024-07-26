import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import PlayingEleven from './PlayingEleven';
import "@testing-library/jest-dom";
import { BrowserRouter } from 'react-router-dom';

// Mocking TeamServices module
jest.mock('../../Services/TeamServices', () => ({
 getSquad: jest.fn().mockResolvedValue({
   data: [
     { id: 1, name: 'Player 1' },
     { id: 2, name: 'Player 2' },
     // Add more player objects as needed
   ]
 }),
 addPlayingEleven: jest.fn().mockResolvedValue({ success: true }), // Mock addPlayingEleven function
}));


describe('PlayingEleven Component', () => {
 const mockSetElevenOpen = jest.fn();
 const mockMatchId = 'mockMatchId';
 const mockTeams = {
   team1: { id: 'team1Id' },
   team2: { id: 'team2Id' },
 };
 const mockData = {
   matchId: mockMatchId,
   teamOnePlayers: [],
   teamOneId: mockTeams?.team1?.id,
   teamTwoPlayers: [],
   teamTwoId: mockTeams?.team2?.id,
 };


 test('renders PlayingEleven component correctly', async () => {
   const { getByText } = render(
<BrowserRouter>     <PlayingEleven
       setElevenOpen={mockSetElevenOpen}
       matchId={mockMatchId}
       teams={mockTeams}
     /></BrowserRouter>
   );


  
   expect(getByText('Add')).toBeInTheDocument();
   expect(getByText('Cancel')).toBeInTheDocument();
 });


 test('selects and deselects players from team one', async () => {
   const { getAllByTestId } = render(
    <BrowserRouter>     <PlayingEleven
           setElevenOpen={mockSetElevenOpen}
           matchId={mockMatchId}
           teams={mockTeams}
         /></BrowserRouter>
       );
    // Wait for the players to be populated
 await waitFor(() => expect(getAllByTestId('playername')[0]).toBeTruthy());


 // Click on the first player checkbox
 fireEvent.click(getAllByTestId('playername')[0]);




   // Check if the player is deselected
   expect(getAllByTestId('playername')[0]).not.toBeChecked();
   expect(getAllByTestId('playername')[1]).not.toBeChecked();

   
 });


 test('handles cancel action', () => {
   const { getByText } = render(
    <BrowserRouter>     <PlayingEleven
    setElevenOpen={mockSetElevenOpen}
    matchId={mockMatchId}
    teams={mockTeams}
  /></BrowserRouter>
   );


   // Click on the cancel button
   fireEvent.click(getByText('Cancel'));


 });


 test('handles click to add eleven with error', async () => {
   const { getByText } = render(
    <BrowserRouter>     <PlayingEleven
    setElevenOpen={mockSetElevenOpen}
    matchId={mockMatchId}
    teams={mockTeams}
  /></BrowserRouter>
   );


   // Simulate clicking on the Add button
   fireEvent.click(getByText('Add'));
 });


 // Add more test cases as needed...
});


