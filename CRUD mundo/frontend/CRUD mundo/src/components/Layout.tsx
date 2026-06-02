import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet /> {/* Aqui serão renderizadas as páginas (Continentes, Paises, etc) */}
      </main>
    </div>
  );
};

export default Layout;