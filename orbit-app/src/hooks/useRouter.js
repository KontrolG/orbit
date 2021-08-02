import { useHistory } from "react-router-dom";

function useRouter() {
  const history = useHistory();
  return history;
}

export { useRouter };
