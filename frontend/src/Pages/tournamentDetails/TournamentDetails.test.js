import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TournamentDetails from "./TournamentDetails";
import * as apiUrls from "../../Services/TournamentServices";
import { teamList } from "../../Services/TeamServices";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("../../Services/TournamentServices", () => ({
    getTournamentData: jest.fn(),
  }));

const mockNavigate=jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: ()=>mockNavigate,
  }));

describe("render details page",()=>{

    it('renders learn react link', () => {
        const mockTournamentData = {
            data: {
              ball_type: "tennis",
              created_at: "2024-02-01T03:27:13.175292Z",
              description: "This is a test tournament description.",
              end_date: "2024-02-15",
              ground: "Test Ground",
              id: 7,
              organizer_contact: "1234567890",
              organizer_name: "Test Organizer",
              start_date: "2024-02-10",
              status: 1,
              tournament_category: "open",
              tournament_name: "dfs",
              updated_at: "2024-02-01T03:27:13.175321Z",
              user: 1,
              venue: "Test Venue",
              matches:11,
              teams:5
            },
          };
      
          apiUrls.getTournamentData.mockResolvedValueOnce(mockTournamentData);
        render(<BrowserRouter><TournamentDetails/></BrowserRouter>)
          expect(apiUrls.getTournamentData).toHaveBeenCalled()
})
it('failed getTournament api call', () => {
    const mockTournamentData = {
data:{
    "errorCode":1001,"message":'something went wrong'
}      };
  
      apiUrls.getTournamentData.mockRejectedValueOnce(mockTournamentData);
    render(<BrowserRouter><TournamentDetails/></BrowserRouter>)
      expect(apiUrls.getTournamentData).toHaveBeenCalled()
})
it('failed getTournament api call with 403 error', () => {
    const mockTournamentData = {status:403,
    };
  
      apiUrls.getTournamentData.mockRejectedValueOnce(mockTournamentData);
    render(<BrowserRouter><TournamentDetails/></BrowserRouter>)
      expect(apiUrls.getTournamentData).toHaveBeenCalled()
})


it('testing tab click',()=>{
    render(<BrowserRouter><TournamentDetails/></BrowserRouter>)
    const teams=screen.getByTestId('teamsz')
    fireEvent.click(teams)

})
it('testing tab click match',()=>{
  render(<BrowserRouter><TournamentDetails/></BrowserRouter>)
  const matches=screen.getByTestId('matchz')
  fireEvent.click(matches)

})
})