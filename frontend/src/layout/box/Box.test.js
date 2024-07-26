import React from "react";
import { render } from "@testing-library/react";
import PageWithBorderLayout from "./Box";
import "@testing-library/jest-dom";

jest.mock("../../assets/loginBackground.png", () => {
  return {
    default: "loginBackground.png",
  };
});

describe("PageWithBorderLayout", () => {
  it("renders children inside a box with correct styles", () => {
    const { getByTestId} = render(
      <PageWithBorderLayout>
        <div data-testid="child">Child Component</div>
      </PageWithBorderLayout>
    );

    const childElement = getByTestId("child");

    expect(childElement).toBeInTheDocument();
  });
});
