import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ continentes: 0, paises: 0, cidades: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        const [resCont, resPais, resCid] = await Promise.all([
          api.get('/continentes'),
          api.get('/paises'),
          api.get('/cidades')
        ]);

        setStats({
          continentes: resCont.data.length,
          paises: resPais.data.length,
          cidades: resCid.data.length
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    carregarEstatisticas();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <h1>Bem-vindo ao seu Atlas Pessoal</h1>
        <p>Acompanhe e gerencie as maravilhas do nosso mundo mapeadas por você.</p>
      </header>

      {loading ? (
        <div className="loading">Mapeando o mundo...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h2>Continentes</h2>
            <div className="stat-number">{stats.continentes}</div>
            <Link to="/continentes" className="stat-link">Explorar Continentes &rarr;</Link>
          </div>

          <div className="stat-card">
            <h2>Países</h2>
            <div className="stat-number">{stats.paises}</div>
            <Link to="/paises" className="stat-link">Explorar Países &rarr;</Link>
          </div>

          <div className="stat-card">
            <h2>Cidades</h2>
            <div className="stat-number">{stats.cidades}</div>
            <Link to="/cidades" className="stat-link">Explorar Cidades &rarr;</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;