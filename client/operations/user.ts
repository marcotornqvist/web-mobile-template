import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateEmailVariables, UpdatePasswordVariables, User } from "types";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

// Get all todos
export const useGetMe = () => {
  const getMe = async (): Promise<User> => {
    const result = await axios.get("users/me", {
      withCredentials: true,
    });

    return result.data;
  };

  return useQuery(["me"], getMe, {
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });
};

// Update email
export const useUpdateEmail = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ email, password }: UpdateEmailVariables) =>
      axios.patch(
        `users/update-email`,
        { email, password },
        { withCredentials: true },
      ),
    {
      onSuccess: (result) => {
        queryClient.setQueryData<User>(["me"], () => result.data);
        toast.success("Email updated successfully.");
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

// Update password
export const useUpdatePassword = () => {
  return useMutation(
    ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: UpdatePasswordVariables) =>
      axios.patch(
        `users/update-password`,
        { currentPassword, newPassword, confirmPassword },
        { withCredentials: true },
      ),
    {
      onSuccess: () => {
        toast.success("Password updated successfully.");
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

// Delete account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    (password: string) =>
      axios.delete(`users/delete-me`, {
        withCredentials: true,
        data: {
          password,
        },
      }),
    {
      onSuccess: () => {
        queryClient.clear();
        toast.success("Account was deleted successfully.");
        router.push("/login");
      },
      onError: (error: any) => {
        if (error?.response?.data?.formErrors?.password) {
          toast.error(error.response.data.formErrors.password);
        } else {
          toast.error(error?.response?.data?.message);
        }
      },
    },
  );
};

// Validate email
export const useValidateEmail = () => {
  return useMutation(
    (email: string) =>
      axios.post(`users/validate-email`, { email }, { withCredentials: true }),
    {
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
