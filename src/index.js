import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { LocalizeProvider } from "react-localize-redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import store from "./store";

import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

const App = React.lazy(() => import("./App"));

ReactDOM.render(
  <Provider store={store}>
    <LocalizeProvider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={""}>
              <App />
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </LocalizeProvider>
  </Provider>,
  document.getElementById("root")
);

