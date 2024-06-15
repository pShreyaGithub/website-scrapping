import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container } from '@mui/material';

function HomePage() {
  const [url, setUrl] = useState('');

  const handleScrape = async () => {
    try {
      const response = await axios.post('/api/scrape', { url });
      // handle response
    } catch (error) {
      console.error('Error scraping the website', error);
    }
  };

  return (
    <Container>
      <h1>Scrape Website Data</h1>
      <TextField 
        label="Website URL" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
        fullWidth 
      />
      <Button variant="contained" color="primary" onClick={handleScrape}>
        Scrape
      </Button>
    </Container>
  );
}

export default HomePage;
