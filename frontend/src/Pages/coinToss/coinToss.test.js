
import React from "react";
import { act, fireEvent, render, screen, waitFor,  } from "@testing-library/react";
import CoinToss from "./CoinToss";
import '@testing-library/jest-dom';
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";


// Mocking matchToss function and ToastService
jest.mock("../../Services/MatchServices", () => ({
  matchToss: jest.fn(() => Promise.resolve()),
}));
jest.mock("../../components/Common/toast/ToastService", () => ({
  ToastService: jest.fn(),
}));

describe("CoinToss component", () => {
  const teamOne = { id: 1, team_name: "Team One", logo: "teamone.png" };
  const teamTwo = { id: 2, team_name: "Team Two", logo: "teamtwo.png" };
  const matchId = "123";

  let setTeamsMock;

  beforeEach(() => {
    setTeamsMock = jest.fn();
  });


   
  

  it("Toss the coin", async () => {
    await act(async ()=>{

      return render(
        <BrowserRouter><CoinToss
        teamOne={{ logo: "teamOneLogo", team_name: "Team One", id: 1 }}
        teamTwo={{ logo: "teamTwoLogo", team_name: "Team Two", id: 2 }}
        matchId="match123"
        onCloseModal={() => {}}
        setRefresh={() => {}}
        refresh={() => {}}
        setTeams={setTeamsMock} // Mock setTeams function
        setElevenOpen={() => {}}
      /></BrowserRouter>
      );
    })

    
    const btn=screen.getByTestId('coinToss')
    
    fireEvent.click(btn)
    screen.debug()
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await waitFor(async() => {
     await expect(screen.getByTestId("tossDecision")).toBeInTheDocument();
    });
  });
  

})


