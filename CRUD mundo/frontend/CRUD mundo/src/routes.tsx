import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login'
import Cadastro from './pages/Cadastro';
import Continentes from './pages/Continentes';
import Paises from './pages/Paises';
import Cidades from './pages/Cidades';
import Dashboard from './pages/Dashboard';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { signed } = useContext(AuthContext);
  return signed ? children : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard/>} />
          <Route path="continentes" element={<Continentes/>} />
          <Route path="paises" element={<Paises/>} />
          <Route path="cidades" element={<Cidades/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;