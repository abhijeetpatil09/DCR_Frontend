import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

let initialState = {
  entity: "",
  Attributes: "",
  name: "",
  modification: {
    Attributes: "",
    Description: "",
    Category: "",
    Sub_Category: "",
    Tech_Name: "",
  },
  tag: "",
};

const UpdateCatalog = ({ user }) => {
  const [attributeType, setAttributeType] = useState("");
  const [entityList, setEntityList] = useState([]);
  const [attributeList, setAttributeList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [updateData, setUpdateData] = useState(initialState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (attributeType === "update" || attributeType === "insert") {
      axios
        .get(`http://127.0.0.1:5000/dataexadmin`, {
          params: {
            query:
              "select distinct entity_name from DATAEXCHANGEDB.DATACATALOG.PROVIDER;",
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            const data = response?.data?.data;
            let result = data?.map((item) => item.ENTITY_NAME);
            setEntityList(result);
          } else {
            setEntityList([]);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [attributeType]);

  useEffect(() => {
    if (updateData?.entity !== "") {
      axios
        .get(`http://127.0.0.1:5000/dataexadmin`, {
          params: {
            query: `select distinct Attribute_name from DATAEXCHANGEDB.DATACATALOG.PROVIDER where entity_name = '${updateData?.entity}';`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            const data = response?.data?.data;
            let result = data?.map((item) => item.ATTRIBUTE_NAME);
            setAttributeList(result);
          } else {
            setAttributeList([]);
          }
        })
        .catch((error) => console.log(error));
    }
    console.log("updateData.Attributes", updateData.Attributes);
    if (
      updateData.entity !== "" &&
      updateData.Attributes &&
      updateData.Attributes !== ""
    ) {
      axios
        .get(`http://127.0.0.1:5000/dataexadmin`, {
          params: {
            query: `select * from DATAEXCHANGEDB.DATACATALOG.PROVIDER where entity_name = '${updateData.entity}' and Attribute_name = '${updateData.Attributes}';`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            let result = response?.data?.data[0];
            let tempObj = { ...updateData.modification };
            tempObj.Attributes = result.ATTRIBUTE_NAME;
            tempObj.Description = result.DESCRIPTION;
            tempObj.Category = result.CATEGORY;
            tempObj.Sub_Category = result.SUB_CATEGORY;
            tempObj.Tech_Name = result.TECH_NAME;
            setUpdateData({
              ...updateData,
              modification: tempObj,
            });
          }
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData.entity, updateData.Attributes]);

  useEffect(() => {
    let selected_attribute = updateData?.Attributes;
    const attr_name = updateData.modification?.Attributes;

    if (attr_name === "") {
      setError("Please enter Attribute name");
    } else if (attributeType === "update" && attr_name !== selected_attribute) {
      const index = attributeList?.filter((item) => item === attr_name);
      if (index.length > 0) {
        setError("The Attribute Name is already exist.");
      } else {
        setError(null);
      }
    } else if (attributeType === "insert") {
      const index = attributeList?.filter((item) => item === attr_name);
      if (index.length > 0) {
        setError("The Attribute Name is already exist.");
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  }, [
    attributeType,
    attributeList,
    updateData.modification.Attributes,
    updateData?.Attributes,
  ]);

  const handleChangeSelectAttributeType = (e) => {
    setAttributeType(e.target.value);
    setEntityList([]);
    setAttributeList([]);
    setUpdateData(initialState);
  };

  const onSelectChangeEntity = (e) => {
    setAttributeList([]);
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
      Attributes: "",
      tag: attributeType,
      name: user?.name,
    });
  };

  const onSelectChangeAttribute = (e) => {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  };

  const onChangehandlerUpdateData = (e) => {
    let tempObj = { ...updateData.modification };
    tempObj[e.target.name] = e.target.value;
    setUpdateData({
      ...updateData,
      modification: tempObj,
    });
  };

  const handleSubmit = () => {
    setLoader(true);
    if (error !== null) {
      return;
    }
    if (attributeType === "insert") {
      delete updateData.Attributes;
    }
    let result = JSON.stringify(updateData);
    console.log("result update before", result);
    axios
      .get(`http://127.0.0.1:5000/dataexadmin`, {
        params: {
          query: `insert into DATAEXCHANGEDB.DATACATALOG.JSON_TABLE select PARSE_JSON('${result}');`,
        },
      })
      .then((response) => {
        if (attributeType === "insert") {
          callProcedureAdd();
        } else {
          callProcedureUpdate();
        }
      })
      .catch((error) => console.log(error));
  };

  const callProcedureAdd = () => {
    axios
      .get(`http://127.0.0.1:5000/dataexadmin`, {
        params: {
          query: `call ADDATTRIBUTE();`,
        },
      })
      .then((response) => {
        toast.success("Record Added successfully");
        setLoader(false);
        setUpdateData({
          ...updateData,
          modification: {
            Attributes: "",
            Description: "",
            Category: "",
            Sub_Category: "",
            Tech_Name: "",
          },
        });
      })
      .catch((error) => console.log(error));
  };

  const callProcedureUpdate = () => {
    axios
      .get(`http://127.0.0.1:5000/dataexadmin`, {
        params: {
          query: `call UPDATECATALOG();`,
        },
      })
      .then((response) => {
        toast.success("Record Updated successfully");
        setLoader(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex flex-row  gap-3  w-full">
      <div className="flex flex-col flex-shrink h-auto">
        <div
          className=" border border-gray-400 rounded my-4 px-4 py-2 h-auto w-[32rem] max-w-3xl"
          name="myForm"
        >
          <div className="mt-2 pb-21 flex flex-col">
            <div className=" mt-2 pb-2 flex flex-col">
              <label>Update Type</label>
              <select
                name="attributeType"
                onChange={handleChangeSelectAttributeType}
                required
                className="w-3/5"
              >
                <option key="" value="">
                  Please select
                </option>
                <option key="update" value="update">
                  Update Attributes
                </option>
                <option key="insert" value="insert">
                  Add Attributes
                </option>
              </select>
            </div>
            {attributeType === "update" && (
              <>
                <div className=" mt-2 pb-2 flex flex-col">
                  <label>Entity</label>
                  <select
                    name="entity"
                    onChange={onSelectChangeEntity}
                    required
                    className="w-3/5"
                  >
                    <option value="">Please select</option>
                    {entityList?.length > 0 ? (
                      entityList?.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })
                    ) : (
                      <option value={"loading"}>Loading...</option>
                    )}
                  </select>
                </div>
                {updateData.entity !== "" && (
                  <div className=" mt-2 pb-2 flex flex-col">
                    <label>Attributes</label>
                    <select
                      name="Attributes"
                      onChange={onSelectChangeAttribute}
                      required
                      className="w-3/5"
                    >
                      <option value="">Please select</option>
                      {attributeList?.length > 0 ? (
                        attributeList?.map((item, index) => {
                          return (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          );
                        })
                      ) : (
                        <option value={"loading"}>Loading...</option>
                      )}
                    </select>
                  </div>
                )}
                {updateData.entity !== "" &&
                  updateData.Attributes &&
                  updateData.Attributes !== "" && (
                    <>
                      <div className="flex w-full justify-between mt-2">
                        <div className="">
                          <label>Attribute Name</label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="Attributes"
                              onChange={onChangehandlerUpdateData}
                              value={updateData.modification.Attributes}
                              required
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                            />
                            {error !== null ? (
                              <span className="text-[#f44336] text-sm">
                                {error}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="">
                          <label>Attribute Description</label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="Description"
                              onChange={onChangehandlerUpdateData}
                              value={updateData.modification.Description}
                              required
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-between mt-2">
                        <div className="">
                          <label>Category</label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="Category"
                              onChange={onChangehandlerUpdateData}
                              value={updateData.modification.Category}
                              required
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                            />
                          </div>
                        </div>
                        <div className="">
                          <label>Sub Category</label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="Sub_Category"
                              onChange={onChangehandlerUpdateData}
                              value={updateData.modification.Sub_Category}
                              required
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-between mt-2">
                        <div className="">
                          <label>Tech Name</label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="Tech_Name"
                              onChange={onChangehandlerUpdateData}
                              value={updateData.modification.Tech_Name}
                              required
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
              </>
            )}

            {attributeType === "insert" && (
              <>
                <div className=" mt-2 pb-2 flex flex-col">
                  <label>Entity</label>
                  <select
                    name="entity"
                    onChange={onSelectChangeEntity}
                    required
                    className="w-3/5"
                  >
                    <option value="">Please select</option>
                    {entityList?.map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {updateData.entity !== "" && (
                  <>
                    <div className="flex w-full justify-between mt-2">
                      <div className="">
                        <label>Attribute Name</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="Attributes"
                            onChange={onChangehandlerUpdateData}
                            value={updateData.modification.Attributes}
                            required
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                          />
                          {error !== null ? (
                            <span className="text-[#f44336] text-sm">
                              {error}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="">
                        <label>Attribute Description</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="Description"
                            onChange={onChangehandlerUpdateData}
                            value={updateData.modification.Description}
                            required
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full justify-between mt-2">
                      <div className="">
                        <label>Category</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="Category"
                            onChange={onChangehandlerUpdateData}
                            value={updateData.modification.Category}
                            required
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                          />
                        </div>
                      </div>
                      <div className="">
                        <label>Sub Category</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="Sub_Category"
                            onChange={onChangehandlerUpdateData}
                            value={updateData.modification.Sub_Category}
                            required
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full justify-between mt-2">
                      <div className="">
                        <label>Tech Name</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="Tech_Name"
                            onChange={onChangehandlerUpdateData}
                            value={updateData.modification.Tech_Name}
                            required
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-true-teal"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex justify-center">
            <button
              className="my-2 flex w-3/5 justify-center rounded-md bg-deep-navy px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-electric-green hover:text-deep-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-green"
              type="submit"
              onClick={handleSubmit}
            >
              {loader ? (
                <CircularProgress
                  style={{ width: "24px", height: "24px", color: "#FFFFFF" }}
                />
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCatalog;
