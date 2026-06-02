import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './styles/CRUD.css';

interface Continente {
  id: string;
  nome: string;
  descricao: string;
}

const Continentes: React.FC = () => {
  const [continentes, setContinentes] = useState<Continente[]>([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    carregarContinentes();
  }, []);

  const carregarContinentes = async () => {
    try {
      const response = await api.get('/continentes');
      setContinentes(response.data);
    } catch (error) {
      alert('Erro ao carregar continentes');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/continentes/${editId}`, { nome, descricao });
      } else {
        await api.post('/continentes', { nome, descricao });
      }
      setNome('');
      setDescricao('');
      setEditId(null);
      carregarContinentes();
    } catch (error) {
      alert('Erro ao salvar continente');
    }
  };

  const handleEdit = (continente: Continente) => {
    setNome(continente.nome);
    setDescricao(continente.descricao || '');
    setEditId(continente.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza? Todos os países e cidades vinculados serão deletados permanentemente.')) return;
    try {
      await api.delete(`/continentes/${id}`);
      carregarContinentes();
    } catch (error) {
      alert('Erro ao deletar continente');
    }
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>Continentes</h1>
      </div>

      <form onSubmit={handleSubmit} className="crud-form">
        <div className="input-group">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-salvar">
          {editId ? 'Atualizar' : 'Cadastrar'}
        </button>
        {editId && (
          <button 
            type="button" 
            onClick={() => { setEditId(null); setNome(''); setDescricao(''); }}
            className="btn-deletar"
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="crud-list">
        {continentes.map((continente) => (
          <div key={continente.id} className="crud-card">
            <h3>{continente.nome}</h3>
            <p>{continente.descricao}</p>
            <div className="crud-card-actions">
              <button onClick={() => handleEdit(continente)} className="btn-editar">Editar</button>
              <button onClick={() => handleDelete(continente.id)} className="btn-deletar">Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Continentes;