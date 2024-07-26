import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FloatingActionButton from "./FloatingActionButton";
import "@testing-library/jest-dom";
import { Add } from "@mui/icons-material";

describe("FloatingActionButton", () => {
  test("renders button with correct props", () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <FloatingActionButton
        color="primary"
        ariaLabel="Add"
        variant="circular"
        icon={<Add />}
        onClick={onClick}
        datatestid="fab-button"
      />
    );
    const button = getByTestId("fab-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Add");
    expect(button).toHaveClass("MuiFab-root");
    expect(button).toHaveClass("MuiFab-circular");
    expect(button).not.toBeDisabled();
  });

  test("calls onClick function when clicked", () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <FloatingActionButton
        color="primary"
        ariaLabel="Add"
        variant="circular"
        icon={<Add />}
        onClick={onClick}
        datatestid="fab-button"
      />
    );
    const button = getByTestId("fab-button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
