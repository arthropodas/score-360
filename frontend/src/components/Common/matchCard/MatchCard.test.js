

import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import MatchCard from './MatchCard';
import '@testing-library/jest-dom'
import { getTeamData } from '../../../Services/TeamServices';
import { deleteMatch } from '../../../Services/MatchServices';
jest.mock('../../../Services/TeamServices');
jest.mock('../../../Services/MatchServices');
jest.mock("../../../assets/vs.png", () => ({
 default: "vs.png",
}));


describe('MatchCard Component', () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });


 it('renders match card with provided opponents and handles data loading', async () => {
   const team1Data = {
     data: {
       team_name: 'Team A',
       logo: '/path/to/logo1.png',
     },
   };


   const team2Data = {
     data: {
       team_name: 'Team B',
       logo: '/path/to/logo2.png',
     },
   };


   getTeamData
     .mockResolvedValueOnce({ data: {} })
     .mockResolvedValueOnce(team1Data)
     .mockResolvedValueOnce(team2Data);


  render(
     <MatchCard opponent_one="1" opponent_two="2" />
   );
 });

 it('renders match card without logos', async () => {
   const team1Data = {
     data: {
       team_name: 'Team A',
     },
   };

   const team2Data = {
     data: {
       team_name: 'Team B',
     },
   };

   getTeamData.mockResolvedValueOnce(team1Data).mockResolvedValueOnce(team2Data);

   const { queryByAltText } = render(
     <MatchCard opponent_one="1" opponent_two="2" />
   );

   await waitFor(() => {
      expect(queryByAltText('Logo')).toBeNull();
   });
 });


 it('handles error when fetching team data', async () => {
   const errorMessage = 'Failed to fetch team data';
   getTeamData.mockRejectedValueOnce(new Error(errorMessage));
    render(
     <MatchCard opponent_one="1" opponent_two="2" />
   );

})

});
