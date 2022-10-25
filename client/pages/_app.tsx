import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Navbar from "components/layout/Navbar";
import "styles/app.scss";
import PrivateRoute from "utils/privateRoute";

const queryClient = new QueryClient();

function App({ Component, pageProps }: any) {
  const [hasLoaded, setHasLoaded] = useState(false);

  // For per-page layouts
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navbar setHasLoaded={setHasLoaded} hasLoaded={hasLoaded} />
        <PrivateRoute hasLoaded={hasLoaded}>
          {hasLoaded && getLayout(<Component {...pageProps} />)}
        </PrivateRoute>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
