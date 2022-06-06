import { useQuery, UseQueryOptions } from "react-query";
import { returnData } from "../util";
import { apiClient } from "../util/fetch";

function useUserRolesQuery(userId: string, options?: UseQueryOptions) {
  return useQuery(
    ["user-roles", userId],
    ({ queryKey: [_key, userId] }) =>
      apiClient.get(`/users/${userId}/roles`).then(returnData),
    options
  );
}

export default useUserRolesQuery;
