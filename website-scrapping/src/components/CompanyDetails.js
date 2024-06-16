import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useToast } from "../hooks.js/useToast";
import "./CompanyDetails.css";
import { PlayLessonRounded } from "@mui/icons-material";

function CompanyDetails() {
  const [company, setCompany] = useState(null);
  const { id } = useParams();
  const { toast } = useToast();

  const fetchCompanyDetails = async () => {
    if (!id) {
      // Handle error or redirect to a default page
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:4000/open/api/site_details/${id}`
      );
      setCompany(response.data);
    } catch (err) {
      toast.error("No record found");
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  if (!company) return <p>Loading...</p>;

  return (
    <Container>
      <div className="company-container" id="cont">
        <div className="left-section">
            <h3>Company Title</h3>
          <div className="section">
            <Typography variant="h6" id="title" className="section-title">
             {company.title}
            </Typography>
          </div>
          <h3>Logo</h3>
          <div className="section">
            <img
              src={company.favicon}
              alt={`${company.companyDetails.name} logo`}
              className="logo"
            />
          </div>
          <h3>Description</h3>
          <div className="section">
            <Typography variant="h6" className="section-title">
              Description:
            </Typography>
            <Typography variant="body1" className="description">
              {company.companyDetails.description || company.metaDescription}
            </Typography>
          </div>
          <h3>Address</h3>
          <div className="section">
            <Typography variant="h6" className="section-title">
              Address:
            </Typography>
            <Typography variant="body1" className="contact-info-item">
              {company.companyDetails.address}
            </Typography>
          </div>
          <h3>Phone</h3>
          <div className="section">
            <Typography variant="h6" className="section-title">
              Phone:
            </Typography>
            <Typography variant="body1" className="contact-info-item">
              {company.companyDetails.phone}
            </Typography>
          </div>

          <h3>Email</h3>
          <div className="section">
            <Typography variant="h6" className="section-title">
              Email:
            </Typography>
            <Typography variant="body1" className="contact-info-item">
              {company.companyDetails.email}
            </Typography>
          </div>
        </div>
        <h3 id="h3">Screenshot</h3>
        <div className="right-section">
          <img
            src={company.companyDetails.screenshot}
            alt={`${company.name} screenshot`}
            className="screenshot"
          />
        </div>
      </div>
    </Container>
  );
}

export default CompanyDetails;
