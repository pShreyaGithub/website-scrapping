import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Button, Container, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  SaveAlt,
  Delete,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";
import { useToast } from "../hooks.js/useToast";
import "./CombinedPage.css";
import { color } from "@mui/system";

function CombinedPage() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [isScrappingLoading, setIsScrappingLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [url, setUrl] = useState("");

  const fetchCompanies = async () => {
    const response = await axios.get("http://localhost:4000/open/api/sites");
    setCompanies(response.data);
  };

  useEffect(() => {
    const toastId = toast.loading("Fetching data");
    fetchCompanies()
      .then(() => {
        toast.update(toastId, {
          render: "Data successfully fetched",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      })
      .catch(() => {
        toast.update(toastId, {
          render: "Error in Data fetched! Please try again",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });
  }, []);

  const handleDelete = async () => {
    if (selected.length) {
      const toastId = toast.loading("Deleting data");
      try {
        await axios.post(
          "http://localhost:4000/open/api/delete_multiple_site/",
          {
            ids: selected,
          }
        );
        toast.update(toastId, {
          render: "data deleted successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        fetchCompanies();
      } catch (err) {
        toast.update(toastId, {
          render: "Error in Data Deletion! Please try again",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  };

  const handleDownloadCSV = async () => {
    const response = await axios.get(
      "http://localhost:4000/open/api/download_csv",
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "companies.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleScrape = async () => {
    const toastId = toast.loading("Scrapping site");
    try {
      setIsScrappingLoading(true);
      const response = await axios.post(
        "http://localhost:4000/open/api/scrap_site",
        { url }
      );
      if (response.status === 200) {
        toast.update(toastId, {
          render: "Site scrapped successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        await fetchCompanies();
      }
      setIsScrappingLoading(false);
    } catch (error) {
      toast.update(toastId, {
        render: "Error in scrapping site! Please try again",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      setIsScrappingLoading(false);
    }
  };

  const columns = [
    {
      name: "Company Name",
      selector: (row) => row.companyDetails.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.companyDetails.description,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.companyDetails.address,
      sortable: true,
    },
    {
      name: "Phone No.",
      selector: (row) => row.companyDetails.phone,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.companyDetails.email,
      sortable: true,
    },
    {
      name: "social",
      cell: (row) => (
        <div>
          {row.companyDetails.social_links.facebook ? (
            <a
              href={row.companyDetails.social_links.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook id="fb"/>
            </a>
          ) : null}
          {row.companyDetails.social_links.instagram ? (
            <a
              href={row.companyDetails.social_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram id="ig" />
            </a>
          ) : null}
          {row.companyDetails.social_links.twitter ? (
            <a
              href={row.companyDetails.social_links.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter id="tweet"/>
            </a>
          ) : null}
          {row.companyDetails.social_links.linkedin ? (
            <a
              href={row.companyDetails.social_links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedIn id="linkedin" />
            </a>
          ) : null}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
//
    {
      name: "Actions",
      cell: (row) => (
        <Button
          href={`/company/${row._id}`}
          variant="contained"
          id="button"
          color="primary"
        >
          View Details
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const data = companies;

  const customStyles = {
    tableWrapper: {
      style: {
        margin: "8px",
        border: "2px solid rgb(88, 87, 87)",
        borderRadius: "4px",
        overflow: "hidden",
        textAlign: "center",
      },
    },
    headCells: {
      style: {
        fontSize: "18px",
        borderRight: "2px solid rgb(88, 87, 87)",
        width: "124px",
      },
    },
    cells: {
      style: {
        borderRight: "2px solid rgb(88, 87, 87)",
        width: "120px",
      },
    },
    rows: {
      style: {
        minHeight: "42px",
        border: "2px solid rgb(88, 87, 87)",
      },
    },
    pagination: {
      style: {
        border: "2px solid black",
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  return (
    <Container className="container">
      <h2>Scrape Website Data</h2>
      <TextField
        id="labell"
        label="Enter Website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
      />
      <LoadingButton
        id="btn"
        variant="contained"
        color="primary"
        onClick={handleScrape}
        loading={isScrappingLoading}
      >
        Scrape and Save
      </LoadingButton>
      <h2>Saved Companies Details</h2>
      <div className="buttonWrapper">
        <Button
          startIcon={<Delete />}
          onClick={handleDelete}
          color="secondary"
          id="delete"
        >
          Delete Selected Data
        </Button>
        <Button
          startIcon={<SaveAlt />}
          onClick={handleDownloadCSV}
          color="primary"
          id="Download"
        >
          Download CSV File
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        selectableRows
        onSelectedRowsChange={({ selectedRows }) =>
          setSelected(selectedRows.map((row) => row._id))
        }
        noDataComponent="No Records Available"
        customStyles={customStyles}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10]}
        paginationTotalRows={companies.length}
        paginationComponentOptions={paginationComponentOptions}
      />
    </Container>
  );
}

export default CombinedPage;
