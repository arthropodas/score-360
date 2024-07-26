import React from "react";
import { render, screen } from "@testing-library/react";
import TextBox from "./TextField";
import "@testing-library/jest-dom";

describe("TextBox", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query.includes("max-width:600px"),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });
  const defaultProps = {
    name: "test",
    title: "Test",
    type: "text",
    label: "Test Label",
    InputProps: {},
    required: false,
    disabled: false,
    error: false,
    helperText: "",
  };

  it("renders correctly with default props", () => {
    render(<TextBox {...defaultProps} />);
    const textBox = screen.getByLabelText("Test Label");
    expect(textBox).toBeInTheDocument();
    expect(textBox).toHaveAttribute("type", "text");
    expect(textBox).toHaveAttribute("name", "test");
    expect(textBox).not.toBeDisabled();
  });

  it("renders with error and helper text", () => {
    render(<TextBox {...defaultProps} error={true} helperText="Test error" />);
    const errorText = screen.getByText("Test error");
    expect(errorText).toBeInTheDocument();
  });


  it("renders correctly with password type", () => {
    render(<TextBox {...defaultProps} type="password" />);
    const passwordTextBox = screen.getByLabelText("Test Label");
    expect(passwordTextBox).toHaveAttribute("type", "password");
  });

  it("renders correctly with required prop", () => {
    render(<TextBox {...defaultProps} required={true} />);
    const requiredIndicator = screen.getByText("*");
    expect(requiredIndicator).toBeInTheDocument();
  });

  it("renders correctly with disabled prop", () => {
    render(<TextBox {...defaultProps} disabled={true} />);
    const disabledTextBox = screen.getByLabelText("Test Label");
    expect(disabledTextBox).toBeDisabled();
  });
  it("applies dense margin when screen size is small", () => {
    render(<TextBox type="text" name="test" label="Test Label" />);
    const textBox = screen.getByLabelText("Test Label");
    expect(textBox).toHaveStyle("margin: 0");
  });
});
