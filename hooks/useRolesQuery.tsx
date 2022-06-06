import { useQuery, UseQueryOptions } from "react-query";
import { returnData } from "../util";
import { apiClient } from "../util/fetch";

function useRolesQuery(options: UseQueryOptions) {
  return useQuery(
    "roles",
    () => apiClient.get("/roles").then(returnData),
    options
  );
}

export default useRolesQuery;
