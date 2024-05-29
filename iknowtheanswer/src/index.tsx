import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routing/router";
import { ChakraProvider } from "@chakra-ui/react";
import { themeClass } from "./themes/theme.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <div className={themeClass} style={{ height: "100%" }}>
          <RouterProvider router={router} />
        </div>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
