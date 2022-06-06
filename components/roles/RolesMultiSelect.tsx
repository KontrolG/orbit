import Select, { Props } from "react-select";

function toSelectOption({
  id,
  name,
  description
}: {
  id: any;
  name: any;
  description: any;
}) {
  return {
    id,
    name,
    description,
    value: id,
    label: (
      <div>
        <p className="capitalize font-bold">{name}</p>
        <p className="capitalize">{description}</p>
      </div>
    )
  };
}

const toSelectValue: (value: any) => any = (option) => ({
  ...option,
  label: option.name
});

interface Role {
  id: any;
  name: any;
  description: any;
}

interface RolesMultiSelectProps extends Omit<Props<Role>, "options"> {
  roles: Role[];
}

function RolesMultiSelect({
  roles,
  onChange,
  ...selectProps
}: RolesMultiSelectProps) {
  function mapOptionsBeforeChange(options, actionMeta) {
    return onChange(
      Array.isArray(options)
        ? options.map(toSelectValue)
        : toSelectValue(options),
      actionMeta
    );
  }

  return (
    <Select
      {...selectProps}
      options={roles.map(toSelectOption)}
      onChange={mapOptionsBeforeChange}
      placeholder={selectProps.isMulti ? "Select Roles" : "Select Role"}
      noOptionsMessage={() => "No Roles available"}
    />
  );
}

export default RolesMultiSelect;
