import React from "react";
import { render } from "@testing-library/react";
import LogoutButton from "../logout/Logout";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("LogoutButton", () => {
  it("should remove user token from localStorage and navigate to login page", () => {
    // Arrange
    localStorage.setItem("userToken", "some-token-value");
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Act
    render(<LogoutButton />);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should not throw errors if user token does not exist in localStorage", () => {
    // Arrange
    localStorage.removeItem("userToken");
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Act
    render(<LogoutButton />);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});