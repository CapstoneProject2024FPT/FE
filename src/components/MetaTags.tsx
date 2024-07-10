// MetaTags.js (or MetaTags.tsx for TypeScript)
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/selling-maintainance-machinery.appspot.com/o/1719910208542logo-SMMMS.png?alt=media&token=a698dfce-ebfb-4970-8fed-d72b2bdbc704"
        />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <title>{title}</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default MetaTags;
