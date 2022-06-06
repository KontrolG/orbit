import { useMutation, UseMutationOptions } from "react-query";
import { returnData } from "../util";
import { apiClient } from "../util/fetch";

interface TVariables {
  userId: string;
  newRoles: string[];
}

function useAddRolesToUserMutation(
  options?: UseMutationOptions<unknown, unknown, TVariables>
) {
  const { mutate, mutateAsync, ...rest } = useMutation(
    ({ userId, newRoles }) =>
      apiClient
        .post(`/users/${userId}/roles`, {
          roles: newRoles
        })
        .then(returnData),
    { mutationKey: "user-roles", ...options }
  );

  return {
    addRolesToUser: mutate,
    addRolesToUserAsync: mutateAsync,
    ...rest
  };
}

export default useAddRolesToUserMutation;
