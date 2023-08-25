import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import NewCatalogUploadModal from "./components/NewCatalogUploadModal";

import UpdateAttributeTable from "./components/UpdateAttributeTable";
import Spinner from "../CommonComponent/Spinner";

const baseURL = process.env.REACT_APP_BASE_URL;
const redirectionUser = process.env.REACT_APP_REDIRECTION_URL;

const UploadCatalog = () => {
  const state = useSelector((state) => state);
  const user = state && state.user;
  const [entityList, setEntityList] = useState([]);

  const [newCatUploaded, setNewCatUploaded] = useState(false);

  const [newCatalogModal, setNewCatalogModal] = useState(false);

  const [loader, setLoader] = useState(false);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    setLoader(true);
    axios
      .get(`${baseURL}/${redirectionUser}`, {
        params: {
          query: `select distinct entity_name from DATAEXCHANGEDB.DATACATALOG.PROVIDER where PROVIDER_NAME = '${user?.name}' order by entity_name`,
        },
      })
      .then((response) => {
        if (response?.data?.data) {
          const data = response?.data?.data;
          let result = data?.map((item) => item.ENTITY_NAME);
          setEntityList(result);
          setLoader(false);
        } else {
          setEntityList([]);
        }
      })
      .catch((error) => console.log(error));
  }, [user?.name, newCatUploaded]);

  return (
    <div className="flex flex-col px-5">
      <div className="flex justify-between items-center pt-4">
        <h3 className="text-xl text-deep-navy font-bold">Upload Catalog</h3>
        <button
          className="text-white bg-deep-navy px-4 py-2 rounded-md"
          onClick={() => setNewCatalogModal(!newCatalogModal)}
        >
          New Catalog Entry
        </button>
      </div>

      {!loader ? (
        <div className="mt-4 rounded-none">
          {entityList?.map((key) => {
            return (
              <Accordion
                expanded={expanded === key}
                onChange={handleChange(key)}
                className="my-4"
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      className={expanded === key ? "text-white" : ""}
                    />
                  }
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className={
                    expanded === key
                      ? "bg-downriver-950 text-white"
                      : "bg-electric-green"
                  }
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    {key}
                  </Typography>
                </AccordionSummary>
                {expanded === key && (
                  <AccordionDetails>
                    <UpdateAttributeTable selectedKey={expanded} user={user} setNewCatUploaded={setNewCatUploaded} />
                  </AccordionDetails>
                )}
              </Accordion>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      )}

      {newCatalogModal && (
        <NewCatalogUploadModal
          open={newCatalogModal}
          setNewCatUploaded={setNewCatUploaded}
          close={() => setNewCatalogModal(!newCatalogModal)}
          user={user}
        />
      )}
    </div>
  );
};

export default UploadCatalog;
