import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './styles/Navbar.css';

const Navbar: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/">🌍 Meu Mundo</Link>
      </div>
      <nav className="navbar-links">
        <Link to="/continentes">Continentes</Link>
        <Link to="/paises">Países</Link>
        <Link to="/cidades">Cidades</Link>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </nav>
    </header>
  );
};

export default Navbar;