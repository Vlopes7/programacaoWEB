import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import './styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await api.post('/login', { email, senha });
      login(response.data.id);
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErro(err.response?.data?.error || 'Erro ao realizar login');
      } else {
        setErro('Erro ao realizar login');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🌍 Explorar o Mundo</h1>
        <p className="auth-subtitle">Acesse sua conta para continuar</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {erro && <div className="auth-error">{erro}</div>}

          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Entrar
          </button>
        </form>

        <div className="auth-footer">
          Ainda não tem um passaporte? <Link to="/cadastro">Criar conta</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;