import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { useSetAuthToken, useLogout } from "operations/auth";
import { useGetMe } from "operations/user";
import { AuthToken } from "types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import styles from "styles/modules/Navbar.module.scss";
import initializeAxios from "utils/axiosConfig";
import useInterval from "hooks/useInterval";

const GuestLayout: FC<{ asPath: string }> = ({ asPath }) => {
  return (
    <>
      <div></div>
      <ul>
        <li className={`login-link${asPath === "/login" ? " selected" : ""}`}>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </li>
        <li
          className={`register-link${
            asPath === "/register" ? " selected" : ""
          }`}
        >
          <Link href="/register">
            <a>Register</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

const AuthLayout: FC<{ asPath: string }> = ({ asPath }) => {
  const { mutate } = useLogout();
  const { data } = useGetMe();

  return data ? (
    <>
      <h3>{data?.name}</h3>
      <ul>
        <li className={`home-link${asPath === "/" ? " selected" : ""}`}>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li className={`account-link${asPath === "/" ? " selected" : ""}`}>
          <Link href="/account">
            <a>Account</a>
          </Link>
        </li>
        <li className={`logout-link`} onClick={() => mutate()}>
          <a>Logout</a>
        </li>
      </ul>
    </>
  ) : null;
};

interface IProps {
  hasLoaded: boolean;
  setHasLoaded: (hasLoaded: boolean) => void;
}

const Navbar: FC<IProps> = ({ hasLoaded, setHasLoaded }) => {
  const { asPath } = useRouter();
  const { mutate, isSuccess, isError } = useSetAuthToken();
  const queryClient = useQueryClient();
  const authToken = queryClient.getQueryData<AuthToken>(["authToken"]);
  initializeAxios(authToken?.authorization);

  useEffect(() => {
    mutate();
  }, []);

  useInterval(() => {
    mutate();
    // default value is 1h or 3600000ms for idToken in cognito.
  }, authToken?.expiration ?? 3600000);

  useEffect(() => {
    (isSuccess || isError) && setHasLoaded(true);
  }, [isSuccess, isError, setHasLoaded]);

  return (
    <div className={styles.navbar}>
      <div className="container">
        {hasLoaded && (
          <>
            {authToken?.authorization ? (
              <AuthLayout asPath={asPath} />
            ) : (
              <GuestLayout asPath={asPath} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
