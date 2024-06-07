import { Routes, Route } from "react-router-dom";
import Page from "./components/page/Page";
import { lazy } from "react";

// Pages
const Index = lazy(() => import("./pages/index/page"));
const Login = lazy(() => import("./pages/login/page"));
const Register = lazy(() => import("./pages/register/page"));
const Discover = lazy(() => import("./pages/discover/page"));
const UserProfile = lazy(() => import("./pages/user/[username]/page"));
const Me = lazy(() => import("./pages/me/page"));
const Create = lazy(() => import("./pages/create/page"));
const Quiz = lazy(() => import("./pages/quiz/[quizid]/page"));
const Play = lazy(() => import("./pages/play/[id]/page"));
const Search = lazy(() => import("./pages/search/[string]/page"));
const ChangePassword = lazy(() => import("./pages/me/changePassword/page"));
const Share = lazy(() => import("./pages/answer/share/[id]/page"));
const NotFound = lazy(() => import("./pages/404/page"))

export default function RoutesComponent() {
  return (
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
        path="/discover/page/:pagenumber"
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
        path="/me/changePassword"
        element={
          <Page title="QuizAPP - Změna hesla">
            <ChangePassword />
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
      <Route
        path="/search"
        element={
          <Page title="QuizAPP - Vyhledávání">
            <Search />
          </Page>
        }
      ></Route>
      <Route
        path="/search/:string"
        element={
          <Page title="QuizAPP - Vyhledávání">
            <Search />
          </Page>
        }
      ></Route>
      <Route
        path="/answer/share/:id"
        element={
          <Page title="QuizAPP - Odpověď">
            <Share />
          </Page>
        }
      ></Route>

      {/* 404 */}
      <Route
        path="/*"
        element={<Page title="QuizAPP - Nenalezeno">
          <NotFound />
        </Page>}
      ></Route>
    </Routes>
  );
}
