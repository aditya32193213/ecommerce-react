/**
 * ============================================================
 * File: GlobalLoader.test.jsx
 * Purpose: Unit tests for GlobalLoader component
 * ============================================================
 *
 * These tests validate the following:
 * - GlobalLoader renders nothing when globalLoading is false.
 * - GlobalLoader renders the loader and ClipLoader spinner
 *   when globalLoading is true.
 *
 * ============================================================
 */

import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import GlobalLoader from "../../components/common/GlobalLoader";

const mockStore = configureStore([]);

describe("GlobalLoader Component", () => {
  //  Test: Does not render loader when globalLoading is false
  it("renders nothing when globalLoading is false", () => {
    const store = mockStore({ app: { globalLoading: false } });

    const { queryByTestId } = render(
      <Provider store={store}>
        <GlobalLoader />
      </Provider>
    );

    expect(queryByTestId("global-loader")).toBeNull(); //  Loader should not be present
  });

  //  Test: Renders loader and spinner when globalLoading is true
  it("renders loader when globalLoading is true", () => {
    const store = mockStore({ app: { globalLoading: true } });

    const { getByTestId } = render(
      <Provider store={store}>
        <GlobalLoader />
      </Provider>
    );

    expect(getByTestId("global-loader")).toBeInTheDocument(); //  Loader wrapper
    expect(getByTestId("clip-loader")).toBeInTheDocument();   //  Spinner must be visible
  });
});