import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import GlobalLoader from "../../components/Common/GlobalLoader";

const mockStore = configureStore([]);

describe("GlobalLoader Component", () => {
  it("renders nothing when globalLoading is false", () => {
    const store = mockStore({ app: { globalLoading: false } });

    const { queryByTestId } = render(
      <Provider store={store}>
        <GlobalLoader />
      </Provider>
    );

    expect(queryByTestId("global-loader")).toBeNull();
  });

  it("renders loader when globalLoading is true", () => {
    const store = mockStore({ app: { globalLoading: true } });

    const { getByTestId } = render(
      <Provider store={store}>
        <GlobalLoader />
      </Provider>
    );

    expect(getByTestId("global-loader")).toBeInTheDocument();
    expect(getByTestId("clip-loader")).toBeInTheDocument();
  });
});
