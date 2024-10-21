import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/background.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      <div className="relative z-10 bg-gray-950/40 backdrop-blur-lg w-full">
      {children}
      </div>
    </div>
  );
};

export default Layout;