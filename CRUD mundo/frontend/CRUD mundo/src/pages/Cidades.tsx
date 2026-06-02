import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './styles/CRUD.css';

interface Pais {
  id: string;
  nome: string;
}

interface Cidade {
  id: string;
  nome: string;
  populacao: number;
  latitude: number;
  longitude: number;
  paisId: string;
}

const Cidades: React.FC = () => {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  
  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [paisId, setPaisId] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const resCidades = await api.get('/cidades');
      const resPaises = await api.get('/paises');
      setCidades(resCidades.data);
      setPaises(resPaises.data);
    } catch (error) {
      alert('Erro ao carregar os dados');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        nome, 
        populacao: Number(populacao), 
        latitude: Number(latitude), 
        longitude: Number(longitude), 
        paisId 
      };
      
      if (editId) {
        await api.put(`/cidades/${editId}`, payload);
      } else {
        await api.post('/cidades', payload);
      }
      
      limparFormulario();
      carregarDados();
    } catch (error) {
      alert('Erro ao salvar cidade');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setPopulacao('');
    setLatitude('');
    setLongitude('');
    setPaisId('');
    setEditId(null);
  };

  const handleEdit = (cidade: Cidade) => {
    setNome(cidade.nome);
    setPopulacao(cidade.populacao.toString());
    setLatitude(cidade.latitude.toString());
    setLongitude(cidade.longitude.toString());
    setPaisId(cidade.paisId);
    setEditId(cidade.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta cidade?')) return;
    try {
      await api.delete(`/cidades/${id}`);
      carregarDados();
    } catch (error) {
      alert('Erro ao deletar cidade');
    }
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>Cidades</h1>
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
          <label>Latitude</label>
          <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Longitude</label>
          <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>País</label>
          <select value={paisId} onChange={(e) => setPaisId(e.target.value)} required>
            <option value="" disabled>Selecione...</option>
            {paises.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-salvar">{editId ? 'Atualizar' : 'Cadastrar'}</button>
        {editId && <button type="button" onClick={limparFormulario} className="btn-deletar">Cancelar</button>}
      </form>

      <div className="crud-list">
        {cidades.map((cidade) => (
          <div key={cidade.id} className="crud-card">
            <h3>{cidade.nome}</h3>
            <p><strong>População:</strong> {cidade.populacao}</p>
            <p><strong>Lat/Long:</strong> {cidade.latitude}, {cidade.longitude}</p>
            <div className="crud-card-actions">
              <button onClick={() => handleEdit(cidade)} className="btn-editar">Editar</button>
              <button onClick={() => handleDelete(cidade.id)} className="btn-deletar">Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cidades;