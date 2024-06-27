import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Button, Container, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { SaveAlt, Delete, Facebook, Instagram, Twitter, LinkedIn, Search } from "@mui/icons-material";
import { useToast } from "../hooks.js/useToast";
import "./CombinedPage.css";
import { fontWeight, margin } from "@mui/system";

function CombinedPage() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [isScrappingLoading, setIsScrappingLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
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
        await axios.post("http://localhost:4000/open/api/delete_multiple_site/", {
          ids: selected,
        });
        toast.update(toastId, {
          render: "Data deleted successfully",
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
    const response = await axios.get("http://localhost:4000/open/api/download_csv", { responseType: "blob" });
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
      const response = await axios.post("http://localhost:4000/open/api/scrap_site", { url });
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
      name: "Logo",
      cell: (row) => (
        <img src={row.favicon} alt="NA" style={{ width: "20px", height: "auto" }} />
      ),
      sortable: true,
    },
    {
      name: "COMPANY",
      selector: (row) => row.companyDetails.name,
      sortable: true,
      cell: (row) => (
        <Button
          id="link"
          href={`/company/${row._id}`}
          variant="text"
          color="primary"
          size="small"
        >
          {row.companyDetails.name}
        </Button>
      ),
    },
    {
      name: "SOCIAL",
      cell: (row) => (
        <div>
          {row.companyDetails.social_links.facebook ? (
            <a
              href={row.companyDetails.social_links.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook id="fb" />
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
              <Twitter id="tweet" />
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
    {
      name: "DESCRIPTION",
      selector: (row) => row.companyDetails.description,
      sortable: true,
    },
    {
      name: "ADDRESS",
      selector: (row) => row.companyDetails.address,
      sortable: true,
    },
    {
      name: "PHONE",
      selector: (row) => row.companyDetails.phone,
      sortable: true,
    },
    {
      name: "EMAIL",
      selector: (row) => row.companyDetails.email,
      sortable: true,
    },
  ];

  const data = companies;

  const customStyles = {
    tableWrapper: {
      style: {
        margin: "8px",
        border: "1px solid rgb(211, 219, 230)",
        overflow: "hidden",
        textAlign: "center",
        fontFamily: "Helvetica, Arial, sans-serif",
        
      },
    },
    headCells: {
      style: {
        fontSize: "13px",
        width: "124px",
        textAlign: "left",
        fontFamily: "Helvetica, Arial, sans-serif",
        color: "black",
        fontWeight: "600",
      },
    },
    cells: {
      style: {
        width: "120px",
        fontFamily: "Helvetica, Arial, sans-serif",
        color: "black",
        
      },
    },
    rows: {
      style: {
        minHeight: "42px",
         border: "1px solid rgb(211, 219, 230)",
        fontFamily: "Helvetica, Arial, sans-serif",
        color: "#545457",
      },
    },
    pagination: {
      style: {
        border: "2px solid rgb(211, 219, 230)",
        fontFamily: "Helvetica, Arial, sans-serif",
        textAlign: "center",
        margin: "10px auto",
        backgroundColor: "#ffffff",
      },
      pageButtonsStyle: {
        backgroundColor: "#b279eb",
        color: "rgb(34, 13, 45)",
        border: "1px solid rgb(0, 3, 7) ",
        minWidth: "36px",
        minHeight: "36px",
        margin: "2px",
      },
      activeButtonStyle: {
        backgroundColor: "#b279eb",
        color: "rgb(34, 13, 45)",
        border: "1px solid #1976d2",
        minWidth: "36px",
        minHeight: "36px",
        margin: "2px",
      },
      disabledButtonStyle: {
        backgroundColor: "#b279eb",
        color: "rgb(34, 13, 45)",
        border: "1px solid #ccc",
        minWidth: "36px",
        minHeight: "36px",
        margin: "2px",
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
    <>
      <Container className="container">
        <h3>Scrape Website Data</h3>
        <div className="inputWrapper">
          <div className="inputContainer">
            <Search className="searchIcon" />
            <TextField
              id="labell"
              label="Enter Domain Name"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              InputLabelProps={{ className: "inputLabel" }}
              InputProps={{
                className: "textField",
              }}
            />
          </div>
          <LoadingButton
            id="btn"
            variant="contained"
            color="primary"
            onClick={handleScrape}
            loading={isScrappingLoading}
          >
            Fetch &Save Details
          </LoadingButton>
        </div>
      </Container>
      <Container className="buttonContainer">
        <div className="buttonWrapper">
          <Button startIcon={<Delete />} onClick={handleDelete} color="secondary" id="delete">
            Delete
          </Button>
          <Button startIcon={<SaveAlt />} onClick={handleDownloadCSV} color="primary" id="Download">
            Export as CSV file
          </Button>
        </div>
        <Typography variant="subtitle1" id="select" gutterBottom>
          {selectedCount} selected
        </Typography>

        <DataTable
          columns={columns}
          data={data}
          selectableRows
          onSelectedRowsChange={({ selectedRows }) => {
            setSelected(selectedRows.map((row) => row._id));
            setSelectedCount(selectedRows.length);
          }}
          noDataComponent="No Records Available"
          customStyles={customStyles}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10]}
          paginationTotalRows={companies.length}
          paginationComponentOptions={paginationComponentOptions}
        />
      </Container>
    </>
  );
}

export default CombinedPage;
