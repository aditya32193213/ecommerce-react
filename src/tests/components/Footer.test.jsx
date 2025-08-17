/**
 * ============================================================
 * File: Footer.test.jsx
 * Purpose: Unit tests for Footer component
 * ============================================================
 *
 * These tests validate the following:
 * - Renders the main footer wrapper.
 * - Displays logo, social icons, quick links, and contact info.
 * - Shows payment method icons and newsletter subscription form.
 * - Displays correct copyright.
 *
 * ============================================================
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../../components/layout/Footer";

describe("Footer Component", () => {
  //  Setup: Render Footer before each test
  beforeEach(() => {
    render(<Footer />);
  });

  //  Test: Renders the main footer wrapper
  it("renders the main footer element", () => {
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  //  Test: Renders the company logo
  it("renders company logo", () => {
    expect(screen.getByTestId("footer-logo")).toBeInTheDocument();
  });

  //  Test: Renders social media icons
  it("renders social media icons", () => {
    expect(
      screen.getByTestId("footer-social-icons").children.length
    ).toBeGreaterThanOrEqual(3); //  At least 3 social icons
  });

  //  Test: Renders quick links section
  it("renders quick links section", () => {
    expect(screen.getByTestId("footer-quick-links")).toBeInTheDocument();
  });

  //  Test: Renders contact information
  it("renders contact information", () => {
    expect(screen.getByTestId("footer-contact-info")).toBeInTheDocument();
    expect(screen.getByText(/support@shopnetic\.com/i)).toBeInTheDocument(); // ✅ Email must be present
  });

  //  Test: Renders payment method icons
  it("renders payment method icons", () => {
    expect(
      screen.getByTestId("footer-payment-icons").children.length
    ).toBeGreaterThanOrEqual(4); // At least 4 payment icons
  });

  //  Test: Renders newsletter subscription form
  it("renders newsletter form with input and button", () => {
    expect(screen.getByTestId("footer-email-input")).toBeInTheDocument();
    expect(screen.getByTestId("footer-subscribe-button")).toBeInTheDocument();
  });

  //  Test: Renders footer bottom text
  it("renders footer bottom copyright", () => {
    expect(screen.getByTestId("footer-bottom")).toHaveTextContent(
      `© ${new Date().getFullYear()} Shopnetic. All rights reserved.`
    );
  });
});
