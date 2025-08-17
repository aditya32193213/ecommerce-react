/**
 * ============================================================
 * File: WhatWeBelieve.test.jsx
 * Purpose: Unit tests for WhatWeBelieve component
 * ============================================================
 *
 * These tests validate the following:
 * - The main section container is rendered.
 * - Grid layout for policies is present.
 * - Exactly 3 policy items are rendered.
 * - Each policy has the correct title and description.
 *
 * ============================================================
 */

import { render, screen, within } from "@testing-library/react";
import WhatWeBelieve from "../../components/sections/whatwebelieve";

describe("WhatWeBelieve Component", () => {
  //  Test: Section container renders
  test("renders section container", () => {
    render(<WhatWeBelieve />);
    expect(screen.getByTestId("what-we-believe-section")).toBeInTheDocument(); // Main section exists
  });

  //  Test: Grid layout is present
  test("renders grid layout", () => {
    render(<WhatWeBelieve />);
    expect(screen.getByTestId("policy-grid")).toBeInTheDocument(); //  Grid wrapper exists
  });

  //  Test: All 3 policies render
  test("renders all 3 policies", () => {
    render(<WhatWeBelieve />);
    expect(screen.getByTestId("policy-item-0")).toBeInTheDocument(); //  Policy 1
    expect(screen.getByTestId("policy-item-1")).toBeInTheDocument(); //  Policy 2
    expect(screen.getByTestId("policy-item-2")).toBeInTheDocument(); //  Policy 3
  });

  //  Test: Policies have correct titles & descriptions
  test("contains correct policy titles and descriptions", () => {
    render(<WhatWeBelieve />);

    //  Validate Policy 1
    const item0 = within(screen.getByTestId("policy-item-0"));
    expect(item0.getByTestId("policy-title")).toHaveTextContent("Free Shipping");
    expect(item0.getByTestId("policy-desc")).toHaveTextContent(/orders above/i);

    //  Validate Policy 2
    const item1 = within(screen.getByTestId("policy-item-1"));
    expect(item1.getByTestId("policy-title")).toHaveTextContent("Free Returns");
    expect(item1.getByTestId("policy-desc")).toHaveTextContent(/7-day return/i);

    //  Validate Policy 3
    const item2 = within(screen.getByTestId("policy-item-2"));
    expect(item2.getByTestId("policy-title")).toHaveTextContent("24/7 Support");
    expect(item2.getByTestId("policy-desc")).toHaveTextContent(/anytime you need/i);
  });
});
