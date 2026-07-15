import React from "react";
import ReactDOM from "react-dom/client";
import AuthGate from "./AuthGate";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "./app/redux/store";
import "@fortawesome/fontawesome-free/css/all.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthGate />
    </Provider>
  </React.StrictMode>
);