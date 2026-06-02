import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './styles/CRUD.css';

interface Continente {
  id: string;
  nome: string;
}

interface Pais {
  id: string;
  nome: string;
  populacao: number;
  idiomaOficial: string;
  moeda: string;
  continenteId: string;
}

const Paises: React.FC = () => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [continentes, setContinentes] = useState<Continente[]>([]);
  
  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [idiomaOficial, setIdiomaOficial] = useState('');
  const [moeda, setMoeda] = useState('');
  const [continenteId, setContinenteId] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const resPaises = await api.get('/paises');
      const resContinentes = await api.get('/continentes');
      setPaises(resPaises.data);
      setContinentes(resContinentes.data);
    } catch (error) {
      alert('Erro ao carregar os dados');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { nome, populacao: Number(populacao), idiomaOficial, moeda, continenteId };
      
      if (editId) {
        await api.put(`/paises/${editId}`, payload);
      } else {
        await api.post('/paises', payload);
      }
      
      limparFormulario();
      carregarDados();
    } catch (error) {
      alert('Erro ao salvar país');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setPopulacao('');
    setIdiomaOficial('');
    setMoeda('');
    setContinenteId('');
    setEditId(null);
  };

  const handleEdit = (pais: Pais) => {
    setNome(pais.nome);
    setPopulacao(pais.populacao.toString());
    setIdiomaOficial(pais.idiomaOficial);
    setMoeda(pais.moeda);
    setContinenteId(pais.continenteId);
    setEditId(pais.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza? Todas as cidades vinculadas serão deletadas.')) return;
    try {
      await api.delete(`/paises/${id}`);
      carregarDados();
    } catch (error) {
      alert('Erro ao deletar país');
    }
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>Países</h1>
      </div>

      <form onSubmit={handleSubmit} className="crud-form">
        <div className="input-group">
          <label>Nome</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>População</label>
          <input type="number" value={populacao} onChange={(e) => setPopulacao(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Idioma Oficial</label>
          <input type="text" value={idiomaOficial} onChange={(e) => setIdiomaOficial(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Moeda</label>
          <input type="text" value={moeda} onChange={(e) => setMoeda(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Continente</label>
          <select value={continenteId} onChange={(e) => setContinenteId(e.target.value)} required>
            <option value="" disabled>Selecione...</option>
            {continentes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-salvar">{editId ? 'Atualizar' : 'Cadastrar'}</button>
        {editId && <button type="button" onClick={limparFormulario} className="btn-deletar">Cancelar</button>}
      </form>

      <div className="crud-list">
        {paises.map((pais) => (
          <div key={pais.id} className="crud-card">
            <h3>{pais.nome}</h3>
            <p><strong>População:</strong> {pais.populacao}</p>
            <p><strong>Idioma:</strong> {pais.idiomaOficial}</p>
            <p><strong>Moeda:</strong> {pais.moeda}</p>
            <div className="crud-card-actions">
              <button onClick={() => handleEdit(pais)} className="btn-editar">Editar</button>
              <button onClick={() => handleDelete(pais.id)} className="btn-deletar">Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Paises;