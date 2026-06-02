import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
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

const CidadeCard: React.FC<{ cidade: Cidade; onEdit: (c: Cidade) => void; onDelete: (id: string) => void }> = ({ cidade, onEdit, onDelete }) => {
  const [temperatura, setTemperatura] = useState<number | null>(null);

  useEffect(() => {
    axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${cidade.latitude}&longitude=${cidade.longitude}&current_weather=true`)
      .then(response => {
        setTemperatura(response.data.current_weather.temperature);
      })
      .catch(() => setTemperatura(null));
  }, [cidade.latitude, cidade.longitude]);

  return (
    <div className="crud-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3>{cidade.nome}</h3>
        {temperatura !== null && (
          <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            {temperatura}°C
          </span>
        )}
      </div>
      <p><strong>População:</strong> {cidade.populacao}</p>
      <p><strong>Lat/Long:</strong> {cidade.latitude.toFixed(2)}, {cidade.longitude.toFixed(2)}</p>
      <div className="crud-card-actions">
        <button onClick={() => onEdit(cidade)} className="btn-editar">Editar</button>
        <button onClick={() => onDelete(cidade.id)} className="btn-deletar">Deletar</button>
      </div>
    </div>
  );
};

const Cidades: React.FC = () => {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  
  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
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
      const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${nome}&count=1&language=pt&format=json`);

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        alert('Não foi possível encontrar as coordenadas para esta cidade. Tente ser mais específico.');
        return;
      }

      const lat = geoResponse.data.results[0].latitude;
      const lng = geoResponse.data.results[0].longitude;

      const payload = {
        nome,
        populacao: Number(populacao),
        latitude: lat,
        longitude: lng,
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
    setNome(''); setPopulacao(''); setPaisId(''); setEditId(null);
  };

  const handleEdit = (cidade: Cidade) => {
    setNome(cidade.nome); setPopulacao(cidade.populacao.toString()); setPaisId(cidade.paisId); setEditId(cidade.id);
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
          <CidadeCard key={cidade.id} cidade={cidade} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Cidades;