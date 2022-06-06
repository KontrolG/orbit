import { useState } from "react";
import Modal, { ModalProps } from "./common/Modal";
import RolesMultiSelect from "./roles/RolesMultiSelect";
import useUserRolesQuery from "../hooks/useUserRolesQuery";
import useRolesQuery from "../hooks/useRolesQuery";
import useAddRolesToUserMutation from "@/hooks/useAddRolesToUserMutation";

function getAvailableRolesForUser(userRoles, allRoles) {
  return allRoles?.filter?.(
    (role) => !userRoles?.find?.((userRole) => userRole.id === role.id)
  );
}

const toRoleId = ({ id }) => id;

interface AssignRolesModalProps extends Omit<ModalProps, "title" | "children"> {
  userId: string;
}

function AssignRolesModal({ userId, ...popupProps }: AssignRolesModalProps) {
  const [selectValue, setSelectValue] = useState([]);
  const [didOpen, setDidOpen] = useState(false);
  const userRolesQuery = useUserRolesQuery(userId, { enabled: false });
  const rolesQuery = useRolesQuery({
    enabled: false
  });
  const { addRolesToUserAsync, isLoading: isAddingRoles } =
    useAddRolesToUserMutation();

  function fetchQueries() {
    if (didOpen) return;
    setDidOpen(true);
    userRolesQuery.refetch();
    rolesQuery.refetch();
  }

  const isFetched = userRolesQuery.isFetched && rolesQuery.isFetched;

  function changeSelectValue(options) {
    return setSelectValue(options);
  }

  return (
    <Modal title="Assign Roles" {...popupProps} onOpen={fetchQueries} nested>
      {(closeModal) => (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (isAddingRoles) return;
            await addRolesToUserAsync({
              userId,
              newRoles: selectValue?.map?.(toRoleId)
            });
            closeModal();
          }}
        >
          {isFetched && !isAddingRoles ? (
            <>
              <div>
                <p className="text-sm mb-6">
                  Select roles to assign to this user. You may assign up to 50
                  roles per user.
                </p>
                <RolesMultiSelect
                  isClearable
                  isMulti
                  value={selectValue}
                  onChange={changeSelectValue}
                  roles={getAvailableRolesForUser(
                    (userRolesQuery.data as any)?.roles,
                    (rolesQuery.data as any)?.roles
                  )}
                />
              </div>
              <div className="pt-6 pb-10 flex justify-end space-x-2">
                <button
                  className="rounded-full flex bg-gradient text-gray-100 shadow-lg px-4 py-2"
                  type="submit"
                  disabled={isAddingRoles || selectValue?.length < 1}
                >
                  Assign
                </button>
              </div>
            </>
          ) : (
            <div className="pt-6 pb-10">Loading...</div>
          )}
        </form>
      )}
    </Modal>
  );
}

export default AssignRolesModal;
