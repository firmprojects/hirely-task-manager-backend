'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
});

export default function ApiDocs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <SwaggerUI url="/api/swagger" />
    </div>
  );
}
