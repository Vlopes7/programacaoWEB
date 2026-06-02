import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login'
import Cadastro from './pages/Cadastro';

const Placeholder = ({ title }: { title: string }) => <h1>{title}</h1>;

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
          <Route index element={<Placeholder title="Dashboard Inicial" />} />
          <Route path="continentes" element={<Placeholder title="CRUD de Continentes" />} />
          <Route path="paises" element={<Placeholder title="CRUD de Países" />} />
          <Route path="cidades" element={<Placeholder title="CRUD de Cidades" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;