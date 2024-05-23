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
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Index = lazy(() => import("./pages/index/page"));
const Login = lazy(() => import("./pages/login/page"));
const Register = lazy(() => import("./pages/register/page"));
const Discover = lazy(() => import("./pages/discover/page"));
const UserProfile = lazy(() => import("./pages/user/[username]/page"));
const Me = lazy(() => import("./pages/me/page"));
const Create = lazy(() => import("./pages/create/page"));
const Quiz = lazy(() => import("./pages/quiz/[quizid]/page"));
const Play = lazy(() => import("./pages/play/[id]/page"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <ErrorBoundary fallback={<></>}>
        <Suspense fallback={<></>}>
          <BrowserRouter>
            <Header />
            <ToastContainer
              position="top-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
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
              <Route
                path="/signup"
                element={
                  <Page title="QuizAPP - Registrace">
                    <Register />
                  </Page>
                }
              ></Route>
              <Route
                path="/discover"
                element={
                  <Page title="QuizAPP - Procházet kvízy">
                    <Discover />
                  </Page>
                }
              ></Route>
              <Route
                path="/quiz/:id"
                element={
                  <Page title="QuizAPP - Kvíz">
                    <Quiz />
                  </Page>
                }
              ></Route>
              <Route
                path="/user/:username"
                element={
                  <Page title="QuizAPP - Uživatel">
                    <UserProfile />
                  </Page>
                }
              ></Route>
              <Route
                path="/me"
                element={
                  <Page title="QuizAPP - Uživatel">
                    <Me />
                  </Page>
                }
              ></Route>
              <Route
                path="/create"
                element={
                  <Page title="QuizAPP - Vytvořit kvíz">
                    <Create />
                  </Page>
                }
              ></Route>
              <Route
                path="/play/:id"
                element={
                  <Page title="QuizAPP - Hra">
                    <Play />
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
