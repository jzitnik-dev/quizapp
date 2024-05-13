import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import ErrorBoundary from "./components/errorboundary/ErrorBoundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./components/page/Page";
import { lazy } from "react";
import Header from "./components/header/Header";

const Index = lazy(() => import("./pages/index/page"));
const Login = lazy(() => import("./pages/login/page"));


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <ErrorBoundary fallback={<></>}>
        <Suspense fallback={<></>}>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route
                path="/"
                element={
                  <Page title="QuizAPP - Domov">
                    <Index />
                  </Page>
                }
              ></Route>
              <Route
                path="/login"
                element={
                  <Page title="QuizAPP - Přihlásit se">
                    <Login />
                  </Page>
                }
              ></Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </Theme>
  </React.StrictMode>,
);
