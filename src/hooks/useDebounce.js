/**
 * useDebounce Hook
 * -----------------
 * File: useDebounce.js
 * Purpose:Custom React hook that delays updating a value until after
 *          a specified delay period has passed.
 *
 * Features:
 *  - Prevents unnecessary re-renders and API calls when user is typing
 *  - Accepts any value and applies a debounce delay (default: 300ms)
 *  - Returns the debounced value that updates only after the delay
 *
 * Example usage:
 *  const debouncedSearch = useDebounce(searchInput, 500);
 *  // API request only fires after 500ms of no typing
 */

import { useEffect, useState } from "react";

const useDebounce = (value, delay = 300) => {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer that updates debouncedValue after the given delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    //  Cleanup function: clears timer if value/delay changes before completion
    return () => clearTimeout(timer);
  }, [value, delay]); // Re-run effect when value or delay changes

  //  Return the debounced value to the component
  return debouncedValue;
};

export default useDebounce; // Export custom hook for reuse