import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BackButton from "../../components/Common/BackButton";

// 🧪 Correctly mock react-router-dom for ES modules
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
  };
});

import { useNavigate, useLocation } from "react-router-dom";

describe("BackButton component", () => {
  const mockedNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockedNavigate);
  });

  it("renders the button on non-home/login pages", () => {
    useLocation.mockReturnValue({ pathname: "/product/123" });

    render(<BackButton />);
    const button = screen.getByTestId("back-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Back");
  });

  it("does not render the button on '/' (homepage)", () => {
    useLocation.mockReturnValue({ pathname: "/" });

    render(<BackButton />);
    const wrapper = screen.getByTestId("back-button-wrapper");
    expect(wrapper).toHaveClass("hidden");
  });

  it("does not render the button on '/login'", () => {
    useLocation.mockReturnValue({ pathname: "/login" });

    render(<BackButton />);
    const wrapper = screen.getByTestId("back-button-wrapper");
    expect(wrapper).toHaveClass("hidden");
  });

  it("navigates back on button click", () => {
    useLocation.mockReturnValue({ pathname: "/product/123" });

    render(<BackButton />);
    const button = screen.getByTestId("back-button");
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});
