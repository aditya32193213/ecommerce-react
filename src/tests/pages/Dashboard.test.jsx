import { render, screen } from "@testing-library/react";
import Dashboard from "../../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";

describe("Dashboard component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  });

  it("renders the dashboard container", () => {
    const container = screen.getByTestId("dashboard-page");
    expect(container).toBeInTheDocument();
  });

  it("displays the dashboard title correctly", () => {
    const title = screen.getByTestId("dashboard-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Welcome to the Dashboard");
  });

  it("displays the dashboard subtitle correctly", () => {
    const subtitle = screen.getByTestId("dashboard-subtitle");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent("You're successfully logged in 🎉");
  });
});
