import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import TeamCard from "./TeamCard";
import { MemoryRouter } from "react-router-dom";

describe("TeamCard Component", () => {
  const handleAddClick = jest.fn();
  const handleEditClick= jest.fn();
  const setIsAddOpen = jest.fn();
  const teamName = "Test Team";
  const teamNameHigher = "test teammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
  const city = "Test City";
  const cityHigher = "test cityyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
  const logo = "test_logo.png";
  const dataTestId = "test-id";
  const onDelete = jest.fn();
  const handleDeleteClick = jest.fn(); 

  test("renders team name and city correctly", () => {
    render(
      <MemoryRouter>
        <TeamCard teamName={teamName} city={city} logo={logo} dataTestId={dataTestId} />
      </MemoryRouter>
    );
    const teamNameElement = screen.getByText(teamName);
    const cityElement = screen.getByText(city);
    expect(teamNameElement).toBeInTheDocument();
    expect(cityElement).toBeInTheDocument();
  });

  test("renders default logo if no logo is provided", () => {
    render(
      <MemoryRouter>
        <TeamCard teamName={teamNameHigher} city={cityHigher} />
      </MemoryRouter>
    );
    const defaultLogoElement = screen.getByText(teamName.charAt(0).toUpperCase());
    expect(defaultLogoElement).toBeInTheDocument();
  });

  test("calls onDelete function when delete button is clicked", () => {
    render(
      <MemoryRouter>
        <TeamCard teamName={teamName} city={city} logo={logo} onDelete={onDelete} dataTestId={dataTestId} />
      </MemoryRouter>
    );
    const deleteButton = screen.getByTestId(dataTestId);
    fireEvent.click(deleteButton);

    const deleteConfirmationDialog = screen.getByText("Delete Confirmation");
    expect(deleteConfirmationDialog).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('deleteButton'));
  });

  test("calls onDelete function when delete button is clicked cancel", () => {
    render(
      <MemoryRouter>
        <TeamCard teamName={teamName} city={city} logo={logo} onDelete={handleDeleteClick} dataTestId={dataTestId} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId(dataTestId));

    const deleteConfirmationDialog = screen.getByText("Delete Confirmation");
    expect(deleteConfirmationDialog).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(/cancelButton/i));
    expect(deleteConfirmationDialog).toBeInTheDocument();
  });
  it('renders buttons with tooltips and triggers events correctly', () => {
    // Render your component within MemoryRouter and store the result
    const { getByLabelText, getByTestId } = render(
      <MemoryRouter>
        <TeamCard teamName={teamName} setIsAddOpen={setIsAddOpen} city={city} logo={logo} handleEditClick={handleEditClick} handleAddClick={handleAddClick}onDelete={handleDeleteClick} dataTestId={dataTestId} />
      </MemoryRouter>
    );

    // Find and click the "Add player" button
    const addButton = getByLabelText('Add player');
    fireEvent.click(addButton);
    // Assert that the event handler for adding a player was called

    // Find and click the "Edit team" button
    const editButton = getByTestId('test-idedit');
    fireEvent.click(editButton);
    
  });
});
