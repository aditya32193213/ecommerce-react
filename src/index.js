/**
 * ============================================================
 * File: index.js
 * Purpose: Entry point of the React application
 * ============================================================
 *
 * Responsibilities:
 * - Initialize React app and mount it to the DOM
 * - Provide global state management using Redux Provider
 * - Wrap the app with React Router (HashRouter for routing)
 * - Import global styles and third-party libraries (AOS, etc.)
 *
 * ============================================================
 */

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";

import App from "./App";
import store from "./redux/store";

import "./index.css";
import "aos/dist/aos.css";

/**
 * ============================================================
 *  Root Render
 * ============================================================
 * - Creates a React root at `#root`
 * - Wraps <App /> with:
 *    - Redux <Provider> for global state
 *    - React Router <Router> for client-side navigation
 */
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
