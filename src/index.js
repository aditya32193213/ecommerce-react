/**
 * =========================================================
 * File: index.js
 * ---------------------------------------------------------
 * Purpose:
 * Application entry point.
 *
 * Responsibilities:
 * - Create React root
 * - Provide Redux store to the app
 * - Enable client-side routing
 * - Mount the App component
 *
 * Notes:
 * - Uses React 18 createRoot API
 * =========================================================
 */

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import store from "./redux/store";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
