import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoProvider from "context/todoContext";
import Navbar from "components/layout/Navbar";
import "styles/app.scss";
import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";
import Head from "next/head";

// create a function that called refreshToken that returns a new accessToken
// save that new accessToken in globalState
// create some functionality that will run the accessToken when currentDate is more than expiration
const authorization =
  "eyJraWQiOiIrcGZzM3dhcHJrT25JS1wvRnl3MXhZOUJvaVFRSUpQKytvcGowRWtKVndcL2s9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJlMWZkYzhhNS1kMzQyLTQ1MDMtYTE3YS01ZTViMzRmNWMxOGQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfdWZsYVBlSlhCIiwiY29nbml0bzp1c2VybmFtZSI6IjA3MTI0YTQ5LWNkYjMtNDg2MC1iZTliLTU5ZDg2YzUzMjgyYiIsIm9yaWdpbl9qdGkiOiIxYWYwN2I5Ni1kNTM5LTQzNGMtYTQxNy0wNGM4YmU1NmVkMTkiLCJhdWQiOiIxazR0bGh0ODBuNGR0dmdnb21yMmFnMzBpMyIsImV2ZW50X2lkIjoiYTkxYTQ0YTQtMGZjOS00NDQyLTliOGItN2VmMzQ4NDY0ZGU0IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NjYzNTIyNDksImV4cCI6MTY2NjM1NTg0OSwiaWF0IjoxNjY2MzUyMjQ5LCJqdGkiOiI5MmIzYTcxNS0xNzEwLTQ0ZDAtYTFmYS03OTk2YjgzYTkyNjciLCJlbWFpbCI6InNhbUBnbWFpbC5jb20ifQ.m1galkOZRiiXK2eQHk8bThGbAIxF9lkTlydhI-k6Jk2ykYnOM6oU9hFZtHltxcKwxDkp7egoDIc3mko-rJ58M62bUHF4mgSddCz3bMNp3QFy5TavSKs-jklYFBqeJ8HZ8mY5KpM-ehNQRrQljtSBI1eFNKqKjKci20ixircw56djioKGSi7nvZ2kh0YnqLGwn2Ur8tHAuErKfqIksBXMlJufLPVSzLq_jptfkH53g-sb7nVbi-9HJFfwCRXIalm51Yry6k-mhTgRZT9JS4aRjHbHmdpnsCQibN8I8suarr8HO9DhuLpIyr2PxUM2hVenY0paFLI0itNp4yqLHB5BFQ";

function App({ Component, pageProps }: AppProps) {
  axios.defaults.headers.common["authorization"] = authorization;
  const queryClient = new QueryClient();

  const guestPost = async () => {
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}auth/guestPost`,
    );

    console.log(result);
  };

  const authPost = async () => {
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}auth/authPost`,
      undefined,
      {
        withCredentials: true,
      },
    );

    console.log(result);
  };

  const refreshTokens = async () => {
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}auth/refresh`,
      null,
      {
        withCredentials: true,
      },
    );

    console.log(result);
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <button onClick={guestPost} style={{ marginRight: 24 }}>
          Guest Post
        </button>
        <button onClick={authPost} style={{ marginRight: 24 }}>
          Auth Post
        </button>
        <button onClick={refreshTokens}>Refresh Token</button>
        <TodoProvider>
          <Navbar />
          <Component {...pageProps} />
        </TodoProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
