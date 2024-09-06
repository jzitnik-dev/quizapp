// Libraries
import { ToastContainer } from "react-toastify";
import { Box, Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

// Styles
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

// Components
import ErrorBoundary from "./components/errorboundary/ErrorBoundary";
import Error from "./components/error/Error";
import Loading from "./components/loading/Loading";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { UserProfileProvider } from "./components/header/UserProfileProvider";
import RoutesComponent from "./Routes";
import ScrollToTop from "./utils/ScrollToTop";
import LocalizationProvider from "./localization/Localization";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <Theme appearance="dark">
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <BrowserRouter>
            <ScrollToTop />
            <UserProfileProvider>
              <QueryClientProvider client={queryClient}>
                <LocalizationProvider>
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
                  <Box style={{ paddingTop: "55px" }}>
                    <RoutesComponent />
                  </Box>
                  <Footer />
                </LocalizationProvider>
              </QueryClientProvider>
            </UserProfileProvider>
          </BrowserRouter>
        </Suspense>
      </ErrorBoundary>
    </Theme>
  );
}
