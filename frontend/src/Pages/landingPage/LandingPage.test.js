import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { LandingPage } from "./LandingPage";

jest.mock("../../assets/loginBackground.png", () => {
  return {
    default: "loginBackground.png",
  };
});

describe("LandingPage", () => {
  test("renders AppHeader, CenteredTabs, and Outlet", () => {
    const { getByText } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

  });

});
