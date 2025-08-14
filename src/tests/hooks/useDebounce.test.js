import { render, screen, act } from "@testing-library/react";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import '@testing-library/jest-dom';

jest.useFakeTimers();

const DebounceTestComponent = ({ inputValue }) => {
  const debouncedValue = useDebounce(inputValue, 500);
  return (
    <div>
      <p data-testid="debounced">{debouncedValue}</p>
    </div>
  );
};

describe("useDebounce hook", () => {
  it("should debounce the input value by 500ms", () => {
    let inputVal = "";
    const { rerender } = render(<DebounceTestComponent inputValue={inputVal} />);

    // Update input
    inputVal = "Hello";
    rerender(<DebounceTestComponent inputValue={inputVal} />);

    const output = screen.getByTestId("debounced");

    // Before debounce timeout, it should still show ""
    expect(output).toHaveTextContent("");

    // Advance time by 500ms to trigger debounce update
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Rerender again to reflect state changes after debounce
    rerender(<DebounceTestComponent inputValue={inputVal} />);

    // Now it should be updated
    expect(output).toHaveTextContent("Hello");
  });
});
