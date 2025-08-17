/**
 * ============================================================
 * File: Dashboard.test.jsx
 * Purpose: Unit tests for the Dashboard page component
 * ============================================================
 *
 * These tests validate the following:
 * - Dashboard page container renders correctly.
 * - Dashboard title is displayed properly.
 * - Dashboard subtitle is displayed properly.
 *
 * ============================================================
 */

import { render, screen } from "@testing-library/react";
import Dashboard from "../../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";

describe("Dashboard Page", () => {
  //  Setup before each test
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  });

  //  Test: Renders the dashboard container
  it("renders the dashboard container", () => {
    const container = screen.getByTestId("dashboard-page");
    expect(container).toBeInTheDocument();
  });

  //  Test: Displays the dashboard title
  it("displays the dashboard title correctly", () => {
    const title = screen.getByTestId("dashboard-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Welcome to the Dashboard");
  });

  //  Test: Displays the dashboard subtitle
  it("displays the dashboard subtitle correctly", () => {
    const subtitle = screen.getByTestId("dashboard-subtitle");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent("You're successfully logged in 🎉");
  });
});