import React from "react";
import { render, fireEvent } from "@testing-library/react";
import AppHeader from "./AppHeader";
import { MemoryRouter, useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
describe("AppHeader component", () => {
  let navigate;

  beforeEach(() => {
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  const renderAppHeader = () => {
    return render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    );
  };

  const clickNavigationButtonAndExpectNavigation = (buttonName, expectedPath) => {
    const { getByRole } = renderAppHeader();
    fireEvent.click(getByRole("button", { name: buttonName }));
    expect(navigate).toHaveBeenCalledWith(expectedPath);
  };

  const clickProfileOptionAndExpectNavigation = () => {
    const { getByLabelText, getByText } = renderAppHeader();
    fireEvent.mouseEnter(getByLabelText("Open settings"));
    fireEvent.click(getByText("Profile"));
    expect(navigate).toHaveBeenCalledWith("/profile");
  };

  const clickChangePasswordOptionAndExpectNavigation = () => {
    const { getByLabelText, getByText } = renderAppHeader();
    fireEvent.mouseEnter(getByLabelText("Open settings"));
    fireEvent.click(getByText("Change password"));
    expect(navigate).toHaveBeenCalledWith("/changePassword");
  };

  test("renders correctly", () => {
    const { getAllByRole } = renderAppHeader();
    expect(getAllByRole("link", { name: "Score360" })[0]).toBeInTheDocument();
});
 
  test("clicking on Profile option navigates to profile page", () => {
    clickProfileOptionAndExpectNavigation();
  });

  test("clicking on Change password option navigates to changePassword page", () => {
    clickChangePasswordOptionAndExpectNavigation();
  });

  
});