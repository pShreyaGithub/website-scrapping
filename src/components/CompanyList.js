import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Checkbox, Container } from '@mui/material';
import { SaveAlt, Delete } from '@mui/icons-material';
import { Typography } from '@mui/material';

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await axios.get('/api/companies');
      setCompanies(response.data);
    };

    fetchCompanies();
  }, []);

  const handleDelete = async () => {
    await axios.post('/api/delete', { ids: selected });
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

  return (
    <Container>
      <h1>Saved Companies</h1>
      <Button startIcon={<Delete />} onClick={handleDelete} color="secondary">
        Delete Selected
      </Button>
      <Button startIcon={<SaveAlt />} onClick={handleDownloadCSV} color="primary">
        Download CSV
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>Company Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <Checkbox
                  checked={selected.includes(company.id)}
                  onChange={() => setSelected(selected.includes(company.id) 
                    ? selected.filter(id => id !== company.id) 
                    : [...selected, company.id])}
                />
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.description}</TableCell>
              <TableCell>
                <Button href={`/company/${company.id}`} variant="contained" color="primary">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default CompanyList;
