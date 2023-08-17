import React, { useRef } from "react";
import { Select, Tag } from "antd";
const { Option } = Select;

const SelectDropdown = ({
  title,
  name,
  value,
  setValue,
  mode,
  placeholder,
  defaultValue,
  disabledSet,
  loader,
  customClass,
  data,
}) => {
  const disableSet = new Set(disabledSet);
  const selectRef = useRef();

  const handleChange = (value) => {
    const notEmptyValues = value?.length > 0 && value?.includes("all");

    if (notEmptyValues) {
      if (value?.length > 1 && value[0] === "all") {
        value?.splice(0, 1);
        setValue(value, name);
      } else {
        setValue(["all"], name);
        if (selectRef.current) {
          selectRef.current.blur();
        }
      }
    } else {
      setValue(value, name);
    }
  };

  return (
    <div className="flex flex-col w-full" id="dateFilter">
      {title && <label className="ml-1 montserrat mb-1">{title}</label>}
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
              className="flex items-center rounded-lg flex-row py-0.5 px-2 bg-[#c4f1d933] text-[#00FFB4] border-none"
              style={{
                margin: "5px 4px",
                fontWeight: "500",
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
        ref={selectRef} // Attach the ref to the Select component
      >
        {data?.map((item, key) => {
          return (
            <Option
              key={key}
              value={item?.value}
              // disabled={value?.length > 0 && ((value?.includes('All') && item?.value !== 'All') || (!value?.includes('All') && item?.value === 'All'))}
              title={title ? title : ""}
              className=""
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
