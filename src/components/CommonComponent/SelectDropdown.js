import { Select, Tag } from "antd";
import React from "react";
const { Option } = Select;

const SelectDropdown = ({
  title,
  name,
  value,
  setValue,
  width,
  mode,
  placeholder,
  defaultValue,
  disabledSet,
  loader,
  customClass,
  data,
}) => {
  const disableSet = new Set(disabledSet);

  const handleChange = (value) => {
    const empty = value?.length > 0 && value?.includes("all");
    if (empty) {
      if (value?.length > 1 && value[0] === "all") {
        value?.splice(0, 1);
        setValue(value, name);
      } else {
        setValue(["all"], name);
      }
    } else {
      setValue(value, name);
    }
  };

  return (
    <div className="flex flex-col w-full" id="dateFilter">
      <label className="ml-1 montserrat mb-1">{title}</label>
      <Select
        defaultValue={defaultValue}
        value={value}
        mode={mode}
        size="large"
        name={name}
        onChange={handleChange}
        placeholder={placeholder}
        loading={loader}
        tagRender={(props) => {
          const { label, closable, onClose } = props;
          return (
            <Tag
              className="flex items-center rounded-lg flex-row py-0.5 px-2 bg-[#B4D0C133] text-[#056433] border-none"
              style={{
                margin: "5px 4px",
                fontWeight: "500",
                fontFamily: "montserrat",
              }}
              closable={closable}
              onClose={onClose}
            >
              {label}
            </Tag>
          );
        }}
        className={
          customClass
            ? customClass
            : `customSelector border overflow-auto border-gray-950`
        }
      >
        {data?.map((item, key) => {
          return (
            <Option
              key={key}
              value={item?.value}
              // disabled={value?.length > 0 && ((value?.includes('All') && item?.value !== 'All') || (!value?.includes('All') && item?.value === 'All'))}
              title={"location"}
              className="font-[montserrat]"
              disabled={disableSet.has(item?.value)}
            >
              {item.name}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default SelectDropdown;
