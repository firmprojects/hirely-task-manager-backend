'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import './swagger-ui.css';

// Dynamically import SwaggerUI with no server-side rendering
const SwaggerUI = dynamic(
  () => import('swagger-ui-react'),
  { ssr: false }
);

export default function ApiDocs() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state until client-side rendering is ready
  if (!isClient) {
    return (
      <div className="container mx-auto p-4">
        <div>Loading API documentation...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <SwaggerUI url="/api/swagger" />
    </div>
  );
}
