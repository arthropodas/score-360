import React from "react";
import "@testing-library/jest-dom";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TournamentsList from "./TournamentsList";
import { BrowserRouter } from "react-router-dom";
import * as apiUrls from "../../Services/TournamentServices";

import { act } from "react-dom/test-utils";
jest.mock("../../assets/loginBackground.png", () => {
  return {
    default: "loginBackground.png",
  };
});

const localStorageMock = {
  getItem: jest.fn().mockReturnValue(
    JSON.stringify({
      authTokens: {
        accessToken: "mockedAccessToken",
        refreshToken: "mockedRefreshToken",
        userId: "3",
        user_type: "0",
      },
    })
  ),
};

beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
});
const TOURNAMENT_ID = "1";
const TOURNAMENT_NAME = "summer cup";
const START_DATE = "2000-01-01";
const END_DATE = "2000-01-02";
const VENUE = "a";
const GROUND = "sport1";
const ORGANIZER_NAME = "main field2";
const ORGANIZER_CONTACT = "1212123212";
const TOURNAMENT_CATEGORY = "Open";
const BALL_TYPE = "Standard";
const DESCRIPTION = "Annual foot";
const STATUS = "1";
const CREATED_AT = "2024-05-01T12:00:00Z";
const UPDATED_AT = "2024-05-01T12:00:00Z";
const USER_ID = "3";

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => fn),
    formState: {
      errors: {},
    },
  }),
}));
describe("List component", () => {
  const mockResponse = {
    data: {
      count: 3,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          tournament_name: TOURNAMENT_NAME,
          start_date: START_DATE,
          end_date: END_DATE,
          venue: VENUE,
          ground: GROUND,
          organizer_name: ORGANIZER_NAME,
          organizer_contact: ORGANIZER_CONTACT,
          tournament_category: TOURNAMENT_CATEGORY,
          ball_type: BALL_TYPE,
          description: DESCRIPTION,
          status: STATUS,
          created_at: CREATED_AT,
          updated_at: UPDATED_AT,
          user: 3,
        },
      ],
    },
  };
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
 
  });
  it("render tournament component 5", async () => {
    const mockTournamentList = jest.spyOn(apiUrls, "getTournamentLists");
    const mockTournamentList2 = jest.spyOn(apiUrls, "tournamentDelete");
    
    mockTournamentList.mockResolvedValueOnce(mockResponse);
    mockTournamentList2.mockResolvedValueOnce("success");
    
    render(
      <BrowserRouter>
        <TournamentsList />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: "summer" },
    });
    act(() => {
      fireEvent.click(screen.getByLabelText(/search/i));
    });
    await waitFor(() => {
      expect(mockTournamentList).toHaveBeenCalled();
    });
    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: "summer" },
    });
    
    fireEvent.click( screen.getByLabelText('remove match'));
    fireEvent.click( screen.getByTestId('deleteButton'));
    expect(mockTournamentList2).toHaveBeenCalled();
  });

  it("render tournament component 6", async () => {
    const mockTournamentList = jest.spyOn(apiUrls, "getTournamentLists");
    const mockTournamentList2 = jest.spyOn(apiUrls, "tournamentDelete");
    

    const mockError = new Error("Password change failed");
    mockError.response = {
      data: { message: "Password change failed", errorCode: "5007" },
      status: 400,
    };

    mockTournamentList.mockResolvedValueOnce(mockResponse);
    mockTournamentList2.mockRejectedValueOnce(mockError);
    
    render(
      <BrowserRouter>
        <TournamentsList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(mockTournamentList).toHaveBeenCalled();
    });
    fireEvent.click( screen.getByLabelText('remove match'));
    fireEvent.click( screen.getByTestId('deleteButton'));
    expect(mockTournamentList2).toHaveBeenCalled();
  });


});

