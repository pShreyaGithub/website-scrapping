# Scrapping API Documentation

## Overview
The Scrapping API is an open API for scraping a site and retrieving basic information. Below are the available endpoints and their descriptions.

## Endpoints

### 1. Delete Site Record
**Method:** DELETE  
**URL:** `http://localhost:4000/open/api/delete_site/666daf7e67c01b0fa0f597fe`

### 2. Get Scrapping Data
**Method:** POST  
**URL:** `http://localhost:4000/open/api/scrap_site`  
**Body:**
- Type: `raw (json)`
- Content-Type: `application/json`
- Example:
  ```json
  {
    "url": "https://www.google.com"
  }

### 3. Get Site List
**Method:** GET  
**URL:** `http://localhost:4000/open/api/sites`

This `README.md` file provides a clear and concise overview of the API endpoints, their methods, URLs, and any required request bodies.





