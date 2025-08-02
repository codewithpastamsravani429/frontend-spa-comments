import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="card-professional p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Lavender themed logo dots */}
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded-full transform hover:scale-110 transition-transform duration-200"></div>
              <div className="w-4 h-4 bg-primary-light rounded-full transform hover:scale-110 transition-transform duration-200"></div>
              <div className="w-2 h-2 bg-primary-dark rounded-full transform hover:scale-110 transition-transform duration-200"></div>
              <div className="w-3 h-3 bg-primary rounded-full transform hover:scale-110 transition-transform duration-200"></div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Fre<span className="text-primary">Jun</span>
            </h1>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">Frontend Developer Intern</p>
          <p className="text-xs text-muted-foreground">Comments Management System</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;