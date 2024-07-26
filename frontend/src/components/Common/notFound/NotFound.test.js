import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "./NotFound";
import "@testing-library/jest-dom";
jest.mock("../../../assets/loginBackground.png", () => {
  return {
    default: "loginBackground.png",
  };
});
describe("NotFound Component", () => {
  test("renders correctly", () => {
    render(<NotFound />);

    expect(screen.getByText("404 - Not Found")).toBeInTheDocument();

    expect(
      screen.getByText("Sorry, the page you are looking for does not exist.")
    ).toBeInTheDocument();
  });
});
