import React from 'react';
import KnowledgeGraph from '@/components/KnowledgeGraph';

export default function KnowledgeGraphPage() {
  return (
    <div style={{ padding: 20 }}>
      <KnowledgeGraph width={1000} height={700} />
    </div>
  );
}
