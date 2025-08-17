/**
 * ============================================================
 * File: useDebounce.test.jsx
 * Purpose: Unit tests for the custom useDebounce hook
 * ============================================================
 *
 * These tests validate the following:
 * - The debounced value should only update after 500ms.
 * - Before 500ms, the debounced value should remain unchanged.
 *
 * ============================================================
 */

import { render, screen, act } from "@testing-library/react";
import useDebounce from "../../hooks/useDebounce";
import "@testing-library/jest-dom";

jest.useFakeTimers(); //  Mock timers to control debounce delay

//  Test Component to consume the hook
const DebounceTestComponent = ({ inputValue }) => {
  const debouncedValue = useDebounce(inputValue, 500);
  return <p data-testid="debounced">{debouncedValue}</p>;
};

describe("useDebounce hook", () => {
  //  Test: Debounced value updates only after 500ms
  it("should debounce the input value by 500ms", () => {
    let inputVal = "";

    //  Initial render with empty value
    const { rerender } = render(<DebounceTestComponent inputValue={inputVal} />);

    //  Update input value to "Hello"
    inputVal = "Hello";
    rerender(<DebounceTestComponent inputValue={inputVal} />);

    const output = screen.getByTestId("debounced");

    // ⏱ Before 500ms -> still empty
    expect(output).toHaveTextContent("");

    //  Advance timers by 500ms to trigger debounce update
    act(() => {
      jest.advanceTimersByTime(500);
    });

    //  Re-render after debounce delay
    rerender(<DebounceTestComponent inputValue={inputVal} />);

    //  Now debounced value should be updated
    expect(output).toHaveTextContent("Hello");
  });
});
