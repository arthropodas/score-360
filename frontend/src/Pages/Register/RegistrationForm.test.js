import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/";
import RegistrationForm from "./RegistrationForm";
import { BrowserRouter } from "react-router-dom";
import * as apiUrls from "../../Services/RegisterServices";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({ token: "mocked-token" }),
}));
const mockPlayerRegister = jest.spyOn(apiUrls, "playerRegister");
const mockResponse = { data: { message: "successfully created" } };
const GENDER = "Male";
const BATTING = "Right arm pace/seam bowling";
const KEY = "ArrowDown";
describe("RegistrationForm", () => {
  it("should call playerRegister with the correct data when the form is submitted with valid data..... 3", async () => {
    mockPlayerRegister.mockRejectedValueOnce({
      data: { errorCode: "3116", message: "sorry" },
    });
    render(
      <BrowserRouter>
        <RegistrationForm />
      </BrowserRouter>
    );

    const modalButton = screen.getByTestId("regModalBtn");
    fireEvent.click(modalButton);
    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: "Jss" },
    });
    fireEvent.change(screen.getByLabelText(/Last name/i), {
      target: { value: " ssdf" },
    });

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "johndoeexample@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone number/i), {
      target: { value: "1234567121" },
    });

    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: "Strong@1234343" },
    });

    fireEvent.click(screen.getByText(/Register/i));
  });

  it("should call playerRegister with the correct data when the form is submitted with valid data 3", async () => {
    mockPlayerRegister.mockResolvedValueOnce(mockResponse);
    render(
      <BrowserRouter>
        <RegistrationForm />
      </BrowserRouter>
    );

    const modalButton = screen.getByTestId("regModalBtn");
    fireEvent.click(modalButton);
    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: "J" },
    });
    fireEvent.change(screen.getByLabelText(/Last name/i), {
      target: { value: " s  .." },
    });

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "johndoeexample.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone number/i), {
      target: { value: "1234567" },
    });

    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: "Stron" },
    });

    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(screen.getByText(/first name is not valid./i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is not valid/i)).toBeInTheDocument();

      expect(
        screen.getByText(/Phone number is not valid./i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Email is not valid./i)).toBeInTheDocument();
    });
  });

  it("should call playerRegister with the correct data when the form is submitted with valid data 2", async () => {
    const errorCode = "9999";
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: errorCode,
        },
      },
    };

    mockPlayerRegister.mockRejectedValueOnce(mockErrorResponse);
    render(
      <BrowserRouter>
        <RegistrationForm />
      </BrowserRouter>
    );
    const modalButton = screen.getByTestId("regModalBtn");
    fireEvent.click(modalButton);
    fireEvent.change(screen.getByLabelText(/First name/i), {
      target: { value: "JohnY" },
    });
    fireEvent.change(screen.getByLabelText(/Last name/i), {
      target: { value: "DoeY" },
    });
    const batting = screen.getByLabelText(/Batting style/i);
    fireEvent.click(batting);
    fireEvent.keyDown(batting.firstChild, { key: KEY });

    await waitFor(() => {
      screen.queryByText("left");
    });
    fireEvent.click(screen.getByText(/left/i));
    const gender = screen.getByLabelText(/Gender/i);
    fireEvent.click(gender);
    fireEvent.keyDown(gender.firstChild, { key: KEY });

    await waitFor(() => {
      screen.queryByText(GENDER);
    });
    fireEvent.click(screen.getByText(GENDER));

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "johndoe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone number/i), {
      target: { value: "1234567890" },
    });
    const balling = screen.getByLabelText(/Bowling style/i);
    fireEvent.click(balling);
    fireEvent.keyDown(balling.firstChild, { key: KEY });
    await waitFor(() => {
      screen.queryByText(BATTING);
    });
    fireEvent.click(screen.getByText(BATTING));
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: "Strong@123" },
    });

    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(mockPlayerRegister).toHaveBeenCalled();
    });
  });
});
