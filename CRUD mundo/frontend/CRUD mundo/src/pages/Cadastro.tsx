import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import './styles/Cadastro.css';

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');

    try {
      const [ano, mes, dia] = dataNascimento.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;

      await api.post('/cadastrar', {
        nome,
        sobrenome,
        email,
        senha,
        dataNascimento: dataFormatada
      });

      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErro(err.response?.data?.error || 'Erro ao realizar o cadastro');
      } else {
        setErro('Erro inesperado');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card cadastro-card">
        <h1>Novo Passaporte</h1>
        <p className="auth-subtitle">Junte-se a nós para catalogar o mundo</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {erro && <div className="auth-error">{erro}</div>}

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="sobrenome">Sobrenome</label>
              <input
                id="sobrenome"
                type="text"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                required
              />
            </div>
          </div>

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

          <div className="input-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Registrar
          </button>
        </form>

        <div className="auth-footer">
          Já tem o seu passaporte? <Link to="/login">Fazer login</Link>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;