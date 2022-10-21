import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC } from "react";
import { useLogout } from "operations/auth";
import { User } from "types";
import Link from "next/link";
import styles from "styles/modules/Navbar.module.scss";
import { fetcher, refreshTokens } from "utils/fetcher";
import axios from "axios";

const Navbar: FC = () => {
  const { asPath } = useRouter();
  const { mutate } = useLogout();
  const { data, isLoading, error } = useQuery<User>(["me"]);

  return (
    <div className={styles.navbar}>
      <div className="container">
        <h3>{data?.id}</h3>
        <ul>
          <li className={`home-link${asPath === "/" ? " selected" : ""}`}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
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
          <li className={`logout-link`} onClick={() => mutate()}>
            <a>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
