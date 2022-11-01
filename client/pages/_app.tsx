import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Navbar from "components/layout/Navbar";
import PrivateRoute from "utils/privateRoute";
import "styles/app.scss";
import React from "react";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App({ Component, pageProps }: any) {
  const [hasLoaded, setHasLoaded] = useState(false);

  // For per-page layouts
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar setHasLoaded={setHasLoaded} hasLoaded={hasLoaded} />
      <PrivateRoute hasLoaded={hasLoaded}>
        {hasLoaded && getLayout(<Component {...pageProps} />)}
      </PrivateRoute>
      <ReactQueryDevtools />
      <Toaster position="bottom-right" reverseOrder={false} />
    </QueryClientProvider>
  );
}

export default App;
