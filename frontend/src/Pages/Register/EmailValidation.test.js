import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import "@testing-library/jest-dom";
import EmailValidation from "../Register/EmailValidation";
import { BrowserRouter } from "react-router-dom";
import * as apiUrls from "../../Services/RegisterServices";
const EMAIL = "adarshvarghese2k@gmail.com";
describe("EmailValidation component", () => {
  test("renders component correctly", () => {
    render(
      <BrowserRouter>
        <EmailValidation />
      </BrowserRouter>
    );

    expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /verify/i })).toBeInTheDocument();
  });

  test("displays error message for invalid email format", async () => {
    render(
      <BrowserRouter>
        <EmailValidation />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "mithragmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is not valid.")).toBeInTheDocument();
    });
  });

  test("displays error message for missing email", async () => {
    render(
      <BrowserRouter>
        <EmailValidation />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /verify/i }));
    await waitFor(() => {
      expect(screen.getByText(/Email is not entered/i)).toBeInTheDocument();
    });
  });

  test("TEST1", async () => {
    const mockValidateEmail = jest.spyOn(apiUrls, "validateEmail");
    const mockResponse = { data: { message: "Success" }, status: 200 };
    mockValidateEmail.mockResolvedValueOnce(mockResponse);
    render(
      <BrowserRouter>
        <EmailValidation />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: EMAIL },
    });
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));

    await waitFor(() => {
      expect(mockValidateEmail).toHaveBeenCalled();
    });
  });

  test("TEST2", async () => {
    const mockValidateEmail = jest.spyOn(apiUrls, "validateEmail");

    const errorCode = "9999";
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: errorCode,
        },
      },
    };
    mockValidateEmail.mockRejectedValueOnce(mockErrorResponse);
    render(
      <BrowserRouter>
        <EmailValidation />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: EMAIL },
    });
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));

    await waitFor(() => {
      expect(mockValidateEmail).toHaveBeenCalled();
    });
  });
});
