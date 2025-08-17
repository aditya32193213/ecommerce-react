/**
 * ============================================================
 * File: BackButton.test.jsx
 * Purpose: Unit tests for BackButton component
 * ============================================================
 *
 * These tests validate the following:
 * - Renders correctly on routes other than "/" and "/login".
 * - Hides the button on "/" (homepage) and "/login".
 * - Triggers navigation back when clicked.
 *
 * ============================================================
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BackButton from "../../components/common/BackButton";

// 🧪 Mock react-router-dom to control navigation + location
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: jest.fn(), // mock navigate hook
    useLocation: jest.fn(), // mock location hook
  };
});

import { useNavigate, useLocation } from "react-router-dom";

describe("BackButton component", () => {
  const mockedNavigate = jest.fn(); // mock function for navigation

  beforeEach(() => {
    jest.clearAllMocks(); // reset mocks before each test
    useNavigate.mockReturnValue(mockedNavigate); // mock navigate hook with fn
  });

  //  Test: Renders on non-home/login pages
  it("renders the button on non-home/login pages", () => {
    useLocation.mockReturnValue({ pathname: "/product/123" }); // simulate location

    render(<BackButton />);
    const button = screen.getByTestId("back-button");

    expect(button).toBeInTheDocument(); //  Button should render
    expect(button).toHaveTextContent("Back"); //  Should show 'Back' text
  });

  //  Test: Hidden on homepage
  it("does not render the button on '/' (homepage)", () => {
    useLocation.mockReturnValue({ pathname: "/" }); // simulate homepage

    render(<BackButton />);
    const wrapper = screen.getByTestId("back-button-wrapper");

    expect(wrapper).toHaveClass("hidden"); //  Should be hidden
  });

  //  Test: Hidden on login page
  it("does not render the button on '/login'", () => {
    useLocation.mockReturnValue({ pathname: "/login" }); // simulate login page

    render(<BackButton />);
    const wrapper = screen.getByTestId("back-button-wrapper");

    expect(wrapper).toHaveClass("hidden"); //  Should be hidden
  });

  //  Test: Navigation on click
  it("navigates back on button click", () => {
    useLocation.mockReturnValue({ pathname: "/product/123" }); // simulate product page

    render(<BackButton />);
    const button = screen.getByTestId("back-button");

    fireEvent.click(button); // simulate click

    expect(mockedNavigate).toHaveBeenCalledWith(-1); //  Should call navigate(-1)
  });
});