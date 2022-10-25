// export {};
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { AuthToken } from "types";

interface IProps {
  hasLoaded: boolean;
  children: any;
}

export default function PrivateRoute({ hasLoaded, children }: IProps) {
  const queryClient = useQueryClient();
  const authorization = queryClient.getQueryData<AuthToken>([
    "authToken",
  ])?.authorization;

  const router = useRouter();

  // These routes are only accessible when not authenticated (guest)
  const guestRoutes = ["/register", "/login"];

  // These routes are only accessible when authenticated
  const authRoutes = ["/"];

  const firstPath = router.pathname.split("/")[1];
  const guestIsProtected = guestRoutes.indexOf("/" + firstPath) !== -1;
  const authIsProtected = authRoutes.indexOf("/" + firstPath) !== -1;

  useEffect(() => {
    if (hasLoaded && !authorization && authIsProtected) {
      router.push("/login");
    }

    if (hasLoaded && authorization && guestIsProtected) {
      router.push("/");
    }
  }, [hasLoaded, authorization, authIsProtected, guestIsProtected]);

  if (hasLoaded && !authorization && authIsProtected) {
    return null;
  }

  if (hasLoaded && authorization && guestIsProtected) {
    return null;
  }

  return children;
}
