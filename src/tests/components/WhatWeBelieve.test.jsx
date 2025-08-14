import { render, screen, within } from "@testing-library/react";
import WhatWeBelieve from "../../components/WhatWeBelieve";

describe("WhatWeBelieve Component", () => {
  test("renders section container", () => {
    render(<WhatWeBelieve />);
    expect(screen.getByTestId("what-we-believe-section")).toBeInTheDocument();
  });

  test("renders grid layout", () => {
    render(<WhatWeBelieve />);
    expect(screen.getByTestId("policy-grid")).toBeInTheDocument();
  });

  test("renders all 3 policies", () => {
    render(<WhatWeBelieve />);
    expect(screen.getByTestId("policy-item-0")).toBeInTheDocument();
    expect(screen.getByTestId("policy-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("policy-item-2")).toBeInTheDocument();
  });

  test("contains correct policy titles and descriptions", () => {
    render(<WhatWeBelieve />);

    const item0 = within(screen.getByTestId("policy-item-0"));
    expect(item0.getByTestId("policy-title")).toHaveTextContent("Free Shipping");
    expect(item0.getByTestId("policy-desc")).toHaveTextContent(/orders above/i);

    const item1 = within(screen.getByTestId("policy-item-1"));
    expect(item1.getByTestId("policy-title")).toHaveTextContent("Free Returns");
    expect(item1.getByTestId("policy-desc")).toHaveTextContent(/7-day return/i);

    const item2 = within(screen.getByTestId("policy-item-2"));
    expect(item2.getByTestId("policy-title")).toHaveTextContent("24/7 Support");
    expect(item2.getByTestId("policy-desc")).toHaveTextContent(/anytime you need/i);
  });
});
