import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Button, Container, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { SaveAlt, Delete } from '@mui/icons-material';

function CombinedPage() {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [url, setUrl] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

 
  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await axios.get('http://localhost:4000/open/api/sites');
      setCompanies(response.data.data);
console.log(response.data.data[0]);
    };

    fetchCompanies();
  }, []);

  const handleDelete = async () => {
    await axios.delete('http://localhost:4000/open/api/delete_site/666daf7e67c01b0fa0f597fe', { ids: selected });
    setCompanies(companies.filter(company => !selected.includes(company.id)));
  };

  const handleDownloadCSV = async () => {
    const response = await axios.get('/api/download', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'companies.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handleScrape = async () => {
    try {
      const response = await axios.post('http://localhost:4000/open/api/scrap_site', { url });
      // handle response
    } catch (error) {
      console.error('Error occurs in scraping the website', error);
    }
  };

  const columns = [
    {
      name: 'Company Name',
      selector: row => row.companyDetails.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.companyDetails.description,
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.companyDetails.address,
      sortable: true,
    },

    {
      name: 'Phone No.',
      selector: row => row.companyDetails.phone,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.companyDetails.email,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <Button href={`/company/${row.id}`} variant="contained" id="detail" color="primary">
          View Details
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const placeholderRows = () => {
    const placeholders = [];
    for (let i = 0; i < rowsPerPage; i++) {
      placeholders.push({
        id: `placeholder-${i}`,
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        placeholder: true,
      });
    }
    return placeholders;
  };

  const data =  companies ;

  const customStyles = {
    tableWrapper: {
      style: {
        margin: '8px',
        border: '2px solid rgb(88, 87, 87)',
        borderRadius: '4px',
        overflow: 'hidden',
        textAlign: 'center',
      },
    },
    headCells: {
      style: {
        fontSize: '16px',
        borderRight: '1px solid rgb(88, 87, 87)',
      },
    },
    cells: {
      style: {
        borderRight: '1px solid rgb(88, 87, 87)',
        width: '120px',
      },
    },
    rows: {
      style: {
        minHeight: '42px',
        border: '1px solid rgb(88, 87, 87)',
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  return (
    <Container>
      <h2>Scrape Website Data</h2>
      <TextField
        id="label"
        label="Enter Website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
      />
      <Button id="btnn" variant="contained" color="primary" onClick={handleScrape}>
        Scrape and Save
      </Button>
      <h2>Saved Companies Details</h2>
      <Button startIcon={<Delete />} onClick={handleDelete} color="secondary">
        Delete Selected Data
      </Button>
      <Button startIcon={<SaveAlt />} onClick={handleDownloadCSV} color="primary" id="download">
        Download CSV File
      </Button>
      <FormControl style={{ minWidth: 120, margin: '16px 0' }}>
        <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
        <Select
          labelId="rows-per-page-label"
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(e.target.value)}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
      <DataTable
        columns={columns}
        data={data}
        selectableRows
        onSelectedRowsChange={({ selectedRows }) => setSelected(selectedRows.map(row => row.id))}
        noDataComponent="No Records Available"
        customStyles={customStyles}
        pagination
        // paginationRowsPerPageOptions={[10, 20, 30, 50]}
        paginationPerPage={rowsPerPage}
        paginationComponentOptions={paginationComponentOptions}
      />
    </Container>
  );
}

export default CombinedPage;
