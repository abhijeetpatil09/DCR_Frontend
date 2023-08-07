import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { CircularProgress, MenuItem, Select } from "@mui/material";

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

import { v4 as uuidv4 } from "uuid";

import "../../styles.css";
import { joinArray } from "../../../utils/commonFunctions";

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

function EditToolbar(props) {
  const {
    setRows,
    setSelectedValues,
    setIsEdit,
    setRowModesModel,
    attributeErrorMsg,
  } = props;

  const handleClick = () => {
    const id = uuidv4();
    setSelectedValues({ category: [], subCategory: [] });
    setIsEdit(true);
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        CATEGORY: "",
        SUB_CATEGORY: "",
        ATTRIBUTE_NAME: "",
        DESCRIPTION: "",
        TECH_NAME: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "CATEGORY" },
    }));
  };

  return (
    <GridToolbarContainer className="m-2 justify-between">
      <div>
        {attributeErrorMsg !== "" && (
          <div className="text-red-600 font-bold text-sm py-2">
            {attributeErrorMsg}
          </div>
        )}
      </div>
      <Button
        className="text-white text-sm bg-deep-navy px-2 rounded-md"
        startIcon={<AddIcon />}
        onClick={handleClick}
      >
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

const UpdateAttributeTable = ({ selectedKey, user }) => {
  const [rows, setRows] = useState([]);
  const [attributeList, setAttributeList] = useState([]);

  const [isEdit, setIsEdit] = useState(false);

  const [rowModesModel, setRowModesModel] = useState({});
  const [clickDeleteButton, setClickDeleteButton] = useState({ id: "" });
  const [loader, setLoader] = useState(false);
  const [loadingDataMessage, setLoadingDataMessage] = useState("");
  const [editableAttribute, setEditableAttribute] = useState("");
  const [attributeErrorMsg, setAttributeErrorMsg] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const [selectedValues, setSelectedValues] = useState({
    category: [],
    subCategory: [],
  });

  useEffect(() => {
    let timeoutId = null;

    if (attributeErrorMsg) {
      timeoutId = setTimeout(() => {
        setAttributeErrorMsg("");
      }, 10000); // Duration in milliseconds (5 seconds)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [attributeErrorMsg]);

  const getDataFromEntity = () => {
    setLoadingDataMessage(
      `We are fetching the data for ${selectedKey}. Please wait..`
    );
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `select distinct * from DATAEXCHANGEDB.DATACATALOG.PROVIDER where entity_name = '${selectedKey}' and PROVIDER_NAME = '${user?.name}' order by ATTRIBUTE_NAME;`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          const data = response?.data?.data;
          setRows(data?.map((obj) => ({ ...obj, id: uuidv4() })));

          let attributes = data?.map((item) => item.ATTRIBUTE_NAME);
          setAttributeList(attributes);
          setLoadingDataMessage("");
        } else {
          setLoadingDataMessage(
            `There is no data for ${selectedKey}. Please select another Entity.`
          );
          setRows([]);
          setAttributeList([]);
        }
      })
      .catch((error) => {
        setLoadingDataMessage(
          `We are facing some issue for fetching the data for ${selectedKey}. Please select another Entity.`
        );
        console.log(error);
      });
  };

  const getAllCategories = () => {
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `select distinct * from DATAEXCHANGEDB.DATACATALOG.CATEGORY_LIST`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          const cat_list = [];
          response?.data?.data?.forEach((obj) => {
            cat_list.push(obj.CATEGORY);
          });
          setCategoryList(cat_list);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (selectedKey !== false) {
      getDataFromEntity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  useEffect(() => {
    if (isEdit) {
      getAllCategories();
    }
  }, [isEdit]);

  useEffect(() => {
    if (selectedValues.category?.length > 0) {
      const finalCategory = selectedValues?.category
        ?.map(
          (item, index) =>
            " Category = '" +
            item +
            (index !== selectedValues?.category?.length - 1 ? "' or " : "'")
        )
        .join("");
      axios
        .get(`${baseURL}/${redirectionUser}`, {
          params: {
            query: `select * from DATAEXCHANGEDB.DATACATALOG.SUB_CATEGORY_LIST ${
              finalCategory !== "" ? `where (${finalCategory})` : ""
            };`,
          },
        })
        .then((response) => {
          if (response?.data?.data) {
            let data = response?.data?.data;
            if (data?.length > 0) {
              const sub_cat_list = [];
              response?.data?.data?.forEach((obj) => {
                sub_cat_list.push(obj);
              });
              setSubCategoryList(sub_cat_list);
            } else {
              setSubCategoryList([]);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedValues.category]);

  const deleteRecordsAPI = (attributeName) => {
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `DELETE FROM DATAEXCHANGEDB.DATACATALOG.PROVIDER WHERE PROVIDER_NAME ='${user?.name}' AND ENTITY_NAME='${selectedKey}' AND ATTRIBUTE_NAME='${attributeName}';`,
        },
      })
      .then((response) => {
        if (response) {
          setClickDeleteButton({ ...clickDeleteButton, id: "" });
          getDataFromEntity();
        }
      })
      .catch((error) => {
        setClickDeleteButton({ ...clickDeleteButton, id: "" });
        console.log(error);
      });
  };

  const updateRecordsAPI = (result, tag) => {
    setLoader(true);
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `insert into DATAEXCHANGEDB.DATACATALOG.JSON_TABLE select PARSE_JSON('${result}');`,
        },
      })
      .then((response) => {
        if (response) {
          if (tag === "insert") {
            callProcedureAddRecords();
          } else {
            callProcedureUpdateRecords();
          }
        } else {
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  };

  const callProcedureAddRecords = () => {
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `call ADDATTRIBUTE();`,
        },
      })
      .then((response) => {
        toast.success("Record Added Successfully");
        setLoader(false);
        getDataFromEntity();
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  };

  const callProcedureUpdateRecords = () => {
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `call UPDATECATALOG();`,
        },
      })
      .then((response) => {
        toast.success("Record Updated Successfully");
        setLoader(false);
        getDataFromEntity();
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
      });
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    const editableAttribute = rows.filter((row) => row.id === id);
    setEditableAttribute(editableAttribute[0].ATTRIBUTE_NAME);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setIsEdit(true);
    setSelectedValues({ category: [], subCategory: [] });
    setSubCategoryList([]);
  };

  const handleSaveClick = (id) => () => {
    setIsEdit(false);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setClickDeleteButton({ ...clickDeleteButton, id: id });
    const attributeName = rows.filter((row) => row.id === id);
    deleteRecordsAPI(attributeName[0].ATTRIBUTE_NAME);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const filteredArray2 = subCategoryList
      .filter((obj) => selectedValues.subCategory?.includes(obj.SUB_CATEGORY))
      ?.map((filteredObj) => filteredObj.CATEGORY);

    const categoriesNotSubCategory = selectedValues.category?.filter(
      (obj1) => !filteredArray2?.includes(obj1)
    );

    if (categoriesNotSubCategory.length > 0) {
      setAttributeErrorMsg(
        `Please select Sub Category for Category - ${joinArray(
          categoriesNotSubCategory
        )}`
      );
      return;
    }
    newRow.CATEGORY = joinArray(selectedValues.category);
    newRow.SUB_CATEGORY = joinArray(selectedValues.subCategory);

    const updatedRow = { ...newRow };
    const index = attributeList?.filter(
      (item) => item === updatedRow.ATTRIBUTE_NAME
    );
    if (updatedRow.CATEGORY === "") {
      setAttributeErrorMsg("Please enter the Category.");
      return;
    } else if (updatedRow.SUB_CATEGORY === "") {
      setAttributeErrorMsg("Please enter the Sub Category.");
      return;
    } else if (updatedRow.DESCRIPTION === "") {
      setAttributeErrorMsg("Please enter the Description.");
      return;
    } else if (updatedRow.TECH_NAME === "") {
      setAttributeErrorMsg("Please enter the Tech Name.");
      return;
    }
    if (updatedRow.ATTRIBUTE_NAME === "") {
      setAttributeErrorMsg("Please enter the Attribute Name.");
      return;
    } else if (newRow.isNew && index.length > 0) {
      setAttributeErrorMsg("The Attribute Name is already exists.");
      return;
    } else if (
      index.length > 0 &&
      editableAttribute !== updatedRow.ATTRIBUTE_NAME
    ) {
      setAttributeErrorMsg("The Attribute Name is already exists.");
      return;
    }

    const updatedObj = {
      entity: selectedKey,
      Attributes: updatedRow.ATTRIBUTE_NAME,
      name: user?.name,
      modification: {
        Attributes: updatedRow.ATTRIBUTE_NAME,
        Description: updatedRow.DESCRIPTION,
        Category: updatedRow.CATEGORY,
        Sub_Category: updatedRow.SUB_CATEGORY,
        Tech_Name: updatedRow.TECH_NAME,
      },
      tag: "",
    };
    if (newRow.isNew) {
      delete updatedObj.Attributes;
      updatedObj.tag = "insert";
      let result = JSON.stringify(updatedObj);
      updateRecordsAPI(result, "insert");
    } else {
      updatedObj.tag = "update";
      let result = JSON.stringify(updatedObj);
      updateRecordsAPI(result, "update");
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "CATEGORY",
      headerName: "Category",
      flex: 1,
      editable: true,
      renderEditCell: (params) => {
        const handleMultiSelectChange = (event) => {
          setSelectedValues({
            ...selectedValues,
            category: event.target.value,
            subCategory: [],
          });
        };

        return (
          <Select
            labelId={`role-label-${params.id}`}
            id={`role-select-${params.id}`}
            multiple
            value={selectedValues.category}
            onChange={handleMultiSelectChange}
          >
            {categoryList?.map((item) => {
              return <MenuItem value={item}>{item}</MenuItem>;
            })}
          </Select>
        );
      },
    },
    {
      field: "SUB_CATEGORY",
      headerName: "Sub Category",
      flex: 1,
      editable: true,
      renderEditCell: (params) => {
        const handleMultiSelectChange = (event) => {
          setSelectedValues({
            ...selectedValues,
            subCategory: event.target.value,
          });
        };

        return (
          <Select
            labelId={`role-label-${params.id}`}
            id={`role-select-${params.id}`}
            multiple
            value={selectedValues.subCategory}
            onChange={handleMultiSelectChange}
          >
            {subCategoryList?.map((item) => {
              return (
                <MenuItem value={item.SUB_CATEGORY}>
                  {item.SUB_CATEGORY}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: "ATTRIBUTE_NAME",
      headerName: "Attributes",
      flex: 1,
      editable: true,
    },
    {
      field: "DESCRIPTION",
      headerName: "Description",
      flex: 1,
      editable: true,
    },
    {
      field: "TECH_NAME",
      headerName: "Tech Name",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      flex: 1,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        const isInDeleteMode = clickDeleteButton.id === id;

        if (isInEditMode) {
          if (loader) {
            return [
              <GridActionsCellItem
                icon={
                  <CircularProgress
                    style={{ width: "20px", height: "20px", color: "#09479f" }}
                  />
                }
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
            ];
          } else {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }
        }

        if (isInDeleteMode) {
          return [
            <GridActionsCellItem
              icon={
                <CircularProgress
                  style={{ width: "20px", height: "20px", color: "#09479f" }}
                />
              }
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        }
      },
    },
  ];

  return (
    <Box
      sx={{
        height: "auto",
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      {rows?.length > 0 ? (
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {
              setRows,
              setSelectedValues,
              setIsEdit,
              setRowModesModel,
              attributeErrorMsg,
            },
          }}
          disableColumnMenu={true} // Disable column menu (including sorting options)
          disableColumnFilter={true} // Disable column filter menu
        />
      ) : (
        loadingDataMessage !== "" && (
          <div className="w-full flex justify-center text-deep-navy font-bold text-sm">
            {loadingDataMessage}
          </div>
        )
      )}
      <div className="my-2">
        {attributeErrorMsg !== "" && (
          <div className="text-red-600 font-bold text-sm py-2">
            {attributeErrorMsg}
          </div>
        )}
      </div>
    </Box>
  );
};

export default UpdateAttributeTable;
