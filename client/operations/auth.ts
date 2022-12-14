import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { LoginVariables, RegisterVariables } from "types";
import axios from "axios";
import toast from "react-hot-toast";

// Register user
export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ name, email, password, confirmPassword }: RegisterVariables) =>
      axios.post(
        "auth/register",
        { name, email, password, confirmPassword },
        { withCredentials: true },
      ),
    {
      onSuccess: (result) => {
        queryClient.clear();

        const time = Math.floor(Date.now() / 1000);
        const expiration = (result.data.expiration - time) * 1000 - 100000;
        queryClient.setQueryData(["authToken"], {
          authorization: result.data.authorization,
          expiration,
        });

        queryClient.setQueryData(["me"], result.data.user);
        router.push("/");
      },
      onError: (error: any) => {
        if (error?.response?.data?.formErrors) {
          error.formErrors = error.response.data.formErrors;
        } else {
          toast.error(error?.response?.data?.message);
        }
      },
    },
  );
};

// Login user
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ email, password }: LoginVariables) =>
      axios.post("auth/login", { email, password }, { withCredentials: true }),
    {
      onSuccess: (result) => {
        queryClient.clear();

        const time = Math.floor(Date.now() / 1000);
        const expiration = (result.data.expiration - time) * 1000 - 100000;
        queryClient.setQueryData(["authToken"], {
          authorization: result.data.authorization,
          expiration,
        });

        queryClient.setQueryData(["me"], result.data.user);
        router.push("/");
      },
      onError: (error: any) => {
        const errors = error?.response?.data;

        toast.error(
          errors?.message ||
            errors?.formErrors?.email ||
            errors?.formErrors?.password,
        );
      },
    },
  );
};

export const useSetAuthToken = () => {
  const queryClient = useQueryClient();

  return useMutation(
    () =>
      axios.post("auth/refreshSession", null, {
        withCredentials: true,
      }),
    {
      onSuccess: (result) => {
        const time = Math.floor(Date.now() / 1000);
        const expiration = (result.data.expiration - time) * 1000 - 100000;

        queryClient.setQueryData(["authToken"], {
          authorization: result.data.authorization,
          expiration,
        });
      },
    },
  );
};

// Logout user
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation(
    () =>
      axios.post("auth/logout", null, {
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        queryClient.clear();
        router.push("/login");
      },
      onError: (error: any) => {
        if (error?.response?.data?.formErrors) {
          error.formErrors = error?.response?.data?.formErrors;
        } else {
          toast.error(error?.response?.data?.message);
        }
      },
    },
  );
};
