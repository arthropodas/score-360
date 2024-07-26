import React from "react";
import { render, act } from "@testing-library/react";
import LiveScoreView from "./LiveScoreView";
import { MemoryRouter,useNavigate } from "react-router-dom";
import { getMatchCurrentScore, getMatchScore } from "../../Services/MatchServices";


jest.mock("../../Services/MatchServices", () => ({
  getMatchCurrentScore: jest.fn(),
  getMatchScore: jest.fn()
  
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
describe("LiveScoreView component", () => {
  let navigate;

  beforeEach(() => {
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });
    it("connects to WebSocket and updates score data", async () => {
      
      const mockWebSocket = {
        onopen: jest.fn(),
        onmessage: jest.fn(),
        replace:jest.fn()
      };
  
      
      global.WebSocket = jest.fn().mockImplementation(() => mockWebSocket);

  
      const mockScoreData = {
        teamTotal: "100",
      };
  
      // Mock the replace method for jsonData
      const replaceMock = jest.fn().mockReturnValue('mocked data');
      const jsonData = {
        replace: replaceMock,
      };
  
      jest.spyOn(JSON, 'parse').mockReturnValue(jsonData);
      render( <MemoryRouter><LiveScoreView /></MemoryRouter>);
  
      act(() => {
        mockWebSocket.onopen(); 
      });
  
      act(() => {
        mockWebSocket.onmessage({
          data: JSON.stringify(mockScoreData), 
        });
      });

      const mockGetData = {
        data:0
      };
       const mockError = new Error("Match delete faild.");
    mockError.response = {
      data: { message: "Error message from server.", errCode: 7777 },
    };
    getMatchScore.mockResolvedValueOnce("data")
    await getMatchCurrentScore.mockResolvedValueOnce(mockError);
    
    });
  });