'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocs() {
  const [error, setError] = useState(null);

  try {
    return (
      <div className="container mx-auto p-4">
        <SwaggerUI url="/api/swagger" />
      </div>
    );
  } catch (err) {
    setError(err);
    console.error("Error rendering SwaggerUI:", err);
    return <div>Error loading API documentation</div>;
  }
}
