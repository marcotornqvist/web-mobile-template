import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export function ErrorFallback({ error }: any) {
  useEffect(() => {
    toast.error(error.response.data.message);
  }, [error]);

  return <Toaster position="bottom-right" reverseOrder={false} />;
}

// export function ErrorFallback({ error, resetErrorBoundary }: any) {
//   console.log(error.response.data.message);
//   return (
//     <div role="alert">
//       <p>Something went wrong:</p>
//       <pre>{error.response.data.message}</pre>
//       <button onClick={resetErrorBoundary}>Try again</button>
//     </div>
//   );
// }
