import React from "react";
import { render } from "@testing-library/react";
import Heading from "./Heading";
import "@testing-library/jest-dom";

describe("Heading component", () => {
  test("renders with default variant", () => {
    const { getByText } = render(<Heading text="Heading Text" />);
    const headingElement = getByText("Heading Text");
    expect(headingElement.tagName).toBe("H1");
  });

  test("renders with specified variant", () => {
    const { getByText } = render(
      <Heading text="Heading Text" variant="secondary" />
    );
    const headingElement = getByText("Heading Text");
    expect(headingElement.tagName).toBe("H2");
  });

  test("renders with tertiary variant", () => {
    const { getByText } = render(
      <Heading text="Heading Text" variant="tertiary" />
    );
    const headingElement = getByText("Heading Text");
    expect(headingElement.tagName).toBe("H3");
  });

  test("renders with specified fontSize", () => {
    const { getByText } = render(
      <Heading text="Heading Text" fontSize="24px" />
    );
    const headingElement = getByText("Heading Text");
    expect(headingElement).toHaveStyle("font-size: 24px");
  });

  test("renders with specified color", () => {
    const { getByText } = render(<Heading text="Heading Text" color="blue" />);
    const headingElement = getByText("Heading Text");
    expect(headingElement).toHaveStyle("color: blue");
  });

  test("renders with specified fontStyle", () => {
    const { getByText } = render(
      <Heading text="Heading Text" fontStyle="italic" />
    );
    const headingElement = getByText("Heading Text");
    expect(headingElement).toHaveStyle("font-style: italic");
  });
});
