import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import share from "../../assets/images/share-image.jpg";

const HelmetData = ({ title, image, description }) => {
  let location = useLocation();
  let currentUrl = process.env.REACT_APP_URL + location.pathname;

  return (
    <Helmet>
      <meta property="url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image ? image : share} />
      <meta content="image/*" property="og:image:type" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Monk Medical" />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
};

export default HelmetData;
