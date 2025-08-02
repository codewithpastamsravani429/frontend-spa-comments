import React from 'react';
import Navbar from '../components/Navbar';
import CommentsTable from '../components/CommentsTable';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="container mx-auto px-4 py-4 max-w-7xl h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col min-h-0">
          <div className="text-center space-y-1 mb-4">
            <h2 className="text-xl font-bold text-foreground">Comments Management Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Browse, search, and edit comments with real-time updates
            </p>
          </div>
          <div className="flex-1 min-h-0">
            <CommentsTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
