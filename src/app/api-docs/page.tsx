'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import './swagger-ui.css';

// Dynamically import SwaggerUI with no server-side rendering and proper configuration
const SwaggerUI = dynamic(
  async () => {
    const swagger = await import('swagger-ui-react');
    return swagger.default;
  },
  { 
    ssr: false,
    loading: () => (
      <div className="container mx-auto p-4">
        <div>Loading API documentation...</div>
      </div>
    )
  }
);

export default function ApiDocs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
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
