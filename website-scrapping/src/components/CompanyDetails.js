import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';

function CompanyDetails({ match }) {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!match || !match.params.id) {
        // Handle error or redirect to a default page
        return;
      }
      
      const response = await axios.get(`/api/company/${match.params.id}`);
      setCompany(response.data);
    };

    fetchCompanyDetails();
  }, [match]);

  if (!company) return <p>Loading...</p>;

  return (
    <Container>
      <Typography variant="h4">{company.name}</Typography>
      <img src={company.logo} alt={`${company.name} logo`} />
      <Typography variant="body1">{company.description}</Typography>
      <Typography variant="body2">Address: {company.address}</Typography>
      <Typography variant="body2">Phone: {company.phone}</Typography>
      <Typography variant="body2">Email: {company.email}</Typography>
      <img src={company.screenshot} alt={`${company.name} screenshot`} />
    </Container>
  );
}

export default CompanyDetails;
