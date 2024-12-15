'use client';

import { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import './swagger-ui.css';

// Create a loading component
const LoadingDocs = () => (
  <div className="container mx-auto p-4">
    <div>Loading API documentation...</div>
  </div>
);

// Dynamically import SwaggerUI with no SSR
const SwaggerUI = dynamicImport(
  () => import('swagger-ui-react').then((mod) => mod.default),
  { 
    ssr: false,
    loading: LoadingDocs,
  }
);

export default function ApiDocs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingDocs />;
  }

  return (
    <div className="container mx-auto p-4">
      <SwaggerUI 
        url="/api/swagger"
        docExpansion="list"
        defaultModelsExpandDepth={-1}
      />
    </div>
  );
}

// Add export config to disable static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;
