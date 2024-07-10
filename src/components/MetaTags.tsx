// MetaTags.js (or MetaTags.tsx for TypeScript)
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import images from "../constants/images";

interface MetaTagsProps {
  title: string | undefined;
  description?: string;
  // image: string | undefined;
  url: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  // image,
  url,
}) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description || title} />
        <meta property="og:image" content={images.logo} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <title>{title}</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default MetaTags;
